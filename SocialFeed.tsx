import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Tag, 
  AlertCircle,
  Plus,
  Users
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { SocialPost } from '../../types/pharmacy';

export const SocialFeed: React.FC = () => {
  const { posts, addPost, likePost, currentUser } = usePharmacy();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<SocialPost['category']>('tip');
  const [postComments, setPostComments] = useState<{ [postId: string]: { user: string; text: string; time: string }[] }>({
    'post-1': [
      { user: 'كرار مهدي', text: 'جزاكم الله خيراً دكتور، دائماً تقدمون نصائح تفيد العائلة.', time: 'منذ ساعة' },
      { user: 'أم سارة', text: 'هل يتوفر لديكم فيتامين سي فوار للأطفال؟', time: 'منذ نصف ساعة' },
    ]
  });
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    addPost(newPostTitle.trim(), newPostContent.trim(), newPostCategory);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostForm(false);
  };

  const handleAddPostComment = (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;
    setPostComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { user: currentUser.name, text, time: 'الآن' }
      ]
    }));
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  const getCategoryBadge = (cat: SocialPost['category']) => {
    switch (cat) {
      case 'tip': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'announcement': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'discount': return 'bg-red-100 text-red-800 border-red-300';
      case 'awareness': return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const getCategoryLabel = (cat: SocialPost['category']) => {
    switch (cat) {
      case 'tip': return 'نصيحة دوائية 💊';
      case 'announcement': return 'إعلان رسمي 📢';
      case 'discount': return 'عروض وتخفيضات 🏷️';
      case 'awareness': return 'توعية صحية 🌿';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 rounded-3xl shadow-md flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>مجتمع صيدلية الحود المركزية</span>
          </div>
          <h2 className="text-xl font-extrabold">منشورات واستشارات وتوعية صحية</h2>
          <p className="text-xs text-emerald-100 mt-0.5">تواصل مباشرة مع الصيادلة والزبائن وتعرف على أحدث النصائح.</p>
        </div>

        {currentUser.role === 'owner' && (
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-white text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-50 transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>نشر بوست</span>
          </button>
        )}
      </div>

      {/* New Post Form Modal or Box */}
      {showNewPostForm && (
        <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-slate-800 text-sm">إنشاء منشور جديد في المجتمع:</h3>
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="عنوان المنشور أو النصيحة..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
            required
          />
          <div className="flex items-center gap-2">
            <span className="text-slate-500">التصنيف:</span>
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
            >
              <option value="tip">نصيحة دوائية</option>
              <option value="announcement">إعلان رسمي</option>
              <option value="discount">عروض وتخفيضات</option>
              <option value="awareness">توعية صحية</option>
            </select>
          </div>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="اكتب تفاصيل التوجيه الطبي أو الخبر..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700"
            >
              نشر الآن
            </button>
            <button
              type="button"
              onClick={() => setShowNewPostForm(false)}
              className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => {
          const currentComments = postComments[post.id] || [];

          return (
            <div key={post.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
                    ✚
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900">{post.authorName}</span>
                      {post.isOfficialPharmacy && (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> موثق
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryBadge(post.category)}`}>
                  {getCategoryLabel(post.category)}
                </span>
              </div>

              {/* Post Body */}
              <div className="p-4 space-y-3 text-xs leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900">{post.title}</h3>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">{post.content}</p>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-red-500 font-bold transition"
                  >
                    <Heart className="w-4 h-4 fill-current text-red-500" />
                    <span>{post.likes} إعجاب</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{currentComments.length} تعليقات</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('تم نسخ رابط المنشور للمشاركة!');
                  }}
                  className="flex items-center gap-1 text-slate-400 hover:text-emerald-700"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-2.5">
                {currentComments.map((c, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-slate-800 text-[11px]">{c.user}</span>
                      <span className="text-[9px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{c.text}</p>
                  </div>
                ))}

                {/* Comment input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInput[post.id] || ''}
                    onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    placeholder="اكتب تعليقاً أو استفساراً..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddPostComment(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddPostComment(post.id)}
                    className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
