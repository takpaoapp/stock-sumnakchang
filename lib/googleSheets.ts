import { google } from 'googleapis';
import { StockItem, Requisition, StockLog, WarehouseCategory, Department } from '@/types/stock';
import { INITIAL_STOCK_ITEMS, INITIAL_DEPARTMENTS } from './initialData';

// Google Service Account Authentication
export function getGoogleSheetsClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}

// 1. Initialize Sheet Schema (Auto-creates 5 tabs if not exists)
export async function initGoogleSheetSchema(spreadsheetId: string) {
  const sheets = getGoogleSheetsClient();
  if (!sheets) throw new Error('Google Sheets client is not configured');

  // Get existing sheet titles
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTitles = meta.data.sheets?.map(s => s.properties?.title || '') || [];

  const requiredSheets = ['Items', 'Requisitions', 'Requisition_Items', 'Stock_Logs', 'Departments'];
  const missingSheets = requiredSheets.filter(title => !existingTitles.includes(title));

  // Add missing sheets
  if (missingSheets.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: missingSheets.map(title => ({
          addSheet: { properties: { title } }
        }))
      }
    });
  }

  // 1. Setup 'Items' header & initial rows
  if (missingSheets.includes('Items') || existingTitles.length === 1) {
    const itemRows = [
      ['รหัส SKU', 'ชื่อรายการวัสดุ', 'คลังจัดเก็บ', 'เกณฑ์ขั้นต่ำ', 'คงเหลือปัจจุบัน', 'ราคาต่อหน่วย', 'หน่วยนับ', 'หมายเหตุ'],
      ...INITIAL_STOCK_ITEMS.map(i => [
        i.sku,
        i.name,
        i.category,
        i.minStock,
        i.currentStock,
        i.unitPrice,
        i.unit || 'ชิ้น',
        i.sourceNote || ''
      ])
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Items!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: itemRows }
    });
  }

  // 2. Setup 'Departments'
  if (missingSheets.includes('Departments')) {
    const deptRows = [
      ['รหัสฝ่าย', 'ชื่อฝ่าย / กลุ่มงาน', 'ชื่อย่อ'],
      ...INITIAL_DEPARTMENTS.map(d => [d.code, d.name, d.shortName])
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Departments!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: deptRows }
    });
  }

  // 3. Setup 'Requisitions'
  if (missingSheets.includes('Requisitions')) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Requisitions!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['เลขที่ใบเบิก', 'วันที่', 'รหัสฝ่าย', 'ชื่อฝ่าย', 'ผู้ขอเบิก', 'วัตถุประสงค์', 'สถานะ', 'ผู้จ่ายพัสดุ']
        ]
      }
    });
  }

  // 4. Setup 'Requisition_Items'
  if (missingSheets.includes('Requisition_Items')) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Requisition_Items!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['เลขที่ใบเบิก', 'รหัส SKU', 'ชื่อรายการวัสดุ', 'จำนวนที่ขอเบิก', 'จำนวนจ่ายจริง']
        ]
      }
    });
  }

  // 5. Setup 'Stock_Logs'
  if (missingSheets.includes('Stock_Logs')) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Stock_Logs!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['วันเวลาที่ทำรายการ', 'รหัส SKU', 'ชื่อรายการวัสดุ', 'ประเภท', 'จำนวน', 'ยอดคงเหลือหลังทำรายการ', 'เลขที่อ้างอิง', 'ผู้บันทึก', 'หมายเหตุ']
        ]
      }
    });
  }

  return { success: true, message: 'โครงสร้างฐานข้อมูล ๕ แท็บพร้อมใช้งานแล้ว' };
}

// 2. Fetch all items from Google Sheets
export async function fetchItemsFromGoogleSheets(spreadsheetId: string): Promise<StockItem[]> {
  const sheets = getGoogleSheetsClient();
  if (!sheets) return INITIAL_STOCK_ITEMS;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Items!A2:H',
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return INITIAL_STOCK_ITEMS;

  return rows.map((row, idx) => ({
    id: `item-${idx + 1}`,
    sku: row[0] || `SKU-${idx + 1}`,
    name: row[1] || 'ไม่ระบุชื่อ',
    category: (row[2] as WarehouseCategory) || 'วัสดุสำนักงาน',
    minStock: parseInt(row[3]) || 0,
    currentStock: parseInt(row[4]) || 0,
    unitPrice: parseFloat(row[5]) || 0,
    unit: row[6] || 'ชิ้น',
    sourceNote: row[7] || ''
  }));
}
