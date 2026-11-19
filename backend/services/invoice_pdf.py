"""Render a printable A4 PDF from the UC08 invoice representation."""
import os
from datetime import date
from decimal import Decimal
from functools import lru_cache
from html import escape
from io import BytesIO
from pathlib import Path


def _vnd(value):
    formatted = f"{Decimal(str(value)):,.2f}".rstrip("0").rstrip(".")
    return formatted.translate(str.maketrans(",.", ".,")) + " ₫"


@lru_cache(maxsize=1)
def _font():
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont

    default = (
        Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts" / "arial.ttf"
        if os.name == "nt" else Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    )
    pdfmetrics.registerFont(TTFont("InvoiceSans", os.getenv("INVOICE_PDF_FONT_FILE") or str(default)))
    return "InvoiceSans"


def render_invoice_pdf(invoice):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    field = invoice["field"]
    field_name = field["fieldName"] or (f'Sân {field["fieldId"]}' if field["fieldId"] else "Chưa cập nhật")
    booking_date = date.fromisoformat(invoice["bookingDate"][:10])
    rows = [
        ("Mã hóa đơn", str(invoice["invoiceId"])),
        ("Mã đặt sân", str(invoice["bookingId"])),
        ("Khách hàng", invoice["customerName"] or "Chưa cập nhật"),
        ("Sân", field_name),
        ("Địa điểm", field["location"] or "Chưa cập nhật"),
        ("Ngày, giờ đá", f'{booking_date:%d/%m/%Y} · {invoice["startTime"]} – {invoice["endTime"]}'),
        ("Tổng tiền", _vnd(invoice["totalAmount"])),
        ("Đã đặt cọc", _vnd(invoice["depositAmount"])),
        ("Thu tại sân", _vnd(invoice["finalPaymentAmount"])),
        ("Khoản thu khác", _vnd(invoice["extraAmount"])),
        ("Đã hoàn tiền", _vnd(invoice["refundedAmount"])),
        ("Đã thanh toán", _vnd(invoice["paidAmount"])),
        ("Còn phải thanh toán", _vnd(invoice["remainingAmount"])),
    ]

    body = ParagraphStyle("InvoiceBody", fontName=_font(), fontSize=11, leading=17)
    title = ParagraphStyle("InvoiceTitle", parent=body, fontSize=19, leading=25)
    table = Table(
        [[Paragraph(escape(str(text)), body) for text in row] for row in rows],
        colWidths=[155, 330], hAlign="LEFT",
    )
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    pdf = BytesIO()
    SimpleDocTemplate(pdf, pagesize=A4, leftMargin=48, rightMargin=48,
                      title=f'Hóa đơn đặt sân {invoice["invoiceId"]}').build([
        Paragraph("Hóa đơn đặt sân", title), Spacer(1, 16), table,
    ])
    return pdf.getvalue()
