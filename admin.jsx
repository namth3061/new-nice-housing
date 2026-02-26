import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  Users, 
  TicketPercent, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Briefcase,
  Sparkles,
  Trash2,
  Edit3,
  MapPin
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

// --- UTILS ---
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const THEME_COLOR = "#F5D060";

// --- MOCK DATA ---
const REVENUE_DATA = [
  { name: 'Th1', revenue: 40000000, bookings: 240 },
  { name: 'Th2', revenue: 30000000, bookings: 198 },
  { name: 'Th3', revenue: 20000000, bookings: 150 },
  { name: 'Th4', revenue: 27800000, bookings: 210 },
  { name: 'Th5', revenue: 18900000, bookings: 120 },
  { name: 'Th6', revenue: 23900000, bookings: 170 },
  { name: 'Th7', revenue: 34900000, bookings: 250 },
];

const INITIAL_PROPERTIES = [
  { id: 1, name: 'Luxury Ocean Villa', location: 'Sơn Trà, Đà Nẵng', price: 5500000, status: 'Active', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80' },
  { id: 2, name: 'Mountain Retreat Cabin', location: 'Phường 10, Đà Lạt', price: 2200000, status: 'Draft', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80' },
];

const INITIAL_BOOKINGS = [
  { id: 'BK-1001', guest: 'Nguyễn Văn A', property: 'Luxury Ocean Villa', date: '2024-05-15', total: 11000000, status: 'Confirmed' },
  { id: 'BK-1002', guest: 'Trần Thị B', property: 'Mountain Retreat Cabin', date: '2024-05-16', total: 4400000, status: 'Pending' },
  { id: 'BK-1003', guest: 'Lê Văn C', property: 'Luxury Ocean Villa', date: '2024-05-18', total: 16500000, status: 'Cancelled' },
];

const INITIAL_AMENITIES = [
  { id: 1, name: 'Wifi', icon: 'Wifi' },
  { id: 2, name: 'Hồ bơi', icon: 'Waves' },
  { id: 3, name: 'Bãi đỗ xe', icon: 'Car' },
  { id: 4, name: 'Bữa sáng', icon: 'Coffee' },
  { id: 5, name: 'Điều hòa', icon: 'Wind' },
];

// --- COMPONENTS ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Chỗ nghỉ', icon: Building2 },
    { id: 'amenities', label: 'Tiện ích', icon: Sparkles },
    { id: 'bookings', label: 'Đơn hàng', icon: CalendarCheck },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'promotions', label: 'Khuyến mãi', icon: TicketPercent },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col z-40">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2" style={{ color: THEME_COLOR }}>
        <Briefcase size={28} />
        <span>NiceHousing</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={activeTab === item.id ? { backgroundColor: THEME_COLOR, color: '#0f172a' } : {}}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id ? 'shadow-lg shadow-black/20 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-900" style={{ backgroundColor: THEME_COLOR }}>A</div>
          <div>
            <p className="text-sm font-semibold">Quản trị viên</p>
            <p className="text-xs text-slate-500">NiceHousing Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h2>
      <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border">Cập nhật lúc: 14:30 Hôm nay</div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Tổng doanh thu', value: formatVND(542500000), growth: '+12%', icon: DollarSign, color: 'blue' },
        { label: 'Tổng Booking', value: '1,240', growth: '+5.4%', icon: CalendarCheck, color: 'gold' },
        { label: 'Chờ xử lý', value: '42', growth: '-2%', icon: Clock, color: 'gold' },
        { label: 'Người dùng mới', value: '156', growth: '+18%', icon: Users, color: 'purple' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl`} style={{ backgroundColor: stat.color === 'gold' ? `${THEME_COLOR}20` : undefined, color: stat.color === 'gold' ? THEME_COLOR : undefined }}>
              <stat.icon size={24} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {stat.growth}
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
          <p className="text-xl font-bold text-slate-800 mt-1">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Phân tích doanh thu (VNĐ)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} 
                tickFormatter={(value) => `${value/1000000}M`}
              />
              <Tooltip 
                formatter={(value) => formatVND(value)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke={THEME_COLOR} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Booking gần đây</h3>
        <div className="space-y-4">
          {INITIAL_BOOKINGS.slice(0, 5).map((bk) => (
            <div key={bk.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                {bk.guest.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{bk.guest}</p>
                <p className="text-xs text-slate-500 truncate">{bk.property}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{formatVND(bk.total)}</p>
                <p className="text-[10px] uppercase font-bold" style={{ color: THEME_COLOR }}>{bk.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AmenitiesView = ({ amenities, setAmenities }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    if (!inputValue.trim()) return;
    if (editingItem) {
      setAmenities(amenities.map(a => a.id === editingItem.id ? { ...a, name: inputValue } : a));
    } else {
      setAmenities([...amenities, { id: Date.now(), name: inputValue, icon: 'Sparkles' }]);
    }
    setInputValue('');
    setEditingItem(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Tiện ích</h2>
          <p className="text-sm text-slate-500">Quản lý danh mục các dịch vụ đi kèm chỗ nghỉ</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setInputValue(''); setShowModal(true); }}
          style={{ backgroundColor: THEME_COLOR }}
          className="text-slate-900 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:brightness-95 transition-all shadow-md"
        >
          <Plus size={20} />
          <span>Thêm tiện ích</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Icon</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tên tiện ích</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {amenities.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${THEME_COLOR}20`, color: THEME_COLOR }}>
                    <Sparkles size={20} />
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditingItem(item); setInputValue(item.name); setShowModal(true); }} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => setAmenities(amenities.filter(a => a.id !== item.id))} className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold">{editingItem ? 'Cập nhật tiện ích' : 'Thêm tiện ích mới'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Tên tiện ích</label>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none focus:ring-2" 
                  style={{'--tw-ring-color': THEME_COLOR}}
                  placeholder="VD: Phòng Gym, Sauna..." 
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Hủy</button>
              <button onClick={handleSave} style={{ backgroundColor: THEME_COLOR }} className="px-4 py-2 text-sm font-bold text-slate-900 rounded-lg hover:brightness-95">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyView = ({ amenitiesList }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [properties] = useState(INITIAL_PROPERTIES);

  // Geographic State
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedGeo, setSelectedGeo] = useState({ p: '', d: '', w: '' });

  useEffect(() => {
    // Load provinces on mount
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Lỗi tải tỉnh thành:", err));
  }, []);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    setSelectedGeo({ p: code, d: '', w: '' });
    setDistricts([]);
    setWards([]);
    if (code) {
      fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts))
        .catch(err => console.error("Lỗi tải quận huyện:", err));
    }
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    setSelectedGeo(prev => ({ ...prev, d: code, w: '' }));
    setWards([]);
    if (code) {
      fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards))
        .catch(err => console.error("Lỗi tải phường xã:", err));
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h4 className="font-bold text-lg flex items-center gap-2"><MapPin size={20} /> Thông tin cơ bản & Vị trí</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tên chỗ nghỉ</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2" style={{'--tw-ring-color': THEME_COLOR}} placeholder="VD: Beachfront Luxury Villa" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tỉnh / Thành phố</label>
                <select 
                  value={selectedGeo.p}
                  onChange={handleProvinceChange}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2" 
                  style={{'--tw-ring-color': THEME_COLOR}}
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Quận / Huyện</label>
                <select 
                  disabled={!selectedGeo.p}
                  value={selectedGeo.d}
                  onChange={handleDistrictChange}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 disabled:bg-slate-50" 
                  style={{'--tw-ring-color': THEME_COLOR}}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Phường / Xã</label>
                <select 
                  disabled={!selectedGeo.d}
                  value={selectedGeo.w}
                  onChange={(e) => setSelectedGeo(prev => ({ ...prev, w: e.target.value }))}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 disabled:bg-slate-50" 
                  style={{'--tw-ring-color': THEME_COLOR}}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Địa chỉ cụ thể</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2" style={{'--tw-ring-color': THEME_COLOR}} placeholder="Số nhà, tên đường..." />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Mô tả chi tiết</label>
                <textarea 
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 h-32" 
                  style={{'--tw-ring-color': THEME_COLOR}}
                  placeholder="Nhập giới thiệu về chỗ nghỉ của bạn (Tiện ích đặc biệt, vị trí thuận lợi, quy định chung...)"
                ></textarea>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 text-center py-8">
            <h4 className="font-bold text-lg">Hình ảnh</h4>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload size={48} style={{ color: THEME_COLOR }} className="mb-4" />
              <p className="font-medium text-slate-700">Kéo thả ảnh vào đây hoặc click để tải lên</p>
              <p className="text-xs text-slate-400 mt-2">Dung lượng tối đa 5MB/ảnh (Định dạng PNG, JPG)</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h4 className="font-bold text-lg">Chọn tiện ích</h4>
            <div className="grid grid-cols-3 gap-3">
              {amenitiesList.map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded" style={{ accentColor: THEME_COLOR }} />
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h4 className="font-bold text-lg">Giá (VNĐ) & Chính sách</h4>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Giá thuê theo đêm</label>
                <div className="relative">
                  <input type="number" className="w-full pr-12 p-3 border rounded-xl outline-none focus:ring-2" style={{'--tw-ring-color': THEME_COLOR}} placeholder="0" />
                  <span className="absolute right-4 top-3 text-slate-400 font-bold">₫</span>
                </div>
              </div>
              <div className="space-y-1 mt-4">
                <label className="text-sm font-semibold text-slate-700">Số lượng khách tối đa</label>
                <input type="number" className="w-full p-3 border rounded-xl outline-none focus:ring-2" style={{'--tw-ring-color': THEME_COLOR}} placeholder="VD: 4" />
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (showAddForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Đăng chỗ nghỉ mới</h2>
            <p className="text-sm text-slate-500">Hoàn thành các bước để hiển thị tài sản trên NiceHousing</p>
          </div>
        </div>

        {/* Form Steps Indicator */}
        <div className="flex justify-between items-center px-12 relative mb-8">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-10"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-slate-900 -translate-y-1/2 -z-10 transition-all duration-500" style={{ width: `${((currentStep-1)/3)*100}%` }}></div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${currentStep >= s ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
          {renderStep()}
        </div>
        <div className="flex justify-between">
          <button disabled={currentStep === 1} onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30">Quay lại</button>
          <button onClick={() => currentStep < 4 ? setCurrentStep(prev => prev + 1) : setShowAddForm(false)} style={{ backgroundColor: THEME_COLOR }} className="px-10 py-3 text-slate-900 rounded-xl font-bold hover:brightness-95 transition-all shadow-lg shadow-black/5">
            {currentStep === 4 ? 'Xác nhận & Đăng tin' : 'Bước tiếp theo'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Chỗ nghỉ</h2>
          <p className="text-sm text-slate-500">Danh sách tài sản đang được niêm yết</p>
        </div>
        <button onClick={() => setShowAddForm(true)} style={{ backgroundColor: THEME_COLOR }} className="text-slate-900 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:brightness-95 transition-all">
          <Plus size={20} />
          <span>Thêm chỗ nghỉ</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tên & Hình ảnh</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vị trí</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Giá/Đêm</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((prop) => (
              <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={prop.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                    <span className="font-bold text-slate-800">{prop.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  <div className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" /> {prop.location}</div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">{formatVND(prop.price)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prop.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{prop.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BookingView = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h2 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h2>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mã đơn</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Khách hàng</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ngày đặt</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng cộng</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {INITIAL_BOOKINGS.map((bk) => (
            <tr key={bk.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
              <td className="px-6 py-4 font-mono text-sm font-bold text-slate-900 border-l-4 border-transparent hover:border-slate-900">{bk.id}</td>
              <td className="px-6 py-4 font-semibold text-slate-800">{bk.guest}</td>
              <td className="px-6 py-4 text-slate-600">{bk.date}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{formatVND(bk.total)}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border`} style={{ backgroundColor: `${THEME_COLOR}15`, color: '#000', borderColor: `${THEME_COLOR}50` }}>{bk.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [amenities, setAmenities] = useState(INITIAL_AMENITIES);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'properties': return <PropertyView amenitiesList={amenities} />;
      case 'amenities': return <AmenitiesView amenities={amenities} setAmenities={setAmenities} />;
      case 'bookings': return <BookingView />;
      default: return (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed">
          <Clock size={64} className="text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium italic">Tính năng {activeTab} đang được hoàn thiện...</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Cổng Quản Trị</h1>
            <p className="text-lg font-bold text-slate-800 flex items-center gap-2">Hệ thống NiceHousing <ChevronRight size={16} className="text-slate-300" /> {activeTab === 'dashboard' ? 'Tổng quan' : activeTab === 'properties' ? 'Chỗ nghỉ' : 'Hệ thống'}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${THEME_COLOR}40` }}>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: THEME_COLOR }}></div>
              <span className="text-xs font-bold text-slate-600">Máy chủ: Trực tuyến</span>
            </div>
            <button className="w-10 h-10 rounded-full border bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
              <Users size={20} />
            </button>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}