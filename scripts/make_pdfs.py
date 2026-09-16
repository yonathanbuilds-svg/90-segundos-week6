from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak,
    Image, KeepTogether, Table, TableStyle
)

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#07151f")
DEEP = colors.HexColor("#0f2a38")
CYAN = colors.HexColor("#1f9f91")
AMBER = colors.HexColor("#d28a00")
INK = colors.HexColor("#17242b")
MUTED = colors.HexColor("#536a73")
PALE = colors.HexColor("#eef5f4")
LINE = colors.HexColor("#cbdcdd")


def clean(text):
    return (text.replace("\u2014", " - ").replace("\u2013", "-")
            .replace("\u2011", "-").replace("\u00a0", " ")
            .replace("\u201c", '"').replace("\u201d", '"')
            .replace("\u2018", "'").replace("\u2019", "'"))


def inline(text):
    text = clean(text.strip())
    text = re.sub(r"!\[([^]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^]]+)\]\(([^)]+)\)", r'<a href="\2" color="#1f746d">\1</a>', text)
    text = re.sub(r"`([^`]+)`", r'<font name="Courier" color="#9b6500">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


def styles(compact=False):
    base = getSampleStyleSheet()
    body_size = 8.6 if compact else 9.5
    leading = 11.2 if compact else 13.0
    return {
        "title": ParagraphStyle("Title", parent=base["Title"], fontName="Helvetica-Bold", fontSize=24 if compact else 28, leading=26 if compact else 31, textColor=NAVY, spaceAfter=12, alignment=TA_LEFT),
        "h2": ParagraphStyle("H2", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=12 if compact else 13, leading=15, textColor=DEEP, spaceBefore=8, spaceAfter=4, keepWithNext=True),
        "h3": ParagraphStyle("H3", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=10.2, leading=12.5, textColor=CYAN, spaceBefore=7, spaceAfter=3, keepWithNext=True),
        "body": ParagraphStyle("Body", parent=base["BodyText"], fontName="Helvetica", fontSize=body_size, leading=leading, textColor=INK, spaceAfter=5),
        "bullet": ParagraphStyle("Bullet", parent=base["BodyText"], fontName="Helvetica", fontSize=body_size, leading=leading, leftIndent=13, firstLineIndent=-8, textColor=INK, spaceAfter=3),
        "quote": ParagraphStyle("Quote", parent=base["BodyText"], fontName="Helvetica-Oblique", fontSize=body_size, leading=leading, leftIndent=14, rightIndent=8, borderColor=CYAN, borderWidth=2, borderPadding=7, textColor=DEEP, backColor=PALE, spaceAfter=6),
        "code": ParagraphStyle("Code", parent=base["Code"], fontName="Courier", fontSize=6.8 if compact else 7.2, leading=9, leftIndent=8, rightIndent=4, textColor=DEEP, backColor=colors.HexColor("#f4f7f7"), borderPadding=5, spaceAfter=4),
        "meta": ParagraphStyle("Meta", parent=base["BodyText"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=MUTED, spaceAfter=4),
    }


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.26 * inch, width, 0.26 * inch, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(doc.leftMargin, 0.45 * inch, width - doc.rightMargin, 0.45 * inch)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.28 * inch, "YONATHAN ZEITOUNE MATTOUT · WEEK 6")
    canvas.drawRightString(width - doc.rightMargin, 0.28 * inch, f"{doc.page}")
    canvas.restoreState()


def parse_markdown(path, compact=False, force_brief_break=False):
    st = styles(compact)
    lines = path.read_text(encoding="utf-8").splitlines()
    story = []
    para = []
    code = []
    in_code = False
    title_seen = False
    h2_count = 0

    def flush_para():
        nonlocal para
        if para:
            text = " ".join(x.strip() for x in para)
            story.append(Paragraph(inline(text), st["body"]))
            para = []

    for raw in lines:
        line = clean(raw.rstrip())
        if line.startswith("```"):
            flush_para()
            if in_code:
                story.append(Paragraph("<br/>".join(inline(x) for x in code), st["code"]))
                code = []
            in_code = not in_code
            continue
        if in_code:
            code.append(line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
            continue
        if not line.strip():
            flush_para()
            continue
        image_match = re.match(r"!\[([^]]*)\]\(([^)]+)\)", line.strip())
        if image_match:
            flush_para()
            image_path = (path.parent / image_match.group(2)).resolve()
            if image_path.exists():
                img = Image(str(image_path), width=3.25 * inch, height=4.82 * inch)
                img.hAlign = "CENTER"
                story.extend([img, Paragraph(inline(image_match.group(1)), st["meta"]), Spacer(1, 5)])
            continue
        if line.startswith("# "):
            flush_para()
            story.append(Paragraph(inline(line[2:]), st["title"]))
            title_seen = True
            continue
        if line.startswith("## "):
            flush_para()
            h2_count += 1
            if force_brief_break and h2_count == 4:
                story.append(PageBreak())
            story.append(Paragraph(inline(line[3:]), st["h2"]))
            continue
        if line.startswith("### "):
            flush_para()
            story.append(Paragraph(inline(line[4:]), st["h3"]))
            continue
        if line.startswith(">"):
            flush_para()
            story.append(Paragraph(inline(line.lstrip("> ")), st["quote"]))
            continue
        if re.match(r"^[-*] ", line):
            flush_para()
            story.append(Paragraph("- " + inline(line[2:]), st["bullet"]))
            continue
        if re.match(r"^\d+\. ", line):
            flush_para()
            num, text = line.split(". ", 1)
            story.append(Paragraph(f"{num}. {inline(text)}", st["bullet"]))
            continue
        if line.startswith("|"):
            flush_para()
            story.append(Paragraph(inline(line.strip("|").replace("|", " · ")), st["code"]))
            continue
        if not title_seen and line:
            story.append(Paragraph(inline(line), st["body"]))
        else:
            para.append(line)
    flush_para()
    return story


def build(source, output, compact=False, force_brief_break=False):
    margin = 0.58 * inch if compact else 0.68 * inch
    doc = BaseDocTemplate(str(output), pagesize=LETTER,
                          leftMargin=margin, rightMargin=margin,
                          topMargin=0.48 * inch, bottomMargin=0.58 * inch,
                          title=source.stem, author="Yonathan Zeitoune Mattout")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates(PageTemplate(id="week6", frames=frame, onPage=header_footer))
    doc.build(parse_markdown(source, compact=compact, force_brief_break=force_brief_break))


jobs = [
    ("BRIEF_YonathanZeitoune.md", "BRIEF_YonathanZeitoune.pdf", True, True),
    ("CHAT_YonathanZeitoune.md", "CHAT_YonathanZeitoune.pdf", False, False),
    ("PACKET.md", "PACKET_YonathanZeitoune.pdf", True, False),
    ("PERSONA_YonathanZeitoune.md", "PERSONA_YonathanZeitoune.pdf", False, False),
    ("BUILDCHAT_YonathanZeitoune.md", "BUILDCHAT_YonathanZeitoune.pdf", False, False),
    ("GUIA_Yonathan_Week6.md", "GUIA_Yonathan_Week6.pdf", False, False),
]

for source_name, output_name, compact, force_break in jobs:
    build(DOCS / source_name, OUT / output_name, compact=compact, force_brief_break=force_break)
    print(OUT / output_name)
