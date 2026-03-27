import { useEffect, useState } from "react";

type Product = {
  ten_sp: string;
  don_gia: number;
  gia_von: number;
};

type FormData = {
  ten_sp: string;
  so_luong: number;
  quy_cach: string;
  don_gia: number | string;
  gia_von: number | string;
  ten_khach: string;
  sdt: string;
  nha_cung_cap: string;
  ghi_chu: string;
};

export default function AddProductForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormData>({
    ten_sp: "",
    so_luong: 1,
    quy_cach: "",
    don_gia: "",
    gia_von: "",
    ten_khach: "",
    sdt: "",
    nha_cung_cap: "",
    ghi_chu: ""
  });

  // Load danh sách sản phẩm từ server
  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => {
      const newForm = { ...prev, [name]: value };

      // Nếu user nhập tên sản phẩm, tự gợi ý don_gia và gia_von
      if (name === "ten_sp") {
        const match = products.find(p => p.ten_sp.toLowerCase() === value.toLowerCase());
        if (match) {
          newForm.don_gia = match.don_gia;
          newForm.gia_von = match.gia_von;
        }
      }

      return newForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      so_luong: Number(form.so_luong),
      don_gia: Number(form.don_gia),
      gia_von: Number(form.gia_von)
    };

    try {
      const res = await fetch("http://localhost:4000/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.error) {
        alert("Lỗi: " + data.error);
      } else {
        alert(`Thêm sản phẩm thành công!\nMã đơn: ${data.order.ma_don}`);
        setForm({
          ten_sp: "",
          so_luong: 1,
          quy_cach: "",
          don_gia: "",
          gia_von: "",
          ten_khach: "",
          sdt: "",
          nha_cung_cap: "",
          ghi_chu: ""
        });
      }
    } catch (err) {
      alert("Lỗi kết nối server: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "20px auto", display: "flex", flexDirection: "column", gap: "8px" }}>
      <input name="ten_sp" value={form.ten_sp} onChange={handleChange} placeholder="Tên sản phẩm" required />
      <input name="so_luong" type="number" value={form.so_luong} onChange={handleChange} placeholder="Số lượng" required />
      <input name="quy_cach" value={form.quy_cach} onChange={handleChange} placeholder="Quy cách" />
      <input name="don_gia" type="number" value={form.don_gia} onChange={handleChange} placeholder="Đơn giá" required />
      <input name="gia_von" type="number" value={form.gia_von} onChange={handleChange} placeholder="Giá vốn" required />
      <input name="ten_khach" value={form.ten_khach} onChange={handleChange} placeholder="Tên khách hàng" />
      <input name="sdt" value={form.sdt} onChange={handleChange} placeholder="SĐT" />
      <input name="nha_cung_cap" value={form.nha_cung_cap} onChange={handleChange} placeholder="Nhà cung cấp" />
      <input name="ghi_chu" value={form.ghi_chu} onChange={handleChange} placeholder="Ghi chú" />
      <button type="submit" style={{ padding: "8px 12px", marginTop: "10px" }}>Thêm sản phẩm</button>
    </form>
  );
}
interface AddProductFormProps {
  onQuote: (quote: Quote) => void;
}

function AddProductForm({ onQuote }: AddProductFormProps) {
  const [ten_sp, setTenSP] = useState("");
  const [so_luong, setSoLuong] = useState(1);
  const [quy_cach, setQuyCach] = useState("");
  const [don_gia, setDonGia] = useState("");
  const [ten_khach, setTenKhach] = useState("");
  const [sdt, setSDT] = useState("");
  const [nha_cung_cap, setNCC] = useState("");
  const [ghi_chu, setGhiChu] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ten_sp,
      so_luong,
      quy_cach,
      don_gia: Number(don_gia),
      ten_khach,
      sdt,
      nha_cung_cap,
      ghi_chu,
    };

    const res = await fetch("http://localhost:4000/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json: Quote = await res.json();
    onQuote(json);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-2 border rounded w-full max-w-md">
      <input type="text" placeholder="Tên sản phẩm" value={ten_sp} onChange={(e) => setTenSP(e.target.value)} className="border px-2 py-1 w-full" required />
      <input type="number" placeholder="Số lượng" value={so_luong} onChange={(e) => setSoLuong(Number(e.target.value))} className="border px-2 py-1 w-full" required />
      <input type="text" placeholder="Quy cách" value={quy_cach} onChange={(e) => setQuyCach(e.target.value)} className="border px-2 py-1 w-full" />
      <input type="number" placeholder="Đơn giá" value={don_gia} onChange={(e) => setDonGia(e.target.value)} className="border px-2 py-1 w-full" />
      <input type="text" placeholder="Tên khách" value={ten_khach} onChange={(e) => setTenKhach(e.target.value)} className="border px-2 py-1 w-full" />
      <input type="text" placeholder="SĐT" value={sdt} onChange={(e) => setSDT(e.target.value)} className="border px-2 py-1 w-full" />
      <input type="text" placeholder="Nhà cung cấp" value={nha_cung_cap} onChange={(e) => setNCC(e.target.value)} className="border px-2 py-1 w-full" />
      <input type="text" placeholder="Ghi chú" value={ghi_chu} onChange={(e) => setGhiChu(e.target.value)} className="border px-2 py-1 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Thêm sản phẩm</button>
    </form>
  );
}