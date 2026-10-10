/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { ProductList } from './components/store/ProductList';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartModal } from './components/store/CartModal';
import { ProductCompareModal } from './components/store/ProductCompareModal';
import { RequestProductModal } from './components/store/RequestProductModal';
import { OrdersListModal } from './components/store/OrdersListModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SocialFeed } from './components/social/SocialFeed';
import { MedicineAssistant } from './components/assistant/MedicineAssistant';
import { CustomerSupportChat } from './components/chat/CustomerSupportChat';
import { AndroidExportHub } from './components/apk/AndroidExportHub';
import { Product, Order } from './types/pharmacy';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone,
  Heart
} from 'lucide-react';

function PharmacyApp() {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    comparisonList, 
    clearComparison 
  } = usePharmacy();

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestInitialName, setRequestInitialName] = useState('');
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<Order | null>(null);

  const handleOpenRequest = (name?: string) => {
    setRequestInitialName(name || '');
    setShowRequestModal(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setShowCart(false);
    setRecentOrderSuccess(order);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <div>
        {/* Header */}
        <Header />

        {/* Desktop Navigation */}
        <Navigation />

        {/* PWA In-App Install Prompt Banner */}
        <PWAInstallBanner />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-5 sm:py-6">
          {/* Active Tab Router */}
          {activeTab === 'store' && (
            <ProductList
              onSelectProduct={(p) => setSelectedProduct(p)}
              onRequestProduct={handleOpenRequest}
            />
          )}

          {activeTab === 'community' && <SocialFeed />}

          {activeTab === 'assistant' && <MedicineAssistant />}

          {activeTab === 'chat' && <CustomerSupportChat />}

          {activeTab === 'orders' && <OrdersListModal />}

          {activeTab === 'admin' && <AdminDashboard />}

          {activeTab === 'apk' && <AndroidExportHub />}
        </main>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRequestProduct={handleOpenRequest}
        />
      )}

      {/* Cart Modal (or triggered by tab) */}
      {(showCart || activeTab === 'cart') && (
        <CartModal
          onClose={() => {
            setShowCart(false);
            if (activeTab === 'cart') setActiveTab('store');
          }}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Comparison Modal */}
      {showCompare && (
        <ProductCompareModal onClose={() => setShowCompare(false)} />
      )}

      {/* Request Unavailable Product Modal */}
      {showRequestModal && (
        <RequestProductModal
          initialProductName={requestInitialName}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      {/* Order Successful Toast Notification */}
      {recentOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              تم استلام طلبك بنجاح!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              رقم الطلب: <strong className="text-emerald-800 font-mono text-sm">#{recentOrderSuccess.orderNumber}</strong>
              <br />
              تم إرسال الطلب لإدارة صيدلية الحود وسيقوم الصيدلي بالتأكيد والتجهيز فوراً.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setRecentOrderSuccess(null);
                  setActiveTab('orders');
                }}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                متابعة حالة الطلب
              </button>
              <button
                onClick={() => setRecentOrderSuccess(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 pb-20 md:pb-8 text-xs text-right">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                ✚
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">صيدلية الحود المركزية</h4>
                <p className="text-[10px] text-slate-400 font-mono">Al-Houd Central Pharmacy</p>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              صيدليتكم المعتمدة في العراق. نوفر أجود الأدوية العالمية والمحلية والمستلزمات الطبية مع خدمة الاستشارات والمتابعة الدوائية المباشرة.
            </p>
          </div>

          <div className="space-y-1.5">
            <h5 className="font-bold text-white text-xs mb-2">معلومات التواصل:</h5>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr">0770 123 4500 - 0780 987 6543</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>جمهورية العراق - بغداد ومحافظات العراق</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>الدوام: يومياً على مدار 24 ساعة (خدمة الطوارئ)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h5 className="font-bold text-white text-xs mb-2">روابط سريعة:</h5>
            <ul className="space-y-1 text-slate-400">
              <li>
                <button onClick={() => setActiveTab('store')} className="hover:text-emerald-400 transition">
                  تصفح قائمة الأدوية
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('apk')} className="hover:text-emerald-400 transition font-bold text-emerald-300">
                  📱 تحميل التطبيق على الموبايل وAPK
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-emerald-400 transition">
                  مجتمع وتوعية الصيدلية
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('assistant')} className="hover:text-emerald-400 transition">
                  المساعد الصيدلاني الذكي
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs mb-1">الترخيص والاعتماد:</h5>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1 text-[11px]">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                مجازة رسمياً من نقابة صيادلة العراق
              </span>
              <p className="text-slate-400 text-[10px]">
                جميع الأسعار معتمدة بالدينار العراقي (IQD). الدفع عند الاستلام.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 text-center text-[11px] text-slate-500">
          جميع الحقوق محفوظة © {new Date().getFullYear()} صيدلية الحود المركزية - Al-Houd Central Pharmacy
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PharmacyProvider>
      <PharmacyApp />
    </PharmacyProvider>
  );
}
