"""Fail on theme regressions and compare the light default states to the baseline."""
from pathlib import Path
from collections import Counter
import argparse, json

parser = argparse.ArgumentParser()
parser.add_argument('directory', type=Path)
args = parser.parse_args()
baseline = json.loads((args.directory/'baseline.json').read_text())
final = json.loads((args.directory/'final.json').read_text())
extra = json.loads((args.directory/'extra-states.json').read_text())
all_final = final+extra
flags = sum(len(row['failures']) for row in all_final)
overflow = sum(row['overflow'] for row in all_final)
assert flags == 0, f'{flags} contrast flags remain; inspect final.json/extra-states.json'
assert overflow == 0, f'{overflow} states have root horizontal overflow'
assert len(set(row['route'] for row in final)) == 40
assert set((row['theme'], row['width']) for row in final) == {
    ('light', 390), ('dark', 390), ('light', 1440), ('dark', 1440)}
before = {(r['route'], r['width']): r['signature'] for r in baseline
          if r['theme'] == 'light' and r['state'] == 'default'}
light = [r for r in final if r['theme'] == 'light' and r['state'] == 'default']
changed = [r for r in light if before[(r['route'], r['width'])] != r['signature']]
allowed = {'/protect-your-business/device-security',
           '/protect-your-business/incident-response', '/threats/ransomware'}
assert set(r['route'] for r in changed) <= allowed, 'Unexpected light default style changes'
summary = {
    'routes': 40, 'main_states': len(final), 'extra_states': len(extra),
    'all_states': len(all_final), 'contrast_flags': flags, 'root_overflow_flags': overflow,
    'baseline_flags_by_theme': dict(Counter(r['theme'] for r in baseline for _ in r['failures'])),
    'light_default_comparisons': len(light), 'light_defaults_identical': len(light)-len(changed),
    'light_default_changes': [{'route': r['route'], 'width': r['width']} for r in changed],
    'limits': [
        'Computed text contrast triage is not a full WCAG audit or certification.',
        'Raster backgrounds, gradient-clipped type, shadow DOM and decorative icons require separate visual review.',
        'Chromium on Linux; mobile viewport checks do not replace physical Android/iOS tests.',
        'Google Fonts CSS is replaced by an empty response in local QA due environment certificate trust; production font links are unchanged.'
    ]
}
(args.directory/'summary.json').write_text(json.dumps(summary, indent=2)+'\n')
print(json.dumps(summary, indent=2))
