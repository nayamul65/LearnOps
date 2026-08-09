export type GuardianTab =
  | "dashboard"
  | "live-classes"
  | "homework-upload"
  | "settings";

export interface StudentProfile {
  studentId: string;
  parentId: string; // Used for authorization check (guardian.parent_id)
  studentName: string;
  studentNameEN: string;
  avatar: string;
  gradeLevel: string;
  batch: string;
  batchEN: string;
  courseName: string;
  courseNameEN: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  handwritingScore: number;
  speedScore: number;
  overallGrade: string;
  starsEarned: number;
  totalStars: number;
  teacherName: string;
  teacherTitle: string;
  teacherPhone: string;
  teacherAvatar: string;
  teacherRemarks: string;
  teacherRemarksEN: string;
  upcomingClassTime: string;
  upcomingClassTimeEN: string;
  nextClassDateISO: string; // Used for live countdown
  zoomLink: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  titleEN: string;
  description: string;
  descriptionEN: string;
  icon: string;
  color: string;
  bg: string;
  unlockedAt: string;
}

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  title: string;
  titleEN: string;
  lessonNo: number;
  dueDate: string;
  submittedDate?: string;
  status: "Pending" | "Submitted" | "Graded";
  score?: number;
  maxScore?: number;
  grade?: string;
  feedback?: string;
  teacherSummary?: string;
  teacherInspection?: string;
  reviewDate?: string;
  previewUrl?: string;
}

export interface NotificationItem {
  id: string;
  type: "homework" | "class" | "feedback" | "billing";
  title: string;
  titleEN: string;
  message: string;
  messageEN: string;
  timestamp: string;
  read: boolean;
  linkTab?: GuardianTab;
}

export interface WorkGalleryItem {
  id: string;
  title: string;
  titleEN: string;
  date: string;
  score: number;
  beforeImg: string;
  afterImg: string;
  remarks: string;
  remarksEN: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNo: string;
  courseName: string;
  method: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
}
