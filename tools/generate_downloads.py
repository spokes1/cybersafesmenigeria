from pathlib import Path
import json,re,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,KeepTogether,HRFlowable
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
root=Path(__file__).resolve().parents[1]
handoff=root/'tools/content/approved/printables'
out=root/'public/downloads';out.mkdir(exist_ok=True,parents=True)
logo=root/'public/assets/logo/cybersafe-logo-white.png'
navy=colors.HexColor('#12304d');teal=colors.HexColor('#0f766e');muted=colors.HexColor('#566b80');line=colors.HexColor('#dcebed')
styles={
 'title':ParagraphStyle('ct',fontName='Helvetica-Bold',fontSize=19,leading=25,textColor=navy,spaceAfter=8),
 'intro':ParagraphStyle('ci',fontName='Helvetica',fontSize=10.2,leading=15,textColor=muted,spaceAfter=12),
 'h':ParagraphStyle('ch',fontName='Helvetica-Bold',fontSize=12,leading=17,textColor=navy,spaceBefore=12,spaceAfter=7),
 'body':ParagraphStyle('cb',fontName='Helvetica',fontSize=9.4,leading=14.8,textColor=navy,spaceAfter=8),
 'small':ParagraphStyle('cs',fontName='Helvetica',fontSize=8.2,leading=12,textColor=muted,spaceAfter=7),
 'table':ParagraphStyle('cta',fontName='Helvetica',fontSize=7,leading=10,textColor=navy),
}
def esc(s):
 s=html.escape(s).replace('₦','NGN ')
 s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
 s=re.sub(r'`([^`]+)`',r'<font color="#0f766e">\1</font>',s)
 return s
def brand(c,doc):
 w,h=A4
 c.saveState()
 c.setFillColor(navy);c.rect(0,h-34*mm,w,34*mm,stroke=0,fill=1)
 c.drawImage(ImageReader(str(logo)),15*mm,h-28*mm,width=20*mm,height=19*mm,preserveAspectRatio=True,mask='auto')
 c.setFont('Helvetica-Bold',13);c.setFillColor(colors.white);c.drawString(39*mm,h-18.5*mm,'CyberSafe SME Nigeria')
 c.setFont('Helvetica',7.5);c.drawString(39*mm,h-24*mm,'Practical cybersecurity guidance for Nigerian SMEs')
 c.setStrokeColor(line);c.line(15*mm,17*mm,w-15*mm,17*mm)
 c.setFillColor(muted);c.setFont('Helvetica',7);c.drawString(15*mm,12*mm,'Free educational resource  |  Keep completed forms private  |  cybersafesmenigeria.netlify.app')
 c.drawRightString(w-15*mm,12*mm,str(doc.page))
 c.restoreState()
def doc(name,story):
 SimpleDocTemplate(str(out/name),pagesize=A4,rightMargin=15*mm,leftMargin=15*mm,topMargin=44*mm,bottomMargin=24*mm,title=name.replace('-',' ').removesuffix('.pdf').title(),author='CyberSafe SME Nigeria').build(story,onFirstPage=brand,onLaterPages=brand)
def tab(rows):
 n=max(map(len,rows));avail=180*mm
 data=[]
 for r in rows:data.append([Paragraph(esc(x.strip()),styles['table']) for x in r]+['']*(n-len(r)))
 t=Table(data,colWidths=[avail/n]*n,repeatRows=1,hAlign='LEFT',rowHeights=[None]+[34]*(len(data)-1))
 t.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,line),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eaf3fb')),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
 return t
files=[
('02_PAYMENT_VERIFICATION_DESK_CARD.md','payment-verification-desk-card.pdf'),
('03_SUSPICIOUS_MESSAGE_STAFF_CARD.md','suspicious-message-staff-card.pdf'),
('04_INCIDENT_FIRST_HOUR_RECORD.md','first-hour-incident-record.pdf'),
('05_ACCESS_AND_DEVICE_REGISTER.md','account-device-access-register.pdf'),
('06_BACKUP_AND_RESTORE_TEST_LOG.md','backup-restore-test-log.pdf'),
]
for src,target in files:
 raw=(handoff/src).read_text().splitlines();story=[];first=True;i=0
 while i<len(raw):
  line0=raw[i].strip();i+=1
  if not line0 or line0.startswith('CyberSafe SME Nigeria | Free awareness'):continue
  if line0.startswith('|'):
   rows=[]
   while line0.startswith('|'):
    r=[c.strip() for c in line0.strip('|').split('|')]
    if not all(re.fullmatch('[- :]+',c) for c in r):rows.append(r)
    if i>=len(raw):break
    line0=raw[i].strip();i+=1
   if rows:story.append(Spacer(1,6));story.append(tab(rows));story.append(Spacer(1,6))
   i-=int(i<len(raw))
   continue
  if line0.startswith('# '):story.append(Paragraph(esc(line0[2:]),styles['title']))
  elif line0.startswith('## '):story.append(Paragraph(esc(line0[3:]),styles['h']))
  elif line0.startswith('### '):story.append(Paragraph(esc(line0[4:]),styles['h']))
  elif re.match(r'^\d+\. ',line0):story.append(Paragraph(esc(line0),styles['body']))
  else:story.append(Paragraph(esc(line0),styles['small'] if line0.startswith('Learn:') else styles['body']))
 doc(target,story)
# Canonical paper check, no manually maintained questions
q=json.loads((root/'tools/content/selfcheck-v2.json').read_text())['questions'];story=[Paragraph('Business Security Self-Check',styles['title']),Paragraph('15 questions across five areas. Choose one answer per item. This is a blank paper form, not a personalised online result or security audit.',styles['intro'])]
for gi,g in enumerate(dict.fromkeys(x['group'] for x in q)):
 story.append(Paragraph(f'{gi+1}. {esc(g)}',styles['h']))
 for x in [x for x in q if x['group']==g]:
  ans='[ ] In place    [ ] Partly in place    [ ] Not yet    [ ] Not sure'+('    [ ] Does not apply' if x['allow_na'] else '')
  story.append(KeepTogether([Paragraph('<b>'+x['id']+'. '+esc(x['statement'])+'</b>',styles['body']),Paragraph(esc(x['help']),styles['small']),Paragraph(esc(ans),styles['body']),Paragraph('Read: '+esc(x['article']),styles['small']),Spacer(1,8)]))
story.extend([Paragraph('My action plan',styles['h']),Paragraph('One thing to improve: _____________________________________________________',styles['body']),Paragraph('Person responsible: _________________________  By when: ______________________',styles['body']),Paragraph('Review date: ___________________________',styles['body']),Paragraph('Educational guidance only; no audit or security guarantee. Never enter passwords, PINs or verification codes.',styles['small'])])
doc('business-security-self-check-blank.pdf',story)
for x in sorted(out.glob('*.pdf')):
 from pypdf import PdfReader
 reader=PdfReader(str(x));texts=[page.extract_text() for page in reader.pages]
 print(x.name,'bytes',x.stat().st_size,'pages',len(texts),'brand',all('CyberSafe SME Nigeria' in t for t in texts),'textchars',sum(map(len,texts)))
