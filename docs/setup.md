# New Project Setup

Run these steps from the repository root after creating the GitHub repository and pushing the initial project commit to **main**.

Use Bash for the command blocks. Install the prerequisites in [README.md](../README.md), plus the [GitHub CLI](https://cli.github.com/), Git, Perl, and OpenSSL, then install the project dependencies:

```bash
bun install --frozen-lockfile
```

Your GitHub plan must support [rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) and [deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) for the repository's visibility. Private repositories require GitHub Pro, Team, or Enterprise for these features.

## GitHub Setup

Sign in with an account that has repository administration access.

```bash
gh auth login
gh auth status
gh repo view
```

Set **main** as the default branch, allow squash merges only, and delete source branches after merge.

```bash
gh repo edit \
  --default-branch main \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false \
  --delete-branch-on-merge
```

The ruleset in [.github/rulesets/protect-main.json](../.github/rulesets/protect-main.json) protects **main**, requires pull requests and the configured CI checks, blocks force pushes and branch deletion, and requires review conversations to be resolved.

```bash
GH_REPOSITORY="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"

RULESET_FILE=".github/rulesets/protect-main.json"

RULESET_ID="$(gh api "repos/$GH_REPOSITORY/rulesets" \
    --method POST \
    --input "$RULESET_FILE" \
    --jq '.id')"

gh ruleset view "$RULESET_ID"
```

Start work from an up-to-date **main**, then open and merge a pull request:

```bash
git switch main
git pull --ff-only
git switch -c chore/github-setup
perl -i -0777 -pe 's/on:\n  workflow_dispatch:/on:\n  workflow_dispatch:\n  pull_request:\n    branches: [main]/g' .github/workflows/pull-request.yml
git add .github/workflows/pull-request.yml
git commit -m "chore: ⚒️ enable pull request checks"
git push --set-upstream origin HEAD
gh pr create --base main
gh pr checks --watch
gh pr merge
```

## Cloudflare Setup

Start a branch for the project's Cloudflare configuration and deployment setup:

```bash
git switch main
git pull --ff-only
git switch -c feat/cloudflare-deploy
```

Choose a Worker name unique within your Cloudflare account, such as `my-app`. Edit `name` in [.config/wrangler.json](../.config/wrangler.json) to use that name before building or deploying.

Create a Cloudflare API token scoped to the target account with permission to create and deploy Workers and create and migrate D1 databases. See [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/) and [API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) for the current role names and scopes.

Create the ignored production environment file and generate the auth secret. This block refuses to overwrite an existing file; when resuming setup, edit the existing file and retain its secret.

```bash
(
set -euo pipefail
set -C
umask 077
BETTER_AUTH_SECRET="$(openssl rand -base64 32 | tr -d '\n')"
cat > .config/.env.production.local <<EOF
CLOUDFLARE_API_TOKEN=""
CLOUDFLARE_ACCOUNT_ID=""
PRODUCTION_URL=""
BETTER_AUTH_URL=""
BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET"
EOF
)
```

> [!IMPORTANT]
> Edit `.config/.env.production.local` and fill in `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `PRODUCTION_URL`, and `BETTER_AUTH_URL`. For the initial deployment, use the Worker's `https://<worker-name>.<account-subdomain>.workers.dev` origin for both URLs, without a trailing slash. Find your account's Workers subdomain in the Cloudflare dashboard. Keep the generated `BETTER_AUTH_SECRET`.

```bash
source .config/.env.production.local
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID
bun x wrangler whoami
```

Confirm that `whoami` shows the intended account. Create a remote D1 database, replacing `my-app-db` with your project's database name. The `--binding DB --update-config` options replace the placeholder `DB` entry and preserve its migration settings.

```bash
bun x wrangler d1 create my-app-db \
  --binding DB \
  --update-config \
  --config .config/wrangler.json

bun run cf:generate
```

Check that `.config/wrangler.json` contains the chosen Worker name and the new database's name and ID, and that `migrations_dir` and `migrations_pattern` are retained. The template's `starter-db` entry is a configuration placeholder; there is no database to delete.

## Setup Deployment

Create the GitHub `production` environment before adding its secrets and variables. Cloudflare credentials and `BETTER_AUTH_URL` belong to that environment. Store `PRODUCTION_URL` as a **repository variable** so the deployment, E2E, and Lighthouse jobs can all access it.

```bash
(
set -euo pipefail
source .config/.env.production.local
: "${CLOUDFLARE_API_TOKEN:?Fill in CLOUDFLARE_API_TOKEN}"
: "${CLOUDFLARE_ACCOUNT_ID:?Fill in CLOUDFLARE_ACCOUNT_ID}"
: "${PRODUCTION_URL:?Fill in PRODUCTION_URL}"
: "${BETTER_AUTH_URL:?Fill in BETTER_AUTH_URL}"
GH_REPOSITORY="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
gh api "repos/$GH_REPOSITORY/environments/production" --method PUT
printf '%s' "$CLOUDFLARE_API_TOKEN" | gh secret set CLOUDFLARE_API_TOKEN --env production
printf '%s' "$CLOUDFLARE_ACCOUNT_ID" | gh secret set CLOUDFLARE_ACCOUNT_ID --env production
gh variable set PRODUCTION_URL --body "$PRODUCTION_URL"
gh variable set BETTER_AUTH_URL --env production --body "$BETTER_AUTH_URL"
)
```

### First Production Deployment

Bootstrap the Worker locally before enabling automatic deployment. These commands apply migrations to the remote production database, build the app, and deploy it with `BETTER_AUTH_SECRET`. Wrangler's `--var` passes the production auth URL to the Worker.

The temporary ignored file contains only the Worker auth secret and is removed when the block exits. Cloudflare API credentials stay in the tooling environment. Later GitHub deployments preserve the secret already stored on the Worker.

```bash
(
set -euo pipefail
source .config/.env.production.local
: "${CLOUDFLARE_API_TOKEN:?Fill in CLOUDFLARE_API_TOKEN}"
: "${CLOUDFLARE_ACCOUNT_ID:?Fill in CLOUDFLARE_ACCOUNT_ID}"
: "${BETTER_AUTH_URL:?Fill in BETTER_AUTH_URL}"
: "${BETTER_AUTH_SECRET:?Generate BETTER_AUTH_SECRET}"
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID BETTER_AUTH_SECRET

umask 077
WORKER_SECRETS_FILE="$(mktemp .config/worker-secrets.XXXXXX.local)"
trap 'rm -f "$WORKER_SECRETS_FILE"' EXIT
printf 'BETTER_AUTH_SECRET="%s"\n' "$BETTER_AUTH_SECRET" > "$WORKER_SECRETS_FILE"

bun run db:migrate --remote
bun run build
bun run cf:deploy \
  --var "BETTER_AUTH_URL:$BETTER_AUTH_URL" \
  --secrets-file "$WORKER_SECRETS_FILE"
)
```

Confirm that the deployed URL matches `PRODUCTION_URL` and that sign-up and sign-in work. If deployment fails, resolve it before continuing.

### Enable Automatic Deployment

On the same `feat/cloudflare-deploy` branch, enable deployment on pushes to **main**. Include the provisioned database configuration and generated types in the pull request so GitHub deploys the same Worker and database as the first local deployment.

```bash
perl -i -0777 -pe 's/on:\n  workflow_dispatch:/on:\n  workflow_dispatch:\n  push:\n    branches: [main]/g' .github/workflows/deploy.yml
git add .config/wrangler.json src/types/cloudflare-env.d.ts .github/workflows/deploy.yml
git diff --cached
git commit -m "build: 🚀 configure cloudflare deployment"
git push --set-upstream origin HEAD
gh pr create --base main
gh pr checks --watch
gh pr merge
```

Merging the PR starts the production deployment workflow. Check **Actions → Deploy Production** for the deployment, browser test, and Lighthouse results.

## References

- [Wrangler local environment variables and secrets](https://developers.cloudflare.com/workers/local-development/environment-variables/)
- [Wrangler deploy command and --var](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Worker secrets and --secrets-file](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Workers subdomains and URLs](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [D1 Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/d1/)
- [Cloudflare API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)
- [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/)
- [GitHub deployment environment API](https://docs.github.com/en/rest/deployments/environments#create-or-update-an-environment)
- [GitHub environment secrets and variables](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub CLI: repository settings](https://cli.github.com/manual/gh_repo_edit)
- [GitHub CLI: API requests](https://cli.github.com/manual/gh_api)
- [GitHub CLI: rulesets](https://cli.github.com/manual/gh_ruleset)
- [GitHub CLI: setting secrets](https://cli.github.com/manual/gh_secret_set)
- [GitHub CLI: setting variables](https://cli.github.com/manual/gh_variable_set)
- [GitHub CLI: running a workflow](https://cli.github.com/manual/gh_workflow_run)
- [GitHub required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
