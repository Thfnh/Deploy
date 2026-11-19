import { ChevronDown, Clock3, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import fieldPhoto from "../../assets/images/football-field.jpg";
import "./Contact.css";

const site = import.meta.env;
const hotline = site.VITE_CONTACT_PHONE?.trim() || "0329961823";
const email = site.VITE_CONTACT_EMAIL?.trim() || "sanbongxuanson2026@gmail.com";
const address = site.VITE_CONTACT_ADDRESS?.trim() || "3 Cầu Giấy, phường Láng, Hà Nội";
const hours = site.VITE_CONTACT_HOURS?.trim() || "06:00 – 22:00";

const items = [
  { label: "Hotline", icon: Phone, value: hotline, href: hotline && `tel:${hotline.replace(/[^\d+]/g, "")}` },
  { label: "Email", icon: Mail, value: email, href: email && `mailto:${email}` },
  { label: "Địa chỉ", icon: MapPin, value: address },
];

const questions = [
  ["Làm thế nào để đặt sân?",
    "Đăng nhập, vào Danh sách sân, chọn sân, ngày và khung giờ còn trống. Kiểm tra thông tin đơn và làm theo hướng dẫn đặt cọc nếu đơn yêu cầu."],
  ["Làm sao biết sân còn trống?",
    "Mở sân bạn muốn đặt và chọn ngày. Các khung giờ còn trống sẽ hiện trong lịch đặt của sân."],
  ["Đặt cọc như thế nào?",
    "Nếu đơn cần đặt cọc, trang thanh toán sẽ hiển thị số tiền và mã VietQR. Quét mã bằng ứng dụng ngân hàng và dùng đúng thông tin chuyển khoản hiển thị trên trang."],
  ["Làm sao biết đơn đã được xác nhận?",
    "Vào Lịch đặt và mở chi tiết đơn. Tại đó bạn có thể xem trạng thái đặt sân và thanh toán."],
  ["Làm thế nào để hủy sân?",
    "Vào Lịch đặt, mở chi tiết đơn rồi chọn thao tác hủy hoặc gửi yêu cầu hủy nếu có. Hãy gửi yêu cầu trước giờ bắt đầu hơn 2 tiếng."],
  ["Hủy sân có được hoàn tiền cọc không?",
    "Điều này phụ thuộc vào trạng thái đơn và kết quả xử lý yêu cầu hủy. Mở chi tiết đơn để xem trạng thái hoàn tiền hoặc hướng dẫn bổ sung thông tin nếu được yêu cầu."],
  ["Tôi muốn đổi sân hoặc giờ đá thì làm thế nào?",
    "Hãy liên hệ chủ sân và cung cấp mã đơn, sân và khung giờ bạn muốn đổi để được kiểm tra lịch trống."],
  ["Tôi thanh toán phần còn lại ở đâu?",
    "Bạn thanh toán phần còn lại trực tiếp tại sân. Sau khi nhận đủ, chủ sân sẽ xác nhận và trạng thái thanh toán được cập nhật trong chi tiết đơn."],
  ["Tôi xem, tải hoặc in hóa đơn ở đâu?",
    "Vào Lịch đặt, mở chi tiết đơn và chọn Xem hóa đơn. Với hóa đơn đã thu đủ, chọn Xuất PDF để xem, tải xuống hoặc in."],
  ["Đã chuyển khoản nhưng đơn chưa cập nhật thì làm gì?",
    "Mở lại chi tiết đơn để kiểm tra trạng thái. Nếu vẫn chưa cập nhật, liên hệ chủ sân và cung cấp mã đơn cùng thông tin giao dịch để đối soát trước khi chuyển khoản lại."],
];

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="contact-page">
        <header className="contact-hero" style={{ "--contact-photo": `url("${fieldPhoto}")` }}>
          <div className="contact-container">
            <h1>Liên hệ với chúng tôi</h1>
            <p>Có câu hỏi về đặt sân? Đội ngũ Xuân Sơn luôn sẵn sàng hỗ trợ bạn.</p>
          </div>
        </header>
        <div className="contact-container contact-content">
          <section className="contact-info" aria-labelledby="contact-info-title">
            <h2 id="contact-info-title">Thông tin liên hệ</h2>
            <dl>
              {items.map(({ label, icon: Icon, value, href }) => (
                <div key={label} className="contact-info-item">
                  <span className="contact-icon"><Icon size={23} aria-hidden="true" /></span>
                  <div>
                    <dt>{label}</dt>
                    <dd>{href ? <a href={href}>{value}</a> : value || "Đang cập nhật"}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="contact-hours"><Clock3 size={20} aria-hidden="true" />
              <span><strong>Giờ hỗ trợ:</strong> {hours}</span>
            </p>
          </section>
          <section className="contact-faq" aria-labelledby="contact-faq-title">
            <h2 id="contact-faq-title">Câu hỏi thường gặp</h2>
            <div className="contact-faq-list">
              {questions.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <ChevronDown size={20} className="contact-faq-arrow" aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer showContactColumn={false} />
    </>
  );
}
