# Digital Products & Subscriptions Marketplace - Frontend

Production-ready digital products marketplace frontend built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, TanStack Query, and Firebase.

## Key Features

- **Storefront & Catalog:** Dynamic product plans, categories, search, filtering, and responsive showcases.
- **Dynamic Hero Section:** Admin-configurable hero image with Cloudinary integration and responsive layout.
- **Manual Payment Flow:** Seamless bKash and Nagad payment submission with transaction ID verification.
- **Delivery Vault (`/account/orders/[id]/access`):** Secure customer access page with masked credentials (email, password, license keys, activation links) and one-click copy.
- **Custom Activation Process Guide:** Structured, step-by-step activation instructions with semantic alert notices (`INFO`, `SUCCESS`, `WARNING`, `DANGER`), buttons, and links.
- **Admin Dashboard:** Order lifecycle management, delivery access configurator, visual activation guide builder, and homepage hero settings.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS
- **Animation:** GSAP, `@gsap/react`
- **State & Data Fetching:** TanStack Query, Axios
- **Form & Validation:** React Hook Form, Zod
- **Authentication:** Firebase Client SDK (Google Sign-In)
- **Icons:** Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (`.env.local` - optional):
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME="DigiVault Marketplace"
   NEXT_PUBLIC_DEFAULT_CURRENCY="BDT"
   NEXT_PUBLIC_CURRENCY_SYMBOL="৳"
   NEXT_PUBLIC_WHATSAPP_NUMBER="+8801700000000"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run start
   ```
