'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StockItem, Requisition, StockLog, Department, WarehouseCategory } from '@/types/stock';
import { INITIAL_STOCK_ITEMS, INITIAL_DEPARTMENTS } from './initialData';
import { fetchItemsFromGAS, postFulfillToGAS, postRestockToGAS } from './gasClient';

interface StockContextType {
  items: StockItem[];
  departments: Department[];
  requisitions: Requisition[];
  stockLogs: StockLog[];
  activeTab: 'stockcard' | 'issueform' | 'slipview' | 'scanbill';
  setActiveTab: (tab: 'stockcard' | 'issueform' | 'slipview' | 'scanbill') => void;
  activeSlip: Requisition | null;
  setActiveSlip: (slip: Requisition | null) => void;
  quickIssueSku: string | null;
  setQuickIssueSku: (sku: string | null) => void;
  fulfillRequisition: (req: Omit<Requisition, 'reqNo' | 'date' | 'status'>) => Requisition;
  restockFromBill: (
    items: Array<{ name: string; category: WarehouseCategory; qty: number; price: number }>,
    refNo: string,
    supplier: string
  ) => void;
  refreshFromGoogleSheets?: () => Promise<void>;
  isLoading: boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ITEMS: 'inw_stock_items',
  REQUISITIONS: 'inw_stock_requisitions',
  LOGS: 'inw_stock_logs',
};

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [activeTab, setActiveTab] = useState<'stockcard' | 'issueform' | 'slipview' | 'scanbill'>('stockcard');
  const [activeSlip, setActiveSlip] = useState<Requisition | null>(null);
  const [quickIssueSku, setQuickIssueSku] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from localStorage on mount (demo mode)
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (savedItems) setItems(JSON.parse(savedItems));

      const savedReqs = localStorage.getItem(STORAGE_KEYS.REQUISITIONS);
      if (savedReqs) {
        const parsed = JSON.parse(savedReqs);
        setRequisitions(parsed);
        if (parsed.length > 0 && !activeSlip) {
          setActiveSlip(parsed[0]);
        }
      }

      const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (savedLogs) setStockLogs(JSON.parse(savedLogs));

      // Attempt to sync from Google Apps Script Web App
      fetchItemsFromGAS().then(gasItems => {
        if (gasItems && gasItems.length > 0) {
          setItems(gasItems);
          try {
            localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(gasItems));
          } catch (e) {}
        }
      });
    } catch (e) {
      console.error('Failed to load local storage:', e);
    } finally {
      setIsLoading(false);
    }
  }, [activeSlip]);

  // Save to localStorage whenever items/reqs change
  const saveItems = (newItems: StockItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const saveRequisitions = (newReqs: Requisition[]) => {
    setRequisitions(newReqs);
    try {
      localStorage.setItem(STORAGE_KEYS.REQUISITIONS, JSON.stringify(newReqs));
    } catch (e) {
      console.error(e);
    }
  };

  const saveLogs = (newLogs: StockLog[]) => {
    setStockLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(newLogs));
    } catch (e) {
      console.error(e);
    }
  };

  // Fulfill a Requisition (Deduct Stock & Create Slip)
  const fulfillRequisition = (reqData: Omit<Requisition, 'reqNo' | 'date' | 'status'>): Requisition => {
    const now = new Date();
    const thaiYear = (now.getFullYear() + 543).toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const seq = String(requisitions.length + 1).padStart(3, '0');
    const reqNo = `REQ-${thaiYear}${month}-${seq}`;
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${month}/${thaiYear}`;

    const newReq: Requisition = {
      ...reqData,
      reqNo,
      date: dateStr,
      status: 'FULFILLED',
      fulfilledAt: now.toISOString(),
      fulfilledBy: reqData.fulfilledBy || 'นายสมบัติ คลังพัสดุ (นายช่างโยธาชำนาญงาน)',
      approverName: reqData.approverName || 'หัวหน้าฝ่าย / ผู้ควบคุมงาน',
    };

    // Deduct stock and write logs
    const updatedItems = [...items];
    const newLogs: StockLog[] = [...stockLogs];

    newReq.items.forEach(reqItem => {
      const idx = updatedItems.findIndex(i => i.sku === reqItem.sku);
      if (idx !== -1) {
        const item = updatedItems[idx];
        const newStock = Math.max(0, item.currentStock - reqItem.requestedQty);
        updatedItems[idx] = { ...item, currentStock: newStock };

        newLogs.unshift({
          id: `log-${Date.now()}-${reqItem.sku}`,
          timestamp: new Date().toLocaleString('th-TH'),
          sku: reqItem.sku,
          itemName: reqItem.name,
          type: 'OUT',
          qty: reqItem.requestedQty,
          balanceAfter: newStock,
          refNo: reqNo,
          actor: reqData.requesterName,
          note: `เบิกจ่ายให้ ${reqData.departmentName}`
        });
      }
    });

    saveItems(updatedItems);
    saveRequisitions([newReq, ...requisitions]);
    saveLogs(newLogs);
    setActiveSlip(newReq);
    setActiveTab('slipview');

    // Post to Google Apps Script Web App
    postFulfillToGAS(newReq);

    return newReq;
  };

  // Restock items from Bill Scan
  const restockFromBill = (
    scannedItems: Array<{ name: string; category: WarehouseCategory; qty: number; price: number }>,
    refNo: string,
    supplier: string
  ) => {
    const updatedItems = [...items];
    const newLogs: StockLog[] = [...stockLogs];

    const prefixMap: Record<WarehouseCategory, string> = {
      'วัสดุคอมพิวเตอร์': 'COM',
      'ซองจดหมาย': 'ENV',
      'วัสดุรวม': 'GEN',
      'วัสดุสำนักงาน': 'OFF',
      'วัสดุงานบ้าน': 'HOU'
    };

    scannedItems.forEach((sc, idx) => {
      if (sc.qty <= 0) return;

      // Check if item already exists by exact name
      const existingIdx = updatedItems.findIndex(i => i.name.toLowerCase() === sc.name.toLowerCase());

      if (existingIdx !== -1) {
        const item = updatedItems[existingIdx];
        const newStock = item.currentStock + sc.qty;
        updatedItems[existingIdx] = {
          ...item,
          currentStock: newStock,
          unitPrice: sc.price > 0 ? sc.price : item.unitPrice,
          sourceNote: `รับเข้าจากบิล ${refNo} (+${sc.qty})`
        };

        newLogs.unshift({
          id: `log-${Date.now()}-${idx}`,
          timestamp: new Date().toLocaleString('th-TH'),
          sku: item.sku,
          itemName: item.name,
          type: 'IN',
          qty: sc.qty,
          balanceAfter: newStock,
          refNo: refNo,
          actor: 'เจ้าหน้าที่ตรวจรับพัสดุ',
          note: `รับเข้าจาก ${supplier}`
        });
      } else {
        // Create new item
        const pfx = prefixMap[sc.category] || 'MAT';
        const newSku = `${pfx}-RCV-${String(updatedItems.length + 1).padStart(2, '0')}`;
        const newItem: StockItem = {
          id: `item-${Date.now()}-${idx}`,
          sku: newSku,
          name: sc.name,
          category: sc.category,
          minStock: 2,
          currentStock: sc.qty,
          unitPrice: sc.price,
          unit: 'ชิ้น',
          sourceNote: `นำเข้าจากบิล ${refNo} (${supplier})`
        };
        updatedItems.push(newItem);

        newLogs.unshift({
          id: `log-${Date.now()}-${idx}`,
          timestamp: new Date().toLocaleString('th-TH'),
          sku: newSku,
          itemName: sc.name,
          type: 'IN',
          qty: sc.qty,
          balanceAfter: sc.qty,
          refNo: refNo,
          actor: 'เจ้าหน้าที่ตรวจรับพัสดุ',
          note: `ขึ้นทะเบียนใหม่จากบิล ${refNo}`
        });
      }
    });

    saveItems(updatedItems);
    saveLogs(newLogs);
    setActiveTab('stockcard');

    // Post to Google Apps Script Web App
    postRestockToGAS({
      items: scannedItems,
      refNo,
      supplier
    });
  };

  return (
    <StockContext.Provider
      value={{
        items,
        departments,
        requisitions,
        stockLogs,
        activeTab,
        setActiveTab,
        activeSlip,
        setActiveSlip,
        quickIssueSku,
        setQuickIssueSku,
        fulfillRequisition,
        restockFromBill,
        isLoading
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
