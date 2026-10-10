import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  Pill, 
  Sparkles,
  Info,
  ChevronLeft,
  BellRing
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product, ProductCategory } from '../../types/pharmacy';

interface ProductListProps {
  onSelectProduct: (product: Product) => void;
  onRequestProduct: (productName?: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onSelectProduct, onRequestProduct }) => {
  const { 
    products, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    addToCart,
    favorites,
    toggleFavorite,
    comparisonList,
    addToComparison,
    removeFromComparison
  } = usePharmacy();

  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in_stock' | 'discounted' | 'rx'>('all');

  const categories: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'جميع الأقسام', icon: '🏥' },
    { id: 'medicines', label: 'أدوية علاجية', icon: '💊' },
    { id: 'vitamins', label: 'فيتامينات ومكملات', icon: '✨' },
    { id: 'skincare', label: 'عناية بالبشرة', icon: '🧴' },
    { id: 'mother_baby', label: 'أمومة وطفل', icon: '🍼' },
    { id: 'medical_devices', label: 'أجهزة طبية', icon: '🩺' },
    { id: 'first_aid', label: 'إسعافات أولية', icon: '🩹' },
    { id: 'medical_supplies', label: 'مستلزمات طبية', icon: '🧤' },
  ];

  // Filtering
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Availability / attribute filter
    if (availabilityFilter === 'in_stock' && product.stock <= 0) return false;
    if (availabilityFilter === 'discounted' && (!product.originalPrice || product.originalPrice <= product.price)) return false;
    if (availabilityFilter === 'rx' && !product.isPrescriptionRequired) return false;

    // Search query (Arabic name, English name, generic name, manufacturer, barcode)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchAr = product.nameAr.toLowerCase().includes(q);
      const matchEn = product.nameEn.toLowerCase().includes(q);
      const matchGen = product.genericName.toLowerCase().includes(q);
      const matchMfg = product.manufacturer.toLowerCase().includes(q);
      const matchBar = product.barcode.includes(q);
      return matchAr || matchEn || matchGen || matchMfg || matchBar;
    }

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-400/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>صيدلية الحود المركزية - بوابتك الدوائية الموثوقة في العراق</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-snug">
            أدويتك الأصلية بأسعارها المعتمدة، تصلك حتى باب بيتك
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mb-4 leading-relaxed">
            تصفح أكثر من 1,000 صنف علاجي وتجميلي، راجع المادة الفعالة والجرعات المعتمدة، واطلب مشورة الصيدلي مباشرة في أي وقت.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              أدوية أصلية ومفحوصة
            </span>
            <span className="bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              دفع عند الاستلام بالدينار العراقي
            </span>
            <span className="bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              صيدلي مرخص للإجابة الفورية
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الدواء، المادة الفعالة (Paracetamol...)، الشركة، أو الباركود..."
            className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="font-semibold text-slate-400 shrink-0">تصفية:</span>
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                availabilityFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({products.length})
            </button>
            <button
              onClick={() => setAvailabilityFilter('in_stock')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                availabilityFilter === 'in_stock' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              المتوفر فقط
            </button>
            <button
              onClick={() => setAvailabilityFilter('discounted')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                availabilityFilter === 'discounted' ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Tag className="w-3 h-3" />
              خصومات وعروض
            </button>
            <button
              onClick={() => setAvailabilityFilter('rx')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                availabilityFilter === 'rx' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              أدوية بوصفة (Rx)
            </button>
          </div>

          <div className="text-slate-400 text-xs shrink-0 mr-2">
            النتائج: <strong className="text-slate-700">{filteredProducts.length}</strong>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">لم نجد الدواء المطلوب بهذا الاسم</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            تأكد من كتابة الاسم بالشكل الصحيح أو بالاسم التجاري/العلمي. لا تقلق، صيدلية الحود توفر أي علاج مطلوب عند الطلب!
          </p>
          <button
            onClick={() => onRequestProduct(searchQuery)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <BellRing className="w-4 h-4" />
            <span>طلب توفير هذا الدواء الآن (خدمة الطلب الخاص)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const isComparing = comparisonList.some(p => p.id === product.id);
            const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
            const isOutOfStock = product.stock <= 0;
            const hasDiscount = product.originalPrice && product.originalPrice > product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image container & Badges */}
                  <div className="relative aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <img
                      src={product.image}
                      alt={product.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Discount badge */}
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                        خصم {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                      </span>
                    )}

                    {/* Prescription Required badge */}
                    {product.isPrescriptionRequired && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-amber-950 font-bold text-[10px] px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                        <Pill className="w-2.5 h-2.5" />
                        وصفة طبية
                      </span>
                    )}

                    {/* Stock Alert Overlay if out of stock */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
                        <span className="bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md">
                          غير متوفر حالياً بالمخزن
                        </span>
                      </div>
                    )}

                    {/* Quick action overlay buttons */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition shadow-xs ${
                          isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                        title="إضافة للمفضلة"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isComparing) removeFromComparison(product.id);
                          else addToComparison(product);
                        }}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition shadow-xs ${
                          isComparing ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                        title="مقارنة مع أدوية أخرى"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 space-y-2">
                    {/* Active ingredient / Generic Name badge */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-700 truncate max-w-[170px]" title={product.genericName}>
                        {product.genericName}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {product.strength}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition cursor-pointer line-clamp-2 leading-snug"
                    >
                      {product.nameAr}
                    </h3>

                    {/* English Subtitle */}
                    <p className="text-[11px] text-slate-400 truncate font-mono">
                      {product.nameEn}
                    </p>

                    {/* Form and manufacturer */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {product.dosageForm.split(' ')[0]}
                      </span>
                      <span className="truncate text-slate-400">
                        {product.manufacturer}
                      </span>
                    </div>

                    {/* Stock Status info */}
                    <div className="pt-1">
                      {isOutOfStock ? (
                        <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          يمكنك طلب توفيره الآن
                        </p>
                      ) : isLowStock ? (
                        <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          متبقي كمية محدودة ({product.stock} فقط)
                        </p>
                      ) : (
                        <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          متوفر للتسليم الفوري
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Price and Action */}
                <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-emerald-900">
                        {product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">د.ع</span>
                    </div>
                    {hasDiscount && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {product.originalPrice?.toLocaleString()} د.ع
                      </span>
                    )}
                  </div>

                  {isOutOfStock ? (
                    <button
                      onClick={() => onRequestProduct(product.nameAr)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <BellRing className="w-3 h-3 text-amber-600" />
                      <span>اطلب توفيره</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>إضافة للسلة</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
