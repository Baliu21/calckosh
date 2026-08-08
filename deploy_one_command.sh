#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REPO="${1:-calcbharat}"

command -v gh >/dev/null 2>&1 || { echo "GitHub CLI missing. Install with: pkg install gh git -y"; exit 2; }
command -v git >/dev/null 2>&1 || { echo "git missing. Install with: pkg install git -y"; exit 2; }
gh auth status >/dev/null 2>&1 || { echo "GitHub is not authenticated. Run: gh auth login"; exit 3; }

OWNER="$(gh api user --jq .login)"
PUBLIC="https://${OWNER}.github.io/${REPO}"

echo "GitHub owner : $OWNER"
echo "Repository   : $REPO"
echo "Public URL   : $PUBLIC"

python configure_site.py "$PUBLIC"
touch .nojekyll

if [ ! -d .git ]; then git init; fi
git config user.name "${OWNER}"
git config user.email "${OWNER}@users.noreply.github.com"
git add .
if ! git diff --cached --quiet; then git commit -m "Deploy CalcBharat v3"; fi
git branch -M main

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "https://github.com/$OWNER/$REPO.git"
  else
    git remote add origin "https://github.com/$OWNER/$REPO.git"
  fi
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push --description "Free mobile-first money and everyday calculators"
fi

PAYLOAD='{"source":{"branch":"main","path":"/"}}'
if gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  printf '%s' "$PAYLOAD" | gh api --method PUT "repos/$OWNER/$REPO/pages" --input - >/dev/null
else
  printf '%s' "$PAYLOAD" | gh api --method POST "repos/$OWNER/$REPO/pages" --input - >/dev/null
fi

echo
echo "DEPLOYMENT_CONFIGURED"
echo "$PUBLIC"
echo "GitHub Pages may need a short build cycle before the URL responds."
