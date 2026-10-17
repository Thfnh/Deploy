<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Users,
} from "lucide-react";

import fieldImage
  from "../../assets/images/football-field.jpg";
=======
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

import "./FieldCard.css";


<<<<<<< HEAD
function FieldCard({
=======
const formatTime = (value) => {
  if (!value) {
    return "--:--";
  }

  const text =
    String(value);

  const match =
    text.match(
      /(\d{1,2}):(\d{2})/
    );

  if (!match) {
    return text;
  }

  return `${match[1].padStart(
    2,
    "0"
  )}:${match[2]}`;
};


const formatPrice = (value) => {
  const amount =
    Number(value || 0);

  return new Intl.NumberFormat(
    "vi-VN"
  ).format(amount);
};


const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toUpperCase();


const FieldCard = ({
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
  id,
  name,
  address,
  type,
  status,
  slots = [],
<<<<<<< HEAD
}) {
=======
  selectedDate = "",
  availabilityLoaded = false,
  availabilityLoading = false,
  availabilityError = "",
  hasAvailableSlot = false,
}) => {
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

  const navigate =
    useNavigate();


<<<<<<< HEAD
=======
  const normalizedStatus =
    normalizeStatus(status);


  const fieldUnavailable =
    normalizedStatus &&
    normalizedStatus !==
      "AVAILABLE";


  // =========================================================
  // MIN PRICE
  // =========================================================

  const minPrice =
    useMemo(() => {

      const prices =
        slots
          .map(
            (slot) =>
              Number(
                slot.Price ??
                slot.price ??
                0
              )
          )
          .filter(
            (price) =>
              Number.isFinite(
                price
              ) &&
              price > 0
          );


      return prices.length > 0
        ? Math.min(...prices)
        : null;

    }, [slots]);


  const availableSlotExists =
    hasAvailableSlot ||
    slots.some(
      (slot) =>
        slot.available === true
    );


  const canBook =
    Boolean(selectedDate) &&
    availabilityLoaded &&
    !fieldUnavailable &&
    availableSlotExists;


  // =========================================================
  // CURRENT USER
  // =========================================================

>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
  const getCurrentUser = () => {
    try {
<<<<<<< HEAD

      return JSON.parse(
        localStorage.getItem("user")
=======
      const rawUser =
        localStorage.getItem(
          "user"
        );

      if (!rawUser) {
        return null;
      }

      return JSON.parse(
        rawUser
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
      );

    } catch {
      return null;
    }
  };


<<<<<<< HEAD
  /* =========================================================
     MIN PRICE
  ========================================================= */

  const prices =
    slots
      .map(
        (slot) =>
          Number(slot.Price)
      )
      .filter(
        (price) =>
          !Number.isNaN(price)
      );


  const minPrice =
    prices.length > 0
      ? Math.min(...prices)
      : 0;


  const fieldAvailable =
    status === "AVAILABLE";


  /* =========================================================
     OPEN BOOKING
  ========================================================= */

  const handleChooseField = () => {

    if (!fieldAvailable) {
      return;
    }


    const bookingUrl =
      /booking?fieldId=${id};


    const user =
      getCurrentUser();


    if (!user) {
=======
  // =========================================================
  // BOOKING
  // =========================================================

  const handleBooking = () => {

    if (!canBook) {
      return;
    }


    const params =
      new URLSearchParams({
        fieldId:
          String(id),

        date:
          selectedDate,
      });


    const bookingUrl =
      `/booking?${params.toString()}`;


    const user =
      getCurrentUser();


    // =======================================================
    // NOT LOGGED IN
    // =======================================================

    if (!user?.UserID) {
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

      navigate(
        `/login?redirect=${encodeURIComponent(
          bookingUrl
        )}`
      );

      return;
    }


<<<<<<< HEAD
=======
    // =======================================================
    // LOGGED IN
    // =======================================================

>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
    navigate(
      bookingUrl
    );
  };


  return (
    <article className="field-card">

      <div
        className="field-card-cover"
        aria-hidden="true"
      >
<<<<<<< HEAD

        <img
          src={fieldImage}
          alt={name}
          className="field-image"
        />


        <span
          className={
            fieldAvailable
              ? "field-status field-status--available"
              : "field-status field-status--maintenance"
          }
        >

          {
            fieldAvailable
              ? "Đang hoạt động"
              : "Bảo trì"
          }

=======
        <span>
          SÂN BÓNG
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
        </span>
      </div>


      <div className="field-card-body">

        <div className="field-card-title-row">

<<<<<<< HEAD
        <div
          className="field-title-row"
        >

          <h3 title={name}>
            {name}
          </h3>
=======
          <div>
            <h2>
              {name || `Sân ${id}`}
            </h2>

            <p className="field-card-type">
              {type || "Sân bóng"}
            </p>
          </div>


          {fieldUnavailable && (
            <span className="field-status field-status-maintenance">
              Bảo trì
            </span>
          )}
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

        </div>


<<<<<<< HEAD
        {/* FIELD INFO */}

        <div
          className="field-info"
        >

          <div
            className="field-info-row"
          >

            <MapPin size={16} />

            <span>
              {address}
            </span>

          </div>
=======
        <p className="field-card-address">
          {address ||
            "Chưa cập nhật địa chỉ"}
        </p>
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec


        {minPrice !== null && (
          <p className="field-card-price">

<<<<<<< HEAD
            <Users size={16} />
=======
            Từ{" "}
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

            <strong>
              {formatPrice(
                minPrice
              )}
              đ
            </strong>

            {" "}/ khung giờ

          </p>
        )}

<<<<<<< HEAD
        </div>


        {/* TIME SLOTS */}

        <div
          className="field-slots"
        >

          <div
            className="field-slots-title"
          >
            KHUNG GIỜ
          </div>
=======

        <div className="field-card-availability">

          {!selectedDate && (
            <p className="field-card-hint">
              Chọn ngày ở phía trên để kiểm tra lịch trống.
            </p>
          )}


          {selectedDate &&
            availabilityLoading && (
              <p className="field-card-hint">
                Đang kiểm tra lịch...
              </p>
            )}
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec


          {selectedDate &&
            !availabilityLoading &&
            availabilityError && (
              <p className="field-card-error">
                {availabilityError}
              </p>
            )}

<<<<<<< HEAD
                <div
                  className="field-no-slot"
                >
                  Chưa có khung giờ
                </div>
=======

          {selectedDate &&
            !availabilityLoading &&
            !availabilityError &&
            fieldUnavailable && (
              <p className="field-card-error">
                Sân đang bảo trì và không thể đặt trong thời gian này.
              </p>
            )}

>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

          {selectedDate &&
            !availabilityLoading &&
            !availabilityError &&
            !fieldUnavailable &&
            availabilityLoaded &&
            slots.length === 0 && (
              <p className="field-card-hint">
                Sân chưa có khung giá để đặt.
              </p>
            )}

<<<<<<< HEAD
                slots.map(
                  (slot) => (

                    <div
                      key={slot.PriceID}
                      className="field-slot"
                    >

                      <strong>

                        {
                          slot.StartTime
                        }

                        {" - "}

                        {
                          slot.EndTime
                        }

                      </strong>

                    </div>

                  )
                )

              )
          }
=======

          {selectedDate &&
            !availabilityLoading &&
            !availabilityError &&
            !fieldUnavailable &&
            availabilityLoaded &&
            slots.length > 0 && (

              <div className="field-slot-list">

                {slots.map(
                  (slot, index) => {

                    const available =
                      slot.available ===
                      true;


                    const slotKey =
                      slot.PriceID ??
                      `${slot.StartTime ||
                        slot.startTime}-${slot.EndTime ||
                        slot.endTime}-${index}`;


                    return (
                      <div
                        key={slotKey}
                        className={`field-slot ${
                          available
                            ? "field-slot-available"
                            : "field-slot-unavailable"
                        }`}
                      >

                        <div>

                          <strong>
                            {formatTime(
                              slot.StartTime ??
                              slot.startTime
                            )}

                            {" - "}

                            {formatTime(
                              slot.EndTime ??
                              slot.endTime
                            )}
                          </strong>


                          {(slot.Price ??
                            slot.price) !==
                            undefined && (

                            <span>
                              {formatPrice(
                                slot.Price ??
                                slot.price
                              )}
                              đ
                            </span>

                          )}

                        </div>


                        <span className="field-slot-state">
                          {available
                            ? "Trống"
                            : "Đã đặt"}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>
            )}
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

        </div>


        <button
          type="button"
          className="field-card-booking-button"
          disabled={!canBook}
          onClick={handleBooking}
        >
<<<<<<< HEAD

          <div>

            <span
              className="price-label"
            >
              GIÁ THUÊ TỪ
            </span>


            <strong>

              {
                minPrice.toLocaleString(
                  "vi-VN"
                )
              }

              đ/h

            </strong>

          </div>


          <button

            type="button"

            disabled={
              !fieldAvailable
            }

            className={
              fieldAvailable
                ? "field-detail-button"
                : "field-detail-button field-disabled"
            }

            onClick={
              handleChooseField
            }

          >

            {
              fieldAvailable
                ? "Xem lịch / Đặt sân"
                : "Bảo trì"
            }

          </button>

        </div>
=======
          {fieldUnavailable
            ? "Sân đang bảo trì"
            : !selectedDate
              ? "Chọn ngày để đặt sân"
              : canBook
                ? "Đặt sân"
                : "Không có khung giờ trống"}
        </button>
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec

      </div>

    </article>
  );
};


export default FieldCard;