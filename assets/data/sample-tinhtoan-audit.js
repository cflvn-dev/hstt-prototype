// Audit mock data cho thiết kế mẫu SC-016 (BB-06) - tách ngoài Univer, truy xuất qua CellAuditService.
// Ánh xạ một số cell CÓ DỮ LIỆU THẬT trong Sheet1 của references/sample_tinhtoan.xlsx với thông tin giải trình giả lập.
// Cấu trúc theo CellAuditInfo/AuditInput/CalculationStep của BB-06; sau này thay bằng API:
//   GET /api/calculation-workbooks/{workbookId}/cells/{sheetName}/{cellAddress}/audit
window.G3_SAMPLE_TINHTOAN_AUDIT = {
  "F11": {
    sheetName: "Sheet1", cellAddress: "F11", valueType: "derived",
    displayValue: "10,049246", rawValue: 10.049246,
    metricName: "Giá nhiên liệu khí bình quân trong tháng (Pkhí bq)", period: "Tháng 3/2026 - PM1",
    formulaName: "Giá khí bình quân gia quyền theo nguồn",
    formulaExpression: "Pkhí bq = Σ(Q_nguồn × P_nguồn) / ΣQ_tiêu thụ",
    formulaVersion: "2026.03",
    inputs: [
      { name: "Sản lượng khí Hải Thạch - Mộc Tinh (Q HT-MT)", value: "1.482.914,03", unit: "tr.BTU", sourceType: "raw-data", sourceModule: "Dữ liệu nhiên liệu - tỷ giá (FR-058)", sourceReference: "Bảng tổng hợp phân bổ khí giao nhận (KĐN/PVGas)", period: "Tháng 3/2026", cellReference: "F23" },
      { name: "Giá khí Hải Thạch - Mộc Tinh (P HT-MT)", value: "9,473188", unit: "USD/tr.BTU", sourceType: "contract-config", sourceModule: "Cấu hình hợp đồng (FR-025)", sourceReference: "Hợp đồng SĐBS - bảng giá khí tháng", cellReference: "F14" },
      { name: "Sản lượng khí Đại Hùng (Q ĐH)", value: "256.606,94", unit: "tr.BTU", sourceType: "raw-data", sourceReference: "Bảng tổng hợp phân bổ khí giao nhận", cellReference: "F24" },
      { name: "Giá khí Đại Hùng (P ĐH)", value: "10,385783", unit: "USD/tr.BTU", sourceType: "contract-config", cellReference: "F15" },
      { name: "Sản lượng khí Thiên Ưng (Q TƯ)", value: "190.114,06", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F25" },
      { name: "Giá khí Thiên Ưng (P TƯ)", value: "10,611629", unit: "USD/tr.BTU", sourceType: "contract-config", cellReference: "F16" },
      { name: "Sản lượng khí Sao Vàng - Đại Nguyệt (Q SV-ĐN)", value: "1.964.030,97", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F26" },
      { name: "Giá khí Sao Vàng - Đại Nguyệt (P SV-ĐN)", value: "10,385783", unit: "USD/tr.BTU", sourceType: "contract-config", cellReference: "F17" },
      { name: "Tổng lượng khí tiêu thụ PM1 (ΣQ)", value: "3.893.666", unit: "tr.BTU", sourceType: "calculated-value", sourceModule: "PH-003", cellReference: "F20" }
    ],
    calculationSteps: [
      { order: 1, description: "Tử số = tổng (Q_nguồn × P_nguồn) của các nguồn có sản lượng > 0 (NCS, LNG = 0 nên bị loại)", expression: "1.482.914,03×9,473188 + 256.606,94×10,385783 + 190.114,06×10,611629 + 1.964.030,97×10,385783", result: "≈ 39.129.343 (USD)" },
      { order: 2, description: "Chia tổng lượng khí tiêu thụ", expression: "39.129.343 / 3.893.666", result: "10,0492462..." },
      { order: 3, description: "Làm tròn", expression: "ROUND(x, 6)", result: "10,049246" }
    ],
    roundingRule: "Làm tròn 6 chữ số thập phân",
    calculatedAt: "14/04/2026 09:30",
    sourceModule: "PH-003 - Tính giá Pc (FR-045)",
    sourceDocument: "Biểu giá nhiên liệu bình quân tháng 3/2026 các NMĐ Phú Mỹ"
  },
  "G11": {
    sheetName: "Sheet1", cellAddress: "G11", valueType: "derived",
    displayValue: "10,049246", rawValue: 10.049246,
    metricName: "Giá nhiên liệu khí bình quân trong tháng (Pkhí bq)", period: "Tháng 3/2026 - PM2.1",
    formulaName: "Giá khí bình quân gia quyền theo nguồn (có điều kiện)",
    formulaExpression: "IF(ΣQ_PM2.1 = 0, Pkhí bq PM1, Σ(Q_nguồn × P_nguồn) / ΣQ)",
    formulaVersion: "2026.03",
    inputs: [
      { name: "Tổng lượng khí tiêu thụ PM2.1", value: "794.312,05", unit: "tr.BTU", sourceType: "calculated-value", cellReference: "G20" },
      { name: "Pkhí bq PM1 (dùng khi tổng khí PM2.1 = 0)", value: "10,049246", unit: "USD/tr.BTU", sourceType: "calculated-value", cellReference: "F11" },
      { name: "Sản lượng × giá theo từng nguồn của PM2.1", value: "(xem cột G các dòng 1.x, 2.x)", sourceType: "raw-data", cellReference: "G23" }
    ],
    calculationSteps: [
      { order: 1, description: "Kiểm tra điều kiện tổng lượng khí PM2.1", expression: "794.312,05 khác 0 => tính bình quân gia quyền riêng cho PM2.1" },
      { order: 2, description: "Bình quân gia quyền trên cột G (các nguồn có sản lượng > 0)", result: "10,049246" }
    ],
    roundingRule: "Làm tròn 6 chữ số thập phân",
    calculatedAt: "14/04/2026 09:30",
    sourceModule: "PH-003 - Tính giá Pc (FR-045)",
    sourceDocument: "Biểu giá nhiên liệu bình quân tháng 3/2026 các NMĐ Phú Mỹ"
  },
  "I11": {
    sheetName: "Sheet1", cellAddress: "I11", valueType: "derived",
    displayValue: "10,049246", rawValue: 10.049246,
    metricName: "Giá nhiên liệu khí bình quân - các NMĐ Phú Mỹ", period: "Tháng 3/2026",
    formulaName: "Giá khí bình quân gia quyền toàn cụm",
    formulaExpression: "Σ(Q_i × P_i) / ΣQ_tiêu thụ toàn cụm",
    formulaVersion: "2026.03",
    inputs: [
      { name: "Tổng lượng khí tiêu thụ các NMĐ", value: "5.518.394,05", unit: "tr.BTU", sourceType: "calculated-value", cellReference: "I20" },
      { name: "Sản lượng khí theo nguồn (cột I các dòng 2.x)", value: "-", sourceType: "raw-data", cellReference: "I23" }
    ],
    calculationSteps: [
      { order: 1, description: "Bình quân gia quyền trên cột I", result: "10,049246 (bằng nhau giữa các nhà máy theo nguyên tắc phân bổ)" }
    ],
    roundingRule: "Làm tròn 6 chữ số thập phân",
    sourceModule: "PH-003 - Tính giá Pc (FR-045)",
    sourceDocument: "Biểu giá nhiên liệu bình quân tháng 3/2026 các NMĐ Phú Mỹ"
  },
  "F20": {
    sheetName: "Sheet1", cellAddress: "F20", valueType: "derived",
    displayValue: "3.893.666", rawValue: 3893666,
    metricName: "Tổng lượng khí tiêu thụ trong tháng (ΣQ tiêu thụ)", period: "Tháng 3/2026 - PM1",
    formulaName: "Tổng sản lượng khí theo nguồn",
    formulaExpression: "ΣQ = (2.1) + (2.2) + (2.3) + (2.4) + (2.5) + (2.6) + (2.7)",
    formulaVersion: "2026.03",
    inputs: [
      { name: "Q HT-MT", value: "1.482.914,03", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F23" },
      { name: "Q Đại Hùng", value: "256.606,94", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F24" },
      { name: "Q Thiên Ưng", value: "190.114,06", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F25" },
      { name: "Q SV-ĐN", value: "1.964.030,97", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F26" },
      { name: "Q NCS bao tiêu / trên bao tiêu / LNG", value: "0", unit: "tr.BTU", sourceType: "raw-data", cellReference: "F21" }
    ],
    calculationSteps: [
      { order: 1, description: "Cộng dồn các dòng 2.1 đến 2.7", expression: "1.482.914,03 + 256.606,94 + 190.114,06 + 1.964.030,97 + 0", result: "3.893.666" }
    ],
    roundingRule: "Giữ nguyên đơn vị tr.BTU",
    sourceModule: "Dữ liệu nhiên liệu - tỷ giá (FR-058)",
    sourceDocument: "Bảng tổng hợp phân bổ khí giao nhận với GENCO3 (KĐN/PVGas)"
  },
  "F12": {
    sheetName: "Sheet1", cellAddress: "F12", valueType: "raw",
    displayValue: "9,473188", rawValue: 9.473188,
    metricName: "Giá khí Nam Côn Sơn trong bao tiêu (P hợp đồng NCS)", period: "Tháng 3/2026 - PM1",
    inputs: [
      { name: "Bảng giá khí hợp đồng theo tháng", value: "tra theo tháng thanh toán", sourceType: "contract-config", sourceModule: "Cấu hình hợp đồng (FR-025)", sourceReference: "Hợp đồng SĐBS số 08 cho hợp đồng bán khí NCS" }
    ],
    sourceModule: "Cấu hình hợp đồng (FR-025)",
    sourceDocument: "Hợp đồng SĐBS số 08 - bảng giá khí (sheet GIA KHI HĐ của file gốc)"
  },
  "F23": {
    sheetName: "Sheet1", cellAddress: "F23", valueType: "raw",
    displayValue: "1.482.914,03", rawValue: 1482914.03,
    metricName: "Sản lượng khí Hải Thạch - Mộc Tinh (Q HT-MT)", period: "Tháng 3/2026 - PM1",
    inputs: [
      { name: "Bảng tổng hợp phân bổ khí giao nhận", value: "import file biểu mẫu", sourceType: "raw-data", sourceModule: "Dữ liệu nhiên liệu - tỷ giá (FR-058)", sourceReference: "File KĐN/PVGas tháng 3/2026 (lưu gốc đính kèm)" }
    ],
    sourceModule: "Dữ liệu nhiên liệu - tỷ giá (FR-058)",
    sourceDocument: "Bảng tổng hợp phân bổ khí giao nhận với GENCO3"
  },
  "F31": {
    sheetName: "Sheet1", cellAddress: "F31", valueType: "raw",
    displayValue: "0", rawValue: 0,
    metricName: "Giá dầu cho sản xuất điện - PM1", period: "Tháng 3/2026",
    isOverridden: true,
    warnings: ["Giá trị được nhập tay bằng 0 do trong tháng không vận hành dầu (ví dụ minh họa trạng thái override + warning của bản mẫu)."],
    inputs: [
      { name: "Phiếu xuất kho dầu thực tế", value: "không phát sinh", sourceType: "manual-override", sourceModule: "Dữ liệu nhiên liệu - tỷ giá (FR-058)" }
    ],
    sourceModule: "Dữ liệu nhiên liệu - tỷ giá (FR-058)",
    sourceDocument: "Phiếu xuất kho dầu (không phát sinh trong tháng)"
  }
};
