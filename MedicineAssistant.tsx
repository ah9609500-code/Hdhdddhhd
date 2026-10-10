import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Pill, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product } from '../../types/pharmacy';

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedProducts?: Product[];
  timestamp: string;
}

export const MedicineAssistant: React.FC = () => {
  const { products, addToCart, setActiveTab } = usePharmacy();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'أهلاً بك في المساعد الصيدلاني الذكي لصيدلية الحود المركزية 🩺!\nأنا هنا لمساعدتك في البحث في قائمة أدويتنا، شرح المادة الفعالة، التحقق من الأسعار والتوفر بالدينار العراقي، وتقديم النصائح العامة. كيف أستطيع خدمتك اليوم؟',
      timestamp: 'الآن'
    }
  ]);

  const quickQuestions = [
    'ما هو سعر بنادول إكسترا وهل متوفر؟',
    'أبحث عن مكملات أوميغا 3 وفيتامين د',
    'ما هي أدوية الضغط المتوفرة لديكم؟',
    'هل يتوفر غسول سيرافي للبشرة؟',
    'ما هي شروط صرف المضادات الحيوية؟'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Intelligent Catalog Matching and Response Engine
    setTimeout(() => {
      const q = userText.toLowerCase();
      let replyText = '';
      let matchedProds: Product[] = [];

      // Check matched products
      matchedProds = products.filter(p => 
        q.includes(p.nameAr.toLowerCase().split(' ')[0]) ||
        q.includes(p.genericName.toLowerCase().split(' ')[0]) ||
        (q.includes('ضغط') && p.category === 'medicines' && p.genericName.toLowerCase().includes('bisoprolol')) ||
        (q.includes('سكر') && (p.nameAr.includes('سكر') || p.genericName.toLowerCase().includes('metformin'))) ||
        (q.includes('أوميغا') && p.nameAr.includes('أوميغا')) ||
        (q.includes('فيتامين') && p.category === 'vitamins') ||
        (q.includes('سيرافي') && p.nameAr.includes('سيرافي')) ||
        (q.includes('بنادول') && p.nameAr.includes('بانادول'))
      );

      if (q.includes('وصفة') || q.includes('مضاد')) {
        replyText = 'المضادات الحيوية (مثل أوجمنتين وأموكسيسيلين) وأدوية الأمراض المزمنة تخضع لتعليمات نقابة صيادلة العراق ووزارة الصحة، ولا تصرف إلا بعد معاينة وصفة الطبيب لضمان سلامتك ومنع مقاومة البكتيريا.';
      } else if (matchedProds.length > 0) {
        replyText = `وجدت لك ${matchedProds.length} مستحضر مطابق في صيدلية الحود المركزية. يمكنك التحقق من السعر بالدينار العراقي وحالة التوفر بالمخزن أدناه:`;
      } else {
        replyText = 'بحثت في قاعدة بيانات صيدلية الحود المركزية، إذا لم تجد الدواء بالاسم التجاري المعتاد، يمكنك البحث باسم المادة الفعالة أو استخدام زر "طلب دواء غير متوفر" وسنقوم بتأمينه لك فوراً من الوكيل المعتمد.';
      }

      const assistantMsg: AssistantMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        matchedProducts: matchedProds.slice(0, 3),
        timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-black">المساعد الصيدلاني الذكي | صيدلية الحود</h2>
            <p className="text-xs text-emerald-200">فحص الأسعار والمخزون والمواد الفعالة مباشرة من قاعدة البيانات</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-emerald-100">
          <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <span>
            تنبيه مسؤولية طبية: يقدم المساعد معلومات توعوية عامة مستخلصة من دليل الصيدلية، ولا يقوم بتشخيص الأمراض أو تعديل الجرعات الطبية دون مراجعة الطبيب المختص.
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 min-h-[400px] flex flex-col justify-between space-y-4">
        <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tl-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tr-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-emerald-200 text-left' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Render matched products if any */}
              {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                <div className="w-full mt-2.5 space-y-2">
                  {msg.matchedProducts.map(p => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs flex justify-between items-center gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt={p.nameAr} className="w-11 h-11 rounded-xl object-cover bg-slate-50 border shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-800 line-clamp-1">{p.nameAr}</h4>
                          <span className="text-[10px] text-emerald-700 font-mono block">{p.genericName} - {p.strength}</span>
                          <span className="font-black text-emerald-900 text-xs">{p.price.toLocaleString()} د.ع</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(p)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shrink-0 text-[11px]"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>إضافة للسلة</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition border border-slate-200/60"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(input);
              }}
              placeholder="اسأل عن دواء، سعر، مادة فعالة، أو استفسار عام..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend(input)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-2xl flex items-center justify-center transition"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
