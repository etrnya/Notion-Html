var HEADERS = ["id", "name", "status", "user", "note"];

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
      row[headers[j]] = data[i][j];
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
    { id: 'inst1', name: 'LC-MS/MS (新55)', status: 'online', user: '廖老師組-Willy', note: '正常運作中' },
    { id: 'inst2', name: 'LC-MS/MS (QTRAP2)', status: 'maintenance', user: 'Fred (維修廠商)', note: '7/22 預約保養更換針座' },
    { id: 'inst3', name: 'Orbitrap QE (質譜儀)', status: 'online', user: '項晴', note: '目前跑2%移動相' },
    { id: 'inst4', name: 'GC-MS/MS (農藥組)', status: 'online', user: '無人上機', note: '正常運作' },
    { id: 'inst5', name: 'Nitrogen Generator (氮氣機)', status: 'issue', user: '廠商維修中', note: '風扇震動過大待檢修' }
  ];
  
  for (var i = 0; i < defaultData.length; i++) {
    var item = defaultData[i];
    var row = [];
    for (var j = 0; j < HEADERS.length; j++) {
      row.push(item[HEADERS[j]]);
    }
    sheet.appendRow(row);
  }
  Logger.log("Default instruments setup completed.");
}
