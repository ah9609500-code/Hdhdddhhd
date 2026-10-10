import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback instruction for Android Chrome
      alert('لتثبيت التطبيق على أندرويد:\n1. اضغط على زر القائمة (الثلاث نقاط ⋮) في أعلى المتصفح.\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".');
    }
  };

  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white px-4 py-3 shadow-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 text-right w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">تثبيت تطبيق صيدلية الحود على هاتفك</span>
                <span className="bg-amber-400 text-amber-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded">مجاني وسريع</span>
              </div>
              <p className="text-xs text-emerald-100">
                يعمل كتطبيق أندرويد أصلي، يدعم التصفح السريع والإشعارات بدون الحاجة للبحث في المتصفح.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>تثبيت التطبيق الآن</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-right text-slate-800 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Share className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">تثبيت التطبيق على آيفون (iOS)</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>اضغط على زر <strong>المشاركة (Share ⬆️)</strong> في شريط متصفح Safari بالأسفل.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>مرر للأسفل واضغط على <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>اضغط <strong>إضافة (Add)</strong> وسيظهر أيقونة صيدلية الحود مع تطبيقاتك!</span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
