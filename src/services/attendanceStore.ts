import { supabase } from "../lib/supabase";

const STORAGE_KEY = "learnops_attendance";
const EVENT_NAME = "learnops_attendance_updated";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  markedBy: string;
}

export function getStoredAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAttendanceRate(studentId?: string): number {
  const records = getStoredAttendance();
  const filtered = studentId ? records.filter((r) => r.studentId === studentId) : records;
  if (filtered.length === 0) return 94; // default if no records yet
  const present = filtered.filter((r) => r.status === "Present" || r.status === "Late").length;
  return Math.round((present / filtered.length) * 100);
}

export function saveAllAttendance(records: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: records }));
  } catch (e) {
    console.error("Failed to save attendance:", e);
  }
}

export async function upsertAttendance(record: Omit<AttendanceRecord, "id">): Promise<{ record: AttendanceRecord; httpStatus: number; error?: string }> {
  const id = `att-${record.studentId}-${record.date}`;
  const fullRecord: AttendanceRecord = { ...record, id };

  const current = getStoredAttendance();
  const existing = current.findIndex((r) => r.studentId === record.studentId && r.date === record.date);
  let updated: AttendanceRecord[];
  if (existing >= 0) {
    updated = [...current];
    updated[existing] = fullRecord;
  } else {
    updated = [fullRecord, ...current];
  }
  saveAllAttendance(updated);

  let httpStatus = 200;
  let error: string | undefined;
  try {
    const { status, error: dbErr } = await supabase.from("attendance_logs").upsert([{
      id,
      student_id: record.studentId,
      student_name: record.studentName,
      batch_id: record.batchId,
      date: record.date,
      status: record.status,
      marked_by: record.markedBy,
    }], { onConflict: "id" }).select();
    if (dbErr) error = dbErr.message;
    else httpStatus = status ?? 200;
  } catch (err: any) {
    error = err?.message;
  }
  return { record: fullRecord, httpStatus, error };
}

export function subscribeToAttendanceUpdates(callback: (records: AttendanceRecord[]) => void): () => void {
  const handler = (e: Event) => {
    const ev = e as CustomEvent<AttendanceRecord[]>;
    callback(ev.detail ?? getStoredAttendance());
  };
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback(getStoredAttendance());
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
