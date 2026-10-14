# New Project Setup

Run these steps in Bash from a new repository created from this template.

## Prerequisites

- [Bun](https://bun.sh/) v1.4 or later.
- [Node.js](https://nodejs.org/) v22.12 or later.
- [jq](https://jqlang.org/).
- [OpenSSL](https://www.openssl.org/).
- [GitHub CLI](https://cli.github.com/) authenticated with `gh auth login`.
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) authenticated with `bunx wrangler login`.

## Prepare the Repository

> [!IMPORTANT]
> Set `name` in `package.json` to your new project's name before continuing. The deployment steps use this value to name the Cloudflare Worker and D1 database.

```bash
# Install the dependency versions recorded in the lockfile
bun install --frozen-lockfile

# Confirm which GitHub repository the following commands will update
gh repo view --json nameWithOwner

# Create the branch used for the setup pull request
git switch -c chore/project-setup

# Set main as the repository's default branch
gh repo edit --default-branch main

# Automatically delete branches after their pull requests are merged
gh repo edit --delete-branch-on-merge

# Allow only squash merges to keep one commit per pull request
gh repo edit --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false

# Create the Protect Main ruleset from the template's branch protection settings
gh api 'repos/{owner}/{repo}/rulesets' --method POST \
  --input .github/rulesets/protect-main.json --jq '.id'
```

## Deploy to Cloudflare

> [!IMPORTANT]
> If you have access to multiple Cloudflare accounts, export `CLOUDFLARE_ACCOUNT_ID` with the intended account's ID before running the deployment commands.

```bash
# Confirm Wrangler is authenticated and list the available Cloudflare accounts
bunx wrangler whoami

# Use the project name for the Worker and its deployment URL
APP_NAME="$(jq -er '.name' package.json)"

# Read the account's workers.dev subdomain and construct the deployment URL
read -rp "Account subdomain (without .workers.dev): " WORKERS_SUBDOMAIN
WORKERS_URL="https://$APP_NAME.$WORKERS_SUBDOMAIN.workers.dev"

# Save the Worker name and authentication URL together, preserving other settings
jq --arg name "$APP_NAME" --arg url "$WORKERS_URL" \
  '.name = $name | .vars.BETTER_AUTH_URL = $url' wrangler.json > wrangler.json.tmp \
  && mv wrangler.json.tmp wrangler.json
```

> [!TIP]
> Review `wrangler.json` before deploying. Check that `name` matches your project name and `vars.BETTER_AUTH_URL` matches the intended `workers.dev` URL.

```bash
# Use the same project name for the remote D1 database
APP_NAME="$(jq -er '.name' package.json)"

# Create the remote D1 database and save its DB binding in wrangler.json
bunx wrangler d1 create "$APP_NAME" --binding DB --update-config

# Format the project settings after updating the name, URL, and database binding
bun run lint:fix

# Generate the secret Better Auth uses to sign and encrypt authentication data
BETTER_AUTH_SECRET="$(openssl rand -base64 32)"

# Store the deployment secret outside the repository and remove the file on shell exit
ENV_FILE="$(mktemp "${TMPDIR:-/tmp}/worker-secrets.XXXXXX")"
trap 'rm -f "$ENV_FILE"' EXIT
printf 'BETTER_AUTH_SECRET="%s"\n' "$BETTER_AUTH_SECRET" > "$ENV_FILE"

# Regenerate TypeScript bindings from the updated Worker configuration
bun run cf:generate

# Apply the initial schema migrations to the remote D1 database
bun run db:migrate --remote

# Build the application and deploy it with the initial authentication secret
bun run build
bun run cf:deploy --secrets-file "$ENV_FILE"
```

## Configure GitHub

> [!IMPORTANT]
> Have a Cloudflare API token for deployment and the ID of the account you deployed to ready. The `gh secret set` commands below prompt for these values and save them as secrets in the GitHub `production` environment.

```bash
# List account IDs so you can use the deployment account at the secret prompt below
bunx wrangler whoami

# Create the GitHub environment used by the production deployment workflow
gh api 'repos/{owner}/{repo}/environments/production' --method PUT --silent

# Enter the deployment API token and account ID as production environment secrets
gh secret set CLOUDFLARE_API_TOKEN --env production
gh secret set CLOUDFLARE_ACCOUNT_ID --env production

# Save the deployed URL as a repository variable for browser and Lighthouse checks
gh variable set PRODUCTION_URL --body "$(jq -er '.vars.BETTER_AUTH_URL' wrangler.json)"
```

## Merge and Verify

> [!TIP]
> Review `git diff --cached` before committing to confirm the staged changes contain the intended project settings.

```bash
# Stage and review the project configuration and generated Worker types
git add package.json wrangler.json src/types/cloudflare-env.d.ts
git diff --cached

# Commit the reviewed setup changes
git commit -m "chore: ⚒️ configure project deployment"

# Push the current branch and open a pull request targeting main
git push --set-upstream origin HEAD
gh pr create --base main --fill

# Give required checks time to register, then wait for them to finish successfully
sleep 10
gh pr checks --watch --required

# Merge the pull request using the repository's squash merge policy
gh pr merge --squash
```

> [!IMPORTANT]
> After merging, open the deployed URL and check that sign-up, sign-out, and sign-in work.
