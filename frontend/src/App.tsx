import React, { useState } from "react";
import AddProductForm from "./components/AddProductForm";
import QuoteTable from "./components/QuoteTable";

export default function App() {
  const [quoteList, setQuoteList] = useState<any[]>([]);

  const handleAddProduct = async (product: any) => {
    try {
      // Gọi backend /quote AI
      const res = await fetch("http://localhost:4000/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();

      const messageToCustomer = data.message;

      setQuoteList((prev) => [
        ...prev,
        { ...product, messageToCustomer, tong: product.so_luong * product.don_gia },
        ...(data.order ? [{ ...data.order, messageToCustomer }] : []),
      ]);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi lấy báo giá AI");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">PrintOS - Báo giá in ấn</h1>
      <AddProductForm onAdd={handleAddProduct} />
      <QuoteTable quoteList={quoteList} />
    </div>
  );
}