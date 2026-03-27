import AddProductForm from "./components/AddProductForm";

function App() {
  return (
    <div>
      <h1>Nhập sản phẩm mới</h1>
      <AddProductForm />
    </div>
  );
}

export default App;
function App() {
  const [quote, setQuote] = useState<Quote | null>(null);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Nhập sản phẩm mới</h1>
      <AddProductForm onQuote={setQuote} />

      <h2 className="text-lg font-semibold mt-6">Bảng báo giá AI (cho bạn xem)</h2>
      <QuoteTable quote={quote} />

      {quote && (
        <div className="mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => navigator.clipboard.writeText(quote.messageToCustomer)}
          >
            Sao chép báo giá gửi khách
          </button>
        </div>
      )}
    </div>
  );
}