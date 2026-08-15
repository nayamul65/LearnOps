import { supabase } from "../lib/supabase";

export interface GuardianAccountRecord {
  id: string;
  guardianName: string;
  guardianPhone: string;
  studentName: string;
  batchId: string;
  batchName: string;
  loginId: string;
  tempPass: string;
  magicLink: string;
  createdAt: string;
}

export const DEFAULT_GUARDIAN_ACCOUNTS: GuardianAccountRecord[] = [
  {
    id: "grd-101",
    guardianName: "সামিরা সুলতানা",
    guardianPhone: "01711223344",
    studentName: "আরাফ হোসেন",
    batchId: "batch-101",
    batchName: "ব্যাচ ০৪ - ২৫ দিনে সুন্দর হাতের লেখা (বিকাল ৪:০০ টা)",
    loginId: "01711223344",
    tempPass: "pass1234",
    magicLink: `${typeof window !== "undefined" ? window.location.origin : ""}/guardian?student_id=std-1&phone=01711223344`,
    createdAt: "2026-08-05",
  },
];

const STORAGE_KEY = "learnops_guardian_accounts";
const EVENT_NAME = "learnops_guardian_updated";

export function getStoredGuardians(): GuardianAccountRecord[] {
  if (typeof window === "undefined") return DEFAULT_GUARDIAN_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GUARDIAN_ACCOUNTS));
      return DEFAULT_GUARDIAN_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GUARDIAN_ACCOUNTS;
  } catch (err) {
    console.warn("Failed to load guardian accounts from localStorage:", err);
    return DEFAULT_GUARDIAN_ACCOUNTS;
  }
}

export function saveAllGuardians(records: GuardianAccountRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: records }));
  } catch (err) {
    console.error("Failed to save guardian accounts to localStorage:", err);
  }
}

export async function addGuardianAccount(record: GuardianAccountRecord): Promise<GuardianAccountRecord[]> {
  const current = getStoredGuardians();
  const updated = [record, ...current.filter((g) => g.id !== record.id)];
  saveAllGuardians(updated);

  // Sync to Supabase `students` & `users` tables
  try {
    await supabase.from("students").insert([
      {
        id: record.id,
        name: record.studentName,
        guardian_name: record.guardianName,
        phone: record.guardianPhone,
        batch_id: record.batchId,
        temp_password: record.tempPass,
        magic_link: record.magicLink,
      },
    ]);

    await supabase.from("users").insert([
      {
        name: record.guardianName,
        phone: record.guardianPhone,
        role: "guardian",
        temp_password: record.tempPass,
        student_name: record.studentName,
        batch_id: record.batchId,
      },
    ]);
  } catch (err) {
    console.warn("Non-fatal error syncing guardian to Supabase:", err);
  }

  return updated;
}

export function findGuardianByCreds(loginId: string, tempPass: string): GuardianAccountRecord | undefined {
  const cleanDigits = loginId.trim().replace(/\D/g, "");
  const cleanRaw = loginId.trim().toLowerCase();
  const guardians = getStoredGuardians();

  return guardians.find((g) => {
    const matchPhone = cleanDigits && g.guardianPhone.replace(/\D/g, "") === cleanDigits;
    const matchLoginId = g.loginId.trim().toLowerCase() === cleanRaw || (cleanDigits && g.loginId.replace(/\D/g, "") === cleanDigits);
    const matchPass = g.tempPass.trim() === tempPass.trim();
    return (matchPhone || matchLoginId) && matchPass;
  });
}

export function findGuardianByPhoneOrId(query: string): GuardianAccountRecord | undefined {
  if (!query) return undefined;
  const cleanDigits = query.trim().replace(/\D/g, "");
  const cleanQuery = query.trim().toLowerCase();
  const guardians = getStoredGuardians();

  return guardians.find((g) => {
    if (cleanDigits && g.guardianPhone.replace(/\D/g, "") === cleanDigits) return true;
    if (g.id.toLowerCase() === cleanQuery) return true;
    if (g.loginId.toLowerCase() === cleanQuery) return true;
    return false;
  });
}

export function subscribeToGuardianUpdates(callback: (guardians: GuardianAccountRecord[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<GuardianAccountRecord[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredGuardians());
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) callback(getStoredGuardians());
  });

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}
