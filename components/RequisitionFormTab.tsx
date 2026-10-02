'use client';

import React, { useState, useEffect } from 'react';
import { useStock } from '@/lib/store';
import { RequisitionItem } from '@/types/stock';
import { ClipboardList, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function RequisitionFormTab() {
  const { items, departments, fulfillRequisition, quickIssueSku, setQuickIssueSku } = useStock();

  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('CON');
  const [requesterName, setRequesterName] = useState<string>('นายวิชัย สุวรรณโชติ (นายช่างโยธาปฏิบัติงาน)');
  const [approverName, setApproverName] = useState<string>('นายชำนาญ การช่าง (หัวหน้าฝ่ายแบบแผน)');
  const [fulfilledBy, setFulfilledBy] = useState<string>('นายสมบัติ คลังพัสดุ (นายช่างโยธาชำนาญงาน)');
  const [purpose, setPurpose] = useState<string>('ใช้สำหรับจัดทำแบบแปลนและเอกสารโครงการปรับปรุงถนนสายหลัก');
  const [reqItems, setReqItems] = useState<RequisitionItem[]>([]);

  // If redirected from StockLedgerTab via "ขอเบิก"
  useEffect(() => {
    if (quickIssueSku) {
      const found = items.find(i => i.sku === quickIssueSku);
      if (found) {
        setReqItems(prev => {
          if (prev.some(p => p.sku === quickIssueSku)) return prev;
          return [
            ...prev,
            {
              sku: found.sku,
              name: found.name,
              requestedQty: 1,
              currentStock: found.currentStock
            }
          ];
        });
      }
      setQuickIssueSku(null);
    } else if (reqItems.length === 0 && items.length > 0) {
      // Default initial item
      setReqItems([
        {
          sku: items[0].sku,
          name: items[0].name,
          requestedQty: 1,
          currentStock: items[0].currentStock
        }
      ]);
    }
  }, [quickIssueSku, items, setQuickIssueSku, reqItems.length]);

  const handleAddItem = () => {
    const available = items.find(i => !reqItems.some(r => r.sku === i.sku)) || items[0];
    if (available) {
      setReqItems([
        ...reqItems,
        {
          sku: available.sku,
          name: available.name,
          requestedQty: 1,
          currentStock: available.currentStock
        }
      ]);
    }
  };

  const handleItemChange = (index: number, sku: string) => {
    const found = items.find(i => i.sku === sku);
    if (!found) return;
    const updated = [...reqItems];
    updated[index] = {
      sku: found.sku,
      name: found.name,
      requestedQty: 1,
      currentStock: found.currentStock
    };
    setReqItems(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...reqItems];
    const maxStock = updated[index].currentStock || 999;
    const safeQty = Math.max(1, Math.min(qty, maxStock));
    updated[index].requestedQty = safeQty;
    setReqItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (reqItems.length <= 1) return;
    setReqItems(reqItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqItems.length === 0) {
      alert('กรุณาเพิ่มรายการวัสดุที่ต้องการขอเบิกอย่างน้อย ๑ รายการ');
      return;
    }

    const dept = departments.find(d => d.code === selectedDeptCode);
    const deptName = dept ? dept.name : 'สำนักช่าง';

    fulfillRequisition({
      departmentCode: selectedDeptCode,
      departmentName: deptName,
      requesterName,
      approverName,
      fulfilledBy,
      purpose,
      items: reqItems
    });
  };

  const thaiNums = ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙', '๑๐'];

  return (
    <div className="space-y-4">
      {/* Title & Official Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#faf6ee] p-4 rounded-lg border border-stone-300 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-100 flex items-center justify-center font-bold shadow-xs">
            <ClipboardList className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              แบบขอเบิกวัสดุภายใน (Internal Material Requisition Form)
            </h2>
            <div className="text-xs text-stone-600 mt-0.5">
              สำนักช่าง • ระบบจัดทำใบขอเบิกและตัดยอดสต็อกพัสดุ
            </div>
          </div>
        </div>
        <div className="text-right text-xs font-mono-ledger text-stone-500">
          วันที่บันทึก: <span className="font-bold text-stone-800">{new Date().toLocaleDateString('th-TH')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="paper-sheet p-6 rounded-lg border border-stone-300 space-y-6">
        {/* Requisition Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#faf6ee] p-4 rounded-lg border border-stone-200">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              ฝ่าย / กลุ่มงานที่ขอเบิก (๗ ฝ่าย สำนักช่าง):
            </label>
            <select
              value={selectedDeptCode}
              onChange={(e) => setSelectedDeptCode(e.target.value)}
              className="w-full bg-white border border-stone-300 font-bold text-stone-900 text-xs px-3 py-2 rounded shadow-2xs focus:ring-1 focus:ring-stone-500 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.code} value={d.code}>
                  [{d.code}] {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              ชื่อผู้ขอเบิก (เจ้าหน้าที่ / นายช่าง):
            </label>
            <input
              type="text"
              required
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              className="w-full bg-white border border-stone-300 text-xs px-3 py-2 rounded shadow-2xs focus:ring-1 focus:ring-stone-500"
              placeholder="ระบุชื่อ-นามสกุล และตำแหน่ง..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              ชื่อหัวหน้าฝ่าย / ผู้สั่งจ่าย (ผู้อนุมัติการเบิก):
            </label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full bg-white border border-stone-300 text-xs px-3 py-2 rounded shadow-2xs focus:ring-1 focus:ring-stone-500"
              placeholder="ระบุชื่อหัวหน้าฝ่าย หรือ ผู้ควบคุมงาน..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              ชื่อผู้จ่ายพัสดุ / เจ้าหน้าที่คลัง:
            </label>
            <input
              type="text"
              value={fulfilledBy}
              onChange={(e) => setFulfilledBy(e.target.value)}
              className="w-full bg-white border border-stone-300 text-xs px-3 py-2 rounded shadow-2xs focus:ring-1 focus:ring-stone-500"
              placeholder="ระบุชื่อเจ้าหน้าที่คลังพัสดุ..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-800 mb-1">
              วัตถุประสงค์การนำไปใช้:
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-white border border-stone-300 text-xs px-3 py-2 rounded shadow-2xs focus:ring-1 focus:ring-stone-500"
              placeholder="เช่น ใช้สำหรับจัดพิมพ์แบบแปลนโครงการ, งานธุรการประจำฝ่าย..."
            />
          </div>
        </div>

        {/* Requisition Line Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">
              รายการวัสดุที่ต้องการขอเบิก ({reqItems.length} รายการ):
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs px-3 py-1.5 rounded border border-stone-300 shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-stone-600" />
              + เพิ่มแถวรายการวัสดุ
            </button>
          </div>

          <div className="border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left stock-card-table border-collapse text-xs">
              <thead>
                <tr>
                  <th className="py-2 px-2 w-8 text-center font-mono-ledger">#</th>
                  <th className="py-2 px-3 w-32 text-center font-mono-ledger">รหัส SKU</th>
                  <th className="py-2 px-4">ชื่อรายการวัสดุที่ต้องการ</th>
                  <th className="py-2 px-3 w-28 text-center font-mono-ledger">คงเหลือในคลัง</th>
                  <th className="py-2 px-3 w-24 text-center bg-[#f0e7d5]">จำนวนที่ขอเบิก</th>
                  <th className="py-2 px-2 w-10 text-center">ลบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {reqItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#fbf7ee]">
                    <td className="py-2.5 px-2 text-center font-mono-ledger">{thaiNums[idx] || idx + 1}</td>
                    <td className="py-2.5 px-3 text-center font-mono-ledger font-bold text-stone-700">
                      {item.sku}
                    </td>
                    <td className="py-2.5 px-4">
                      <select
                        value={item.sku}
                        onChange={(e) => handleItemChange(idx, e.target.value)}
                        className="w-full bg-[#fbf9f4] hover:bg-white focus:bg-white border border-stone-300 text-xs font-medium py-1.5 px-2 rounded cursor-pointer transition"
                      >
                        {items.map((i) => (
                          <option key={i.sku} value={i.sku} disabled={i.currentStock <= 0}>
                            {i.name} ({i.category}) [คงเหลือ: {i.currentStock}]
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono-ledger text-stone-600">
                      {item.currentStock}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max={item.currentStock || 1}
                        value={item.requestedQty}
                        onChange={(e) => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                        className="w-16 mx-auto block text-center font-mono-ledger font-bold text-sm bg-white border border-stone-400 py-1 rounded shadow-2xs focus:border-stone-700"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={reqItems.length <= 1}
                        className={`text-stone-400 hover:text-red-600 transition p-1 ${
                          reqItems.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button & Sign-off Warning */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <div className="text-xs text-stone-500 font-sans">
            * เมื่อกดบันทึกจ่ายของ ระบบจะตัดยอดคงเหลือในบัตรสต็อกทันที และสร้างใบรับ-จ่ายวัสดุทางการพิมพ์ A4
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-2.5 rounded shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>บันทึกจ่ายของ & ตัดสต็อก (Fulfill Requisition)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
