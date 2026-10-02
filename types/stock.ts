export type WarehouseCategory = 
  | 'ซองจดหมาย'
  | 'วัสดุรวม'
  | 'วัสดุสำนักงาน'
  | 'วัสดุงานบ้าน'
  | 'วัสดุคอมพิวเตอร์';

export interface Department {
  code: string;
  name: string;
  shortName: string;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: WarehouseCategory;
  minStock: number;
  currentStock: number;
  unitPrice: number;
  unit?: string;
  lastUpdated?: string;
  sourceNote?: string;
}

export interface RequisitionItem {
  sku: string;
  name: string;
  requestedQty: number;
  issuedQty?: number;
  currentStock?: number;
}

export interface Requisition {
  reqNo: string;
  date: string;
  departmentCode: string;
  departmentName: string;
  requesterName: string;
  approverName?: string;
  purpose: string;
  items: RequisitionItem[];
  status: 'PENDING' | 'FULFILLED' | 'REJECTED';
  fulfilledAt?: string;
  fulfilledBy?: string;
  notes?: string;
}

export interface StockLog {
  id: string;
  timestamp: string;
  sku: string;
  itemName: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  qty: number;
  balanceAfter: number;
  refNo: string;
  actor: string;
  note?: string;
}

export interface ScannedBillItem {
  id: string;
  name: string;
  category: WarehouseCategory;
  qty: number;
  price: number;
  total: number;
  isHandwritten?: boolean;
  isManual?: boolean;
}

export interface ScannedBill {
  refNo: string;
  supplier: string;
  date: string;
  targetWarehouse: WarehouseCategory;
  items: ScannedBillItem[];
  hasHandwriting?: boolean;
  handwrittenNote?: string;
  handwrittenSignature?: string;
}
