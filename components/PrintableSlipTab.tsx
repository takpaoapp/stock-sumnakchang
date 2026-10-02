'use client';

import React from 'react';
import { useStock } from '@/lib/store';
import { Printer, FileText, ArrowLeft } from 'lucide-react';

export default function PrintableSlipTab() {
  const { activeSlip, requisitions, setActiveSlip, setActiveTab } = useStock();

  const slip = activeSlip || requisitions[0];

  const handlePrint = () => {
    window.print();
  };

  const thaiNums = ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙', '๑๐'];

  if (!slip) {
    return (
      <div className="paper-sheet p-12 rounded-lg border border-stone-300 text-center space-y-4">
        <FileText className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold text-stone-800">ยังไม่มีประวัติการเบิกจ่ายในระบบ</h3>
        <p className="text-xs text-stone-500">
          กรุณาทำรายการขอเบิกผ่านแท็บ &quot;๒. ใบขอเบิกวัสดุ (๗ ฝ่าย)&quot; เพื่อสร้างใบเสร็จทางการพิมพ์ฉบับแรก
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('issueform')}
          className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded transition cursor-pointer"
        >
          ไปที่แบบขอเบิกวัสดุ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#faf6ee] p-3.5 rounded-lg border border-stone-300 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('stockcard')}
            className="text-stone-600 hover:text-stone-900 text-xs font-bold flex items-center gap-1 bg-white px-2.5 py-1.5 rounded border border-stone-300 shadow-2xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            กลับหน้าบัตรสต็อก
          </button>
          {requisitions.length > 1 && (
            <select
              value={slip.reqNo}
              onChange={(e) => {
                const found = requisitions.find((r) => r.reqNo === e.target.value);
                if (found) setActiveSlip(found);
              }}
              className="bg-white border border-stone-300 text-xs font-bold rounded px-2.5 py-1.5 shadow-2xs cursor-pointer"
            >
              {requisitions.map((r) => (
                <option key={r.reqNo} value={r.reqNo}>
                  ใบเบิก: {r.reqNo} ({r.departmentName} - {r.date})
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded shadow-sm flex items-center gap-2 transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>พิมพ์ใบเบิกออกกระดาษ A4 (Print)</span>
        </button>
      </div>

      {/* Official A4 Paper Document Container */}
      <div className="paper-sheet max-w-4xl mx-auto p-8 md:p-12 rounded-lg border border-stone-300 shadow-md bg-white text-stone-900 font-sans text-xs leading-relaxed">
        {/* Document Header */}
        <div className="text-center space-y-1 pb-4 border-b-2 border-stone-800">
          <div className="text-sm font-bold tracking-wide">สำนักช่าง องค์การบริหารส่วนจังหวัด</div>
          <h1 className="text-lg font-extrabold text-stone-900 tracking-wider">
            ใบรับ - จ่ายวัสดุภายใน (MATERIAL ISSUE SLIP)
          </h1>
          <div className="text-[11px] text-stone-500 font-mono-ledger">
            เอกสารควบคุมภายใน • สำหรับใช้ประกอบการเบิกจ่ายและการจัดทำบัญชีคุมพัสดุ
          </div>
        </div>

        {/* Slip Meta Information */}
        <div className="grid grid-cols-2 gap-4 py-4 text-xs">
          <div className="space-y-1">
            <div>
              <span className="text-stone-500">หน่วยงานผู้เบิก:</span>{' '}
              <strong className="text-stone-900 font-bold">{slip.departmentName} ({slip.departmentCode})</strong>
            </div>
            <div>
              <span className="text-stone-500">ผู้ขอเบิก:</span>{' '}
              <span className="text-stone-800 font-medium">{slip.requesterName}</span>
            </div>
            <div>
              <span className="text-stone-500">วัตถุประสงค์:</span>{' '}
              <span className="text-stone-800 italic">{slip.purpose}</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div>
              <span className="text-stone-500">เลขที่ใบสั่งจ่าย:</span>{' '}
              <strong className="font-mono-ledger font-bold text-stone-900 text-sm">{slip.reqNo}</strong>
            </div>
            <div>
              <span className="text-stone-500">วันที่ตัดจ่าย:</span>{' '}
              <span className="font-mono-ledger font-bold text-stone-800">{slip.date}</span>
            </div>
            <div>
              <span className="text-stone-500">สถานะ:</span>{' '}
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                จ่ายวัสดุเรียบร้อยแล้ว
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-stone-400 rounded overflow-hidden my-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-stone-100 font-bold text-stone-800 border-b border-stone-400">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center font-mono-ledger">ลำดับ</th>
                <th className="py-2.5 px-3 w-32 font-mono-ledger text-center">รหัสวัสดุ (SKU)</th>
                <th className="py-2.5 px-4">รายการวัสดุที่จ่าย</th>
                <th className="py-2.5 px-3 w-28 text-center font-mono-ledger">จำนวนที่ขอเบิก</th>
                <th className="py-2.5 px-3 w-28 text-center font-mono-ledger bg-stone-200/50">จำนวนจ่ายจริง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {slip.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 text-center font-mono-ledger">{thaiNums[idx] || idx + 1}</td>
                  <td className="py-2.5 px-3 text-center font-mono-ledger font-bold text-stone-700">
                    {item.sku}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-stone-900">{item.name}</td>
                  <td className="py-2.5 px-3 text-center font-mono-ledger text-stone-600">
                    {item.requestedQty}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono-ledger font-bold text-stone-900 bg-stone-50">
                    {item.requestedQty}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-stone-400 bg-stone-100 font-bold">
              <tr>
                <td colSpan={4} className="py-2.5 px-4 text-right">
                  รวมจำนวนรายการจ่ายทั้งสิ้น:
                </td>
                <td className="py-2.5 px-3 text-center font-mono-ledger font-bold text-sm text-stone-900">
                  {slip.items.reduce((sum, i) => sum + i.requestedQty, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures Block (3 Parties) */}
        <div className="grid grid-cols-3 gap-6 pt-10 mt-6 text-center text-xs">
          <div className="space-y-12">
            <div className="text-stone-600">ลงชื่อ......................................................</div>
            <div>
              <div className="font-bold text-stone-900">({slip.requesterName})</div>
              <div className="text-stone-500 text-[11px] mt-0.5">ผู้ขอเบิก / ผู้รับมอบพัสดุ</div>
              <div className="text-stone-400 font-mono-ledger text-[10px] mt-1">วันที่ ..... / ..... / .......</div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="text-stone-600">ลงชื่อ......................................................</div>
            <div>
              <div className="font-bold text-stone-900">({slip.approverName || 'หัวหน้าฝ่าย / ผู้ควบคุมงาน'})</div>
              <div className="text-stone-500 text-[11px] mt-0.5">ผู้สั่งจ่าย / อนุมัติการเบิก</div>
              <div className="text-stone-400 font-mono-ledger text-[10px] mt-1">วันที่ ..... / ..... / .......</div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="text-stone-600">ลงชื่อ......................................................</div>
            <div>
              <div className="font-bold text-stone-900">({slip.fulfilledBy || 'เจ้าหน้าที่คลังพัสดุ'})</div>
              <div className="text-stone-500 text-[11px] mt-0.5">ผู้จ่ายพัสดุ / เจ้าหน้าที่คลัง</div>
              <div className="text-stone-400 font-mono-ledger text-[10px] mt-1">วันที่ {slip.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
