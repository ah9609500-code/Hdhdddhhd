import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Package, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Clock, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Tag, 
  Megaphone, 
  Search,
  Check,
  Truck,
  User,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product, ProductCategory, OrderStatus, Coupon } from '../../types/pharmacy';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    updateProductPrice, 
    updateProductStock, 
    deleteProduct,
    orders,
    updateOrderStatus,
    requests,
    fulfillProductRequest,
    coupons,
    addCoupon,
    addPost,
    activityLogs,
    resetDatabaseToDefaults,
    exportDatabaseBackup,
    importDatabaseBackup,
    currentUser
  } = usePharmacy();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'products' | 'orders' | 'expiry_alerts' | 'requests' | 'coupons' | 'posts' | 'analytics' | 'logs'
  >('products');

  // Search in admin products
  const [adminProductSearch, setAdminProductSearch] = useState('');

  // Quick Price Edit Modal
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(0);
  const [newOrigPriceInput, setNewOrigPriceInput] = useState<number>(0);

  // Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    barcode: '',
    nameAr: '',
    nameEn: '',
    genericName: '',
    category: 'medicines' as ProductCategory,
    price: 5000,
    originalPrice: 5000,
    costPrice: 3500,
    stock: 20,
    lowStockThreshold: 5,
    strength: '500mg',
    dosageForm: 'أقراص',
    manufacturer: '',
    expiryDate: '2027-12-31',
    batchNumber: 'BATCH-001',
    description: '',
    usageInstructions: '',
    safetyWarnings: '',
    isPrescriptionRequired: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  });

  // Post announcement state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'tip' | 'announcement' | 'discount'>('announcement');

  // Coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(20000);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormData({
      barcode: `${Date.now()}`.slice(-10),
      nameAr: '',
      nameEn: '',
      genericName: '',
      category: 'medicines',
      price: 5000,
      originalPrice: 5000,
      costPrice: 3500,
      stock: 30,
      lowStockThreshold: 5,
      strength: '500 ملغم',
      dosageForm: 'أقراص',
      manufacturer: 'صناعة دوائية معتمدة',
      expiryDate: '2027-12-31',
      batchNumber: `ALH-${Math.floor(1000 + Math.random() * 9000)}`,
      description: 'دواء أصلي معتمد من وزارة الصحة العراقية.',
      usageInstructions: 'حسب إرشادات الصيدلي أو الطبيب المعالج.',
      safetyWarnings: 'يحفظ بعيداً عن متناول الأطفال وفي مكان بارد وجاف.',
      isPrescriptionRequired: false,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      barcode: prod.barcode,
      nameAr: prod.nameAr,
      nameEn: prod.nameEn,
      genericName: prod.genericName,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      costPrice: prod.costPrice || Math.round(prod.price * 0.7),
      stock: prod.stock,
      lowStockThreshold: prod.lowStockThreshold,
      strength: prod.strength,
      dosageForm: prod.dosageForm,
      manufacturer: prod.manufacturer,
      expiryDate: prod.expiryDate,
      batchNumber: prod.batchNumber,
      description: prod.description,
      usageInstructions: prod.usageInstructions,
      safetyWarnings: prod.safetyWarnings,
      isPrescriptionRequired: prod.isPrescriptionRequired,
      isAvailable: prod.isAvailable,
      image: prod.image,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr.trim() || formData.price <= 0) {
      alert('يرجى التأكد من الاسم العربي والسعر');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        isAvailable: formData.stock > 0,
      });
    } else {
      addProduct({
        ...formData,
        isAvailable: formData.stock > 0,
      });
    }

    setShowProductModal(false);
  };

  // Expiry alerts & low stock
  const today = new Date();
  const nearExpiryProducts = products.filter(p => {
    const exp = new Date(p.expiryDate);
    const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths <= 6; // within 6 months
  });

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  // Financial Analytics Calculations
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const totalCompletedOrders = orders.filter(o => o.status === 'completed').length;
  const estimatedCost = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum;
    return sum + (o.subtotal * 0.7); // Approximate 30% margin
  }, 0);
  const estimatedGrossProfit = Math.max(0, totalRevenue - estimatedCost);

  // Export Analytics CSV
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Order ID,Customer,Phone,Total IQD,Status,Date\n"
      + orders.map(o => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}",${o.total},"${o.status}","${o.createdAt}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alhoud_orders_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-extrabold">
              لوحة الإدارة والتحكم
            </span>
            <span className="text-xs text-slate-300">صيدلية الحود المركزية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            إدارة الصيدلية، المخزون، والأسعار
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            المستخدم النشط: <strong className="text-emerald-400">{currentUser.name}</strong> ({currentUser.role === 'owner' ? 'صاحب الصيدلية' : 'صيدلي موظف'})
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'owner' && (
            <button
              onClick={openAddProductModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة دواء جديد</span>
            </button>
          )}

          <button
            onClick={exportDatabaseBackup}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="تصدير نسخة احتياطية من قاعدة البيانات"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>نسخ احتياطي</span>
          </button>

          {currentUser.role === 'owner' && (
            <button
              onClick={resetDatabaseToDefaults}
              className="bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/50 px-2.5 py-2 rounded-xl text-xs font-bold transition"
              title="إعادة تعيين للبيانات الافتراضية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Subtabs Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'products' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>الأدوية والأسعار ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition relative ${
            activeAdminTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>الطلبات ({orders.length})</span>
          {orders.some(o => o.status === 'new') && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('expiry_alerts')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'expiry_alerts' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
          <span>تنبيهات الصلاحية والرصيد ({nearExpiryProducts.length + lowStockProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('requests')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'requests' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>طلبات الزبائن للأدوية ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'analytics' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>التقارير والمبيعات</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('coupons')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'coupons' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>الكوبونات</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('posts')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'posts' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>نشر إعلان بالصفحة</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('logs')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeAdminTab === 'logs' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>سجل التدقيق</span>
        </button>
      </div>

      {/* TAB 1: Products & Price Management */}
      {activeAdminTab === 'products' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-800">
              قائمة المنتجات وتعديل الأسعار والمخزون
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={adminProductSearch}
                onChange={(e) => setAdminProductSearch(e.target.value)}
                placeholder="بحث في المنتجات..."
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold">
                  <th className="p-3">المستحضر والمادة الفعالة</th>
                  <th className="p-3">السعر الحالي (د.ع)</th>
                  <th className="p-3">المخزون المتوفر</th>
                  <th className="p-3">تاريخ الانتهاء</th>
                  <th className="p-3">الشركة</th>
                  <th className="p-3 text-center">إجراءات المدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products
                  .filter(p => 
                    !adminProductSearch.trim() ||
                    p.nameAr.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
                    p.genericName.toLowerCase().includes(adminProductSearch.toLowerCase())
                  )
                  .map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={prod.image} alt={prod.nameAr} className="w-10 h-10 rounded-lg object-cover bg-slate-100 border shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{prod.nameAr}</p>
                            <p className="text-[10px] text-emerald-700 font-mono">{prod.genericName} - {prod.strength}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-emerald-900 text-sm">{prod.price.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-500">د.ع</span>
                          <button
                            onClick={() => {
                              setQuickPriceProduct(prod);
                              setNewPriceInput(prod.price);
                              setNewOrigPriceInput(prod.originalPrice || prod.price);
                            }}
                            className="p-1 text-slate-400 hover:text-emerald-700 rounded bg-slate-100 hover:bg-emerald-50 mr-1"
                            title="تعديل السعر المباشر"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={prod.stock}
                            onChange={(e) => updateProductStock(prod.id, parseInt(e.target.value) || 0)}
                            className="w-16 p-1 text-xs text-center font-bold border border-slate-200 rounded-lg bg-slate-50"
                          />
                          <span className="text-[10px] text-slate-400">علبة</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {prod.expiryDate}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px] truncate max-w-[120px]">
                        {prod.manufacturer}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="تعديل تفاصيل المنتج"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {currentUser.role === 'owner' && (
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف ${prod.nameAr}؟`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* TAB 2: Orders Management */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-800">
              سجل وإدارة طلبات الزبائن ({orders.length} طلب)
            </h3>
            <button
              onClick={exportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير تقرير إكسل (CSV)</span>
            </button>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">لا توجد طلبات واردة حالياً.</p>
            ) : (
              orders.map((order) => {
                const getStatusBadge = (s: OrderStatus) => {
                  switch (s) {
                    case 'new': return 'bg-red-100 text-red-800 border-red-300 font-bold';
                    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
                    case 'preparing': return 'bg-amber-100 text-amber-800 border-amber-300';
                    case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-300';
                    case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                    case 'cancelled': return 'bg-slate-100 text-slate-600 border-slate-300';
                  }
                };

                const getStatusArabic = (s: OrderStatus) => {
                  switch (s) {
                    case 'new': return 'طلب جديد وصل للتو';
                    case 'confirmed': return 'تم التأكيد من الصيدلي';
                    case 'preparing': return 'قيد التجهيز والتغليف';
                    case 'out_for_delivery': return 'مع مندوب التوصيل';
                    case 'completed': return 'مكتمل ومستلم';
                    case 'cancelled': return 'ملغي';
                  }
                };

                return (
                  <div key={order.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-emerald-800 bg-white px-2 py-0.5 rounded-lg border">
                          #{order.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] border ${getStatusBadge(order.status)}`}>
                          {getStatusArabic(order.status)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] block">اسم الزبون:</span>
                        <span className="font-bold text-slate-800">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">رقم الهاتف:</span>
                        <a href={`tel:${order.customerPhone}`} className="font-bold text-emerald-700 font-mono hover:underline">
                          {order.customerPhone}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">العنوان وطريقة الاستلام:</span>
                        <span className="text-slate-700 truncate block" title={order.deliveryAddress}>
                          {order.deliveryAddress} ({order.deliveryZone})
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">الأدوية والمستلزمات المطلوبة:</span>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] py-0.5">
                          <span>{it.productName} × {it.quantity}</span>
                          <span className="font-mono font-bold text-slate-700">{it.total.toLocaleString()} د.ع</span>
                        </div>
                      ))}
                    </div>

                    {/* Order summary and actions */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">المجموع الصافي:</span>
                        <span className="font-black text-emerald-900 text-sm">{order.total.toLocaleString()} د.ع</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">الدفع عند الاستلام</span>
                      </div>

                      {/* Status changing dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-bold">تغيير الحالة:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs font-bold text-slate-800"
                        >
                          <option value="new">طلب جديد</option>
                          <option value="confirmed">تأكيد الطلب</option>
                          <option value="preparing">قيد التجهيز</option>
                          <option value="out_for_delivery">خرج للتوصيل</option>
                          <option value="completed">مكتمل</option>
                          <option value="cancelled">إلغاء الطلب</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Expiry and Low Stock Alerts */}
      {activeAdminTab === 'expiry_alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Near Expiry */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm border-b pb-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>أدوية تقترب من انتهاء الصلاحية (خلال 6 أشهر)</span>
            </div>

            {nearExpiryProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد أدوية قريبة الانتهاء حالياً. جميع الصلاحيات ممتازة!</p>
            ) : (
              <div className="space-y-2">
                {nearExpiryProducts.map(p => (
                  <div key={p.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-amber-950">{p.nameAr}</p>
                      <p className="text-[10px] text-amber-800 font-mono">الدفعة: {p.batchNumber} | الرصيد: {p.stock} علبة</p>
                    </div>
                    <div className="text-left font-mono font-bold text-amber-900">
                      {p.expiryDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm border-b pb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>تنبيهات نقص المخزون والرصيد الحرج</span>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">المخزون متوفر بكميات كافية لجميع الأصناف.</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="p-3 bg-red-50/70 border border-red-200 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-red-950">{p.nameAr}</p>
                      <p className="text-[10px] text-red-700">الحد الأدنى: {p.lowStockThreshold} علب</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600">المتبقي: {p.stock}</span>
                      <button
                        onClick={() => {
                          const addQty = prompt(`كم علبة تريد إضافتها لمخزون ${p.nameAr}؟`, "20");
                          if (addQty) updateProductStock(p.id, p.stock + parseInt(addQty));
                        }}
                        className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold"
                      >
                        + تزويد المخزن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Customer Unavailable Product Requests */}
      {activeAdminTab === 'requests' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-base text-slate-800">
              طلبات الزبائن للأدوية غير المتوفرة ({requests.length})
            </h3>
            <p className="text-xs text-slate-500">
              استخدم هذه الإحصائية لمعرفة الأدوية الأكثر طلباً في السوق العراقي لطلبها من المذاخر والوكلاء وتوفيرها للزبائن.
            </p>
          </div>

          <div className="space-y-2.5">
            {requests.map(req => (
              <div key={req.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.productName}</span>
                    <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                      مطلوب {req.requestCount} مرات
                    </span>
                    {req.status === 'fulfilled' && (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        ✓ تم التوفير
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500">
                    الزبون: <strong>{req.customerName}</strong> | هاتف: <a href={`tel:${req.customerPhone}`} className="text-emerald-700 font-mono font-bold hover:underline">{req.customerPhone}</a>
                  </p>
                  {req.notes && <p className="text-slate-400 text-[11px]">ملاحظات: {req.notes}</p>}
                </div>

                {req.status !== 'fulfilled' && (
                  <button
                    onClick={() => fulfillProductRequest(req.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold transition self-start sm:self-auto"
                  >
                    تحديد كـ "تم توفيره في الصيدلية"
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Financial Analytics & Business Reports */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-5 rounded-3xl shadow-md">
              <span className="text-xs text-emerald-200 font-bold block mb-1">إجمالي المبيعات المحققة (د.ع):</span>
              <h4 className="text-2xl sm:text-3xl font-black">{totalRevenue.toLocaleString()} د.ع</h4>
              <p className="text-[11px] text-emerald-200 mt-2">من جميع الطلبات المكتملة والنشطة</p>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-5 rounded-3xl shadow-md">
              <span className="text-xs text-blue-200 font-bold block mb-1">الربح الإجمالي التقديري (Gross Profit):</span>
              <h4 className="text-2xl sm:text-3xl font-black">{estimatedGrossProfit.toLocaleString()} د.ع</h4>
              <p className="text-[11px] text-blue-200 mt-2">بناءً على متوسط هامش ربح 30%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-700 to-slate-800 text-white p-5 rounded-3xl shadow-md">
              <span className="text-xs text-purple-200 font-bold block mb-1">إجمالي عدد الطلبات:</span>
              <h4 className="text-2xl sm:text-3xl font-black">{orders.length} طلب</h4>
              <p className="text-[11px] text-purple-200 mt-2">المكتمل: {totalCompletedOrders} | الجديد: {orders.filter(o => o.status === 'new').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800">الأدوية الأكثر مبيعاً في صيدلية الحود</h3>
              <button
                onClick={exportCSV}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> تحميل التقرير الشامل
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {products.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{p.nameAr}</span>
                  </div>
                  <span className="font-bold text-emerald-900">{p.price.toLocaleString()} د.ع</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Coupons Management */}
      {activeAdminTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-5">
          <div className="border-b pb-3">
            <h3 className="font-bold text-base text-slate-800">إدارة كوبونات الخصم والعروض الترويجية</h3>
            <p className="text-xs text-slate-500">أنشئ أكواد خصم خاصة بالزبائن لتشجيع الشراء وزيادة المبيعات.</p>
          </div>

          {/* Create Coupon Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCouponCode.trim()) return;
              addCoupon({
                code: newCouponCode.trim().toUpperCase(),
                discountPercent: newCouponPercent,
                minOrderValue: newCouponMin,
                maxDiscount: 15000,
                expiryDate: '2027-12-31',
                isActive: true,
                timesUsed: 0,
              });
              setNewCouponCode('');
              alert('تم إنشاء الكوبون بنجاح!');
            }}
            className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs"
          >
            <div>
              <label className="block text-slate-700 font-bold mb-1">رمز الكوبون:</label>
              <input
                type="text"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                placeholder="مثال: HOUD2026"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono uppercase font-bold text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">نسبة الخصم (%):</label>
              <input
                type="number"
                min="1"
                max="90"
                value={newCouponPercent}
                onChange={(e) => setNewCouponPercent(parseInt(e.target.value) || 10)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">الحد الأدنى للطلب (د.ع):</label>
              <input
                type="number"
                step="1000"
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(parseInt(e.target.value) || 10000)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-xs"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold transition text-xs"
            >
              + إضافة الكوبون
            </button>
          </form>

          {/* Existing Coupons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((c, idx) => (
              <div key={idx} className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-black text-sm text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {c.code}
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    خصم {c.discountPercent}% | الحد الأدنى: {c.minOrderValue.toLocaleString()} د.ع
                  </p>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 block">استخدم {c.timesUsed} مرة</span>
                  <span className="text-emerald-700 font-bold text-[10px]">مفعّل حتى {c.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Post Announcements to Social Feed */}
      {activeAdminTab === 'posts' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-base text-slate-800">نشر منشور رسمي باسم صيدلية الحود</h3>
            <p className="text-xs text-slate-500">سيظهر المنشور فوراً في مجتمع وتطبيق الزبائن مع الشارة الرسمية المعتمدة.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!postTitle.trim() || !postContent.trim()) return;
              addPost(postTitle.trim(), postContent.trim(), postCategory);
              setPostTitle('');
              setPostContent('');
              alert('تم نشر المنشور في مجتمع الصيدلية بنجاح!');
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block text-slate-700 font-bold mb-1">عنوان المنشور أو النصيحة:</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="مثال: وصول دفعة جديدة من فيتامين د3 أو نصائح للوقاية من الحساسية..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">نوع المنشور:</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
              >
                <option value="announcement">إعلان رسمي من الصيدلية</option>
                <option value="tip">نصيحة دوائية وصحية</option>
                <option value="discount">عروض وتخفيضات خاصة</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">نص المنشور:</label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="اكتب التوجيهات الطبية أو تفاصيل العرض..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-6 rounded-xl font-bold shadow-xs transition"
            >
              نشر المنشور الآن في مجتمع التطبيق
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: Activity Audit Log */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-bold text-base text-slate-800">سجل الأنشطة والتدقيق الأمني (Activity Logs)</h3>
            <p className="text-xs text-slate-500">سجل فوري ومؤرشف لجميع التعديلات والعمليات داخل التطبيق.</p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activityLogs.map(log => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800">{log.action}: </span>
                  <span className="text-slate-600">{log.details}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">بواسطة: {log.userName}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 mr-2">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Price Edit Modal */}
      {quickPriceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-right">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-slate-800">تعديل سعر {quickPriceProduct.nameAr}</h3>
              <button onClick={() => setQuickPriceProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">السعر الجديد للبيع (بالدينار العراقي):</label>
                <input
                  type="number"
                  step="250"
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-base font-bold text-emerald-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">السعر الأصلي قبل الخصم (اختياري للعروض):</label>
                <input
                  type="number"
                  step="250"
                  value={newOrigPriceInput}
                  onChange={(e) => setNewOrigPriceInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    updateProductPrice(quickPriceProduct.id, newPriceInput, newOrigPriceInput);
                    setQuickPriceProduct(null);
                  }}
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition"
                >
                  حفظ السعر الجديد
                </button>
                <button
                  onClick={() => setQuickPriceProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Full Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-auto p-5 text-right max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? `تعديل بيانات: ${editingProduct.nameAr}` : 'إضافة مستحضر طبي جديد لصيدلية الحود'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الدواء بالعربية:</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الدواء بالإنجليزية:</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المادة الفعالة (Generic):</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم والتصنيف:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="medicines">أدوية علاجية</option>
                    <option value="vitamins">فيتامينات ومكملات</option>
                    <option value="skincare">عناية بالبشرة</option>
                    <option value="mother_baby">أمومة وطفل</option>
                    <option value="medical_devices">أجهزة طبية</option>
                    <option value="first_aid">إسعافات أولية</option>
                    <option value="medical_supplies">مستلزمات طبية</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الشركة المصنعة:</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سعر البيع (د.ع):</label>
                  <input
                    type="number"
                    step="250"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-emerald-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكمية المتوفرة بالمخزن:</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ انتهاء الصلاحية:</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الشكل الدوائي (أقراص، شراب...):</label>
                  <input
                    type="text"
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التركيز (مثال: 500 ملغم):</label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابط صورة الدواء (Image URL):</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">دواعي الاستعمال والشرح:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="rx-checkbox"
                  checked={formData.isPrescriptionRequired}
                  onChange={(e) => setFormData({ ...formData, isPrescriptionRequired: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="rx-checkbox" className="font-bold text-slate-700">
                  يتطلب وصفة طبية رسمية لصرفه (Prescription-Only Rx)
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md transition"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المستحضر للمخزون والمتجر'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
