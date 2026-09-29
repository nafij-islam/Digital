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

2. Configure environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
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
