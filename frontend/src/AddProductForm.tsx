import React, { useState } from "react";

interface AddProductFormProps {
  onAdd: (product: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAdd }) => {
  const [ten_sp, setTenSP] = useState("");
  const [so_luong, setSoLuong] = useState(1);
  const [quy_cach, setQuyCach] = useState("");
  const [don_gia, setDonGia] = useState(0);
  const [ten_khach, setTenKhach] = useState("");
  const [sdt, setSDT] = useState("");
  const [nha_cung_cap, setNCC] = useState("");
  const [ghi_chu, setGhiChu] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = { ten_sp, so_luong, quy_cach, don_gia, ten_khach, sdt, nha_cung_cap, ghi_chu };

    const res = await fetch("http://localhost:4000/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    onAdd(data.order);

    // Reset form
    setTenSP("");
    setSoLuong(1);
    setQuyCach("");
    setDonGia(0);
    setTenKhach("");
    setSDT("");
    setNCC("");
    setGhiChu("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-2">Nhập sản phẩm thủ công</h2>
      <div className="grid grid-cols-2 gap-2">
        <input value={ten_sp} onChange={e => setTenSP(e.target.value)} placeholder="Tên sản phẩm" className="border p-1" required />
        <input type="number" value={so_luong} onChange={e => setSoLuong(Number(e.target.value))} placeholder="Số lượng" className="border p-1" required />
        <input value={quy_cach} onChange={e => setQuyCach(e.target.value)} placeholder="Quy cách" className="border p-1" />
        <input type="number" value={don_gia} onChange={e => setDonGia(Number(e.target.value))} placeholder="Đơn giá" className="border p-1" required />
        <input value={ten_khach} onChange={e => setTenKhach(e.target.value)} placeholder="Tên khách" className="border p-1" />
        <input value={sdt} onChange={e => setSDT(e.target.value)} placeholder="SĐT" className="border p-1" />
        <input value={nha_cung_cap} onChange={e => setNCC(e.target.value)} placeholder="Nhà cung cấp" className="border p-1" />
        <input value={ghi_chu} onChange={e => setGhiChu(e.target.value)} placeholder="Ghi chú" className="border p-1" />
      </div>
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Thêm sản phẩm</button>
    </form>
  );
};

export default AddProductForm;