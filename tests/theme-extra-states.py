"""Theme triage for overlays, self-check results, game feedback and narrow pages.
Run with tests/serve.py active; uses the same limitations as theme-audit.py.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse, hashlib, json

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=ROOT/'docs/THEME_QA_2026-11-12')
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
probe = (ROOT/'tests/theme-probe.js').read_text()
records = []
GOOD = [['b'], ['c'], ['a', 'b'], ['b'], ['c']]
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True,
                                args=['--no-sandbox', '--enable-unsafe-swiftshader'])
    for theme in ['light', 'dark']:
        for width in [320, 390, 1440]:
            context = browser.new_context(viewport={'width': width, 'height': 1000},
                                          color_scheme=theme, reduced_motion='reduce')
            context.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(content_type='text/css', body=''))
            page = context.new_page()
            def visit(route):
                page.goto('http://127.0.0.1:8788'+route)
                page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}')
            def capture(state):
                result = page.evaluate(probe)
                signature = hashlib.sha256(json.dumps(result.pop('signatures'), sort_keys=True).encode()).hexdigest()
                row = {'route': page.url.split(':8788')[1], 'theme': theme, 'width': width,
                       'state': state, 'signature': signature, **result}
                records.append(row)
                print(theme, width, row['route'], state, 'flags', len(row['failures']), flush=True)
            visit('/')
            if width < 1121:
                page.locator('#bg').click()
                capture('mobile navigation open')
                page.keyboard.press('Escape')
            page.locator('[data-search]').click()
            capture('search empty')
            page.locator('#q').fill('password')
            page.wait_for_selector('#sb a[href]')
            capture('search results')
            page.locator('#q').fill('zzznomatchingresults')
            page.wait_for_timeout(350)
            capture('search no results')
            page.keyboard.press('Escape')
            visit('/resources/security-checklist/')
            for answer in ['no', 'yes']:
                # Exercise complete plans for both highest and lowest scored answers.
                page.locator('#sc2-form input[type=radio]').evaluate_all('''(nodes, answer)=>{
                  const groups=Object.groupBy(nodes,n=>n.name);
                  for(const group of Object.values(groups)) {
                    group.find(n=>n.value===(answer==='no'?'not_yet':'in_place')).click();
                  }
                }''', answer)
                page.locator('#sc2-form button[type=submit]').click()
                page.locator('#sc2-result').wait_for(state='visible')
                capture('self-check '+answer+' result')
            visit('/learn/spot-the-scam/')
            page.wait_for_selector('[data-action="hub"]')
            capture('game welcome')
            page.locator('[data-action="hub"]').click()
            capture('game activity selector')
            page.locator('[data-intro="scam"]').click()
            capture('game instructions')
            page.locator('[data-action="start"]').click()
            for i, choices in enumerate(GOOD):
                capture('scam question '+str(i+1))
                for choice in choices: page.locator('[data-choice="'+choice+'"]').click()
                capture('scam selected '+str(i+1))
                page.locator('#submit').click()
                capture('scam feedback '+str(i+1))
                page.locator('[data-action="next"]').click()
            capture('scam results')
            visit('/learn/spot-the-scam/?activity=ransom')
            page.wait_for_selector('[data-action="start"]')
            page.locator('[data-action="start"]').click()
            page.locator('[data-choice="b"]').click()
            page.locator('#submit').click()
            capture('ransomware incorrect feedback')
            page.locator('[data-action="retry"]').click()
            for i, choice in enumerate(['a', 'b', 'a']):
                capture('ransomware question '+str(i+1))
                page.locator('[data-choice="'+choice+'"]').click()
                page.locator('#submit').click()
                capture('ransomware correct feedback '+str(i+1))
                page.locator('[data-action="next"]').click()
            capture('ransomware results')
            for route in ['/learn/mobile-security/', '/learn/business-wifi/', '/learn/social-media-security/', '/404.html']:
                visit(route)
                capture('narrow/default')
            context.close()
    browser.close()
(args.output/'extra-states.json').write_text(json.dumps(records, indent=2))
