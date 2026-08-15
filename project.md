# LearnOps — System Architecture & Project Documentation

LearnOps is an Education Business Management System (EBMS) engineered for educational institutes, coaching centers, and academies. It provides an end-to-end web-based solution that streamlines student management, storefront course catalog exploration, sales operations (Telesales CRM), payment confirmation, homework tracking, teacher grading, guardian reporting, live Zoom class management, and administrative financial analytics.

---

## 1. System Architecture

LearnOps is built as a modular React Single-Page Application (SPA) leveraging Vite for ultra-fast builds, React Router v7 for multi-role navigation, Supabase for Backend-as-a-Service (BaaS) database persistence, and an optimistic `localStorage` event-driven synchronization layer for real-time cross-tab updates and offline resilience.

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
                                     ┌───────────────────┴───────────────────┐
                                     │                                       │
                           ┌─────────▼──────────┐                  ┌──────────▼──────────┐
                           │   Services Layer   │                  │ BaaS Persistence    │
                           │ • staffStore       │                  │ • Supabase Client   │
                           │ • leadStore        │                  │   ([supabase.ts])   │
                           │ • salesStore       │                  │ • PostgreSQL Tables │
                           │ • batchStore       │                  │ • Database Schemas  │
                           │ • attendanceStore  │                  └─────────────────────┘
                           │ • homeworkStore    │
                           │ • WhatsApp Service │
                           └────────────────────┘
```

### Key Architectural Layers

1. **Frontend Presentation & Routing Layer**:
   * **Vite 6** + **React 18** + **React Router 7**.
   * Multi-role portal navigation serving 5 distinct audiences: Public Visitors, Admin, Sales/Telesales Representatives, Teachers, and Guardians.

2. **State, Synchronization & Localization Layer**:
   * Context-driven dynamic language switching via [LanguageContext.tsx](file:///f:/Github/LearnOps/src/app/context/LanguageContext.tsx) enabling seamless toggling between **English** and **Bengali (Bangla)**.
   * **Hybrid Persistence Strategy**: Every data action performs an asynchronous REST API call (`POST`, `PATCH`, `UPSERT`, `DELETE`, `SELECT`) against Supabase endpoints, paired with custom `localStorage` event buses (`learnops_*_updated`) for real-time cross-tab synchronization and offline resilience.

3. **Backend-as-a-Service (BaaS) & Data Models**:
   * Centralized Supabase client configured in [supabase.ts](file:///f:/Github/LearnOps/src/lib/supabase.ts).
   * Strongly typed domain entities: `Lead`, `UserProfile`, `TeacherAttendanceRecord`, `HomeworkGrade`, `GuardianReportCard`, `StaffMember`, `CourseExtraCost`, `DeliveryRecord`, `PaymentRecord`, `AttendanceRecord`, `HomeworkAssignment`.

4. **Service & Store Layer**:
   * Decoupled state and API stores in `src/services/`:
     * [`staffStore.ts`](file:///f:/Github/LearnOps/src/services/staffStore.ts) — Staff account provisioning and auth sync.
     * [`leadStore.ts`](file:///f:/Github/LearnOps/src/services/leadStore.ts) — Storefront lead capture to CRM pipeline.
     * [`salesStore.ts`](file:///f:/Github/LearnOps/src/services/salesStore.ts) — Payment confirmation and revenue tracking.
     * [`batchStore.ts`](file:///f:/Github/LearnOps/src/services/batchStore.ts) — Course batch catalog, roster enrollment, and live Zoom link sync.
     * [`attendanceStore.ts`](file:///f:/Github/LearnOps/src/services/attendanceStore.ts) — Student attendance logs and percentage metrics.
     * [`homeworkStore.ts`](file:///f:/Github/LearnOps/src/services/homeworkStore.ts) — Homework assignments and teacher grading/evaluation.
     * [`courseStore.ts`](file:///f:/Github/LearnOps/src/services/courseStore.ts) — Unified course catalog and pricing store.
     * [`whatsappNotificationService.ts`](file:///f:/Github/LearnOps/src/services/whatsappNotificationService.ts) — Automated WhatsApp evaluation and onboarding message generator.

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
│   │   ├── data/                      # Initial course catalog & teacher data
│   │   ├── guardian/                  # Guardian WhatsApp components
│   │   ├── AdminPage.tsx              # Admin route gateway
│   │   ├── App.tsx                    # Main app router & landing page
│   │   ├── CourseDetailPage.tsx       # Course curriculum & details page
│   │   ├── CourseListPage.tsx         # Course search & filter directory (with Lead Capture modal)
│   │   ├── Dashboard.tsx              # Student / main dashboard
│   │   ├── GuardianPage.tsx           # Parent / Guardian live academic dashboard
│   │   ├── LoginPage.tsx              # Role-based login portal
│   │   ├── TeacherDashboard.tsx       # Teacher gateway wrapper
│   │   ├── TeacherPage.tsx            # Teacher portal (Zoom link, attendance, homework & grading)
│   │   └── TelesalesPage.tsx          # Telesales portal wrapper
│   ├── components/                    # Course details modal dialogs
│   │   ├── Course1DetailsModal.tsx
│   │   ├── Course2DetailsModal.tsx
│   │   ├── Course3DetailsModal.tsx
│   │   ├── Course4DetailsModal.tsx
│   │   └── Course5DetailsModal.tsx
│   ├── lib/
│   │   └── supabase.ts                # Supabase client singleton & entity schemas
│   ├── pages/                         # Complete administrative & CRM pages
│   │   ├── Admin.tsx                  # Administrative control center, analytics & CMS
│   │   └── Employee.tsx               # Telesales CRM pipeline, lead claiming & payment confirmation
│   ├── services/                      # Data stores, API endpoints & notification logic
│   │   ├── attendanceStore.ts         # Attendance logging & calculation store (Supabase UPSERT)
│   │   ├── batchStore.ts              # Course batch roster & live Zoom link store (Supabase PATCH)
│   │   ├── courseStore.ts             # Unified course catalog & price update store (Supabase REST)
│   │   ├── homeworkStore.ts           # Homework assignments & evaluation store (Supabase POST/PATCH)
│   │   ├── leadStore.ts               # Inbound storefront lead capture store (Supabase POST 201)
│   │   ├── notificationRepository.ts  # Security verification repository for WhatsApp dispatch
│   │   ├── salesStore.ts              # Payment record & revenue tracking store (Supabase POST 201)
│   │   ├── staffStore.ts              # Staff account provisioning & auth sync store (Supabase POST 201)
│   │   ├── whatsappNotificationController.ts # WhatsApp controller endpoint
│   │   └── whatsappNotificationService.ts    # WhatsApp message formatter
│   ├── styles/                        # CSS index, typography & Tailwind directives
│   └── main.tsx                       # Application entry point
├── .env                               # Environment variables (Supabase URL & Keys)
├── database.md                        # Complete database connections & schema documentation
├── package.json                       # Dependencies & script configurations
├── project.md                         # System architecture & project documentation
├── README.md                          # Project introduction summary
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite build configuration
```

---

## 4. User Portals & Features Matrix

| Portal Role | Key Capabilities & Features | Primary Component |
| :--- | :--- | :--- |
| **Public Visitor** | Course exploration, course details modals, teacher profiles, success stories, bilingual toggle, in-app lead capture modal (`POST /inbound_leads` HTTP 201) | [App.tsx](file:///f:/Github/LearnOps/src/app/App.tsx), [CourseListPage.tsx](file:///f:/Github/LearnOps/src/app/CourseListPage.tsx) |
| **Admin** | Admin authentication, sales revenue metrics, conversion tracking, staff provisioning (Telesales/Teacher account creation with `auth.signUp` & `POST /staff` HTTP 201), course CMS (Add/Edit Price/Delete courses), itemized expenses, delivery logistics tracking | [Admin.tsx](file:///f:/Github/LearnOps/src/pages/Admin.tsx) |
| **Telesales / Sales CRM** | Lead status pipeline, lead claiming with agent lock (`PATCH /leads` HTTP 200), call note logging, payment confirmation (bKash/Nagad TrxID & batch assignment - `POST /payments` HTTP 201), guardian registration & magic link generation (`POST /students` HTTP 201) | [Employee.tsx](file:///f:/Github/LearnOps/src/pages/Employee.tsx) |
| **Teacher** | Attendance marking & batch saving (`UPSERT /attendance_logs` HTTP 200/201), homework assignment with practice sheet links (`POST /homework_assignments` HTTP 201), homework evaluation/grading (`PATCH /homework_submissions` HTTP 200), live Zoom class URL creation & schedule update (`PATCH /batches` HTTP 200) | [TeacherPage.tsx](file:///f:/Github/LearnOps/src/app/TeacherPage.tsx) |
| **Guardian** | Real-time student academic tracking, live Zoom class button sync, attendance percentage tracker, assigned homework list with 1-click WhatsApp submission button, official student performance report cards with letter grades (A+, A, B, C), marks, and teacher remarks | [GuardianPage.tsx](file:///f:/Github/LearnOps/src/app/GuardianPage.tsx) |

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
