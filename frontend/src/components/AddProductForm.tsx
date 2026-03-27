import React, { useState } from "react";

interface ProductFormProps {
  onAdd: (product: any) => void;
}

export default function AddProductForm({ onAdd }: ProductFormProps) {
  const [tenSP, setTenSP] = useState("");
  const [soLuong, setSoLuong] = useState(1);
  const [quyCach, setQuyCach] = useState("");
  const [donGia, setDonGia] = useState(0);
  const [ghiChu, setGhiChu] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenSP || soLuong <= 0 || donGia <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }
    onAdd({
      ten_sp: tenSP,
      so_luong: soLuong,
      quy_cach: quyCach,
      don_gia: donGia,
      ghi_chu: ghiChu,
    });
    setTenSP("");
    setSoLuong(1);
    setQuyCach("");
    setDonGia(0);
    setGhiChu("");
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow-md mb-6 bg-white flex flex-col gap-3">
      <h2 className="text-lg font-bold">Nhập sản phẩm mới</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={tenSP}
          onChange={(e) => setTenSP(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Số lượng"
          value={soLuong}
          onChange={(e) => setSoLuong(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Quy cách"
          value={quyCach}
          onChange={(e) => setQuyCach(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Đơn giá (VND)"
          value={donGia}
          onChange={(e) => setDonGia(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Ghi chú"
          value={ghiChu}
          onChange={(e) => setGhiChu(e.target.value)}
          className="border p-2 rounded w-full md:col-span-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 w-full md:w-1/4">
        Thêm sản phẩm
      </button>
    </form>
  );
}