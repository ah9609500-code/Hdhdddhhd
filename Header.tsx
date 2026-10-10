import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  UserCheck, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  ShieldCheck, 
  Sparkles,
  Heart,
  Scale
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { UserRole } from '../../types/pharmacy';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    isOnline, 
    cartTotalCount, 
    favorites, 
    comparisonList,
    setActiveTab, 
    activeTab 
  } = usePharmacy();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'owner': return 'صاحب الصيدلية (المدير العام)';
      case 'employee': return 'صيدلي موظف';
      case 'customer': return 'زبون الصيدلية';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'owner': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'employee': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'customer': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      {/* Top micro bar for Iraq Market announcement & connectivity */}
      <div className="bg-emerald-800 text-emerald-50 px-3 py-1 text-xs flex justify-between items-center text-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>خدمة التوصيل السريع لجميع مناطق العراق | الدفع نقداً عند الاستلام (د.ع)</span>
        </div>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-200 text-[11px]">
              <Wifi className="w-3.5 h-3.5" /> متصل
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-300 text-[11px] font-bold">
              <WifiOff className="w-3.5 h-3.5" /> وضع عدم الاتصال (أوفلاين)
            </span>
          )}
          <span className="hidden sm:inline text-emerald-300 text-[11px]">صيدلية مجازة رسمياً</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('store')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Official Pharmacy Logo */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-emerald-50 opacity-50" />
              {/* Green pharmacy cross and emblem */}
              <div className="relative flex items-center justify-center">
                <span className="text-emerald-700 font-extrabold text-2xl leading-none">✚</span>
                <span className="absolute text-[9px] font-bold text-emerald-900 -bottom-1">حود</span>
              </div>
            </div>
            {/* Verified badge icon */}
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg sm:text-xl text-emerald-900 tracking-tight leading-tight">
                صيدلية الحود المركزية
              </h1>
              <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                معتمدة
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Al-Houd Central Pharmacy
            </p>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="flex items-center gap-2">
          {/* APK & Mobile App button */}
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              activeTab === 'apk' 
                ? 'bg-emerald-700 text-white shadow-emerald-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
            title="تثبيت التطبيق على الموبايل وتوليد APK"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">تحميل التطبيق على الموبايل</span>
            <span className="sm:hidden">تثبيت التطبيق</span>
            <span className="bg-amber-400 text-amber-950 px-1 rounded-sm text-[9px] font-extrabold animate-pulse">APK</span>
          </button>

          {/* Product Comparison shortcut */}
          {comparisonList.length > 0 && (
            <button
              onClick={() => setActiveTab('store')}
              className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="مقارنة المنتجات"
            >
              <Scale className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {comparisonList.length}
              </span>
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={() => setActiveTab('cart')}
            className={`relative p-2 rounded-xl transition ${
              activeTab === 'cart' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="سلة المشتريات"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${getRoleBadgeColor(currentUser.role)}`}
              title="تبديل الصلاحيات وتجربة الأدوار"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">▼</span>
            </button>

            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-right">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs text-slate-500 font-medium">الحساب الحالي والصفة:</p>
                  <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeColor(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { switchRole('owner'); setShowRoleMenu(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                      currentUser.role === 'owner' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>صاحب الصيدلية (المدير الكامل)</span>
                    {currentUser.role === 'owner' && <span className="text-amber-600">✓</span>}
                  </button>

                  <button
                    onClick={() => { switchRole('employee'); setShowRoleMenu(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                      currentUser.role === 'employee' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>صيدلي موظف (صلاحيات محدودة)</span>
                    {currentUser.role === 'employee' && <span className="text-blue-600">✓</span>}
                  </button>

                  <button
                    onClick={() => { switchRole('customer'); setShowRoleMenu(false); }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                      currentUser.role === 'customer' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>زبون الصيدلية (شراء وتواصل)</span>
                    {currentUser.role === 'customer' && <span className="text-emerald-600">✓</span>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
