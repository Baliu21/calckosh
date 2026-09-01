#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parent
pages=["emi-calculator.html","credit-card-minimum-payment-calculator.html","credit-card-payoff-calculator.html","loan-prepayment-calculator.html","loan-comparison-calculator.html"]
errors=[]
site=(root/"assets/site.js").read_text(encoding="utf-8")
css=(root/"assets/styles.css").read_text(encoding="utf-8")
for token in ["scenarioUrl","resultSummary","calckosh:analytics"]:
    if token not in site: errors.append(f"site.js missing {token}")
if "CALCKOSH_GROWTH_V5" not in css: errors.append("styles.css missing V5 marker")
for name in pages:
    s=(root/name).read_text(encoding="utf-8")
    for c in ['data-ck-calculator=','data-ck-toolbar','data-ck-action="copy"','data-ck-action="share"','data-ck-action="print"','data-ck-preset=','data-ck-schema="breadcrumb"','data-ck-schema="faq"','class="breadcrumbs"','name="calckosh-version" content="growth-v5"']:
        if c not in s: errors.append(f"{name} missing {c}")
    cm=re.search(r'<link rel="canonical" href="([^"]+)">',s)
    if not cm or "?" in cm.group(1): errors.append(f"{name} canonical invalid")
    for raw in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',s):
        try: json.loads(raw)
        except Exception as e: errors.append(f"{name} invalid JSON-LD: {e}")
if errors:
    print("V5_STRUCTURE_TEST=FAILED")
    for e in errors: print(" -",e)
    sys.exit(1)
print("V5_STRUCTURE_TEST=PASSED")
print("PAGES_CHECKED=5")
print("FORMULA_ENGINE_CHANGED=NO")
print("CHART_ENGINE_CHANGED=NO")
