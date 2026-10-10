import React from 'react';
import { ClipboardList, Clock, Truck, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { OrderStatus } from '../../types/pharmacy';

export const OrdersListModal: React.FC = () => {
  const { orders, setActiveTab } = usePharmacy();

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'new': return { label: 'طلب جديد (قيد المراجعة)', color: 'bg-red-100 text-red-800' };
      case 'confirmed': return { label: 'تم تأكيد الطلب من الصيدلية', color: 'bg-blue-100 text-blue-800' };
      case 'preparing': return { label: 'جاري تجهيز وتغليف الأدوية', color: 'bg-amber-100 text-amber-800' };
      case 'out_for_delivery': return { label: 'الطلب مع مندوب التوصيل', color: 'bg-purple-100 text-purple-800' };
      case 'completed': return { label: 'تم الاستلام بنجاح', color: 'bg-emerald-100 text-emerald-800' };
      case 'cancelled': return { label: 'تم إلغاء الطلب', color: 'bg-slate-100 text-slate-600' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-14 text-right">
      <div className="bg-emerald-800 text-white p-5 rounded-3xl shadow-md flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold mb-1">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>متابعة الطلبات المباشرة</span>
          </div>
          <h2 className="text-xl font-extrabold">طلبات الأدوية الخاصة بك</h2>
          <p className="text-xs text-emerald-100 mt-0.5">تابع مراحل تجهيز وتوصيل أدويتك من صيدلية الحود المركزية.</p>
        </div>

        <button
          onClick={() => setActiveTab('store')}
          className="bg-white text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition"
        >
          العودة للمتجر
        </button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">لا توجد طلبات سابقة حتى الآن</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
              اختر الأدوية أو المستلزمات الطبية وأرسل طلبك لتصلك بأسرع وقت.
            </p>
            <button
              onClick={() => setActiveTab('store')}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
            >
              تصفح الأدوية الآن
            </button>
          </div>
        ) : (
          orders.map((ord) => {
            const st = getStatusText(ord.status);

            return (
              <div key={ord.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      #{ord.orderNumber}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{ord.createdAt}</span>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold text-slate-500 py-1">
                  <div className={`p-1.5 rounded-lg ${['new', 'confirmed', 'preparing', 'out_for_delivery', 'completed'].includes(ord.status) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}`}>
                    1. استلام الطلب
                  </div>
                  <div className={`p-1.5 rounded-lg ${['confirmed', 'preparing', 'out_for_delivery', 'completed'].includes(ord.status) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}`}>
                    2. تأكيد الصيدلي
                  </div>
                  <div className={`p-1.5 rounded-lg ${['preparing', 'out_for_delivery', 'completed'].includes(ord.status) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}`}>
                    3. التجهيز
                  </div>
                  <div className={`p-1.5 rounded-lg ${['out_for_delivery', 'completed'].includes(ord.status) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}`}>
                    4. التوصيل
                  </div>
                </div>

                {/* Items */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-700 block">الأصناف المطلوبة:</span>
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-600">
                      <span>{it.productName} × {it.quantity}</span>
                      <span className="font-mono font-bold text-emerald-900">{it.total.toLocaleString()} د.ع</span>
                    </div>
                  ))}
                </div>

                {/* Delivery details and Total */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pt-1 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-slate-600">العنوان: <strong className="text-slate-800">{ord.deliveryAddress}</strong></p>
                    <p className="text-slate-500 text-[11px]">طريقة الدفع: الدفع نقداً عند الاستلام</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 block">المبلغ الإجمالي:</span>
                    <span className="font-black text-emerald-900 text-base">{ord.total.toLocaleString()} د.ع</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
