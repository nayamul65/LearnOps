import { supabase } from "../lib/supabase";

const STORAGE_KEY = "learnops_homework";
const EVENT_NAME = "learnops_homework_updated";

export interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  batchId: string;
  batchName: string;
  dueDate: string;
  teacherPhone: string;
  teacherName: string;
  practiceSheetUrl?: string;
  createdAt: string;
}

export interface HomeworkGrade {
  assignmentId: string;
  studentId: string;
  studentName: string;
  score: number;       // 0-100
  grade: string;       // A+, A, B, C
  feedback: string;
  status: "Pending" | "Graded";
  submittedDate: string;
}

export interface HomeworkStore {
  assignments: HomeworkAssignment[];
  grades: HomeworkGrade[];
}

function getStore(): HomeworkStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { assignments: [], grades: [] };
    const parsed = JSON.parse(raw);
    return {
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : [],
      grades: Array.isArray(parsed.grades) ? parsed.grades : [],
    };
  } catch {
    return { assignments: [], grades: [] };
  }
}

function saveStore(store: HomeworkStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: store }));
  } catch (e) {
    console.error("Failed to save homework store:", e);
  }
}

export function getStoredAssignments(): HomeworkAssignment[] {
  return getStore().assignments;
}

export function getStoredGrades(): HomeworkGrade[] {
  return getStore().grades;
}

export function getLatestGrade(studentId: string): HomeworkGrade | null {
  const grades = getStore().grades;
  const studentGrades = grades.filter((g) => g.studentId === studentId && g.status === "Graded");
  if (studentGrades.length === 0) return null;
  return studentGrades.sort((a, b) => b.submittedDate.localeCompare(a.submittedDate))[0];
}

export async function addAssignment(assignment: Omit<HomeworkAssignment, "id" | "createdAt">): Promise<{ record: HomeworkAssignment; httpStatus: number; error?: string }> {
  const record: HomeworkAssignment = {
    ...assignment,
    id: `hw-${Date.now()}`,
    createdAt: new Date().toISOString().substring(0, 10),
  };

  const store = getStore();
  saveStore({ ...store, assignments: [record, ...store.assignments] });

  let httpStatus = 201;
  let error: string | undefined;
  try {
    const { status, error: dbErr } = await supabase.from("homework_assignments").insert([{
      title: record.title,
      subject: record.subject,
      description: record.description,
      batch_id: record.batchId,
      batch_name: record.batchName,
      due_date: record.dueDate,
      teacher_phone: record.teacherPhone,
      teacher_name: record.teacherName,
      practice_sheet_url: record.practiceSheetUrl || null,
    }]).select();
    if (dbErr) error = dbErr.message;
    else httpStatus = status ?? 201;
  } catch (err: any) {
    error = err?.message;
  }
  return { record, httpStatus, error };
}

export async function saveGrade(grade: HomeworkGrade): Promise<{ httpStatus: number; error?: string }> {
  const store = getStore();
  const existing = store.grades.findIndex(
    (g) => g.assignmentId === grade.assignmentId && g.studentId === grade.studentId
  );
  let updatedGrades: HomeworkGrade[];
  if (existing >= 0) {
    updatedGrades = [...store.grades];
    updatedGrades[existing] = grade;
  } else {
    updatedGrades = [grade, ...store.grades];
  }
  saveStore({ ...store, grades: updatedGrades });

  let httpStatus = 200;
  let error: string | undefined;
  try {
    const { status, error: dbErr } = await supabase
      .from("homework_submissions")
      .upsert([{
        assignment_id: grade.assignmentId,
        student_id: grade.studentId,
        student_name: grade.studentName,
        score: grade.score,
        grade: grade.grade,
        feedback: grade.feedback,
        status: grade.status,
        submitted_date: grade.submittedDate,
      }], { onConflict: "assignment_id,student_id" })
      .select();
    if (dbErr) error = dbErr.message;
    else httpStatus = status ?? 200;
  } catch (err: any) {
    error = err?.message;
  }
  return { httpStatus, error };
}

export function subscribeToHomeworkUpdates(callback: (store: HomeworkStore) => void): () => void {
  const handler = (e: Event) => {
    const ev = e as CustomEvent<HomeworkStore>;
    callback(ev.detail ?? getStore());
  };
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback(getStore());
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
