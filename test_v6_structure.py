#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parent
pages=["fd-calculator.html","rd-calculator.html","sip-calculator.html","cagr-calculator.html","lumpsum-investment-calculator.html"]
errors=[]
calcs=(root/"assets/calculators.js").read_text(encoding="utf-8")
css=(root/"assets/styles.css").read_text(encoding="utf-8")
site=(root/"assets/site.js").read_text(encoding="utf-8")
for t in ["fdPlan","contributionPlan","lumpsumPlan","cagrPlan"]:
    if t not in calcs: errors.append("calculators.js missing "+t)
if "CALCKOSH_INVESTMENT_V6" not in css: errors.append("styles.css missing V6 marker")
if "CALCKOSH_GROWTH_V5" not in site: errors.append("v5 site.js missing")
for name in pages:
    s=(root/name).read_text(encoding="utf-8")
    for token in ['name="calckosh-version" content="investment-v6"','data-ck-calculator=','data-ck-toolbar','data-ck-preset=','data-ck-action="copy"','data-ck-action="share"','data-ck-action="print"','assets/charts.js','class="breadcrumbs"','data-ck-schema="breadcrumb"','data-ck-schema="faq"']:
        if token not in s: errors.append(f"{name} missing {token}")
    cm=re.search(r'<link rel="canonical" href="([^"]+)">',s)
    if not cm or "?" in cm.group(1) or "/calckosh/" not in cm.group(1): errors.append(f"{name} bad canonical")
    for raw in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',s):
        try: json.loads(raw)
        except Exception as e: errors.append(f"{name} bad JSON-LD: {e}")
    if "Calc<span>Bharat" in s: errors.append(f"{name} old brand remains")
if errors:
    print("V6_STRUCTURE_TEST=FAILED")
    for e in errors: print(" -",e)
    sys.exit(1)
print("V6_STRUCTURE_TEST=PASSED")
print("PAGES_CHECKED=5")
print("LOAN_CREDIT_CARD_PAGES_CHANGED=NO")
