// api/upload-image.js

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

export default async function handler(req, res) {
  // ===== 1. التأكد إنه POST request =====
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ===== 2. جلب الـ key من Environment Variable =====
  const IMGBB_KEY = process.env.IMGBB_KEY;

  if (!IMGBB_KEY) {
    console.error('❌ IMGBB_KEY مش موجود في Environment Variables');
    return res.status(500).json({ error: 'خطأ في إعدادات السيرفر' });
  }

  try {
    // ===== 3. استقبال الصورة من الـ body =====
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'لا توجد صورة' });
    }

    // ===== 4. التأكد إنه base64 صالح =====
    if (typeof image !== 'string' || !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'صيغة الصورة مش صحيحة' });
    }

    // ===== 5. فصل الـ base64 عن الـ prefix =====
    const pureBase64 = image.split(',')[1];

    if (!pureBase64 || pureBase64.length < 100) {
      return res.status(400).json({ error: 'الصورة فارغة أو صغيرة جداً' });
    }

    // ===== 6. التأكد إن الحجم مناسب (5MB max بعد الضغط) =====
    // base64 حجمه أكبر بـ 33% من الملف الأصلي تقريباً
    const sizeInBytes = (pureBase64.length * 3) / 4;
    const maxBytes = 5 * 1024 * 1024;

    if (sizeInBytes > maxBytes) {
      return res.status(400).json({ 
        error: 'حجم الصورة كبير جداً',
        maxSize: '5MB'
      });
    }

    // ===== 7. إرسال الصورة لـ ImgBB =====
    const formData = new URLSearchParams();
    formData.append('key', IMGBB_KEY);
    formData.append('image', pureBase64);

    const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await imgbbResponse.json();

    // ===== 8. التأكد إن الرفع نجح =====
    if (result.success && result.data && result.data.url) {
      return res.status(200).json({
        success: true,
        url: result.data.url,
        deleteUrl: result.data.delete_url || null,
        size: {
          width: result.data.width,
          height: result.data.height,
        }
      });
    }

    // ===== 9. لو ImgBB رد بخطأ =====
    console.error('ImgBB error:', result);
    return res.status(500).json({
      error: result.error?.message || 'فشل رفع الصورة في ImgBB',
      imgbbStatus: result.status || 'unknown'
    });

  } catch (error) {
    console.error('❌ خطأ في upload-image:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء رفع الصورة',
      details: error.message
    });
  }
}
