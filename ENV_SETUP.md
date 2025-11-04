# دليل إعداد متغيرات البيئة - Environment Variables Setup

## ⚠️ مهم جداً: قبل النشر للإنتاج

يجب إعداد جميع متغيرات البيئة التالية قبل نشر الموقع للإنتاج. بدون هذه المتغيرات، لن يعمل الموقع بشكل صحيح.

---

## 📋 المتغيرات المطلوبة (Required)

### 1. Supabase Configuration

```env
# رابط مشروع Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# المفتاح العام (Anon Key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# مفتاح الخدمة (Service Role Key) - سري للغاية، لا تشاركه أبداً!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**كيفية الحصول عليها:**
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. اذهب إلى Settings > API
4. انسخ Project URL و Anon key و Service Role key

---

### 2. JWT Secret (مهم جداً للأمان)

```env
# يجب أن يكون على الأقل 32 حرفاً
JWT_SECRET=your-random-secret-key-min-32-characters-long
```

**كيفية توليد JWT_SECRET:**

```bash
# الطريقة الأولى (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# الطريقة الثانية (OpenSSL)
openssl rand -hex 32

# الطريقة الثالثة (Python)
python3 -c "import secrets; print(secrets.token_hex(32))"
```

⚠️ **تحذير:** في الإنتاج، سيتم رفض الموقع إذا كان `JWT_SECRET` أقل من 32 حرفاً أو غير موجود!

---

### 3. Groq AI API Key

```env
# مطلوب لميزة AI Battle
GROQ_API_KEY=your-groq-api-key-here
```

**كيفية الحصول عليها:**
1. اذهب إلى [console.groq.com](https://console.groq.com)
2. سجل حساب جديد أو سجل دخول
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد
5. انسخ المفتاح واحفظه بأمان

---

### 4. Site URL (مطلوب للإنتاج)

```env
# رابط الموقع في الإنتاج
NEXT_PUBLIC_SITE_URL=https://www.productsvs.com
```

⚠️ **مهم:** استبدل `https://www.productsvs.com` برابط الموقع الفعلي في الإنتاج!

---

### 5. Node Environment

```env
# يجب أن يكون "production" في الإنتاج
NODE_ENV=production
```

---

## 📋 المتغيرات الاختيارية (Optional)

### Google Analytics

```env
# معرف Google Analytics (اختياري)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**كيفية الحصول عليها:**
1. اذهب إلى [analytics.google.com](https://analytics.google.com)
2. أنشئ خاصية (Property) جديدة
3. انسخ Measurement ID

---

### Google AdSense

```env
# معرف الناشر (اختياري)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX

# معرفات الإعلانات (اختياري)
NEXT_PUBLIC_ADSENSE_COMPARISON_HEADER=1234567890
NEXT_PUBLIC_ADSENSE_COMPARISON_SIDEBAR=2345678901
NEXT_PUBLIC_ADSENSE_COMPARISON_INFEED=3456789012
NEXT_PUBLIC_ADSENSE_COMPARISON_FOOTER=4567890123
NEXT_PUBLIC_ADSENSE_MOBILE_STICKY=5678901234
NEXT_PUBLIC_ADSENSE_HOMEPAGE_BANNER=6789012345
```

---

## 🚀 خطوات الإعداد

### للمطورين المحليين (Development)

1. أنشئ ملف `.env.local` في المجلد الرئيسي للمشروع:

```bash
cp .env.example .env.local
```

2. املأ جميع المتغيرات المطلوبة في `.env.local`
3. أعد تشغيل خادم التطوير

### للإنتاج (Production)

#### على Vercel:

1. اذهب إلى [vercel.com](https://vercel.com)
2. اختر مشروعك
3. اذهب إلى Settings > Environment Variables
4. أضف جميع المتغيرات المطلوبة:
   - لكل متغير: اختر الاسم والقيمة
   - اضغط "Add"
   - كرر العملية لكل متغير

5. أعد نشر المشروع (Redeploy)

#### على Replit:

1. اذهب إلى Secrets (المفاتيح السرية)
2. أضف كل متغير كـ Secret جديد
3. أعد تشغيل المشروع

#### على منصات أخرى:

أضف متغيرات البيئة من لوحة التحكم الخاصة بالمنصة.

---

## ✅ التحقق من الإعداد

### 1. التحقق من وجود المتغيرات:

```bash
# في التطوير المحلي
cat .env.local

# في Vercel
# اذهب إلى Settings > Environment Variables وتأكد من وجودها
```

### 2. اختبار الموقع:

- ✅ الصفحة الرئيسية تعمل
- ✅ تسجيل الدخول في لوحة الإدارة يعمل
- ✅ ميزة AI Battle تعمل (يولد المقارنات)
- ✅ لا توجد أخطاء في console المتصفح

---

## 🔒 الأمان

### ⚠️ قواعد مهمة:

1. **لا تضع ملف `.env.local` أو `.env` في Git!**
   - تأكد من وجوده في `.gitignore`
   
2. **لا تشارك المفاتيح السرية أبداً:**
   - `JWT_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`

3. **استخدم مفاتيح مختلفة لكل بيئة:**
   - Development (تطوير)
   - Staging (اختبار)
   - Production (إنتاج)

4. **دوراً المفاتيح بانتظام:**
   - خاصة `JWT_SECRET` و `SUPABASE_SERVICE_ROLE_KEY`

---

## 📝 مثال كامل لملف `.env.local`

```env
# ============================================
# Supabase Configuration (Required)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# JWT Secret (Required - Minimum 32 chars)
# ============================================
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-random

# ============================================
# Groq AI (Required for AI Battle)
# ============================================
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# Site URL (Required for Production)
# ============================================
NEXT_PUBLIC_SITE_URL=https://www.productsvs.com

# ============================================
# Node Environment
# ============================================
NODE_ENV=production

# ============================================
# Google Analytics (Optional)
# ============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ============================================
# Google AdSense (Optional)
# ============================================
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_COMPARISON_HEADER=1234567890
NEXT_PUBLIC_ADSENSE_COMPARISON_SIDEBAR=2345678901
NEXT_PUBLIC_ADSENSE_COMPARISON_INFEED=3456789012
NEXT_PUBLIC_ADSENSE_COMPARISON_FOOTER=4567890123
NEXT_PUBLIC_ADSENSE_MOBILE_STICKY=5678901234
NEXT_PUBLIC_ADSENSE_HOMEPAGE_BANNER=6789012345
```

---

## 🆘 حل المشاكل

### خطأ: "JWT_SECRET is required"

**الحل:** تأكد من وجود `JWT_SECRET` في متغيرات البيئة وأنه 32 حرفاً على الأقل.

### خطأ: "AI service is not configured"

**الحل:** أضف `GROQ_API_KEY` إلى متغيرات البيئة.

### خطأ: "Missing Supabase environment variables"

**الحل:** تأكد من إضافة جميع متغيرات Supabase الثلاثة.

### الموقع لا يعمل بعد الإعداد

1. تحقق من صحة جميع المتغيرات
2. أعد تشغيل الخادم
3. امسح الـ cache
4. تحقق من console المتصفح للأخطاء

---

## 📞 الدعم

إذا واجهت مشاكل في الإعداد:
1. راجع ملف `PRODUCTION_READINESS.md`
2. راجع ملف `docs/DEPLOYMENT.md`
3. تحقق من console المتصفح للأخطاء

---

**آخر تحديث:** 2025-01-16

