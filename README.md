# 📦 ระบบบริหารคลังและขอเบิกพัสดุ สำนักช่าง (Stock Control & Requisition System)

เว็บแอปพลิเคชันบริหารคลังวัสดุ-พัสดุและจัดทำใบขอเบิกภายใน ออกแบบสไตล์ **สมุดบัญชีคุมพัสดุ (Paper & Stock Card Ledger Aesthetic)** รองรับการทำงานร่วมกับ **Google Sheets** ผ่าน **Google Apps Script (GAS) Web App**

---

## ✨ คุณสมบัติหลัก (Key Features)

1. **บัตรจ่ายพัสดุและคลังวัสดุ (Stock Card Ledger):**
   - แสดงรายการวัสดุแยกตาม ๕ หมวดหมู่หลัก (วัสดุคอมพิวเตอร์, ซองจดหมาย, วัสดุรวม, วัสดุสำนักงาน, วัสดุงานบ้าน)
   - แจ้งเตือนสถานะคงเหลือต่ำกว่าเกณฑ์ (Safety Stock)
   - ป้ายกำกับสต็อกสไตล์สมุดคลัง พร้อมปุ่มทางลัดขอเบิกได้ทันที

2. **แบบขอเบิกวัสดุภายใน (Internal Material Requisition Form):**
   - รองรับโครงสร้าง ๗ ฝ่าย/กลุ่มงาน ของสำนักช่าง
   - ระบุผู้ขอเบิก, วัตถุประสงค์, หัวหน้าฝ่ายผู้สั่งจ่าย (อนุมัติ), และเจ้าหน้าที่คลังผู้จ่ายพัสดุ
   - ตรวจสอบยอดคงเหลือแบบเรียลไทม์ ป้องกันการเบิกเกินจำนวนที่มีในคลัง

3. **ใบเบิกพัสดุขนาด A4 พร้อมสั่งพิมพ์ (Printable A4 Requisition Slip):**
   - หน้าตาแบบฟอร์มราชการมาตรฐาน พร้อมตราครุฑและช่องลงนาม ๓ ฝ่าย (ผู้ขอเบิก, ผู้สั่งจ่าย, ผู้จ่ายพัสดุ)
   - สั่งพิมพ์ (Ctrl+P) หรือบันทึกเป็น PDF ขนาด A4 ได้ทันทีโดยจัดหน้าพอดีกระดาษ 1 หน้า

4. **ตรวจรับพัสดุและสแกนบิลรับของ (Bill Scanner & Restock):**
   - บันทึกการรับเข้าพัสดุพร้อมราคาและชื่อร้านค้า/ผู้จัดจำหน่าย
   - รองรับ AI Vision ช่วยตรวจจับรายการจากใบเสร็จรับเงิน/ใบส่งของ

5. **เชื่อมต่อ Google Sheets ๒ ทาง (Two-Way Sync):**
   - เชื่อมต่อผ่าน Google Apps Script Web App โดยไม่ต้องใช้ Service Account Key
   - บันทึกรายการลงชีต `Items`, `Departments`, `Requisitions`, `Requisition_Items`, และ `Stock_Logs` อัตโนมัติ

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. กำหนดค่า Environment Variables
คัดลอกไฟล์ `.env.local.example` เป็น `.env.local`:
```bash
cp .env.local.example .env.local
```
กำหนดค่า URL ของ Google Apps Script Web App:
```env
NEXT_PUBLIC_GAS_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
GAS_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 3. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Sarabun & JetBrains Mono Fonts)
- **Icons:** Lucide React
- **Database/Storage:** Google Sheets API via Google Apps Script Web App + Local Cache Fallback
