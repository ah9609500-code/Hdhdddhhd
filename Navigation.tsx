import React from 'react';
import { 
  Store, 
  Users, 
  Bot, 
  MessageCircle, 
  LayoutDashboard, 
  Smartphone, 
  ClipboardList 
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, orders } = usePharmacy();

  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  const navItems = [
    { id: 'store', label: 'المتجر والأدوية', icon: Store },
    { id: 'community', label: 'المجتمع والمنشورات', icon: Users },
    { id: 'assistant', label: 'المساعد الدوائي', icon: Bot },
    { id: 'chat', label: 'شات الصيدلية', icon: MessageCircle },
    { id: 'orders', label: 'الطلبات والمتابعة', icon: ClipboardList, badge: newOrdersCount > 0 ? newOrdersCount : undefined },
    ...(currentUser.role === 'owner' || currentUser.role === 'employee' ? [
      { id: 'admin', label: 'إدارة الصيدلية', icon: LayoutDashboard }
    ] : []),
    { id: 'apk', label: 'تثبيت الأندرويد & APK', icon: Smartphone, highlight: true },
  ];

  return (
    <>
      {/* Desktop / Tablet Navigation Bar */}
      <nav className="hidden md:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : item.highlight
                      ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation (Android Native Feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 gap-1 items-center justify-around text-center">
          {/* Store */}
          <button
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition ${
              activeTab === 'store' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Store className={`w-5 h-5 ${activeTab === 'store' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">المتجر</span>
          </button>

          {/* Community */}
          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition ${
              activeTab === 'community' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'community' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">المجتمع</span>
          </button>

          {/* Smart Assistant */}
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition ${
              activeTab === 'assistant' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              <Bot className={`w-5 h-5 ${activeTab === 'assistant' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[10px] mt-0.5">المساعد</span>
          </button>

          {/* Admin Dashboard (if owner/emp) OR Orders (if customer) */}
          {(currentUser.role === 'owner' || currentUser.role === 'employee') ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition ${
                activeTab === 'admin' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <LayoutDashboard className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {newOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold">
                    {newOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">الإدارة</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition ${
                activeTab === 'orders' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <ClipboardList className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">طلباتي</span>
            </button>
          )}

          {/* Android / APK Download Hub */}
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition relative ${
              activeTab === 'apk' ? 'text-emerald-700 font-bold' : 'text-emerald-600'
            }`}
          >
            <div className="relative">
              <Smartphone className={`w-5 h-5 ${activeTab === 'apk' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="absolute -top-1 -right-2 px-1 bg-amber-400 text-amber-950 font-extrabold text-[8px] rounded">
                APK
              </span>
            </div>
            <span className="text-[10px] mt-0.5 font-bold">تثبيت التطبيق</span>
          </button>
        </div>
      </nav>
    </>
  );
};
