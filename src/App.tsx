/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Printer,
  ChevronRight,
  UserCircle,
  LogOut,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  X,
  CreditCard,
  Phone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line
} from 'recharts';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

type Role = 'Quản trị' | 'Sale' | 'Sản xuất';

type ProductCategory = string;
type PrintProcessing = string;
type ProcessingOption = 'Cán màng' | 'Bế' | 'Ép kim' | 'Phủ UV' | 'Dập nổi' | 'Khoan lỗ';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  salesRep: string;
  status: 'Tiềm năng' | 'Đang chăm sóc' | 'VIP';
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  salesRep: string;
  orderDate: string;
  productCategory: string;
  itemName: string;
  specs: string;
  length?: number;
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
  printProcessing?: string | string[];
  material?: string;
  processingOptions?: ProcessingOption[];
  quantity: number;
  method: 'In nhanh' | 'Offset' | 'Flexo' | 'UV';
  finalPrice: number;
  totalValue: number;
  deposit: number;
  remainingBalance: number;
  status: 'Đã lên đơn' | 'Chờ thiết kế' | 'Chờ sản xuất' | 'Đã đóng hàng' | 'Hoàn thành';
  statusUpdatedAt: string;
  costPrice?: number;
  profit?: number;
  supplierId?: string;
  materialCost?: number;
  followers: string[]; // List of user emails
}

interface User {
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: string[];
  purchaseValue: number;
  debt: number;
  lastPaymentDate: string;
  orderRefs: string[]; // List of Order IDs
}

interface PriceHistory {
  id: string;
  material: string;
  price: number;
  date: string;
  supplierId: string;
}

interface Material {
  id: string;
  name: string;
  stock: number;
  unit: string;
  category: string;
}

// --- Constants ---

const PRODUCT_CATEGORIES = [
  "Tem void", "In decal", "In mica", "Tem chuyển nhiệt", "Tem PET", 
  "Tem cao thành", "Tem UV-DTF", "Dây treo logo", "Mác da", 
  "Mác satin", "Mác cotton", "Mác vải giấy", "Hộp giấy", 
  "Catalogue", "Card visit", "Tờ rơi"
];

const MATERIALS = [
  "Satin trắng biên bóng 1 mặt", "Satin trắng biên bóng 2 mặt", 
  "Satin đen biên bóng 1 mặt", "Satin đen biên bóng 2 mặt", 
  "Satin đen không biên bóng 1 mặt",
  "Satin trắng không biên bóng 1 mặt", "Satin trắng không biên bóng 2 mặt",
  "Cotton ngà", "Cotton trắng ngà", "Cotton trắng tinh",
  "Vải giấy", "Vải giấy xé",
  "Cotton lụa ngà", "Cotton lụa trắng",
  "I250", "I300", "C300", "Kraft nhật 120"
];

const PRINT_PROCESSING = [
  "In 1 màu 1 mặt", "In 2 màu 1 mặt", "In 3 màu 1 mặt", 
  "In 1 màu mặt trước 1 màu mặt sau", "In 2 màu mặt trước 1 màu mặt sau", 
  "In 3 màu mặt trước 1 màu mặt sau"
];

// --- Mock Data ---

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'KH001', name: 'May Mặc Việt Tiến', phone: '028 3864 0800', address: '7 Lê Minh Xuân, Q. Tân Bình', salesRep: 'sale1@print.com', status: 'VIP' },
  { id: 'KH002', name: 'Thời Trang Canifa', phone: '1800 6061', address: 'Hà Nội', salesRep: 'sale2@print.com', status: 'VIP' },
  { id: 'KH003', name: 'Local Brand X', phone: '0901 234 567', address: 'TP.HCM', salesRep: 'sale1@print.com', status: 'Tiềm năng' },
];

const MOCK_ORDERS: Order[] = [
  { 
    id: 'DH-001', customerId: 'KH001', customerName: 'May Mặc Việt Tiến', salesRep: 'sale1@print.com', orderDate: '2026-03-20', 
    productCategory: 'Mác satin', itemName: 'Nhãn Satin 2.5cm', specs: 'Satin trắng, in 1 màu đen, cắt nhiệt', quantity: 5000, 
    method: 'Flexo', finalPrice: 450, totalValue: 2250000, deposit: 1125000, remainingBalance: 1125000, 
    status: 'Chờ sản xuất', statusUpdatedAt: '2026-03-18', costPrice: 200, profit: 1250000, processingOptions: ['Khoan lỗ'],
    material: 'Mác satin', printProcessing: 'In 1 màu 1 mặt', followers: []
  },
  { 
    id: 'DH-002', customerId: 'KH002', customerName: 'Thời Trang Canifa', salesRep: 'sale2@print.com', orderDate: '2026-03-21', 
    productCategory: 'Hộp giấy', itemName: 'Hộp Ivory 300', specs: 'Ivory 300, cán mờ 2 mặt, đục lỗ', quantity: 2000, 
    method: 'Offset', finalPrice: 1200, totalValue: 2400000, deposit: 1200000, remainingBalance: 1200000, 
    status: 'Đã lên đơn', statusUpdatedAt: '2026-03-22', costPrice: 600, profit: 1200000, length: 5, width: 9, height: 12, material: 'I300', printProcessing: 'In 2 màu mặt trước 1 màu mặt sau', processingOptions: ['Cán màng', 'Khoan lỗ'], followers: ['sale1@print.com']
  },
  { 
    id: 'DH-003', customerId: 'KH003', customerName: 'Local Brand X', salesRep: 'sale1@print.com', orderDate: '2026-03-15', 
    productCategory: 'In decal', itemName: 'Tem Decal UV', specs: 'Decal trong, in UV 4 màu + lót trắng', quantity: 1000, 
    method: 'UV', finalPrice: 3500, totalValue: 3500000, deposit: 1750000, remainingBalance: 1750000, 
    status: 'Hoàn thành', statusUpdatedAt: '2026-03-20', costPrice: 1500, profit: 2000000, material: 'In decal', printProcessing: 'In 3 màu 1 mặt', processingOptions: ['Phủ UV'], followers: []
  },
];

const MOCK_MATERIALS: Material[] = [
  { id: 'VT001', name: 'Giấy Ivory 300gsm', stock: 500, unit: 'Tờ', category: 'Giấy' },
  { id: 'VT002', name: 'Satin Trắng 2.5cm', stock: 12, unit: 'Cuộn', category: 'Vải' },
  { id: 'VT003', name: 'Mực UV Đen', stock: 5, unit: 'Kg', category: 'Mực' },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'NCC001', name: 'Giấy Hải Âu', phone: '028 1234 5678', address: '123 Đường Hải Âu, Q.12', items: ['Giấy Ivory', 'Giấy Couche'], purchaseValue: 150000000, debt: 25000000, lastPaymentDate: '2026-02-10', orderRefs: ['DH-001'] },
  { id: 'NCC002', name: 'Mực In Đông Á', phone: '028 8765 4321', address: '456 Đường Đông Á, Q. Bình Tân', items: ['Mực Offset', 'Dung môi'], purchaseValue: 85000000, debt: 0, lastPaymentDate: '2026-03-20', orderRefs: [] },
];

const MOCK_USERS: User[] = [
  { email: 'chienlv66@gmail.com', name: 'Lê Văn Chiến', role: 'Quản trị', phone: '0901234567' },
  { email: 'sale1@print.com', name: 'Nguyễn Văn Sale', role: 'Sale', phone: '0907654321' },
  { email: 'prod1@print.com', name: 'Trần Văn Sản Xuất', role: 'Sản xuất', phone: '0908889999' },
];

const MOCK_PRICE_HISTORY: PriceHistory[] = [
  { id: 'PH001', material: 'I300', price: 1200, date: '2026-01-15', supplierId: 'NCC001' },
  { id: 'PH002', material: 'I300', price: 1250, date: '2026-02-20', supplierId: 'NCC001' },
  { id: 'PH003', material: 'C300', price: 1100, date: '2026-03-01', supplierId: 'NCC001' },
];

const STATUS_COLORS: Record<string, string> = {
  'Đã lên đơn': 'bg-blue-100 text-blue-700 border-blue-200',
  'Chờ thiết kế': 'bg-purple-100 text-purple-700 border-purple-200',
  'Chờ sản xuất': 'bg-orange-100 text-orange-700 border-orange-200',
  'Đã đóng hàng': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Hoàn thành': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const ORDER_STATUSES = ['Đã lên đơn', 'Chờ thiết kế', 'Chờ sản xuất', 'Đã đóng hàng', 'Hoàn thành'] as const;

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-emerald-600")} />
    <span className="font-medium">{label}</span>
  </button>
);

const SearchableDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  allowOther = true,
  placeholder = "Chọn hoặc nhập mới...",
  isMulti = false
}: { 
  label: string, 
  options: string[], 
  value: string | string[], 
  onChange: (val: any) => void,
  allowOther?: boolean,
  placeholder?: string,
  isMulti?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const isSelected = (opt: string) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(opt);
    }
    return value === opt;
  };

  const handleSelect = (opt: string) => {
    if (isMulti) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(opt)) {
        onChange(current.filter(i => i !== opt));
      } else {
        onChange([...current, opt]);
      }
    } else {
      onChange(opt);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="space-y-1 relative">
      <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
      <div className="relative">
        <div 
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus-within:ring-2 focus-within:ring-emerald-500 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn("text-sm truncate pr-4", (!value || (isMulti && Array.isArray(value) && value.length === 0)) && "text-slate-400")}>
            {isMulti 
              ? (Array.isArray(value) && value.length > 0 ? value.join(', ') : placeholder)
              : (value || placeholder)}
          </span>
          <ChevronRight size={16} className={cn("transition-transform shrink-0", isOpen && "rotate-90")} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  autoFocus
                  type="text"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && allowOther && search) {
                      handleSelect(search);
                      if (!isMulti) setSearch("");
                    }
                  }}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between",
                      isSelected(opt) ? "bg-emerald-50 text-emerald-600 font-bold" : "hover:bg-slate-50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(opt);
                    }}
                  >
                    {opt}
                    {isSelected(opt) && <CheckCircle2 size={14} />}
                  </button>
                ))
              ) : (
                allowOther && search && (
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 transition-colors border-t border-slate-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(search);
                      if (!isMulti) setSearch("");
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-emerald-600 font-bold">Thêm mới: "{search}"</span>
                      <span className="text-xs text-slate-400 italic">Nhấn để thêm vào danh sách</span>
                    </div>
                  </button>
                )
              )}
              {filteredOptions.length === 0 && !search && (
                <div className="p-4 text-center text-slate-400 text-sm italic">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string, value: string, icon: any, trend?: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<Role>('Quản trị');
  const [showSensitive, setShowSensitive] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showQuickAddCustomer, setShowQuickAddCustomer] = useState(false);
  const [showQuickAddSupplier, setShowQuickAddSupplier] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeliveryNote, setShowDeliveryNote] = useState(false);
  const [selectedOrderForNote, setSelectedOrderForNote] = useState<Order | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>(MOCK_PRICE_HISTORY);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(PRODUCT_CATEGORIES);
  const [dynamicMaterials, setDynamicMaterials] = useState<string[]>(MATERIALS);
  const [dynamicProcessings, setDynamicProcessings] = useState<string[]>(PRINT_PROCESSING);
  const [currentUserEmail, setCurrentUserEmail] = useState('chienlv66@gmail.com');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState<Supplier | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');

  // Form State
  const [formData, setFormData] = useState<Partial<Order>>({
    productCategory: 'Tem void',
    material: 'I250',
    printProcessing: 'In 1 màu 1 mặt',
    method: 'In nhanh',
    status: 'Đã lên đơn',
    orderDate: new Date().toISOString().split('T')[0],
    processingOptions: [],
    quantity: 0,
    finalPrice: 0,
    deposit: 0
  });

  const showProductionDetails = useMemo(() => {
    const hiddenCategories = ["Dịch vụ", "Khác"];
    return !hiddenCategories.includes(formData.productCategory || '');
  }, [formData.productCategory]);

  const calculatedM2 = useMemo(() => {
    if (formData.length && formData.width) {
      // Assuming dimensions are in cm, convert to m2
      return (formData.length * formData.width) / 10000;
    }
    return 0;
  }, [formData.length, formData.width]);

  const isQuantityUnusual = useMemo(() => {
    if (!formData.quantity) return false;
    // Warning if quantity > 10,000 or < 1 (example threshold)
    return formData.quantity > 10000 || formData.quantity < 1;
  }, [formData.quantity]);

  const currentUser = useMemo(() => {
    return users.find(u => u.email === currentUserEmail) || users[0];
  }, [users, currentUserEmail]);

  const isUserAuthorized = useMemo(() => {
    return users.some(u => u.email === currentUserEmail);
  }, [users, currentUserEmail]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatDecimal = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val);
  };

  const handleQuickAddSupplier = (name: string) => {
    const newSupplier: Supplier = {
      id: `NCC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name,
      phone: '',
      address: '',
      items: [],
      purchaseValue: 0,
      debt: 0,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      orderRefs: []
    };
    setSuppliers([...suppliers, newSupplier]);
    setFormData({ ...formData, supplierId: newSupplier.id });
    setShowQuickAddSupplier(false);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForPayment) return;
    
    setSuppliers(suppliers.map(s => {
      if (s.id === selectedSupplierForPayment.id) {
        return { 
          ...s, 
          debt: Math.max(0, s.debt - paymentAmount),
          lastPaymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));
    setShowPaymentModal(false);
    setPaymentAmount(0);
    alert(`Đã thanh toán ${paymentAmount.toLocaleString()}đ cho ${selectedSupplierForPayment.name}`);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const items = (formData.get('items') as string).split(',').map(i => i.trim());

    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, name, phone, address, items } : s));
    } else {
      const newSupplier: Supplier = {
        id: `NCC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name,
        phone,
        address,
        items,
        purchaseValue: 0,
        debt: 0,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        orderRefs: []
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowSupplierForm(false);
    setEditingSupplier(null);
  };

  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `KH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: newCustomerData.name,
      phone: newCustomerData.phone,
      address: newCustomerData.address,
      salesRep: 'sale1@print.com',
      status: 'Tiềm năng'
    };
    setCustomers([...customers, newCustomer]);
    setFormData({ ...formData, customerId: newCustomer.id });
    setShowQuickAddCustomer(false);
    setNewCustomerData({ name: '', phone: '', address: '' });
  };

  // Filtered Orders (Sales Slice logic + Search + Status Filter + Archiving)
  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Role-based filtering
    if (role === 'Sale') {
      result = result.filter(o => o.salesRep === currentUserEmail);
    } else if (role === 'Sản xuất') {
      result = result.filter(o => ['Chờ sản xuất', 'Đã đóng hàng'].includes(o.status));
    }

    // Status Filter (Slices)
    if (statusFilter !== 'All') {
      if (statusFilter === 'Archived') {
        result = result.filter(o => o.status === 'Hoàn thành' && 
          (new Date().getTime() - new Date(o.statusUpdatedAt).getTime()) / (1000 * 3600 * 24) > 30);
      } else {
        result = result.filter(o => o.status === statusFilter);
      }
    } else {
      // Default: Hide archived orders from main view
      result = result.filter(o => !(o.status === 'Hoàn thành' && 
        (new Date().getTime() - new Date(o.statusUpdatedAt).getTime()) / (1000 * 3600 * 24) > 30));
    }

    // Search Filter
    if (orderSearch) {
      const s = orderSearch.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(s) || 
        o.customerName.toLowerCase().includes(s) || 
        o.productCategory.toLowerCase().includes(s) ||
        o.itemName.toLowerCase().includes(s)
      );
    }

    return result;
  }, [orders, role, currentUserEmail, orderSearch, statusFilter]);

  // Form State
  const copyZaloSummary = (order: Order) => {
    const summary = `
📦 XÁC NHẬN ĐƠN HÀNG: ${order.id}
👤 Khách hàng: ${order.customerName}
📅 Ngày đặt: ${order.orderDate}
🏷️ Sản phẩm: ${order.itemName} (${order.productCategory})
📏 Quy cách: ${order.specs}
🔢 Số lượng: ${order.quantity.toLocaleString('vi-VN')}
💰 Đơn giá: ${order.finalPrice.toLocaleString('vi-VN')}đ
💵 Tổng cộng: ${order.totalValue.toLocaleString('vi-VN')}đ
💳 Tạm ứng: ${order.deposit.toLocaleString('vi-VN')}đ
💸 Còn lại: ${order.remainingBalance.toLocaleString('vi-VN')}đ
🚀 Trạng thái: ${order.status}
    `.trim();
    
    navigator.clipboard.writeText(summary);
    alert('Đã sao chép tóm tắt đơn hàng để gửi Zalo!');
  };

  const handleExportCSV = () => {
    const headers = ["Mã Đơn", "Khách hàng", "Sản phẩm", "Số lượng", "Đơn giá", "Tổng cộng", "Trạng thái", "Ngày đặt"];
    const rows = orders.map(order => [
      order.id,
      order.customerName,
      order.itemName,
      order.quantity,
      order.finalPrice,
      order.totalValue,
      order.status,
      order.orderDate
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const totalValue = (formData.quantity || 0) * (formData.finalPrice || 0);
    const customer = customers.find(c => c.id === formData.customerId);
    
    const newOrder: Order = {
      ...formData as Order,
      id: editingOrder?.id || formData.id || `DH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerName: customer?.name || 'Khách lẻ',
      salesRep: customer?.salesRep || currentUserEmail,
      totalValue,
      remainingBalance: totalValue - (formData.deposit || 0),
      profit: totalValue * 0.4, // Mock profit calculation
      statusUpdatedAt: new Date().toISOString().split('T')[0],
      followers: editingOrder?.followers || []
    };

    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? newOrder : o));
    } else {
      setOrders([newOrder, ...orders]);
      
      // Track Price History and Supplier Debt if material cost is provided
      if (newOrder.material && newOrder.materialCost && newOrder.supplierId) {
        const newPriceHistory: PriceHistory = {
          id: `PH-${Math.random().toString(36).substr(2, 9)}`,
          material: newOrder.material,
          price: newOrder.materialCost / newOrder.quantity,
          date: new Date().toISOString().split('T')[0],
          supplierId: newOrder.supplierId
        };
        setPriceHistory([newPriceHistory, ...priceHistory]);
        
        setSuppliers(suppliers.map(s => {
          if (s.id === newOrder.supplierId) {
            return {
              ...s,
              purchaseValue: s.purchaseValue + (newOrder.materialCost || 0),
              debt: s.debt + (newOrder.materialCost || 0),
              orderRefs: [...s.orderRefs, newOrder.id]
            };
          }
          return s;
        }));
      }
      if (!editingOrder) {
        copyZaloSummary(newOrder);
      }
    }
    setShowOrderForm(false);
    setEditingOrder(null);
    setFormData({
      productCategory: 'Tem void',
      material: 'I250',
      printProcessing: 'In 1 màu 1 mặt',
      method: 'In nhanh',
      status: 'Đã lên đơn',
      orderDate: new Date().toISOString().split('T')[0],
      processingOptions: [],
      quantity: 0,
      finalPrice: 0,
      deposit: 0
    });
  };

  const handleFollowOrder = (orderId: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const isFollowing = o.followers.includes(currentUserEmail);
        return {
          ...o,
          followers: isFollowing 
            ? o.followers.filter(e => e !== currentUserEmail)
            : [...o.followers, currentUserEmail]
        };
      }
      return o;
    }));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: typeof ORDER_STATUSES[number]) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return o;
    }));
  };

  const handleExportOrders = () => {
    const headers = ["Mã Đơn", "Khách hàng", "Trạng thái", "Quy cách", "Số lượng", "Đơn giá", "Thành tiền", "Ngày hoàn thành"];
    const rows = filteredOrders.map(o => {
      // Clean specs: only include what's relevant
      let specs = 'Dịch vụ/Khác';
      if (o.material) {
        const dims = [o.length, o.width, o.height].filter(Boolean).join('x');
        specs = `${o.material}${dims ? ' ' + dims : ''}`;
        if (o.printProcessing) specs += ` (${o.printProcessing})`;
      }

      return [
        o.id,
        o.customerName,
        o.status,
        specs,
        o.quantity,
        o.finalPrice,
        o.totalValue,
        o.status === 'Hoàn thành' ? o.statusUpdatedAt : ''
      ];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateOrderSummary = (order: Order) => {
    const specs = [
      order.material,
      order.specs,
      order.processingOptions?.join(', ')
    ].filter(Boolean).join(' | ');

    return `
📦 XÁC NHẬN ĐƠN HÀNG: ${order.id}
👤 Khách hàng: ${order.customerName}
📅 Ngày đặt: ${order.orderDate}
🏷️ Sản phẩm: ${order.itemName} (${order.productCategory})
📏 Quy cách: ${specs}
🔢 Số lượng: ${formatDecimal(order.quantity)} ${order.unit || 'cái'}
💰 Đơn giá: ${formatCurrency(order.finalPrice)}
💵 Tổng cộng: ${formatCurrency(order.totalValue)}
💳 Tạm ứng: ${formatCurrency(order.deposit)}
💸 Còn lại: ${formatCurrency(order.remainingBalance)}
🚀 Trạng thái: ${order.status}
    `.trim();
  };

  const handleShareSummary = (order: Order) => {
    const summary = generateOrderSummary(order);
    navigator.clipboard.writeText(summary);
    alert('Đã sao chép tóm tắt đơn hàng vào bộ nhớ tạm!');
  };

  const revenueData = [
    { name: 'Tháng 1', value: 450 },
    { name: 'Tháng 2', value: 520 },
    { name: 'Tháng 3', value: 610 },
    { name: 'Tháng 4', value: 580 },
  ];

  const bottleneckData = [
    { name: 'Thiết kế', value: 5 },
    { name: 'Đang in', value: 12 },
    { name: 'Gia công', value: 8 },
    { name: 'Đóng gói', value: 3 },
  ];

  const DeliveryNoteModal = ({ order, onClose }: { order: Order, onClose: () => void }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
          <div>
            <h3 className="text-2xl font-bold">PHIẾU GIAO HÀNG</h3>
            <p className="text-emerald-100 text-sm">Mã đơn: {order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Khách hàng</p>
              <p className="text-lg font-bold text-slate-900">{order.customerName}</p>
              <p className="text-sm text-slate-500">{MOCK_CUSTOMERS.find(c => c.id === order.customerId)?.address}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ngày giao</p>
              <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Sản phẩm</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                  <th className="px-4 py-3 text-right">Đơn giá</th>
                  <th className="px-4 py-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-900">{order.itemName}</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                      {order.productCategory} | {order.material} | {order.printProcessing}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold">{order.quantity.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">{order.finalPrice.toLocaleString()}đ</td>
                  <td className="px-4 py-4 text-right font-bold">{order.totalValue.toLocaleString()}đ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tổng giá trị:</span>
              <span className="font-bold text-slate-900">{order.totalValue.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Đã đặt cọc:</span>
              <span className="font-bold text-emerald-600">-{order.deposit.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-lg pt-3 border-t border-slate-200">
              <span className="font-bold text-slate-900">CÒN LẠI CẦN THU:</span>
              <span className="font-black text-red-600">{order.remainingBalance.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <Printer size={20} /> In Phiếu Giao Hàng
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (!isUserAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Truy cập bị từ chối</h2>
            <p className="text-slate-500">Email <span className="font-bold text-slate-900">{currentUserEmail}</span> không có trong hệ thống. Vui lòng liên hệ quản trị viên.</p>
          </div>
          <div className="pt-4">
            <button 
              onClick={() => setCurrentUserEmail('chienlv66@gmail.com')}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Thử lại với Email mặc định
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 fixed h-full z-20">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Printer className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">PrintOS</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={ShoppingCart} label="Đơn hàng" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={Users} label="Khách hàng" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={Package} label="Nhà cung cấp" active={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} />
          <SidebarItem icon={TrendingUp} label="Lịch sử giá" active={activeTab === 'price-history'} onClick={() => setActiveTab('price-history')} />
          <SidebarItem icon={FileText} label="Công nợ" active={activeTab === 'accounting'} onClick={() => setActiveTab('accounting')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl mb-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 mb-3 w-full text-left hover:bg-slate-100 p-2 rounded-xl transition-colors"
            >
              <UserCircle size={32} className="text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{currentUser.role}</p>
              </div>
            </button>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Quản trị">Quyền: Quản trị</option>
              <option value="Sale">Quyền: Sale</option>
              <option value="Sản xuất">Quyền: Sản xuất</option>
            </select>
          </div>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Tổng quan'}
              {activeTab === 'orders' && 'Đơn hàng'}
              {activeTab === 'customers' && 'Khách hàng'}
              {activeTab === 'suppliers' && 'Nhà cung cấp'}
              {activeTab === 'price-history' && 'Lịch sử giá vật tư'}
              {activeTab === 'accounting' && 'Công nợ'}
              {activeTab === 'profile' && 'Hồ sơ người dùng'}
            </h2>
            <p className="text-slate-500 text-sm">Chào mừng bạn trở lại hệ thống quản lý xưởng in.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64 shadow-sm"
              />
            </div>
            <button 
              onClick={() => {
                setEditingOrder(null);
                setShowOrderForm(true);
              }}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
            >
              <Plus size={18} /> Lên đơn mới
            </button>
          </div>
        </header>

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-slate-900">{editingOrder ? 'Chỉnh sửa đơn hàng' : 'Lên đơn hàng mới'}</h3>
                <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-slate-600">
                  <EyeOff size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSaveOrder} className="p-8 space-y-8">
                {/* Section: Thông tin chung */}
                <section>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" /> Thông tin chung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase">Khách hàng</label>
                        <button 
                          type="button"
                          onClick={() => setShowQuickAddCustomer(true)}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus size={12} /> Thêm mới Khách hàng
                        </button>
                      </div>
                      <select 
                        required
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.customerId}
                        onChange={e => {
                          const customerId = e.target.value;
                          const customer = customers.find(c => c.id === customerId);
                          const phone = customer?.phone || "";
                          // Smart Order ID Logic: DH- + last 3 digits of phone or last 3 of random ID
                          const cleanPhone = phone.replace(/[^0-9]/g, '');
                          const suffix = cleanPhone.length >= 3 
                            ? cleanPhone.slice(-3) 
                            : Math.random().toString(36).slice(-3).toUpperCase();
                          const newOrderId = `DH-${suffix}`;
                          setFormData({
                            ...formData, 
                            customerId, 
                            id: newOrderId
                          });
                        }}
                      >
                        <option value="">Chọn khách hàng...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tên sản phẩm</label>
                      <input 
                        required
                        type="text" 
                        placeholder="VD: Thẻ bài Ivory 300"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.itemName}
                        onChange={e => setFormData({...formData, itemName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Ngày đặt hàng</label>
                      <input 
                        type="date" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.orderDate}
                        onChange={e => setFormData({...formData, orderDate: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                {/* Section: Thông tin cơ bản */}
                <section>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" /> Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SearchableDropdown 
                      label="Phân loại sản phẩm"
                      options={dynamicCategories}
                      value={formData.productCategory}
                      onChange={val => {
                        if (val && !dynamicCategories.includes(val)) {
                          setDynamicCategories(prev => [...prev, val]);
                        }
                        setFormData({...formData, productCategory: val});
                      }}
                    />
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Đơn vị tính</label>
                      <input 
                        type="text" 
                        placeholder="VD: cái, bộ, mét"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.unit}
                        onChange={e => setFormData({...formData, unit: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                {/* Section: Thông số sản xuất chi tiết (Show_If Logic) */}
                {showProductionDetails && (
                  <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" /> Thông số sản xuất chi tiết
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SearchableDropdown 
                        label="Chất liệu"
                        options={dynamicMaterials}
                        value={formData.material || ""}
                        onChange={val => {
                          if (val && !dynamicMaterials.includes(val)) {
                            setDynamicMaterials(prev => [...prev, val]);
                          }
                          setFormData({...formData, material: val});
                        }}
                      />
                      <SearchableDropdown 
                        label="Quy cách in & Gia công"
                        options={dynamicProcessings}
                        isMulti={true}
                        value={formData.processingOptions || []}
                        onChange={val => {
                          if (Array.isArray(val)) {
                            const newVals = val.filter(v => !dynamicProcessings.includes(v));
                            if (newVals.length > 0) {
                              setDynamicProcessings(prev => [...prev, ...newVals]);
                            }
                            setFormData({...formData, processingOptions: val});
                          }
                        }}
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Kích thước Dài (cm)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={formData.length ?? ""}
                          onChange={e => {
                            const val = e.target.value === "" ? 0 : Number(e.target.value);
                            setFormData({...formData, length: Math.round(val * 10) / 10});
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Kích thước Rộng (cm)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={formData.width ?? ""}
                          onChange={e => {
                            const val = e.target.value === "" ? 0 : Number(e.target.value);
                            setFormData({...formData, width: Math.round(val * 10) / 10});
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Kích thước Cao (cm)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={formData.height ?? ""}
                          onChange={e => {
                            const val = e.target.value === "" ? 0 : Number(e.target.value);
                            setFormData({...formData, height: Math.round(val * 10) / 10});
                          }}
                        />
                      </div>
                    </div>
                    
                    {calculatedM2 > 0 && (
                      <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                        <TrendingUp size={12} /> [Mẹo 2]: Diện tích: {formatDecimal(calculatedM2)} m²
                      </p>
                    )}

                    <div className="mt-6">
                      <SearchableDropdown 
                        isMulti
                        label="Gia công thêm"
                        options={['Cán màng', 'Bế', 'Ép kim', 'Phủ UV', 'Dập nổi', 'Khoan lỗ']}
                        value={formData.processingOptions || []}
                        onChange={val => setFormData({...formData, processingOptions: val})}
                      />
                    </div>
                  </section>
                )}

                {/* Section: Chi phí & Nhà cung cấp */}
                <section>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" /> Chi phí & Nhà cung cấp
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nhà cung cấp vật tư</label>
                        <button 
                          type="button"
                          onClick={() => setShowQuickAddSupplier(true)}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus size={12} /> Thêm NCC mới
                        </button>
                      </div>
                      <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.supplierId}
                        onChange={e => setFormData({...formData, supplierId: e.target.value})}
                      >
                        <option value="">Chọn nhà cung cấp...</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Giá vốn vật tư (VNĐ)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.materialCost ?? ""}
                        onChange={e => setFormData({...formData, materialCost: e.target.value === "" ? 0 : Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </section>

                {/* Section: Thanh toán */}
                <section>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" /> Thanh toán
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Số lượng</label>
                      <input 
                        required
                        type="number" 
                        step="0.1"
                        className={cn(
                          "w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500",
                          isQuantityUnusual ? "border-orange-300 bg-orange-50" : "border-slate-200"
                        )}
                        value={formData.quantity ?? ""}
                        onChange={e => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          setFormData({...formData, quantity: Math.round(val * 10) / 10});
                        }}
                      />
                      {isQuantityUnusual && (
                        <p className="text-[10px] font-bold text-orange-600 mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> [Mẹo 1]: Xác nhận lại số lượng!
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Giá chốt (VNĐ/ĐV)</label>
                      <input 
                        required
                        type="number" 
                        step="any"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.finalPrice ?? ""}
                        onChange={e => setFormData({...formData, finalPrice: e.target.value === "" ? 0 : Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tạm ứng (VNĐ)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.deposit ?? ""}
                        onChange={e => setFormData({...formData, deposit: e.target.value === "" ? 0 : Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-emerald-800">Tổng giá trị dự kiến:</span>
                    <span className="text-xl font-black text-emerald-600">
                      {formatCurrency((formData.quantity || 0) * (formData.finalPrice || 0))}
                    </span>
                  </div>
                </section>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                  >
                    Lưu Đơn Hàng
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="px-8 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Dashboard Search Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Tra cứu nhanh đơn hàng (Mã đơn, Tên khách, Sản phẩm)..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setActiveTab('orders');
                  }}
                />
              </div>
              <button 
                onClick={() => setActiveTab('orders')}
                className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <Filter size={18} /> Lọc chi tiết
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Doanh thu tháng" 
                value={`${(orders.reduce((acc, o) => acc + o.totalValue, 0) / 1000000).toFixed(1)}M VNĐ`} 
                icon={TrendingUp} 
                trend="+12.5%" 
                color="bg-emerald-500" 
              />
              <StatCard 
                title="Đơn đang chạy" 
                value={orders.filter(o => !['Hoàn thành'].includes(o.status)).length.toString()} 
                icon={ShoppingCart} 
                color="bg-blue-500" 
              />
              <StatCard 
                title="Công nợ phải thu" 
                value={`${(orders.reduce((acc, o) => acc + o.remainingBalance, 0) / 1000000).toFixed(1)}M VNĐ`} 
                icon={AlertCircle} 
                color="bg-orange-500" 
              />
              <StatCard 
                title="Đã hoàn tất" 
                value={orders.filter(o => o.status === 'Hoàn thành').length.toString()} 
                icon={CheckCircle2} 
                color="bg-indigo-500" 
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-600" /> Xu hướng doanh thu (Triệu VNĐ)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-orange-600" /> Điểm nghẽn sản xuất
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bottleneckData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">Đơn hàng gần đây</h3>
                <button onClick={() => setActiveTab('orders')} className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Mã Đơn</th>
                      <th className="px-6 py-4 font-semibold">Khách hàng</th>
                      <th className="px-6 py-4 font-semibold">Chi tiết</th>
                      <th className="px-6 py-4 font-semibold">Trạng thái</th>
                      <th className="px-6 py-4 font-semibold text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-600">{order.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{order.customerName}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{order.itemName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">{order.productCategory}</span>
                              {/* Tip 1: Price Variation Warning */}
                              {(() => {
                                const history = priceHistory.filter(h => h.material === order.material);
                                if (history.length > 0 && order.materialCost && order.quantity) {
                                  const currentUnitPrice = order.materialCost / order.quantity;
                                  const lastPrice = history[0].price;
                                  if (currentUnitPrice > lastPrice * 1.05) {
                                    return (
                                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        <AlertCircle size={10} /> GIÁ TĂNG
                                      </span>
                                    );
                                  }
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase border",
                                STATUS_COLORS[order.status]
                              )}>
                                {order.status}
                              </span>
                              {/* Tip 3: Stagnant Order Alert */}
                              {(order.status === 'Sản xuất' || order.status === 'Gia công') && 
                               (new Date().getTime() - new Date(order.statusUpdatedAt).getTime()) / (1000 * 3600 * 24) > 3 && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                                  <Clock size={12} /> NGÂM {Math.floor((new Date().getTime() - new Date(order.statusUpdatedAt).getTime()) / (1000 * 3600 * 24))} NGÀY
                                </span>
                              )}
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ 
                                  width: `${(ORDER_STATUSES.indexOf(order.status as any) + 1) / ORDER_STATUSES.length * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{order.totalValue.toLocaleString()} VNĐ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo Mã đơn, Khách hàng, Sản phẩm..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportOrders}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                  >
                    <Download size={16} /> Xuất Excel
                  </button>
                  {role === 'Quản trị' && (
                    <button 
                      onClick={() => setShowSensitive(!showSensitive)}
                      className="px-4 py-2 text-slate-500 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      {showSensitive ? <EyeOff size={16} /> : <Eye size={16} />} 
                      {showSensitive ? 'Ẩn giá vốn' : 'Hiện giá vốn'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Status Slices (Tabs) */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setStatusFilter('All')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                    statusFilter === 'All' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Tất cả
                </button>
                {ORDER_STATUSES.map(status => (
                  <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                      statusFilter === status ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {status}
                  </button>
                ))}
                <button 
                  onClick={() => setStatusFilter('Archived')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                    statusFilter === 'Archived' ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Lưu trữ (30 ngày+)
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Mã Đơn</th>
                    <th className="px-6 py-4 font-semibold">Chi tiết</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold">Thanh toán</th>
                    {role === 'Quản trị' && showSensitive && (
                      <>
                        <th className="px-6 py-4 font-semibold">Giá vốn</th>
                        <th className="px-6 py-4 font-semibold">Lợi nhuận</th>
                      </>
                    )}
                    <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className={cn(
                      "hover:bg-slate-50 transition-colors",
                      order.status === 'Chờ sản xuất' && (new Date().getTime() - new Date(order.statusUpdatedAt).getTime()) / (1000 * 3600 * 24) > 3 && "bg-yellow-50",
                      order.status === 'Hoàn thành' && order.remainingBalance > 0 && "bg-red-50/50"
                    )}>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-bold text-emerald-600">{order.id}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">{order.orderDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{order.customerName}</span>
                            <a href={`tel:${MOCK_CUSTOMERS.find(c => c.id === order.customerId)?.phone}`} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" title="Gọi khách hàng">
                              <Phone size={12} />
                            </a>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-600 font-medium">{order.itemName}</span>
                            {/* Tip 1: Price Variation Warning */}
                            {(() => {
                              const history = priceHistory.filter(h => h.material === order.material);
                              if (history.length > 0 && order.materialCost && order.quantity) {
                                const currentUnitPrice = order.materialCost / order.quantity;
                                const lastPrice = history[0].price;
                                if (currentUnitPrice > lastPrice * 1.05) {
                                  return (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                      <AlertCircle size={10} /> GIÁ TĂNG
                                    </span>
                                  );
                                }
                              }
                              return null;
                            })()}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{order.productCategory}</span>
                            {order.material && <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">{order.material}</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 italic mt-1 truncate max-w-[200px]">{order.specs}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase border",
                              STATUS_COLORS[order.status]
                            )}>
                              {order.status}
                            </span>
                            {/* Tip 3: Stagnant Order Alert */}
                            {order.status === 'Chờ sản xuất' && 
                             (new Date().getTime() - new Date(order.statusUpdatedAt).getTime()) / (1000 * 3600 * 24) > 3 && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                                <Clock size={12} /> CHẬM TIẾN ĐỘ
                              </span>
                            )}
                          </div>
                          
                          {/* Quick Status Actions */}
                          <div className="flex gap-1">
                            {ORDER_STATUSES.map((status, idx) => {
                              const currentIdx = ORDER_STATUSES.indexOf(order.status as any);
                              if (idx === currentIdx + 1) {
                                return (
                                  <button 
                                    key={status}
                                    onClick={() => handleUpdateOrderStatus(order.id, status)}
                                    className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                                  >
                                    Chuyển: {status}
                                  </button>
                                );
                              }
                              return null;
                            })}
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{ 
                                width: `${(ORDER_STATUSES.indexOf(order.status as any) + 1) / ORDER_STATUSES.length * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold">{order.totalValue.toLocaleString()}</div>
                        <div className={cn(
                          "text-[10px] font-bold mt-1",
                          order.remainingBalance > 0 ? "text-red-500" : "text-emerald-500"
                        )}>
                          {order.remainingBalance > 0 ? `Còn nợ: ${order.remainingBalance.toLocaleString()}` : 'Đã thu đủ'}
                        </div>
                        {order.status === 'Giao hàng' && order.remainingBalance > 0 && (
                          <div className="flex items-center gap-1 text-[9px] text-red-600 font-bold uppercase mt-1">
                            <AlertCircle size={10} /> Nợ quá hạn
                          </div>
                        )}
                      </td>
                      {role === 'Quản trị' && showSensitive && (
                        <>
                          <td className="px-6 py-4 text-sm text-slate-500">{(order.costPrice! * order.quantity).toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">{order.profit?.toLocaleString()}</td>
                        </>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleShareSummary(order)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Chia sẻ Zalo"
                          >
                            <ShoppingCart size={18} />
                          </button>
                          <button 
                            onClick={() => handleFollowOrder(order.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              order.followers.includes(currentUserEmail) 
                                ? "text-emerald-600 bg-emerald-50" 
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            )}
                            title={order.followers.includes(currentUserEmail) ? "Bỏ theo dõi" : "Theo dõi đơn hàng"}
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleShareSummary(order)}
                            className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-bold"
                            title="Chia sẻ xác nhận đơn hàng"
                          >
                            <FileText size={14} /> Xác nhận
                          </button>
                          {order.status === 'Giao hàng' && (
                            <button 
                              title="In phiếu giao hàng"
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedOrderForNote(order);
                                setShowDeliveryNote(true);
                              }}
                            >
                              <Printer size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              const canEdit = role === 'Quản trị' || 
                                             (role === 'Sale' && order.salesRep === currentUserEmail) ||
                                             (role === 'Sản xuất' && (order.status === 'Sản xuất' || order.status === 'Gia công'));
                              
                              if (!canEdit) {
                                alert('Bạn không có quyền chỉnh sửa đơn hàng này.');
                                return;
                              }
                              
                              setEditingOrder(order);
                              setFormData(order);
                              setShowOrderForm(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-bold"
                          >
                            <Settings size={14} /> Sửa
                          </button>
                          {role === 'Quản trị' && (
                            <button 
                              onClick={() => {
                                if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
                                  setOrders(orders.filter(o => o.id !== order.id));
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa đơn hàng"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_MATERIALS.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <Package size={20} className="text-slate-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h4>
                <p className="text-slate-500 text-xs mb-4">Mã: {item.id}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className={cn(
                      "text-2xl font-bold",
                      item.stock < 10 ? "text-red-500" : "text-slate-900"
                    )}>{item.stock}</span>
                    <span className="text-slate-400 text-sm font-medium ml-1">{item.unit}</span>
                  </div>
                  {item.stock < 10 && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle size={10} /> Sắp hết hàng
                    </span>
                  )}
                </div>
                <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", item.stock < 10 ? "bg-red-500" : "bg-emerald-500")} 
                    style={{width: `${Math.min(100, (item.stock / 100) * 100)}%`}} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <UserCircle size={64} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{currentUser.name}</h3>
                  <p className="text-slate-500 font-medium">{currentUser.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Họ và tên</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={currentUser.name}
                    onChange={(e) => {
                      setUsers(users.map(u => u.email === currentUserEmail ? { ...u, name: e.target.value } : u));
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={currentUser.phone}
                    onChange={(e) => {
                      setUsers(users.map(u => u.email === currentUserEmail ? { ...u, phone: e.target.value } : u));
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Chức vụ</label>
                  <select 
                    disabled={role !== 'Quản trị'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    value={currentUser.role}
                    onChange={(e) => {
                      setUsers(users.map(u => u.email === currentUserEmail ? { ...u, role: e.target.value as Role } : u));
                    }}
                  >
                    <option value="Quản trị">Quản trị</option>
                    <option value="Sale">Sale</option>
                    <option value="Sản xuất">Sản xuất</option>
                  </select>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    type="button"
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                    onClick={() => alert('Đã cập nhật thông tin hồ sơ!')}
                  >
                    Cập nhật hồ sơ
                  </button>
                </div>
              </form>
            </div>

            {role === 'Quản trị' && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quản lý nhân viên</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Nhân viên</th>
                        <th className="px-6 py-4 font-semibold">Email</th>
                        <th className="px-6 py-4 font-semibold">Chức vụ</th>
                        <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(user => (
                        <tr key={user.email} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                          <td className="px-6 py-4 text-slate-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              className="text-emerald-600 font-bold text-xs hover:underline"
                              onClick={() => {
                                setCurrentUserEmail(user.email);
                                setRole(user.role);
                              }}
                            >
                              Chỉnh sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Tổng công nợ nhà cung cấp</h3>
                <p className="text-3xl font-black text-red-600">
                  {suppliers.reduce((acc, s) => acc + s.debt, 0).toLocaleString()}đ
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Nhà cung cấp nợ nhiều nhất</h3>
                <p className="text-xl font-bold text-slate-900">
                  {suppliers.sort((a, b) => b.debt - a.debt)[0]?.name}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nhà cung cấp</th>
                      <th className="px-6 py-4 font-semibold">Liên hệ</th>
                      <th className="px-6 py-4 font-semibold">Mặt hàng</th>
                      <th className="px-6 py-4 font-semibold text-right">Giá trị mua</th>
                      <th className="px-6 py-4 font-semibold text-right">Công nợ</th>
                      <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {suppliers.map(supplier => (
                      <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className={cn(
                            "text-sm font-bold",
                            // Tip 2: Overdue Debt Highlighting
                            supplier.debt > 0 && (new Date().getTime() - new Date(supplier.lastPaymentDate).getTime()) / (1000 * 3600 * 24) > 30 
                              ? "text-red-600 font-black" 
                              : "text-slate-900"
                          )}>
                            {supplier.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">{supplier.id}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{supplier.address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-slate-600">{supplier.phone}</div>
                            <a href={`tel:${supplier.phone}`} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" title="Gọi nhà cung cấp">
                              <Phone size={12} />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {supplier.items.map(item => (
                              <span key={item} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{item}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{supplier.purchaseValue.toLocaleString()}đ</td>
                        <td className="px-6 py-4 text-sm font-bold text-right text-red-600">{supplier.debt.toLocaleString()}đ</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setSelectedSupplierForPayment(supplier);
                                setShowPaymentModal(true);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg transition-colors text-xs font-bold hover:bg-emerald-700"
                            >
                              <CreditCard size={14} /> Thanh toán
                            </button>
                            <button 
                              onClick={() => {
                                setEditingSupplier(supplier);
                                setShowSupplierForm(true);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-bold"
                            >
                              <Settings size={14} /> Sửa
                            </button>
                            {role === 'Quản trị' && (
                              <button 
                                onClick={() => {
                                  if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
                                    setSuppliers(suppliers.filter(s => s.id !== supplier.id));
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'price-history' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Vật tư</th>
                    <th className="px-6 py-4 font-semibold">Nhà cung cấp</th>
                    <th className="px-6 py-4 font-semibold">Ngày cập nhật</th>
                    <th className="px-6 py-4 font-semibold text-right">Đơn giá</th>
                    <th className="px-6 py-4 font-semibold text-right">Biến động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceHistory.map((history, idx) => {
                    const prevPrice = priceHistory.find((h, i) => h.material === history.material && i > idx)?.price;
                    const diff = prevPrice ? ((history.price - prevPrice) / prevPrice) * 100 : 0;
                    
                    return (
                      <tr key={history.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{history.material}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {suppliers.find(s => s.id === history.supplierId)?.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{new Date(history.date).toLocaleDateString('vi-VN')}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">{history.price.toLocaleString()}đ</td>
                        <td className="px-6 py-4 text-right">
                          {diff !== 0 && (
                            <span className={cn(
                              "text-xs font-bold flex items-center justify-end gap-1",
                              diff > 0 ? "text-red-600" : "text-emerald-600"
                            )}>
                              {diff > 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
                            </span>
                          )}
                          {diff === 0 && <span className="text-slate-400 text-xs">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowQuickAddCustomer(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
              >
                <Plus size={18} /> Thêm mới Khách hàng
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Tên khách hàng</th>
                      <th className="px-6 py-4 font-semibold">Liên hệ</th>
                      <th className="px-6 py-4 font-semibold text-right">Tổng đơn</th>
                      <th className="px-6 py-4 font-semibold text-right">Giá trị trọn đời</th>
                      <th className="px-6 py-4 font-semibold">Trạng thái</th>
                      <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map(customer => {
                      const customerOrders = orders.filter(o => o.customerId === customer.id);
                      const totalOrders = customerOrders.length;
                      const lifetimeValue = customerOrders.reduce((sum, o) => sum + o.totalValue, 0);
                      return (
                        <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-slate-900">{customer.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">{customer.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600">{customer.phone}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{customer.address}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right">{totalOrders}</td>
                          <td className="px-6 py-4 text-sm font-bold text-right text-emerald-600">{lifetimeValue.toLocaleString()}đ</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase border",
                              customer.status === 'VIP' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"
                            )}>
                              {customer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-bold">
                                <Settings size={14} /> Sửa
                              </button>
                              {role === 'Quản trị' && (
                                <button 
                                  onClick={() => {
                                    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
                                      setCustomers(customers.filter(c => c.id !== customer.id));
                                    }
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa khách hàng"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounting' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                  <AlertCircle size={20} /> Công nợ phải thu
                </h3>
                <div className="space-y-4">
                  {orders.filter(o => o.remainingBalance > 0).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{order.remainingBalance.toLocaleString()} VNĐ</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={20} /> Thu chi gần đây
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">May Mặc Việt Tiến</p>
                      <p className="text-[10px] text-slate-400 font-mono">Tạm ứng cho đơn DH-001</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">+1,125,000 VNĐ</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">2026-03-20</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Quick Add Customer Modal */}
        {showQuickAddCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
                <h3 className="text-lg font-bold">Thêm mới Khách hàng</h3>
                <button onClick={() => setShowQuickAddCustomer(false)} className="text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleQuickAddCustomer} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tên khách hàng</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newCustomerData.name}
                    onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newCustomerData.phone}
                    onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ</label>
                  <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24"
                    value={newCustomerData.address}
                    onChange={e => setNewCustomerData({...newCustomerData, address: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowQuickAddCustomer(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                  >
                    Lưu Khách Hàng
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Supplier Form Modal */}
        {showSupplierForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
                <h3 className="text-lg font-bold">{editingSupplier ? 'Sửa Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp'}</h3>
                <button onClick={() => setShowSupplierForm(false)} className="text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tên nhà cung cấp</label>
                  <input 
                    name="name"
                    required
                    type="text" 
                    defaultValue={editingSupplier?.name}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                  <input 
                    name="phone"
                    required
                    type="text" 
                    defaultValue={editingSupplier?.phone}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ</label>
                  <input 
                    name="address"
                    type="text" 
                    defaultValue={editingSupplier?.address}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mặt hàng (phân cách bằng dấu phẩy)</label>
                  <input 
                    name="items"
                    type="text" 
                    defaultValue={editingSupplier?.items.join(', ')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Lưu thông tin
                  </button>
                  <button type="button" onClick={() => setShowSupplierForm(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quick Add Supplier Modal */}
        {showQuickAddSupplier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Thêm Nhà Cung Cấp Mới</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const name = (e.target as any).supplierName.value;
                handleQuickAddSupplier(name);
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tên nhà cung cấp</label>
                  <input 
                    name="supplierName"
                    required
                    type="text" 
                    placeholder="VD: Giấy Hải Âu"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Thêm ngay
                  </button>
                  <button type="button" onClick={() => setShowQuickAddSupplier(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Modal (Thanh toán) */}
        {showPaymentModal && selectedSupplierForPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Thanh toán công nợ</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl mb-6">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Nhà cung cấp</p>
                <p className="text-lg font-bold text-slate-900">{selectedSupplierForPayment.name}</p>
                <div className="flex justify-between mt-2 pt-2 border-t border-emerald-100">
                  <span className="text-sm text-emerald-700">Nợ hiện tại:</span>
                  <span className="text-sm font-bold text-red-600">{selectedSupplierForPayment.debt.toLocaleString()}đ</span>
                </div>
              </div>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Số tiền thanh toán (VNĐ)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentAmount ?? ""}
                    onChange={e => setPaymentAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                    max={selectedSupplierForPayment.debt}
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  <CreditCard size={20} /> Xác nhận thanh toán
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Note Modal */}
        {showDeliveryNote && selectedOrderForNote && (
          <DeliveryNoteModal 
            order={selectedOrderForNote} 
            onClose={() => {
              setShowDeliveryNote(false);
              setSelectedOrderForNote(null);
            }} 
          />
        )}
      </main>
    </div>
  );
}
