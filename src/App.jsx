import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Smartphone,
  Wrench,
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  X,
  Sparkles,
  MessageCircle,
  Settings,
  Copy,
  MapPin,
  Clock,
  Award,
  Zap,
  CheckCircle2,
  Upload,
  Eye,
  Cpu,
  RotateCcw,
  ArrowUpLeft,
  ArrowLeft,
  ArrowRight,
  Heart,
  Menu,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";

// ============================================================================
// إعدادات المتجر المركزية (WHITE-LABEL STORE_CONFIG)
// ============================================================================
const STORE_CONFIG = {
  brandNameAr: 'شركة الطالب للإتصالات',
  brandNameEn: 'Al-Taleb',
  brandSubEn: 'MOBILE STORE',
  brandInitials: 'AT',
  customLogoUrl: '',

  slogan: 'دائماً وأبداً شعارنا: ثقتكم تهمنا',
  sloganPrefix: 'دائماً وأبداً شعارنا:',
  sloganHighlight: 'ثقتكم تهمنا',
  topAnnouncement: 'كفالة شهر بعد المبيع • بيع وشراء مدى الحياة • ثقتكم تهمنا',

  colors: {
    primary: '#0095D9',
    secondary: '#6CBE45',
    darkBg: '#050507',
    lightBg: '#F5F5F7',
  },

  defaultWhatsapp: '963942011130',
  defaultSalesPhone: '963942011130',
  defaultRepairPhone: '963942011130',
  defaultChannelUrl: 'https://www.whatsapp.com/channel/0029VaCMm90KbYMJyac2v10R',
  storeAddress: 'الفرع الرئيسي - شارع الجامع الكبير - جانب معجنات الحرية',
  workHours: 'يومياً من 10:00 صباحاً حتى 10:00 مساءً',
  showroomImage:
    'https://images.unsplash.com/photo-1656078411660-05f2cf994d33?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  instagramFollowers: '442K',
  instagramLabel: 'متابع على وسائل التواصل الاجتماعي',
  warrantyPeriod: 'شهر',
  warrantyLabel: 'كفالة حقيقية بعد المبيع',
  buyBackPolicy: 'مدى الحياة',
  buyBackLabel: 'بيع وشراء وتبديل',

  defaultCurrency: '$',
  defaultExchangeRate: 150,
  defaultAdminPin: 'admin',
  storageCollectionPrefix: 'altaleb_store',
};

// --- Firebase Initialization ---
let app, auth, db;
const appId = 'altaleb-mobile-store'; 

const firebaseConfig = {
  apiKey: "AIzaSyBLA-1QcTr2oKT-5uVy9Kl28Wv9u6XyXrk",
  authDomain: "al-taleb-mobile-store.firebaseapp.com",
  projectId: "al-taleb-mobile-store",
  storageBucket: "al-taleb-mobile-store.firebasestorage.app",
  messagingSenderId: "765958809693",
  appId: "1:765958809693:web:5d78ec52d5c3105c1d85b4",
  measurementId: "G-EJCEVFSDMF"
};

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase fallback mode:', e);
}

// --- Dynamic Brand Logo Component ---
const AlTalebLogo = ({
  size = 'md',
  darkText = false,
  customLogoUrl = STORE_CONFIG.customLogoUrl,
}) => {
  const scale =
    size === 'sm' ? 'scale-90' : size === 'lg' ? 'scale-110' : 'scale-100';

  if (customLogoUrl) {
    const heights = { sm: 'h-9', md: 'h-11', lg: 'h-14' };
    return (
      <img
        src={customLogoUrl}
        alt={STORE_CONFIG.brandNameAr}
        className={`${
          heights[size] || 'h-11'
        } w-auto object-contain select-none`}
      />
    );
  }

  return (
    <div
      dir="ltr"
      className={`inline-flex items-center gap-2.5 select-none ${scale}`}
    >
      <div className="relative flex items-center">
        <div className="flex flex-col items-end gap-1 mr-1">
          <span
            className="w-2.5 h-0.5 rounded-full"
            style={{ backgroundColor: STORE_CONFIG.colors.secondary }}
          />
          <span
            className="w-3.5 h-0.5 rounded-full"
            style={{ backgroundColor: STORE_CONFIG.colors.secondary }}
          />
          <span
            className="w-2 h-0.5 rounded-full"
            style={{ backgroundColor: STORE_CONFIG.colors.secondary }}
          />
        </div>
        <div
          className="w-7 h-11 rounded-lg border-2 flex flex-col items-center justify-between py-1 px-0.5 shadow-xs"
          style={{
            borderColor: STORE_CONFIG.colors.primary,
            backgroundColor: `${STORE_CONFIG.colors.primary}1A`,
          }}
        >
          <span
            className="w-2.5 h-0.5 rounded-full"
            style={{ backgroundColor: STORE_CONFIG.colors.primary }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: STORE_CONFIG.colors.primary }}
          />
        </div>
      </div>

      <div className="flex flex-col items-start leading-none">
        <div className="relative flex items-center">
          <span
            className={`text-lg sm:text-xl font-extrabold tracking-tight ${
              darkText ? 'text-[#1D1D1F]' : 'text-white'
            }`}
          >
            {STORE_CONFIG.brandNameEn}
          </span>
          <svg
            className="w-4 h-4 -mt-3 ml-0.5"
            style={{ color: STORE_CONFIG.colors.secondary }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 w-full mt-0.5">
          <span
            className="h-[1.5px] flex-1 rounded-full"
            style={{ backgroundColor: STORE_CONFIG.colors.secondary }}
          />
          <span
            className="text-[8px] font-bold tracking-[0.16em] uppercase"
            style={{ color: STORE_CONFIG.colors.secondary }}
          >
            {STORE_CONFIG.brandSubEn}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Centered Crest Icon ---
const AlTalebCrest = () => (
  <div className="flex flex-col items-center select-none">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white/[0.09] to-white/[0.02] border border-white/15 flex items-center justify-center shadow-lg relative">
      <div
        className="w-6 h-10 rounded-md border-2 flex flex-col items-center justify-between py-1"
        style={{ borderColor: STORE_CONFIG.colors.primary }}
      >
        <span
          className="w-2 h-0.5 rounded-full"
          style={{ backgroundColor: STORE_CONFIG.colors.secondary }}
        />
        <span className="text-[8px] font-black text-white tracking-tighter">
          {STORE_CONFIG.brandInitials}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: STORE_CONFIG.colors.primary }}
        />
      </div>
      <span
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#050507]"
        style={{ backgroundColor: STORE_CONFIG.colors.secondary }}
      />
    </div>
    <span className="text-[9px] font-bold tracking-[0.28em] text-neutral-400 uppercase mt-2">
      {STORE_CONFIG.brandNameEn} {STORE_CONFIG.brandSubEn}
    </span>
  </div>
);

// --- Interactive HTML5 Canvas Scratch-to-Reveal Price Card ---
const ScratchPriceCard = ({ price, sypPrice, currencySymbol, isRevealed, onReveal }) => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#E6E9EF');
    grad.addColorStop(0.5, '#F8FAFC');
    grad.addColorStop(1, '#CFD6E2');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((-16 * Math.PI) / 180);
    ctx.fillStyle = 'rgba(29, 29, 31, 0.08)';
    ctx.font = '700 10px "IBM Plex Sans Arabic", sans-serif';
    ctx.textAlign = 'center';
    const watermarkText = `${STORE_CONFIG.brandNameEn.toUpperCase()} ♦ STORE`;
    for (let y = -h; y < h * 1.5; y += 22) {
      for (let x = -w; x < w * 1.5; x += 105) {
        ctx.fillText(watermarkText, x, y);
      }
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 12, 18, 0, Math.PI * 2);
    const coinGrad = ctx.createLinearGradient(w / 2 - 18, h / 2 - 30, w / 2 + 18, h / 2 + 6);
    coinGrad.addColorStop(0, '#FACC15');
    coinGrad.addColorStop(1, '#CA8A04');
    ctx.fillStyle = coinGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.fillStyle = '#1D1D1F';
    ctx.font = '800 10px "IBM Plex Sans Arabic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(STORE_CONFIG.brandInitials, w / 2, h / 2 - 12);
    ctx.restore();

    const pillW = 166;
    const pillH = 26;
    const pillX = (w - pillW) / 2;
    const pillY = h / 2 + 12;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 13);
    ctx.fill();

    ctx.fillStyle = '#1D1D1F';
    ctx.font = '700 11px "IBM Plex Sans Arabic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('امسح بإصبعك واكشف السعر', w / 2, pillY + pillH / 2);
    ctx.restore();
  }, [isRevealed, price]);

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      const totalSampled = imgData.length / 64;
      for (let i = 3; i < imgData.length; i += 64) {
        if (imgData[i] < 128) clearPixels++;
      }
      if (clearPixels / totalSampled > 0.36) {
        onReveal();
      }
    } catch (err) {}
  };

  return (
    <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden select-none border border-white/15 bg-gradient-to-br from-[#161922] via-[#111318] to-[#0B0D12] shadow-inner">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
        <span className="text-[12px] font-semibold text-[#6CBE45] mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>سعر العرض الحصري اليوم</span>
        </span>
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1">
          <span>{currencySymbol}{price}</span>
        </div>
        {sypPrice && (
          <div className="text-xs font-semibold text-[#0095D9] mt-1 bg-[#0095D9]/10 px-3 py-0.5 rounded-full border border-[#0095D9]/20">
            {sypPrice}
          </div>
        )}
      </div>

      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => { isDrawingRef.current = true; scratchAt(e.clientX, e.clientY); }}
          onMouseMove={(e) => { if (isDrawingRef.current) scratchAt(e.clientX, e.clientY); }}
          onMouseUp={() => { isDrawingRef.current = false; }}
          onMouseLeave={() => { isDrawingRef.current = false; }}
          onTouchStart={(e) => { isDrawingRef.current = true; const t = e.touches[0]; if (t) scratchAt(t.clientX, t.clientY); }}
          onTouchMove={(e) => { const t = e.touches[0]; if (t) scratchAt(t.clientX, t.clientY); }}
          onTouchEnd={() => { isDrawingRef.current = false; }}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none"
        />
      )}
    </div>
  );
};

// --- Initial Data Sets ---
const DEFAULT_SETTINGS = {
  storeName: STORE_CONFIG.brandNameAr,
  storeSubName: `${STORE_CONFIG.brandNameEn} ${STORE_CONFIG.brandSubEn}`,
  topAnnouncement: STORE_CONFIG.topAnnouncement,
  heroSloganPrefix: STORE_CONFIG.sloganPrefix,
  heroSloganHighlight: STORE_CONFIG.sloganHighlight,
  whatsappNumber: STORE_CONFIG.defaultWhatsapp,
  salesPhone: STORE_CONFIG.defaultSalesPhone,
  repairPhone: STORE_CONFIG.defaultRepairPhone,
  whatsappChannel: STORE_CONFIG.defaultChannelUrl,
  currencySymbol: STORE_CONFIG.defaultCurrency,
  exchangeRateSYP: STORE_CONFIG.defaultExchangeRate,
  showSYP: true,
  adminPassword: STORE_CONFIG.defaultAdminPin,
  stat1Val: STORE_CONFIG.instagramFollowers,
  stat1Label: STORE_CONFIG.instagramLabel,
  stat3Val: STORE_CONFIG.warrantyPeriod,
  stat3Label: STORE_CONFIG.warrantyLabel,
  stat4Val: STORE_CONFIG.buyBackPolicy,
  stat4Label: STORE_CONFIG.buyBackLabel,
  midBannerTitle: 'بيع أو استبدل جهازك القديم بأفضل سعر',
  midBannerSub: 'أرسل مواصفات وصور جهازك عبر واتساب لتحصل على تقييم فوري أو استبداله بجهاز أحدث بفرق سعر مدروس.',
  locationTitle: 'موقعنا وتواصل معنا',
  locationDesc: 'نستقبلكم يومياً في صالة العرض لتجربة الأجهزة والاطلاع على أحدث العروض والمسابقات اليومية.',
  addressLine1: STORE_CONFIG.storeAddress,
  workingHours: STORE_CONFIG.workHours,
  showroomImage: STORE_CONFIG.showroomImage,
};

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'الكل', sheetLabel: 'ALL' },
  { id: 'iphone', name: 'iPhone', sheetLabel: 'IPHONE' },
  { id: 'samsung', name: 'Samsung', sheetLabel: 'SAMSUNG' },
  { id: 'xiaomi', name: 'Xiaomi', sheetLabel: 'XIAOMI' },
  { id: 'infinix', name: 'Infinix', sheetLabel: 'INFINIX' },
  { id: 'honor', name: 'Honor', sheetLabel: 'HONOR' },
  { id: 'tecno', name: 'Tecno', sheetLabel: 'TECNO' },
  { id: 'other', name: 'أخرى', sheetLabel: 'أخرى' },
  { id: 'accessories', name: 'إكسسوارات', sheetLabel: 'إكسسوارات' },
];

const PRICE_SHEET_CATEGORY_ORDER = [
  { id: 'iphone', label: 'IPHONE' },
  { id: 'samsung', label: 'SAMSUNG' },
  { id: 'xiaomi', label: 'XIAOMI' },
  { id: 'infinix', label: 'INFINIX' },
  { id: 'honor', label: 'HONOR' },
  { id: 'tecno', label: 'TECNO' },
  { id: 'other', label: 'أخرى' },
  { id: 'accessories', label: 'إكسسوارات' },
];

const DEFAULT_PRODUCTS = [
  { id: 'p-1', title: 'IPHONE 16 PRO MAX 256GB', category: 'iphone', specs: 'بطارية 100% • تيتانيوم صحراوي • مع كفالة', price: 1185, oldPrice: 1250, badge: 'عرض خاص', condition: 'جديد', isFeaturedOffer: true, imageUrl: 'https://images.unsplash.com/photo-1758684450598-513098d1d075?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', description: 'نسخة الشرق الأوسط، مختوم غير مفعل، مع كفالة حقيقية وتجهيز الحساب ونقل البيانات مجاناً.', inStock: true, createdAt: 1710000016000 },
  { id: 'p-2', title: 'IPHONE 15 PRO MAX 256GB', category: 'iphone', specs: 'بطارية 96% • تيتانيوم طبيعي • مع كفالة', price: 965, oldPrice: 1030, badge: 'عرض خاص', condition: 'مستعمل', isFeaturedOffer: true, imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=85', description: 'نظافة 100% خالي من أي خدش، غير مفتوح نهائياً على الفحص، مع العلبة الأصلية وكفالة شركة الطالب.', inStock: true, createdAt: 1710000015000 },
  { id: 'p-3', title: 'IPHONE 14 PRO MAX 256GB', category: 'iphone', specs: 'بطارية 92% • بنفسجي غامق • مع كفالة', price: 815, oldPrice: 870, badge: 'عرض خاص', condition: 'مستعمل', isFeaturedOffer: true, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=85', description: 'جهاز وكالة بالكامل، شاشة وبورد وبطارية أصلية 100%، مرفق مع لصقة حماية وكفر MagSafe هدية.', inStock: true, createdAt: 1710000014000 },
  { id: 'p-5', title: 'IPHONE 13 PRO 128GB', category: 'iphone', specs: 'بطارية 89% • أزرق سييرا • مع كفالة', price: 585, oldPrice: 630, badge: 'مستعمل نظيف', condition: 'مستعمل', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=85', description: 'حالة الوكالة بدون أي ملاحظة، شاشة 120Hz، مفحوص بالكامل على الكمبيوتر مع كفالة محل.', inStock: true, createdAt: 1710000013000 },
  { id: 'p-11', title: 'IPHONE 12 PRO MAX 256GB', category: 'iphone', specs: 'بطارية 87% • أزرق • مع كفالة', price: 510, oldPrice: 545, badge: 'مستعمل نظيف', condition: 'مستعمل', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=800&q=85', description: 'نظافة عالية جداً، جميع القطع أصلية، فيس آيدي وتروتون شغال 100%.', inStock: true, createdAt: 1710000012000 },
  { id: 'p-4', title: 'GALAXY S24 ULTRA 512GB', category: 'samsung', specs: 'رام 12GB • تيتانيوم رمادي • كفالة شاملة', price: 995, oldPrice: 1080, badge: 'عرض خاص', condition: 'جديد', isFeaturedOffer: true, imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=85', description: 'النسخة الرسمية شريحتين، معالج Snapdragon 8 Gen 3، يدعم ميزات الذكاء الاصطناعي بالكامل.', inStock: true, createdAt: 1710000011000 },
  { id: 'p-13', title: 'GALAXY S23 ULTRA 256GB', category: 'samsung', specs: 'رام 12GB • أخضر زيتي • مع كفالة', price: 685, oldPrice: 730, badge: 'مستعمل نظيف', condition: 'مستعمل', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&w=800&q=85', description: 'جهاز نظيف جداً كالجديد مع القلم الأصلي وكفالة شاملة من شركة الطالب.', inStock: true, createdAt: 1710000010000 },
  { id: 'p-6', title: 'REDMI NOTE 13 PRO+ 512GB', category: 'xiaomi', specs: 'رام 12GB • شحن 120W • كفالة سنة', price: 315, oldPrice: 340, badge: 'جديد', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85', description: 'شاشة منحنية AMOLED 120Hz، كاميرا 200MP، مع الشاحن الصاروخي 120 واط داخل العلبة.', inStock: true, createdAt: 1710000009000 },
  { id: 'p-14', title: 'INFINIX NOTE 40 PRO 256GB', category: 'infinix', specs: 'شحن MagCharge • كفالة سنة', price: 225, oldPrice: 250, badge: 'جديد', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85', description: 'شاشة أموليد منحنية مع شاحن لاسلكي مغناطيسي مرفق داخل العلبة.', inStock: true, createdAt: 1710000008000 },
  { id: 'p-15', title: 'HONOR X9B 5G 256GB', category: 'honor', specs: 'بطارية 5800mAh • شاشة ضد الكسر', price: 265, oldPrice: 290, badge: 'جديد', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=85', description: 'أقوى شاشة مقاومة للصدمات مع بطارية عملاقة تدوم حتى 3 أيام متواصلة.', inStock: true, createdAt: 1710000007000 },
  { id: 'p-16', title: 'TECNO CAMON 30 256GB', category: 'tecno', specs: 'رام 8+8GB • شحن 70W', price: 195, oldPrice: 215, badge: 'جديد', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=85', description: 'تصميم أنيق وكاميرا احترافية للتصوير الليلي مع شحن سريع جداً.', inStock: true, createdAt: 1710000006000 },
  { id: 'p-7', title: 'APPLE WATCH ULTRA 2', category: 'other', specs: '49mm تيتانيوم • GPS • أصلية', price: 690, oldPrice: 740, badge: 'أصلي', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=85', description: 'ساعة أبل ألترا الجيل الثاني الأصلية، هيكل تيتانيوم مقاوم للصدمات والماء مع بطارية تدوم طويلاً.', inStock: true, createdAt: 1710000005000 },
  { id: 'p-8', title: 'AIRPODS PRO 2 USB-C', category: 'accessories', specs: 'أصلية وكالة • عزل ضوضاء ذكي', price: 210, oldPrice: 235, badge: 'جديد', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=85', description: 'سماعة أبل الأصلية بمنفذ Type-C، صوت محيطي وعزل ضوضاء مضاعف مع كفالة حقيقية.', inStock: true, createdAt: 1710000004000 },
  { id: 'p-9', title: 'APPLE 20W CHARGER', category: 'accessories', specs: 'رأس شاحن Type-C وكالة • كفالة سنة', price: 20, oldPrice: 25, badge: 'أصلي 100%', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=85', description: 'شاحن أبل الأصلي يحمي بطارية جهازك من التلف ويشحن حتى 50% خلال 30 دقيقة فقط.', inStock: true, createdAt: 1710000003000 },
  { id: 'p-10', title: 'ANKER MAGGO 10000', category: 'accessories', specs: 'شحن لاسلكي Qi2 • مع ستاند مدمج', price: 45, oldPrice: 55, badge: 'جديد', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1609592424361-91f8bdf9b3e1?auto=format&fit=crop&w=800&q=85', description: 'بطارية مغناطيسية لاسلكية سريعة مع شاشة ذكية لعرض النسبة المتبقية ومنفذ Type-C.', inStock: true, createdAt: 1710000002000 },
  { id: 'p-12', title: 'MAGSAFE PACKAGE', category: 'accessories', specs: 'كفر شفاف أصلي + لصقة لقافة + حماية كاميرا', price: 15, oldPrice: 22, badge: 'عرض خاص', condition: 'جديد', isFeaturedOffer: false, imageUrl: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=800&q=85', description: 'حماية متكاملة 360 درجة متوفرة لكافة موديلات الآيفون من 11 حتى 16 برو ماكس.', inStock: true, createdAt: 1710000001000 },
];

const DEFAULT_SERVICES = [
  { id: 's-1', title: 'تبديل شاشة أصلية', sub: 'مع نقل التروتون بدون رسالة', price: 'حسب الموديل' },
  { id: 's-2', title: 'تبديل بطارية وكالة', sub: 'نسبة 100% مع كفالة حقيقية', price: 'ابتداءً من 25$' },
  { id: 's-3', title: 'صيانة بورد متقدمة', sub: 'إصلاح شورت، شبكة، شحن، صوت', price: 'فحص مجاني' },
  { id: 's-4', title: 'تبديل ظهر بالليزر', sub: 'إزالة الكسر دون فتح الجهاز', price: 'ابتداءً من 20$' },
  { id: 's-5', title: 'تخطي وفك قفل', sub: 'حسابات آيكلاود، جيميل، سوفت وير', price: 'ابتداءً من 10$' },
  { id: 's-6', title: 'فحص شامل قبل الشراء', sub: 'تقرير فحص كامل على الكمبيوتر', price: 'مجاناً للزبائن' },
  { id: 's-7', title: 'تبديل جام خارجي', sub: 'الحفاظ على شاشة الوكالة الأصلية', price: 'ابتداءً من 30$' },
  { id: 's-8', title: 'نقل بيانات ونسخ احتياطي', sub: 'نقل الواتساب وكافة الصور والأسماء', price: 'خدمة فورية' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [categories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [revealedOffers, setRevealedOffers] = useState({});
  const [favorites, setFavorites] = useState(['p-1', 'p-2']);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showPriceSheet, setShowPriceSheet] = useState(false);
  const [sheetZoom, setSheetZoom] = useState(1);
  const pinchStartDistRef = useRef(null);
  const pinchInitialZoomRef = useRef(1);
  const posterRef = useRef(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(window.location.hash === '#admin-12345-dashboard-67890');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('products');
  const [toastMessage, setToastMessage] = useState(null);

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', category: 'iphone', specs: '', battery: '', price: '', oldPrice: '',
    badge: 'عرض خاص', condition: 'جديد', isFeaturedOffer: false, imageUrl: '', description: '', inStock: true,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const formatSYP = (usdPrice) => {
    if (!settings.showSYP || !settings.exchangeRateSYP || !usdPrice) return null;
    const val = Math.round(Number(usdPrice) * Number(settings.exchangeRateSYP));
    return val.toLocaleString('en-US') + ' ل.س';
  };

  const availableProductsCount = useMemo(() => {
    return products.filter((p) => p.inStock !== false).length;
  }, [products]);

  const parseDeviceMeta = (prod) => {
    const combined = `${prod.title || ''} ${prod.specs || ''}`;
    const storageMatch = combined.match(/(\d+\s*(?:GB|TB))/i);
    const storage = storageMatch ? storageMatch[1].replace(/\s+/g, '').toUpperCase() : prod.condition === 'جديد' ? 'NEW' : '256GB';

    let battery = null;
    const isIphone = prod.category === 'iphone' || combined.toLowerCase().includes('iphone') || combined.includes('آيفون') || combined.includes('ايفون');
    if (isIphone) {
      const batteryMatch = combined.match(/(?:بطارية\s*)?(\d{2,3})%/);
      if (prod.condition === 'جديد') {
        battery = '100%';
      } else if (batteryMatch) {
        battery = `${batteryMatch[1]}%`;
      }
    }

    const shortName = (prod.title || '').replace(/^(IPHONE|SAMSUNG|GALAXY|XIAOMI|REDMI|INFINIX|HONOR|TECNO)\s*/i, '').replace(/(\d+\s*(?:GB|TB))/gi, '').trim();
    return { shortName: shortName || prod.title, storage, battery, isNew: prod.condition === 'جديد' || battery === '100%' };
  };

  const resolveProductOrderedCategory = (prod) => {
    const cat = (prod.category || '').toLowerCase();
    const title = (prod.title || '').toLowerCase();
    if (PRICE_SHEET_CATEGORY_ORDER.some((c) => c.id === cat)) return cat;
    if (title.includes('iphone') || title.includes('آيفون') || title.includes('ايفون')) return 'iphone';
    if (title.includes('samsung') || title.includes('galaxy') || title.includes('سامسونج')) return 'samsung';
    if (title.includes('xiaomi') || title.includes('redmi') || title.includes('poco') || title.includes('شاومي')) return 'xiaomi';
    if (title.includes('infinix') || title.includes('انفنكس') || title.includes('إنفنكس')) return 'infinix';
    if (title.includes('honor') || title.includes('هونر')) return 'honor';
    if (title.includes('tecno') || title.includes('تكنو')) return 'tecno';
    if (cat === 'accessories' || title.includes('شاحن') || title.includes('كفر') || title.includes('سماعة') || title.includes('باور')) return 'accessories';
    return 'other';
  };

  const priceSheetData = useMemo(() => {
    const available = products.filter((p) => p.inStock !== false);
    const orderedGroups = PRICE_SHEET_CATEGORY_ORDER.map((groupDef) => {
      const items = available.filter((p) => resolveProductOrderedCategory(p) === groupDef.id);
      return { ...groupDef, items };
    }).filter((g) => g.items.length > 0);

    const flatRows = [];
    orderedGroups.forEach((group) => {
      flatRows.push({ type: 'header', id: `hdr-${group.id}`, label: group.label });
      group.items.forEach((item) => {
        flatRows.push({ type: 'item', id: item.id, product: item });
      });
    });

    const totalRows = flatRows.length;
    const perCol = Math.max(1, Math.ceil(totalRows / 3));
    const col1 = flatRows.slice(0, perCol);
    const col2 = flatRows.slice(perCol, perCol * 2);
    const col3 = flatRows.slice(perCol * 2);

    return { orderedGroups, col1, col2, col3, allAvailable: available };
  }, [products]);

  const todayArabicDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString('ar-SY', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch (e) {
      return 'نشرة محدثة اليوم';
    }
  }, []);

  const handleDownloadPriceSheetImage = async () => {
    setIsGeneratingImage(true);
    try {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 1650;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0E1015');
      bgGrad.addColorStop(0.5, '#090A0D');
      bgGrad.addColorStop(1, '#050608');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const radialGlow = ctx.createRadialGradient(width / 2, 220, 40, width / 2, 220, 520);
      radialGlow.addColorStop(0, 'rgba(0, 149, 217, 0.14)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, 600);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 46px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText(STORE_CONFIG.brandNameEn, 85, 135);

      ctx.fillStyle = STORE_CONFIG.colors.secondary;
      ctx.font = '700 18px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText(STORE_CONFIG.brandSubEn, 88, 168);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 58px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText('نشرة الأسعار', width - 85, 135);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '500 24px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText(todayArabicDate, width - 85, 178);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 215);
      ctx.lineTo(width - 80, 215);
      ctx.stroke();

      const colWidth = 325;
      const colGap = 32;
      const startXRight = width - 80;

      const drawOrderedColumn = (rows, colIdx) => {
        const colRightX = startXRight - colIdx * (colWidth + colGap);
        const colLeftX = colRightX - colWidth;
        let y = 260;

        rows.forEach((row) => {
          if (y > 1235) return;
          if (row.type === 'header') {
            y += 6;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
            ctx.beginPath();
            ctx.roundRect(colLeftX, y - 22, 130, 30, 15);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '800 13px "IBM Plex Sans Arabic", sans-serif';
            ctx.fillText(row.label, colLeftX + 65, y - 3);
            y += 32;
          } else if (row.type === 'item') {
            const prod = row.product;
            const meta = parseDeviceMeta(prod);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(colLeftX, y + 11);
            ctx.lineTo(colRightX, y + 11);
            ctx.stroke();
            ctx.textAlign = 'left';
            ctx.fillStyle = '#F3F4F6';
            ctx.font = '700 15px "IBM Plex Sans Arabic", sans-serif';
            ctx.fillText(meta.shortName.slice(0, 16), colLeftX, y);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '600 12px "IBM Plex Sans Arabic", sans-serif';
            ctx.fillText(`${meta.storage}${meta.battery ? ` • ${meta.battery}` : ''}`, colLeftX + colWidth * 0.56, y);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '800 17px "IBM Plex Sans Arabic", sans-serif';
            ctx.fillText(`${settings.currencySymbol}${prod.price}`, colRightX, y);
            y += 38;
          }
        });
      };

      drawOrderedColumn(priceSheetData.col1, 0);
      drawOrderedColumn(priceSheetData.col2, 1);
      drawOrderedColumn(priceSheetData.col3, 2);

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(startXRight - colWidth - colGap / 2, 245);
      ctx.lineTo(startXRight - colWidth - colGap / 2, 1240);
      ctx.moveTo(startXRight - 2 * colWidth - 1.5 * colGap, 245);
      ctx.lineTo(startXRight - 2 * colWidth - 1.5 * colGap, 1240);
      ctx.stroke();

      const footerTop = 1285;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(120, footerTop);
      ctx.lineTo(width - 120, footerTop);
      ctx.stroke();

      ctx.fillStyle = '#14171F';
      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 90, footerTop - 22, 180, 44, 22);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 20px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText('واتس حصراً', width / 2, footerTop + 7);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '500 20px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText('قسم المبيعات', width / 2 + 190, footerTop + 62);
      ctx.fillText('قسم الصيانة', width / 2 - 190, footerTop + 62);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 32px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText(settings.salesPhone || '0935 240 669', width / 2 + 190, footerTop + 104);
      ctx.fillText(settings.repairPhone || '0986 895 611', width / 2 - 190, footerTop + 104);

      ctx.fillStyle = '#D1D5DB';
      ctx.font = '600 20px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText(`${STORE_CONFIG.brandNameAr} • ${STORE_CONFIG.slogan}`, width / 2, footerTop + 165);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '500 18px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText(settings.addressLine1, width / 2, footerTop + 205);

      ctx.fillStyle = '#6B7280';
      ctx.font = '500 16px "IBM Plex Sans Arabic", sans-serif';
      ctx.fillText('الأسعار قابلة للتغيير • ما في حجز، يلي بيسبق بياكل فستق', width / 2, footerTop + 245);

      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('حدث خطأ أثناء حفظ الصورة');
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `price-sheet-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = blobUrl;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        showToast('تم حفظ صورة نشرة الأسعار بجودة عالية');
      }, 'image/png');

    } catch (err) {
      showToast('حدث خطأ أثناء حفظ الصورة');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const featuredOffers = useMemo(() => {
    const list = products.filter((p) => p.isFeaturedOffer && p.inStock !== false);
    return list.length > 0 ? list : products.slice(0, 4);
  }, [products]);

  const currentOffer = featuredOffers[currentOfferIndex % Math.max(1, featuredOffers.length)] || products[0];

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin-12345-dashboard-67890') {
        setIsAdminDashboardOpen(false);
        setIsAdminAuthenticated(false);
        setIsAdminLoginOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsDataLoaded(true);
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        setIsDataLoaded(true);
      }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const configColName = `${STORE_CONFIG.storageCollectionPrefix}_config`;
  const productsColName = `${STORE_CONFIG.storageCollectionPrefix}_products`;

  useEffect(() => {
    if (!user || !db) return;
    const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', configColName, 'store_settings');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
      } else {
        setDoc(settingsRef, DEFAULT_SETTINGS).catch(() => {});
      }
    }, () => {});

    const servicesRef = doc(db, 'artifacts', appId, 'public', 'data', configColName, 'repair_services');
    const unsubServices = onSnapshot(servicesRef, (snap) => {
      if (snap.exists() && Array.isArray(snap.data().list)) {
        setServices(snap.data().list);
      } else {
        setDoc(servicesRef, { list: DEFAULT_SERVICES }).catch(() => {});
      }
    }, () => {});

    const productsCol = collection(db, 'artifacts', appId, 'public', 'data', productsColName);
    const unsubProducts = onSnapshot(productsCol, (snapshot) => {
      if (snapshot.empty && !isDataLoaded) {
        DEFAULT_PRODUCTS.forEach((p) => {
          const pDoc = doc(db, 'artifacts', appId, 'public', 'data', productsColName, p.id);
          setDoc(pDoc, p).catch(() => {});
        });
        setProducts(DEFAULT_PRODUCTS);
      } else if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProducts(list);
      }
      setIsDataLoaded(true);
    }, () => setIsDataLoaded(true));

    return () => {
      unsubSettings();
      unsubServices();
      unsubProducts();
    };
  }, [user, configColName, productsColName]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const prodCat = resolveProductOrderedCategory(p);
      const matchCat = selectedCategory === 'all' || prodCat === selectedCategory || p.category === selectedCategory;
      const matchCond = conditionFilter === 'all' || p.condition === conditionFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || (p.title && p.title.toLowerCase().includes(q)) || (p.specs && p.specs.toLowerCase().includes(q));
      return matchCat && matchCond && matchSearch;
    });
  }, [products, selectedCategory, conditionFilter, searchQuery]);

  const cleanPhone = (num) => (num || '').replace(/[^0-9]/g, '');

  const openWhatsAppProduct = (prod, e) => {
    if (e) e.stopPropagation();
    const phone = cleanPhone(settings.whatsappNumber);
    const sypText = formatSYP(prod.price) ? ` (${formatSYP(prod.price)})` : '';
    const text = `السلام عليكم *${settings.storeName}* 👋\nأرغب بطلب / الاستفسار عن الجهاز التالي:\n\n📱 *الجهاز:* ${prod.title}\n📝 *المواصفات:* ${prod.specs || '-'}\n💵 *السعر:* ${prod.price}${settings.currencySymbol}${sypText}\n\nهل متوفر حالياً؟`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openWhatsAppGeneral = (customText) => {
    const phone = cleanPhone(settings.whatsappNumber);
    const text = customText || `السلام عليكم *${settings.storeName}*، لدي استفسار بخصوص الأجهزة والعروض المتوفرة لديكم.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === (settings.adminPassword || 'admin')) {
      setIsAdminAuthenticated(true);
      setIsAdminLoginOpen(false);
      setIsAdminDashboardOpen(true);
      setPasswordInput('');
      setLoginError('');
      showToast('مرحباً بك في لوحة تحكم شركة الطالب');
    } else {
      setLoginError('كلمة المرور غير صحيحة');
    }
  };

  const copyAdminUrl = () => {
    const base = window.location.href.split('#')[0].split('?')[0];
    const url = `${base}#admin-12345-dashboard-67890`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    window.location.hash = 'altaleb-dashboard';
    showToast('تم نسخ رابط لوحة التحكم السري (#admin-12345-dashboard-67890)');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 700;
        const scale = MAX_W / img.width;
        canvas.width = img.width > MAX_W ? MAX_W : img.width;
        canvas.height = img.width > MAX_W ? img.height * scale : img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        setProductForm((prev) => ({ ...prev, imageUrl: dataUrl }));
        showToast('تم تجهيز الصورة بنجاح');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ title: '', category: 'iphone', specs: '', battery: '', price: '', oldPrice: '', badge: 'عرض خاص', condition: 'جديد', isFeaturedOffer: false, imageUrl: '', description: '', inStock: true });
    setIsProductFormOpen(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    let bat = '';
    let sp = prod.specs || '';
    const isIphone = prod.category === 'iphone' || (prod.title || '').toLowerCase().includes('iphone');
    if (isIphone && sp.includes('بطارية')) {
      const m = sp.match(/بطارية\s*(\d{2,3})%/);
      if (m) bat = m[1];
      sp = sp.replace(/بطارية\s*\d{2,3}%\s*•?\s*/, '').replace(/^•\s*/, '').trim();
    }
    setProductForm({ title: prod.title || '', category: prod.category || 'iphone', specs: sp, battery: bat, price: prod.price ?? '', oldPrice: prod.oldPrice ?? '', badge: prod.badge || '', condition: prod.condition || 'جديد', isFeaturedOffer: Boolean(prod.isFeaturedOffer), imageUrl: prod.imageUrl || '', description: prod.description || '', inStock: prod.inStock ?? true });
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;

    let finalSpecs = productForm.specs.trim();
    if (productForm.category === 'iphone') {
      if (productForm.condition === 'جديد') {
        finalSpecs = finalSpecs ? `بطارية 100% • ${finalSpecs}` : 'بطارية 100%';
      } else if (productForm.battery) {
        finalSpecs = finalSpecs ? `بطارية ${productForm.battery}% • ${finalSpecs}` : `بطارية ${productForm.battery}%`;
      }
    }

    const prodId = editingProduct ? editingProduct.id : `p-${Date.now()}`;
    const itemData = { id: prodId, title: productForm.title.trim(), category: productForm.category, specs: finalSpecs, price: Number(productForm.price) || 0, oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null, badge: productForm.badge.trim(), condition: productForm.condition, isFeaturedOffer: Boolean(productForm.isFeaturedOffer), imageUrl: productForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85', description: productForm.description.trim(), inStock: Boolean(productForm.inStock), createdAt: editingProduct ? editingProduct.createdAt : Date.now() };

    setProducts((prev) => {
      const exists = prev.some((item) => item.id === prodId);
      return exists ? prev.map((item) => (item.id === prodId ? itemData : item)) : [itemData, ...prev];
    });
    setIsProductFormOpen(false);

    if (user && db) {
      try {
        const pDoc = doc(db, 'artifacts', appId, 'public', 'data', productsColName, prodId);
        await setDoc(pDoc, itemData);
      } catch (err) {}
    }
    showToast(editingProduct ? 'تم تحديث بيانات الجهاز' : 'تمت إضافة الجهاز إلى المتجر');
  };

  const handleDeleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (user && db) {
      try {
        const pDoc = doc(db, 'artifacts', appId, 'public', 'data', productsColName, id);
        await deleteDoc(pDoc);
      } catch (err) {}
    }
    showToast('تم حذف الجهاز');
  };

  const handleAddService = () => {
    const newService = { id: `s-${Date.now()}`, title: 'خدمة صيانة جديدة', sub: 'وصف مختصر للخدمة', price: 'حسب الموديل' };
    setServices((prev) => [...prev, newService]);
    showToast('تمت إضافة سطر خدمة جديد — عدّل البيانات ثم اضغط حفظ');
  };

  const handleDeleteService = async (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    if (user && db) {
      try {
        const servicesRef = doc(db, 'artifacts', appId, 'public', 'data', configColName, 'repair_services');
        await setDoc(servicesRef, { list: updated });
      } catch (err) {}
    }
    showToast('تم حذف خدمة الصيانة');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (user && db) {
      try {
        const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', configColName, 'store_settings');
        await setDoc(settingsRef, settings);
      } catch (err) {}
    }
    showToast('تم حفظ إعدادات المتجر');
  };

  const handleSaveServices = async () => {
    if (user && db) {
      try {
        const servicesRef = doc(db, 'artifacts', appId, 'public', 'data', configColName, 'repair_services');
        await setDoc(servicesRef, { list: services });
      } catch (err) {}
    }
    showToast('تم حفظ قائمة خدمات الصيانة');
  };

  return (
    <div dir="rtl" style={{ backgroundColor: STORE_CONFIG.colors.lightBg }} className="min-h-screen text-[#1D1D1F] antialiased selection:bg-[#0095D9] selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        
        :root {
            --brand-blue: ${STORE_CONFIG.colors.primary};
            --brand-green: ${STORE_CONFIG.colors.secondary};
            --apple-dark: ${STORE_CONFIG.colors.darkBg};
            --apple-bg: ${STORE_CONFIG.colors.lightBg};
        }

        body, button, input, select, textarea {
            font-family: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
            letter-spacing: -0.01em;
        }

        .apple-glass-dark {
            background: rgba(11, 12, 16, 0.85);
            backdrop-filter: saturate(180%) blur(22px);
            -webkit-backdrop-filter: saturate(180%) blur(22px);
        }

        .apple-card {
            background: #FFFFFF;
            border: 1px solid rgba(0, 0, 0, 0.06);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .apple-card:hover {
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.07);
        }

        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] apple-glass-dark text-white px-5 py-2.5 rounded-full shadow-2xl border border-white/15 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#6CBE45] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Utility Announcement */}
      <div className="bg-[#060709] text-neutral-400 border-b border-white/[0.08] py-2.5 px-4 text-center">
        <p className="text-[11px] sm:text-xs font-medium tracking-wide max-w-4xl mx-auto truncate">
          {settings.topAnnouncement}
        </p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 apple-glass-dark border-b border-white/[0.08] text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 py-0.5">
            <AlTalebLogo size="sm" />
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-300">
            <button
              type="button"
              onClick={() => { setSheetZoom(1); setShowPriceSheet(true); }}
              className="text-[#6CBE45] hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6CBE45] animate-ping" />
              <span>نشرة الأسعار</span>
            </button>
            <a href="#catalog" className="hover:text-white transition">كل الأجهزة</a>
            <a href="#maintenance" className="hover:text-white transition">قسم الصيانة</a>
            <a href="#why-us" className="hover:text-white transition">لماذا شركة الطالب</a>
            <a href="#location" className="hover:text-white transition">عنوان المعرض</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setSettings((prev) => ({ ...prev, showSYP: !prev.showSYP }));
                showToast(!settings.showSYP ? 'تم تفعيل عرض الليرة السورية' : 'تم الاكتفاء بعرض الدولار $');
              }}
              className="h-9 px-3.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 text-[11px] font-bold text-neutral-200 transition flex items-center justify-center"
            >
              {settings.showSYP ? 'SYP' : 'USD'}
            </button>

            <button onClick={() => setIsFavoritesOpen(true)} className="relative w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 flex items-center justify-center text-neutral-200 transition cursor-pointer">
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 flex items-center justify-center text-neutral-200 transition md:hidden">
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0B0C10] px-6 py-5 space-y-3 md:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); setSheetZoom(1); setShowPriceSheet(true); }}
                className="bg-[#0095D9]/20 hover:bg-[#0095D9]/30 border border-[#0095D9]/40 rounded-2xl p-3 text-xs font-bold text-center text-white"
              >
                📋 نشرة الأسعار اليومية
              </button>
              <a href="#catalog" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 text-xs font-semibold text-center text-white">
                📱 كل الأجهزة ({availableProductsCount})
              </a>
              <a href="#maintenance" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 text-xs font-semibold text-center text-white">
                🛠️ قسم الصيانة
              </a>
              <a href="#why-us" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 text-xs font-semibold text-center text-white">
                ⭐ لماذا شركة الطالب
              </a>
              <a href="#location" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 text-xs font-semibold text-center text-white">
                📍 العنوان والتواصل
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION (Landscape on Desktop, Compact Portrait on Mobile) */}
      <section style={{ backgroundColor: STORE_CONFIG.colors.darkBg }} className="relative text-white pt-7 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-gradient-to-tr from-[#0095D9]/10 via-[#6CBE45]/5 to-rose-500/5 blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          
          {/* الشعار والنصوص في المنتصف */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6 md:mb-8">

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span>{settings.heroSloganPrefix}</span>
              <span className="text-[#0095D9]">{settings.heroSloganHighlight}</span>
            </h1>

            <button
              type="button"
              onClick={() => { setSheetZoom(1); setShowPriceSheet(true); }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/15 text-xs sm:text-sm font-bold text-neutral-300 hover:text-white transition shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>أسعار اليوم:</span>
              <span className="text-white">نشرة الأسعار</span>
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>

          {/* بطاقة العرض: أفقية على اللابتوب، وطولية مدمجة على الجوال */}
          {currentOffer && (
            <div className="w-full max-w-[420px] md:max-w-4xl">
              <div className="rounded-[28px] md:rounded-[32px] bg-[#12141A]/95 border border-white/10 p-4 md:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.75)] overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                  
                  {/* قسم التفاصيل (يسار على اللابتوب، أسفل الصورة على الجوال) */}
                  <div className="flex-1 w-full order-2 md:order-1 flex flex-col justify-between space-y-2.5 md:space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <span dir="ltr" className="text-[11px] md:text-xs font-mono font-bold text-neutral-400">
                        № {String((currentOfferIndex % featuredOffers.length) + 1).padStart(2, '0')}/{String(featuredOffers.length).padStart(2, '0')}
                      </span>
                      <span className="px-3 py-0.5 md:px-3.5 md:py-1 rounded-full bg-white/[0.08] border border-white/15 text-neutral-200 text-[11px] md:text-xs font-bold">
                        {currentOffer.badge || 'عرض خاص'}
                      </span>
                    </div>

                    <div className="text-right space-y-1 md:space-y-1.5">
                      <h2 dir="ltr" className="text-xl md:text-3xl font-black text-white tracking-tight uppercase text-right line-clamp-1 md:line-clamp-none">
                        {currentOffer.title}
                      </h2>
                      <div className="flex items-center justify-between gap-2 text-[12px] md:text-xs text-neutral-400 pt-0.5 md:pt-1">
                        <span className="truncate">{currentOffer.specs || 'مفحوص ومكفول بالكامل'}</span>
                        {currentOffer.oldPrice && (
                          <div className="font-semibold text-neutral-400 shrink-0">
                            <span>كان </span>
                            <span className="line-through text-rose-400 font-bold">{settings.currencySymbol}{currentOffer.oldPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full">
                      <ScratchPriceCard
                        price={currentOffer.price}
                        sypPrice={formatSYP(currentOffer.price)}
                        currencySymbol={settings.currencySymbol}
                        isRevealed={Boolean(revealedOffers[currentOffer.id])}
                        onReveal={() => setRevealedOffers((prev) => ({ ...prev, [currentOffer.id]: true }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 md:gap-3 pt-0.5 md:pt-1">
                      <button
                        onClick={() => openWhatsAppProduct(currentOffer)}
                        className="bg-white/15 hover:bg-[#6CBE45] text-white font-bold text-xs md:text-sm py-2.5 md:py-3 px-3 md:px-4 rounded-full flex items-center justify-center gap-1.5 md:gap-2 transition border border-white/10"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>اسأل عن العرض</span>
                      </button>
                      <button
                        onClick={() => setActiveProduct(currentOffer)}
                        className="bg-transparent hover:bg-white/10 text-white font-semibold text-xs md:text-sm py-2.5 md:py-3 px-3 md:px-4 rounded-full border border-white/20 transition"
                      >
                        تفاصيل الجهاز
                      </button>
                    </div>

                    <div className="text-center md:text-right pt-0.5">
                      <button
                        onClick={() => setRevealedOffers((prev) => ({ ...prev, [currentOffer.id]: !prev[currentOffer.id] }))}
                        className="text-[11px] text-neutral-400 hover:text-white underline underline-offset-4 transition"
                      >
                        {revealedOffers[currentOffer.id] ? 'إخفاء السعر وإعادة المسح' : 'اكشف بدون مسح'}
                      </button>
                    </div>
                  </div>

                  {/* قسم الصورة (يمين على اللابتوب، أعلى البطاقة على الجوال) */}
                  <div className="w-full md:w-[46%] aspect-[16/10] md:aspect-[4/3.5] rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#1A1D26] relative order-1 md:order-2 shrink-0">
                    <img 
                      src={currentOffer.imageUrl} 
                      alt={currentOffer.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center text-center leading-none shadow-lg">
                      <span className="text-[10px] md:text-[11px] font-black text-white tracking-tight">{STORE_CONFIG.brandNameEn}</span>
                      <span className="text-[6px] md:text-[7px] font-bold text-[#6CBE45] tracking-widest mt-0.5">STORE</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* أزرار ونقاط التنقل */}
              <div className="flex items-center justify-center gap-5 md:gap-6 mt-5 md:mt-6">
                <button
                  onClick={() => setCurrentOfferIndex((prev) => (prev - 1 + featuredOffers.length) % featuredOffers.length)}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/15 flex items-center justify-center text-neutral-300 transition"
                  aria-label="السابق"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {featuredOffers.map((item, idx) => {
                    const isActive = idx === currentOfferIndex % featuredOffers.length;
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => setCurrentOfferIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${isActive ? 'w-6 bg-rose-500' : 'w-2 bg-white/25 hover:bg-white/40'}`}
                        aria-label={`شريحة ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentOfferIndex((prev) => (prev + 1) % featuredOffers.length)}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/15 flex items-center justify-center text-neutral-300 transition"
                  aria-label="التالي"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* قسم الإحصائيات الأربعة */}
          <div className="w-full pt-8 md:pt-10 mt-10 md:mt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-8 gap-x-6 text-center max-w-4xl mx-auto">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{settings.stat1Val}</div>
              <div className="text-xs text-neutral-400 font-medium">{settings.stat1Label}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#6CBE45] tracking-tight flex items-center justify-center gap-1.5">
                <span>{availableProductsCount}</span>
                <span className="w-2 h-2 rounded-full bg-[#6CBE45] animate-ping" />
              </div>
              <div className="text-xs text-neutral-400 font-medium">جهاز متوفر الآن</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{settings.stat3Val}</div>
              <div className="text-xs text-neutral-400 font-medium">{settings.stat3Label}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0095D9] tracking-tight">{settings.stat4Val}</div>
              <div className="text-xs text-neutral-400 font-medium">{settings.stat4Label}</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ALL DEVICES SECTION */}
      <section id="catalog" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0095D9]/10 text-[#0095D9] text-[12px] font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>كتالوج المتجر المحدث ({availableProductsCount} جهاز متوفر)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">كل الأجهزة</h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto font-normal">
            اختر جهازك المفضل واطلبه مباشرة عبر واتساب مع كفالة حقيقية وفحص شامل
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3.5 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن جهاز (مثال: iPhone 15، S24، شاحن)..." className="w-full bg-white border border-black/[0.08] rounded-full pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] placeholder:text-neutral-400 outline-none focus:border-[#0095D9] transition shadow-2xs" />
              {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"><X className="w-3.5 h-3.5" /></button>)}
            </div>
            <div className="bg-neutral-200/75 p-1 rounded-full flex items-center self-center sm:self-auto shrink-0">
              {['all', 'جديد', 'مستعمل'].map((cond) => (
                <button key={cond} onClick={() => setConditionFilter(cond)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${conditionFilter === cond ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-neutral-600 hover:text-[#1D1D1F]'}`}>
                  {cond === 'all' ? 'الكل' : cond}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${active ? 'bg-[#1D1D1F] text-white shadow-xs' : 'bg-white text-neutral-600 border border-black/[0.06] hover:border-black/20'}`}>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/[0.06] py-14 px-4 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-neutral-500 mb-3">لا توجد نتائج مطابقة للبحث الحالي</p>
            <button onClick={() => { setSelectedCategory('all'); setConditionFilter('all'); setSearchQuery(''); }} className="bg-[#1D1D1F] text-white text-xs font-semibold px-5 py-2.5 rounded-full">عرض جميع الأجهزة</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const sypFormatted = formatSYP(product.price);
              const isFav = favorites.includes(product.id);
              return (
                <div key={product.id} onClick={() => setActiveProduct(product)} className="apple-card rounded-[20px] sm:rounded-[22px] overflow-hidden flex flex-col cursor-pointer group">
                  <div className="relative aspect-[4/3] bg-[#F5F5F7] overflow-hidden">
                    <img src={product.imageUrl} alt={product.title} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    {product.badge && (<span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${product.condition === 'جديد' ? 'bg-[#1D1D1F]/85 text-white' : 'bg-[#0095D9]/90 text-white'}`}>{product.badge}</span>)}
                    <button onClick={(e) => toggleFavorite(product.id, e)} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-700 hover:scale-110 transition"><Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} /></button>
                    {!product.inStock && (<span className="absolute bottom-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">نفذت الكمية</span>)}
                  </div>
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div className="text-right mb-2.5">
                      <h3 className="text-xs sm:text-[15px] font-bold text-[#1D1D1F] line-clamp-1 tracking-tight">{product.title}</h3>
                      <p className="text-[10px] sm:text-xs text-neutral-500 line-clamp-1 mt-0.5 font-normal">{product.specs || 'مفحوص ومكفول بالكامل'}</p>
                    </div>
                    <div className="pt-2.5 border-t border-black/[0.05] flex items-end justify-between gap-1.5">
                      <div className="text-right">
                        {product.oldPrice && (<div className="text-[10px] text-neutral-400 line-through leading-none mb-0.5">{product.oldPrice}{settings.currencySymbol}</div>)}
                        <div className="text-sm sm:text-base font-bold text-[#1D1D1F] leading-tight">{product.price}{settings.currencySymbol}</div>
                        {sypFormatted && (<div className="text-[9px] sm:text-[10px] text-neutral-500 font-medium mt-0.5">{sypFormatted}</div>)}
                      </div>
                      <button onClick={(e) => openWhatsAppProduct(product, e)} className="bg-[#1D1D1F] hover:bg-[#0095D9] text-white text-[10px] sm:text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full transition shrink-0">طلب</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. MID-PAGE DARK BANNER CTA */}
      <section className="bg-[#090A0F] text-white py-14 px-5 border-y border-white/10">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto">
            <Smartphone className="w-6 h-6 text-[#0095D9]" />
          </div>
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight">{settings.midBannerTitle}</h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">{settings.midBannerSub}</p>
          <div className="pt-2">
            <button onClick={() => openWhatsAppGeneral('مرحباً شركة الطالب، أرغب بتقييم / استبدال جهازي الحالي بجهاز أحدث.')} className="bg-white hover:bg-neutral-200 text-[#1D1D1F] text-xs sm:text-sm font-semibold px-7 py-3 rounded-full transition shadow-sm">
              تواصل معنا لتقييم جهازك
            </button>
          </div>
        </div>
      </section>

      {/* 4. MAINTENANCE SECTION */}
      <section id="maintenance" className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5 mb-8">
          <span className="text-[11px] font-semibold text-[#0095D9] uppercase tracking-wider">مركز الصيانة المعتمد</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">موقع صيانة عطل موبايلك</h2>
          <p className="text-xs sm:text-sm text-neutral-500">صيانة فورية واحترافية لجميع أعطال الهواتف الذكية بقطع تبديل وكالة مكفولة</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {services.map((srv) => (
            <div key={srv.id} onClick={() => openWhatsAppGeneral(`مرحباً شركة الطالب، أود الاستفسار عن خدمة صيانة: ${srv.title}`)} className="apple-card rounded-2xl p-4 text-center cursor-pointer flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto mb-2.5 text-[#0095D9]"><Wrench className="w-4 h-4" /></div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#1D1D1F] mb-0.5">{srv.title}</div>
                <div className="text-[10px] sm:text-xs text-neutral-500 line-clamp-1 mb-2.5">{srv.sub}</div>
              </div>
              <div className="text-[11px] font-semibold text-[#6CBE45] bg-[#6CBE45]/10 rounded-full py-1 px-2">{srv.price}</div>
            </div>
          ))}
        </div>

        <div className="apple-card rounded-3xl p-5 sm:p-7 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#1D1D1F]">ضمانات قسم الصيانة في شركة الطالب:</span>
            <span className="text-[11px] font-semibold text-[#0095D9] bg-[#0095D9]/10 px-3 py-0.5 rounded-full">فحص مجاني</span>
          </div>
          <ul className="text-xs text-neutral-600 space-y-2.5 pr-1">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#6CBE45] shrink-0" /><span>تشخيص العطل مجاناً وبشكل فوري أمام الزبون بأحدث أجهزة الفحص.</span></li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0095D9] shrink-0" /><span>تركيب شاشات وبطاريات وكالة أصلية مع نقل التروتون والحفاظ على البيانات.</span></li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F] shrink-0" /><span>كفالة حقيقية على كافة أعمال الصيانة الهاردوير والسوفتوير.</span></li>
          </ul>
          <button onClick={() => openWhatsAppGeneral('مرحباً شركة الطالب، أرغب بحجز موعد صيانة / استشارة فنية لجهازي.')} className="w-full bg-[#1D1D1F] hover:bg-[#0095D9] text-white text-xs sm:text-sm font-semibold py-3.5 rounded-full transition">احجز موعد صيانة فورية عبر واتساب</button>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section id="why-us" className="bg-[#090A0F] text-white py-14 sm:py-16 px-5 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-9">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5 text-[#6CBE45]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">لماذا يختارنا العملاء؟</h2>
            <p className="text-xs sm:text-sm text-neutral-400">معايير جودة صارمة تجعل شركة الطالب للإتصالات خيارك الأول</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 text-right space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#6CBE45] mb-1" />
              <h3 className="text-xs sm:text-base font-bold text-white">كفالة حقيقية وفحص دقيق</h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">جميع الأجهزة المستعملة تخضع لفحص شامل من 25 نقطة لضمان خلوها من أي عيب مخفي.</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 text-right space-y-2">
              <Zap className="w-5 h-5 text-[#0095D9] mb-1" />
              <h3 className="text-xs sm:text-base font-bold text-white">أقوى العروض والهدايا</h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">عروض يومية ومسابقات مستمرة لمتابعينا على قناة الواتساب مع هدايا قيمة.</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 text-right space-y-2">
              <Cpu className="w-5 h-5 text-[#0095D9] mb-1" />
              <h3 className="text-xs sm:text-base font-bold text-white">صيانة احترافية متكاملة</h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">كادر فني مختص بصيانة أجهزة أبل والأندرويد بأحدث المعدات وقطع التبديل الأصلية.</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 text-right space-y-2">
              <MessageCircle className="w-5 h-5 text-[#6CBE45] mb-1" />
              <h3 className="text-xs sm:text-base font-bold text-white">خدمة ما بعد البيع</h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">نقل البيانات مجاناً وإنشاء الحسابات مع متابعة ودعم فني متواصل عبر واتساب.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STORE LOCATION */}
      <section id="location" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center space-y-1.5 mb-7">
          <span className="text-[11px] text-[#0095D9] font-semibold">العنوان وأوقات الدوام</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">{settings.locationTitle}</h2>
        </div>

        <div className="apple-card rounded-[28px] overflow-hidden">
          <div className="p-6 sm:p-8 space-y-5 text-right">
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{settings.locationDesc}</p>
            <div className="space-y-2.5 text-xs text-[#1D1D1F] bg-[#F5F5F7] p-4 sm:p-5 rounded-2xl">
              <div className="flex items-center gap-2.5 font-semibold">
                <MapPin className="w-4 h-4 text-[#0095D9] shrink-0" />
                <span>{settings.addressLine1}</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-600">
                <Clock className="w-4 h-4 text-[#6CBE45] shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button onClick={() => openWhatsAppGeneral('مرحباً شركة الطالب، أود الاستفسار عن عنوان المعرض وأوقات الدوام.')} className="w-full sm:flex-1 bg-[#6CBE45] hover:bg-[#5da83a] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-1.5 transition shadow-xs">
                <MessageCircle className="w-4 h-4" />
                <span>تواصل عبر واتساب</span>
              </button>
              <a href={settings.whatsappChannel} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 bg-[#1D1D1F] hover:bg-[#0095D9] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-1.5 transition text-center">
                <span>متابعة قناة الواتساب</span>
              </a>
            </div>
          </div>
          <div className="aspect-[16/9] bg-neutral-100">
            <img src={settings.showroomImage} alt="معرض شركة الطالب للإتصالات" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#07080C] text-white pt-16 pb-24 px-6 sm:px-10 lg:px-14 mt-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-right">
            <div className="space-y-4">
              <AlTalebLogo size="md" />
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
                {settings.storeName} — وجهتك الموثوقة لبيع وشراء وتبديل كافة أجهزة الموبايل الجديدة والمستعملة المكفولة مع خدمة صيانة احترافية.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">روابط سريعة</h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li><a href="#catalog" className="hover:text-white transition">كل الأجهزة ({availableProductsCount} جهاز متوفر)</a></li>
                <li><a href="#maintenance" className="hover:text-white transition">مركز صيانة الموبايل</a></li>
                <li><a href="#why-us" className="hover:text-white transition">لماذا شركة الطالب للإتصالات</a></li>
                <li><a href="#location" className="hover:text-white transition">عنوان المعرض وأوقات الدوام</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">تواصل مباشر</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">{settings.addressLine1}</p>
              <p className="text-xs text-neutral-500">{settings.workingHours}</p>
              <div className="pt-2 flex items-center gap-2.5">
                <button onClick={() => openWhatsAppGeneral()} className="bg-white/10 hover:bg-[#6CBE45] text-white text-xs font-semibold px-4 py-2 rounded-full transition">مراسلة واتساب</button>
                <a href={settings.whatsappChannel} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 text-xs font-semibold px-4 py-2 rounded-full transition">قناة العروض</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} {settings.storeName}</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span className="text-neutral-400 font-mono text-[11px]" dir="ltr">
              Designed by <span className="text-neutral-200 font-semibold">Abdualrhman Taffour</span>
            </span>
            <div className="flex items-center gap-3">
              <span>دائماً وأبداً شعارنا: ثقتكم تهمنا</span>
            </div>
          </div>
        </div>
      </footer>

      <button onClick={() => openWhatsAppGeneral()} className="fixed bottom-6 left-6 z-40 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition active:scale-90" aria-label="تواصل واتساب">
        <MessageCircle className="w-6 h-6 fill-white" />
      </button>

      {/* PRODUCT DETAILS MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setActiveProduct(null)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] bg-[#F5F5F7]">
              <img src={activeProduct.imageUrl} alt={activeProduct.title} className="w-full h-full object-cover" />
              <button onClick={() => setActiveProduct(null)} className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full apple-glass-dark text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
              {activeProduct.badge && (<span className="absolute top-3.5 right-3.5 bg-[#1D1D1F]/90 text-white text-xs font-semibold px-3 py-1 rounded-full">{activeProduct.badge}</span>)}
            </div>
            <div className="p-5 sm:p-6 space-y-4 text-right">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F]">{activeProduct.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">{activeProduct.specs}</p>
                </div>
                <div className="text-left shrink-0">
                  {activeProduct.oldPrice && (<div className="text-xs text-neutral-400 line-through">{activeProduct.oldPrice}{settings.currencySymbol}</div>)}
                  <div className="text-xl font-bold text-[#0095D9]">{activeProduct.price}{settings.currencySymbol}</div>
                  {formatSYP(activeProduct.price) && (<div className="text-[11px] text-neutral-500 font-medium">{formatSYP(activeProduct.price)}</div>)}
                </div>
              </div>
              {activeProduct.description && (<p className="text-xs sm:text-sm text-neutral-600 bg-[#F5F5F7] p-4 rounded-2xl leading-relaxed">{activeProduct.description}</p>)}
              <button onClick={() => openWhatsAppProduct(activeProduct)} className="w-full bg-[#1D1D1F] hover:bg-[#0095D9] text-white font-semibold text-xs sm:text-sm py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition">
                <MessageCircle className="w-4 h-4 text-[#6CBE45]" />
                <span>اطلب الجهاز الآن عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAVORITES MODAL */}
      {isFavoritesOpen && (
        <div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setIsFavoritesOpen(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-[28px] sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-black/[0.05] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F]">قائمة المفضلة</h3>
              </div>
              <button onClick={() => setIsFavoritesOpen(false)} className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {favorites.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center">
                <Heart className="w-10 h-10 text-neutral-200 mb-3" />
                <p className="text-sm font-semibold text-neutral-500">قائمة المفضلة فارغة</p>
                <p className="text-xs text-neutral-400 mt-1">قم بإضافة الأجهزة التي تعجبك هنا للرجوع إليها لاحقاً</p>
                <button onClick={() => setIsFavoritesOpen(false)} className="mt-5 bg-[#1D1D1F] text-white px-5 py-2.5 rounded-full text-xs font-bold transition hover:bg-[#0095D9]">تصفح الأجهزة</button>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favId) => {
                  const prod = products.find(p => p.id === favId);
                  if (!prod) return null;
                  return (
                    <div key={prod.id} className="flex items-center gap-3 bg-[#F5F5F7] p-2.5 rounded-2xl border border-black/[0.04]">
                      <img src={prod.imageUrl} alt={prod.title} className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 cursor-pointer" onClick={() => { setIsFavoritesOpen(false); setActiveProduct(prod); }} />
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setIsFavoritesOpen(false); setActiveProduct(prod); }}>
                        <h4 className="text-xs font-bold text-[#1D1D1F] truncate">{prod.title}</h4>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">{prod.specs}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs font-bold text-[#0095D9]">{prod.price}{settings.currencySymbol}</span>
                          {formatSYP(prod.price) && <span className="text-[9px] text-neutral-400 font-medium">({formatSYP(prod.price)})</span>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button onClick={(e) => openWhatsAppProduct(prod, e)} className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition shadow-sm" title="طلب عبر واتساب">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => toggleFavorite(prod.id, e)} className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition" title="إزالة من المفضلة">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN LOGIN MODAL */}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsAdminLoginOpen(false)}>
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-black/5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1D1D1F]">دخول لوحة التحكم</h3>
              <button onClick={() => setIsAdminLoginOpen(false)} className="p-1 rounded-full bg-neutral-100 text-neutral-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder=" " autoFocus className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs outline-none focus:border-[#0095D9]" />
              {loginError && (<p className="text-[11px] text-rose-600 font-semibold">{loginError}</p>)}
              <button type="submit" className="w-full bg-[#1D1D1F] hover:bg-[#0095D9] text-white font-semibold text-xs py-2.5 rounded-xl transition">دخول</button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {isAdminDashboardOpen && isAdminAuthenticated && (
        <div className="fixed inset-0 z-50 bg-[#F5F5F7] overflow-y-auto">
          <div className="sticky top-0 z-20 apple-glass-dark text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#6CBE45]" />
              <span className="text-xs sm:text-sm font-bold">لوحة تحكم {settings.storeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyAdminUrl} className="bg-white/10 hover:bg-white/20 text-[#6CBE45] text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"><Copy className="w-3 h-3" /><span>نسخ رابط الإدارة</span></button>
              <button onClick={() => { setIsAdminDashboardOpen(false); setIsAdminAuthenticated(false); setPasswordInput(''); setLoginError(''); if (window.location.hash === '#admin-12345-dashboard-67890') { window.history.pushState('', document.title, window.location.pathname); } }} className="bg-white text-[#1D1D1F] text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /><span>معاينة الموقع</span></button>
            </div>
          </div>
          <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-2xl border border-black/[0.06]">
              <button onClick={() => setAdminTab('products')} className={`py-2 rounded-xl text-xs font-bold transition ${adminTab === 'products' ? 'bg-[#1D1D1F] text-white' : 'text-neutral-600'}`}>الأجهزة ({products.length})</button>
              <button onClick={() => setAdminTab('services')} className={`py-2 rounded-xl text-xs font-bold transition ${adminTab === 'services' ? 'bg-[#1D1D1F] text-white' : 'text-neutral-600'}`}>خدمات الصيانة ({services.length})</button>
              <button onClick={() => setAdminTab('settings')} className={`py-2 rounded-xl text-xs font-bold transition ${adminTab === 'settings' ? 'bg-[#1D1D1F] text-white' : 'text-neutral-600'}`}>الإعدادات والصرف</button>
            </div>

            {adminTab === 'products' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button onClick={openAddProduct} className="w-full bg-[#0095D9] hover:bg-[#007bb5] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition"><Plus className="w-4 h-4" /><span>إضافة جهاز أو عرض خاص جديد</span></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {products.map((prod) => (
                    <div key={prod.id} className="bg-white p-3 rounded-2xl border border-black/[0.06] flex items-center gap-3">
                      <img src={prod.imageUrl} alt={prod.title} className="w-16 h-16 rounded-xl object-cover bg-[#F5F5F7] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#1D1D1F] truncate">{prod.title}</span>
                          {prod.isFeaturedOffer && (<span className="text-[9px] font-bold bg-[#0095D9]/15 text-[#0095D9] px-2 py-0.5 rounded-full shrink-0">سلايدر البداية</span>)}
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate">{prod.specs}</div>
                        <div className="text-xs font-bold text-[#0095D9] mt-0.5">{prod.price}{settings.currencySymbol}</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button onClick={() => openEditProduct(prod)} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F]"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'services' && (
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-black/[0.06] space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-[#1D1D1F]">تعديل أو إضافة خدمات الصيانة ({services.length}):</h3>
                  <button type="button" onClick={handleAddService} className="bg-[#0095D9] hover:bg-[#007bb5] text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0"><Plus className="w-3.5 h-3.5" /><span>إضافة خدمة صيانة جديدة</span></button>
                </div>
                {services.length === 0 ? (
                  <div className="text-center py-8 bg-[#F5F5F7] rounded-2xl text-xs text-neutral-500">لا توجد خدمات صيانة حالياً. اضغط على "إضافة خدمة صيانة جديدة" للبدء.</div>
                ) : (
                  <div className="space-y-2.5">
                    {services.map((srv, idx) => (
                      <div key={srv.id} className="flex items-center gap-2 bg-[#F5F5F7] p-2.5 rounded-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                          <input type="text" value={srv.title} onChange={(e) => { const updated = [...services]; updated[idx] = { ...updated[idx], title: e.target.value }; setServices(updated); }} placeholder="اسم الخدمة" className="bg-white rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold outline-none focus:border-[#0095D9]" />
                          <input type="text" value={srv.sub} onChange={(e) => { const updated = [...services]; updated[idx] = { ...updated[idx], sub: e.target.value }; setServices(updated); }} placeholder="الوصف المختصر" className="bg-white rounded-xl border border-black/10 px-3 py-2 text-xs outline-none focus:border-[#0095D9]" />
                          <input type="text" value={srv.price} onChange={(e) => { const updated = [...services]; updated[idx] = { ...updated[idx], price: e.target.value }; setServices(updated); }} placeholder="السعر / التكلفة" className="bg-white rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-[#6CBE45] outline-none focus:border-[#0095D9]" />
                        </div>
                        <button type="button" onClick={() => handleDeleteService(srv.id)} className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition shrink-0" title="حذف الخدمة"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={handleSaveServices} className="w-full bg-[#1D1D1F] hover:bg-[#0095D9] text-white font-bold text-xs py-3 rounded-xl transition">حفظ تعديلات قسم الصيانة</button>
              </div>
            )}

            {adminTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="bg-white p-5 rounded-3xl border border-black/[0.06] space-y-4">
                <div className="bg-[#F5F5F7] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D1D1F]">حاسبة الليرة السورية التلقائية</span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                      <input type="checkbox" checked={settings.showSYP} onChange={(e) => setSettings({ ...settings, showSYP: e.target.checked })} className="rounded accent-[#0095D9]" />
                      <span>إظهار السعر بالليرة تحت الدولار</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-600 mb-1">سعر صرف الدولار مقابل الليرة:</label>
                      <input type="number" value={settings.exchangeRateSYP} onChange={(e) => setSettings({ ...settings, exchangeRateSYP: Number(e.target.value) })} className="w-full bg-white rounded-xl border border-neutral-300 px-3 py-2 text-xs font-bold outline-none focus:border-[#0095D9]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-600 mb-1">رمز العملة الأساسية:</label>
                      <input type="text" value={settings.currencySymbol} onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })} className="w-full bg-white rounded-xl border border-neutral-300 px-3 py-2 text-xs font-bold outline-none focus:border-[#0095D9]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">رقم الواتساب لاستقبال الطلبات (مع الرمز الدولي بدون +):</label>
                    <input type="text" dir="ltr" placeholder="963942011130" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-mono text-left outline-none focus:border-[#0095D9]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">رابط قناة الواتساب:</label>
                    <input type="url" dir="ltr" value={settings.whatsappChannel} onChange={(e) => setSettings({ ...settings, whatsappChannel: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-mono text-left outline-none focus:border-[#0095D9]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">رقم قسم المبيعات (يظهر في نشرة الأسعار):</label>
                    <input type="text" dir="ltr" placeholder="0935 240 669" value={settings.salesPhone || ''} onChange={(e) => setSettings({ ...settings, salesPhone: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-mono text-left outline-none focus:border-[#0095D9]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">رقم قسم الصيانة (يظهر في نشرة الأسعار):</label>
                    <input type="text" dir="ltr" placeholder="0986 895 611" value={settings.repairPhone || ''} onChange={(e) => setSettings({ ...settings, repairPhone: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-mono text-left outline-none focus:border-[#0095D9]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">كلمة مرور الإدارة:</label>
                  <input type="text" dir="ltr" value={settings.adminPassword} onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-xs font-mono text-left outline-none focus:border-[#0095D9]" />
                </div>
                <button type="submit" className="w-full bg-[#1D1D1F] hover:bg-[#0095D9] text-white font-bold text-xs py-3 rounded-xl transition">حفظ جميع الإعدادات</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductFormOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setIsProductFormOpen(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-2.5">
              <h3 className="text-sm font-bold text-[#1D1D1F]">{editingProduct ? 'تعديل بيانات الجهاز' : 'إضافة جهاز جديد'}</h3>
              <button onClick={() => setIsProductFormOpen(false)} className="p-1 rounded-full bg-neutral-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">اسم الجهاز *</label>
                <input type="text" required value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} placeholder="مثال: IPHONE 16 PRO MAX 256GB" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">القسم</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs bg-white">
                    {categories.filter((c) => c.id !== 'all').map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">الحالة</label>
                  <select value={productForm.condition} onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })} className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs bg-white">
                    <option value="جديد">جديد</option>
                    <option value="مستعمل">مستعمل</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">السعر بالدولار *</label>
                  <input type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="965" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">السعر السابق (كان $)</label>
                  <input type="number" value={productForm.oldPrice} onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })} placeholder="1030" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className={productForm.category === 'iphone' && productForm.condition === 'مستعمل' ? 'col-span-1' : 'col-span-2'}>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">المواصفات (اللون، الذاكرة، الكفالة)</label>
                  <input type="text" value={productForm.specs} onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })} placeholder="مثال: تيتانيوم طبيعي • مع كفالة" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs" />
                </div>
                {productForm.category === 'iphone' && productForm.condition === 'مستعمل' && (
                  <div>
                    <label className="block text-[11px] font-bold text-rose-600 mb-1">نسبة البطارية %</label>
                    <input type="number" max="100" min="50" value={productForm.battery} onChange={(e) => setProductForm({ ...productForm, battery: e.target.value })} placeholder="مثال: 95" className="w-full rounded-xl border border-rose-300 px-3 py-2 text-xs focus:border-rose-500 outline-none" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">شارة البطاقة (الزاوية العلوية للصورة)</label>
                <input type="text" value={productForm.badge} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} placeholder="عرض خاص / مستعمل نظيف" className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs" />
              </div>
              <div className="bg-[#F5F5F7] p-3 rounded-2xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1D1D1F]">
                  <input type="checkbox" checked={productForm.isFeaturedOffer} onChange={(e) => setProductForm({ ...productForm, isFeaturedOffer: e.target.checked })} className="rounded accent-[#0095D9]" />
                  <span>إظهار في سلايدر "امسح واكشف السعر" بأعلى الموقع</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                  <input type="checkbox" checked={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })} className="rounded accent-[#6CBE45]" />
                  <span>الجهاز متوفر حالياً (يدخل في عداد الأجهزة المتوفرة)</span>
                </label>
              </div>
              <div className="bg-[#F5F5F7] p-3 rounded-2xl space-y-2">
                <label className="block text-[11px] font-bold text-neutral-700">صورة الجهاز:</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#0095D9]" /><span>رفع صورة من الجوال</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {productForm.imageUrl && (<img src={productForm.imageUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover border" />)}
                </div>
                <input type="text" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} placeholder="أو ألصق رابط صورة مباشر..." className="w-full bg-white rounded-xl border border-neutral-200 px-2.5 py-1.5 text-[11px]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">وصف إضافي</label>
                <textarea rows={2} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs" />
              </div>
              <button type="submit" className="w-full bg-[#1D1D1F] hover:bg-[#0095D9] text-white font-bold text-xs py-3 rounded-xl transition">
                {editingProduct ? 'حفظ التعديلات' : 'إضافة الجهاز'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DAILY PRICE BULLETIN MODAL */}
      {showPriceSheet && (
        <div
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowPriceSheet(false)}
          style={{ touchAction: 'none' }}
        >
          <div
            className="bg-[#16171B] border border-white/15 rounded-[28px] w-full max-w-[680px] overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.85)] flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#18191E]">
              <div className="text-right">
                <p className="text-[11px] text-neutral-400 font-medium">أسعار اليوم:</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">نشرة الأسعار</h3>
              </div>
              <button type="button" onClick={() => setShowPriceSheet(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 flex items-center justify-center transition" aria-label="إغلاق"><X className="w-4 h-4" /></button>
            </div>
            
            <div 
              className="relative flex-1 overflow-auto bg-[#0B0C0E] p-3 sm:p-5 select-none"
              style={{ touchAction: 'pan-x pan-y' }}
              onTouchStart={(e) => {
                if (e.touches.length === 2) {
                  const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                  pinchStartDistRef.current = dist;
                  pinchInitialZoomRef.current = sheetZoom;
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 2 && pinchStartDistRef.current) {
                  const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                  const scale = dist / pinchStartDistRef.current;
                  const newZoom = Math.min(Math.max(pinchInitialZoomRef.current * scale, 0.5), 2.5);
                  
                  if (posterRef.current) {
                    posterRef.current.style.transform = `scale(${newZoom})`;
                  }
                }
              }}
              onTouchEnd={(e) => {
                if (e.touches.length < 2 && pinchStartDistRef.current) {
                  pinchStartDistRef.current = null;
                  if (posterRef.current) {
                    const finalZoom = parseFloat(posterRef.current.style.transform.replace(/[^\d.-]/g, ''));
                    if (!isNaN(finalZoom)) setSheetZoom(finalZoom);
                  }
                }
              }}
            >
              <div 
                ref={posterRef}
                style={{ transform: `scale(${sheetZoom})`, transformOrigin: 'top center' }} 
                className="bg-gradient-to-b from-[#111318] via-[#0B0C10] to-[#08090C] border border-white/10 rounded-2xl p-4 sm:p-6 text-white shadow-2xl min-w-[540px] sm:min-w-0"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="text-right">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">نشرة الأسعار</h2>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">{todayArabicDate}</p>
                  </div>
                  <div dir="ltr" className="flex flex-col items-center"><AlTalebLogo size="sm" /></div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-[10px] sm:text-[11px]" dir="ltr">
                  {[priceSheetData.col3, priceSheetData.col2, priceSheetData.col1].map((colRows, colIndex) => (
                    <div key={colIndex} className={`space-y-1.5 ${colIndex < 2 ? 'border-r border-white/10 pr-2.5' : ''}`}>
                      {colRows.map((row) => {
                        if (row.type === 'header') {
                          return (
                            <div key={row.id} className="pt-1.5 first:pt-0">
                              <div className="inline-block px-3 py-0.5 rounded-full border border-white/30 bg-white/[0.07] text-[9px] font-extrabold text-white tracking-wider uppercase">{row.label}</div>
                            </div>
                          );
                        }
                        const item = row.product;
                        const meta = parseDeviceMeta(item);
                        return (
                          <div key={row.id} onClick={() => { setShowPriceSheet(false); setActiveProduct(item); }} className="flex items-center justify-between gap-1 py-1 border-b border-white/[0.06] hover:bg-white/[0.04] px-1 rounded cursor-pointer transition">
                            <span className="font-bold text-white truncate max-w-[72px] sm:max-w-[85px]">{meta.shortName}</span>
                            <span className="flex items-center gap-1 text-[9px] text-neutral-400 shrink-0">
                              <span>{meta.storage}</span>
                              {meta.battery && (
                                <span className="px-1 py-0.2 rounded bg-[#6CBE45]/20 text-[#6CBE45] font-bold text-[8px]">{meta.battery}</span>
                              )}
                            </span>
                            <span className="font-extrabold text-white shrink-0">{settings.currencySymbol}{item.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-3">
                  <div><span className="inline-block px-5 py-1 rounded-full border border-white/25 bg-white/[0.04] text-xs font-bold text-white shadow-sm">واتس حصراً</span></div>
                  <div className="grid grid-cols-2 max-w-md mx-auto pt-1 divide-x divide-x-reverse divide-white/15">
                    <div className="px-3"><p className="text-[11px] text-neutral-400 mb-0.5">قسم المبيعات</p><p dir="ltr" className="text-sm sm:text-lg font-black text-white font-mono tracking-wider">{settings.salesPhone || '0935 240 669'}</p></div>
                    <div className="px-3"><p className="text-[11px] text-neutral-400 mb-0.5">قسم الصيانة</p><p dir="ltr" className="text-sm sm:text-lg font-black text-white font-mono tracking-wider">{settings.repairPhone || '0986 895 611'}</p></div>
                  </div>
                  <div className="space-y-1 pt-1 text-[11px] text-neutral-300">
                    <p className="font-semibold">{STORE_CONFIG.brandNameAr} • {STORE_CONFIG.slogan}</p>
                    <p className="text-neutral-400 text-[10px]"><strong className="text-white">العنوان:</strong> {settings.addressLine1}</p>
                    <p className="text-neutral-500 text-[10px] pt-0.5">الأسعار قابلة للتغيير • ما في حجز، يلي بيسبق بياكل فستق</p>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-2 left-2 flex items-center gap-2 mt-3 w-fit bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/15">
                <button type="button" onClick={() => setSheetZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition" title="تكبير"><Plus className="w-4 h-4" /></button>
                <button type="button" onClick={() => setSheetZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition" title="تصغير"><span className="text-base leading-none font-bold">−</span></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#18191E] border-t border-white/10">
              <button type="button" disabled={isGeneratingImage} onClick={handleDownloadPriceSheetImage} className="py-3 px-3 rounded-full bg-white hover:bg-neutral-200 text-[#1D1D1F] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer disabled:opacity-60">
                <Download className="w-4 h-4 shrink-0" />
                <span>{isGeneratingImage ? 'جارٍ الحفظ...' : 'حفظ الصورة'}</span>
              </button>
              <button type="button" onClick={async () => { const shareData = { title: `نشرة أسعار ${settings.storeName}`, text: `نشرة أسعار الأجهزة المحدثة من ${settings.storeName} (${todayArabicDate})`, url: window.location.href, }; if (navigator.share) { try { await navigator.share(shareData); } catch (e) {} } else if (navigator.clipboard) { navigator.clipboard.writeText(window.location.href); showToast('تم نسخ رابط نشرة الأسعار للمشاركة'); } }} className="py-3 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer">
                <Share2 className="w-4 h-4 shrink-0" />
                <span>مشاركة</span>
              </button>
              <button type="button" onClick={() => openWhatsAppGeneral(`السلام عليكم ${settings.storeName} 👋، أود الاستفسار عن نشرة أسعار اليوم (${todayArabicDate}).`)} className="py-3 px-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>اسأل على واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}