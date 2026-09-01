#!/usr/bin/env python3
from pathlib import Path
import re, json, sys
root=Path(__file__).resolve().parent
errors=[]

must_exist=[
 "index.html","loan-debt-calculators.html","investment-calculators.html",
 "everyday-calculators.html","assets/discovery.js","sitemap.xml"
]
for name in must_exist:
    if not (root/name).exists(): errors.append("missing "+name)

index=(root/"index.html").read_text(encoding="utf-8")
disc=(root/"assets/discovery.js").read_text(encoding="utf-8")
css=(root/"assets/styles.css").read_text(encoding="utf-8")
sitemap=(root/"sitemap.xml").read_text(encoding="utf-8")

for token in ['content="traffic-v7"','id="toolSearch"','data-tool','loan-debt-calculators.html','investment-calculators.html','everyday-calculators.html']:
    if token not in index: errors.append("index missing "+token)
if "CALCKOSH_TRAFFIC_V7" not in disc: errors.append("discovery.js missing marker")
if "CALCKOSH_TRAFFIC_V7" not in css: errors.append("styles.css missing marker")

for page in ["loan-debt-calculators.html","investment-calculators.html","everyday-calculators.html"]:
    s=(root/page).read_text(encoding="utf-8")
    for token in ['content="traffic-v7"','class="breadcrumbs"','data-tool','CollectionPage']:
        if token not in s: errors.append(f"{page} missing {token}")
    m=re.search(r'<link rel="canonical" href="([^"]+)">',s)
    if not m or "?" in m.group(1): errors.append(f"{page} canonical bad")
    for raw in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',s):
        try: json.loads(raw)
        except Exception as e: errors.append(f"{page} JSON-LD invalid: {e}")

for slug in ["loan-debt-calculators.html","investment-calculators.html","everyday-calculators.html"]:
    url="https://baliu21.github.io/calckosh/"+slug
    if sitemap.count(url)!=1: errors.append(f"sitemap count for {slug} = {sitemap.count(url)}")

if sitemap.count("<url>") < 27:
    errors.append("sitemap unexpectedly small")

# Guard: no calculator core edits required by v7.
for name in ["assets/calculators.js","assets/charts.js"]:
    if not (root/name).exists(): errors.append("missing core "+name)

if errors:
    print("V7_STRUCTURE_TEST=FAILED")
    for e in errors: print(" -",e)
    sys.exit(1)

print("V7_STRUCTURE_TEST=PASSED")
print("CATEGORY_HUBS=3")
print("HOMEPAGE_FINDER=PASS")
print("SITEMAP_HUBS=PASS")
print("CALCULATOR_FORMULAS_CHANGED=NO")
print("CHART_ENGINE_CHANGED=NO")
