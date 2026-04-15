# CleanSnap App

A React Native (Expo) app for location-based, photo-verified hygiene issue reporting and resolution tracking, backed by Supabase.

---

## 🎨 Design System
| Color | Hex | Use |
|---|---|---|
| Green Primary | `#16A34A` | Buttons, active states |
| Green Light | `#DCFCE7` | Backgrounds, badges |
| Green Border | `#D1FAE5` | Card borders |
| Blue Accent | `#2563EB` | Links, location, secondary |
| Background | `#F0FDF4` | App background |
| White | `#FFFFFF` | Cards |

---

## ⚙️ Setup Instructions

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create Supabase project
1. Go to https://supabase.com → New Project
2. Copy your **Project URL** and **anon public key**
3. Open `src/config/supabase.js` and paste them:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### Step 3 — Run the SQL schema
1. In Supabase → SQL Editor
2. Paste the entire contents of `supabase_schema.sql`
3. Click **Run**

### Step 4 — Map tiles
The app uses OpenStreetMap tiles through `react-native-maps`, so no Google Maps API key is required.

### Step 5 — Run the app
```bash
npx expo start
```
Scan the QR code with **Expo Go** on your phone.

---

## 👑 Making an Admin Account
1. Register normally in the app
2. In Supabase → SQL Editor, run:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```
3. Log out and log back in → you'll land on the Admin Dashboard

---

## 📁 Project Structure
```
src/
 ├── config/         → Supabase client setup
 ├── navigation/     → Stack + Tab navigators
 ├── screens/
 │    ├── auth/      → Login, Register
 │    ├── user/      → ReportForm, MyReports, Map
 │    └── admin/     → AdminDashboard
 ├── components/     → InputField, Button, ReportCard
 ├── services/       → authService, reportService, storageService
 ├── hooks/          → useAuth, useLocation
 └── utils/          → validators
```

---

## 🔐 Security (RLS)
| Action | Who |
|---|---|
| Insert report | Authenticated user (own reports only) |
| Read own reports | User (own only) |
| Read all reports | Admin only |
| Update status | Admin only |
| Upload images | Any authenticated user |

---

## 📱 Testing Phases
| Phase | Tool | What to test |
|---|---|---|
| 1 | Expo Go | UI, navigation, forms |
| 2 | Expo Go | Auth, image pick, location |
| 3 | EAS Build | APK install, real device |

### Build APK
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## 📦 Key Dependencies
| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Backend (auth, DB, storage) |
| `expo-location` | GPS coordinates |
| `expo-image-picker` | Camera & gallery |
| `react-native-maps` | Map with OpenStreetMap tiles and markers |
| `@react-navigation/native` | Navigation |
| `@react-native-async-storage/async-storage` | Session persistence |

---

## 🚀 Scaling Roadmap
- [ ] Push notifications when report status changes
- [ ] Filter reports by radius (nearby issues)
- [ ] Admin analytics dashboard with charts
- [ ] Export reports to PDF
- [ ] Multi-language support (Telugu, Hindi)
