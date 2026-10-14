# New Project Setup

Run these steps in Bash from a new repository created from this template. Setup uses one pull request and one initial deployment; GitHub handles subsequent deployments.

## Prerequisites

- Bun at the version in `.bun-version`, and Node.js 22.12 or later.
- Git, GitHub CLI (`gh`), `jq`, Perl, and OpenSSL.
- Access to the GitHub repository and Cloudflare account.
- A configured [Cloudflare account subdomain](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), such as `my-account.workers.dev`.

## Prepare the Repository

Install dependencies, sign in, and confirm the repository:

```bash
bun install --frozen-lockfile
gh auth login
gh repo view --json nameWithOwner

gh repo edit \
  --default-branch main \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false \
  --delete-branch-on-merge

git switch main
git pull --ff-only
git switch -c chore/project-setup
```

Set `package.json`'s `name` to your project name: up to 63 lowercase letters, numbers, or hyphens, with no leading or trailing hyphen. It becomes the Worker and database name. For local development, follow [README.md](../README.md).

## Deploy to Cloudflare

Sign in and confirm the account:

```bash
bunx wrangler login
bunx wrangler whoami
```

If you have multiple accounts, export `CLOUDFLARE_ACCOUNT_ID` with the intended account ID before continuing.

Run this block once for the new project. At the prompt, enter only the account subdomain (`my-account` in the example above). It sets the production URL before building, creates the database, applies migrations, and deploys with a new auth secret.

```bash
(
set -euo pipefail
APP_NAME="$(jq -er '.name' package.json)"
read -rp 'Account subdomain (without .workers.dev): ' WORKERS_SUBDOMAIN
: "${WORKERS_SUBDOMAIN:?Account subdomain is required}"
PRODUCTION_URL="https://$APP_NAME.$WORKERS_SUBDOMAIN.workers.dev"
jq --arg name "$APP_NAME" --arg url "$PRODUCTION_URL" \
  '.name = $name | .vars.BETTER_AUTH_URL = $url' wrangler.json > wrangler.json.tmp
mv wrangler.json.tmp wrangler.json

bunx wrangler d1 create "$APP_NAME" --binding DB --update-config
bun run db:migrate --remote
bun run cf:generate

umask 077
BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
export BETTER_AUTH_SECRET
WORKER_SECRETS_FILE="$(mktemp worker-secrets.XXXXXX.local)"
trap 'rm -f "$WORKER_SECRETS_FILE"' EXIT
printf 'BETTER_AUTH_SECRET="%s"\n' "$BETTER_AUTH_SECRET" > "$WORKER_SECRETS_FILE"

bun run build
bun run cf:deploy --secrets-file "$WORKER_SECRETS_FILE"
)
```

The temporary secret file is ignored and removed on exit. [Later deployments preserve the Worker secret](https://developers.cloudflare.com/workers/configuration/secrets/#upload-secrets-alongside-code).

Open the deployed URL and confirm sign-up, sign-out, and sign-in work.

## Configure GitHub

Create a Cloudflare API token for the same account with **Workers Scripts Edit** and **D1 Edit** permissions. Create the `production` environment, then enter the token and account ID at the prompts:

```bash
gh api 'repos/{owner}/{repo}/environments/production' --method PUT --silent
gh secret set CLOUDFLARE_API_TOKEN --env production
gh secret set CLOUDFLARE_ACCOUNT_ID --env production
gh variable set PRODUCTION_URL --body "$(jq -er '.vars.BETTER_AUTH_URL' wrangler.json)"
```

`PRODUCTION_URL` must be a repository variable so browser and Lighthouse jobs can read it.

PR checks already run for pull requests to `main`. Enable deployment on pushes to `main`:

```bash
perl -i -0777 -pe 's/on:\n  workflow_dispatch:/on:\n  workflow_dispatch:\n  push:\n    branches: [main]/g' .github/workflows/deploy.yml
```

Install the ruleset once. If the repository already has it, update the existing ruleset instead:

```bash
gh api 'repos/{owner}/{repo}/rulesets' --method POST \
  --input .github/rulesets/protect-main.json --jq '.id'
```

## Merge and Verify

Review and commit the setup changes, then open the pull request:

```bash
git add package.json wrangler.json src/types/cloudflare-env.d.ts \
  .github/workflows/deploy.yml
git diff --cached
git commit -m "chore: ⚒️ configure project deployment"
git push --set-upstream origin HEAD
gh pr create --base main --fill
gh pr checks --watch --required
```

If checks have not appeared, wait for **Actions → PR Quality Checks** to start and rerun the last command. Once all required checks pass:

```bash
gh pr merge --squash
```

In **Actions → Deploy Production**, open the run for the setup merge and confirm deployment, all three browser jobs, and Lighthouse pass. Subsequent merges to `main` use the same workflow.
