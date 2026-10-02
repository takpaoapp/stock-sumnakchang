'use client';

import React from 'react';
import { StockProvider, useStock } from '@/lib/store';
import StockLedgerTab from '@/components/StockLedgerTab';
import RequisitionFormTab from '@/components/RequisitionFormTab';
import PrintableSlipTab from '@/components/PrintableSlipTab';
import BillScannerTab from '@/components/BillScannerTab';
import { BookOpen, ClipboardEdit, Printer, ScanLine, Building2 } from 'lucide-react';

function MainApp() {
  const { activeTab, setActiveTab } = useStock();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Top Header Bar */}
      <header className="no-print mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-stone-300 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center font-bold shadow-sm border border-stone-700 flex-shrink-0">
            <Building2 className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 tracking-wider flex items-center gap-1.5">
              <span>สำนักช่าง</span>
              <span className="w-1 h-1 rounded-full bg-stone-400" />
              <span className="text-stone-600">องค์การบริหารส่วนจังหวัด</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight leading-tight mt-0.5">
              ระบบควบคุมการเบิกจ่ายและตรวจรับวัสดุ (Paper & Stock Card Edition)
            </h1>
          </div>
        </div>

      </header>

      {/* Manila Folder Navigation Tabs */}
      <nav className="no-print flex space-x-1 sm:space-x-1.5 border-b border-[#d4c7b0] px-2 text-xs font-bold overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setActiveTab('stockcard')}
          className={`folder-tab px-3.5 sm:px-4 py-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'stockcard' ? 'active text-stone-900' : 'text-stone-700 hover:bg-[#dfd7c5]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-stone-700" />
          <span>๑. บัตรควบคุมวัสดุ (Stock Card)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('issueform')}
          className={`folder-tab px-3.5 sm:px-4 py-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'issueform' ? 'active text-stone-900' : 'text-stone-700 hover:bg-[#dfd7c5]'
          }`}
        >
          <ClipboardEdit className="w-3.5 h-3.5 text-stone-700" />
          <span>๒. แบบขอเบิกวัสดุ (๗ ฝ่าย)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slipview')}
          className={`folder-tab px-3.5 sm:px-4 py-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'slipview' ? 'active text-stone-900' : 'text-stone-700 hover:bg-[#dfd7c5]'
          }`}
        >
          <Printer className="w-3.5 h-3.5 text-stone-700" />
          <span>๓. ใบรับ-จ่ายพัสดุ (พิมพ์ A4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scanbill')}
          className={`folder-tab px-3.5 sm:px-4 py-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'scanbill' ? 'active text-emerald-950 font-extrabold' : 'text-stone-700 hover:bg-[#dfd7c5]'
          }`}
        >
          <ScanLine className="w-3.5 h-3.5 text-emerald-700" />
          <span>๔. ตรวจรับวัสดุจากบิลสแกน (AI)</span>
          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
            ใหม่
          </span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="paper-sheet p-4 sm:p-6 rounded-b-lg rounded-tr-lg border-t-0 min-h-[600px]">
        {activeTab === 'stockcard' && <StockLedgerTab />}
        {activeTab === 'issueform' && <RequisitionFormTab />}
        {activeTab === 'slipview' && <PrintableSlipTab />}
        {activeTab === 'scanbill' && <BillScannerTab />}
      </main>

      {/* Footer */}
      <footer className="no-print mt-6 text-center text-xs text-stone-500 space-y-1">
        <div>ระบบบริหารและเบิกจ่ายวัสดุ สำนักช่าง • ออกแบบและพัฒนาเพื่อความสะดวก รวดเร็ว โปร่งใส และประหยัดงบประมาณ</div>
        <div className="text-[10px] text-stone-400 font-mono-ledger">
          Next.js App Router • Tailwind CSS • Google Sheets API Ready • Zero Cloud Cost
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <StockProvider>
      <MainApp />
    </StockProvider>
  );
}
