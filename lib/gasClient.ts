import { StockItem, Requisition, WarehouseCategory } from '@/types/stock';

export const getGasWebAppUrl = () => {
  return process.env.NEXT_PUBLIC_GAS_WEBAPP_URL || '';
};

// 1. Fetch items from Google Apps Script Web App
export async function fetchItemsFromGAS(): Promise<StockItem[] | null> {
  const url = getGasWebAppUrl();
  if (!url) return null;

  try {
    const res = await fetch(`${url}?action=getItems`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.items)) {
      return data.items;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch from GAS Web App, falling back to local cache:', err);
    return null;
  }
}

// 2. Post Requisition to Google Apps Script Web App
export async function postFulfillToGAS(req: Requisition): Promise<boolean> {
  const url = getGasWebAppUrl();
  if (!url) return false;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // GAS webapp standard redirect
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'fulfillRequisition',
        payload: req
      })
    });
    return true;
  } catch (err) {
    console.error('Failed to post requisition to GAS:', err);
    return false;
  }
}

// 3. Post Restock to Google Apps Script Web App
export async function postRestockToGAS(payload: {
  items: Array<{ name: string; category: WarehouseCategory; qty: number; price: number }>;
  refNo: string;
  supplier: string;
}): Promise<boolean> {
  const url = getGasWebAppUrl();
  if (!url) return false;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'restockFromBill',
        payload
      })
    });
    return true;
  } catch (err) {
    console.error('Failed to post restock to GAS:', err);
    return false;
  }
}
