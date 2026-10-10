import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  Truck, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { DELIVERY_ZONES } from '../../data/initialData';
import { Order } from '../../types/pharmacy';

interface CartModalProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ onClose, onOrderSuccess }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    cartSubtotal,
    createOrder,
    currentUser,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = usePharmacy();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // Delivery selection
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0]);
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [deliveryAddress, setDeliveryAddress] = useState('بغداد - حي المنصور - شارع 14 رمضان');
  const [customerNotes, setCustomerNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // Calculations
  const discountAmount = appliedCoupon 
    ? Math.min((cartSubtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount)
    : 0;

  const deliveryFee = deliveryType === 'pickup' ? 0 : selectedZone.fee;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ msg: res.message, isError: false });
    } else {
      setCouponFeedback({ msg: res.message, isError: true });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('يرجى ملء الاسم ورقم الهاتف للمتابعة');
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.nameAr,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
    }));

    const createdOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryType,
      deliveryZone: deliveryType === 'pickup' ? 'استلام من الصيدلية' : selectedZone.name,
      deliveryAddress: deliveryType === 'pickup' ? 'فرع صيدلية الحود المركزية' : deliveryAddress.trim(),
      deliveryFee,
      items: orderItems,
      subtotal: cartSubtotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      total: finalTotal,
      paymentMethod: 'cash_on_delivery',
      customerNotes: customerNotes.trim(),
    });

    onOrderSuccess(createdOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">سلة الأدوية والمشتريات</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {cart.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">سلة المشتريات فارغة</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                تصفح قائمة الأدوية والمستلزمات وأضف ما تحتاجه للسلة لتصلك فوراً.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                تصفح قائمة الأدوية
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800">الأصناف المحددة ({cart.length}):</span>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> مسح السلة
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.nameAr}
                        className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                          {item.product.nameAr}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.product.dosageForm}
                        </p>
                        <p className="text-xs font-extrabold text-emerald-800">
                          {item.product.price.toLocaleString()} د.ع
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" /> هل لديك كوبون خصم؟
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold">
                    <span>كوبون مفعّل: {appliedCoupon.code} (خصم {appliedCoupon.discountPercent}%)</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="أدخل رمز الكوبون (مثال: HOUD10)..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition"
                    >
                      تطبيق
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p className={`text-[11px] font-bold ${couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                    {couponFeedback.msg}
                  </p>
                )}
              </div>

              {/* Delivery and Customer Information */}
              <div className="space-y-3 border-t border-slate-200 pt-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" /> طريقة الاستلام والتوصيل:
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      deliveryType === 'delivery'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">🛵 توصيل للعنوان</span>
                    <span className="text-[10px] text-slate-400">سريع حتى باب البيت</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      deliveryType === 'pickup'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">🏥 استلام من الفرع</span>
                    <span className="text-[10px] text-emerald-600 font-bold">مجاني بدون أجور</span>
                  </button>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                    <label className="block font-semibold text-slate-700">اختر منطقة التوصيل داخل العراق:</label>
                    <select
                      value={selectedZone.id}
                      onChange={(e) => {
                        const z = DELIVERY_ZONES.find(zone => zone.id === e.target.value);
                        if (z) setSelectedZone(z);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                    >
                      {DELIVERY_ZONES.filter(z => z.id !== 'zone-pickup').map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} (+{zone.fee.toLocaleString()} د.ع - {zone.estimatedTime})
                        </option>
                      ))}
                    </select>

                    <label className="block font-semibold text-slate-700 pt-1">العنوان التفصيلي:</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="المحافظة - المنطقة - اسم الشارع أو أقرب نقطة دالة..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                      required
                    />
                  </div>
                )}

                {/* Customer Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">الاسم الكامل:</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">رقم الهاتف للتواصل:</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0770xxxxxxx"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-medium mb-1">ملاحظات إضافية للصيدلي أو المندوب (اختياري):</label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="مثال: يرجى إرفاق فاتورة مختومة، أو الاتصال قبل الوصول..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>مجموع المنتجات:</span>
                  <span className="font-bold">{cartSubtotal.toLocaleString()} د.ع</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>خصم الكوبون:</span>
                    <span>-{discountAmount.toLocaleString()} د.ع</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>أجور التوصيل:</span>
                  <span className="font-bold">{deliveryFee === 0 ? 'مجاناً' : `${deliveryFee.toLocaleString()} د.ع`}</span>
                </div>
                <div className="border-t border-emerald-200 pt-2 flex justify-between items-baseline text-emerald-950 font-black text-sm sm:text-base">
                  <span>المبلغ الإجمالي النهائي:</span>
                  <span className="text-xl text-emerald-800 font-black">{finalTotal.toLocaleString()} د.ع</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>طريقة الدفع: الدفع نقداً عند الاستلام (Cash on Delivery) بعد المعاينة</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCheckoutSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>تأكيد وإرسال الطلب للصيدلية</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
