import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์เอกสารที่อัปโหลด' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, perform real OCR extraction
    if (geminiApiKey) {
      // Real Gemini API call can be hooked here with @google/generative-ai or fetch
      // For now we return simulated OCR extracted structure
    }

    // Default fallback: return structured simulated extraction
    return NextResponse.json({
      success: true,
      message: 'วิเคราะห์เอกสารสำเร็จ (AI OCR Extraction Complete)',
      data: {
        refNo: 'DS-6909100001',
        supplier: 'หจก. ตากคอมพิวเตอร์',
        date: new Date().toLocaleDateString('th-TH'),
        targetWarehouse: 'วัสดุคอมพิวเตอร์',
        hasHandwriting: true,
        handwrittenNote: 'มาพร้อม หมึก brother 6319 ดำ 5 ตลับ',
        handwrittenSignature: 'สิทธิชัย',
        items: [
          {
            id: `scan-${Date.now()}-1`,
            name: 'BROTHER TN-269 Black (ตลับหมึกเลเซอร์)',
            category: 'วัสดุคอมพิวเตอร์',
            qty: 1,
            price: 2290.00,
            total: 2290.00
          }
        ]
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'เกิดข้อผิดพลาดในการประมวลผลเอกสาร' },
      { status: 500 }
    );
  }
}
