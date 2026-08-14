# LearnOps — System Architecture & Project Documentation

LearnOps is an Education Business Management System (EBMS) engineered for educational institutes, coaching centers, and academies. It provides an end-to-end web-based solution that streamlines student management, sales operations (Telesales CRM), homework tracking, teacher grading, guardian reporting, and administrative financial analytics.

---

## 1. System Architecture

LearnOps is built as a modular React Single-Page Application (SPA) leveraging Vite for ultra-fast builds, React Router v7 for multi-role navigation, Supabase for Backend-as-a-Service (BaaS) persistence, and a decoupled Service/Controller architecture for external communications.

```
                                  ┌──────────────────────────────────────────────┐
                                  │                 Browser SPA                  │
                                  │        (React 18 + React Router v7)          │
                                  └──────────────────────┬───────────────────────┘
                                                         │
     ┌───────────────────────────────────────────────────┼───────────────────────────────────────────────────┐
     │                                                   │                                                   │
┌────▼────────────────┐                        ┌─────────▼───────────┐                             ┌─────────▼──────────┐
│   Public Landing    │                        │ Role-Based Portals  │                             │ Bilingual Context  │
│  & Course Catalog   │                        │ (Admin, Telesales,  │                             │ (LanguageContext - │
│  ([App.tsx])        │                        │  Teacher, Guardian) │                             │   EN / BN Switch)  │
└─────────────────────┘                        └─────────┬───────────┘                             └────────────────────┘
                                                         │
                                    ┌────────────────────┴───────────────────┐
                                    │                                        │
                          ┌─────────▼──────────┐                  ┌──────────▼──────────┐
                          │ Services Layer     │                  │ BaaS Persistence    │
                          │ • WhatsApp Service │                  │ • Supabase Client   │
                          │ • Controller Hook  │                  │   ([supabase.ts])   │
                          │ • Security Check   │                  │ • Database Types    │
                          └────────────────────┘                  └─────────────────────┘
```

### Key Architectural Layers

1. **Frontend Presentation & Routing Layer**:
   * **Vite 6** + **React 18** + **React Router 7**.
   * Multi-role portal navigation serving 5 distinct audiences: Public Visitors, Admin, Sales/Telesales Representatives, Teachers, and Guardians.

2. **State & Localization Layer**:
   * Context-driven dynamic language switching via [LanguageContext.tsx](file:///f:/Github/LearnOps/src/app/context/LanguageContext.tsx) enabling seamless toggling between **English** and **Bengali (Bangla)**.

3. **Backend-as-a-Service (BaaS) & Data Models**:
   * Centralized Supabase client configured in [supabase.ts](file:///f:/Github/LearnOps/src/lib/supabase.ts).
   * Strongly typed domain entities: `Lead`, `UserProfile`, `TeacherAttendanceRecord`, `HomeworkGrade`, `GuardianReportCard`, `StaffMember`, `CourseExtraCost`, `DeliveryRecord`.

4. **Service, Controller & Notification Layer**:
   * Security-first notification architecture implemented in [whatsappNotificationService.ts](file:///f:/Github/LearnOps/src/services/whatsappNotificationService.ts) and [whatsappNotificationController.ts](file:///f:/Github/LearnOps/src/services/whatsappNotificationController.ts).
   * Verifies guardian-student ownership via [notificationRepository.ts](file:///f:/Github/LearnOps/src/services/notificationRepository.ts) before generating automated WhatsApp evaluation messages.

---

## 2. Project Design & Styling System

The user interface follows strict design guidelines detailed in [guidelines/Guidelines.md](file:///f:/Github/LearnOps/guidelines/Guidelines.md).

* **Stance**: Minimalist-premium SaaS with educational warmth tailored for Bangladeshi parents and business managers.
* **Color System**:
  * **Primary Accent**: Emerald Green (`#22C55E` / `#15803D`)
  * **Light Theme Ground**: `#FFFFFF` | **Light Cards**: `#F8FAFC`
  * **Dark Theme Ground**: `#0F172A` (Slate 900) | **Dark Cards**: `#1E293B` (Slate 800)
  * **Muted Text**: `#64748B` | **Border**: `rgba(0, 0, 0, 0.08)`
* **Typography Hierarchy**:
  * **Headings & Body**: Poppins (SemiBold 600 / Regular 400)
  * **Bengali Content**: Hind Siliguri (Regular 400 / SemiBold 600)
  * **Statistics/Metrics**: Poppins Bold for added visual emphasis
* **Component Tech Stack**:
  * **Tailwind CSS v4** + Radix UI Primitives (`@radix-ui/react-*`) + Lucide Icons (`lucide-react`)
  * **Motion** (`motion`) for smooth animations
  * **Recharts** (`recharts`) for administrative analytics and sales dashboard visualization

---

## 3. Project Directory Structure

```
LearnOps/
├── guidelines/
│   └── Guidelines.md                  # Design tokens, typography & color rules
├── src/
│   ├── app/                           # Core portal routing & layout components
│   │   ├── components/                # Navbar, ContactSection, TeachersSection, SuccessStories
│   │   ├── context/
│   │   │   └── LanguageContext.tsx    # Bilingual (EN/BN) state management
│   │   ├── guardian/                  # Guardian dashboard components & mock state
│   │   ├── AdminPage.tsx              # Admin route gateway
│   │   ├── App.tsx                    # Main app router & landing page
│   │   ├── CourseDetailPage.tsx       # Course curriculum & details page
│   │   ├── CourseListPage.tsx         # Course search & filter directory
│   │   ├── Dashboard.tsx              # Student / main dashboard
│   │   ├── GuardianPage.tsx           # Parent / Guardian dashboard page
│   │   ├── LoginPage.tsx              # Role-based login portal
│   │   ├── TeacherPage.tsx            # Teacher portal (homework & attendance)
│   │   └── TelesalesPage.tsx          # Telesales portal wrapper
│   ├── components/                    # Course details modal dialogs
│   │   ├── Course1DetailsModal.tsx
│   │   ├── Course2DetailsModal.tsx
│   │   ├── Course3DetailsModal.tsx
│   │   ├── Course4DetailsModal.tsx
│   │   └── Course5DetailsModal.tsx
│   ├── lib/
│   │   └── supabase.ts                # Supabase client & entity schemas
│   ├── pages/                         # Complete administrative & CRM pages
│   │   ├── Admin.tsx                  # Administrative control center & metrics
│   │   └── Employee.tsx               # Telesales CRM pipeline & call logging
│   ├── services/                      # Decoupled notification & business logic
│   │   ├── notificationRepository.ts  # Data access repository for security checks
│   │   ├── whatsappNotificationController.ts # Hook controller endpoint
│   │   └── whatsappNotificationService.ts    # WhatsApp notification generator
│   ├── styles/                        # CSS index, typography & Tailwind directives
│   └── main.tsx                       # Application entry point
├── .env                               # Environment variables (Supabase URL & Keys)
├── package.json                       # Dependencies & script configurations
├── README.md                          # Project introduction summary
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite build configuration
```

---

## 4. User Portals & Features Matrix

| Portal Role | Key Capabilities & Features | Primary Component |
| :--- | :--- | :--- |
| **Public Visitor** | Course exploration, course details modals, teacher profiles, success stories, bilingual toggle | [App.tsx](file:///f:/Github/LearnOps/src/app/App.tsx) |
| **Admin** | Admin authentication & session logout, sales revenue metrics, conversion tracking, staff management, cost breakdown, delivery logistics tracking | [Admin.tsx](file:///f:/Github/LearnOps/src/pages/Admin.tsx) |
| **Telesales / Sales CRM** | Lead status pipeline, call notes logging, payment confirmation, search & filtering | [Employee.tsx](file:///f:/Github/LearnOps/src/pages/Employee.tsx) |
| **Teacher** | Attendance marking, homework evaluation, score grading, feedback entry, WhatsApp notification dispatch | [TeacherPage.tsx](file:///f:/Github/LearnOps/src/app/TeacherPage.tsx) |
| **Guardian** | Student performance cards, handwriting/speed scores, attendance history, upcoming Zoom links, grade reports | [GuardianPage.tsx](file:///f:/Github/LearnOps/src/app/GuardianPage.tsx) |

---

## 5. Getting Started & Development Commands

### Prerequisites
* **Node.js**: `v18.x` or higher
* **Package Manager**: `npm` or `pnpm`

### Environment Setup
Ensure `.env` contains your Supabase configuration:
```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Commands
* **Start Development Server**:
  ```bash
  npm run dev
  ```
* **Build Production Bundle**:
  ```bash
  npm run build
  ```
