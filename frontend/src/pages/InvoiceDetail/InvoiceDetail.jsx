import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import SettlementPanel from "../../components/SettlementPanel/SettlementPanel";
import { getBookingInvoice, getInvoice, getInvoicePdf } from "../../services/invoice_service";
import "./InvoiceDetail.css";

const money = (value) => new Intl.NumberFormat("vi-VN", {
  style: "currency", currency: "VND",
}).format(value ?? 0);
const statuses = { REFUND_PENDING: "Ch\u1edd ho\u00e0n ti\u1ec1n", REFUNDED: "\u0110\u00e3 ho\u00e0n ti\u1ec1n", RETAINED_DEPOSIT: "Gi\u1eef c\u1ecdc", UNPAID: "Chưa thanh toán", PARTIALLY_PAID: "Đã thanh toán một phần", PAID: "Đã thanh toán đủ", UNKNOWN: "Chưa có trạng thái thanh toán" };

export default function InvoiceDetail({ adminView = false }) {
  const { invoiceId, bookingId } = useParams();
  const [revision, setRevision] = useState(0);
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { /* ProtectedRoute handles invalid storage. */ }
  if (!adminView && user?.Role?.trim().toUpperCase() === "ADMIN") {
    return <Navigate replace to={invoiceId
      ? `/admin/invoices/${invoiceId}`
      : `/admin/bookings/${bookingId}/invoice`} />;
  }
  return <InvoiceView key={`${invoiceId || ""}:${bookingId || ""}:${revision}`}
    invoiceId={invoiceId} bookingId={bookingId} adminView={adminView}
    onRefresh={() => setRevision((value) => value + 1)} />;
}

function InvoiceView({ invoiceId, bookingId, onRefresh, adminView }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const pdfRequest = useRef(null);
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { /* Auth guard handles invalid storage. */ }
  const isAdmin = user?.Role?.toUpperCase() === "ADMIN";

  useEffect(() => {
    let active = true;
    const request = invoiceId ? getInvoice(invoiceId) : getBookingInvoice(bookingId);
    request.then((data) => { if (active) setInvoice(data); })
      .catch((err) => { if (active) setError(err); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [invoiceId, bookingId]);

  useEffect(() => () => {
    pdfRequest.current?.abort();
  }, []);

  useEffect(() => () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  }, [pdfUrl]);

  const exportPdf = async () => {
    const request = new AbortController();
    pdfRequest.current = request;
    setPdfError("");
    setPdfLoading(true);
    try {
      const pdf = await getInvoicePdf(invoice.invoiceId, request.signal);
      if (request.signal.aborted) return;
      if (pdf.type !== "application/pdf") throw new Error("Máy chủ chưa trả về tệp PDF.");
      setPdfUrl(URL.createObjectURL(pdf));
    } catch (error) {
      if (!request.signal.aborted) setPdfError(error.message || "Không thể mở PDF hóa đơn.");
    } finally {
      if (!request.signal.aborted) setPdfLoading(false);
    }
  };

  return <>{!adminView && <Navbar />}<section className={`invoice-page${adminView ? " invoice-page-admin" : ""}`}>
    <Link className="ui-button ui-button-secondary invoice-back" to={isAdmin ? "/admin/bookings" : "/bookings"}>← Danh sách đặt sân</Link>
    <h1>Chi tiết hóa đơn</h1>
    {loading && <p role="status">Đang tải hóa đơn...</p>}
    {!loading && error && <section role="alert">
      <h2>{error.status === 404 ? "Chưa có hóa đơn hoặc hóa đơn không tồn tại" : "Không thể mở hóa đơn"}</h2>
      <p>{error.message}</p>
      <button className="ui-button" onClick={onRefresh}>Thử lại</button>
    </section>}
    {!loading && !error && !invoice && <p>Chưa có thông tin hóa đơn.</p>}
    {!loading && invoice && <>
      <section className="invoice-card">
        <h2>{invoice.isProvisional ? "Hóa đơn tạm thời" : `Hóa đơn #${invoice.invoiceId}`} · Booking #{invoice.bookingId}</h2>
        <p className={`invoice-status invoice-status-${invoice.paymentStatus?.toLowerCase()}`}>{statuses[invoice.paymentStatus] || invoice.paymentStatus}</p>
        {invoice.isProvisional && <p>
          {invoice.isComplimentary ? "Booking miễn phí, không yêu cầu thanh toán." : "Đã ghi nhận đặt cọc thành công."}
          {" "}Hóa đơn tạm thời chưa có mã hóa đơn chính thức.
        </p>}
        {invoice.remainingAmount > 0 && invoice.bookingStatus !== "CANCELLED" && <p className="invoice-balance-notice" role="status">
          {isAdmin ? "Khách hàng còn phải thanh toán " : "Vui lòng thanh toán số tiền còn lại "}
          <strong>{money(invoice.remainingAmount)}</strong>{isAdmin ? "." : " trực tiếp cho chủ sân."}
          {" "}{isAdmin ? "Chỉ xác nhận sau khi thực tế nhận đủ tiền theo điều kiện UC09." : "Trạng thái sẽ cập nhật khi chủ sân xác nhận đã thu đủ tiền."}
        </p>}
        <dl>
          {invoice.customerName && <><dt>Khách hàng</dt><dd>{invoice.customerName}</dd></>}
          <dt>Sân</dt><dd>{invoice.field.fieldName || (invoice.field.fieldId ? `Sân ${invoice.field.fieldId}` : "Chưa cập nhật")} · {invoice.field.fieldType || "--"}</dd>
          <dt>Địa điểm</dt><dd>{invoice.field.location || "Chưa cập nhật"}</dd>
          <dt>Ngày đặt</dt><dd>{invoice.bookingDate}</dd>
          <dt>Khung giờ</dt><dd>{invoice.startTime} – {invoice.endTime}</dd>
          <dt>Trạng thái booking</dt><dd>{invoice.bookingStatus}</dd>
          {!invoice.isProvisional && <><dt>Ngày lập hóa đơn</dt><dd>{invoice.createdDate || "--"}</dd></>}
          <dt>Tổng tiền</dt><dd>{money(invoice.totalAmount)}</dd>
          <dt>Đã đặt cọc</dt><dd>{money(invoice.depositAmount)}</dd>
          <dt>Thu tại sân</dt><dd>{money(invoice.finalPaymentAmount)}</dd>
          {invoice.extraAmount > 0 && <><dt>Khoản thu khác</dt><dd>{money(invoice.extraAmount)}</dd></>}
          <dt>Đã thanh toán</dt><dd>{money(invoice.paidAmount)}</dd>
          <dt>Còn phải thanh toán</dt><dd><strong>{money(invoice.remainingAmount)}</strong></dd>
          <dt>Đã hoàn tiền (UC07)</dt><dd>{money(invoice.refundedAmount)}</dd>
        </dl>
        {invoice.invoiceId && !invoice.isProvisional && invoice.paymentStatus === "PAID" && invoice.remainingAmount === 0 && (
          <button type="button" className="ui-button" onClick={exportPdf} disabled={pdfLoading}>
            {pdfLoading ? "Đang tạo PDF…" : "Xuất PDF"}
          </button>
        )}
        {pdfError && <p role="alert">{pdfError}</p>}
        {invoice.bookingStatus === "CANCELLED" && <p>Booking đã hủy. Số tiền trên phản ánh lịch sử thu tiền; tiền hoàn được hiển thị riêng.</p>}
      </section>
      {pdfUrl && (
        <section className="invoice-card" aria-label="Xem hóa đơn PDF">
          <div className="invoice-pdf-actions">
            <a className="ui-button" href={pdfUrl} target="_blank" rel="noopener noreferrer">Mở PDF để in</a>
            <a className="ui-button ui-button-secondary" href={pdfUrl} download={`hoa-don-${invoice.invoiceId}.pdf`}>Tải PDF</a>
            <button type="button" className="ui-button ui-button-secondary" onClick={() => setPdfUrl("")}>Đóng PDF</button>
          </div>
          <iframe className="invoice-pdf-preview" src={pdfUrl} title="Hóa đơn PDF" />
        </section>
      )}
      {invoice.remainingAmount > 0 && invoice.bookingStatus !== "CANCELLED" && <>
        <h2>Thanh toán phần còn lại (UC09)</h2>
        <SettlementPanel bookingId={invoice.bookingId} mode={isAdmin ? "admin" : "customer"}
          onPaymentConfirmed={onRefresh} onRefresh={onRefresh} />
      </>}
    </>}
  </section></>;
}
