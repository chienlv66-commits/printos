// server.js - đặt ở thư mục C:\Users\TUAN\printos
const express = require("express");
const XLSX = require("xlsx");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { fakeAI } = require("./utils/fakeAI"); // giữ nguyên nếu bạn đã có

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static("public"));

// Hàm format số
function formatNumber(num) {
  return Number(num).toLocaleString("vi-VN");
}

// Convert tên → mã (slug)
function toSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

// Tạo mã đơn
function generateOrderId() {
  return "DH" + Date.now();
}

// Đọc bảng giá
function readPricing() {
  const wb = XLSX.readFile("pricing.xlsx");
  const sheet = wb.Sheets["BẢNG GIÁ"];
  return XLSX.utils.sheet_to_json(sheet);
}

// Lưu đơn hàng AI
function saveOrder(order, product) {
  const wb = XLSX.readFile("pricing.xlsx");
  const sheet = wb.Sheets["DON_HANG"];
  let data = sheet ? XLSX.utils.sheet_to_json(sheet) : [];

  const tong = order.tong;
  const gia_nhap = product.gia_von * order.so_luong;
  const loi_nhuan = tong - gia_nhap;

  const newOrder = {
    ma_don: generateOrderId(),
    ngay: new Date().toLocaleString(),
    ten_khach: order.ten_khach,
    sdt: order.sdt || "",
    ma_sp: product.ma_sp,
    ten_sp: product.ten_sp,
    so_luong: order.so_luong,
    don_gia: order.don_gia,
    gia_von: product.gia_von,
    gia_nhap,
    tong,
    loi_nhuan,
    nha_cung_cap: order.nha_cung_cap || "",
    trang_thai: "bao_gia",
    ghi_chu: order.ghi_chu || ""
  };

  data.push(newOrder);
  const newSheet = XLSX.utils.json_to_sheet(data);
  wb.Sheets["DON_HANG"] = newSheet;
  XLSX.writeFile(wb, "pricing.xlsx");

  return newOrder;
}

// Tạo message gửi khách (không hiện giá vốn/lợi nhuận)
function generateMessageForCustomer(order) {
  return `
📋 BÁO GIÁ IN ẤN

Khách hàng: ${order.ten_khach}
Sản phẩm: ${order.ten_sp}
Số lượng: ${order.so_luong}

💰 Đơn giá: ${formatNumber(order.don_gia)}đ
💵 Thành tiền: ${formatNumber(order.tong)}đ

⏱ Thời gian: 2-3 ngày

👉 Anh/chị xác nhận giúp em để lên đơn ạ
  `;
}

// API báo giá AI
app.post("/quote", (req, res) => {
  try {
    const pricing = readPricing();
    const result = fakeAI(pricing, req.body);

    if (result.error) return res.json(result);

    const product = pricing.find(p => p.ma_sp === result.ma_sp);
    const savedOrder = saveOrder(result, product);
    const messageToCustomer = generateMessageForCustomer(savedOrder);

    res.json({
      order: savedOrder,
      message: messageToCustomer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API nhập tay sản phẩm
app.post("/add-product", (req, res) => {
  try {
    const {
      ten_sp,
      so_luong,
      quy_cach,
      don_gia,
      ten_khach,
      sdt,
      nha_cung_cap,
      ghi_chu
    } = req.body;

    const wb = XLSX.readFile("pricing.xlsx");
    const sheet = wb.Sheets["DON_HANG"];
    let data = sheet ? XLSX.utils.sheet_to_json(sheet) : [];

    const tong = Number(don_gia) * Number(so_luong);

    const newOrder = {
      ma_don: generateOrderId(),
      ngay: new Date().toLocaleString(),
      ten_khach: ten_khach || "",
      sdt: sdt || "",
      ma_sp: toSlug(ten_sp),
      ten_sp,
      so_luong,
      don_gia: Number(don_gia),
      gia_von: 0,
      tong,
      loi_nhuan: 0,
      nha_cung_cap: nha_cung_cap || "",
      trang_thai: "bao_gia",
      ghi_chu: ghi_chu || "",
      quy_cach: quy_cach || ""
    };

    data.push(newOrder);
    const newSheet = XLSX.utils.json_to_sheet(data);
    wb.Sheets["DON_HANG"] = newSheet;
    XLSX.writeFile(wb, "pricing.xlsx");

    res.json({
      order: newOrder,
      message: generateMessageForCustomer(newOrder)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API báo cáo
app.get("/report", (req, res) => {
  const wb = XLSX.readFile("pricing.xlsx");
  const sheet = wb.Sheets["DON_HANG"];
  const data = sheet ? XLSX.utils.sheet_to_json(sheet) : [];

  const total = data.reduce((sum, o) => sum + (o.tong || 0), 0);
  const profit = data.reduce((sum, o) => sum + (o.loi_nhuan || 0), 0);

  res.json({
    doanh_thu: total,
    loi_nhuan: profit,
    so_don: data.length,
    data
  });
});

// Dashboard nâng cao
app.get("/dashboard", (req, res) => {
  const wb = XLSX.readFile("pricing.xlsx");
  const sheet = wb.Sheets["DON_HANG"];
  const data = sheet ? XLSX.utils.sheet_to_json(sheet) : [];

  let doanh_thu = 0;
  let loi_nhuan = 0;
  const khachMap = {};
  const nccMap = {};

  data.forEach(d => {
    doanh_thu += d.tong || 0;
    loi_nhuan += d.loi_nhuan || 0;

    if (!khachMap[d.ten_khach]) khachMap[d.ten_khach] = 0;
    khachMap[d.ten_khach] += d.tong || 0;

    if (!nccMap[d.nha_cung_cap]) nccMap[d.nha_cung_cap] = 0;
    nccMap[d.nha_cung_cap] += d.gia_nhap || 0;
  });

  res.json({ doanh_thu, loi_nhuan, so_don: data.length, top_khach: khachMap, top_ncc: nccMap });
});

// Xuất PDF
app.post("/export-pdf", (req, res) => {
  const data = req.body;
  const doc = new PDFDocument();
  const filename = "baogia.pdf";

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(18).text("BAO GIA IN AN", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Khach hang: ${data.ten_khach}`);
  doc.text(`San pham: ${data.ten_sp}`);
  doc.text(`So luong: ${data.so_luong}`);
  doc.moveDown();
  doc.text(`Don gia: ${data.don_gia} VND`);
  doc.text(`Thanh tien: ${data.tong} VND`);
  doc.moveDown();
  doc.text("Cam on quy khach!", { align: "center" });
  doc.end();
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json"));
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.json({ error: "Sai tài khoản hoặc mật khẩu" });

  res.json({ message: "Đăng nhập thành công", user: username });
});

// Run server
app.listen(PORT, () => {
  console.log("Server chạy tại http://localhost:" + PORT);
});