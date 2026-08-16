#!/usr/bin/env python3
"""Генерация PDF-отчёта из GRANT_REPORT_EXTENDED.md с PNG-графиками."""
import os
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

BASE_DIR = Path(__file__).parent.resolve()
MD_FILE = BASE_DIR / "GRANT_REPORT_EXTENDED.md"
PDF_FILE = BASE_DIR / "GRANT_REPORT_EXTENDED.pdf"

# Регистрация шрифтов с поддержкой кириллицы
pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))

# Стили
styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleCustom",
        fontName="Arial-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#1a3a5c"),
        spaceAfter=18,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="Heading1Custom",
        fontName="Arial-Bold",
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#00a77f"),
        spaceBefore=22,
        spaceAfter=10,
        borderWidth=0,
        borderColor=colors.HexColor("#00a77f"),
        borderPadding=5,
        leftIndent=0,
    )
)
styles.add(
    ParagraphStyle(
        name="Heading2Custom",
        fontName="Arial-Bold",
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#2d5a87"),
        spaceBefore=16,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Heading3Custom",
        fontName="Arial-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#333333"),
        spaceBefore=12,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyCustom",
        fontName="Arial",
        fontSize=10.5,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletCustom",
        fontName="Arial",
        fontSize=10.5,
        leading=14,
        leftIndent=12,
        bulletIndent=0,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="CaptionCustom",
        fontName="Arial-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#555555"),
        alignment=TA_CENTER,
        spaceAfter=12,
    )
)
styles.add(
    ParagraphStyle(
        name="TableCell",
        fontName="Arial",
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="TableHeader",
        fontName="Arial-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.white,
        alignment=TA_LEFT,
    )
)


def markdown_to_html(text: str) -> str:
    """Преобразует markdown-разметку в теги, понятные Paragraph."""
    # Жирный текст
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    # Курсив
    text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
    # Ссылки [text](url)
    text = re.sub(r"\[([^\]]+)\]\(([^\)]+)\)", r'<a href="\2" color="blue">\1</a>', text)
    # Моноширинный inline
    text = re.sub(r"`([^`]+)`", r'<font face="Courier">\1</font>', text)
    # Экранирование XML-сущностей
    text = text.replace("&", "&amp;")
    text = text.replace("<b>", "$$BOLD_OPEN$$").replace("</b>", "$$BOLD_CLOSE$$")
    text = text.replace("<i>", "$$ITALIC_OPEN$$").replace("</i>", "$$ITALIC_CLOSE$$")
    text = text.replace("<a ", "$$A_OPEN$$").replace("</a>", "$$A_CLOSE$$")
    text = text.replace("<font ", "$$FONT_OPEN$$").replace("</font>", "$$FONT_CLOSE$$")
    text = text.replace("<", "&lt;").replace(">", "&gt;")
    # Восстановить теги
    text = text.replace("$$BOLD_OPEN$$", "<b>").replace("$$BOLD_CLOSE$$", "</b>")
    text = text.replace("$$ITALIC_OPEN$$", "<i>").replace("$$ITALIC_CLOSE$$", "</i>")
    text = text.replace("$$A_OPEN$$", "<a ").replace("$$A_CLOSE$$", "</a>")
    text = text.replace("$$FONT_OPEN$$", "<font ").replace("$$FONT_CLOSE$$", "</font>")
    return text


def parse_markdown(md_text: str):
    """Парсит markdown в элементы reportlab."""
    elements = []
    lines = md_text.splitlines()
    i = 0
    figure_counter = [0]

    while i < len(lines):
        raw = lines[i]
        stripped = raw.strip()

        if not stripped:
            elements.append(Spacer(1, 4))
            i += 1
            continue

        # Заголовок 1 (#)
        if re.match(r"^#\s+", stripped):
            text = re.sub(r"^#\s+", "", stripped)
            elements.append(Paragraph(markdown_to_html(text), styles["TitleCustom"]))
            i += 1
            continue

        # Заголовок 2 (##)
        if re.match(r"^##\s+", stripped):
            text = re.sub(r"^##\s+", "", stripped)
            # Новая страница для основных разделов
            if elements:
                elements.append(PageBreak())
            elements.append(Paragraph(markdown_to_html(text), styles["Heading1Custom"]))
            i += 1
            continue

        # Заголовок 3 (###)
        if re.match(r"^###\s+", stripped):
            text = re.sub(r"^###\s+", "", stripped)
            elements.append(Paragraph(markdown_to_html(text), styles["Heading2Custom"]))
            i += 1
            continue

        # Изображение ![alt](path)
        img_match = re.match(r"^!\[([^\]]*)\]\(([^\)]+)\)$", stripped)
        if img_match:
            alt, rel_path = img_match.groups()
            img_path = BASE_DIR / rel_path
            if img_path.exists():
                figure_counter[0] += 1
                elements.append(Spacer(1, 6))
                img = Image(str(img_path), width=15 * cm, height=7.5 * cm)
                img.hAlign = "CENTER"
                elements.append(img)
                elements.append(
                    Paragraph(
                        f"Рисунок {figure_counter[0]} — {alt}",
                        styles["CaptionCustom"],
                    )
                )
                elements.append(Spacer(1, 6))
            else:
                elements.append(Paragraph(f"[Изображение не найдено: {rel_path}]", styles["BodyCustom"]))
            i += 1
            continue

        # Таблица markdown
        if stripped.startswith("|") and stripped.endswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            elements.extend(build_table(table_lines))
            continue

        # Буллиты
        if stripped.startswith("- "):
            bullet_items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                text = re.sub(r"^-\s+", "", lines[i].strip())
                bullet_items.append(
                    ListItem(
                        Paragraph(markdown_to_html(text), styles["BulletCustom"]),
                        bulletColor=colors.HexColor("#00a77f"),
                    )
                )
                i += 1
            elements.append(
                ListFlowable(
                    bullet_items,
                    bulletType="bullet",
                    bulletFontName="Arial-Bold",
                    bulletFontSize=10,
                    bulletColor=colors.HexColor("#00a77f"),
                    leftIndent=12,
                    spaceBefore=4,
                    spaceAfter=8,
                )
            )
            continue

        # Нумерованные списки
        if re.match(r"^\d+\.\s+", stripped):
            numbered_items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                text = re.sub(r"^\d+\.\s+", "", lines[i].strip())
                numbered_items.append(
                    ListItem(Paragraph(markdown_to_html(text), styles["BulletCustom"]))
                )
                i += 1
            elements.append(
                ListFlowable(
                    numbered_items,
                    bulletType="1",
                    leftIndent=12,
                    spaceBefore=4,
                    spaceAfter=8,
                )
            )
            continue

        # Кодовый блок
        if stripped.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # skip closing ```
            code_text = "<br/>".join(code_lines)
            elements.append(
                Paragraph(
                    f"<font face='Courier' size='9' color='#333333'>{code_text}</font>",
                    ParagraphStyle(
                        name="CodeBlock",
                        fontName="Arial",
                        fontSize=9,
                        leading=12,
                        backColor=colors.HexColor("#f5f5f5"),
                        borderPadding=8,
                        spaceBefore=6,
                        spaceAfter=8,
                    ),
                )
            )
            continue

        # Обычный абзац
        elements.append(Paragraph(markdown_to_html(stripped), styles["BodyCustom"]))
        i += 1

    return elements


def build_table(table_lines):
    """Строит reportlab Table из строк markdown-таблицы."""
    rows = []
    is_first = True
    for line in table_lines:
        cells = [c.strip() for c in line.strip("|").split("|")]
        # Пропустить разделитель ---|---
        if all("---" in c for c in cells):
            continue
        # Заменить пустые ячейки на пробел
        cells = [c if c else " " for c in cells]
        rows.append(cells)

    if not rows:
        return []

    data = []
    for r_idx, row in enumerate(rows):
        style = "TableHeader" if is_first and r_idx == 0 else "TableCell"
        row_cells = []
        for cell in row:
            row_cells.append(Paragraph(markdown_to_html(cell), styles[style]))
        data.append(row_cells)

    # Ширина таблицы — ширина страницы с полями
    col_count = max(len(r) for r in data)
    available_width = 17 * cm
    col_widths = [available_width / col_count] * col_count

    table = Table(data, colWidths=col_widths, repeatRows=1)
    table_style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#00a77f")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("FONTNAME", (0, 0), (-1, 0), "Arial-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ("TOPPADDING", (0, 0), (-1, 0), 8),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#fafafa")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8f8f8")]),
        ]
    )
    table.setStyle(table_style)
    return [Spacer(1, 6), table, Spacer(1, 10)]


def main():
    if not MD_FILE.exists():
        print(f"Файл не найден: {MD_FILE}")
        sys.exit(1)

    md_text = MD_FILE.read_text(encoding="utf-8")
    story = parse_markdown(md_text)

    doc = SimpleDocTemplate(
        str(PDF_FILE),
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    doc.build(story)
    print(f"✅ PDF создан: {PDF_FILE}")


if __name__ == "__main__":
    main()
