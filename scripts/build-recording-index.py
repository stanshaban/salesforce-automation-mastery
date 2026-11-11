"""A local, searchable-by-browser recording desk with no external dependencies."""
import html
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'instructor/recording'
rows = json.loads((root / 'index.json').read_text())
order = {'00 — About': 0, 'junior': 1, 'middle': 2, 'senior': 3, 'agentforce': 4, 'jobs': 5}
rows.sort(key=lambda x: (order[x['track']], '00' if x['id'].endswith('00') else '01' if x['id'] == 'AF-L01' else 'zz' if x['id'] == 'AF-Check' else x['id']))
sections = []
for track in order:
    cards = []
    for row in rows:
        if row['track'] != track:
            continue
        file = row['file']
        script = json.loads((root / file).read_text())
        body = ''.join('<h3>' + html.escape(c['label']) + '</h3>' + ''.join(('<aside>🎬 ' + html.escape(b['text']) + '</aside>' if b['type'] == 'action' else '<p>' + html.escape(b['text']) + '</p>') for b in c['blocks']) for c in script['cues'])
        cards.append('<details><summary>' + html.escape(row['id'] + ' · ' + row['title']) + '</summary><nav><a href="' + html.escape(file) + '" download>CameraCue JSON ↓</a> · <a href="' + html.escape(file.replace('.scenario.json', '.md')) + '">Readable script</a>' + (' · <a href="' + html.escape(row['url']) + '">Skool lesson ↗</a>' if row.get('url') else '') + '</nav>' + body + '</details>')
    sections.append('<section><h2>' + html.escape('About' if track == '00 — About' else track.title()) + '</h2>' + ''.join(cards) + '</section>')
(root / 'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAM recording desk</title><style>body{font:18px/1.65 system-ui;color:#12253c;background:#f7f4ee;max-width:1050px;padding:40px;margin:auto}h1{font-size:42px}h2{margin-top:48px}details{background:white;border:1px solid #dce2e8;border-radius:12px;margin:10px 0;padding:18px 24px}summary{cursor:pointer;font-weight:650}aside{background:#f4f0e5;border-left:4px solid #138a86;padding:16px;margin:20px 0;font-size:15px}p{max-width:72ch}a{color:#3867e8}nav{padding-top:12px;font-size:15px}</style><header><p>SAM / INSTRUCTOR RECORDING DESK</p><h1>Ready to record</h1><p>116 scripts. English narration, Russian action cues. Open a lesson to read it or download its CameraCue v2 JSON. Timing includes screen work; pause for longer builds.</p><p><a href="README.md">Recording instructions and complete file list</a></p></header>''' + ''.join(sections) + '</html>')
