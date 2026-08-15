# LearnOps — Database Connections & Schema Documentation

This document provides a comprehensive technical reference for all database connections, table schemas, client abstractions, query logic, and data operations across the LearnOps platform.

---

## 1. Top-Level Database Overview

* **Database Engine**: Supabase (PostgreSQL 15 Backend-as-a-Service)
* **Connection Strategy**: Shared Singleton JavaScript Client (`@supabase/supabase-js`)
* **Transport / Protocol**: HTTPS REST API (PostgREST API Engine & Supabase Auth Service)
* **Environment Variables**:
  * `VITE_SUPABASE_URL`: Base URL for the Supabase project endpoint (e.g. `https://mhdcjaphoncuifhvdyat.supabase.co`)
  * `VITE_SUPABASE_ANON_KEY`: Public anonymous API key for browser client-side REST queries
* **Core Configuration File**: [`src/lib/supabase.ts`](file:///f:/Github/LearnOps/src/lib/supabase.ts)
* **Hybrid Persistence Strategy**:
  * **Dual-Layer Architecture**: Every data mutation initiates an asynchronous HTTP REST query (`POST`, `PATCH`, `UPSERT`, `DELETE`, `SELECT`) against Supabase tables.
  * **Optimistic Offline Sync**: An optimistic `localStorage` event-driven bus (`learnops_*_updated`) provides instant UI responsiveness, cross-tab synchronization, and graceful offline fallback.
  * **Real-time Status Feedback**: Floating API status toasts (`HTTP 201 Created`, `HTTP 200 OK`) notify users of real-time database operation responses.

---

## 2. Platform Entity Schemas & Models Summary

All TypeScript entity interfaces are centralized in [`src/lib/supabase.ts`](file:///f:/Github/LearnOps/src/lib/supabase.ts) and service stores:

| Entity / Model | Supabase Table / Auth Endpoint | Key Identifiers & Foreign Keys | Description |
| :--- | :--- | :--- | :--- |
| **`StaffMember`** | `staff` / `users` / `auth` | `id` (PK) | Provisioned employee accounts (Telesales, Teachers, Admins) |
| **`Lead`** | `inbound_leads` / `leads` | `id` (PK), `assigned_employee_id` (FK -> `staff.id`) | Inbound storefront leads & CRM pipeline call logs |
| **`UnifiedCourse`** | `courses` | `id` (PK) | Course catalog metadata, prices, Google Form links, and details |
| **`PaymentRecord`** | `payments` | `id` (PK), `lead_id` (FK -> `leads.id`), `batch_id` (FK -> `batches.id`) | Confirmed student payments (bKash, Nagad, TrxID, Amount) |
| **`GuardianAccountRecord`** | `students` / `users` | `id` (PK), `batch_id` (FK -> `batches.id`) | Student & parent portal accounts, temp passwords & magic links |
| **`BatchItem`** | `batches` | `id` (PK), `course_id` (FK -> `courses.id`), `teacher_id` (FK -> `staff.id`) | Course batches, roster lists, and live Zoom class meeting links |
| **`AttendanceRecord`** | `attendance_logs` | `id` (`att-stdId-date`) (PK), `student_id` (FK -> `students.id`) | Daily student attendance logs (`Present`, `Absent`, `Late`) |
| **`HomeworkAssignment`** | `homework_assignments` | `id` (PK), `batch_id` (FK -> `batches.id`) | Lessons assigned by teachers with practice sheet links |
| **`HomeworkGrade`** | `homework_submissions` | `assignment_id` + `student_id` (Composite PK) | Student homework evaluation scores, letter grades (`A+`, `A`, `B`, `C`), & feedback |
| **`CourseExtraCost`** | `extra_costs` | `id` (PK) | Itemized course printing, freight, and courier expenses |
| **`DeliveryRecord`** | `deliveries` | `id` (PK), `trx_id` (FK -> `payments.trx_id`) | Logistics book dispatch tracking (Steadfast, Pathao, Paperfly) |

---

## 3. Complete File-by-File Database Connection Registry

### 1. `src/lib/supabase.ts`
* **File Path**: [`f:\Github\LearnOps\src\lib\supabase.ts`](file:///f:/Github/LearnOps/src/lib/supabase.ts)
* **Purpose**: Core configuration file. Initializes and exports the shared Supabase JavaScript client singleton instance and declares all global data model interfaces.
* **Connection Method**: Calls `createClient(supabaseUrl, supabaseAnonKey)` from `@supabase/supabase-js`.
* **Env Variables Referenced**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
* **Interacted Tables / Schemas**: Initializes client singleton used across all PostgreSQL database tables.
* **Operations Performed**: Client Initialization & Schema Type Exports.
* **Notable Logic**: Exports global `supabase` object used as the single point of entry for DB queries.

---

### 2. `src/services/staffStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\staffStore.ts`](file:///f:/Github/LearnOps/src/services/staffStore.ts)
* **Purpose**: Employee provisioning service. Enables Admin to create new Telesales and Teacher accounts with Supabase Auth identity creation and database table sync.
* **Connection Method**: Import `supabase` client singleton from [`src/lib/supabase.ts`](file:///f:/Github/LearnOps/src/lib/supabase.ts).
* **Env Variables Referenced**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (via singleton).
* **Interacted Tables / Endpoints**: `auth` (Supabase Auth API), `staff`, `users`.
* **Operations Performed**: `WRITE` (`POST` HTTP 201).
* **Query Logic**:
  * Calls `supabase.auth.signUp({ email, password })` for authentication registration.
  * Performs `supabase.from("staff").insert([{ id, name, email, phone, role, status }])`.
  * Performs `supabase.from("users").insert([{ id, name, phone, role }])` to register user role permissions.
  * Triggers custom `learnops_staff_updated` event for multi-tab UI refresh.

---

### 3. `src/services/leadStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\leadStore.ts`](file:///f:/Github/LearnOps/src/services/leadStore.ts)
* **Purpose**: Storefront lead capture service. Receives public student enrollment requests and syncs them to the Telesales CRM pipeline.
* **Connection Method**: Import `supabase` client singleton from [`src/lib/supabase.ts`](file:///f:/Github/LearnOps/src/lib/supabase.ts).
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `inbound_leads`, `leads`.
* **Operations Performed**: `WRITE` (`POST` HTTP 201), `READ` (`SELECT`).
* **Query Logic**:
  * Performs `supabase.from("inbound_leads").insert([{ student_name, parent_name, phone, course_interest, status: "New" }]).select()`.
  * Performs `supabase.from("leads").insert([{...}]).select()` to place lead into the Telesales unassigned pool.
  * Returns `{ record, httpStatus, error }` payload to show `HTTP 201 Created` API toasts.

---

### 4. `src/services/salesStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\salesStore.ts`](file:///f:/Github/LearnOps/src/services/salesStore.ts)
* **Purpose**: Payment record repository. Stores payment confirmation data (bKash/Nagad TrxID, amount, batch assigned) for executive analytics.
* **Connection Method**: Import `supabase` client singleton.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `payments`.
* **Operations Performed**: `WRITE` (`POST` HTTP 201), `READ` (`SELECT`).
* **Query Logic**:
  * Executes `supabase.from("payments").insert([{ lead_id, student_name, guardian_name, phone, amount, method, trx_id, batch_id, agent_id }]).select()`.
  * Dispatches `learnops_payments_updated` custom event to update Admin total revenue cards dynamically.

---

### 5. `src/services/batchStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\batchStore.ts`](file:///f:/Github/LearnOps/src/services/batchStore.ts)
* **Purpose**: Batch catalog management, student roster enrollment, and live Zoom class meeting updates.
* **Connection Method**: Store helper functions + component Supabase queries.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `batches`.
* **Operations Performed**: `READ` (`SELECT`), `UPDATE` (`PATCH` HTTP 200).
* **Query Logic**:
  * `updateBatchZoom(batchId, zoomLink, zoomSchedule, zoomScheduleEN)` updates local store and executes `supabase.from("batches").update({ zoom_link, zoom_schedule }).eq("id", batchId)`.
  * Dispatches `learnops_batches_updated` custom event to sync live Zoom links to Guardian Portal dashboards across browser tabs.

---

### 6. `src/services/attendanceStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\attendanceStore.ts`](file:///f:/Github/LearnOps/src/services/attendanceStore.ts)
* **Purpose**: Student attendance logging and attendance percentage tracker.
* **Connection Method**: Import `supabase` client singleton.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `attendance_logs`.
* **Operations Performed**: `WRITE` / `UPDATE` (`UPSERT` HTTP 200/201).
* **Query Logic**:
  * Executes `supabase.from("attendance_logs").upsert([{ id: "att-stdId-date", student_id, student_name, batch_id, date, status, marked_by }], { onConflict: "id" }).select()`.
  * Calculates `getAttendanceRate(studentId)` dynamically from persistent logs.

---

### 7. `src/services/homeworkStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\homeworkStore.ts`](file:///f:/Github/LearnOps/src/services/homeworkStore.ts)
* **Purpose**: Homework assignment publishing and evaluation grading store.
* **Connection Method**: Import `supabase` client singleton.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `homework_assignments`, `homework_submissions`.
* **Operations Performed**: `WRITE` (`POST` HTTP 201), `UPDATE` (`UPSERT` / `PATCH` HTTP 200).
* **Query Logic**:
  * `addAssignment()` executes `supabase.from("homework_assignments").insert([{ title, subject, description, batch_id, due_date, teacher_phone }]).select()`.
  * `saveGrade()` executes `supabase.from("homework_submissions").upsert([{ assignment_id, student_id, student_name, score, grade, feedback, status }], { onConflict: "assignment_id,student_id" }).select()`.

---

### 8. `src/services/courseStore.ts`
* **File Path**: [`f:\Github\LearnOps\src\services\courseStore.ts`](file:///f:/Github/LearnOps/src/services/courseStore.ts)
* **Purpose**: Course catalog repository and storefront pricing sync store.
* **Connection Method**: Import `supabase` client singleton.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `courses`.
* **Operations Performed**: `READ` (`SELECT`), `WRITE` (`POST`), `UPDATE` (`PATCH`), `DELETE`.
* **Query Logic**:
  * Normalizes course data structures with fallbacks and dispatches `learnops_course_catalog_updated` for real-time storefront synchronization.

---

### 9. `src/pages/Admin.tsx`
* **File Path**: [`f:\Github\LearnOps\src\pages\Admin.tsx`](file:///f:/Github/LearnOps/src/pages/Admin.tsx)
* **Purpose**: Administrative control panel for executive metrics, course CMS management, staff activation/deactivation, and logistics tracking.
* **Connection Method**: Import `supabase` client singleton from [`src/lib/supabase.ts`](file:///f:/Github/LearnOps/src/lib/supabase.ts).
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `users`, `staff`, `extra_costs`, `deliveries`, `courses`, `leads`.
* **Operations Performed**: `READ` (`SELECT *`), `WRITE` (`POST`), `UPDATE` (`PATCH`), `DELETE`.
* **Query Logic**:
  * `fetchSupabaseData()` executes parallel data loads using `Promise.all`:
    * `supabase.from("users").select("*")`
    * `supabase.from("staff").select("*")`
    * `supabase.from("extra_costs").select("*")`
    * `supabase.from("deliveries").select("*")`
    * `supabase.from("courses").select("*")`
    * `supabase.from("leads").select("*")`
  * `handleSaveCourse()` executes `supabase.from("courses").insert([{...}])` (`POST` HTTP 201) for new courses or `.update({...}).eq("id", courseId)` (`PATCH` HTTP 200) for edits.
  * `handleDeleteCourse()` executes `supabase.from("courses").delete().eq("id", id)`.
  * `handleToggleStaffStatus()` executes `supabase.from("staff").update({ status: nextStatus }).eq("id", staffId)`.

---

### 10. `src/pages/Employee.tsx`
* **File Path**: [`f:\Github\LearnOps\src\pages\Employee.tsx`](file:///f:/Github/LearnOps/src/pages/Employee.tsx)
* **Purpose**: Telesales CRM desk for lead management, lead claiming, call note logging, bKash payment confirmation, and guardian registration.
* **Connection Method**: Import `supabase` client singleton.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `leads`, `batches`, `payments`, `students`, `users`.
* **Operations Performed**: `READ` (`SELECT`), `WRITE` (`POST`), `UPDATE` (`PATCH`).
* **Query Logic**:
  * `handleClaimLead()` executes `supabase.from("leads").update({ status: "In Progress", claimed_by, assigned_employee_id }).eq("id", leadId).select()` -> triggers `HTTP 200 OK` toast.
  * `handleConfirmPayment()` calls `addPayment()` (`POST /payments` HTTP 201) and updates lead status to 'Converted' (`PATCH /leads` HTTP 200).
  * `handleCreateGuardianAccount()` executes `supabase.from("students").insert([{ name, guardian_name, phone, temp_password, magic_link }]).select()` -> triggers `HTTP 201 Created` toast.

---

### 11. `src/app/TeacherPage.tsx`
* **File Path**: [`f:\Github\LearnOps\src\app\TeacherPage.tsx`](file:///f:/Github/LearnOps/src/app/TeacherPage.tsx)
* **Purpose**: Teacher hub for attendance marking, homework creation, homework evaluation/grading, and Zoom live class updates.
* **Connection Method**: Import `supabase` client singleton & store helper utilities.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `batches`, `attendance_logs`, `homework_assignments`, `homework_submissions`.
* **Operations Performed**: `WRITE` (`POST`), `UPDATE` (`PATCH` / `UPSERT`).
* **Query Logic**:
  * `handleCreateZoomLink()` executes `supabase.from("batches").update({ zoom_link, zoom_schedule }).eq("id", batchId).select()` -> triggers `HTTP 200 OK` toast.
  * `handleSaveAttendance()` executes batch upsert via `upsertAttendance()` against `attendance_logs`.
  * `handleAssignHomework()` executes `addAssignment()` against `homework_assignments` (`POST` HTTP 201).
  * `handleSaveGrade()` executes `saveGradeToStore()` against `homework_submissions` (`PATCH` HTTP 200).

---

### 12. `src/app/CourseListPage.tsx`
* **File Path**: [`f:\Github\LearnOps\src\app\CourseListPage.tsx`](file:///f:/Github/LearnOps/src/app/CourseListPage.tsx)
* **Purpose**: Public storefront course catalog directory with interactive Lead Capture modal.
* **Connection Method**: Uses `submitInboundLead()` service.
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `inbound_leads`, `leads`.
* **Operations Performed**: `WRITE` (`POST` HTTP 201).
* **Query Logic**:
  * Submits lead details to `submitInboundLead()`, triggering `POST /inbound_leads` (HTTP 201) and syncing into CRM.

---

### 13. `src/app/GuardianPage.tsx`
* **File Path**: [`f:\Github\LearnOps\src\app\GuardianPage.tsx`](file:///f:/Github/LearnOps/src/app/GuardianPage.tsx)
* **Purpose**: Parent/Guardian portal displaying student academic progress, live Zoom class link, attendance percentage, assigned homework, and official performance report cards.
* **Connection Method**: Subscribes to live store events (`subscribeToBatchUpdates`, `subscribeToAttendanceUpdates`, `subscribeToHomeworkUpdates`).
* **Env Variables Referenced**: Indirectly via singleton.
* **Interacted Tables**: `batches`, `attendance_logs`, `homework_assignments`, `homework_submissions` (via reactive state listeners).
* **Operations Performed**: `READ` (Reactive state synchronization).
* **Query Logic**:
  * Listens to `learnops_batches_updated`, `learnops_attendance_updated`, and `learnops_homework_updated` events for immediate multi-tab sync when Teachers update Zoom links, mark attendance, or grade homework.
