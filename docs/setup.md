# New Project Setup

## Prerequisites

- jq command line tool

> [!IMPORTANT]
> Decide on a new, unique name for this project.
> Set this in the `name` fields within `package.json`.

```bash
# Install project dependencies
bun install --frozen-lockfile
```

## GitHub Setup

> [!IMPORTANT]
> Complete the interactive sign-in when prompted by `gh auth login`.  
> Confirm that `gh repo view` identifies the new repository.

```bash
# Set main as the default branch, only allow squash merges, and delete source branches after merge.
gh repo edit \
  --default-branch main \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false \
  --delete-branch-on-merge
```

The ruleset in `.github/rulesets/protect-main.json` protects **main**, requiring pull requests and the configured CI checks, blocking force pushes and branch deletion, and requiring review conversations to be resolved.

```bash
GH_REPOSITORY="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
RULESET_FILE=".github/rulesets/protect-main.json"
RULESET_ID="$(gh api "repos/$GH_REPOSITORY/rulesets" \
    --method POST \
    --input "$RULESET_FILE" \
    --jq '.id')"

gh ruleset view "$RULESET_ID"
```

```bash
# Create a new branch
git switch main
git pull --ff-only
git switch -c chore/github-setup

# Apply workflow changes
perl -i -0777 -pe 's/on:\n  workflow_dispatch:/on:\n  workflow_dispatch:\n  pull_request:\n    branches: [main]/g' .github/workflows/pull-request.yml
git add .github/workflows/pull-request.yml
git commit -m "chore: ⚒️ enable pull request checks"

# Create a pull request
git push --set-upstream origin HEAD
gh pr create --base main --fill

# Ensure CI checks pass and merge
gh pr checks --watch
gh pr merge --squash
```

## Cloudflare Setup

> [!IMPORTANT]
> Complete the interactive sign-in when prompted by `bunx wrangler login`.  
> Confirm that `bunx wrangler whoami` identifies the account.

```bash
git switch main
git pull --ff-only
git switch -c feat/cloudflare-deploy
```

```bash
# Create the D1 database and update the config
APP_NAME="$(jq -r '.name' package.json)"
bun x wrangler d1 create $APP_NAME \
  --binding DB \
  --update-config
bun run cf:generate

git add wrangler.json src/types/cloudflare-env.d.ts
git commit -m "chore: 📦 update wranger config with new D1 binding"
```

```bash
# Generate Better Auth secret
BETTER_AUTH_SECRET="$(openssl rand -base64 32 | tr -d '\n')"
echo $BETTER_AUTH_SECRET | bunx wrangler secret put BETTER_AUTH_SECRET

bun run build
WORKERS_DEV_URL="$(bun run cf:deploy |  rg -o 'https://[^[:space:]]+\.workers\.dev' | tail -n 1)"
perl -0pi -e 's{("BETTER_AUTH_URL"\s*:\s*")https://your-app\.example\.com(")}{$1 . $ENV{WORKERS_DEV_URL} . $2}e' wrangler.json

bun run cf:deploy
```

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

> [!IMPORTANT]
> Confirm that the deployed URL matches `PRODUCTION_URL` and that sign-up and sign-in work. If deployment fails, resolve it before continuing.

### Enable Automatic Deployment

On the same `feat/cloudflare-deploy` branch, enable deployment on pushes to **main**. Include the provisioned database configuration and generated types in the pull request so GitHub deploys the same Worker and database as the first local deployment.

```bash
perl -i -0777 -pe 's/on:\n  workflow_dispatch:/on:\n  workflow_dispatch:\n  push:\n    branches: [main]/g' .github/workflows/deploy.yml
git add wrangler.json src/types/cloudflare-env.d.ts .github/workflows/deploy.yml
git diff --cached
git commit -m "build: 🚀 configure cloudflare deployment"
git push --set-upstream origin HEAD
gh pr create --base main --fill
gh pr checks --watch
gh pr merge --squash
```

Merging this PR installs the push trigger on **main**. Since the trigger is first added by this merge, verify it with a subsequent PR merge.

### Verify the Merge Trigger with a Third PR

Open a documentation-only PR after the Cloudflare setup PR is merged. Use a small, useful documentation change so the merge is safe to deploy. This third PR checks that a later merge to **main** starts the production workflow automatically.

```bash
git switch main
git pull --ff-only
git switch -c test/verify-deploy-trigger

# Make a small documentation-only change, then stage it.
git add docs/setup.md
git diff --cached
git commit -m "docs: 📝 verify automatic deployment trigger"
git push --set-upstream origin HEAD
gh pr create --base main --fill
gh pr checks --watch
gh pr merge --squash
```

After the merge, find and monitor the run for the merged **main** commit:

```bash
gh run list --workflow .github/workflows/deploy.yml --branch main --limit 5
gh run watch <run-id>
```

Confirm the deployment, browser tests, and Lighthouse checks pass. The production workflow applies any pending D1 migrations and deploys the Worker, so use a real documentation-only change for this check.

> [!IMPORTANT]
> If no run appears for the third PR's merge commit, check **Actions → Deploy Production** and verify that the workflow is active and its `push` trigger includes **main**.

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
