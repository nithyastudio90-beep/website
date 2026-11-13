# NITHYA STUDIO & VIDEO – OFFICIAL WEBSITE

> **Premier Luxury Wedding Photography & 4K Cinematography**  
> Karapattu, Uthangarai Taluk, Tamil Nadu – 635306, India.

---

## 1. Verified Official Business Information

| Field | Official Business Value |
| :--- | :--- |
| **Business Name** | **Nithya Studio & Video** |
| **Address** | 99, Karapattu Village and Post, Uthangarai Taluk, Karapattu, Tamil Nadu – 635306, India. |
| **Mobile / WhatsApp** | `+91 84891 28362` |
| **Email** | `nithyastudio90@gmail.com` |
| **Instagram** | [https://www.instagram.com/nithyastudiokpt/](https://www.instagram.com/nithyastudiokpt/) |
| **YouTube** | [https://www.youtube.com/@nithyastudiokpt](https://www.youtube.com/@nithyastudiokpt) |

---

## 2. Design System & Theme

- **Palette**: Premium Dark Cinematic (`#07080a`, `#0d0e12`, `#14161d`) with Warm Antique Gold accents (`#d4af37`, `#f5d77f`), and crisp typographic hierarchy.
- **Typography**:
  - Headings: `Cinzel` (Cinematic luxury serif)
  - Body & UI: `Plus Jakarta Sans` / `Inter`
- **Responsive Layout**: Mobile-first architecture with touch-friendly navigation, floating WhatsApp concierge, and zero horizontal overflow.

---

## 3. Website Pages & Architecture

1. **Home (`/`)**: Cinematic hero, featured services, studio story, portfolio gallery, YouTube video showcase, Instagram feed, customer testimonials, quick contact.
2. **About Us (`/about`)**: Studio heritage in Karapattu, artistic philosophy, traditional Tamil wedding mastery, heirloom album craftsmanship.
3. **Services (`/services`)**: Comprehensive showcase of all 9 official services:
   1. Wedding Photography
   2. Wedding Videography
   3. Pre-Wedding Photography
   4. Birthday Photography
   5. Baby Photography
   6. Photo Editing
   7. Passport Photos
   8. Photo Frames & Albums
   9. Drone Photography
4. **Portfolio / Gallery (`/portfolio`)**: Category-filtered image grid, full-screen lightbox preview with keyboard navigation, lazy loading.
5. **Wedding Photography (`/wedding-photography`)**: Dedicated page detailing sacred Tamil rituals (Nalangu, Janavasam, Vrutham, Kanyadanam, Mangalyadharanam, Saptapadi, Reception).
6. **Wedding Videography (`/wedding-videography`)**: 4K cinema cameras, motorized gimbals, multi-channel lavalier audio, drone aerials, teaser trailers.
7. **Pre-Wedding Photography (`/pre-wedding-photography`)**: Scenic couple shoots, outdoor location concepts across Tamil Nadu (Krishnagiri Dam, Yercaud, Karapattu hills).
8. **Online Booking Enquiry (`/booking`)**: Customer validation form with date picker, service selection, Supabase persistence, reference ID generation, and WhatsApp handoff.
9. **Contact Us (`/contact`)**: Official Karapattu address, Google Maps preview, direct call, WhatsApp, and contact messaging.
10. **Admin Login (`/admin/login`)**: Authenticated administrator login portal.
11. **Admin Dashboard (`/admin/dashboard`)**:
    - **Overview**: Statistics (Total, Pending, Confirmed, Completed enquiries).
    - **Booking Management**: Search, filter by status and service, status life-cycle updates, delete records, direct customer WhatsApp reply.
    - **Gallery Management**: Upload images, assign categories, toggle featured status, delete images.
    - **Service Management**: Edit descriptions, cover photos, enable/disable services.
    - **Studio Settings**: Edit address, phone, email, social links live across the site.
    - **YouTube Showcase**: Manage video links and embeds.

---

## 4. Technology Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6) with automatic scroll-to-top
- **Database / Backend**: Supabase (PostgreSQL 15, Row Level Security, Supabase Auth & Storage)
- **Offline / Resilient Fallback**: Integrated data layer operating seamlessly offline or in production with Supabase.

---

## 5. Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 6. Supabase Database Setup

1. Create a new project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Run the seed data script [`supabase/seed.sql`](supabase/seed.sql) to populate initial studio records.
5. In **Storage**, create a public bucket named `gallery`.
6. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

---

## 7. Default Admin Credentials

- **Admin Login URL**: `/admin/login`
- **Email**: `nithyastudio90@gmail.com`
- **Password**: `NithyaStudio@2026`

*(When connected to live Supabase, configure administrators via Supabase Auth & the `public.profiles` table).*

---

## 8. Deployment Instructions

### Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environmental variables: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Cloudflare SPA routing is pre-configured via `public/_redirects`.

### Vercel
1. Import repository to Vercel.
2. Framework Preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Vercel SPA routing is pre-configured via `vercel.json`.
