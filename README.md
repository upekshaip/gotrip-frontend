# GoTrip Frontend

The frontend for the GoTrip full-stack travel platform, built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **DaisyUI v5**. Authentication is managed through **NextAuth v5** with a JWT-based session strategy.

---

## Team Members

| Student ID | Student Name |
|---|---|
| 27292 | GUI Perera |
| 29015 | DJI Senarathna |
| 27601 | WKR Pinsiri |
| 27578 | MJM Shaahid |
| 27654 | GHM Bandara |
| 27958 | MCA Jayasingha |
| 29287 | MMM Shakeef |
| 28930 | AJM Naveeth |

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [1. Setting Up the Development Environment](#1-setting-up-the-development-environment)
- [2. Environment Variables](#2-environment-variables)
- [3. Authentication](#3-authentication)
- [4. Application Routes](#4-application-routes)
  - [Public Routes](#public-routes)
  - [Traveller Dashboard](#traveller-dashboard)
  - [Service Provider Dashboard](#service-provider-dashboard)
  - [Admin Dashboard](#admin-dashboard)
  - [Common Dashboard Pages](#common-dashboard-pages)
- [5. Key Modules](#5-key-modules)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React framework with App Router and SSR |
| React | 19.2.3 | UI component library |
| Tailwind CSS | v4.2.1 | Utility-first CSS framework |
| DaisyUI | v5.5.19 | Tailwind CSS component library |
| NextAuth | v5.0.0-beta | JWT session management and authentication |
| Google Maps API | `@react-google-maps/api` | Interactive map integration |
| Lucide React | v0.575.0 | Icon library |
| React Hot Toast | v2.6.0 | Toast notification system |
| CryptoJS | v4.2.0 | Client-side data utilities |
| js-cookie | v3.0.5 | Cookie management |

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/             # Protected dashboard area (requires auth)
│   │   ├── (common)/            # Shared pages across all roles
│   │   │   ├── info/
│   │   │   ├── notifications/
│   │   │   └── profile/
│   │   ├── admin/               # Admin-only pages
│   │   ├── service-provider/    # Service provider pages
│   │   └── traveller/           # Traveller pages
│   ├── (outside)/               # Public pages (no auth required)
│   │   ├── (auth)/              # Login, signup, welcome
│   │   └── (others)/            # About, contact, FAQ, policy
│   ├── actions/                 # Server actions (auth, JWT)
│   └── api/
│       └── auth/                # NextAuth route handlers + token refresh
├── components/                  # Reusable UI components by feature
│   ├── auth/
│   ├── dashboard/
│   ├── experience/
│   ├── experience-management/
│   ├── hotel-management/
│   ├── restaurant-management/
│   ├── transport-management/
│   ├── transport/
│   ├── maps/
│   ├── reusable/
│   └── toggles/
├── config/
│   ├── config.js                # App-wide config (name, API URL, etc.)
│   ├── routes.js                # Centralised route definitions
│   └── experienceConstants.js   # Experience categories and types
├── hooks/                       # Custom React hooks and API helpers
│   ├── UseFetch.js              # Central fetch utility with auto token refresh
│   ├── UseUserInfo.js
│   ├── UseTheme.js
│   ├── BookingApi.js
│   ├── ExperienceApi.js
│   ├── ReviewApi.js
│   └── TransportApi.js
├── utils/                       # Pure utility functions
│   ├── dateFormatter.js
│   ├── priceFormatter.js
│   ├── stringUtils.js
│   └── validationUtils.js
├── css/
│   └── globals.css
└── auth.js                      # NextAuth configuration
```

---

## 1. Setting Up the Development Environment

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18.x or later |
| npm | 9.x or later |
| Git | Latest |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/upekshaip/gotrip-frontend.git
cd gotrip-frontend
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Configure Environment Variables

Create a `.env.local` file in the root of the project and fill in your values. See the [Environment Variables](#2-environment-variables) section for all required keys.

---

### Step 4 — Run the Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**.

> **Note:** The GoTrip backend must be running first. See the [backend README](https://github.com/upekshaip/gotrip-backend) for setup instructions.

---

### Other Useful Commands

```bash
npm run build    # Build for production
npm run start    # Start the production build
npm run lint     # Run ESLint
```

---

## 2. Environment Variables

Create a `.env.local` file at the root of the project:

```env
# Used to encrypt/decrypt sensitive data on the client side (do not change)
NEXT_PUBLIC_DATA_ENCRYPTION_KEY=23a9e05553082c42a167b71e6a88d8b41eabb8e65eb4ddbeace5a33e84cd2afb

# Base URL of the GoTrip backend API Gateway
NEXT_PUBLIC_API_URL=http://localhost:8080

# Base URL of this frontend app (used for internal API calls e.g. token refresh)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# NextAuth secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google Maps API Key (for map previews on hotel/experience/restaurant pages)
NEXT_PUBLIC_GOOGLE_MAP_API=your_google_maps_api_key_here
```

---

## 3. Authentication

Authentication is handled by **NextAuth v5** using the `Credentials` provider with a **JWT session strategy**.

### Flow

```
1. User submits login or signup form
2. Server action calls POST /auth/login (or /auth/signup) on the backend
3. Backend returns { user, accessToken, refreshToken }
4. refreshToken  →  stored as an HttpOnly cookie (jwt)
5. accessToken   →  stored as a readable cookie (accessToken) + in NextAuth session
6. All API calls →  Authorization: Bearer <accessToken>
7. On 401        →  UseFetch.js calls POST /api/auth/refresh automatically
8. Refresh route →  reads the jwt cookie, calls backend, gets new accessToken
9. New token     →  updated in session and cookies
10. Retry        →  original request is retried automatically
```

### Role Detection

After login, the user role is determined from the JWT payload returned by the backend:

| Condition | Role assigned |
|---|---|
| `user.admin === true` | `admin` |
| `user.serviceProvider === true` | `serviceProvider` |
| Default | `traveller` |

The dashboard layout reads `session.user.role` and renders the appropriate sidebar and pages for that role.

---

## 4. Application Routes

All routes are defined centrally in `src/config/routes.js`.

### Public Routes

Accessible without authentication under the `(outside)` route group.

| Route | Description |
|---|---|
| `/` | Landing / home page |
| `/login` | Login page |
| `/signup` | Signup page |
| `/welcome` | Profile completion after first signup |
| `/about` | About page |
| `/contact` | Contact page |
| `/faq` | FAQ page |
| `/policy` | Terms and conditions |
| `/privacy` | Privacy policy |

---

### Traveller Dashboard

Protected routes under `(dashboard)/traveller/`. Requires a completed user profile.

| Route | Description |
|---|---|
| `/traveller` | Traveller dashboard overview |
| `/traveller/hotels` | Browse all active hotel listings |
| `/traveller/hotels/[hotelId]` | Hotel detail and booking page |
| `/traveller/restaurants` | Browse all active restaurant listings |
| `/traveller/restaurants/[restaurantId]` | Restaurant detail and booking page |
| `/traveller/transport` | Browse all active transport listings |
| `/traveller/transport/[transportId]` | Transport detail and booking page |
| `/traveller/experiences` | Browse all available experiences |
| `/traveller/experiences/[id]` | Experience detail, reviews, and booking |
| `/traveller/my-bookings` | View and manage all bookings |
| `/traveller/my-reviews` | View and manage submitted reviews |
| `/traveller/payments` | Payment history and status |
| `/traveller/apply-for-service-provider` | Upgrade account to Service Provider |

---

### Service Provider Dashboard

Protected routes under `(dashboard)/service-provider/`. Requires `SERVICE_PROVIDER` role.

| Route | Description |
|---|---|
| `/service-provider` | Provider dashboard overview |
| `/service-provider/hotel-management` | View and manage own hotel listings |
| `/service-provider/hotel-management/create` | Create a new hotel listing |
| `/service-provider/hotel-management/edit/[hotelId]` | Edit an existing hotel listing |
| `/service-provider/hotel-management/review/[hotelId]` | View hotel reviews |
| `/service-provider/restaurant-management` | View and manage own restaurant listings |
| `/service-provider/restaurant-management/create` | Create a new restaurant listing |
| `/service-provider/restaurant-management/edit/[restaurantId]` | Edit a restaurant listing |
| `/service-provider/transport-management` | View and manage own transport listings |
| `/service-provider/experiences` | View and manage own experience listings |
| `/service-provider/experiences/create` | Create a new experience listing |
| `/service-provider/experiences/edit/[id]` | Edit an existing experience listing |
| `/service-provider/booking-requests` | View and respond to incoming booking requests |
| `/service-provider/reviews` | View customer reviews for own listings |

---

### Admin Dashboard

Protected routes under `(dashboard)/admin/`. Requires `ADMIN` role.

| Route | Description |
|---|---|
| `/admin` | Admin dashboard overview |
| `/admin/traveller-management` | View, manage, and edit all traveller accounts |
| `/admin/service-provider-management` | Approve and manage service provider accounts |
| `/admin/hotel-management` | Review, approve, edit, and remove hotel listings |
| `/admin/restaurant-management` | Review, approve, edit, and remove restaurant listings |
| `/admin/transport-management` | Review, approve, edit, and remove transport listings |
| `/admin/experience-management` | Moderate and manage all experience listings |

---

### Common Dashboard Pages

Shared pages accessible to all authenticated users regardless of role.

| Route | Description |
|---|---|
| `/profile` | View and update user profile |
| `/notifications` | View notifications |
| `/info` | Platform information page |

---

## 5. Key Modules

### `UseFetch.js` — Central API Utility

All API calls go through `src/hooks/UseFetch.js`. It handles attaching the auth header, auto-refreshing the token on 401, and retrying the original request.

```js
import UseFetch from "@/hooks/UseFetch";

// GET request
const hotels = await UseFetch("GET", "/hotel-service", null);

// POST request with body
const booking = await UseFetch("POST", "/hotel-booking/request", {
  hotelId: 1,
  personCount: 2,
  // ...
});
```

On a `401` response it automatically calls `POST /api/auth/refresh`, updates the token in session and cookies, then retries. If the refresh also fails, the user is logged out.

---

### `src/auth.js` — NextAuth Configuration

- **Provider:** `Credentials` — accepts the pre-built user object from the backend login response
- **Session strategy:** `jwt`
- **Callbacks:** `jwt` and `session` embed user data and access token into every session
- **In-place updates:** `unstable_update` is used to update the access token or profile data in the session without requiring re-login
- **Sign-in page:** `/login`

---

### `src/config/routes.js` — Centralised Route Registry

All routes are defined as objects with metadata used by the sidebar and navigation:

```js
{
  name: "Hotels",
  url: "/traveller/hotels",
  icon: <Building2 />,
  menu: true,      // show in sidebar
  order: 2,        // position in sidebar
  group: 1,        // sidebar group/section
}
```

The sidebar reads `menu: true` routes and renders them grouped and ordered for the current user's role.

---

### Theme System

Supports **light** and **dark** themes via DaisyUI. The selected theme is persisted in `localStorage` and applied before the page renders using an inline script in `app/layout.js` to prevent flash of unstyled content. The `ThemeToggle` component at `src/components/toggles/ThemeToggle.js` handles switching at runtime.

---

### Google Maps Integration

The `MapSelector` component (`src/components/maps/MapSelector.js`) and `ExperienceMapPreview` component use `@react-google-maps/api` to display interactive location maps on hotel, restaurant, and experience detail and creation pages. Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`.
