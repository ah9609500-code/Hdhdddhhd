import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  Scale, 
  Pill, 
  ShieldAlert, 
  Calendar, 
  Building, 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  Plus, 
  Minus,
  Sparkles,
  Share2,
  BellRing
} from 'lucide-react';
import { Product } from '../../types/pharmacy';
import { usePharmacy } from '../../context/PharmacyContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestProduct: (productName?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose,
  onRequestProduct
}) => {
  const { 
    addToCart, 
    favorites, 
    toggleFavorite, 
    comparisonList, 
    addToComparison, 
    removeFromComparison,
    comments,
    addComment,
    likeComment,
    currentUser,
    replyToComment
  } = usePharmacy();

  const [quantity, setQuantity] = useState(1);
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [replyInput, setReplyInput] = useState<{ [id: string]: string }>({});

  if (!product) return null;

  const isFav = favorites.includes(product.id);
  const isComparing = comparisonList.some(p => p.id === product.id);
  const productComments = comments.filter(c => c.productId === product.id);
  const isOutOfStock = product.stock <= 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.nameAr} - صيدلية الحود المركزية`,
        text: `دواء ${product.nameAr} متوفر بسعر ${product.price.toLocaleString()} د.ع في صيدلية الحود المركزية.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط المنتج للمشاركة!');
    }
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(product.id, newCommentText.trim(), newRating);
    setNewCommentText('');
  };

  const handleReplySubmit = (commentId: string) => {
    const text = replyInput[commentId]?.trim();
    if (!text) return;
    replyToComment(commentId, text);
    setReplyInput(prev => ({ ...prev, [commentId]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-right">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition"
              title="مشاركة المنتج"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-2 rounded-xl border transition ${
                isFav ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-600 hover:text-red-500'
              }`}
              title="المفضلة"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => isComparing ? removeFromComparison(product.id) : addToComparison(product)}
              className={`p-2 rounded-xl border transition ${
                isComparing ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600'
              }`}
              title="مقارنة"
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-emerald-800">تفاصيل المستحضر الطبي</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Header section with image and key info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.image}
                alt={product.nameAr}
                className="w-full h-full object-cover"
              />
              {product.isPrescriptionRequired && (
                <span className="absolute top-2 right-2 bg-amber-500 text-amber-950 font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5" />
                  يصرف بوصفة طبية
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-lg">
                {product.genericName}
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {product.nameAr}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {product.nameEn}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-emerald-800">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600">دينار عراقي (IQD)</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through mr-2">
                    {product.originalPrice.toLocaleString()} د.ع
                  </span>
                )}
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">الشكل والتركيز:</span>
                  <span className="font-bold text-slate-800">{product.dosageForm} ({product.strength})</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">الشركة المصنعة:</span>
                  <span className="font-bold text-slate-800">{product.manufacturer}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">تاريخ الانتهاء:</span>
                  <span className="font-bold text-slate-800 font-mono">{product.expiryDate}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">رقم الوجبة (Batch):</span>
                  <span className="font-bold text-slate-800 font-mono">{product.batchNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Medical Instructions */}
          <div className="space-y-3">
            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                دواعي الاستعمال والوصف:
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                طريقة الاستخدام والجرعة العامة:
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {product.usageInstructions}
              </p>
            </div>

            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70 space-y-1.5">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                تحذيرات وموانع الاستعمال:
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed">
                {product.safetyWarnings}
              </p>
              <p className="text-[10px] text-amber-700 mt-1">
                * ملاحظة هامة: هذه المعلومات للأغراض الإرشادية فقط ولا تغني عن استشارة الطبيب المعالج أو صيدلي صيدلية الحود المركزية.
              </p>
            </div>
          </div>

          {/* Customer Reviews and Social Comments Section */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                تجارب الزبائن والتعليقات ({productComments.length})
              </h4>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewsCount} تقييم)</span>
              </div>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddCommentSubmit} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">أضف رأيك أو تجربتك مع هذا المستحضر:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNewRating(num)}
                      className={`p-0.5 text-base ${num <= newRating ? 'text-amber-400' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="اكتب تجربتك مع الدواء، الفعالية، أو سرعة التوصيل..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[11px]">التعليق باسم: {currentUser.name}</span>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-700 transition"
                >
                  نشر التعليق
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {productComments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">لا توجد تعليقات بعد، كن أول من يشارك تجربته!</p>
              ) : (
                productComments.map((comm) => (
                  <div key={comm.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{comm.userName}</span>
                        {comm.rating && (
                          <span className="text-amber-400 font-bold text-[10px]">
                            {'★'.repeat(comm.rating)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{comm.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {comm.text}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-50">
                      <button
                        onClick={() => likeComment(comm.id)}
                        className="text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                      >
                        👍 <span>أعجبني ({comm.likes})</span>
                      </button>

                      {/* Official Pharmacy reply badge if present */}
                      {comm.pharmacyReply && (
                        <span className="text-emerald-700 text-[10px] font-bold">✓ تم الرد من الصيدلية</span>
                      )}
                    </div>

                    {/* Official Pharmacy Reply */}
                    {comm.pharmacyReply && (
                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-xs mt-2">
                        <span className="font-bold text-emerald-900 block text-[11px] mb-0.5">
                          رد صيدلية الحود المركزية الرسمي:
                        </span>
                        <p className="text-emerald-800 text-[11px]">{comm.pharmacyReply}</p>
                      </div>
                    )}

                    {/* Owner reply box if current user is owner and no reply yet */}
                    {currentUser.role === 'owner' && !comm.pharmacyReply && (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={replyInput[comm.id] || ''}
                          onChange={(e) => setReplyInput({ ...replyInput, [comm.id]: e.target.value })}
                          placeholder="رد باسم صيدلية الحود..."
                          className="flex-1 text-xs p-1.5 rounded-lg border border-slate-200"
                        />
                        <button
                          onClick={() => handleReplySubmit(comm.id)}
                          className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-lg font-bold"
                        >
                          رد رسمي
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Checkout Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3">
          {isOutOfStock ? (
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-red-600 font-bold">
                المستحضر غير متوفر حالياً في الصيدلية
              </span>
              <button
                onClick={() => {
                  onClose();
                  onRequestProduct(product.nameAr);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <BellRing className="w-4 h-4" />
                <span>طلب توفير هذا الدواء</span>
              </button>
            </div>
          ) : (
            <>
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>إضافة إلى السلة ({ (product.price * quantity).toLocaleString() } د.ع)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
