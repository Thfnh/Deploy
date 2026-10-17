import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";

import {
  getFieldAvailability,
} from "../../services/field_service";

import "./Booking.css";


const formatTime = (value) => {
  if (!value) {
    return "--:--";
  }

  const text = String(value);

  const match = text.match(
    /(\d{1,2}):(\d{2})/
  );

  if (!match) {
    return text;
  }

  return `${match[1].padStart(2, "0")}:${match[2]}`;
};


const formatPrice = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat(
    "vi-VN"
  ).format(amount);
};


const getLocalDateString = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


function Booking() {
  const navigate = useNavigate();

  const location = useLocation();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const fieldId =
    searchParams.get("fieldId") || "";

  const dateFromUrl =
    searchParams.get("date") || "";

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(dateFromUrl);

  const [
    availability,
    setAvailability,
  ] = useState(null);

  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // =========================================================
  // SYNC DATE FROM URL
  // =========================================================

  useEffect(() => {
    setSelectedDate(
      dateFromUrl
    );

    setSelectedSlot(null);
  }, [
    dateFromUrl,
    fieldId,
  ]);


  // =========================================================
  // LOAD AVAILABILITY
  // =========================================================

  useEffect(() => {
    if (
      !fieldId ||
      !selectedDate
    ) {
      setAvailability(null);
      setSelectedSlot(null);
      setError("");

      return;
    }

    let active = true;


    const loadAvailability =
      async () => {
        try {
          setLoading(true);
          setError("");
          setSelectedSlot(null);

          const data =
            await getFieldAvailability(
              fieldId,
              selectedDate
            );

          if (!active) {
            return;
          }

          setAvailability(data);
        } catch (requestError) {
          if (!active) {
            return;
          }

          setAvailability(null);

          setError(
            requestError.message ||
            "Không thể tải lịch sân."
          );
<<<<<<< HEAD

        const result =
          Array.isArray(data)
            ? data
            : data.Fields || [];

        setFields(
          result
        );


        setSelectedField(
          current => {

            // giữ sân đang chọn nếu còn tồn tại
            if (
              current
              &&
              result.some(
                field =>
                  Number(
                    field.FieldID
                  )
                  ===
                  Number(current)
              )
            ) {

              return current;
            }


            // ưu tiên FieldID từ URL
            if (
              initialFieldID
              &&
              result.some(
                field =>
                  Number(
                    field.FieldID
                  )
                  ===
                  Number(
                    initialFieldID
                  )
              )
            ) {

              return initialFieldID;
            }


            return (
              result[0]?.FieldID
              ||
              null
            );
          }
        );

      } catch (
      loadError
      ) {

        console.error(
          loadError
        );

        setError(
          loadError.message
          ||
          "Không thể tải lịch sân"
        );

      } finally {

        setLoading(false);
      }
    };


  /* =========================================================
     FILTER
  ========================================================= */

  const filteredFields =
    useMemo(
      () => {

        const search =
          keyword
            .trim()
            .toLowerCase();

        return fields.filter(
          field => {

            const matchName =
              String(
                field.FieldName || ""
              )
                .toLowerCase()
                .includes(
                  search
                );


            const matchType =
              type === "all"
              ||
              field.FieldType
              ===
              type;


            return (
              matchName
              &&
              matchType
            );
          }
        );

      },
      [
        fields,
        keyword,
        type
      ]
    );


  const fieldTypes =
    useMemo(
      () => [

        ...new Set(

          fields
            .map(
              field =>
                field.FieldType
            )
            .filter(Boolean)
        )
      ],
      [fields]
    );


  const currentField =
    fields.find(
      field =>
        Number(
          field.FieldID
        )
        ===
        Number(
          selectedField
        )
    );


  /* =========================================================
     SELECT FIELD
  ========================================================= */

  const handleSelectField =
    (fieldID) => {

      setSelectedField(
        fieldID
      );

      setSelectedSlot(
        null
      );
    };


  /* =========================================================
     SELECT SLOT
  ========================================================= */

  const handleSelectSlot =
    (slot) => {

      if (
        !slot.available
      ) {

        return;
      }


      setSelectedSlot(
        slot
      );
    };


  /* =========================================================
     CONTINUE PAYMENT
  ========================================================= */

  const handleContinue =
    () => {

      if (
        !currentField
        ||
        !selectedSlot
      ) {

        return;
      }


      const bookingDraft = {

        FieldID:
          currentField.FieldID,

        FieldName:
          currentField.FieldName,

        FieldType:
          currentField.FieldType,

        Location:
          currentField.Location,

        BookingDate:
          bookingDate,

        PriceID:
          selectedSlot.PriceID,

        StartTime:
          selectedSlot.StartTime,

        EndTime:
          selectedSlot.EndTime,

        Price:
          Number(
            selectedSlot.Price || 0
          )
=======
        } finally {
          if (active) {
            setLoading(false);
          }
        }
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
      };


    loadAvailability();


    return () => {
      active = false;
    };
  }, [
    fieldId,
    selectedDate,
  ]);


  // =========================================================
  // NORMALIZE SLOTS
  // =========================================================

  const slots = useMemo(
    () => {
      const source =
        availability?.Slots || [];

      return source.map(
        (slot, index) => ({
          ...slot,

          key:
            slot.PriceID ??
            `${slot.StartTime}-${slot.EndTime}-${index}`,

          StartTime:
            formatTime(
              slot.StartTime
            ),

          EndTime:
            formatTime(
              slot.EndTime
            ),

          Price:
            Number(
              slot.Price || 0
            ),

          available:
            slot.available === true,
        })
      );
    },
    [availability]
  );


  // =========================================================
  // DATE CHANGE
  // =========================================================

  const handleDateChange = (
    event
  ) => {
    const nextDate =
      event.target.value;

    setSelectedDate(
      nextDate
    );

    setSelectedSlot(null);

    const nextParams =
      new URLSearchParams(
        searchParams
      );

    if (nextDate) {
      nextParams.set(
        "date",
        nextDate
      );
    } else {
      nextParams.delete(
        "date"
      );
    }

    setSearchParams(
      nextParams,
      {
        replace: true,
      }
    );
  };


  // =========================================================
  // SELECT SLOT
  // =========================================================

  const handleSelectSlot = (
    slot
  ) => {
    if (!slot.available) {
      return;
    }

    setSelectedSlot(slot);
  };


  // =========================================================
  // CONTINUE TO CONFIRM
  // =========================================================

  const handleContinue = () => {
    if (
      !availability ||
      !selectedSlot ||
      !selectedDate
    ) {
      return;
    }

    const bookingDraft = {
      FieldID:
        Number(
          availability.FieldID
        ),

      FieldName:
        availability.FieldName,

      FieldType:
        availability.FieldType,

      Location:
        availability.Location,

      BookingDate:
        selectedDate,

      PriceID:
        selectedSlot.PriceID,

      StartTime:
        selectedSlot.StartTime,

      EndTime:
        selectedSlot.EndTime,

      Price:
        selectedSlot.Price,
    };


    sessionStorage.setItem(
      "bookingDraft",
      JSON.stringify(
        bookingDraft
      )
    );


    navigate(
      "/booking/confirm"
    );
  };


  // =========================================================
  // NO FIELD SELECTED
  // =========================================================

  if (!fieldId) {
    return (
      <>
        <Navbar />

        <main className="booking-page">
          <div className="booking-container">

            <div className="booking-empty-card">

              <h1>
                Chưa chọn sân
              </h1>

              <p>
                Vui lòng chọn sân từ
                trang danh sách sân
                trước khi đặt lịch.
              </p>

              <button
                type="button"
                className="booking-primary-button"
                onClick={() =>
                  navigate(
                    "/fields"
                  )
                }
              >
                <ArrowLeft size={18} />

                Chọn sân
              </button>

            </div>

          </div>
        </main>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="booking-page">

        <div className="booking-container">

          {/* ===============================================
              HEADER
          =============================================== */}

          <div className="booking-top-row">

            <button
              type="button"
              className="booking-back-button"
              onClick={() =>
                navigate(
                  "/fields"
                )
              }
            >
              <ArrowLeft size={18} />

              Danh sách sân
            </button>

          </div>


          <section className="booking-header-card">

            <div>

              <p className="booking-eyebrow">
                ĐẶT SÂN
              </p>

              <h1>
                {
<<<<<<< HEAD
                  filteredFields.map(
                    field => (

                      <button

                        key={
                          field.FieldID
                        }

                        type="button"

                        className={
                          Number(
                            selectedField
                          )
                            ===
                            Number(
                              field.FieldID
                            )

                            ? "field-item active"

                            : "field-item"
                        }

                        onClick={
                          () =>
                            handleSelectField(
                              field.FieldID
                            )
                        }

                      >

                        <img
                          src={
                            fieldImage
                          }
                          alt={
                            field.FieldName
                          }
                        />


                        <div>

                          <strong>
                            {
                              field.FieldName
                            }
                          </strong>

                          <span>
                            {
                              field.FieldType
                            }
                          </span>

                          <span>
                            {
                              field.AvailableCount
                            }
                            {" "}khung giờ trống
                          </span>

                        </div>

                      </button>

                    )
                  )
=======
                  availability
                    ?.FieldName ||
                  `Sân ${fieldId}`
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
                }
              </h1>

              {
<<<<<<< HEAD
                loading
                  ? (

                    <div
                      className="
                      booking-state-card
                    "
                    >

                      <LoaderCircle
                        size={30}
                      />

                      <h2>
                        Đang tải lịch sân...
                      </h2>

                    </div>

                  )
                  : error
                    ? (

                      <div
                        className="
                        booking-state-card
                      "
                      >

                        <h2>
                          Không thể tải lịch sân
                        </h2>

                        <p>
                          {error}
                        </p>

                      </div>

                    )
                    : currentField
                      ? (

                        <>

                          {/* HEADER */}

                          <div
                            className="
                            booking-header-card
                          "
                          >

                            <div>

                              <h1>
                                CHỌN KHUNG GIỜ
                              </h1>


                              <div
                                className="
                                booking-meta
                              "
                              >

                                <span>

                                  Sân:

                                  <strong>
                                    {" "}
                                    {
                                      currentField
                                        .FieldName
                                    }
                                  </strong>

                                </span>


                                <span>

                                  Loại:

                                  <strong>
                                    {" "}
                                    {
                                      currentField
                                        .FieldType
                                    }
                                  </strong>

                                </span>


                                <span>

                                  <MapPin
                                    size={14}
                                  />

                                  {
                                    currentField
                                      .Location
                                  }

                                </span>

                              </div>

                            </div>


                            <div
                              className="date-btn"
                            >

                              <CalendarDays
                                size={18}
                              />

                              {
                                bookingDate
                              }

                            </div>

                          </div>


                          {/* SLOT */}

                          <div
                            className="schedule-card"
                          >

                            <div
                              className="
                              schedule-head
                            "
                            >

                              <div>
                                KHUNG GIỜ
                              </div>

                              <div>
                                GIÁ
                              </div>

                              <div>
                                TRẠNG THÁI
                              </div>

                            </div>


                            {
                              (
                                currentField
                                  .Slots
                                ||
                                []
                              ).map(
                                slot => {

                                  const isSelected =
                                    selectedSlot
                                      ?.PriceID
                                    ===
                                    slot.PriceID;


                                  const disabled =
                                    !slot.available;


                                  return (

                                    <button

                                      key={
                                        slot.PriceID
                                      }

                                      type="button"

                                      disabled={
                                        disabled
                                      }

                                      className={
                                        `schedule-row ${isSelected
                                          ? "selected"
                                          : ""
                                        } ${disabled
                                          ? "disabled"
                                          : ""
                                        }`
                                      }

                                      onClick={
                                        () =>
                                          handleSelectSlot(
                                            slot
                                          )
                                      }

                                    >

                                      <div>

                                        {
                                          slot.StartTime
                                        }

                                        {" - "}

                                        {
                                          slot.EndTime
                                        }

                                      </div>


                                      <div>

                                        {
                                          formatPrice(
                                            slot.Price
                                          )
                                        }

                                        đ

                                      </div>


                                      <div
                                        className={
                                          slot.available
                                            ? "status-cell available"
                                            : "status-cell booked"
                                        }
                                      >

                                        {
                                          slot.available
                                            ? "Trống"
                                            : slot.reason
                                              ===
                                              "FIELD_UNAVAILABLE"
                                              ? "Bảo trì"
                                              : "Đã đặt"
                                        }

                                      </div>

                                    </button>

                                  );
                                }
                              )
                            }

                          </div>


                          {/* BOTTOM */}

                          <div
                            className="booking-bottom"
                          >

                            <div>

                              {
                                selectedSlot
                                &&
                                (

                                  <strong>

                                    Tạm tính:{" "}

                                    {
                                      formatPrice(
                                        selectedSlot.Price
                                      )
                                    }

                                    đ

                                  </strong>

                                )
                              }

                            </div>


                            <button

                              type="button"

                              className="
                              continue-btn
                            "

                              disabled={
                                !selectedSlot
                              }

                              onClick={
                                handleContinue
                              }

                            >

                              Tiếp tục thanh toán

                              <ArrowRight
                                size={19}
                              />

                            </button>

                          </div>

                        </>

                      )
                      : (

                        <div>
                          Không tìm thấy sân.
                        </div>

                      )
=======
                availability && (
                  <div className="booking-meta">

                    <span>
                      {
                        availability
                          .FieldType ||
                        "Chưa cập nhật loại sân"
                      }
                    </span>

                    <span>
                      {
                        availability
                          .Location ||
                        "Chưa cập nhật địa điểm"
                      }
                    </span>

                  </div>
                )
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
              }

            </div>


            <div className="booking-date-control">

              <label htmlFor="booking-date">
                <CalendarDays
                  size={18}
                />

                Ngày đặt sân
              </label>

              <input
                id="booking-date"
                type="date"

                min={
                  getLocalDateString()
                }

                value={
                  selectedDate
                }

                onChange={
                  handleDateChange
                }
              />

            </div>

          </section>


          {/* ===============================================
              CONFLICT MESSAGE
          =============================================== */}

          {
            location.state
              ?.bookingConflict && (

              <div className="booking-alert booking-alert-warning">

                Khung giờ vừa được
                người khác đặt.
                Lịch sân đã được
                tải lại, vui lòng
                chọn một khung giờ khác.

              </div>
            )
          }


          {/* ===============================================
              SELECT DATE
          =============================================== */}

          {
            !selectedDate && (

              <div className="booking-state-card">

                Hãy chọn ngày để
                kiểm tra lịch trống
                của sân.

              </div>
            )
          }


          {/* ===============================================
              LOADING
          =============================================== */}

          {
            selectedDate &&
            loading && (

              <div className="booking-state-card">

                <RefreshCw
                  size={20}
                  className="booking-spin"
                />

                Đang kiểm tra
                lịch sân...

              </div>
            )
          }


          {/* ===============================================
              ERROR
          =============================================== */}

          {
            selectedDate &&
            !loading &&
            error && (

              <div className="booking-alert booking-alert-error">

                {error}

              </div>
            )
          }


          {/* ===============================================
              FIELD UNAVAILABLE
          =============================================== */}

          {
            selectedDate &&
            !loading &&
            !error &&
            availability &&
            availability
              .FieldAvailable ===
              false && (

              <div className="booking-alert booking-alert-error">

                Sân hiện không hoạt
                động hoặc đang bảo trì
                và không thể đặt.

              </div>
            )
          }


          {/* ===============================================
              SLOTS
          =============================================== */}

          {
            selectedDate &&
            !loading &&
            !error &&
            availability &&
            availability
              .FieldAvailable !==
              false && (

              <section className="booking-schedule">

                <div className="booking-schedule-header">

                  <div>
                    KHUNG GIỜ
                  </div>

                  <div>
                    GIÁ
                  </div>

                  <div>
                    TRẠNG THÁI
                  </div>

                </div>


                {
                  slots.length === 0 ? (

                    <div className="booking-no-slot">

                      Sân chưa có
                      khung giờ để đặt.

                    </div>

                  ) : (

                    slots.map(
                      (slot) => {

                        const selected =
                          selectedSlot
                            ?.key ===
                          slot.key;


                        return (

                          <button
                            type="button"

                            key={
                              slot.key
                            }

                            disabled={
                              !slot.available
                            }

                            className={
                              [
                                "booking-slot-row",

                                slot.available
                                  ? "available"
                                  : "booked",

                                selected
                                  ? "selected"
                                  : "",
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(" ")
                            }

                            onClick={() =>
                              handleSelectSlot(
                                slot
                              )
                            }
                          >

                            <div className="booking-slot-time">

                              {
                                slot.StartTime
                              }

                              {" - "}

                              {
                                slot.EndTime
                              }

                            </div>


                            <div className="booking-slot-price">

                              {
                                formatPrice(
                                  slot.Price
                                )
                              }
                              đ

                            </div>


                            <div className="booking-slot-status">

                              {
                                slot.available
                                  ? selected
                                    ? "Đã chọn"
                                    : "Trống"
                                  : "Đã đặt"
                              }

                            </div>

                          </button>
                        );
                      }
                    )
                  )
                }

              </section>
            )
          }


          {/* ===============================================
              SELECTED SLOT
          =============================================== */}

          {
            selectedSlot && (

              <section className="booking-selected-summary">

                <div>

                  <span>
                    Khung giờ đã chọn
                  </span>

                  <strong>
                    {
                      selectedSlot
                        .StartTime
                    }

                    {" - "}

                    {
                      selectedSlot
                        .EndTime
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Giá
                  </span>

                  <strong>
                    {
                      formatPrice(
                        selectedSlot
                          .Price
                      )
                    }
                    đ
                  </strong>

                </div>


                <button
                  type="button"
                  className="booking-primary-button"

                  onClick={
                    handleContinue
                  }
                >
                  Tiếp tục xác nhận

                  <ArrowRight
                    size={18}
                  />
                </button>

              </section>
            )
          }

        </div>

      </main>
    </>
  );
}


export default Booking;