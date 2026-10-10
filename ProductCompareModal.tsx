import React from 'react';
import { X, Scale, Trash2, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

interface ProductCompareModalProps {
  onClose: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({ onClose }) => {
  const { comparisonList, removeFromComparison, clearComparison, addToCart } = usePharmacy();

  if (comparisonList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-800">
              مقارنة المستحضرات الطبية ({comparisonList.length} أدوية)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg"
            >
              مسح الكل
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 text-slate-400 font-medium w-36">المعيار الطبي</th>
                {comparisonList.map(prod => (
                  <th key={prod.id} className="p-3 font-bold text-slate-800 min-w-[200px]">
                    <div className="space-y-2">
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border">
                        <img src={prod.image} alt={prod.nameAr} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromComparison(prod.id)}
                          className="absolute top-1 right-1 p-1 bg-white/80 rounded-md text-red-500 hover:bg-white"
                          title="إزالة من المقارنة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="line-clamp-2 text-xs">{prod.nameAr}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">السعر الحالي (د.ع)</td>
                {comparisonList.map(prod => (
                  <td key={prod.id} className="p-3 font-black text-emerald-800 text-sm">
                    {prod.price.toLocaleString()} د.ع
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">المادة الفعالة (Generic)</td>
                {comparisonList.map(prod => (
                  <td key={prod.id} className="p-3 font-bold text-emerald-700 font-mono">
                    {prod.genericName}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">التركيز والشكل الدوائي</td>
                {comparisonList.map(prod => (
                  <td key={prod.id} className="p-3 text-slate-700">
                    {prod.dosageForm} ({prod.strength})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">الشركة والمنشأ</td>
                {comparisonList.map(prod => (
                  <td key={prod.id} className="p-3 text-slate-700">
                    {prod.manufacturer}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">حالة التوفر بالمخزن</td>
                {comparisonList.map(prod => (
                  <td key={prod.id} className="p-3">
                    {prod.stock > 0 ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> متوفر ({prod.stock} علبة)
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> غير متوفر
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">الإجراء</td>
                {comparisonList.map(prod => (
                  <td key={prod.id} className="p-3">
                    <button
                      onClick={() => addToCart(prod)}
                      disabled={prod.stock <= 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>إضافة للسلة</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-amber-50 border-t border-amber-200 text-amber-900 text-[11px] text-center">
          * تنبيه صيدلي: لا يعتبر تطابق المادة الفعالة دائماً بديلاً تاماً دون مراجعة الطبيب أو الصيدلي لتحديد التكافؤ الحيوي المناسب لحالتك.
        </div>
      </div>
    </div>
  );
};
