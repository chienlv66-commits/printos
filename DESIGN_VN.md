# Thiết kế Hệ thống Quản lý Xưởng In (AppSheet)

## 1. Cấu trúc Bảng dữ liệu (Database Schema)

### Bảng: KhachHang (Khách hàng)
| ID Cột | Tên Hiển Thị (UI Label) | Kiểu Dữ Liệu | Ghi chú |
| :--- | :--- | :--- | :--- |
| ID_KH | Mã KH | Text (Key) | `UNIQUEID()` |
| Ten_KH | Tên Khách Hàng | Name (Label) | |
| SDT | Số Điện Thoại | Phone | |
| Dia_Chi | Địa Chỉ | Address | |
| Sale_Phu_Trach | Sale Phụ Trách | Ref (Users) | Mặc định: `USEREMAIL()` |
| Trang_Thai_Cham_Soc| Trạng Thái | Enum | Tiềm năng, Đang giao dịch, VIP, Tạm ngưng |

### Bảng: DonHang (Đơn hàng)
| ID Cột | Tên Hiển Thị (UI Label) | Kiểu Dữ Liệu | Công thức / Logic |
| :--- | :--- | :--- | :--- |
| ID_DonHang | Mã Đơn Hàng | Text (Key) | `UNIQUEID()` |
| ID_KH | Khách Hàng | Ref (KhachHang) | |
| Ngay_Len_Don | Ngày Lên Đơn | Date | `TODAY()` |
| Ten_San_Pham | Tên Sản Phẩm | Text (Label) | |
| Quy_Cach_Tom_Tat | Quy Cách | Longtext | Kích thước, Chất liệu, Màu, Cán màng, Ép kim, Bế... |
| So_Luong | Số Lượng | Number | |
| Don_Gia_Chot | Đơn Giá Chốt | Price | Nhập thủ công từ Excel |
| Thanh_Tien | Thành Tiền | Virtual Price | `[So_Luong] * [Don_Gia_Chot]` |
| Tien_Coc | Tiền Cọc (50%) | Price | |
| Con_Lai | Còn Lại | Virtual Price | `[Thanh_Tien] - [Tien_Coc]` |
| Trang_Thai_DH | Trạng Thái | Enum | Xác nhận, Thiết kế, Lệnh in, Gia công sau in, Đóng gói, Giao hàng, Hoàn tất |
| File_Bao_Gia_Goc | File Báo Giá | File | Lưu file Excel/PDF báo giá gốc |

### Bảng: LichSu_Gia (Lịch sử giá)
| ID Cột | Tên Hiển Thị | Kiểu Dữ Liệu | Ghi chú |
| :--- | :--- | :--- | :--- |
| ID_Log | ID | Text (Key) | `UNIQUEID()` |
| ID_DonHang | Mã Đơn | Ref (DonHang) | |
| Gia_Cu | Giá Cũ | Price | |
| Gia_Moi | Giá Mới | Price | |
| Ly_Do | Lý Do | Longtext | |
| Thoi_Gian | Thời Gian | DateTime | `NOW()` |

---

## 2. Công thức Virtual Column (Logic Tiếng Việt)

### Tính số tiền còn lại:
**Tên cột:** `[Con_Lai]`
**Công thức:** `[Thanh_Tien] - [Tien_Coc]`

### Cảnh báo đơn hàng chưa thanh toán:
**Format Rule Condition:**
`AND([Trang_Thai_DH] = "Hoàn tất", [Con_Lai] > 0)`
*(Hiển thị màu đỏ để nhắc nhở thu hồi công nợ)*

---

## 3. Phân quyền & Bảo mật (Security Filters)

### Bộ phận Sale:
1. **Security Filter (Bảng DonHang):**
   `OR(USERROLE() = "Admin", [Sale_Phu_Trach] = USEREMAIL())`
   *(Sale xem được tất cả khách hàng nhưng chỉ thấy đơn hàng của mình)*
2. **Ẩn cột nhạy cảm:**
   Trong phần `Show_If` của các cột Giá Vốn/Lợi Nhuận: `USERROLE() = "Admin"`

---

## 4. Thiết lập Nút bấm (Actions) Tiếng Việt

1. **Nút "Xuất Phiếu Giao Hàng":**
   - **Do this:** `App: generate a PDF file`
   - **Display Name:** `"Xuất Phiếu Giao Hàng"`
   - **Template:** Sử dụng file Excel tiếng Việt với các tag `<<[Ten_KH]>>`, `<<[Ten_San_Pham]>>`, `<<[Con_Lai]>>`.

2. **Nút "Cập Nhật Trạng Thái":**
   - **Display Name:** `"Chuyển Trạng Thái"`
   - **Input:** Chọn bước tiếp theo trong quy trình sản xuất.
