'use client';

import React, { useState, useEffect } from 'react';
import { useStock } from '@/lib/store';
import { WarehouseCategory } from '@/types/stock';
import { Search, FolderKanban, AlertCircle, ArrowUpRight } from 'lucide-react';

const WAREHOUSE_LIST: WarehouseCategory[] = [
  'ซองจดหมาย',
  'วัสดุรวม',
  'วัสดุสำนักงาน',
  'วัสดุงานบ้าน',
  'วัสดุคอมพิวเตอร์',
];

export default function StockLedgerTab() {
  const { items, setActiveTab, setQuickIssueSku } = useStock();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = items.filter(i => i.currentStock <= i.minStock).length;

  const handleQuickIssue = (sku: string) => {
    setQuickIssueSku(sku);
    setActiveTab('issueform');
  };

  return (
    <div className="space-y-4">
      {/* Header Summary & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#faf6ee] p-3.5 rounded-lg border border-stone-300 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-100 flex items-center justify-center font-bold shadow-xs">
            <FolderKanban className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              ทะเบียนบัตรควบคุมวัสดุ (Stock Card Ledger)
            </h2>
            <div className="text-xs text-stone-600 mt-0.5">
              สำนักช่าง • ระบบบริหารคลัง ๕ หมวดหมู่วัสดุ
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs font-mono-ledger bg-white/80 px-3.5 py-1.5 rounded border border-stone-200">
          <div>
            <span className="text-stone-500">ทั้งหมด: </span>
            <span className="font-bold text-stone-900">{items.length} รายการ</span>
          </div>
          <div className="w-px h-3.5 bg-stone-300" />
          <div>
            <span className="text-stone-500">ต่ำกว่าเกณฑ์: </span>
            <span className={`font-bold ${lowStockCount > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
              {lowStockCount} รายการ
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fdfcf9] p-3 rounded-lg border border-stone-300 shadow-2xs">
        <div className="flex items-center gap-2">
          <label htmlFor="catSelect" className="text-xs font-bold text-stone-700 whitespace-nowrap">
            เลือกคลังวัสดุ:
          </label>
          <select
            id="catSelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-stone-300 text-xs font-semibold rounded px-3 py-1.5 focus:ring-1 focus:ring-stone-500 cursor-pointer shadow-2xs"
          >
            <option value="all">-- แสดงทุกคลัง (๕ คลัง) --</option>
            {WAREHOUSE_LIST.map((wh) => (
              <option key={wh} value={wh}>
                คลัง: {wh}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box with Shortcut Tooltip */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
          <input
            id="searchInput"
            type="text"
            placeholder="ค้นหาชื่อวัสดุ หรือ รหัส SKU... (กด / เพื่อค้นหา)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fbf9f4] hover:bg-white focus:bg-white text-xs pl-8 pr-8 py-1.5 border border-stone-300 rounded shadow-2xs focus:ring-1 focus:ring-stone-500 transition"
          />
          <kbd className="absolute right-2 top-2 text-[10px] font-mono-ledger bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded border border-stone-300">
            /
          </kbd>
        </div>
      </div>

      {/* Stock Card Table */}
      <div className="border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left stock-card-table border-collapse text-xs">
            <thead>
              <tr>
                <th className="py-2.5 px-3 w-28 text-center font-mono-ledger">รหัส SKU</th>
                <th className="py-2.5 px-4">ชื่อรายการวัสดุ</th>
                <th className="py-2.5 px-3 w-32 text-center">คลังจัดเก็บ</th>
                <th className="py-2.5 px-3 w-20 text-center font-mono-ledger">เกณฑ์ขั้นต่ำ</th>
                <th className="py-2.5 px-3 w-24 text-center font-mono-ledger bg-[#f0e7d5]">คงเหลือ</th>
                <th className="py-2.5 px-3 w-28 text-center">สถานะสต็อก</th>
                <th className="py-2.5 px-3 w-20 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-sans">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400 italic">
                    ไม่พบรายการวัสดุที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isOutOfStock = item.currentStock === 0;
                  const isLow = !isOutOfStock && item.currentStock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-[#fbf7ee]/90 transition">
                      <td className="py-2.5 px-3 text-center font-mono-ledger font-bold text-stone-900">
                        {item.sku}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">{item.name}</div>
                        {item.sourceNote && (
                          <div className="text-[11px] text-stone-500 italic mt-0.5">
                            {item.sourceNote}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-stone-800 bg-[#faf6ee]">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono-ledger text-stone-500">
                        {item.minStock}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center font-mono-ledger font-bold text-sm ${
                          isOutOfStock
                            ? 'text-red-700 bg-red-50/50'
                            : isLow
                            ? 'text-amber-800 bg-amber-50/50'
                            : 'text-emerald-800 bg-emerald-50/30'
                        }`}
                      >
                        {item.currentStock} {item.unit || 'ชิ้น'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isOutOfStock ? (
                          <span className="stamp-red">ของหมด</span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" />
                            ใกล้หมด
                          </span>
                        ) : (
                          <span className="stamp-green">มีพร้อมจ่าย</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleQuickIssue(item.sku)}
                          disabled={isOutOfStock}
                          className={`text-xs font-bold inline-flex items-center gap-1 ${
                            isOutOfStock
                              ? 'text-stone-300 cursor-not-allowed'
                              : 'text-stone-800 hover:text-blue-800 underline'
                          }`}
                        >
                          <span>ขอเบิก</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-[#faf6ee] p-2.5 border-t border-stone-300 text-xs text-stone-600 flex justify-between items-center font-mono-ledger">
          <span>แสดง {filteredItems.length} จากทั้งหมด {items.length} รายการ</span>
          <span className="text-[11px] text-stone-500 font-sans">* คลิก &quot;ขอเบิก&quot; เพื่อดึงรายการไปยังฟอร์มเบิกของฝ่ายทันที</span>
        </div>
      </div>
    </div>
  );
}
