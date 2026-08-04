import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mhdcjaphoncuifhvdyat.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XgYI0zcUPNh6HZK7nZeKcA_yUxsMw5b';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & SCHEMAS FOR PLATFORM PORTALS
═══════════════════════════════════════════════════════════════════════════ */

export interface Lead {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  courseInterest: string;
  status: 'New' | 'Claimed' | 'Called' | 'In Progress' | 'Interested' | 'Follow-up' | 'Converted' | 'Rejected';
  claimedBy?: string | null;
  assignedEmployeeId?: string | null;
  source?: 'Ad Click' | 'Google Form' | 'Social DM';
  callNotes: { date: string; note: string; agent: string }[];
  paymentConfirmed?: boolean;
  paymentAmount?: number;
  trxId?: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'teacher' | 'guardian';
}

export interface TeacherAttendanceRecord {
  studentId: string;
  studentName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface HomeworkGrade {
  id: string;
  studentName: string;
  homeworkTitle: string;
  submittedDate: string;
  score: number; // 0 to 100
  grade: string; // A+, A, B, C
  feedback: string;
  status: 'Graded' | 'Pending';
}

export interface GuardianReportCard {
  studentName: string;
  courseName: string;
  overallAttendance: number; // percentage
  handwritingScore: number; // 0 to 100
  speedScore: number; // 0 to 100
  teacherRemarks: string;
  upcomingZoomLink: string;
  nextClassTime: string;
  recentGrades: HomeworkGrade[];
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalStudents: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Telesales' | 'Teacher' | 'Admin';
  status: 'Active' | 'Deactivated';
  tempPassword?: string;
  createdAt?: string;
}

export interface CourseExtraCost {
  id: string;
  courseTitle: string;
  printingCost: number;
  inboundFreight: number;
  courierFee: number;
  totalExpense: number;
  unitPrice: number;
  netMargin: number;
}

export interface DeliveryRecord {
  id: string;
  studentName: string;
  phone: string;
  address: string;
  courierService: 'Steadfast' | 'Pathao' | 'Paperfly';
  consignmentId: string;
  trxId: string;
  deliveryStatus: 'Pending' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Returned';
  date: string;
}

