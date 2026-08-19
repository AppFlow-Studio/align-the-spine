/* Align the Spine lead-delivery webhook for Google Apps Script.
 * Set ATS_WEBHOOK_SECRET and ATS_SPREADSHEET_ID as Script Properties.
 * Deploy as a web app that executes as the owner. Never put secrets in cells.
 */

const HEADERS = [
  "eventId",
  "leadId",
  "submittedAt",
  "formId",
  "formVersion",
  "status",
  "priority",
  "intent",
  "sourcePagePath",
  "firstName",
  "lastName",
  "phone",
  "email",
  "zip",
  "reason",
  "bestTime",
  "carAccident",
  "initialLandingPath",
  "latestLandingPath",
  "referrerHost",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "utmId",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "msclkid",
  "fbclid",
  "fbc",
  "fbp",
  "ttclid",
  "liFatId",
  "gaClientId",
  "gaSessionId",
  "gaSessionNumber",
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const timestamp = String(body.timestamp || "");
    const eventId = String(body.eventId || "");
    const payload = body.payload;
    const signature = String(body.signature || "");
    if (
      !/^\d{10}$/.test(timestamp) ||
      !eventId ||
      !payload ||
      payload.eventId !== eventId ||
      !signature
    )
      return json_({ ok: false });
    if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300)
      return json_({ ok: false }, 401);
    const secret = PropertiesService.getScriptProperties().getProperty("ATS_WEBHOOK_SECRET");
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty("ATS_SPREADSHEET_ID");
    if (!secret || !spreadsheetId) return json_({ ok: false });
    const signed = JSON.stringify({ timestamp: timestamp, eventId: eventId, payload: payload });
    const expected = Utilities.computeHmacSha256Signature(signed, secret || "")
      .map(function (byte) {
        return (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, "0");
      })
      .join("");
    if (!constantTimeEqual_(expected, signature)) return json_({ ok: false }, 401);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const book = SpreadsheetApp.openById(spreadsheetId);
      const events =
        book.getSheetByName("_delivery_events") || book.insertSheet("_delivery_events");
      events.hideSheet();
      if (events.createTextFinder(eventId).matchEntireCell(true).findNext())
        return json_({ ok: true, duplicate: true });
      const sheet = book.getSheetByName("Leads") || book.insertSheet("Leads");
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
      sheet.appendRow(
        HEADERS.map(function (key) {
          return safeCell_(payload[key]);
        }),
      );
      events.appendRow([eventId, new Date().toISOString()]);
      return json_({ ok: true, duplicate: false });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({ ok: false }, 500);
  }
}

function safeCell_(value) {
  const text =
    value == null
      ? ""
      : String(value)
          .replace(/[\r\n\t]+/g, " ")
          .slice(0, 1000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function constantTimeEqual_(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index++)
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
