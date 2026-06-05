# Google Sheets form endpoints

Both forms on the site submit to a Google Apps Script web app, which appends each
submission as a row in a Google Sheet:

| Form                      | Page                | Env variable            |
| ------------------------- | ------------------- | ----------------------- |
| Talk to our team (Contact)| `src/pages/ContactPage.jsx` | `VITE_CONTACT_ENDPOINT` |
| Apply                     | `src/pages/ApplyPage.jsx`   | `VITE_APPLY_ENDPOINT`   |

The script source is in [`Code.gs`](./Code.gs). The same code works for both — just
deploy it once per sheet.

## Setup (do this once per form/sheet)

1. Create (or open) the Google Sheet that should collect the submissions.
2. In the Sheet: **Extensions → Apps Script**. This creates a project *bound* to
   that sheet (so `getActiveSpreadsheet()` works).
3. Delete the default `myFunction` code and paste the full contents of `Code.gs`.
4. Click **Save**.
5. **Deploy → New deployment**:
   - **Type:** Web app
   - **Description:** anything (e.g. "Contact form")
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← important, or the browser request is blocked
6. Click **Deploy**, authorize the script when prompted (choose your Google
   account → Advanced → "Go to … (unsafe)" → Allow). This is normal for your own
   script.
7. Copy the **Web app URL** — it ends in `/exec`.
8. Paste that URL into your env files for the matching variable:
   - `.env.local` (used by `npm run dev`)
   - your hosting provider's environment variables (used in production)

## Verify it works

- Open the `/exec` URL in a browser → you should see
  `{"status":"ok","message":"REACT form endpoint is live."}`.
- Submit the form on the site → a new row should appear in the sheet within a
  second or two, with a `timestamp` column plus one column per field.

## Important: re-deploy after editing the script

If you change `Code.gs` later, the existing `/exec` URL keeps running the OLD
code until you publish again. Use **Deploy → Manage deployments → (edit) →
Version: New version → Deploy**. This keeps the same URL — no env change needed.

## Common reasons data doesn't appear

- **"Who has access" not set to "Anyone"** → request rejected.
- **Edited the script but didn't deploy a new version** → still running old code.
- **`net::ERR_NAME_NOT_RESOLVED` in the browser console** → this is a DNS/network
  problem on the visitor's side (ad-blocker, VPN, offline), not the script. The
  endpoint itself is fine.
