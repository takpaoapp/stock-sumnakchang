import { NextRequest, NextResponse } from 'next/server';
import { fetchItemsFromGoogleSheets, isGoogleSheetsConfigured } from '@/lib/googleSheets';
import { INITIAL_STOCK_ITEMS } from '@/lib/initialData';

export async function GET() {
  try {
    if (isGoogleSheetsConfigured()) {
      const sheetId = process.env.GOOGLE_SHEET_ID!;
      const items = await fetchItemsFromGoogleSheets(sheetId);
      return NextResponse.json({ success: true, isLive: true, items });
    }

    return NextResponse.json({ success: true, isLive: false, items: INITIAL_STOCK_ITEMS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error fetching stock' },
      { status: 500 }
    );
  }
}
