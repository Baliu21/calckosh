# CalcKosh Zero-Brainer v3

Static, mobile-first calculator website. Engineering tools are intentionally NOT included.

## Included
- 19 working calculator pages
- Money/loan and everyday categories
- SEO titles, descriptions, canonicals, sitemap, robots.txt
- About, privacy, disclaimer and terms
- Browser-only JavaScript calculation engine
- No login, database or backend
- GitHub Pages deployment helper

## Test in Termux
```bash
cd calckosh-zero-brainer-v3
node test_calculators.js
python -m http.server 8080
```
Open http://127.0.0.1:8080

## Before public launch
1. Add a real contact method on About/Privacy pages.
2. Create a GitHub repository.
3. Deploy with:
```bash
./deploy_github_pages.sh https://github.com/USER/calckosh.git https://USER.github.io/calckosh
```
4. Enable GitHub Pages from `main` / root in repository Settings > Pages.
5. When a custom domain is purchased, rerun `configure_site.py` on a fresh copy or replace the old public URL in HTML/sitemap/robots.
6. Connect Google Search Console after the public URL works.
7. Apply for advertising only after real indexing/content/traffic; do not add ad scripts pre-approval.

## Important
The legal pages are starter text, not jurisdiction-specific legal advice. Finance tools contain explicit model assumptions and should not be presented as bank quotations.
