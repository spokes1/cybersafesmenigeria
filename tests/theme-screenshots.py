"""Representative theme review images; run with tests/serve.py active."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
items = {
    '/learn/mobile-security': ['.ms-quick-setup', '.ms-lost-flow', '.ms-table-wrap', '.ms-related-section'],
    '/learn/business-wifi': ['.rule'],
    '/learn/social-media-security': ['.sm-platform-overview', '.sm-table-wrap', '.sm-dual-diagram', '.sm-official-grid']
}
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    for theme, width in [('light', 1440), ('dark', 1440), ('dark', 390)]:
        context = browser.new_context(viewport={'width': width, 'height': 1000}, color_scheme=theme, reduced_motion='reduce')
        context.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(content_type='text/css', body=''))
        page = context.new_page()
        def visit(route):
            page.goto('http://127.0.0.1:8788'+route)
            # Reveal scroll sections, suppress the timed companion and prevent the
            # sticky header from obscuring cropped section images. QA styles only.
            page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}kenny-companion{display:none!important}header.top{position:static!important}*{animation:none!important;transition:none!important}')
        for route, selectors in items.items():
            visit(route)
            for selector in selectors:
                page.locator(selector).first.screenshot(path=str(args.output/(route.split('/')[-1]+'-'+selector.replace('.', '')+'-'+theme+'-'+str(width)+'.png')))
        visit('/threats/business-email-compromise')
        for choice in ['risk', 'verify']:
            page.locator('[data-bec-choice="'+choice+'"]').click()
            page.locator('.bec-decision').screenshot(path=str(args.output/('business-email-'+choice+'-'+theme+'-'+str(width)+'.png')))
        visit('/')
        page.locator('[data-search]').click()
        page.locator('#q').fill('password')
        page.wait_for_selector('#sb a[href]')
        page.locator('.sd').screenshot(path=str(args.output/('search-'+theme+'-'+str(width)+'.png')))
        context.close()
    browser.close()
print('Section screenshots saved.')
