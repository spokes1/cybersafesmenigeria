"""Local QA server applying the repository's Netlify security headers and redirects."""
import http.server,tomllib,pathlib,os
ROOT=pathlib.Path(__file__).resolve().parents[1]
CONFIG=tomllib.loads((ROOT/'netlify.toml').read_text())
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*args,**kw):super().__init__(*args,directory=str(ROOT/'public'),**kw)
 def end_headers(self):
  for key,value in CONFIG['headers'][0]['values'].items():self.send_header(key,value)
  super().end_headers()
 def do_GET(self):
  for row in CONFIG['redirects']:
   if self.path.split('?')[0]==row['from']:
    self.send_response(row['status']);self.send_header('Location',row['to']);self.end_headers();return
  super().do_GET()
 def log_message(self,*args):pass
http.server.ThreadingHTTPServer(('127.0.0.1',8788),Handler).serve_forever()
