// Define standard headers
var HEADERS = ["id", "title", "targetDate", "startDate"];

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    if (sheet.getLastColumn() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) {
        row[headers[j]] = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        row[headers[j]] = val;
      }
    }
    rows.push(row);
  }
  
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    
    if (!Array.isArray(payload)) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload must be an array" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    if (sheet.getLastColumn() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    for (var i = 0; i < payload.length; i++) {
      var item = payload[i];
      var rowData = [];
      for (var j = 0; j < headers.length; j++) {
        var val = item[headers[j]];
        rowData.push(val !== undefined && val !== null ? val.toString() : "");
      }
      sheet.appendRow(rowData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupDefaultData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  
  var defaultData = [
    {"id": "ms1", "title": "TFDA 實地查核 (東興實驗室)", "targetDate": "2026-07-20", "startDate": "2026-01-01"},
    {"id": "ms2", "title": "TFDA能力試驗 (食品中孔雀綠、結晶紫)", "targetDate": "2026-09-01", "startDate": "2026-06-01"},
    {"id": "ms3", "title": "內稽準備工作與報告整理", "targetDate": "2026-08-15", "startDate": "2026-05-15"}
  ];
  
  for (var i = 0; i < defaultData.length; i++) {
    var item = defaultData[i];
    var row = [];
    for (var j = 0; j < HEADERS.length; j++) {
      row.push(item[HEADERS[j]]);
    }
    sheet.appendRow(row);
  }
  Logger.log("Default milestones setup completed.");
}
