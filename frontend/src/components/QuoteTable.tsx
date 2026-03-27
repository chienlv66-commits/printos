import React, { useState } from "react";

interface QuoteTableProps {
  quoteList: any[];
}

export default function QuoteTable({ quoteList }: QuoteTableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedList = [...quoteList].sort((a, b) => {
    if (!sortField) return 0;
    if (typeof a[sortField] === "number") return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    return sortAsc
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  if (!quoteList || quoteList.length === 0) return <p>Chưa có báo giá nào</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("ten_sp")}>Tên sản phẩm</th>
            <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("so_luong")}>Số lượng</th>
            <th className="border px-3 py-2">Quy cách</th>
            <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("don_gia")}>Đơn giá</th>
            <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("tong")}>Giá bán</th>
            <th className="border px-3 py-2">Ghi chú</th>
            <th className="border px-3 py-2">Tin nhắn gửi khách</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((q, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{q.ten_sp}</td>
              <td className="border px-3 py-2">{q.so_luong}</td>
              <td className="border px-3 py-2">{q.quy_cach}</td>
              <td className="border px-3 py-2">{q.don_gia.toLocaleString()} VND</td>
              <td className="border px-3 py-2">{(q.so_luong * q.don_gia).toLocaleString()} VND</td>
              <td className="border px-3 py-2">{q.ghi_chu}</td>
              <td className="border px-3 py-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => navigator.clipboard.writeText(q.messageToCustomer)}
                >
                  Sao chép
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}