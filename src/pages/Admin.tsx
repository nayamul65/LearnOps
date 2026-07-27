import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  Users,
  BookOpen,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Save,
  Video,
  UserCheck,
  PhoneCall,
  X,
  RefreshCw,
  ShieldCheck,
  Building,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Award,
  Loader2,
  ExternalLink,
  MessageCircle,
  Megaphone,
  FileText,
  UserPlus,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { supabase, Lead, UserProfile } from "../lib/supabase";
import { useLanguage } from "../app/context/LanguageContext";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & MOCK DATA SCHEMAS
═══════════════════════════════════════════════════════════════════════════ */

export interface CMSCourse {
  id: string | number;
  title: string;
  price: number;
  duration: string;
  instructor: string;
  category: string;
  description: string;
  imageUrl: string;
  demoVideoUrl: string;
  googleFormUrl?: string;
  headTeacher?: string;
}

export interface EmployeePerf {
  id: string;
  name: string;
  role: string;
  status: "Online" | "Idle" | "Offline";
  totalCalls: number;
  convertedSales: number;
  revenueGenerated: number;
  socialDmConversion: number; // %
  adLeadConversion: number; // %
}

export interface StudentRosterItem {
  id: string;
  name: string;
  parentName: string;
  rollNo: string;
  attendancePercentage: number;
  avgExamScore: number;
  grade: string;
  status: "Active" | "Completed";
}

export interface BatchItem {
  id: string;
  name: string;
  courseTitle: string;
  headTeacher: string;
  totalStudents: number;
  schedule: string;
  roster: StudentRosterItem[];
}

const INITIAL_COURSES: CMSCourse[] = [
  {
    id: "c-101",
    title: "২৫ দিনে সুন্দর হাতের লেখা",
    price: 2500,
    duration: "২৫ দিন",
    instructor: "ফারহানা বেগম",
    headTeacher: "ফারহানা বেগম",
    category: "হাতের লেখা",
    description: "স্বল্প সময়ে বর্ণমালা গঠন, লাইনের সোজা ভাব এবং দ্রুত ও সুন্দর হাতের লেখার বিশেষ টেকনিক।",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
  },
  {
    id: "c-102",
    title: "মাত্র ৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    price: 2000,
    duration: "৩০ দিন",
    instructor: "রাহেলা খাতুন",
    headTeacher: "রাহেলা খাতুন",
    category: "হাতের লেখা",
    description: "ছোট বাচ্চাদের পেন্সিল গ্রিপ, স্টক প্র্যাকটিস এবং বর্ণমালার নিখুঁত আকৃতি শেখানোর কোর্স।",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
  },
  {
    id: "c-103",
    title: "8 WEEKS ENGLISH SPEAKING (start program)",
    price: 3500,
    duration: "৮ সপ্তাহ",
    instructor: "মো. আরিফুল ইসলাম",
    headTeacher: "মো. আরিফুল ইসলাম",
    category: "ইংরেজি স্পোকেন",
    description: "শিশুদের জড়তা কাটিয়ে ফ্লুয়েন্টলি ইংরেজিতে কথা বলার আত্মবিশ্বাস তৈরির প্রোগ্রাম।",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
  },
];

const INITIAL_EMPLOYEES: EmployeePerf[] = [
  {
    id: "emp-1",
    name: "আরিফুল ইসলাম",
    role: "Senior Sales Representative",
    status: "Online",
    totalCalls: 142,
    convertedSales: 28,
    revenueGenerated: 70000,
    socialDmConversion: 42,
    adLeadConversion: 28,
  },
  {
    id: "emp-2",
    name: "ফারহানা বেগম",
    role: "Telesales Executive",
    status: "Online",
    totalCalls: 118,
    convertedSales: 22,
    revenueGenerated: 55000,
    socialDmConversion: 38,
    adLeadConversion: 24,
  },
  {
    id: "emp-3",
    name: "রাহেলা খাতুন",
    role: "Customer Success Officer",
    status: "Idle",
    totalCalls: 96,
    convertedSales: 19,
    revenueGenerated: 47500,
    socialDmConversion: 35,
    adLeadConversion: 22,
  },
  {
    id: "emp-4",
    name: "সুমাইয়া আক্তার",
    role: "Sales Associate",
    status: "Offline",
    totalCalls: 75,
    convertedSales: 14,
    revenueGenerated: 35000,
    socialDmConversion: 30,
    adLeadConversion: 18,
  },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-101",
    studentName: "আরাফ হোসেন",
    parentName: "সামিরা সুলতানা",
    phone: "01711-223344",
    courseInterest: "২৫ দিনে সুন্দর হাতের লেখা",
    status: "Converted",
    source: "Ad Click",
    claimedBy: "আরিফুল ইসলাম",
    assignedEmployeeId: "emp-1",
    paymentConfirmed: true,
    paymentAmount: 2500,
    trxId: "BK892310X",
    callNotes: [{ date: "2026-07-25", note: "বিকাশ পেমেন্ট কনফার্মড", agent: "আরিফুল ইসলাম" }],
    date: "2026-07-25",
  },
  {
    id: "lead-102",
    studentName: "তাহিয়া রহমান",
    parentName: "মাহাবুব আলম",
    phone: "01822-334455",
    courseInterest: "৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    status: "In Progress",
    source: "Google Form",
    claimedBy: "ফারহানা বেগম",
    assignedEmployeeId: "emp-2",
    callNotes: [{ date: "2026-07-26", note: "আগামীকাল বিকাশ করবেন", agent: "ফারহানা বেগম" }],
    date: "2026-07-26",
  },
  {
    id: "lead-103",
    studentName: "সামিন চৌধুরী",
    parentName: "নাসরিন পারভীন",
    phone: "01933-445566",
    courseInterest: "8 WEEKS ENGLISH SPEAKING",
    status: "Converted",
    source: "Social DM",
    claimedBy: "রাহেলা খাতুন",
    assignedEmployeeId: "emp-3",
    paymentConfirmed: true,
    paymentAmount: 3500,
    trxId: "NG901234Y",
    callNotes: [{ date: "2026-07-24", note: "নগদ পেমেন্ট সফল", agent: "রাহেলা খাতুন" }],
    date: "2026-07-24",
  },
  {
    id: "lead-104",
    studentName: "তানভীর আহম্মেদ",
    parentName: "রেজাউল করিম",
    phone: "01644-556677",
    courseInterest: "২৫ দিনে সুন্দর হাতের লেখা",
    status: "New",
    source: "Ad Click",
    claimedBy: null,
    assignedEmployeeId: null,
    callNotes: [],
    date: "2026-07-27",
  },
  {
    id: "lead-105",
    studentName: "নুসাইবা পারভীন",
    parentName: "জহিরুল ইসলাম",
    phone: "01555-112233",
    courseInterest: "২৫ দিনে সুন্দর হাতের লেখা",
    status: "In Progress",
    source: "Google Form",
    claimedBy: null,
    assignedEmployeeId: null,
    callNotes: [],
    date: "2026-07-27",
  },
  {
    id: "lead-106",
    studentName: "আতিয়া ফারহিন",
    parentName: "ফারুক আহমেদ",
    phone: "01788-332211",
    courseInterest: "৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    status: "Rejected",
    source: "Social DM",
    claimedBy: "সুমাইয়া আক্তার",
    assignedEmployeeId: "emp-4",
    callNotes: [{ date: "2026-07-26", note: "সময়সূচি মেলেনি", agent: "সুমাইয়া আক্তার" }],
    date: "2026-07-26",
  },
];

const INITIAL_BATCHES: BatchItem[] = [
  {
    id: "batch-101",
    name: "ব্যাচ ০৪ (বিকাল ৪:০০ টা)",
    courseTitle: "২৫ দিনে সুন্দর হাতের লেখা",
    headTeacher: "ফারহানা বেগম",
    totalStudents: 5,
    schedule: "শনিবার-সোমবার-বুধবার (বিকাল ৪:০০)",
    roster: [
      { id: "std-1", name: "আরাফ হোসেন", parentName: "সামিরা সুলতানা", rollNo: "01", attendancePercentage: 96, avgExamScore: 94, grade: "A+", status: "Active" },
      { id: "std-2", name: "তাহিয়া রহমান", parentName: "মাহাবুব আলম", rollNo: "02", attendancePercentage: 92, avgExamScore: 88, grade: "A", status: "Active" },
      { id: "std-3", name: "সামিন চৌধুরী", parentName: "নাসরিন পারভীন", rollNo: "03", attendancePercentage: 88, avgExamScore: 82, grade: "A", status: "Active" },
      { id: "std-4", name: "তানভীর আহম্মেদ", parentName: "রেজাউল করিম", rollNo: "04", attendancePercentage: 90, avgExamScore: 85, grade: "A", status: "Active" },
      { id: "std-5", name: "নুসাইবা পারভীন", parentName: "জহিরুল ইসলাম", rollNo: "05", attendancePercentage: 100, avgExamScore: 98, grade: "A+", status: "Active" },
    ],
  },
  {
    id: "batch-102",
    name: "ব্যাচ ০২ (সকাল ১০:০০ টা)",
    courseTitle: "মাত্র ৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    headTeacher: "রাহেলা খাতুন",
    totalStudents: 3,
    schedule: "রবি-মঙ্গল-বৃহস্পতিবার (সকাল ১০:০০)",
    roster: [
      { id: "std-6", name: "মারুফ হাসান", parentName: "কামরুল হাসান", rollNo: "01", attendancePercentage: 94, avgExamScore: 90, grade: "A+", status: "Active" },
      { id: "std-7", name: "আতিয়া ফারহিন", parentName: "ফারুক আহমেদ", rollNo: "02", attendancePercentage: 90, avgExamScore: 86, grade: "A", status: "Active" },
      { id: "std-8", name: "জায়ান করিম", parentName: "রেজাউল করিম", rollNo: "03", attendancePercentage: 96, avgExamScore: 92, grade: "A+", status: "Active" },
    ],
  },
];

const WEEKLY_CHART = [
  { name: "Sat", revenue: 12000, sales: 5 },
  { name: "Sun", revenue: 18500, sales: 7 },
  { name: "Mon", revenue: 15000, sales: 6 },
  { name: "Tue", revenue: 22000, sales: 9 },
  { name: "Wed", revenue: 28000, sales: 11 },
  { name: "Thu", revenue: 24500, sales: 10 },
  { name: "Fri", revenue: 32000, sales: 13 },
];

const MONTHLY_CHART = [
  { name: "Week 1", revenue: 85000, sales: 34 },
  { name: "Week 2", revenue: 110000, sales: 45 },
  { name: "Week 3", revenue: 145000, sales: 58 },
  { name: "Week 4", revenue: 175000, sales: 70 },
];

const YEARLY_CHART = [
  { name: "Q1", revenue: 350000, sales: 140 },
  { name: "Q2", revenue: 480000, sales: 190 },
  { name: "Q3", revenue: 620000, sales: 250 },
  { name: "Q4", revenue: 850000, sales: 340 },
];

export default function Admin() {
  const { t, isEnglish } = useLanguage();
  
  // Navigation Sidebar & Loading States
  const [activeTab, setActiveTab] = useState<"sales" | "leads" | "employees" | "batches" | "courses" | "customization">("sales");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── DATA STATES ──
  const [courses, setCourses] = useState<CMSCourse[]>(INITIAL_COURSES);
  const [employees, setEmployees] = useState<EmployeePerf[]>(INITIAL_EMPLOYEES);
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>("batch-101");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // ── SALES ANALYTICS FILTERS ──
  const [salesTimePeriod, setSalesTimePeriod] = useState<"Weekly" | "Monthly" | "Yearly">("Weekly");
  const [salesCourseFilter, setSalesCourseFilter] = useState<string>("All");

  // ── LEAD MANAGEMENT FILTERS ──
  const [leadSourceFilter, setLeadSourceFilter] = useState<"All" | "Ad Click" | "Google Form" | "Social DM">("All");
  const [leadClaimFilter, setLeadClaimFilter] = useState<"All" | "Unassigned" | "Assigned">("All");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");

  // ── WEBSITE CUSTOMIZATION STATE ──
  const [siteConfig, setSiteConfig] = useState({
    heroTitle: "আপনার সন্তানের হাতের লেখা ও পড়া হোক নিখুঁত ও চমৎকার",
    heroSubtitle: "অভিজ্ঞ মেন্টরদের সাথে সরাসরি লাইভ ক্লাসে মাত্র ২৫ দিনে হাতের লেখা ও পড়ার জড়তা কাটান।",
    mainBannerUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=600&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  });
  const [customizationSavedMessage, setCustomizationSavedMessage] = useState(false);

  // ── COURSE FORM MODAL STATE ──
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | number | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    price: "2500",
    duration: "২৫ দিন",
    instructor: "রাহেলা খাতুন",
    category: "হাতের লেখা",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
  });

  // ── SUPABASE LOAD FUNCTION WITH CATCH & CONSOLE.ERROR ──
  const fetchSupabaseData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Users (Sales reps)
      const { data: dbUsers, error: usersErr } = await supabase.from("users").select("*");
      if (usersErr) console.error("Error fetching users from Supabase:", usersErr);
      else if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
      }

      // 2. Fetch Courses
      const { data: dbCourses, error: courseErr } = await supabase.from("courses").select("*");
      if (courseErr) console.error("Error fetching courses from Supabase:", courseErr);
      else if (dbCourses && dbCourses.length > 0) {
        setCourses(
          dbCourses.map((c: any) => ({
            id: c.id,
            title: c.title || c.name,
            price: c.price || 2500,
            duration: c.duration || "১ মাস",
            instructor: c.instructor || "ইনস্ট্রাক্টর",
            headTeacher: c.head_teacher || c.instructor || "প্রধান শিক্ষক",
            category: c.category || "General",
            description: c.description || "",
            imageUrl: c.image_url || c.imageUrl || INITIAL_COURSES[0].imageUrl,
            demoVideoUrl: c.demo_video_url || c.demoVideoUrl || INITIAL_COURSES[0].demoVideoUrl,
            googleFormUrl: c.google_form_url || c.googleFormUrl || "https://forms.google.com/demo-enrollment-form",
          }))
        );
      }

      // 3. Fetch Leads
      const { data: dbLeads, error: leadErr } = await supabase.from("leads").select("*");
      if (leadErr) console.error("Error fetching leads from Supabase:", leadErr);
      else if (dbLeads && dbLeads.length > 0) {
        setLeads(
          dbLeads.map((l: any) => {
            // Join with users list to map assigned_employee_id
            const matchedUser = dbUsers?.find((u: any) => u.id === l.assigned_employee_id);
            return {
              id: l.id,
              studentName: l.student_name || l.studentName || "শিক্ষার্থী",
              parentName: l.parent_name || l.parentName || "অভিভাবক",
              phone: l.phone || "",
              courseInterest: l.course_interest || l.courseInterest || "কোর্স",
              status: l.status || "New",
              source: l.source || "Ad Click",
              claimedBy: matchedUser?.name || l.claimed_by || l.claimedBy || null,
              assignedEmployeeId: l.assigned_employee_id || null,
              paymentConfirmed: l.payment_confirmed || l.paymentConfirmed || false,
              paymentAmount: l.amount_paid || l.paymentAmount || 0,
              trxId: l.trx_id || l.trxId || "",
              callNotes: l.call_notes || [],
              date: l.created_at ? l.created_at.substring(0, 10) : "2026-07-27",
            };
          })
        );
      }
    } catch (err) {
      console.error("Supabase live sync exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
  }, []);

  // ── FILTERED LEADS PIPELINE ──
  const filteredLeadsPipeline = leads.filter((lead) => {
    // 1. Source Filter
    if (leadSourceFilter !== "All" && lead.source !== leadSourceFilter) {
      return false;
    }

    // 2. Claim Status Filter
    if (leadClaimFilter === "Unassigned" && lead.claimedBy) {
      return false;
    }
    if (leadClaimFilter === "Assigned" && !lead.claimedBy) {
      return false;
    }

    // 3. Search Query Filter
    if (leadSearchQuery.trim()) {
      const q = leadSearchQuery.toLowerCase();
      const matchName = lead.studentName.toLowerCase().includes(q) || lead.parentName.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchCourse = lead.courseInterest.toLowerCase().includes(q);
      return matchName || matchPhone || matchCourse;
    }

    return true;
  });

  // ── FILTERED BUYERS (For Sales Analytics) ──
  const buyersList = leads
    .filter((l) => l.status === "Converted" || l.paymentConfirmed)
    .map((l) => ({
      id: l.id,
      studentName: l.studentName,
      parentName: l.parentName,
      phone: l.phone,
      course: l.courseInterest,
      amount: l.paymentAmount || 2500,
      trxId: l.trxId || "BK000000",
      date: l.date,
    }));

  const filteredBuyers = buyersList.filter((b) => {
    if (salesCourseFilter !== "All" && b.course !== salesCourseFilter) {
      return false;
    }
    return true;
  });

  const chartData =
    salesTimePeriod === "Weekly"
      ? WEEKLY_CHART
      : salesTimePeriod === "Monthly"
      ? MONTHLY_CHART
      : YEARLY_CHART;

  const totalFilteredRevenue = filteredBuyers.reduce((acc, curr) => acc + curr.amount, 0);

  // ── LEAD ACTIONS & REASSIGN HANDLERS ──
  const handleUpdateLeadStatus = async (leadId: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    try {
      const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
      if (error) console.error("Error updating lead status in Supabase:", error);
    } catch (err) {
      console.error("Exception updating lead status:", err);
    }
  };

  const handleReassignLeadRep = async (leadId: string, repName: string) => {
    const assignedName = repName === "Unassigned" ? null : repName;
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, claimedBy: assignedName } : l))
    );
    try {
      const { error } = await supabase
        .from("leads")
        .update({ assigned_employee_id: assignedName, claimed_by: assignedName })
        .eq("id", leadId);
      if (error) console.error("Error reassigning lead in Supabase:", error);
    } catch (err) {
      console.error("Exception reassigning lead:", err);
    }
  };

  // ── SET HEAD TEACHER HANDLER ──
  const handleSetHeadTeacher = async (courseId: string | number, teacherName: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, headTeacher: teacherName, instructor: teacherName } : c))
    );
    try {
      const { error } = await supabase
        .from("courses")
        .update({ head_teacher: teacherName, instructor: teacherName })
        .eq("id", courseId);
      if (error) console.error("Error setting head teacher in Supabase:", error);
    } catch (err) {
      console.error("Exception setting head teacher:", err);
    }
  };

  // ── COURSE CMS HANDLERS ──
  const handleOpenCreateCourse = () => {
    setEditingCourseId(null);
    setCourseForm({
      title: "",
      price: "2500",
      duration: "২৫ দিন",
      instructor: "রাহেলা খাতুন",
      category: "হাতের লেখা",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
      demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      googleFormUrl: "https://forms.google.com/demo-enrollment-form",
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: CMSCourse) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      price: String(course.price),
      duration: course.duration,
      instructor: course.instructor,
      category: course.category,
      description: course.description,
      imageUrl: course.imageUrl,
      demoVideoUrl: course.demoVideoUrl,
      googleFormUrl: course.googleFormUrl || "https://forms.google.com/demo-enrollment-form",
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    if (editingCourseId) {
      // Update local state
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourseId
            ? {
                ...c,
                title: courseForm.title,
                price: Number(courseForm.price),
                duration: courseForm.duration,
                instructor: courseForm.instructor,
                category: courseForm.category,
                description: courseForm.description,
                imageUrl: courseForm.imageUrl,
                demoVideoUrl: courseForm.demoVideoUrl,
                googleFormUrl: courseForm.googleFormUrl,
              }
            : c
        )
      );
      // Supabase Update
      try {
        const { error } = await supabase
          .from("courses")
          .update({
            title: courseForm.title,
            price: Number(courseForm.price),
            duration: courseForm.duration,
            instructor: courseForm.instructor,
            category: courseForm.category,
            description: courseForm.description,
            image_url: courseForm.imageUrl,
            demo_video_url: courseForm.demoVideoUrl,
            google_form_url: courseForm.googleFormUrl,
          })
          .eq("id", editingCourseId);
        if (error) console.error("Error updating course in Supabase:", error);
      } catch (err) {
        console.error("Exception updating course:", err);
      }
    } else {
      // Create local state
      const newCourse: CMSCourse = {
        id: `c-${Date.now()}`,
        title: courseForm.title,
        price: Number(courseForm.price),
        duration: courseForm.duration,
        instructor: courseForm.instructor,
        headTeacher: courseForm.instructor,
        category: courseForm.category,
        description: courseForm.description,
        imageUrl: courseForm.imageUrl,
        demoVideoUrl: courseForm.demoVideoUrl,
        googleFormUrl: courseForm.googleFormUrl,
      };
      setCourses((prev) => [newCourse, ...prev]);

      // Supabase Insert
      try {
        const { error } = await supabase.from("courses").insert([
          {
            title: courseForm.title,
            price: Number(courseForm.price),
            duration: courseForm.duration,
            instructor: courseForm.instructor,
            category: courseForm.category,
            description: courseForm.description,
            image_url: courseForm.imageUrl,
            demo_video_url: courseForm.demoVideoUrl,
            google_form_url: courseForm.googleFormUrl,
          },
        ]);
        if (error) console.error("Error creating course in Supabase:", error);
      } catch (err) {
        console.error("Exception creating course:", err);
      }
    }

    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = async (id: string | number) => {
    if (confirm("আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      try {
        const { error } = await supabase.from("courses").delete().eq("id", id);
        if (error) console.error("Error deleting course in Supabase:", error);
      } catch (err) {
        console.error("Exception deleting course:", err);
      }
    }
  };

  // ── SAVE WEBSITE CUSTOMIZATION ──
  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomizationSavedMessage(true);
    setTimeout(() => setCustomizationSavedMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      
      {/* ═══════════════════════════════════════════════════════════════════════════
         SLEEK LEFT SIDEBAR NAVIGATION MENU (6 SECTIONS)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white shadow-lg">
                  L
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  Learn<span className="text-emerald-400">Ops</span> Admin
                </span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mx-auto"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-2">
            {[
              { id: "sales", label: "📈 Sales Analytics", icon: TrendingUp, desc: "Revenue & Graphs" },
              { id: "leads", label: "👥 Lead Pipeline", icon: Users, desc: "Source & Claim Status" },
              { id: "employees", label: "🕵️ Employee Perf.", icon: PhoneCall, desc: "Telesales Metrics" },
              { id: "batches", label: "👨‍🏫 Teacher & Batches", icon: GraduationCap, desc: "Head Mentors & Roster" },
              { id: "courses", label: "📚 Course CMS", icon: BookOpen, desc: "Create & Edit" },
              { id: "customization", label: "🖼️ Customization", icon: ImageIcon, desc: "Hero & Media Links" },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {!isSidebarCollapsed && (
                    <div className="text-left leading-tight">
                      <div className="font-bold text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {item.label}
                      </div>
                      <div className={`text-[10px] ${isActive ? "text-emerald-100" : "text-slate-500"}`}>
                        {item.desc}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer System Status */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-300">Supabase Connected</span>
            </div>
            <button onClick={fetchSupabaseData} className="text-slate-400 hover:text-white" title="Refresh DB Data">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        )}
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════════════
         MAIN CONTENT AREA (RIGHT SIDE)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } p-6 sm:p-10 pb-20`}
      >
        {/* Header Title Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {activeTab === "sales" && "Revenue Graphs & Buyers List"}
                {activeTab === "leads" && "Inbound Lead Source & Claim Tracking"}
                {activeTab === "employees" && "Telesales Representative Conversion"}
                {activeTab === "batches" && "Head Teacher & Student Rosters"}
                {activeTab === "courses" && "Live Course Catalog Management"}
                {activeTab === "customization" && "Homepage Banner & Demo Video Links"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {activeTab === "sales" && "📈 সেলস অ্যানালিটিক্স ও বায়ার্স হিস্ট্রি"}
              {activeTab === "leads" && "👥 ইনবাউন্ড লিড ট্র্যাকিং ও অ্যাসাইনমেন্ট"}
              {activeTab === "employees" && "🕵️ সেলস রিপ্রেজেন্টেটিভ পারফরম্যান্স"}
              {activeTab === "batches" && "👨‍🏫 হেড টিচার ও ব্যাচ স্টুডেন্ট রোস্টার"}
              {activeTab === "courses" && "📚 কোর্স সিএমএস পোর্টাল (Course CMS)"}
              {activeTab === "customization" && "🖼️ ওয়েবসাইট ব্যানার ও ডেমো ভিডিও সেটিংস"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Supabase Syncing...
              </span>
            )}

            {activeTab === "courses" && (
              <button
                onClick={handleOpenCreateCourse}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                নতুন কোর্স যোগ করুন
              </button>
            )}
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 1: 📈 SALES ANALYTICS VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "sales" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Filter Controls Bar */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  সময়কাল নির্বাচন:
                </span>
                <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  {(["Weekly", "Monthly", "Yearly"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSalesTimePeriod(period)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        salesTimePeriod === period
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {period === "Weekly" ? "সাপ্তাহিক" : period === "Monthly" ? "মাসিক" : "বার্ষিক"} ({period})
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কোর্স ফিল্টার:
                </span>
                <select
                  value={salesCourseFilter}
                  onChange={(e) => setSalesCourseFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-2xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <option value="All">সব কোর্স (All Courses)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Colorful Revenue Chart Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    রেভিনিউ ও সেলস ট্রেন্ড ({salesTimePeriod})
                  </h3>
                  <p className="text-xs text-slate-400">ফিল্টারকৃত রেভিনিউ: <strong className="text-emerald-400">৳{totalFilteredRevenue.toLocaleString()}</strong></p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  +২২.৪% রেভিনিউ বৃদ্ধি
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Buyers List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কনফার্মড বায়ার্স তালিকা (Buyers List Table)
                </h3>
                <span className="text-xs text-slate-400">মোট বায়ার: {filteredBuyers.length} জন</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4">শিক্ষার্থী ও অভিভাবক</th>
                      <th className="py-4 px-4">ফোন নম্বর</th>
                      <th className="py-4 px-4">কোর্স</th>
                      <th className="py-4 px-4">পেমেন্ট (৳)</th>
                      <th className="py-4 px-4">Transaction ID</th>
                      <th className="py-4 px-4">তারিখ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                    {filteredBuyers.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{b.studentName}</div>
                          <div className="text-[11px] text-slate-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অভিভাবক: {b.parentName}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-emerald-400 font-bold">{b.phone}</td>
                        <td className="py-4 px-4 font-semibold text-slate-200" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{b.course}</td>
                        <td className="py-4 px-4 font-black text-emerald-400">৳{b.amount.toLocaleString()}</td>
                        <td className="py-4 px-4 font-mono text-amber-400 bg-slate-950 px-2 py-1 rounded-lg inline-block my-3">{b.trxId}</td>
                        <td className="py-4 px-4 text-slate-400">{b.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 2: 👥 LEAD MANAGEMENT PIPELINE VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "leads" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Filter Bar: Lead Source & Claim Status Toggles */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
              {/* Source Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  সোর্স ফিল্টার:
                </span>
                {[
                  { id: "All", label: "সব সোর্স", icon: Filter },
                  { id: "Ad Click", label: "Ads (Ad Click)", icon: Megaphone },
                  { id: "Google Form", label: "Google Forms", icon: FileText },
                  { id: "Social DM", label: "DMs (Social DM)", icon: MessageCircle },
                ].map((s) => {
                  const SIcon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setLeadSourceFilter(s.id as any)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadSourceFilter === s.id
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <SIcon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Claim Status Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  লকড স্ট্যাটাস:
                </span>
                <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  {(["All", "Unassigned", "Assigned"] as const).map((claimState) => (
                    <button
                      key={claimState}
                      onClick={() => setLeadClaimFilter(claimState)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadClaimFilter === claimState
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {claimState === "All" ? "সব" : claimState === "Unassigned" ? "Unassigned (ফ্রি)" : "Assigned (লকড)"}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Inbound Lead Tracking Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  ইনবাউন্ড লিড পাইপলাইন (Inbound Lead Tracking Pipeline)
                </h3>
                <span className="text-xs text-slate-400">প্রদর্শিত লিড: <strong className="text-emerald-400">{filteredLeadsPipeline.length}</strong> জন</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4">শিক্ষার্থী ও ফোন</th>
                      <th className="py-4 px-4">আগ্রহী কোর্স</th>
                      <th className="py-4 px-4">Lead Source (সোর্স)</th>
                      <th className="py-4 px-4">Claimed Rep (assigned_employee_id)</th>
                      <th className="py-4 px-4">Lead Status (অ্যাকশন)</th>
                      <th className="py-4 px-4 text-right">পেমেন্ট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                    {filteredLeadsPipeline.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        {/* Student Name & Phone */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                            {lead.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                            অভিভাবক: {lead.parentName}
                          </div>
                          <div className="font-mono text-emerald-400 font-bold text-xs mt-0.5">
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </div>
                        </td>

                        {/* Interested Course */}
                        <td className="py-4 px-4 font-semibold text-slate-200" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                          {lead.courseInterest}
                        </td>

                        {/* Lead Source Column */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                              lead.source === "Ad Click"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : lead.source === "Google Form"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            }`}
                          >
                            {lead.source === "Ad Click" && <Megaphone className="w-3.5 h-3.5" />}
                            {lead.source === "Google Form" && <FileText className="w-3.5 h-3.5" />}
                            {lead.source === "Social DM" && <MessageCircle className="w-3.5 h-3.5" />}
                            {lead.source || "Ad Click"}
                          </span>
                        </td>

                        {/* Claimed Status Column & Reassign Dropdown */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {lead.claimedBy ? (
                              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" />
                                {lead.claimedBy}
                              </div>
                            ) : (
                              <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
                                Unassigned (ফ্রি)
                              </div>
                            )}

                            {/* Dropdown to Reassign */}
                            <select
                              value={lead.claimedBy || "Unassigned"}
                              onChange={(e) => handleReassignLeadRep(lead.id, e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 text-[11px] font-bold text-white rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer mt-1"
                              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                              <option value="Unassigned">Unassigned (কোন প্রতিনিধি নয়)</option>
                              {employees.map((emp) => (
                                <option key={emp.id} value={emp.name}>
                                  {emp.name} ({emp.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Lead Action & Status Update Dropdown */}
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead["status"])}
                            className={`text-xs font-bold rounded-xl px-3 py-2 border cursor-pointer ${
                              lead.status === "Converted"
                                ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                                : lead.status === "In Progress" || lead.status === "Interested"
                                ? "bg-purple-950 text-purple-300 border-purple-500"
                                : lead.status === "Claimed" || lead.status === "Called"
                                ? "bg-blue-950 text-blue-300 border-blue-500"
                                : lead.status === "Rejected"
                                ? "bg-red-950 text-red-300 border-red-500"
                                : "bg-slate-950 text-slate-300 border-slate-700"
                            }`}
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                          >
                            <option value="New">New (নতুন)</option>
                            <option value="In Progress">In Progress (চলতি যোগাযোগ)</option>
                            <option value="Claimed">Claimed (লকড)</option>
                            <option value="Called">Called (কথা হয়েছে)</option>
                            <option value="Interested">Interested (আগ্রহী)</option>
                            <option value="Converted">Converted (পেমেন্ট সম্পন্ন)</option>
                            <option value="Rejected">Rejected (বাতিল)</option>
                          </select>
                        </td>

                        {/* Payment Confirmation */}
                        <td className="py-4 px-4 text-right font-bold">
                          {lead.paymentConfirmed ? (
                            <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                              ৳{lead.paymentAmount} ✓
                            </span>
                          ) : (
                            <span className="text-slate-500">বকেয়া</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 3: 🕵️ EMPLOYEE PERFORMANCE VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "employees" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Employee Performance Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        emp.status === "Online"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : emp.status === "Idle"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        ● {emp.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{emp.convertedSales}টি সেলস</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">{emp.role}</p>

                    <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-400">মোট কল নোটস:</span>
                        <span className="font-bold text-white">{emp.totalCalls}টি</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Social DM কনভার্সন:</span>
                        <span className="font-bold text-emerald-400">{emp.socialDmConversion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ad Lead কনভার্সন:</span>
                        <span className="font-bold text-blue-400">{emp.adLeadConversion}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">রেভিনিউ:</span>
                    <span className="font-extrabold text-amber-400 text-sm">৳{emp.revenueGenerated.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  টেলিসেলস রিপ্রেজেন্টেটিভস বিস্তারিত লিডারবোর্ড (Employee Performance Table)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4">কর্মকর্তার নাম</th>
                      <th className="py-4 px-4">পজিশন / রোল</th>
                      <th className="py-4 px-4">পোর্টালে সক্রিয়তা</th>
                      <th className="py-4 px-4">লগকৃত কল (call_notes)</th>
                      <th className="py-4 px-4">কনভার্টেড সেলস</th>
                      <th className="py-4 px-4">Social DM vs Ad Lead</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-white text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{emp.name}</td>
                        <td className="py-4 px-4 text-slate-400">{emp.role}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            emp.status === "Online" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                          }`}>
                            ● {emp.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-blue-400">{emp.totalCalls}টি কল</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">{emp.convertedSales}টি সেলস (৳{emp.revenueGenerated.toLocaleString()})</td>
                        <td className="py-4 px-4 text-slate-300">
                          DM: <strong className="text-emerald-400">{emp.socialDmConversion}%</strong> | Ad: <strong className="text-blue-400">{emp.adLeadConversion}%</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 4: 👨‍🏫 TEACHER & BATCH MANAGEMENT VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "batches" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Set Head Teacher for Courses Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কোর্সের প্রধান শিক্ষক নির্বাচন (Set Head Teacher)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-6" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                প্রতিটি কোর্সের হেড ইনস্ট্রাক্টর ড্রপডাউন থেকে নির্বাচন করুন। এটি সঙ্গে সঙ্গে ডাটাবেজে সংরক্ষিত হবে।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="font-bold text-sm text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      {course.title}
                    </div>
                    <div className="text-xs text-emerald-400">বর্তমান হেড টিচার: {course.headTeacher || course.instructor}</div>
                    
                    <select
                      value={course.headTeacher || course.instructor}
                      onChange={(e) => handleSetHeadTeacher(course.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <option value="রাহেলা খাতুন">রাহেলা খাতুন (হ্যান্ডরাইটিং বিশেষজ্ঞ)</option>
                      <option value="ফারহানা বেগম">ফারহানা বেগম (হস্তলিখন মেন্টর)</option>
                      <option value="মো. আরিফুল ইসলাম">মো. আরিফুল ইসলাম (স্পোকেন ট্রেইনার)</option>
                      <option value="সুমাইয়া আক্তার">সুমাইয়া আক্তার (ভাষা শিক্ষা বিশেষজ্ঞ)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable Batches List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                অ্যাক্টিভ ব্যাচসমূহ ও স্টুডেন্ট পারফরম্যান্স রোস্টার (Expandable Batches List)
              </h3>

              <div className="space-y-4">
                {batches.map((batch) => {
                  const isExpanded = expandedBatchId === batch.id;
                  return (
                    <div key={batch.id} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                      {/* Batch Header */}
                      <button
                        onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                        className="w-full p-5 flex items-center justify-between bg-slate-900 hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                              {batch.name} - <span className="text-emerald-400">{batch.courseTitle}</span>
                            </h4>
                            <p className="text-xs text-slate-400">হেড ইনস্ট্রাক্টর: {batch.headTeacher} | সময়সূচি: {batch.schedule}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {batch.totalStudents} জন শিক্ষার্থী
                          </span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </button>

                      {/* Expandable Student Roster */}
                      {isExpanded && (
                        <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            ফুল স্টুডেন্ট রোস্টার ও একাডেমি পারফরম্যান্স মার্কস
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {batch.roster.map((std) => (
                              <div key={std.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-amber-400">Roll #{std.rollNo}</span>
                                  <span className="text-xs font-black text-emerald-400">{std.grade}</span>
                                </div>
                                <h5 className="font-bold text-white text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                                  {std.name}
                                </h5>
                                <p className="text-[11px] text-slate-400">অভিভাবক: {std.parentName}</p>

                                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-semibold">
                                  <span>উপস্থিতি: <strong className="text-emerald-400">{std.attendancePercentage}%</strong></span>
                                  <span>গড় এক্সাম মার্কস: <strong className="text-purple-400">{std.avgExamScore}/১০০</strong></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 5: 📚 COURSE CMS VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all">
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                        {course.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-400/30">
                        ৳{course.price}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-white leading-snug" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {course.description}
                      </p>
                      
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        Google Form: <span className="text-emerald-400">{course.googleFormUrl}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                        <span>মেয়াদ: <strong className="text-white">{course.duration}</strong></span>
                        <span>ইনস্ট্রাক্টর: <strong className="text-emerald-400">{course.instructor}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => handleOpenEditCourse(course)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      সম্পাদনা (Edit)
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 6: 🖼️ WEBSITE CUSTOMIZATION VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "customization" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Inputs Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  হোমপেজ লাইভ হিরো ও মিডিয়া সেটিংস
                </h3>
              </div>

              {customizationSavedMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  ওয়েবসাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!
                </div>
              )}

              <form onSubmit={handleSaveCustomization} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ১. হোমপেজ হিরো শিরোনাম (Homepage Hero Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={siteConfig.heroTitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ২. হিরো সাব-টাইটেল (Hero Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={siteConfig.heroSubtitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ৩. মেইন ব্যানার ইমেজ URL (Main Banner Image URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteConfig.mainBannerUrl}
                    onChange={(e) => setSiteConfig({ ...siteConfig, mainBannerUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ৪. ডেমো ক্লাস ভিডিও URL (Demo Video Link)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteConfig.demoVideoUrl}
                    onChange={(e) => setSiteConfig({ ...siteConfig, demoVideoUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-purple-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm cursor-pointer"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <Save className="w-4 h-4" />
                  ওয়েবসাইট সেটিংস পরিবর্তন সেভ করুন ✓
                </button>
              </form>
            </div>

            {/* Live Interactive Preview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  লাইভ ওয়েবসাইট প্রিভিউ (Live Site Preview)
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 p-6 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full">
                    গ্যারান্টিযুক্ত শিখণ
                  </div>
                  <h2 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {siteConfig.heroTitle}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {siteConfig.heroSubtitle}
                  </p>

                  <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-800">
                    <img src={siteConfig.mainBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl">
                        <Video className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-500 italic text-center">
                এই আপডেটগুলো সঙ্গে সঙ্গে প্ল্যাটফর্মের ফ্রন্টেন্ডে রিফ্লেক্ট করবে।
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── CREATE / EDIT COURSE MODAL ── */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsCourseModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {editingCourseId ? "কোর্স এডিট করুন (Edit Course)" : "নতুন কোর্স তৈরি করুন (CMS)"}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কোর্সের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-emerald-500"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    কোর্স ফি (টাকা) *
                  </label>
                  <input
                    type="number"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-emerald-400 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    মেয়াদ
                  </label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-emerald-500"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  প্রধান ইনস্ট্রাক্টর
                </label>
                <input
                  type="text"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-emerald-500"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  গুগল ফর্ম লিংক (Google Form URL)
                </label>
                <input
                  type="url"
                  value={courseForm.googleFormUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, googleFormUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  ইমেজ URL
                </label>
                <input
                  type="url"
                  value={courseForm.imageUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কোর্স বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-emerald-500 resize-none"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer shadow-md"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {editingCourseId ? "পরিবর্তন সেভ করুন ✓" : "কোর্স পাবলিশ করুন ✓"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
