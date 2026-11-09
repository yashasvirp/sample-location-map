/**
 * Location Map backend (Google Apps Script, bound to the Google Sheet).
 *
 * Sheet columns (row 1 = headers):
 *   A Name | B Lat | C Lng | D Time | E Accuracy | F Source | G Device
 *
 * POST  (from index.html)            -> saves / updates one person's pin
 * GET   ?action=list                 -> returns all pins as JSON (for map.html, open to anyone)
 *
 * The Sheet itself can stay PRIVATE. Nobody needs direct access to it.
 */

function sheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);

    const lat = Number(d.lat);
    const lng = Number(d.lng);
    if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return json_({ ok: false, error: "Invalid coordinates" });
    }

    let name = String(d.name || "").replace(/[\r\n\t]+/g, " ").trim().slice(0, 60);
    if (/^[=+\-@]/.test(name)) name = "'" + name; // stop spreadsheet formula injection

    const acc = Math.max(0, Math.round(Number(d.acc) || 0));
    const source = d.source === "manual" ? "manual" : "gps";
    const device = String(d.device || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 48);
    const time = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    const sh = sheet_();
    const row = [name, lat, lng, time, acc, source, device];

    // One row per phone: if this device already submitted, update its row.
    let target = 0;
    const last = sh.getLastRow();
    if (device && last > 1) {
      const ids = sh.getRange(2, 7, last - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (ids[i][0] === device) { target = i + 2; break; }
      }
    }

    if (target) {
      if (!name) row[0] = sh.getRange(target, 1).getValue(); // keep earlier name
      sh.getRange(target, 1, 1, row.length).setValues([row]);
    } else {
      sh.appendRow(row);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== "list") return json_({ ok: true, status: "ready" });

  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, points: [] });

  const range = sh.getRange(2, 1, last - 1, 6);
  const vals = range.getValues();
  const shown = range.getDisplayValues(); // time as text, not a Date object

  const points = [];
  for (let i = 0; i < vals.length; i++) {
    const lat = Number(vals[i][1]);
    const lng = Number(vals[i][2]);
    if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) continue;
    points.push({
      name: String(vals[i][0] || ""),
      lat: lat,
      lng: lng,
      time: shown[i][3],
      acc: Number(vals[i][4]) || 0,
      source: vals[i][5] === "manual" ? "manual" : "gps"
    });
  }
  return json_({ ok: true, points: points });
}
