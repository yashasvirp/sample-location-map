# 📍 Live Location Sharing Map

Share location via a link, save it to Google Sheets, and view all pins on a live map.

**Live Demo:**
- Share Page: `https://YOUR-USERNAME.github.io/location-map/`
- Map Page: `https://YOUR-USERNAME.github.io/location-map/map.html`

**What it saves:**
`Name | Lat | Lon | Time | Accuracy`

---

## 1. Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) > Blank spreadsheet
2. Rename it to `Location Tracker`
3. In Row 1, add headers exactly:
   ```
   A1: Name | B1: Lat | C1: Lng | D1: Time | E1: Accuracy
   ```
4. Click **Share > Anyone with link > Viewer > Done**

**Get your Sheet ID:**

From your sheet URL:
```
https://docs.google.com/spreadsheets/d/ 1AbCdefGhIjKlMnOpQrStUvWxYz /edit
```
Copy the ID between `/d/` and `/edit`.

Your CSV link will be:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/export?format=csv
```

---

## 2. Apps Script - Backend

1. In your Sheet: **Extensions > Apps Script**
2. Delete everything in `Code.gs` and paste:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (e.parameter.lat) {
    var time = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([e.parameter.name, e.parameter.lat, e.parameter.lng, time, e.parameter.acc]);
    return ContentService.createTextOutput("OK");
  }
  return ContentService.createTextOutput("Ready");
}
```

3. Click **Save**
4. Click **Deploy > New deployment**
5. Type: **Web app**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy > Authorize > Allow**
9. Copy the Web app URL:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   This is your `SCRIPT_URL`.

> If you change code later: Deploy > Manage deployments > Edit > New version > Deploy

---

## 3. Project Files

```
location-map/
├── index.html   # Share Page
├── map.html     # Map Page
└── README.md    # This file
```

### `index.html` - Share Page

In `index.html`, replace only this one line with your Web app URL from Step 2:

```javascript
const SCRIPT_URL = "YOUR_SCRIPT_URL_HERE";
```

### `map.html` - Map Page

In `map.html`, replace only this one line with your CSV link from Step 1:

```javascript
const CSV_URL = "YOUR_CSV_URL_HERE";
```

Pin popup will show:

> **Ravi**
> Lat: 17.385234
> Lon: 78.486712
> Accuracy: 18 meters
> Time: 2026-11-06 19:52:10

---

## 4. Deploy to GitHub Pages

1. Go to [github.com](https://github.com) > **New repository**
2. Name: `location-map`
3. Visibility: **Public**
4. Click **Create repository**
5. Click **uploading an existing file** > Upload `index.html`, `map.html`, `README.md`
6. Click **Commit changes**
7. Go to **Settings > Pages**
8. Source: **Deploy from a branch**
9. Branch: **main** / **/ (root)** > **Save**
10. Wait 1 minute. Your site is live at:
    ```
    https://YOUR-USERNAME.github.io/location-map/
    ```

**Your Links:**
- Share Link: `https://YOUR-USERNAME.github.io/location-map/`
- Map Link: `https://YOUR-USERNAME.github.io/location-map/map.html`

**To update later:**
- Go to repo > Click file > Pencil icon > Edit > Commit changes
- GitHub Pages auto-updates in ~30 seconds. No zip, no re-upload.

---

## 5. Test

1. Open Share link on **phone** (not laptop - laptop GPS is 1000m+ off)
2. Enter name > Allow Location > Share
3. Check Sheet - new row should appear
4. Open Map link - Pin should appear. Tap pin to see Name, Lat, Lon, Accuracy, Time.

---

## Troubleshooting

| Problem | Fix |
| :--- | :--- |
| No pin on map | You forgot to replace `YOUR_CSV_URL_HERE` in `map.html` |
| Sheet not updating | Apps Script not deployed as New Version, or `SCRIPT_URL` wrong in `index.html` |
| Time breaks map | Must use `yyyy-MM-dd HH:mm:ss` format, delete old rows with comma in date |
| Location 1km off | Tested on laptop. Test on phone with GPS on. |
| GitHub Pages 404 | Wait 1 min, check repo is Public, branch is `main`, file is in root |

---

## Tech Stack

- Frontend: HTML + Leaflet.js (OpenStreetMap)
- Backend: Google Apps Script
- Database: Google Sheets
- Hosting: GitHub Pages (Free Forever)

## License

Free to use.
