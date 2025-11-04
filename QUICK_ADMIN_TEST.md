# 🔧 اختبار سريع لمشكلة تسجيل الدخول

## ⚠️ المشكلة المحتملة:

البيانات موجودة في **Local Database** لكن الكود يبحث في **Supabase**!

---

## ✅ الحل - تأكد إن البيانات في Supabase:

### 1️⃣ افتح Supabase Dashboard
```
https://app.supabase.com
→ اختر مشروعك
→ Table Editor
→ ابحث عن جدول "admin_users"
```

### 2️⃣ تحقق من البيانات

**إذا الجدول موجود:**
- شوف كم صف موجود؟
- شوف الإيميل المخزّن؟

**إذا الجدول مش موجود أو فاضي:**
- هذا السبب! محتاج تنفّذ الـ SQL في Supabase

---

## 🚀 الحل السريع:

### **نفّذ هذا الكود في Supabase SQL Editor:**

```sql
-- 1. إنشاء الجدول
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. إضافة حساب الأدمن
-- أولاً: توليد hash للباسورد على https://bcrypt-generator.com/
-- مثال: إذا الباسورد "MySecurePass123!"
-- راح يطلع hash مثل: $2b$10$abc123...

INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'admin@productsvs.com',              -- غيّر الإيميل
  '$2b$10$...',                        -- حط الـ hash هنا
  'Admin'
)
ON CONFLICT (email) DO NOTHING;

-- 3. تحقق من البيانات
SELECT id, email, name FROM admin_users;
```

---

## 🧪 اختبار بحساب تجريبي:

**إذا تبي تختبر بسرعة**، استخدم هذا الحساب:

```sql
-- حساب تجريبي
INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'test@admin.com',
  '$2b$10$XqL9z8jKGYmXj9Fh7F8kPe3vL.sKq.wL3/M8F8k.7M8F8k.7M8F8k.',
  'Test Admin'
)
ON CONFLICT (email) DO NOTHING;
```

**معلومات الدخول:**
- Email: `test@admin.com`
- Password: `Test123!`

⚠️ **مهم:** غيّر هذا الحساب بعد ما تتأكد إنه شغال!

---

## 📊 التحقق من الـ Logs:

بعد ما تضغط Login، شوف الـ Terminal (workflow logs):
```
[DEBUG] Admin lookup: { email: '...', found: true/false }
[DEBUG] Password validation: { valid: true/false }
```

**إذا found: false** → الجدول فاضي أو الإيميل غلط
**إذا valid: false** → الباسورد أو الـ hash غلط

---

## 🎯 الخطوات بالترتيب:

1. ✅ افتح Supabase Dashboard
2. ✅ SQL Editor → New Query
3. ✅ انسخ الكود أعلاه
4. ✅ Run
5. ✅ ارجع للموقع `/admin/login`
6. ✅ جرّب تسجيل الدخول
7. ✅ شوف الـ Terminal للأخطاء

---

**محتاج مساعدة إضافية؟** شاركني شو تشوف في:
- Supabase Table Editor (جدول admin_users)
- Terminal logs بعد ما تضغط Login
