import { apiRequest } from "./api";

export const bookingGroups = [
  ["completedPaid", "Hoàn thành", "success"],
  ["deposited", "Đã cọc", "pending"],
  ["cancelled", "Đã hủy", "cancelled"],
];

export function bookingGroupTotal(breakdown) {
  if (!bookingGroups.every(([key]) => Number.isInteger(breakdown?.[key]) && breakdown[key]>=0)) return null;
  return bookingGroups.reduce((total,[key]) => total+breakdown[key],0);
}

export const getReportSummary = (range, options = {}) =>
  apiRequest(`/api/admin/reports/summary?${new URLSearchParams(range)}`, options);

// Quote every cell and neutralize spreadsheet formulas in database text.
export function reportCsv(report) {
  const rows = [
    ["Báo cáo thống kê", report.from, report.to],
    ["Ngày giờ", "Giờ lưu trong database (database-local)"],
    ["Tiền đã thu (VND)", report.grossRevenue], ["Đã hoàn cọc (VND)", report.refundedAmount],
    ["Doanh thu thuần (VND)", report.revenue], ["Số đơn hoàn thành và đã thu đủ tiền theo ngày đặt sân", report.bookingCount],
    ["Hóa đơn phát hành", report.invoiceCount], [],
    ["Tổng hợp đơn theo ngày đặt sân", "Số lượng"],
    ...bookingGroups.map(([key,label]) => [label, report.bookingBreakdown[key]]),
    ["Tổng 3 nhóm", bookingGroupTotal(report.bookingBreakdown)], [],
    ["Ngày", "Đã thu", "Đã hoàn", "Thuần"],
    ...report.dailyRevenue.map(row => [row.date, row.grossRevenue, row.refundedAmount, row.revenue]), [],
    ["Mã sân", "Sân", "Giờ đã đặt (gộp trùng)", "Giờ khả dụng quy ước 24h/ngày", "Tỷ lệ (%)"],
    ...report.fieldUtilization.map(row => [row.fieldId, row.fieldName, row.bookedHours, row.capacityHours, row.utilizationPercent]), [],
    ["Trạng thái hóa đơn", "Số lượng (theo ngày phát hành)"], ...Object.entries(report.invoiceStatusCount),
  ];
  return "\uFEFF" + rows.map(row => row.map(value => {
    let text = String(value ?? "");
    if (typeof value === "string" && /^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
    return `"${text.replaceAll('"', '""')}"`;
  }).join(",")).join("\r\n");
}
