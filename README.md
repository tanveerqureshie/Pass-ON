# Pass ON — Modern College Student Marketplace
**Pass It On. Save More.**

Pass ON is a responsive, production-minded web application engineered for college students across Delhi engineering colleges (MAIT, MSIT, BVCOE, BPIT, GTBIT, ADGITM, VIPS-TC, HMR, GTB4CEC) to buy, sell, borrow, donate, or exchange academic materials, lab equipment, electronics, and hostel essentials.

Built with an authentic **Modern Brutalist UI** (bold typography, high-contrast borders, electric lime `#CCFF00`, cyber yellow `#FFE600`, sharp cards, and tactile shadows), it connects seniors and juniors with direct offline campus handovers and click-to-chat WhatsApp actions — completely free of payment gateway fees or commissions.

---

## Key Features

1. **Four Flexible Campus Listing Types**:
   - **Sell**: Students set their own fair price.
   - **Free (₹0)**: Generous seniors passing items to juniors without charging, highlighted with prominent high-contrast badges.
   - **Borrow / Lend**: Temporary equipment loans (calculators, drafters, multimeters) with duration and return conditions.
   - **Exchange**: Barter offer specifying acceptable swap items.

2. **Direct WhatsApp Click-to-Chat**:
   - Official WhatsApp API link (`wa.me`) with phone normalization (adds +91 for Indian mobile numbers, removes leading zeros and spaces).
   - Contextual pre-filled message encoding:
     `"Hi! I found your listing for the [Title] on Pass ON ([College]). Is it still available?"`
   - Privacy protection: phone numbers are never exposed in public HTML.
   - Disabled states for sold/unavailable listings.

3. **Engineering College Directory & Dual Browsing Modes**:
   - **My Campus**: Isolates listings to the student's selected campus for fast lunch-break handovers at canteens, libraries, or main gates.
   - **Explore All Colleges**: Cross-college marketplace to discover resources from other Delhi institutions.
   - Pre-configured directory with verified branches for MAIT, MSIT, BVCOE, BPIT, GTBIT, ADGITM, VIPS-TC, HMR, and GTB4CEC.

4. **Medical & Law Expansion (Coming Soon)**:
   - Preview section with disabled preview cards and badges for MBBS/BDS (VMMC, MAMC) and Law (USLLS, CLC) essentials.

5. **Student Portal**:
   - Dedicated dashboard with active listings, sold/donated counters, inquiry logs, and saved bookmarks.
   - Quick status management (Mark as Sold, Donated, Lent, or Unavailable).

6. **Admin Control Center**:
   - System overview metrics (active listings, freebies, paid items, pending complaints).
   - College & branch catalog editor.
   - Listing moderation (hide, restore, remove flagged items).
   - User account management (suspend, reactivate, delegate moderator/admin roles).
   - Immutable audit log tracking administrative actions.

---

## Technology Stack

- **Framework**: Next.js 14+ (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS with custom Modern Brutalist design tokens
- **Icons**: Lucide React
- **Backend & Database**: Node.js & MongoDB (native connection pooling)
- **Media & Storage**: Cloudinary CDN
- **Deployment**: Render Web Service (`render.yaml`) / Vercel
- **State & Resilience**: Context API with local persistence and seamless offline/demo preview fallback

---

## Deploying on Render

This project is pre-configured for 1-click deployment on [Render](https://render.com):

1. **Push your code to GitHub / GitLab**.
2. **In Render Dashboard**:
   - Click **New +** -> **Blueprint** (or **Web Service**).
   - Connect your repository (`Pass-ON`).
   - Render will automatically detect [`render.yaml`](file:///home/tanveer/Documents/Projects/Pass%20ON/render.yaml) and configure:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start` (listening on dynamic `$PORT`)
     - **Node Version**: 20 LTS (from [`.nvmrc`](file:///home/tanveer/Documents/Projects/Pass%20ON/.nvmrc))
3. **Set Environment Variables in Render**:
   - `MONGODB_URI`: `mongodb+srv://mrtanveerqureshie_db_user:mrtanveerqureshie_db_user@cluster0.tz8jdmn.mongodb.net/PassON?retryWrites=true&w=majority`
   - `CLOUDINARY_API_KEY`: `948987984819147`
   - `CLOUDINARY_API_SECRET`: `WXH3MV1nQpb0TWrNHD5n-rilze8`
   - `CLOUDINARY_CLOUD_NAME`: `<your_cloud_name>`
   - `NEXT_PUBLIC_APP_NAME`: `Pass ON`
   - `NEXT_PUBLIC_APP_TAGLINE`: `Pass It On. Save More.`
4. Click **Apply / Deploy**!

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000

# 4. Build for production
npm run build
npm start
```

---

## Required Routes Matrix

| Route | Purpose |
|---|---|
| `/` | Landing page with hero, statistics ticker, category grid, freebies spotlight, and college previews |
| `/explore` | Full marketplace with search, branch/category/condition filters, and "My College" mode |
| `/categories` | Categorized directory with item counts, icons, and subcategory tags |
| `/colleges` | Choose Your College directory with institution details and active campus selection |
| `/college/[slug]` | Dedicated campus marketplace hub (e.g. `/college/mait`, `/college/msit`) |
| `/item/[id]` | Listing details page with photo gallery, specs, direct WhatsApp button, and report modal |
| `/sell` | Listing creation form supporting Sell, Free, Borrow, and Exchange workflows |
| `/dashboard` | Student dashboard overview with metrics, activity, and shortcuts |
| `/dashboard/listings` | Manage posted listings, toggle availability, mark sold or donated |
| `/dashboard/saved` | Bookmarked listings with quick WhatsApp contact |
| `/dashboard/requests` | Incoming and outgoing campus inquiries inbox |
| `/profile` | Student preferences, primary campus selector, and WhatsApp number settings |
| `/auth/sign-in` | Student sign in with Supabase Auth and 1-click evaluation demo modes |
| `/auth/sign-up` | Student registration with college onboarding and WhatsApp number capture |
| `/admin` | Admin dashboard overview with key platform metrics and immutable audit log |
| `/admin/colleges` | College & branch catalog editor with active status toggles |
| `/admin/listings` | Content moderation console to review, hide, restore, or delete listings |
| `/admin/users` | Student account management with suspension and role assignment |
# Pass-ON
