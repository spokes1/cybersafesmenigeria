"""Fail a release if any whole-site theme or notice-deadline check remains open."""
from pathlib import Path
import argparse,json
p=argparse.ArgumentParser();p.add_argument('directory',type=Path);a=p.parse_args();d=a.directory
rows=json.loads((d/'final-consistency.json').read_text());extra=json.loads((d/'extra-states.json').read_text());notices=json.loads((d/'notice-deadline.json').read_text());before=json.loads((d/'baseline.json').read_text());after=json.loads((d/'final-defaults.json').read_text())
expected=sorted('/'+str(f.relative_to(Path(__file__).resolve().parents[1]/'public').parent) if f.parent!=Path(__file__).resolve().parents[1]/'public' else '/' for f in (Path(__file__).resolve().parents[1]/'public').rglob('index.html'))
assert sorted({r['route'] for r in rows})==expected
flags={kind:sum(len(r[kind]) for r in rows) for kind in ['surfaces','icons','failures']};flags['overflow']=sum(r['overflow'] for r in rows)
assert all(value==0 for value in flags.values()),flags
assert all(not r['failures'] and not r['overflow'] for r in extra)
old={(r['route'],r['width']):r['signature'] for r in before if r['theme']=='light'}
light=[r for r in after if r['theme']=='light'];changed=[(r['route'],r['width']) for r in light if r['signature']!=old[(r['route'],r['width'])]]
assert not changed,changed
assert len(notices)==15 and all(r.get('passed',r.get('opensAtScheduledDeadline')) for r in notices)
summary={'pages':len(expected),'themes':['light','dark'],'widths':[390,1440],'consistencyCaptures':len(rows),'extraGameAndOverlayCaptures':len(extra),'totalThemeCaptures':len(rows)+len(extra),'flags':flags,'lightTextStyleComparisons':len(light),'lightTextStylesUnchanged':len(light),'noticeDeadlineCases':len(notices),'noticeDelayMs':10000,'limits':['Linux Chromium with virtual mobile viewports, not physical iOS/Android or other engines.','Local browser tests use fallback fonts because of environment Google Fonts certificate trust.','Computed contrast checks are triage, not a full WCAG certification.','Dark-surface and SVG checks exclude approved game evidence mockups, raster photos/artwork and print-only output. Game text, state flows and WebGL load are checked separately.','Before/after text-style fingerprints do not claim pixel-identical rendering; the logo and icon colours intentionally change in both themes.','Notice deadlines use browser virtual time; visibility and history suspension are dispatched test events. Busy interactions defer notices.']}
(d/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
