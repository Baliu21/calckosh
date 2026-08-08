#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
if [ $# -lt 2 ]; then
  echo "Usage: ./deploy_github_pages.sh <github-repo-https-url> <public-site-url>"
  echo "Example: ./deploy_github_pages.sh https://github.com/USER/calcbharat.git https://USER.github.io/calcbharat"
  exit 1
fi
REPO="$1"; PUBLIC="$2"
python configure_site.py "$PUBLIC"
git init
git add .
git -c user.name="CalcBharat Deploy" -c user.email="deploy@localhost" commit -m "Deploy CalcBharat v3" || true
git branch -M main
if git remote get-url origin >/dev/null 2>&1; then git remote set-url origin "$REPO"; else git remote add origin "$REPO"; fi
git push -u origin main
cat <<EOF
Code pushed.
Now in GitHub: Repository > Settings > Pages > Build and deployment > Deploy from a branch > main / root > Save.
Public target: $PUBLIC
EOF
