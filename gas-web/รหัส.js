/**
 * ระบบบริหารคลังและขอเบิกพัสดุ สำนักช่าง (Google Apps Script Web App Engine)
 * แฟ้มเซิร์ฟเวอร์สคริปต์ (Code.gs)
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action);
  
  if (action === 'getItems') {
    return jsonResponse(getItems());
  }
  if (action === 'init') {
    return jsonResponse(setupInitialSchema());
  }
  if (action === 'getDepartments') {
    return jsonResponse(getDepartments());
  }

  // แสดงผลหน้าเว็บแอปพลิเคชันจาก Index.html
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ระบบบริหารคลังและขอเบิกพัสดุ - สำนักช่าง')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var action = data.action;
    var result;

    if (action === 'fulfillRequisition') {
      result = fulfillRequisition(data.payload);
    } else if (action === 'restockFromBill') {
      result = restockFromBill(data.payload);
    } else if (action === 'init') {
      result = setupInitialSchema();
    } else {
      result = { error: 'Unknown action: ' + action };
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 1. ดึงรายการวัสดุทั้งหมด
function getItems() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Items');
  
  if (!sheet) {
    setupInitialSchema();
    sheet = ss.getSheetByName('Items');
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, items: [] };

  var items = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    items.push({
      id: 'item-' + i,
      sku: String(row[0]),
      name: String(row[1]),
      category: String(row[2]),
      minStock: Number(row[3]) || 0,
      currentStock: Number(row[4]) || 0,
      unitPrice: Number(row[5]) || 0,
      unit: String(row[6] || 'ชิ้น'),
      sourceNote: String(row[7] || '')
    });
  }

  return { success: true, items: items };
}

// 2. ดึงข้อมูล ๗ ฝ่าย สำนักช่าง
function getDepartments() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Departments');
  
  if (!sheet) {
    setupInitialSchema();
    sheet = ss.getSheetByName('Departments');
  }

  var data = sheet.getDataRange().getValues();
  var depts = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    depts.push({
      code: String(row[0]),
      name: String(row[1]),
      shortName: String(row[2] || row[1])
    });
  }

  return { success: true, departments: depts };
}

// 3. บันทึกการขอเบิกพัสดุและตัดสต็อก
function fulfillRequisition(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var itemsSheet = ss.getSheetByName('Items');
  var reqSheet = ss.getSheetByName('Requisitions');
  var reqItemsSheet = ss.getSheetByName('Requisition_Items');
  var logsSheet = ss.getSheetByName('Stock_Logs');

  if (!itemsSheet || !reqSheet) {
    setupInitialSchema();
    itemsSheet = ss.getSheetByName('Items');
    reqSheet = ss.getSheetByName('Requisitions');
    reqItemsSheet = ss.getSheetByName('Requisition_Items');
    logsSheet = ss.getSheetByName('Stock_Logs');
  }

  var now = new Date();
  var timestamp = Utilities.formatDate(now, 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss');
  var dateStr = Utilities.formatDate(now, 'Asia/Bangkok', 'dd/MM/yyyy');

  // ตรวจสอบหัวตาราง Requisitions
  var headers = reqSheet.getRange(1, 1, 1, Math.max(reqSheet.getLastColumn(), 1)).getValues()[0];
  var hasApproverCol = headers.some(function(h) { return String(h).indexOf('อนุมัติ') !== -1; });

  if (hasApproverCol) {
    reqSheet.appendRow([
      payload.reqNo,
      payload.date || dateStr,
      payload.departmentCode,
      payload.departmentName,
      payload.requesterName,
      payload.approverName || 'หัวหน้าฝ่าย / ผู้ควบคุมงาน',
      payload.purpose,
      'FULFILLED',
      payload.fulfilledBy || 'เจ้าหน้าที่คลังพัสดุ'
    ]);
  } else {
    // ปรับโครงสร้างเพิ่มคอลัมน์ให้อัตโนมัติถ้ายังเป็นตารางเก่า
    reqSheet.appendRow([
      payload.reqNo,
      payload.date || dateStr,
      payload.departmentCode,
      payload.departmentName,
      payload.requesterName + (payload.approverName ? ' (อนุมัติ: ' + payload.approverName + ')' : ''),
      payload.purpose,
      'FULFILLED',
      payload.fulfilledBy || 'เจ้าหน้าที่คลังพัสดุ'
    ]);
  }

  // ตัดสต็อกใน Items และบันทึก Requisition_Items & Stock_Logs
  var itemsData = itemsSheet.getDataRange().getValues();

  payload.items.forEach(function(rItem) {
    reqItemsSheet.appendRow([
      payload.reqNo,
      rItem.sku,
      rItem.name,
      rItem.requestedQty,
      rItem.requestedQty
    ]);

    for (var r = 1; r < itemsData.length; r++) {
      if (String(itemsData[r][0]) === String(rItem.sku)) {
        var currentStock = Number(itemsData[r][4]) || 0;
        var newStock = Math.max(0, currentStock - rItem.requestedQty);
        itemsSheet.getRange(r + 1, 5).setValue(newStock);

        logsSheet.appendRow([
          timestamp,
          rItem.sku,
          rItem.name,
          'OUT',
          rItem.requestedQty,
          newStock,
          payload.reqNo,
          payload.requesterName,
          'เบิกจ่ายให้ ' + payload.departmentName
        ]);
        break;
      }
    }
  });

  return { success: true, message: 'บันทึกจ่ายของและตัดสต็อกเรียบร้อยแล้ว' };
}

// 4. บันทึกรับเข้าพัสดุจากบิล
function restockFromBill(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var itemsSheet = ss.getSheetByName('Items');
  var logsSheet = ss.getSheetByName('Stock_Logs');

  if (!itemsSheet || !logsSheet) {
    setupInitialSchema();
    itemsSheet = ss.getSheetByName('Items');
    logsSheet = ss.getSheetByName('Stock_Logs');
  }

  var now = new Date();
  var timestamp = Utilities.formatDate(now, 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss');
  var itemsData = itemsSheet.getDataRange().getValues();

  var prefixMap = {
    'วัสดุคอมพิวเตอร์': 'COM',
    'ซองจดหมาย': 'ENV',
    'วัสดุรวม': 'GEN',
    'วัสดุสำนักงาน': 'OFF',
    'วัสดุงานบ้าน': 'HOU'
  };

  payload.items.forEach(function(scItem, idx) {
    var foundIndex = -1;
    for (var r = 1; r < itemsData.length; r++) {
      if (String(itemsData[r][1]).trim().toLowerCase() === String(scItem.name).trim().toLowerCase()) {
        foundIndex = r;
        break;
      }
    }

    if (foundIndex !== -1) {
      var currentStock = Number(itemsData[foundIndex][4]) || 0;
      var newStock = currentStock + scItem.qty;
      itemsSheet.getRange(foundIndex + 1, 5).setValue(newStock);
      if (scItem.price > 0) {
        itemsSheet.getRange(foundIndex + 1, 6).setValue(scItem.price);
      }

      logsSheet.appendRow([
        timestamp,
        itemsData[foundIndex][0],
        scItem.name,
        'IN',
        scItem.qty,
        newStock,
        payload.refNo,
        'เจ้าหน้าที่คลังพัสดุ',
        'รับเข้าจาก ' + (payload.supplier || 'บิลรับของ')
      ]);
    } else {
      var pfx = prefixMap[scItem.category] || 'MAT';
      var newSku = pfx + '-RCV-' + Utilities.formatString('%02d', itemsData.length + idx);
      
      itemsSheet.appendRow([
        newSku,
        scItem.name,
        scItem.category,
        2,
        scItem.qty,
        scItem.price || 0,
        'ชิ้น',
        'นำเข้าจากบิล ' + payload.refNo
      ]);

      logsSheet.appendRow([
        timestamp,
        newSku,
        scItem.name,
        'IN',
        scItem.qty,
        scItem.qty,
        payload.refNo,
        'เจ้าหน้าที่คลังพัสดุ',
        'ขึ้นทะเบียนใหม่จากบิล ' + payload.refNo
      ]);
    }
  });

  return { success: true, message: 'บันทึกตรวจรับวัสดุเข้าคลังเรียบร้อยแล้ว' };
}

// 5. สร้างฐานข้อมูลชีตอัตโนมัติ
function setupInitialSchema() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var itemsSheet = getOrCreateSheet(ss, 'Items');
  if (itemsSheet.getLastRow() === 0) {
    itemsSheet.appendRow(['รหัส SKU', 'ชื่อรายการวัสดุ', 'คลังจัดเก็บ', 'เกณฑ์ขั้นต่ำ', 'คงเหลือปัจจุบัน', 'ราคาต่อหน่วย', 'หน่วยนับ', 'หมายเหตุ']);
    itemsSheet.getRange('A1:H1').setFontWeight('bold').setBackground('#f5eedf');
    
    var initialItems = [
      ['COM-TNR-01', 'ตลับหมึก HP LaserJet Pro M404 (057H Black)', 'วัสดุคอมพิวเตอร์', 2, 5, 3450, 'ตลับ', ''],
      ['OFF-PPR-A4', 'กระดาษถ่ายเอกสาร A4 80 แกรม (Double A กล่อง 5 รีม)', 'วัสดุสำนักงาน', 10, 24, 580, 'กล่อง', ''],
      ['ENV-WHT-09', 'ซองจดหมายขาว มาตรฐาน 9/125 มีครุฑ (กล่อง 500 ซอง)', 'ซองจดหมาย', 3, 8, 240, 'กล่อง', ''],
      ['GEN-TAP-02', 'เทปกาว OPP ใส 2 นิ้ว x 100 หลา (แถว 6 ม้วน)', 'วัสดุรวม', 4, 1, 165, 'แถว', ''],
      ['HOU-BAG-30', 'ถุงขยะดำหนาพิเศษ 30 x 40 นิ้ว (แพ็ค 1 กก.)', 'วัสดุงานบ้าน', 5, 12, 65, 'แพ็ค', ''],
      ['OFF-FLD-01', 'แฟ้มสันกว้าง 3 นิ้ว 112F ปกดำ (กล่อง 12 เล่ม)', 'วัสดุสำนักงาน', 2, 9, 855, 'กล่อง', ''],
      ['COM-USB-64', 'แฟลชไดรฟ์ Kingston DataTraveler 64GB USB 3.2', 'วัสดุคอมพิวเตอร์', 3, 0, 220, 'อัน', ''],
      ['HOU-GLV-03', 'ถุงมือยางอนามัย ไซส์ M (กล่อง 100 ชิ้น)', 'วัสดุงานบ้าน', 2, 2, 190, 'กล่อง', '']
    ];
    initialItems.forEach(function(row) { itemsSheet.appendRow(row); });
  }

  var deptSheet = getOrCreateSheet(ss, 'Departments');
  if (deptSheet.getLastRow() === 0) {
    deptSheet.appendRow(['รหัสฝ่าย', 'ชื่อฝ่าย / กลุ่มงาน', 'ชื่อย่อ']);
    deptSheet.getRange('A1:C1').setFontWeight('bold').setBackground('#f5eedf');
    var depts = [
      ['DES', 'ฝ่ายออกแบบ', 'ออกแบบ'],
      ['SUR', 'ฝ่ายสำรวจ', 'สำรวจ'],
      ['ARC', 'กลุ่มงานสถาปัตยกรรม', 'สถาปัตย์'],
      ['CON', 'ฝ่ายก่อสร้างและซ่อมบำรุง', 'ก่อสร้าง'],
      ['RRD', 'กลุ่มงานทางหลวงชนบท', 'ทางหลวง'],
      ['MCH', 'ฝ่ายเครื่องจักรกล', 'เครื่องจักร'],
      ['ADM', 'ฝ่ายบริหารงานทั่วไป', 'บริหาร']
    ];
    depts.forEach(function(row) { deptSheet.appendRow(row); });
  }

  var reqSheet = getOrCreateSheet(ss, 'Requisitions');
  if (reqSheet.getLastRow() === 0) {
    reqSheet.appendRow(['เลขที่ใบเบิก', 'วันที่', 'รหัสฝ่าย', 'ชื่อฝ่าย', 'ผู้ขอเบิก', 'ผู้อนุมัติ/ผู้สั่งจ่าย', 'วัตถุประสงค์', 'สถานะ', 'ผู้จ่ายพัสดุ']);
    reqSheet.getRange('A1:I1').setFontWeight('bold').setBackground('#f5eedf');
  }

  var reqItemsSheet = getOrCreateSheet(ss, 'Requisition_Items');
  if (reqItemsSheet.getLastRow() === 0) {
    reqItemsSheet.appendRow(['เลขที่ใบเบิก', 'รหัส SKU', 'ชื่อรายการวัสดุ', 'จำนวนที่ขอเบิก', 'จำนวนจ่ายจริง']);
    reqItemsSheet.getRange('A1:E1').setFontWeight('bold').setBackground('#f5eedf');
  }

  var logsSheet = getOrCreateSheet(ss, 'Stock_Logs');
  if (logsSheet.getLastRow() === 0) {
    logsSheet.appendRow(['วันเวลาที่ทำรายการ', 'รหัส SKU', 'ชื่อรายการวัสดุ', 'ประเภท', 'จำนวน', 'ยอดคงเหลือหลังทำรายการ', 'เลขที่อ้างอิง', 'ผู้บันทึก', 'หมายเหตุ']);
    logsSheet.getRange('A1:I1').setFontWeight('bold').setBackground('#f5eedf');
  }

  return { success: true, message: 'สร้างโครงสร้างตารางสำเร็จ' };
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}
