import { supabase } from "../lib/supabase";

const STORAGE_KEY = "learnops_payments";
const EVENT_NAME = "learnops_payments_updated";

export interface PaymentRecord {
  id: string;
  leadId: string;
  studentName: string;
  guardianName: string;
  phone: string;
  courseInterest: string;
  amount: number;
  method: string;
  trxId: string;
  batchId: string;
  batchName: string;
  agentId: string;
  agentName: string;
  date: string;
}

export function getStoredPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getTotalRevenue(): number {
  return getStoredPayments().reduce((sum, p) => sum + (p.amount || 0), 0);
}

export function saveAllPayments(payments: PaymentRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payments }));
  } catch (e) {
    console.error("Failed to save payments:", e);
  }
}

export async function addPayment(payment: Omit<PaymentRecord, "id">): Promise<{ record: PaymentRecord; httpStatus: number; error?: string }> {
  const record: PaymentRecord = { ...payment, id: `pay-${Date.now()}` };
  const current = getStoredPayments();
  saveAllPayments([record, ...current]);

  let httpStatus = 201;
  let error: string | undefined;
  try {
    const { status, error: dbErr } = await supabase.from("payments").insert([{
      lead_id: payment.leadId,
      student_name: payment.studentName,
      guardian_name: payment.guardianName,
      phone: payment.phone,
      course_interest: payment.courseInterest,
      amount: payment.amount,
      method: payment.method,
      trx_id: payment.trxId,
      batch_id: payment.batchId,
      batch_name: payment.batchName,
      agent_id: payment.agentId,
      agent_name: payment.agentName,
    }]).select();
    if (dbErr) error = dbErr.message;
    else httpStatus = status ?? 201;
  } catch (err: any) {
    error = err?.message;
  }
  return { record, httpStatus, error };
}

export function subscribeToPaymentUpdates(callback: (payments: PaymentRecord[]) => void): () => void {
  const handler = (e: Event) => {
    const ev = e as CustomEvent<PaymentRecord[]>;
    callback(ev.detail ?? getStoredPayments());
  };
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback(getStoredPayments());
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
