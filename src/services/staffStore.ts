import { supabase, StaffMember } from "../lib/supabase";

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: "staff-1",
    name: "আরিফুল ইসলাম",
    email: "ariful@learnops.com",
    phone: "01711-223344",
    role: "Telesales",
    status: "Active",
    tempPassword: "pass1234password",
    createdAt: "2026-07-01",
  },
  {
    id: "staff-2",
    name: "ফারহানা বেগম",
    email: "farhana@learnops.com",
    phone: "01822-334455",
    role: "Teacher",
    status: "Active",
    tempPassword: "pass1234password",
    createdAt: "2026-07-05",
  },
  {
    id: "staff-3",
    name: "রাহেলা খাতুন",
    email: "rahela@learnops.com",
    phone: "01933-445566",
    role: "Teacher",
    status: "Active",
    tempPassword: "pass1234password",
    createdAt: "2026-07-10",
  },
  {
    id: "staff-4",
    name: "সুমাইয়া আক্তার",
    email: "sumaiya@learnops.com",
    phone: "01644-556677",
    role: "Telesales",
    status: "Active",
    tempPassword: "pass1234password",
    createdAt: "2026-07-15",
  },
];

const STORAGE_KEY = "learnops_staff_catalog";
const EVENT_NAME = "learnops_staff_updated";

export function getStoredStaff(): StaffMember[] {
  if (typeof window === "undefined") return DEFAULT_STAFF;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
      return DEFAULT_STAFF;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_STAFF;
  } catch (e) {
    console.warn("Failed to load staff from localStorage, using defaults", e);
    return DEFAULT_STAFF;
  }
}

export function saveAllStaff(staffList: StaffMember[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: staffList }));
  } catch (e) {
    console.error("Failed to save staff to localStorage", e);
  }
}

export async function addOrUpdateStaff(staffItem: StaffMember): Promise<StaffMember[]> {
  const current = getStoredStaff();
  const existingIdx = current.findIndex((s) => s.id === staffItem.id || s.email.toLowerCase() === staffItem.email.toLowerCase());
  let updated: StaffMember[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = staffItem;
  } else {
    updated = [staffItem, ...current];
  }
  saveAllStaff(updated);

  // Sync to Supabase Auth & Users/Staff tables (HTTP 201 POST)
  try {
    await supabase.auth.signUp({
      email: staffItem.email,
      password: staffItem.tempPassword || "pass1234password",
      options: {
        data: {
          name: staffItem.name,
          role: staffItem.role.toLowerCase(),
          phone: staffItem.phone,
        },
      },
    });

    await supabase.from("staff").insert([
      {
        name: staffItem.name,
        email: staffItem.email,
        phone: staffItem.phone,
        role: staffItem.role,
        status: staffItem.status,
        temp_password: staffItem.tempPassword || "pass1234password",
      },
    ]);

    await supabase.from("users").insert([
      {
        name: staffItem.name,
        email: staffItem.email,
        role: staffItem.role.toLowerCase() === "teacher" ? "teacher" : "sales",
      },
    ]);
  } catch (err) {
    console.warn("Non-fatal Supabase sync for staff member:", err);
  }

  return updated;
}

export function subscribeToStaffUpdates(callback: (staff: StaffMember[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<StaffMember[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredStaff());
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) callback(getStoredStaff());
  });
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}
