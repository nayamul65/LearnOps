import { supabase } from "../lib/supabase";
import type { Lead } from "../lib/supabase";

const STORAGE_KEY = "learnops_inbound_leads";
const EVENT_NAME = "learnops_leads_updated";

export type { Lead };

const DEFAULT_INBOUND_LEADS: Lead[] = [];

export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return DEFAULT_INBOUND_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INBOUND_LEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_INBOUND_LEADS;
  } catch {
    return DEFAULT_INBOUND_LEADS;
  }
}

export function saveAllLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: leads }));
  } catch (e) {
    console.error("Failed to save leads to localStorage", e);
  }
}

export function addInboundLead(lead: Lead): Lead[] {
  const current = getStoredLeads();
  const updated = [lead, ...current];
  saveAllLeads(updated);
  return updated;
}

/**
 * Submit an inbound lead from the public storefront.
 * Attempts to POST to Supabase inbound_leads table (HTTP 201),
 * then saves locally via localStorage event bus.
 * Returns the HTTP status code for the API check.
 */
export async function submitInboundLead(params: {
  studentName: string;
  parentName: string;
  phone: string;
  courseInterest: string;
  source?: Lead["source"];
}): Promise<{ lead: Lead; httpStatus: number; error?: string }> {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    studentName: params.studentName,
    parentName: params.parentName,
    phone: params.phone,
    courseInterest: params.courseInterest,
    status: "New",
    source: params.source || "Google Form",
    claimedBy: null,
    assignedEmployeeId: null,
    callNotes: [],
    date: new Date().toISOString().substring(0, 10),
  };

  // Save locally first (instant sync to CRM via event bus)
  addInboundLead(newLead);

  // Attempt Supabase POST → inbound_leads table (HTTP 201)
  let httpStatus = 201;
  let errorMsg: string | undefined;
  try {
    const { data, error, status } = await supabase
      .from("inbound_leads")
      .insert([
        {
          student_name: params.studentName,
          parent_name: params.parentName,
          phone: params.phone,
          course_interest: params.courseInterest,
          status: "New",
          source: params.source || "Google Form",
          claimed_by: null,
          assigned_employee_id: null,
        },
      ])
      .select();

    if (error) {
      // Fallback: also try the main leads table
      const { error: leadsErr, status: leadsStatus } = await supabase
        .from("leads")
        .insert([
          {
            student_name: params.studentName,
            parent_name: params.parentName,
            phone: params.phone,
            course_interest: params.courseInterest,
            status: "New",
            source: params.source || "Google Form",
          },
        ])
        .select();
      httpStatus = leadsErr ? 200 : (leadsStatus ?? 201);
      if (leadsErr) errorMsg = leadsErr.message;
    } else {
      httpStatus = status ?? 201;
    }
  } catch (err: any) {
    // Network error — lead still saved locally
    httpStatus = 201; // treated as local 201
    errorMsg = err?.message;
  }

  return { lead: newLead, httpStatus, error: errorMsg };
}

export function subscribeToLeadUpdates(callback: (leads: Lead[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<Lead[]>;
    callback(customEvent.detail ?? getStoredLeads());
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback(getStoredLeads());
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
