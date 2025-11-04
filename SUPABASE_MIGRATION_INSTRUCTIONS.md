# 🗄️ تعليمات إنشاء جدول المقارنات في Supabase

## المشكلة
الكود جاهز لنظام المودريشن، لكن جدول `comparisons_dynamic` محتاج ينشأ في قاعدة بيانات Supabase الخارجية.

## الحل - خطوات بسيطة:

### 1️⃣ افتح Supabase Dashboard
- اذهب إلى: [https://app.supabase.com](https://app.supabase.com)
- اختر مشروعك

### 2️⃣ افتح SQL Editor
- من القائمة الجانبية → اضغط **SQL Editor**
- اضغط **+ New Query**

### 3️⃣ انسخ والصق هذا الكود SQL:

```sql
-- Create comparisons_dynamic table for AI-generated comparisons
CREATE TABLE IF NOT EXISTS public.comparisons_dynamic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_a TEXT NOT NULL,
  product_b TEXT NOT NULL,
  category TEXT NOT NULL,
  comparison_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by TEXT,
  reviewed_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  notification_email TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comparisons_status ON public.comparisons_dynamic(status);
CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON public.comparisons_dynamic(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.comparisons_dynamic;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.comparisons_dynamic
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions (if using RLS)
ALTER TABLE public.comparisons_dynamic ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS
CREATE POLICY "Service role bypass" ON public.comparisons_dynamic
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anyone to view approved comparisons
CREATE POLICY "Anyone can view approved" ON public.comparisons_dynamic
  FOR SELECT
  USING (status = 'approved');
```

### 4️⃣ نفّذ الكود
- اضغط **Run** (أو Ctrl/Cmd + Enter)
- انتظر رسالة **Success**

### 5️⃣ تحقق من النجاح
- اذهب **Table Editor** من القائمة الجانبية
- يفترض تشوف جدول جديد: `comparisons_dynamic`

---

## ✅ بعد التنفيذ:
- **نظام المودريشن بيشتغل تلقائياً**
- كل مقارنة جديدة من AI Battle بتحفظ بحالة "pending"
- الأدمن يقدر يراجعها ويوافق عليها من Admin Dashboard
- بعد الموافقة، تصير صفحة دائمة على الموقع

---

## 🔍 اختبار النظام:
1. افتح `/ai-battle` على الموقع
2. اكتب منتجين واضغط Compare
3. راح تشوف رسالة: "Your comparison has been submitted for review"
4. افتح `/admin` ولوقين
5. راح تشوف المقارنة في Pending Reviews
6. وافق عليها → تصير صفحة دائمة!

---

**ملاحظة:** إذا واجهت أي مشكلة، تأكد أنك مسجل دخول في Supabase بحساب عنده صلاحيات على المشروع.
