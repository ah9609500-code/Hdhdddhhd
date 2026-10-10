import React, { useState } from 'react';
import { X, BellRing, CheckCircle2, Phone, Sparkles } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

interface RequestProductModalProps {
  initialProductName?: string;
  onClose: () => void;
}

export const RequestProductModal: React.FC<RequestProductModalProps> = ({ 
  initialProductName = '', 
  onClose 
}) => {
  const { createProductRequest, currentUser } = usePharmacy();
  const [productName, setProductName] = useState(initialProductName);
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !customerPhone.trim()) return;

    createProductRequest(productName.trim(), customerName.trim(), customerPhone.trim(), notes.trim());
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-auto p-5 text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">طلب دواء غير متوفر</h3>
              <p className="text-[11px] text-slate-400">خدمة التوفير المخصص من صيدلية الحود</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">تم تسجيل طلب الدواء بنجاح!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              شكراً لك. قامت إدارة صيدلية الحود المركزية بتسجيل اسم الدواء (<strong className="text-emerald-700">{productName}</strong>)، وسيتم الاتصال بك على الرقم <strong>{customerPhone}</strong> فور توفيره من الوكيل المعتمد.
            </p>
            <button
              onClick={onClose}
              className="mt-3 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              حسناً، تم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              إذا لم تجد دواءك أو كان مفرغاً من المخزن، سجل اسمه وسيقوم كادر صيدلية الحود بالتواصل مع المذاخر الطبية وتأمينه لك بأسرع وقت!
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">اسم الدواء أو المستحضر المطلوب:</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="مثال: بخاخ أوتريفين، أوجمنتين شراب..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">اسمك الكريم:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">رقم الهاتف للاتصال بك عند التوفر:</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0770xxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ملاحظات، تركيز محدد، أو تفاصيل الشركة:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: مطلوب تركيز 500 ملغم فقط أو علبتين..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <BellRing className="w-4 h-4" />
              <span>إرسال طلب التوفير للصيدلية</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
