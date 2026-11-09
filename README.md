# 📍 Group Location Map

Send one link in a WhatsApp group. Each member taps **Allow location**, checks their pin, optionally adds their name, and taps **Save my location**. That's 2 taps on the page. Their pin then appears on a map of India. Works on phones and laptops.

- **Share page:** `https://yashasvirp.github.io/sample-location-map/`
- **Map page:** `https://yashasvirp.github.io/sample-location-map/map.html` (anyone with the link can see all pins)

## How it works for a member

1. They tap the link in WhatsApp and see a short explanation with an **Allow location** button.
2. They tap **Allow location**, then **Allow** in the phone's pop-up. If no pop-up appears, a **Try again** link shows up next to the button. If they allowed location before, the button says **Share my location** and no pop-up appears.
3. A map shows their pin. If it's off, they drag it, tap the map, or search their area.
4. Optionally, they type their name in the box under the map.
5. They tap **Save my location**. The location and name are saved together in one row. Nothing is saved before this, and the name stays empty if they left it blank.

If location is blocked (for example, Safari Websites is set to "Never" on iPhone, or Location Services is off on a Mac or Windows laptop), the page shows step-by-step instructions for their device. It also lets them search for their area and drop a pin by hand, so nobody gets stuck.

If they open the link again on the same phone or browser and save again, their existing row is updated. It does not add a second pin. If they leave the name blank that time, their earlier name is kept.

## Files

| File | What it is |
| :--- | :--- |
| `index.html` | Share page that members open |
| `map.html` | Map of all pins |
| `apps-script/Code.gs` | Backend. Paste it into Google Apps Script |
| `india_boundary.min.geojson` | India border (LGD via BharAtlas), simplified to about 115 KB for phones |
| `india_boundary.geojson` | Original full-detail border (7.5 MB), kept as the source |

## Setup

### 1. Google Sheet

Put these headers in row 1:

```
Name | Lat | Lng | Time | Accuracy | Source | Device
```

- **Source** is `gps` (from the device) or `manual` (placed or moved by hand on the map).
- **Device** is a random ID created by the member's browser, used only to update their row if they save again. It isn't a phone number or anything personal.

Rows from the old version still work. Columns F and G just stay empty for them.

**Stop sharing the Sheet.** Under **Share → General access**, choose **Restricted**. The map now gets pins through Apps Script, so the Sheet does not need to be public.

### 2. Apps Script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Replace `Code.gs` with the contents of [`apps-script/Code.gs`](apps-script/Code.gs). Click **Save**.
3. Go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
   This keeps the same `/exec` URL, so `index.html` and `map.html` don't need to change.

   For a first-time setup, use **Deploy → New deployment → Web app** instead, with **Execute as: Me** and **Who has access: Anyone**. Then put the `/exec` URL into `SCRIPT_URL` in both HTML files.

### 3. GitHub Pages

Push to `main`. Pages serves the files from the repo root.

## Testing

**On a laptop:** browsers only allow location on `https://` or `localhost`, so double-clicking the HTML file won't work. Instead run:

```bash
cd sample-location-map
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. This saves to the real Sheet, so delete test rows afterwards.

- To pretend to be somewhere else, open Chrome DevTools (F12) → ⋮ → **More tools → Sensors → Location**.
- To see the page as a first-time visitor, use an incognito window, or reset the site's location permission.
- Each browser counts as one person. Use an incognito window to add a second test pin.
- Laptop locations come from Wi-Fi and can be a few hundred metres off. The page warns about this.

**On a phone:** push to GitHub, then send yourself the github.io link on WhatsApp.

**The map:** open `map.html`. It refreshes every 60 seconds.
- Blue pins come from GPS. Orange pins were placed or moved by hand.
- Tap a pin to see the name, latitude, longitude, accuracy and time. A GPS pin also shows its accuracy circle.

## Privacy

Pins are exact GPS coordinates, which are often someone's home, and **anyone with the `map.html` link can see every pin and name**. Tell the group this before they share.

The share page promises members three things: "We only ask once", "You'll check the pin before it's saved", and "Used only for this group map, nothing else". If the data will be used for anything else (for example analysis, a paper or a presentation), change that last line in `index.html` to say so.

## Tech

Leaflet + OpenStreetMap tiles, Google Apps Script + Sheets, GitHub Pages. Place search on the share page uses OpenStreetMap Nominatim.
