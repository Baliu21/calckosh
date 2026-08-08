#!/usr/bin/env python3
from pathlib import Path
import sys,re
if len(sys.argv)!=2 or not sys.argv[1].startswith(('http://','https://')):
    raise SystemExit('Usage: python configure_site.py https://your-public-site-url')
root=Path(__file__).parent
new=sys.argv[1].rstrip('/')
for p in list(root.glob('*.html'))+[root/'robots.txt',root/'sitemap.xml']:
    s=p.read_text(encoding='utf-8')
    s=re.sub(r'https://YOUR-DOMAIN\.example',new,s)
    p.write_text(s,encoding='utf-8')
print('Configured public URL:',new)
