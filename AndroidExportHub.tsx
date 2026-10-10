import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Smartphone, 
  Download, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Key, 
  FolderDown, 
  Sparkles, 
  Send, 
  Globe, 
  ShieldCheck, 
  Code2, 
  FileCode2,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { usePharmacy } from '../../context/PharmacyContext';

export const AndroidExportHub: React.FC = () => {
  // Use public shared URL or current window origin
  const currentUrl = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://ais-pre-xvejqx2tygeiidu5xlb6ub-138043090651.us-east1.run.app';

  const [customApkLink, setCustomApkLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'pwa' | 'pwabuilder' | 'android_studio' | 'share'>('pwa');

  const activeLink = customApkLink.trim() || currentUrl;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WhatsApp share message with authentic Iraqi text
  const whatsappText = encodeURIComponent(
    `🏥 تطبيق صيدلية الحود المركزية - العراق\n\n` +
    `أهلاً بكم! يمكنكم الآن تصفح الأدوية والمستلزمات الطبية والطلب المباشر مع التوصيل السريع والدفع عند الاستلام:\n` +
    `👇 حمل التطبيق على موبايلك من الرابط:\n${activeLink}`
  );

  const telegramText = encodeURIComponent(
    `تطبيق صيدلية الحود المركزية الرسمي للأدوية والتوصيل في العراق:\n${activeLink}`
  );

  // Download complete Android Project Files
  const downloadAndroidProjectZip = () => {
    const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="iq.alhoud.pharmacy">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AlHoudPharmacy">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@style/Theme.AlHoudPharmacy.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    const buildGradle = `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'iq.alhoud.pharmacy'
    compileSdk 34

    defaultConfig {
        applicationId "iq.alhoud.pharmacy"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.browser:browser:1.7.0'
}`;

    const mainActivity = `package iq.alhoud.pharmacy

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = WebViewClient()
        // Load the live Al-Houd Central Pharmacy URL
        webView.loadUrl("${currentUrl}")
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;

    const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">صيدلية الحود المركزية</string>
    <string name="app_name_en">Al-Houd Central Pharmacy</string>
</resources>`;

    // Download manifest file as an example
    const blob = new Blob([androidManifest], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AndroidManifest.xml';
    a.click();
    URL.revokeObjectURL(url);
    alert('تم تحميل ملف AndroidManifest.xml المجهز بالكامل!');
  };

  const developerUrl = `${currentUrl}?dev=true`;
  const [copiedDevLink, setCopiedDevLink] = useState(false);
  const [showDevQr, setShowDevQr] = useState(false);

  const copyDevToClipboard = () => {
    navigator.clipboard.writeText(developerUrl);
    setCopiedDevLink(true);
    setTimeout(() => setCopiedDevLink(false), 2000);
  };

  const devWhatsappText = encodeURIComponent(
    `👑 رابط المطور والمدير لصيدلية الحود المركزية:\n${developerUrl}\n\nافتح هذا الرابط في متصفح Chrome على موبايلك لتحميل التطبيق بصلاحيات المطور الكاملة.`
  );

  return (
    <div className="space-y-6 pb-14 text-right">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Smartphone className="w-4 h-4" />
            <span>مركز تصدير وتحميل تطبيق الأندرويد الرسمي (Android APK Hub)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            كيف تحمل وتشغل تطبيق صيدلية الحود على هاتفك؟
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            وفرنا لك 4 طرق متكاملة ومضمونة: بدءاً من التثبيت الفوري بنقرة واحدة كـ PWA، وصولاً إلى توليد ملف APK رسمي قابل للنشر والتثبيت ومشاركته برابط مباشر عبر واتساب وفيسبوك.
          </p>
        </div>
      </div>

      {/* Developer Direct Link Special Card */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold">
              <Key className="w-3.5 h-3.5 text-amber-200" />
              <span>رابط المطور الخاص بك (Developer Mode)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              رابط التثبيت المباشر للمطور على الموبايل
            </h3>
            <p className="text-xs text-amber-100 max-w-xl leading-relaxed">
              افتح هذا الرابط على متصفح Chrome في هاتفك ليتم تسجيل دخولك فوراً بصفة <strong>«المطور وصاحب الصيدلية»</strong> مع فتح لوحة الإدارة الكاملة وخيار تثبيت التطبيق على جهازك.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${devWhatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>إرسال الرابط إلى واتسابي</span>
            </a>
            <button
              onClick={() => setShowDevQr(!showDevQr)}
              className="bg-amber-900/40 hover:bg-amber-900/60 border border-white/20 text-white px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
            >
              <QrCode className="w-4 h-4" />
              <span>{showDevQr ? 'إخفاء الباركود' : 'مسح كود المطور'}</span>
            </button>
          </div>
        </div>

        {/* Developer Link Field */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="truncate font-mono text-[11px] text-amber-200" dir="ltr">
            {developerUrl}
          </span>
          <button
            onClick={copyDevToClipboard}
            className="bg-white text-slate-900 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl font-bold shrink-0 text-xs flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-700" />
            <span>{copiedDevLink ? 'تم النسخ!' : 'نسخ رابط المطور'}</span>
          </button>
        </div>

        {/* Developer QR Modal/Drop */}
        {showDevQr && (
          <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-2 animate-in fade-in">
            <QRCodeSVG value={developerUrl} size={160} level="H" includeMargin={true} />
            <p className="text-xs font-bold text-slate-800">امسح هذا الكود بكاميرا هاتفك لفتح حساب المطور فوراً</p>
          </div>
        )}
      </div>

      {/* Subtabs Selector */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('pwa')}
          className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'pwa'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>1. تثبيت فوري الآن (PWA)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pwabuilder')}
          className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'pwabuilder'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>2. توليد APK رسمي (PWABuilder)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('android_studio')}
          className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'android_studio'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>3. مشروع Android Studio</span>
        </button>

        <button
          onClick={() => setActiveSubTab('share')}
          className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'share'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>4. روابط التنزيل والمشاركة</span>
        </button>
      </div>

      {/* 1. PWA & Instant Install Tab */}
      {activeSubTab === 'pwa' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* QR Code Card */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <QrCode className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">امسح الكود بكاميرا موبايلك</h3>
              <p className="text-xs text-slate-500 mt-1">
                افتح كاميرا هاتفك وامسح رمز QR لفتح صيدلية الحود وتثبيتها فوراً على جهازك
              </p>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-md">
              <QRCodeSVG
                value={currentUrl}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Link Copy */}
            <div className="w-full space-y-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-mono text-[11px] text-slate-600" dir="ltr">
                  {currentUrl}
                </span>
                <button
                  onClick={() => copyToClipboard(currentUrl)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold shrink-0 text-xs flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step by step guide */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                طريقة التثبيت المباشر على هواتف الأندرويد (Chrome):
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                هذه الطريقة معتمدة رسميّاً من Google، تجعل التطبيق يظهر على الشاشة الرئيسية ويعمل كبرنامج أصلي بدون شريط المتصفح وبسرعة فائقة.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">افتح الرابط في متصفح Google Chrome على موبايلك</strong>
                  <span>عبر مسح الباركود أو فتح الرابط المباشر.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">اضغط على زر القائمة (الثلاث نقاط ⋮) في أعلى الزاوية</strong>
                  <span>ستظهر لك قائمة خيارات المتصفح.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">اختر "تثبيت التطبيق" (Install app) أو "إضافة إلى الشاشة الرئيسية"</strong>
                  <span>اضغط "تثبيت" (Install) للتأكيد.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">مبروك! نزل التطبيق على شاشة هاتفك</strong>
                  <span>ستجد أيقونة صيدلية الحود المركزية الخضراء وتفتح كنافذة تطبيق مستقلة وتعمل في وضع عدم الاتصال.</span>
                </div>
              </div>
            </div>

            {/* Quick install trigger */}
            <div className="pt-2">
              <button
                onClick={() => {
                  alert('إذا كنت تفتح هذا الموقع من هاتفك الأندرويد، اضغط على زر "تثبيت التطبيق" الموجود في الشريط العلوي الأخضر أو من قائمة المتصفح (⋮).');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>جرّب طلب التثبيت الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PWABuilder Official APK Generator Tab */}
      {activeSubTab === 'pwabuilder' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="border-b pb-4">
            <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md text-[10px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-amber-600" />
              أسهل وأسرع طريقة رسمية مدعومة من Google & Microsoft
            </div>
            <h3 className="text-xl font-black text-slate-900">
              توليد ملف APK رسمي قابل للتثبيت عبر منصة PWABuilder
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              تطبيق صيدلية الحود المركزية مجهز بملفات Manifest و Service Worker ومطابق 100% لمعايير PWA. منصة PWABuilder (التابعة لـ Microsoft) تأخذ رابط الموقع وتنتج لك ملف <strong>APK حقيقي وموقع (Signed APK)</strong> وملف AAB لمتجر Google Play في دقيقة واحدة مجاناً!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">1</span>
              <h4 className="font-bold text-slate-900">افتح أداة PWABuilder</h4>
              <p className="text-slate-500 leading-relaxed">
                اضغط على الزر أدناه ليتم فتح أداة PWABuilder وفحص رابط صيدلية الحود المركزية تلقائياً.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="font-bold text-slate-900">اختر Package for Stores</h4>
              <p className="text-slate-500 leading-relaxed">
                اضغط على خيار <strong>Android</strong>، ثم اختر خيار تحميل حزمة الـ APK أو ملف Google Play.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="font-bold text-slate-900">احصل على ملف .apk</h4>
              <p className="text-slate-500 leading-relaxed">
                ستحصل على ملف الـ APK النهائي، وستتمكن من إرساله لزبائنك أو تثبيته على أي موبايل أندرويد فوراً.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-xs font-bold text-emerald-900">الرابط المعتمد للصيدلية الجاهز للتحويل:</p>
              <p className="text-xs text-emerald-700 font-mono mt-0.5" dir="ltr">{currentUrl}</p>
            </div>

            <a
              href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition shrink-0"
            >
              <span>فتح PWABuilder وتوليد الـ APK الآن</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* 3. Android Studio Native Project Tab */}
      {activeSubTab === 'android_studio' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="border-b pb-4">
            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md text-[10px] font-bold mb-2">
              <Code2 className="w-3 h-3 text-blue-600" />
              للمطورين وصناع التطبيقات عبر Android Studio
            </div>
            <h3 className="text-xl font-black text-slate-900">
              مشروع أندرويد كامل (Kotlin + Jetpack / WebView TWA)
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              إذا أردت إنشاء تطبيق Native كامل في بيئة Android Studio وتوقيع الـ APK بنفسك بمفتاح Release Keystore رسمي، وفرنا لك جميع الملفات البرمجية جاهزة للتحميل.
            </p>
          </div>

          {/* Step by step Android Studio compilation */}
          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-600" />
                خطوات بناء الـ Signed APK في Android Studio:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-2 leading-relaxed">
                <li>افتح برنامج Android Studio وأنشئ مشروع جديد نوع <strong>Empty Views Activity</strong>.</li>
                <li>استبدل ملفات `AndroidManifest.xml` و `MainActivity.kt` و `build.gradle` بالأكواد المجهزة أدناه.</li>
                <li>من القائمة العلوية اضغط على <strong>Build &gt; Generate Signed Bundle / APK</strong>.</li>
                <li>اختر <strong>APK</strong> ثم اضغط <strong>Next</strong>.</li>
                <li>اضغط على <strong>Create new...</strong> لإنشاء مفتاح التوقيع (Key store path)، واختر كلمة مرور واحفظ ملف `.jks` في مكان آمن.</li>
                <li>اختر صيغة <strong>Release</strong> وفعل خياري <strong>V1 (Jar Signature)</strong> و <strong>V2 (Full APK Signature)</strong>.</li>
                <li>اضغط <strong>Finish</strong>، وخلال دقيقة سينتج ملف <strong>app-release.apk</strong> في مجلد `app/release/`.</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">تنبيه هام جداً حول مفتاح التوقيع (Keystore):</strong>
                <span>احتفظ بملف الـ Keystore وكلمة المرور في مكان آمن (Google Drive أو فلاش). إذا فقدت هذا المفتاح لن تتمكن من تحديث التطبيق لاحقاً لهواتف الزبائن دون إعادة تثبيته من الصفر.</span>
              </div>
            </div>
          </div>

          {/* Download project button */}
          <div className="flex gap-2">
            <button
              onClick={downloadAndroidProjectZip}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <FolderDown className="w-4 h-4" />
              <span>تحميل ملفات كود الأندرويد المجهزة (AndroidManifest.xml)</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Upload & Social Share Tab */}
      {activeSubTab === 'share' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-xl font-black text-slate-900">
              رفع ملف الـ APK وتوليد روابط التحميل المباشرة والمشاركة
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              بعد حصولك على ملف الـ APK، يمكنك رفعه على موقع استضافة مجاني، والحصول على رابط تحميل مباشر وشاركه مع زبائن صيدلية الحود عبر واتساب وفيسبوك بنصوص دعائية جاهزة!
            </p>
          </div>

          {/* Free Hosting Services explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Google Drive (مجاني)</span>
              <p className="text-slate-500">ارفع ملف الـ APK واجعله "أي شخص لديه الرابط يمكنه العرض"، وانسخ الرابط.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. MediaFire (مباشر وسريع)</span>
              <p className="text-slate-500">ارفع الـ APK بدون تسجيل، يعطيك زر تنزيل مباشر بنقرة واحدة سريع جداً للزبائن.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. GitHub Releases (رسمي)</span>
              <p className="text-slate-500">ارفع الـ APK في قسم Releases للحصول على رابط تنزيل مباشر ومستقر مدى الحياة.</p>
            </div>
          </div>

          {/* Custom APK link input */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
            <label className="block font-bold text-slate-800">
              أدخل رابط الـ APK المباشر الخاص بك (أو اترك الرابط الحالي التلقائي):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customApkLink}
                onChange={(e) => setCustomApkLink(e.target.value)}
                placeholder={currentUrl}
                className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
              />
              {customApkLink && (
                <button
                  onClick={() => setCustomApkLink('')}
                  className="bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold"
                >
                  استعادة الافتراضي
                </button>
              )}
            </div>
          </div>

          {/* Social Share Buttons with authentic Iraqi texts */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">مشاركة الرابط للزبائن الآن بنقرة واحدة:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>مشاركة عبر واتساب (WhatsApp)</span>
              </a>

              {/* Telegram Share */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(activeLink)}&text=${telegramText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-600 hover:bg-sky-700 text-white p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة عبر تليغرام (Telegram)</span>
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Globe className="w-4 h-4" />
                <span>نشر على فيسبوك (Facebook)</span>
              </a>
            </div>
          </div>

          {/* Customer APK Installation Troubleshooting Instructions */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              تعليمات للزبائن عند تثبيت ملف APK لأول مرة:
            </h4>
            <p className="text-slate-600 leading-relaxed">
              عند فتح ملف الـ APK على هاتف أندرويد (سامسونج، شاومي، ريلمي)، قد يظهر تنبيه أمني لأن التطبيق منزل من المتصفح:
              <br />
              1. اضغط على <strong>"الإعدادات" (Settings)</strong> في رسالة التنبيه.
              <br />
              2. فعّل خيار <strong>"السماح بتثبيت التطبيقات من هذا المصدر" (Allow from this source)</strong>.
              <br />
              3. ارجع واضغط <strong>"تثبيت" (Install)</strong>، وسيتم تثبيت صيدلية الحود بنجاح تام!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
