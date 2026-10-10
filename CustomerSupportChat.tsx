import React, { useState } from 'react';
import { MessageCircle, Send, CheckCheck, Phone, ShieldCheck, Clock } from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const CustomerSupportChat: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser } = usePharmacy();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const quickQuestions = [
    'مرحباً، هل يمكنني الاستفسار عن توفر وصفة طبية؟',
    'أريد معرفة موعد وصول الطلب إلى منطقتي',
    'هل يمكن توفير بديل لنفس المادة الفعالة؟'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-emerald-800 text-white p-4 rounded-3xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
            ✚
          </div>
          <div>
            <h2 className="text-base font-extrabold">المحادثة المباشرة مع صيدلية الحود</h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>الصيدلي المناوب متاح للرد على استفساراتك الآن</span>
            </div>
          </div>
        </div>

        <a
          href="tel:07701234500"
          className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition"
          title="اتصال هاتفي مباشر"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 min-h-[420px] flex flex-col justify-between space-y-4">
        <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
          {chatMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tl-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tr-xs'
                  }`}
                >
                  <span className={`block font-bold text-[10px] mb-1 ${isMe ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    {msg.senderName}
                  </span>
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className={`text-[9px] ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendChatMessage(q)}
                className="bg-slate-100 hover:bg-emerald-50 text-slate-600 px-3 py-1 rounded-xl text-[11px] whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك أو استفسارك الدوائي..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-2xl flex items-center justify-center transition"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
