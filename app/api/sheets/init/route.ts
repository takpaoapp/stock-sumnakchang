import { NextRequest, NextResponse } from 'next/server';
import { initGoogleSheetSchema, isGoogleSheetsConfigured } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json(
        { error: 'ยังไม่ได้ตั้งค่า GOOGLE_SHEET_ID หรือ Service Account ใน .env.local' },
        { status: 400 }
      );
    }

    const sheetId = process.env.GOOGLE_SHEET_ID!;
    const result = await initGoogleSheetSchema(sheetId);

    return NextResponse.json({
      success: true,
      message: 'เสกสร้าง ๕ แท็บฐานข้อมูลใน Google Sheet สำเร็จเรียบร้อยแล้ว!',
      result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheets' },
      { status: 500 }
    );
  }
}
