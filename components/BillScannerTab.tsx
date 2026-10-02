'use client';

import React, { useState } from 'react';
import { useStock } from '@/lib/store';
import { WarehouseCategory, ScannedBillItem } from '@/types/stock';
import { SAMPLE_BILLS } from '@/lib/initialData';
import { ScanLine, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const WAREHOUSE_LIST: WarehouseCategory[] = [
  'วัสดุคอมพิวเตอร์',
  'วัสดุสำนักงาน',
  'ซองจดหมาย',
  'วัสดุรวม',
  'วัสดุงานบ้าน'
];

export default function BillScannerTab() {
  const { restockFromBill } = useStock();

  const [currentBillIndex, setCurrentBillIndex] = useState<number>(0);
  const [activeWarehouse, setActiveWarehouse] = useState<WarehouseCategory>(SAMPLE_BILLS[0].targetWarehouse);
  const [billItems, setBillItems] = useState<ScannedBillItem[]>(SAMPLE_BILLS[0].items);
  const [handwrittenAdded, setHandwrittenAdded] = useState<boolean>(false);

  const currentBill = SAMPLE_BILLS[currentBillIndex];

  // Switch sample bill
  const handleSwitchBill = (index: number) => {
    setCurrentBillIndex(index);
    const bill = SAMPLE_BILLS[index];
    setActiveWarehouse(bill.targetWarehouse);
    setBillItems(bill.items);
    setHandwrittenAdded(false);
  };

  // Change all warehouses
  const handleMasterWarehouseChange = (wh: WarehouseCategory) => {
    setActiveWarehouse(wh);
    setBillItems(billItems.map(item => ({ ...item, category: wh })));
  };

  // Row updates
  const handleItemNameChange = (id: string, name: string) => {
    setBillItems(billItems.map(item => item.id === id ? { ...item, name } : item));
  };

  const handleItemWarehouseChange = (id: string, category: WarehouseCategory) => {
    setBillItems(billItems.map(item => item.id === id ? { ...item, category } : item));
  };

  const handleItemQtyChange = (id: string, qty: number) => {
    const safeQty = Math.max(1, qty);
    setBillItems(billItems.map(item => {
      if (item.id === id) {
        return { ...item, qty: safeQty, total: safeQty * item.price };
      }
      return item;
    }));
  };

  const handleItemPriceChange = (id: string, price: number) => {
    const safePrice = Math.max(0, price);
    setBillItems(billItems.map(item => {
      if (item.id === id) {
        return { ...item, price: safePrice, total: item.qty * safePrice };
      }
      return item;
    }));
  };

  const handleDeleteRow = (id: string) => {
    const target = billItems.find(i => i.id === id);
    if (target?.isHandwritten) {
      setHandwrittenAdded(false);
    }
    setBillItems(billItems.filter(item => item.id !== id));
  };

  // Approach 2: One-click add from handwritten note
  const handleAddHandwritten = () => {
    if (handwrittenAdded) return;
    const newItem: ScannedBillItem = {
      id: `hw-${Date.now()}`,
      name: 'ตลับหมึก Brother LC-3619 BK (สีดำ) [มาพร้อมบิล]',
      category: 'วัสดุคอมพิวเตอร์',
      qty: 5,
      price: 0.00,
      total: 0.00,
      isHandwritten: true
    };
    setBillItems([...billItems, newItem]);
    setHandwrittenAdded(true);
  };

  // Approach 3: Human-in-the-loop manual row addition
  const handleAddManualRow = () => {
    const newItem: ScannedBillItem = {
      id: `manual-${Date.now()}`,
      name: '',
      category: activeWarehouse,
      qty: 1,
      price: 0.00,
      total: 0.00,
      isManual: true
    };
    setBillItems([...billItems, newItem]);
  };

  // Confirm and Restock into Stock Card Ledger
  const handleConfirmRestock = () => {
    if (billItems.length === 0) {
      alert('ไม่มีรายการวัสดุที่จะรับเข้า');
      return;
    }

    const validItems = billItems.filter(i => i.name.trim() !== '');
    if (validItems.length === 0) {
      alert('กรุณากรอกชื่อรายการวัสดุให้ครบถ้วน');
      return;
    }

    const totalQty = validItems.reduce((sum, i) => sum + i.qty, 0);

    restockFromBill(
      validItems.map(i => ({
        name: i.name,
        category: i.category,
        qty: i.qty,
        price: i.price
      })),
      currentBill.refNo,
      currentBill.supplier
    );

    alert(`✓ บันทึกการตรวจรับวัสดุ ${validItems.length} รายการ (รวม ${totalQty} ชิ้น) เรียบร้อยแล้ว!\nระบบได้นำท่านไปยังหน้าบัตรควบคุมวัสดุทันที`);
  };

  const totalQty = billItems.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = billItems.reduce((sum, i) => sum + i.total, 0);
  const thaiNums = ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙', '๑๐', '๑๑', '๑๒'];

  return (
    <div className="space-y-4">
      {/* Title & Upload Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#faf6ee] p-4 rounded-lg border border-stone-300 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-100 flex items-center justify-center font-bold shadow-xs">
            <ScanLine className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              ตรวจรับวัสดุเข้าคลังจากบิลสแกน (AI Bill Scan & Verification)
            </h2>
            <div className="text-xs text-stone-600 mt-0.5">
              นำเข้าจากภาพถ่ายบิล/ใบแจ้งหนี้/ใบส่งของ • ตรวจทานความถูกต้องก่อนบันทึกเข้าบัตรคุม
            </div>
          </div>
        </div>

        <label className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-2 rounded shadow-2xs flex items-center gap-2 cursor-pointer transition">
          <Upload className="w-3.5 h-3.5 text-amber-300" />
          <span>อัปโหลดรูปบิลใหม่ / PDF</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={() => alert('ระบบพร้อมจำลองการอ่านไฟล์บิลที่อัปโหลด...')}
          />
        </label>
      </div>

      {/* Sample Bill Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f3ecdf] p-2.5 rounded-lg border border-stone-300">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
            เลือกดูตัวอย่างเอกสารสแกน:
          </span>
          <button
            type="button"
            onClick={() => handleSwitchBill(0)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition flex items-center gap-1.5 cursor-pointer ${
              currentBillIndex === 0
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
            }`}
          >
            <span>บิลที่ ๑:</span> หมึกพิมพ์ (ตากคอมพิวเตอร์ DS-6908280002)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchBill(1)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition flex items-center gap-1.5 cursor-pointer ${
              currentBillIndex === 1
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
            }`}
          >
            <span>บิลที่ ๒:</span> แฟ้มเอกสาร (ใบส่งของ A00603)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchBill(2)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition flex items-center gap-1.5 cursor-pointer ${
              currentBillIndex === 2
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <span>บิลที่ ๓:</span> ✍️ บิลมีลายมือเขียน (ตากคอมฯ DS-6909100001)
          </button>
        </div>
        <span className="text-[11px] text-stone-600 font-mono-ledger bg-white/70 px-2.5 py-1 rounded border border-stone-200">
          กำลังแสดง: {currentBill.refNo} ({currentBill.supplier})
        </span>
      </div>

      {/* Two-Column Desk Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Simulated Scanned Bill Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>ภาพเอกสารต้นฉบับ (Scanned Bill Preview)</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ ตรวจอ่านความชัดเจน 100%
            </span>
          </div>

          {/* Bill 1 Preview */}
          {currentBillIndex === 0 && (
            <div className="bg-white border-2 border-stone-300 p-5 rounded-lg shadow-sm text-[11px] font-sans leading-tight relative overflow-hidden select-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <div className="flex items-start justify-between border-b border-stone-300 pb-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded bg-blue-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    TC
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-xs">ห้างหุ้นส่วนจำกัด ตากคอมพิวเตอร์ (สำนักงานใหญ่)</div>
                    <div className="text-[10px] text-stone-500">6/33-34 ถนนพหลโยธิน ตำบลระแหง อำเภอเมือง จังหวัดตาก</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-900 text-xs">ใบส่งของชั่วคราว</div>
                  <div className="font-mono-ledger text-blue-900 font-bold text-[11px]">DS-6908280002</div>
                </div>
              </div>
              <div className="bg-stone-50 p-2 rounded border border-stone-200 mb-3 text-[10px]">
                <div><strong>ลูกค้า:</strong> สำนักงาน องค์การบริหารส่วนจังหวัดตาก (สำนักงานใหญ่)</div>
                <div><strong>ที่อยู่:</strong> 999 หมู่ 9 ต.น้ำรึม อ.เมือง จ.ตาก 63000</div>
              </div>
              <div className="text-[10px] text-stone-600 bg-stone-50 p-2 rounded border border-stone-200">
                รายการตลับหมึกพิมพ์เลเซอร์และอิงค์เจ็ท HP, Brother จำนวน ๗ รายการ (ยอดเงิน 23,160.00 บาท)
              </div>
            </div>
          )}

          {/* Bill 2 Preview */}
          {currentBillIndex === 1 && (
            <div className="bg-white border-2 border-stone-300 p-5 rounded-lg shadow-sm text-[11px] font-sans leading-tight relative overflow-hidden select-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <div className="bg-stone-800 text-white p-3 rounded mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-stone-300 tracking-wider">เอกสารส่งมอบพัสดุ/สินค้า</div>
                  <div className="font-bold text-sm text-right text-stone-100">ใบส่งของ <span className="text-xs font-normal text-stone-300">ต้นฉบับ</span></div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-200 border-t border-stone-700 pt-2 font-mono-ledger">
                  <div>เลขที่: <span className="font-bold text-white">A00603</span></div>
                  <div>ยอดรวม: <span className="font-bold text-amber-300">855.00 บาท</span></div>
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded border border-stone-200 mb-3 text-[10px]">
                <div className="font-bold text-stone-900">ลูกค้า: องค์การบริหารส่วนจังหวัดตาก (กองช่าง)</div>
                <div className="text-stone-600 mt-1">รายการ: แฟ้มสันกว้าง 3 นิ้ว 112F (จำนวน 9 แฟ้ม)</div>
              </div>
            </div>
          )}

          {/* Bill 3 Preview (With Realistic Blue Pen Handwritten Addition) */}
          {currentBillIndex === 2 && (
            <div className="bg-white border-2 border-stone-300 p-5 rounded-lg shadow-sm text-[11px] font-sans leading-tight relative overflow-hidden select-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <div className="flex items-start justify-between border-b border-stone-300 pb-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded bg-blue-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    TC
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-xs">หจก. ตากคอมพิวเตอร์ (สำนักงานใหญ่)</div>
                    <div className="text-[10px] text-stone-500">โทร. 055-513-333</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-900 text-xs">ใบส่งสินค้าชั่วคราว</div>
                  <div className="font-mono-ledger text-blue-900 font-bold text-[11px]">DS-6909100001</div>
                </div>
              </div>

              {/* Table with Printed Row + Handwritten Box */}
              <div className="border border-stone-200 rounded overflow-hidden mb-3">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-stone-100 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-1 px-1.5 w-6 text-center">#</th>
                      <th className="py-1 px-1.5">รหัสสินค้า / รายละเอียด</th>
                      <th className="py-1 px-1.5 w-16 text-center">จำนวน</th>
                      <th className="py-1 px-1.5 w-16 text-right">รวมเงิน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="py-1.5 px-1.5 text-center font-mono-ledger">1</td>
                      <td className="py-1.5 px-1.5 font-mono text-[10px]">4977766829632 BROTHER TN-269 Black</td>
                      <td className="py-1.5 px-1.5 text-center font-bold">1.00 กล่อง</td>
                      <td className="py-1.5 px-1.5 text-right font-mono-ledger font-bold">2,290.00</td>
                    </tr>
                    {/* Simulated Realistic Blue Pen Handwriting */}
                    <tr className="bg-blue-50/40">
                      <td className="py-2 px-1.5 text-center text-blue-900 font-bold text-xs">✍️</td>
                      <td colSpan={3} className="py-2 px-2">
                        <div className="flex items-center justify-between border-2 border-dashed border-blue-400 bg-blue-100/60 p-1.5 rounded -rotate-0.5 shadow-2xs">
                          <div className="italic font-bold text-blue-900 text-xs tracking-wide">
                            มาพร้อม หมึก brother 6319 ดำ 5 ตลับ
                          </div>
                          <div className="text-[9px] text-blue-800 font-mono-ledger bg-white px-1.5 py-0.5 rounded border border-blue-300">
                            เซ็นกำกับ: <strong className="italic">✓ สิทธิชัย</strong>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-stone-50 p-2 rounded border border-stone-200 flex justify-between font-bold text-xs">
                <span>ยอดรวมตามบิลพิมพ์ (๑ รายการ):</span>
                <span className="text-blue-900 font-mono-ledger">2,290.00 บาท</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Extraction & Verified Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Summary Header of Extracted Data */}
          <div className="bg-[#faf6ee] border border-stone-300 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">คลังปลายทาง (เปลี่ยนทุกรายการได้):</span>
                <select
                  value={activeWarehouse}
                  onChange={(e) => handleMasterWarehouseChange(e.target.value as WarehouseCategory)}
                  className="mt-0.5 bg-white border border-emerald-400 font-bold text-emerald-900 text-xs px-2.5 py-1 rounded shadow-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {WAREHOUSE_LIST.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">เลขที่บิลอ้างอิง:</span>
                <span className="font-mono-ledger font-bold text-stone-900 text-sm">
                  {currentBill.refNo}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">หน่วยงาน / ผู้จำหน่าย:</span>
                <span className="font-bold text-stone-800 truncate block">
                  {currentBill.supplier}
                </span>
              </div>
            </div>
          </div>

          {/* Approach 2: Detected Handwritten Notes Banner (Shown on Bill 3) */}
          {currentBill.hasHandwriting && (
            <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  ✍️
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span>ตรวจพบข้อความลายมือเขียนเพิ่มเติมบนบิล:</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                      AI OCR Detection
                    </span>
                  </div>
                  <div className="text-xs italic text-blue-900 mt-0.5 font-bold">
                    &quot;{currentBill.handwrittenNote}&quot; (มีลายเซ็นกำกับ)
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    * เขียนด้วยปากกาน้ำเงินนอกเหนือจากตารางพิมพ์ทางการ ท่านต้องการรับรายการนี้เข้าคลังด้วยหรือไม่?
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddHandwritten}
                disabled={handwrittenAdded}
                className={`font-bold text-xs px-3 py-2 rounded flex items-center gap-1.5 transition flex-shrink-0 shadow-xs ${
                  handwrittenAdded
                    ? 'bg-emerald-700 text-white opacity-90 cursor-default'
                    : 'bg-amber-700 hover:bg-amber-800 text-white cursor-pointer'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {handwrittenAdded
                  ? '✓ แปลงเข้าตารางรับเข้าแล้ว (+๕ ตลับ)'
                  : '+ แปลงลายมือนี้เป็นรายการรับเข้า (+๕ ตลับ)'}
              </button>
            </div>
          )}

          {/* Line Items Table Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800">
                  รายการวัสดุที่ AI ถอดได้ (พร้อมบันทึกเข้าคลัง {billItems.length} รายการ):
                </span>
                <span className="text-[11px] text-stone-500 font-mono-ledger hidden sm:inline">
                  * ตรวจสอบยอดแล้วสามารถกดรับเข้าได้ทันที
                </span>
              </div>

              {/* Approach 3: Button to add manual rows */}
              <button
                type="button"
                onClick={handleAddManualRow}
                className="bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs px-2.5 py-1.5 rounded border border-stone-300 shadow-2xs flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-stone-600" />
                + เพิ่มแถวรายการเอง
              </button>
            </div>

            {/* Extracted Line Items Table */}
            <div className="border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left stock-card-table border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="py-2 px-2 w-8 text-center font-mono-ledger">#</th>
                    <th className="py-2 px-3">ชื่อรายการวัสดุ</th>
                    <th className="py-2 px-2.5 w-36 text-center">คลังที่จะนำไปเก็บ</th>
                    <th className="py-2 px-2.5 w-20 text-center bg-[#f0e7d5]">รับเข้า</th>
                    <th className="py-2 px-2.5 w-24 text-right font-mono-ledger">ราคา/หน่วย</th>
                    <th className="py-2 px-2.5 w-24 text-right font-mono-ledger">รวมเงิน</th>
                    <th className="py-2 px-1 w-8 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {billItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={
                        item.isHandwritten
                          ? 'hover:bg-blue-50/60 bg-blue-50/20'
                          : 'hover:bg-[#fbf7ee]'
                      }
                    >
                      <td className="py-2 px-2 text-center font-mono-ledger">
                        {thaiNums[idx] || idx + 1}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                            placeholder="พิมพ์ชื่อรายการวัสดุ..."
                            className={`w-full text-xs text-stone-900 font-medium py-1 px-2 rounded border focus:bg-white transition ${
                              item.isHandwritten
                                ? 'bg-white border-blue-300 focus:border-blue-600'
                                : 'bg-[#fbf9f4] border-stone-200 focus:border-stone-500'
                            }`}
                          />
                          {/* Approach 1: Badge for handwritten item */}
                          {item.isHandwritten && (
                            <span className="text-[9.5px] bg-blue-100 text-blue-900 border border-blue-300 px-1.5 py-0.5 rounded font-bold whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                              ✍️ ลายมือเขียน
                            </span>
                          )}
                          {item.isManual && (
                            <span className="text-[9.5px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold whitespace-nowrap flex-shrink-0">
                              👤 เพิ่มเอง
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <select
                          value={item.category}
                          onChange={(e) => handleItemWarehouseChange(item.id, e.target.value as WarehouseCategory)}
                          className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-stone-800 font-medium cursor-pointer"
                        >
                          {WAREHOUSE_LIST.map((wh) => (
                            <option key={wh} value={wh}>
                              {wh}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemQtyChange(item.id, parseInt(e.target.value) || 1)}
                          className="scan-item-qty w-14 mx-auto block text-center font-mono-ledger font-bold text-sm text-emerald-900 bg-emerald-50 border border-emerald-300 focus:border-emerald-600 rounded py-1"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono-ledger text-stone-600">
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemPriceChange(item.id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-right font-mono-ledger text-xs bg-transparent border-0 focus:bg-white border-b border-transparent focus:border-stone-400 rounded py-0.5 px-1"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono-ledger font-semibold text-stone-900">
                        {item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(item.id)}
                          title="ลบรายการนี้"
                          className="text-stone-300 hover:text-red-600 transition font-bold px-1 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-stone-300 bg-stone-100 font-bold">
                  <tr>
                    <td colSpan={3} className="py-2 px-3 text-right">
                      รวมจำนวนวัสดุรับเข้าทั้งสิ้น:
                    </td>
                    <td className="py-2 px-2.5 text-center font-mono-ledger text-sm text-emerald-900 font-extrabold">
                      {totalQty}
                    </td>
                    <td className="py-2 px-2.5 text-right text-stone-500">
                      ยอดรวมเงิน:
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono-ledger text-blue-900">
                      {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <div className="text-[11px] text-stone-500">
              * แก้ไขชื่อรายการ, จำนวนรับเข้า หรือเลือกคลังจัดเก็บของแต่ละชิ้นได้ตามต้องการ
            </div>
            <button
              type="button"
              onClick={handleConfirmRestock}
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>✓ ยืนยันตรวจรับ & บันทึกเข้าคลังวัสดุ</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
