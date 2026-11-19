import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import footballField from "../../assets/images/football-field.jpg";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getTopRatedFields } from "../../services/review_service";

import "./Home.css";


function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <path d="M7 14h5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Home() {
  const [featured, setFeatured] = useState({ status: "loading", fields: [] });

  useEffect(() => {
    const controller = new AbortController();
    getTopRatedFields(controller.signal)
      .then(fields => {
        if (!controller.signal.aborted) setFeatured({ status: "ready", fields });
      })
      .catch(() => {
        if (!controller.signal.aborted) setFeatured({ status: "error", fields: [] });
      });
    return () => controller.abort();
  }, []);
  return (
    <div className="home">
      <Navbar />

      {/* ================= HERO ================= */}

      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span></span>
              HƠN 100+ SÂN CỎ ĐÃ SẴN SÀNG
            </div>

            <h1>
              Đặt sân bóng dễ dàng
              <br />
              Trải nghiệm tuyệt vời
            </h1>

            <Link
              to="/fields"
              className="hero-button"
            >
              Đặt sân ngay
            </Link>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={footballField}
              alt="Sân bóng đá"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}

      <section className="why-section">
        <div className="section-heading">
          <h2>Tại sao lại lựa chọn chúng tôi ?</h2>

          <p>
            Mang đến giải pháp quản lý và đặt sân tiện
            lợi nhất cho cộng đồng đam mê túc cầu.
          </p>
        </div>

        <div className="benefit-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <QualityIcon />
            </div>

            <h3>Sân cỏ chất lượng</h3>

            <p>
              Hệ thống sân cỏ nhận tạo đạt chuẩn quốc tế,
              trang bị đèn LED chiếu sáng hiện đại và hệ
              thống lưới bao an toàn tuyệt đối.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              <PriceIcon />
            </div>

            <h3>Giá cả hợp lý</h3>

            <p>
              Giá cả cạnh tranh kèm nhiều ưu đãi vào giờ
              thấp điểm. Bảng giá minh bạch, cam kết không
              phát sinh phụ phí ẩn.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              <ClockIcon />
            </div>

            <h3>Đặt sân nhanh chóng</h3>

            <p>
              Đặt lịch chỉ với vài thao tác đơn giản. Xác
              nhận lịch đặt ngay lập tức qua SMS/Email giúp
              tiết kiệm tối đa thời gian.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED FIELDS ================= */}

      <section className="featured-section">
        <div className="featured-container">
          <div className="featured-header">
            <div>
              <h2>Các sân bóng nổi bật</h2>

              <p>Tối đa ba sân có điểm đánh giá trung bình cao nhất.</p>
            </div>

          </div>

          {featured.status === "loading" && <p role="status">Đang tải sân nổi bật…</p>}
          {featured.status === "error" && <p role="alert">Chưa tải được sân nổi bật.</p>}
          {featured.status === "ready" && featured.fields.length === 0 && <p>Chưa có sân nào được đánh giá.</p>}
          {featured.fields.length > 0 && (
            <div className="field-grid">
              {featured.fields.map(field => (
                <article className="home-featured-card" key={field.fieldId}>
                  <img src={footballField} alt="" loading="lazy" />
                  <div className="home-featured-body">
                    <h3>{field.name}</h3>
                    <p>{[field.type, field.address].filter(Boolean).join(" · ")}</p>
                    <p><strong><span aria-hidden="true">★ </span>{field.averageRating.toLocaleString("vi-VN")} / 5</strong>
                      {" "}({field.reviewCount} đánh giá)</p>
                    <Link to={`/fields/${field.fieldId}/reviews`}>Xem đánh giá của sân</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= STEPS ================= */}

      <section className="steps-section">
        <div className="section-heading">
          <h2>4 bước đặt sân đơn giản</h2>

          <p>
            Quy trình nhanh gọn giúp bạn ra sân bóng một
            cách thuận tiện nhất.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">
              1
            </div>

            <h3>Chọn sân</h3>

            <p>
              Tìm kiếm và chọn sân phù hợp vị trí
              của bạn
            </p>
          </div>

          <div className="step-arrow">
            <ArrowRight />
          </div>

          <div className="step-item">
            <div className="step-number">
              2
            </div>

            <h3>Chọn thời gian</h3>

            <p>
              Lựa chọn khung giờ vàng còn trống
              trên lịch đặt
            </p>
          </div>

          <div className="step-arrow">
            <ArrowRight />
          </div>

          <div className="step-item">
            <div className="step-number">
              3
            </div>

            <h3>Xác nhận</h3>

            <p>
              Kiểm tra thông tin chi tiết hóa đơn
              đặt sân
            </p>
          </div>

          <div className="step-arrow">
            <ArrowRight />
          </div>

          <div className="step-item last">
            <div className="step-number active">
              4
            </div>

            <h3>Thanh toán</h3>

            <p>
              Nhận mã đặt sân và sẵn sàng ra sân
              tranh tài
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;