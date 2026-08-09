# Padmodaya Campus — Website

Official website for **Padmodaya Campus, Ghorahi-17, Dang, Nepal**  
A community campus affiliated to Tribhuvan University (TU) offering BBS and BSc (General) programs.

---

## 📂 What's Inside

```
padmodaya-campus/
├── index.html          ← Main website
├── css/
│   └── style.css       ← Website styles
├── js/
│   ├── data.js         ← Default content + storage helpers
│   └── app.js          ← Website logic (navigation, notices, popup)
├── admin/
│   ├── index.html      ← Admin dashboard (password-protected)
│   ├── admin.css       ← Admin panel styles
│   └── admin.js        ← Admin logic (CRUD, forms, backup)
└── README.md           ← This file
```

---

## 🚀 How to Use

### Option 1 — Open directly (simplest)
Just double-click `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).

### Option 2 — Run a local server (recommended)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Then open http://localhost:8000
```

### Option 3 — Deploy online (free)
Upload the entire folder to any static host:
- **Netlify** — drag & drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel** — `vercel deploy`
- **GitHub Pages** — push to a repo and enable Pages
- **Any web hosting** — upload via FTP to your `public_html` folder

---

## 🔐 Admin Dashboard

Access the admin panel at `admin/index.html` (or click the **Admin** button in the nav).

**Default password:** `padmodaya2082`

### To change the password:
Open `admin/admin.js`, find the line at the top:
```js
const ADMIN_PASSWORD = 'padmodaya2082';
```
Replace it with your own password.

### What you can manage:
- **📊 Overview** — Stats and quick actions
- **🔔 Notices** — Add, edit, delete, hide/show notices. Priority levels: Urgent / Important / Normal.
- **📄 Site Content** — Edit About, Mission, Vision, and Hero text
- **📞 Contact** — Update address, phone numbers, email, Facebook link
- **⚙️ Settings** — Backup, restore, or reset all data

---

## 💾 Data Storage

All content is stored in the browser's **localStorage** (client-side).  
This means:
- ✅ No server or database needed
- ✅ Fast, works offline once loaded
- ⚠️ Data is stored in the **admin's browser only** — if a visitor sees the site, they see the seed defaults unless synced

### To publish your changes to visitors:
1. Make edits in the admin dashboard
2. Go to **Settings → Export Data** to download a JSON backup
3. To push changes to the live site, you have two options:
   - **Simple**: Replace the `DEFAULT_DATA` object inside `js/data.js` with your exported content, then re-deploy the site
   - **Advanced**: Add a backend (Firebase, Supabase, or a simple PHP API) — contact your developer for this upgrade

### 🔄 Backup regularly
Use **Settings → Download Backup** every time you make major changes.

---

## 🎨 Notice Popup

The most important active notice automatically appears as a popup when someone opens the website.  
The popup shows:
- Urgent notices first
- Then Important, then Normal
- Sorted by date

Visitors can dismiss the popup — it won't show again in the same browser session.

---

## 🌐 Campus Info

- **Location:** Ghorahi-17, Chaughera, Dang, Lumbini Province, Nepal
- **Established:** 2013 AD (2070 BS)
- **Affiliation:** Tribhuvan University (TU)
- **Programs:** BBS (Bachelor of Business Studies), BSc General (Physical & Biological)
- **Phone:** 082-590754 · 9857863574 · 9847857046
- **Email:** padmodayacampus@gmail.com
- **Facebook:** https://www.facebook.com/profile.php?id=100063941974490

---

## 🛠️ Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks)
- Google Fonts (Inter)
- OpenStreetMap embed for the map
- No dependencies, no build step

---

## 📞 Support

For any issues or upgrades (adding a real backend, syncing changes to visitors, adding photo galleries, faculty pages, etc.), contact your web developer.

---

© Padmodaya Campus · Made with care for the students of Dang
