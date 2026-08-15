// LearnOps Centralized Batch & Student Roster Store
// Synchronizes course batches, student rosters, WhatsApp communication, and teacher assignments

export interface StudentRosterItem {
  id: string;
  name: string;
  parentName: string;
  phone: string;
  whatsappNumber?: string;
  rollNo: string;
  attendancePercentage: number;
  avgExamScore: number;
  grade: string;
  status: "Active" | "Completed";
  enrolledAt?: string;
  courseTitle?: string;
  batchId?: string;
}

export interface BatchItem {
  id: string;
  courseId: string | number;
  name: string;
  courseTitle: string;
  headTeacher: string;
  teacherId?: string;
  totalStudents: number;
  maxStudents?: number;
  schedule: string;
  roster: StudentRosterItem[];
  createdAt?: string;
  // Live class fields — updated by Teacher Portal
  zoomLink?: string;
  zoomSchedule?: string;  // e.g. "আজ বিকাল ৪:০০ টা (লাইভ জুম ক্লাস)"
  zoomScheduleEN?: string; // e.g. "Today at 4:00 PM (Live Zoom Class)"
  zoomUpdatedAt?: string;
}

export const DEFAULT_BATCHES: BatchItem[] = [
  {
    id: "batch-101",
    courseId: "c-101",
    name: "ব্যাচ ০৪ (বিকাল ৪:০০ টা)",
    courseTitle: "২৫ দিনে সুন্দর হাতের লেখা",
    headTeacher: "ফারহানা বেগম",
    teacherId: "staff-2",
    totalStudents: 5,
    maxStudents: 25,
    schedule: "শনিবার-সোমবার-বুধবার (বিকাল ৪:০০)",
    createdAt: "2026-07-01",
    roster: [
      {
        id: "std-1",
        name: "আরাফ হোসেন",
        parentName: "সামিরা সুলতানা",
        phone: "+8801711-223344",
        whatsappNumber: "+8801711223344",
        rollNo: "01",
        attendancePercentage: 96,
        avgExamScore: 94,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-05",
      },
      {
        id: "std-2",
        name: "তাহিয়া রহমান",
        parentName: "মাহাবুব আলম",
        phone: "+8801822-334455",
        whatsappNumber: "+8801822334455",
        rollNo: "02",
        attendancePercentage: 92,
        avgExamScore: 88,
        grade: "A",
        status: "Active",
        enrolledAt: "2026-07-06",
      },
      {
        id: "std-3",
        name: "সামিন চৌধুরী",
        parentName: "নাসরিন পারভীন",
        phone: "+8801933-445566",
        whatsappNumber: "+8801933445566",
        rollNo: "03",
        attendancePercentage: 88,
        avgExamScore: 82,
        grade: "A",
        status: "Active",
        enrolledAt: "2026-07-08",
      },
      {
        id: "std-4",
        name: "তানভীর আহম্মেদ",
        parentName: "রেজাউল করিম",
        phone: "+8801644-556677",
        whatsappNumber: "+8801644556677",
        rollNo: "04",
        attendancePercentage: 90,
        avgExamScore: 85,
        grade: "A",
        status: "Active",
        enrolledAt: "2026-07-10",
      },
      {
        id: "std-5",
        name: "নুসাইবা পারভীন",
        parentName: "জহিরুল ইসলাম",
        phone: "+8801555-112233",
        whatsappNumber: "+8801555112233",
        rollNo: "05",
        attendancePercentage: 100,
        avgExamScore: 98,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-12",
      },
    ],
  },
  {
    id: "batch-102",
    courseId: "c-102",
    name: "ব্যাচ ০২ (সকাল ১০:০০ টা)",
    courseTitle: "মাত্র ৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    headTeacher: "রাহেলা খাতুন",
    teacherId: "staff-3",
    totalStudents: 3,
    maxStudents: 20,
    schedule: "রবি-মঙ্গল-বৃহস্পতিবার (সকাল ১০:০০)",
    createdAt: "2026-07-02",
    roster: [
      {
        id: "std-6",
        name: "মারুফ হাসান",
        parentName: "কামরুল হাসান",
        phone: "+8801733-998877",
        whatsappNumber: "+8801733998877",
        rollNo: "01",
        attendancePercentage: 94,
        avgExamScore: 90,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-14",
      },
      {
        id: "std-7",
        name: "আতিয়া ফারহিন",
        parentName: "ফারুক আহমেদ",
        phone: "+8801788-332211",
        whatsappNumber: "+8801788332211",
        rollNo: "02",
        attendancePercentage: 90,
        avgExamScore: 86,
        grade: "A",
        status: "Active",
        enrolledAt: "2026-07-15",
      },
      {
        id: "std-8",
        name: "জায়ান করিম",
        parentName: "রেজাউল করিম",
        phone: "+8801811-445566",
        whatsappNumber: "+8801811445566",
        rollNo: "03",
        attendancePercentage: 96,
        avgExamScore: 92,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-16",
      },
    ],
  },
  {
    id: "batch-103",
    courseId: "c-103",
    name: "ব্যাচ ০১ (রাত ৮:০০ টা)",
    courseTitle: "8 WEEKS ENGLISH SPEAKING (start program)",
    headTeacher: "মো. আরিফুল ইসলাম",
    teacherId: "staff-1",
    totalStudents: 4,
    maxStudents: 25,
    schedule: "শনিবার-সোম-বুধবার (রাত ৮:০০)",
    createdAt: "2026-07-03",
    roster: [
      {
        id: "std-9",
        name: "রাফসান জামান",
        parentName: "আরিফ জামান",
        phone: "+8801911-778899",
        whatsappNumber: "+8801911778899",
        rollNo: "01",
        attendancePercentage: 95,
        avgExamScore: 91,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-18",
      },
      {
        id: "std-10",
        name: "মেহজাবিন মেহনাজ",
        parentName: "মেহেদী হাসান",
        phone: "+8801622-334455",
        whatsappNumber: "+8801622334455",
        rollNo: "02",
        attendancePercentage: 88,
        avgExamScore: 85,
        grade: "A",
        status: "Active",
        enrolledAt: "2026-07-19",
      },
      {
        id: "std-11",
        name: "সামিউল ইসলাম",
        parentName: "শহিদুল ইসলাম",
        phone: "+8801533-889900",
        whatsappNumber: "+8801533889900",
        rollNo: "03",
        attendancePercentage: 92,
        avgExamScore: 89,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-20",
      },
      {
        id: "std-12",
        name: "অনন্যা চৌধুরী",
        parentName: "কবীর চৌধুরী",
        phone: "+8801744-112233",
        whatsappNumber: "+8801744112233",
        rollNo: "04",
        attendancePercentage: 98,
        avgExamScore: 96,
        grade: "A+",
        status: "Active",
        enrolledAt: "2026-07-22",
      },
    ],
  },
];

const BATCHES_STORAGE_KEY = "learnops_batches_catalog";
const BATCHES_UPDATED_EVENT = "learnops_batches_updated";

/**
 * Retrieve current stored batches from localStorage or fallback
 */
export function getStoredBatches(): BatchItem[] {
  try {
    const raw = localStorage.getItem(BATCHES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load batches from localStorage, using default", err);
  }
  return DEFAULT_BATCHES;
}

/**
 * Save all batches to localStorage and trigger global custom event
 */
export function saveAllBatches(batches: BatchItem[]): void {
  try {
    localStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(batches));
  } catch (err) {
    console.error("Failed to save batches to localStorage", err);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(BATCHES_UPDATED_EVENT, { detail: batches })
    );
  }
}

/**
 * Add or update a batch
 */
export function addOrUpdateBatch(batch: BatchItem): BatchItem[] {
  const current = getStoredBatches();
  const existingIdx = current.findIndex((b) => String(b.id) === String(batch.id));
  let updated: BatchItem[];

  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      ...batch,
      totalStudents: batch.roster ? batch.roster.length : updated[existingIdx].totalStudents,
    };
  } else {
    const newBatch: BatchItem = {
      ...batch,
      id: batch.id || `batch-${Date.now()}`,
      roster: batch.roster || [],
      totalStudents: batch.roster ? batch.roster.length : 0,
      createdAt: batch.createdAt || new Date().toISOString().slice(0, 10),
    };
    updated = [newBatch, ...current];
  }

  saveAllBatches(updated);
  return updated;
}

/**
 * Remove a batch by ID
 */
export function removeBatch(id: string | number): BatchItem[] {
  const current = getStoredBatches();
  const updated = current.filter((b) => String(b.id) !== String(id));
  saveAllBatches(updated);
  return updated;
}

/**
 * Enroll a student directly into a batch with WhatsApp number and details
 */
export function enrollStudentInBatch(
  batchId: string,
  studentData: {
    name: string;
    parentName?: string;
    phone: string;
    whatsappNumber?: string;
    courseTitle?: string;
  }
): { batches: BatchItem[]; enrolledStudent: StudentRosterItem } {
  const current = getStoredBatches();
  const batchIdx = current.findIndex((b) => b.id === batchId);
  const targetBatch = batchIdx >= 0 ? current[batchIdx] : current[0];

  const rollNumber = String((targetBatch.roster.length + 1)).padStart(2, "0");
  const cleanPhone = studentData.phone || "";
  const cleanWa = studentData.whatsappNumber || cleanPhone;

  const enrolledStudent: StudentRosterItem = {
    id: `std-${Date.now().toString().slice(-4)}`,
    name: studentData.name,
    parentName: studentData.parentName || "অভিভাবক",
    phone: cleanPhone,
    whatsappNumber: cleanWa,
    rollNo: rollNumber,
    attendancePercentage: 100,
    avgExamScore: 0,
    grade: "New",
    status: "Active",
    enrolledAt: new Date().toISOString().slice(0, 10),
    courseTitle: studentData.courseTitle || targetBatch.courseTitle,
    batchId: targetBatch.id,
  };

  const updatedRoster = [...targetBatch.roster, enrolledStudent];
  const updatedBatch: BatchItem = {
    ...targetBatch,
    roster: updatedRoster,
    totalStudents: updatedRoster.length,
  };

  let updatedList: BatchItem[];
  if (batchIdx >= 0) {
    updatedList = [...current];
    updatedList[batchIdx] = updatedBatch;
  } else {
    updatedList = [updatedBatch, ...current.slice(1)];
  }

  saveAllBatches(updatedList);
  return { batches: updatedList, enrolledStudent };
}

/**
 * Subscribe to batch store updates
 */
export function subscribeToBatchUpdates(
  callback: (batches: BatchItem[]) => void
): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<BatchItem[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredBatches());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === BATCHES_STORAGE_KEY) {
      callback(getStoredBatches());
    }
  };

  window.addEventListener(BATCHES_UPDATED_EVENT, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(BATCHES_UPDATED_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

/**
 * Update zoom link and schedule for a batch (Teacher Portal → Guardian Portal sync)
 */
export function updateBatchZoom(
  batchId: string,
  zoomLink: string,
  zoomSchedule: string,
  zoomScheduleEN: string
): BatchItem[] {
  const current = getStoredBatches();
  const idx = current.findIndex((b) => b.id === batchId);
  if (idx < 0) return current;

  const updated = [...current];
  updated[idx] = {
    ...updated[idx],
    zoomLink,
    zoomSchedule,
    zoomScheduleEN,
    zoomUpdatedAt: new Date().toISOString(),
  };
  saveAllBatches(updated);
  return updated;
}

/**
 * Get the zoom link for a specific batch (used by Guardian Portal)
 */
export function getBatchZoomInfo(batchId?: string): { zoomLink: string; zoomSchedule: string; zoomScheduleEN: string } {
  const batches = getStoredBatches();
  const batch = batchId ? batches.find((b) => b.id === batchId) : batches[0];
  return {
    zoomLink: batch?.zoomLink || "https://zoom.us/j/9876543210",
    zoomSchedule: batch?.zoomSchedule || "আজ বিকাল ৪:০০ টা (লাইভ জুম ক্লাস)",
    zoomScheduleEN: batch?.zoomScheduleEN || "Today at 4:00 PM (Live Zoom Class)",
  };
}
