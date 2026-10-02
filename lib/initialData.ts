import { Department, StockItem, ScannedBill } from '@/types/stock';

export const INITIAL_DEPARTMENTS: Department[] = [
  { code: 'DES', name: 'ฝ่ายออกแบบ', shortName: 'ออกแบบ' },
  { code: 'SUR', name: 'ฝ่ายสำรวจ', shortName: 'สำรวจ' },
  { code: 'ARC', name: 'กลุ่มงานสถาปัตยกรรม', shortName: 'สถาปัตย์' },
  { code: 'CON', name: 'ฝ่ายก่อสร้างและซ่อมบำรุง', shortName: 'ก่อสร้าง' },
  { code: 'RRD', name: 'กลุ่มงานทางหลวงชนบท', shortName: 'ทางหลวง' },
  { code: 'MCH', name: 'ฝ่ายเครื่องจักรกล', shortName: 'เครื่องจักร' },
  { code: 'ADM', name: 'ฝ่ายบริหารงานทั่วไป', shortName: 'บริหาร' },
];

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'item-1',
    sku: 'COM-TNR-01',
    name: 'ตลับหมึก HP LaserJet Pro M404 (057H Black)',
    category: 'วัสดุคอมพิวเตอร์',
    minStock: 2,
    currentStock: 5,
    unitPrice: 3450.00,
    unit: 'ตลับ'
  },
  {
    id: 'item-2',
    sku: 'OFF-PPR-A4',
    name: 'กระดาษถ่ายเอกสาร A4 80 แกรม (Double A กล่อง 5 รีม)',
    category: 'วัสดุสำนักงาน',
    minStock: 10,
    currentStock: 24,
    unitPrice: 580.00,
    unit: 'กล่อง'
  },
  {
    id: 'item-3',
    sku: 'ENV-WHT-09',
    name: 'ซองจดหมายขาว มาตรฐาน 9/125 มีครุฑ (กล่อง 500 ซอง)',
    category: 'ซองจดหมาย',
    minStock: 3,
    currentStock: 8,
    unitPrice: 240.00,
    unit: 'กล่อง'
  },
  {
    id: 'item-4',
    sku: 'GEN-TAP-02',
    name: 'เทปกาว OPP ใส 2 นิ้ว x 100 หลา (แถว 6 ม้วน)',
    category: 'วัสดุรวม',
    minStock: 4,
    currentStock: 1,
    unitPrice: 165.00,
    unit: 'แถว'
  },
  {
    id: 'item-5',
    sku: 'HOU-BAG-30',
    name: 'ถุงขยะดำหนาพิเศษ 30 x 40 นิ้ว (แพ็ค 1 กก.)',
    category: 'วัสดุงานบ้าน',
    minStock: 5,
    currentStock: 12,
    unitPrice: 65.00,
    unit: 'แพ็ค'
  },
  {
    id: 'item-6',
    sku: 'OFF-FLD-01',
    name: 'แฟ้มสันกว้าง 3 นิ้ว 112F ปกดำ (กล่อง 12 เล่ม)',
    category: 'วัสดุสำนักงาน',
    minStock: 2,
    currentStock: 9,
    unitPrice: 855.00,
    unit: 'กล่อง'
  },
  {
    id: 'item-7',
    sku: 'COM-USB-64',
    name: 'แฟลชไดรฟ์ Kingston DataTraveler 64GB USB 3.2',
    category: 'วัสดุคอมพิวเตอร์',
    minStock: 3,
    currentStock: 0,
    unitPrice: 220.00,
    unit: 'อัน'
  },
  {
    id: 'item-8',
    sku: 'HOU-GLV-03',
    name: 'ถุงมือยางอนามัย ไซส์ M (กล่อง 100 ชิ้น)',
    category: 'วัสดุงานบ้าน',
    minStock: 2,
    currentStock: 2,
    unitPrice: 190.00,
    unit: 'กล่อง'
  }
];

export const SAMPLE_BILLS: ScannedBill[] = [
  {
    refNo: 'DS-6908280002',
    supplier: 'หจก. ตากคอมพิวเตอร์',
    date: '28/08/2569',
    targetWarehouse: 'วัสดุคอมพิวเตอร์',
    items: [
      { id: 'sb-1', name: 'HP 4S6X8PA 938 Black (หมึกดำ)', category: 'วัสดุคอมพิวเตอร์', qty: 4, price: 1640.00, total: 6560.00 },
      { id: 'sb-2', name: 'HP 4S6X5PA 938 Cyan (หมึกฟ้า)', category: 'วัสดุคอมพิวเตอร์', qty: 2, price: 1100.00, total: 2200.00 },
      { id: 'sb-3', name: 'HP 4S6X6PA 938 Magenta (หมึกแดง)', category: 'วัสดุคอมพิวเตอร์', qty: 2, price: 1100.00, total: 2200.00 },
      { id: 'sb-4', name: 'HP 4S6X7PA 938 Yellow (หมึกเหลือง)', category: 'วัสดุคอมพิวเตอร์', qty: 2, price: 1100.00, total: 2200.00 },
      { id: 'sb-5', name: 'ตลับหมึก Brother LC-3619XL BK (สีดำ)', category: 'วัสดุคอมพิวเตอร์', qty: 5, price: 840.00, total: 4200.00 },
      { id: 'sb-6', name: 'ตลับหมึก Brother LC-3619XL C (สีฟ้า)', category: 'วัสดุคอมพิวเตอร์', qty: 3, price: 725.00, total: 2175.00 },
      { id: 'sb-7', name: 'ตลับหมึก Brother LC-3619XLY (สีเหลือง)', category: 'วัสดุคอมพิวเตอร์', qty: 5, price: 725.00, total: 3625.00 },
    ]
  },
  {
    refNo: 'A00603',
    supplier: 'องค์การบริหารส่วนจังหวัดตาก (กองช่าง)',
    date: '28/09/2569',
    targetWarehouse: 'วัสดุสำนักงาน',
    items: [
      { id: 'sb-8', name: 'แฟ้มสันกว้าง 3 นิ้ว 112F', category: 'วัสดุสำนักงาน', qty: 9, price: 95.00, total: 855.00 }
    ]
  },
  {
    refNo: 'DS-6909100001',
    supplier: 'หจก. ตากคอมพิวเตอร์',
    date: '10/09/2569',
    targetWarehouse: 'วัสดุคอมพิวเตอร์',
    hasHandwriting: true,
    handwrittenNote: 'มาพร้อม หมึก brother 6319 ดำ 5 ตลับ',
    handwrittenSignature: 'สิทธิชัย',
    items: [
      { id: 'sb-9', name: 'BROTHER TN-269 Black (ตลับหมึกเลเซอร์)', category: 'วัสดุคอมพิวเตอร์', qty: 1, price: 2290.00, total: 2290.00 }
    ]
  }
];
