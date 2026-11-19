"""UC08 authenticated invoice endpoints (no writes)."""
from io import BytesIO

from flask import Blueprint, current_app, jsonify, send_file
from services.invoice_service import get_invoice
from services.invoice_pdf import render_invoice_pdf
from services.jwt_service import current_user_id, jwt_required, role_required
from services.payment_service import PaymentError

invoice_bp = Blueprint("invoice", __name__)


def _view(**lookup):
    try:
        return jsonify(get_invoice(current_user_id(), **lookup)), 200
    except PaymentError as error:
        return jsonify(message=error.message, code=error.code), error.status_code
    except Exception:
        current_app.logger.exception("UC08 invoice view failed")
        return jsonify(message="Không thể tải hóa đơn"), 500


@invoice_bp.get("/invoices/<int:invoice_id>")
@jwt_required
@role_required("CUSTOMER", "ADMIN")
def invoice_detail(invoice_id):
    return _view(invoice_id=invoice_id)


@invoice_bp.get("/invoices/<int:invoice_id>/pdf")
@jwt_required
@role_required("CUSTOMER", "ADMIN")
def invoice_pdf(invoice_id):
    try:
        invoice = get_invoice(current_user_id(), invoice_id=invoice_id)
        if invoice["paymentStatus"] != "PAID" or invoice["remainingAmount"] != 0:
            return jsonify(message="Chỉ xuất PDF cho hóa đơn đã thanh toán đủ.",
                           code="INVOICE_NOT_PAID"), 409
        response = send_file(
            BytesIO(render_invoice_pdf(invoice)), mimetype="application/pdf",
            download_name=f"hoa-don-{invoice_id}.pdf", conditional=False,
        )
        response.cache_control.no_store = True
        return response
    except PaymentError as error:
        return jsonify(message=error.message, code=error.code), error.status_code
    except Exception:
        current_app.logger.exception("UC08 invoice PDF generation failed")
        return jsonify(message="Không thể tạo PDF hóa đơn.", code="INVOICE_PDF_FAILED"), 500


@invoice_bp.get("/bookings/<int:booking_id>/invoice")
@jwt_required
@role_required("CUSTOMER", "ADMIN")
def booking_invoice(booking_id):
    return _view(booking_id=booking_id)
