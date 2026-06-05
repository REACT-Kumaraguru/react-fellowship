/**
 * REACT Fellowship — form-to-Sheet endpoint.
 *
 * Paste this into the Apps Script project that is bound to your Google Sheet
 * (open the Sheet → Extensions → Apps Script). The same code works for BOTH
 * the "Talk to our team" (Contact) form and the "Apply" form — deploy it once
 * per sheet/project. It writes every field the form sends into the first tab
 * and auto-creates column headers from the incoming field names.
 *
 * Form fields it will receive:
 *   Contact: fullName, email, whatsapp, phone, question
 *   Apply:   fullName, email, phone, track
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // avoid lost rows when two people submit at once

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ status: 'error', message: 'No data received' });
    }

    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Read existing header row (if any).
    var headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];

    if (headers.length === 0) {
      // First submission: create the header row.
      headers = ['timestamp'].concat(Object.keys(data));
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      // Add a column for any new field we haven't seen before.
      Object.keys(data).forEach(function (key) {
        if (headers.indexOf(key) === -1) {
          headers.push(key);
          sheet.getRange(1, headers.length).setValue(key);
        }
      });
    }

    // Build the row in header order.
    var row = headers.map(function (h) {
      if (h === 'timestamp') return new Date();
      return data[h] !== undefined && data[h] !== null ? data[h] : '';
    });
    sheet.appendRow(row);

    return json({ status: 'ok' });
  } catch (err) {
    return json({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you confirm the deployment is live by opening the /exec URL in a browser.
function doGet() {
  return json({ status: 'ok', message: 'REACT form endpoint is live.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
