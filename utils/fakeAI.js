function removeAccent(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Parse câu tự nhiên
 */
function parseText(inputText) {
  const text = removeAccent(inputText);

  // tìm số lượng
  const so_luong_match = text.match(/\d+/);
  const so_luong = so_luong_match ? Number(so_luong_match[0]) : 1;

  return {
    text,
    so_luong
  };
}

function fakeAI(pricing, input) {
  let product;

  // 👉 Nếu nhập dạng text
  if (input.text) {
    const parsed = parseText(input.text);

    product = pricing.find(p =>
      parsed.text.includes(removeAccent(p.ten_sp))
    );

    if (!product) {
      return { error: "Không tìm thấy sản phẩm" };
    }

    const don_gia = product.gia_co_ban + product.gia_gia_cong;
    const tong = don_gia * parsed.so_luong;

    return {
      ten_khach: input.ten_khach,
      sdt: input.sdt,
      ma_sp: product.ma_sp,
      ten_sp: product.ten_sp,
      so_luong: parsed.so_luong,
      don_gia,
      tong
    };
  }

  // 👉 fallback (cách cũ)
  if (input.ten_sp) {
    const keyword = removeAccent(input.ten_sp);

    product = pricing.find(p =>
      removeAccent(p.ten_sp).includes(keyword)
    );
  }

  if (!product) {
    return { error: "Không tìm thấy sản phẩm" };
  }

  const don_gia = product.gia_co_ban + product.gia_gia_cong;
  const tong = don_gia * input.so_luong;

  return {
    ten_khach: input.ten_khach,
    sdt: input.sdt,
    ma_sp: product.ma_sp,
    ten_sp: product.ten_sp,
    so_luong: input.so_luong,
    don_gia,
    tong
  };
}

module.exports = { fakeAI };