/**
 * Google Apps Script (GAS) Web App for Milestone Countdown Sync
 * 
 * Paste this script in the Extensions > Apps Script editor of your Google Sheet:
 * https://docs.google.com/spreadsheets/d/14KAfUTW1q5ITpndMOZ5V2wYY4qooncwnyf5yZNzA6sc/edit?gid=0#gid=0
 * 
 * Deploy as a "Web App", configure "Execute as: Me" and "Who has access: Anyone".
 */

// Define standard headers
var HEADERS = ["id", "title", "targetDate", "startDate"];

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  // If sheet is empty, return empty list
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
      // Format dates nicely as YYYY-MM-DD
      var val = data[i][j];
      if (val instanceof Date) {
        // Handle Apps Script date formatting
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
    
    // Clear all rows except headers
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    // Set headers if empty
    if (sheet.getLastColumn() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Append rows
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
