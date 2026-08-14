import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  BarChart2,
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
  Menu,
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
  Sun,
  Moon,
  Globe,
  Truck,
  Receipt,
  KeyRound,
  UserX,
  Package,
  MapPin,
  ShieldAlert,
  Lock,
  LogOut,
  LogIn,
  User,
  Check,
  Eye,
  EyeOff,
  PackageCheck,
  ShoppingBag,
  TrendingDown,
  Percent,
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
import { supabase, Lead, UserProfile, StaffMember, CourseExtraCost, DeliveryRecord } from "../lib/supabase";
import { useLanguage } from "../app/context/LanguageContext";
import {
  getStoredCourses,
  saveAllCourses,
  addOrUpdateCourse,
  removeCourse,
  subscribeToCourseUpdates,
  UnifiedCourse,
  DEFAULT_COURSES,
} from "../services/courseStore";
import {
  getStoredBatches,
  addOrUpdateBatch,
  removeBatch,
  subscribeToBatchUpdates,
  DEFAULT_BATCHES,
} from "../services/batchStore";
import {
  getStoredStaff,
  addOrUpdateStaff,
  subscribeToStaffUpdates,
  saveAllStaff,
} from "../services/staffStore";

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
  [key: string]: any;
}

export interface OuterExpense {
  id: string;
  title: string;
  category: "Marketing" | "Hiring" | "Books & Materials" | "Software" | "Logistics" | "Operations";
  amount: number;
  date: string;
  notes?: string;
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
  phone?: string;
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
  courseId?: string | number;
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

const INITIAL_OUTER_EXPENSES: OuterExpense[] = [
  {
    id: "exp-1",
    title: "Meta Lead Generation Ad Campaign (July)",
    category: "Marketing",
    amount: 35000,
    date: "2026-07-20",
    notes: "Targeted parents aged 28-45 across Dhaka & Chittagong",
  },
  {
    id: "exp-2",
    title: "Batch 4 Student Workbooks & Handwriting Practice Books",
    category: "Books & Materials",
    amount: 42000,
    date: "2026-07-15",
    notes: "200 premium sets printed with 100gsm high quality paper",
  },
  {
    id: "exp-3",
    title: "Telesales Executive & English Teacher Recruitment (BDJobs)",
    category: "Hiring",
    amount: 15000,
    date: "2026-07-10",
    notes: "Recruited 2 new Telesales agents and 1 English teacher",
  },
  {
    id: "exp-4",
    title: "Zoom Education & Cloud Hosting Subscriptions",
    category: "Software",
    amount: 8500,
    date: "2026-07-05",
    notes: "Monthly Zoom Pro enterprise licenses for 10 teachers",
  },
  {
    id: "exp-5",
    title: "Courier Express Delivery Bulk Advance (Steadfast)",
    category: "Logistics",
    amount: 12000,
    date: "2026-07-02",
    notes: "Advance balance for door-to-door book deliveries",
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
    courseId: "c-101",
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
    courseId: "c-102",
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
  {
    id: "batch-103",
    courseId: "c-103",
    name: "ব্যাচ ০১ (রাত ৮:০০ টা)",
    courseTitle: "8 WEEKS ENGLISH SPEAKING (start program)",
    headTeacher: "মো. আরিফুল ইসলাম",
    totalStudents: 4,
    schedule: "শনিবার-সোম-বুধবার (রাত ৮:০০)",
    roster: [
      { id: "std-9", name: "রাফসান জামান", parentName: "আরিফ জামান", rollNo: "01", attendancePercentage: 95, avgExamScore: 91, grade: "A+", status: "Active" },
      { id: "std-10", name: "মেহজাবিন মেহনাজ", parentName: "মেহেদী হাসান", rollNo: "02", attendancePercentage: 88, avgExamScore: 85, grade: "A", status: "Active" },
      { id: "std-11", name: "সামিউল ইসলাম", parentName: "শহিদুল ইসলাম", rollNo: "03", attendancePercentage: 92, avgExamScore: 89, grade: "A+", status: "Active" },
      { id: "std-12", name: "অনন্যা চৌধুরী", parentName: "কবীর চৌধুরী", rollNo: "04", attendancePercentage: 98, avgExamScore: 96, grade: "A+", status: "Active" },
    ],
  },
];

const INITIAL_STAFF: StaffMember[] = [
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
    createdAt: "2026-07-12",
  },
];

const INITIAL_EXTRA_COSTS: CourseExtraCost[] = [
  {
    id: "cost-1",
    courseTitle: "২৫ দিনে সুন্দর হাতের লেখা",
    printingCost: 350,
    inboundFreight: 80,
    courierFee: 120,
    totalExpense: 550,
    unitPrice: 2500,
    netMargin: 1950,
  },
  {
    id: "cost-2",
    courseTitle: "মাত্র ৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    printingCost: 300,
    inboundFreight: 70,
    courierFee: 110,
    totalExpense: 480,
    unitPrice: 2000,
    netMargin: 1520,
  },
  {
    id: "cost-3",
    courseTitle: "8 WEEKS ENGLISH SPEAKING (start program)",
    printingCost: 450,
    inboundFreight: 100,
    courierFee: 130,
    totalExpense: 680,
    unitPrice: 3500,
    netMargin: 2820,
  },
];

const INITIAL_DELIVERIES: DeliveryRecord[] = [
  {
    id: "del-101",
    studentName: "আরাফ হোসেন",
    phone: "01711-223344",
    address: "হাউজ ১২, রোড ৫, ধানমন্ডি, ঢাকা",
    courierService: "Steadfast",
    consignmentId: "STEAD-890123",
    trxId: "BK892310X",
    deliveryStatus: "Delivered",
    date: "2026-07-25",
  },
  {
    id: "del-102",
    studentName: "তাহিয়া রহমান",
    phone: "01822-334455",
    address: "ব্লক সি, আফতাবনগর, ঢাকা",
    courierService: "Pathao",
    consignmentId: "PATHAO-445129",
    trxId: "BK991204P",
    deliveryStatus: "In Transit",
    date: "2026-07-26",
  },
  {
    id: "del-103",
    studentName: "সামিন চৌধুরী",
    phone: "01933-445566",
    address: "১৫ জিইসি সার্কেল, চট্টগ্রাম",
    courierService: "Steadfast",
    consignmentId: "STEAD-901244",
    trxId: "NG901234Y",
    deliveryStatus: "Dispatched",
    date: "2026-07-27",
  },
  {
    id: "del-104",
    studentName: "মারুফ হাসান",
    phone: "01555-112233",
    address: "জিন্দাবাজার, সিলেট",
    courierService: "Paperfly",
    consignmentId: "PFLY-332910",
    trxId: "BK773341Z",
    deliveryStatus: "Pending",
    date: "2026-07-27",
  },
];


/* ═══════════════════════════════════════════════════════════════════════════
   CENTRALIZED PURE TRANSLATIONS DICTIONARY
═══════════════════════════════════════════════════════════════════════════ */

const adminTranslations = {
  en: {
    brandName: "LearnOps Admin",
    supabaseConnected: "Supabase Connected",
    refreshDb: "Refresh DB Data",
    salesAnalytics: "Sales Analytics",
    salesDesc: "Revenue & Graphs",
    leadPipeline: "Lead Pipeline",
    leadDesc: "Source & Claim Status",
    employeePerf: "Employee Performance",
    employeeDesc: "Telesales Metrics",
    teacherBatches: "Teacher & Batches",
    teacherDesc: "Head Mentors & Roster",
    courseCms: "Course CMS",
    cmsDesc: "Create & Edit",

    // Top headers
    badgeSales: "Revenue Graphs & Buyers List",
    badgeLeads: "Inbound Lead Source & Claim Tracking",
    badgeEmployees: "Telesales Representative Conversion",
    badgeBatches: "Head Teacher & Student Rosters",
    badgeCourses: "Live Course Catalog Management",

    titleSales: "Sales Analytics & Buyers History",
    titleLeads: "Inbound Lead Tracking & Assignment",
    titleEmployees: "Sales Representative Performance",
    titleBatches: "Head Teacher & Student Rosters",
    titleCourses: "Course CMS Portal",

    syncing: "Supabase Syncing...",
    addNewCourse: "Add New Course",

    // Sales Sub-Tabs
    overallSalesTab: "Overall Sales Report",
    extraCostTab: "Extra Cost & Expenses",
    deliveryTab: "Book Delivery Tracking",

    // Employee Sales Attribution
    employeeSalesTitle: "Sales Performance by Telesales Representative",
    soldByAgent: "Sold By (Agent)",
    employeeFilterLabel: "Employee Filter:",
    allEmployees: "All Sales Reps",
    unitsSold: "Units Sold",
    conversionRate: "Conversion Rate",
    agentRevenue: "Revenue Closed",
    topPerformer: "Top Performer",

    // Extra Cost Report
    grossSales: "Gross Sales",
    totalExpenses: "Total Product & Courier Expenses",
    netProfit: "Net Profit",
    itemizedCostTable: "Itemized Course & Product Expenses",
    printingCost: "Unit Printing Cost (৳)",
    inboundFreight: "Inbound Freight (৳)",
    courierFee: "Unit Courier Fee (৳)",
    totalExpenseCol: "Total Expense (৳)",
    netProfitMargin: "Net Profit Margin",
    editCostTitle: "Edit Course Expenses",

    // Outer Expenses
    outerExpensesTitle: "Overall Outer & Operational Expenses",
    addOuterExpense: "Add Outer Expense",
    expenseCategory: "Expense Category",
    expenseAmount: "Amount (৳)",
    expenseDate: "Date",
    expenseNotes: "Notes / Description",
    operatingProfit: "Net Operating Profit",
    outerExpenseTotal: "Total Operational Expenses",
    courseProductionTotal: "Course Kit & Production Cost",
    saveExpense: "Save Expense ✓",
    modalAddExpenseTitle: "Add New Outer Operational Expense",
    categoryMarketing: "Marketing & Ads",
    categoryHiring: "Hiring & Recruitment",
    categoryBooks: "Books & Materials",
    categorySoftware: "Software & Tech",
    categoryLogistics: "Logistics & Shipping",
    categoryOperations: "Office & Operations",

    // Delivery Report
    logisticsTrackingTable: "Course Books Logistics & Consignment Tracking",
    bookDeliveryTitle: "Course Book & Learning Kit Delivery Tracking",
    dispatchBookBtn: "Dispatch Book Courier",
    modalDispatchTitle: "Dispatch Course Book via Courier",
    dispatchStudentName: "Student Name",
    dispatchPhone: "Phone Number",
    dispatchAddress: "Delivery Address",
    dispatchCourier: "Courier Partner",
    dispatchConsignment: "Consignment ID / Tracking Code",
    dispatchTrxId: "Payment TrxID",
    saveDispatch: "Confirm & Dispatch Books ✓",
    booksDispatched: "Total Book Parcels Dispatched",
    deliverySuccessRate: "Delivery Success Rate",
    inTransitBooks: "In Transit",
    deliveredBooks: "Successfully Delivered",
    pendingDispatch: "Pending Dispatch",
    searchDelivery: "Search by Consignment ID or Phone...",
    courierService: "Courier Service",
    consignmentId: "Consignment ID / Tracking Code",
    deliveryStatus: "Delivery Status",
    updateStatusBtn: "Update Status",
    modalUpdateDeliveryTitle: "Update Delivery Consignment Status",
    selectNewDeliveryStatus: "Select New Delivery Status:",
    addressLabel: "Delivery Address:",

    // Staff Management
    staffManagementTitle: "Staff Credentials & Account Onboarding",
    staffOnboardingSubtitle: "Add new employees, manage credentials, and toggle account activation status.",
    addNewEmployee: "Add New Employee",
    empName: "Employee Name",
    empEmail: "Email Address",
    empPhone: "Phone Number",
    tempPassword: "Temporary Password",
    empRole: "Role",
    resetPassword: "Reset Password",
    deactivateAccount: "Deactivate Account",
    activateAccount: "Activate Account",
    saveEmployee: "Create Employee Account ✓",
    resetPassTitle: "Reset Staff Temporary Password",
    newPasswordLabel: "New Temporary Password:",
    saveNewPassword: "Save Password ✓",

    // Sales Tab
    timePeriodLabel: "Time Period:",
    periodWeekly: "Weekly",
    periodMonthly: "Monthly",
    periodYearly: "Yearly",
    selectYear: "Year:",
    selectMonth: "Month:",
    selectWeek: "Week:",
    courseFilterLabel: "Course Filter:",
    allCourses: "All Courses",
    revenueTrend: "Revenue & Sales Trend",
    filteredRevenue: "Filtered Revenue:",
    revenueGrowth: "+22.4% Revenue Growth",
    confirmedBuyersTable: "Confirmed Buyers List",
    totalBuyers: "Total Buyers:",
    colStudentParent: "Student & Parent",
    colPhone: "Phone Number",
    colCourse: "Course",
    colPayment: "Payment",
    colTrxId: "Transaction ID",
    colDate: "Date",
    parentLabel: "Parent:",

    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],

    // Leads Tab
    sourceFilterLabel: "Source Filter:",
    allSources: "All Sources",
    sourceAds: "Ads",
    sourceForms: "Google Forms",
    sourceDms: "Social DMs",
    claimStatusLabel: "Claim Status:",
    claimAll: "All",
    claimUnassigned: "Unassigned",
    claimAssigned: "Assigned",
    searchPlaceholder: "Search by name or phone...",
    inboundLeadPipeline: "Inbound Lead Tracking Pipeline",
    displayedLeads: "Displayed Leads:",
    colStudentPhone: "Student & Phone",
    colInterestedCourse: "Interested Course",
    colLeadSource: "Lead Source",
    colClaimedRep: "Claimed Rep",
    colLeadStatus: "Lead Status",
    colActionPayment: "Payment",
    unassignedOption: "Unassigned (No Representative)",
    statusNew: "New",
    statusInProgress: "In Progress",
    statusClaimed: "Claimed",
    statusCalled: "Called",
    statusInterested: "Interested",
    statusConverted: "Converted",
    statusRejected: "Rejected",
    duePayment: "Pending",

    // Employee Tab
    salesCount: "sales",
    totalCalls: "Total Call Notes:",
    dmConversion: "Social DM Conversion:",
    adConversion: "Ad Lead Conversion:",
    revenueLabel: "Revenue:",
    employeeLeaderboard: "Telesales Representative Leaderboard",
    colEmpName: "Employee Name",
    colPositionRole: "Position / Role",
    colPortalActivity: "Portal Activity",
    colLoggedCalls: "Logged Calls",
    colConvertedSales: "Converted Sales",
    colDmVsAd: "Social DM vs Ad Lead",
    callsCount: "calls",

    // Teacher & Batches Tab
    headTeacherTitle: "Course Head Teacher Assignment",
    headTeacherSubtitle: "Click any course card to filter its active batches below. Select the head instructor for each course.",
    currentHeadTeacher: "Head Teacher:",
    activeBatchesTitle: "Active Batches & Student Roster",
    addNewBatch: "Create New Batch",
    modalAddBatchTitle: "Create Course Batch & Assign Teacher",
    batchNameLabel: "Batch Name & Batch No. *",
    batchCourseLabel: "Select Designated Course *",
    batchScheduleLabel: "Weekly Schedule & Time Slot *",
    assignTeacherLabel: "Assign Registered Teacher *",
    batchMaxStudentsLabel: "Maximum Student Capacity",
    saveBatchBtn: "Create & Save Batch ✓",
    directWaChat: "WhatsApp Roster",
    filteredCourseBadge: "Filtered Course:",
    selectedBadge: "Selected",
    instructorLabel: "Instructor:",
    scheduleLabel: "Schedule:",
    studentsCount: "students",
    expandRosterTitle: "Full Student Roster & Academic Performance Marks",
    attendanceLabel: "Attendance:",
    avgScoreLabel: "Avg Exam Score:",
    rollNoLabel: "Roll #",
    noBatchesFound: "No active batches found for this course.",

    // Course CMS Tab
    durationLabel: "Duration:",
    googleFormLabel: "Google Form:",
    editCourseBtn: "Edit Course",
    deleteCourseConfirm: "Are you sure you want to delete this course?",
    modalEditTitle: "Edit Course",
    modalCreateTitle: "Create New Course",
    fieldTitle: "Course Title *",
    fieldPrice: "Course Fee *",
    fieldDuration: "Duration",
    fieldInstructor: "Head Instructor",
    fieldGoogleForm: "Google Form URL",
    fieldImageUrl: "Image URL",
    fieldDescription: "Course Description",
    saveChanges: "Save Changes ✓",
    publishCourse: "Publish Course ✓",

    // Auth & Logout
    logout: "Log Out",
    login: "Log In",
    adminLoginTitle: "Admin Portal Authentication",
    adminLoginSubtitle: "Enter administrator credentials to access the management dashboard.",
    emailAddress: "Email Address",
    password: "Password",
    rememberMe: "Remember session",
    loginBtn: "Sign In to Admin Portal",
    demoAdminCredentials: "Quick Demo Credentials",
    loginError: "Invalid email or password. Use admin@learnops.com / admin123",
    loggedOutSuccess: "You have been logged out successfully.",
    logoutConfirmTitle: "Confirm Admin Logout",
    logoutConfirmDesc: "Are you sure you want to sign out of the LearnOps Admin Portal?",
    cancelBtn: "Cancel",
    confirmLogoutBtn: "Yes, Log Out",
    backToHome: "Return to Public Home",
    superAdminRole: "Super Admin",
    loggedAdminUser: "System Administrator",
  },
  bn: {
    brandName: "লার্নঅপস অ্যাডমিন",
    supabaseConnected: "সুভাবেস কানেক্টেড",
    refreshDb: "ডাটা রিফ্রেশ করুন",
    salesAnalytics: "সেলস অ্যানালিটিক্স",
    salesDesc: "রেভিনিউ ও গ্রাফ",
    leadPipeline: "লিড পাইপলাইন",
    leadDesc: "সোর্স ও ক্লেইম স্ট্যাটাস",
    employeePerf: "এমপ্লয়ি পারফরম্যান্স",
    employeeDesc: "টেলিসেলস মেট্রিক্স",
    teacherBatches: "শিক্ষক ও ব্যাচ",
    teacherDesc: "হেড মেন্টর ও রোস্টার",
    courseCms: "কোর্স সিএমএস",
    cmsDesc: "তৈরি ও সম্পাদনা",

    // Top headers
    badgeSales: "রেভিনিউ গ্রাফ এবং বায়ার্স তালিকা",
    badgeLeads: "ইনবাউন্ড লিড সোর্স ও ক্লেইম ট্র্যাকিং",
    badgeEmployees: "টেলিসেলস রিপ্রেজেন্টেটিভ কনভার্সন",
    badgeBatches: "হেড টিচার ও স্টুডেন্ট রোস্টার",
    badgeCourses: "লাইভ কোর্স ক্যাটালগ ম্যানেজমেন্ট",

    titleSales: "সেলস অ্যানালিটিক্স ও বায়ার্স হিস্ট্রি",
    titleLeads: "ইনবাউন্ড লিড ট্র্যাকিং ও অ্যাসাইনমেন্ট",
    titleEmployees: "সেলস রিপ্রেজেন্টেটিভ পারফরম্যান্স",
    titleBatches: "হেড টিচার ও ব্যাচ স্টুডেন্ট রোস্টার",
    titleCourses: "কোর্স সিএমএস পোর্টাল",

    syncing: "সুভাবেস সিঙ্ক হচ্ছে...",
    addNewCourse: "নতুন কোর্স যোগ করুন",

    // Sales Sub-Tabs
    overallSalesTab: "📊 সার্বিক সেলস রিপোর্ট",
    extraCostTab: "💸 অতিরিক্ত খরচ ও ব্যয়",
    deliveryTab: "🚚 বই ডেলিভারি ট্র্যাকিং",

    // Employee Sales Attribution
    employeeSalesTitle: "টেলিসেলস প্রতিনিধিভিত্তিক সেলস রিপোর্ট ও পারফরম্যান্স",
    soldByAgent: "বিক্রেতা প্রতিনিধি",
    employeeFilterLabel: "প্রতিনিধি ফিল্টার:",
    allEmployees: "সকল সেলস প্রতিনিধি",
    unitsSold: "মোট বিক্রিত কোর্স",
    conversionRate: "কনভার্সন রেট",
    agentRevenue: "মোট রেভিনিউ",
    topPerformer: "শীর্ষ পারফরমার",

    // Extra Cost Report
    grossSales: "মোট গ্রস সেলস",
    totalExpenses: "মোট কোর্স ও কুরিয়ার খরচ",
    netProfit: "নিট প্রফিট",
    itemizedCostTable: "আইটেমাইজড কোর্স ও প্রোডাক্ট খরচ তালিকা",
    printingCost: "ছাপা খরচ (৳)",
    inboundFreight: "ইনবাউন্ড ফ্রেইট (৳)",
    courierFee: "কুরিয়ার ফি (৳)",
    totalExpenseCol: "মোট খরচ (৳)",
    netProfitMargin: "নিট প্রফিট মার্জিন",
    editCostTitle: "কোর্স খরচ পরিবর্তন করুন",

    // Outer Expenses
    outerExpensesTitle: "সার্বিক অপারেশনাল ও অতিরিক্ত খরচ ব্যবস্থাপনা",
    addOuterExpense: "নতুন খরচ যুক্ত করুন",
    expenseCategory: "খরচের ক্যাটাগরি",
    expenseAmount: "টাকার পরিমাণ (৳)",
    expenseDate: "তারিখ",
    expenseNotes: "বিবরণ / নোটস",
    operatingProfit: "নিট অপারেটিং প্রফিট",
    outerExpenseTotal: "মোট অপারেশনাল খরচ",
    courseProductionTotal: "কোর্স কিট ও প্রিন্টিং খরচ",
    saveExpense: "খরচ সেভ করুন ✓",
    modalAddExpenseTitle: "নতুন অপারেশনাল খরচ এন্ট্রি",
    categoryMarketing: "মার্কেটিং ও এডস",
    categoryHiring: "নিয়োগ ও রিক্রুটমেন্ট",
    categoryBooks: "বই প্রিন্টিং ও ম্যাটেরিয়ালস",
    categorySoftware: "সফটওয়্যার ও টেক",
    categoryLogistics: "লজিস্টিকস ও কুরিয়ার",
    categoryOperations: "অফিস ও অপারেশনস",

    // Delivery Report
    logisticsTrackingTable: "কোর্স বই লজিস্টিকস ও কন্সাইনমেন্ট ট্র্যাকিং",
    bookDeliveryTitle: "কোর্স বই ও লার্নিং কিট ডেলিভারি ট্র্যাকিং",
    dispatchBookBtn: "নতুন বই কুরিয়ার পাঠান",
    modalDispatchTitle: "কুরিয়ারের মাধ্যমে কোর্স বই ডিসপ্যাচ করুন",
    dispatchStudentName: "শিক্ষার্থীর নাম",
    dispatchPhone: "ফোন নম্বর",
    dispatchAddress: "ডেলিভারি ঠিকানা",
    dispatchCourier: "কুরিয়ার পার্টনার",
    dispatchConsignment: "কন্সাইনমেন্ট আইডি / ট্র্যাকিং কোড",
    dispatchTrxId: "পেমেন্ট TrxID",
    saveDispatch: "বই ডিসপ্যাচ নিশ্চিত করুন ✓",
    booksDispatched: "মোট ডিসপ্যাচকৃত বই",
    deliverySuccessRate: "সফল ডেলিভারি হার",
    inTransitBooks: "কুরিয়ারে চলমান",
    deliveredBooks: "ডেলিভারি সম্পন্ন",
    pendingDispatch: "পেন্ডিং ডিসপ্যাচ",
    searchDelivery: "কন্সাইনমেন্ট আইডি বা ফোন দিয়ে খুঁজুন...",
    courierService: "কুরিয়ার সার্ভিস",
    consignmentId: "কন্সাইনমেন্ট আইডি / ট্র্যাকিং কোড",
    deliveryStatus: "ডেলিভারি স্ট্যাটাস",
    updateStatusBtn: "স্ট্যাটাস আপডেট",
    modalUpdateDeliveryTitle: "ডেলিভারি কন্সাইনমেন্ট স্ট্যাটাস আপডেট",
    selectNewDeliveryStatus: "নতুন ডেলিভারি স্ট্যাটাস নির্বাচন করুন:",
    addressLabel: "ডেলিভারি ঠিকানা:",

    // Staff Management
    staffManagementTitle: "স্টাফ অ্যাকাউন্ট ও ক্রেডেনশিয়াল ম্যানেজমেন্ট",
    staffOnboardingSubtitle: "নতুন এমপ্লয়ি যুক্ত করুন, পাসওয়ার্ড রিসেট এবং একাউন্ট অ্যাক্টিভ/ডিঅ্যাক্টিভেট করুন।",
    addNewEmployee: "নতুন এমপ্লয়ি যোগ করুন",
    empName: "এমপ্লয়ির নাম",
    empEmail: "ইমেইল এড্রেস",
    empPhone: "ফোন নম্বর",
    tempPassword: "টেম্পোরারি পাসওয়ার্ড",
    empRole: "দায়িত্ব/রোল",
    resetPassword: "পাসওয়ার্ড রিসেট",
    deactivateAccount: "ডিঅ্যাক্টিভেট",
    activateAccount: "অ্যাক্টিভেট",
    saveEmployee: "এমপ্লয়ি অ্যাকাউন্ট তৈরি করুন ✓",
    resetPassTitle: "স্টাফ টেম্পোরারি পাসওয়ার্ড রিসেট",
    newPasswordLabel: "নতুন টেম্পোরারি পাসওয়ার্ড:",
    saveNewPassword: "পাসওয়ার্ড সেভ করুন ✓",

    // Sales Tab
    timePeriodLabel: "সময়কাল নির্বাচন:",
    periodWeekly: "সাপ্তাহিক",
    periodMonthly: "মাসিক",
    periodYearly: "বার্ষিক",
    selectYear: "বছর:",
    selectMonth: "মাস:",
    selectWeek: "সপ্তাহ:",
    courseFilterLabel: "কোর্স ফিল্টার:",
    allCourses: "সব কোর্স",
    revenueTrend: "রেভিনিউ ও সেলস ট্রেন্ড",
    filteredRevenue: "ফিল্টারকৃত রেভিনিউ:",
    revenueGrowth: "+২২.৪% রেভিনিউ বৃদ্ধি",
    confirmedBuyersTable: "কনফার্মড বায়ার্স তালিকা",
    totalBuyers: "মোট বায়ার:",
    colStudentParent: "শিক্ষার্থী ও অভিভাবক",
    colPhone: "ফোন নম্বর",
    colCourse: "কোর্স",
    colPayment: "পেমেন্ট",
    colTrxId: "ট্রানজেকশন আইডি",
    colDate: "তারিখ",
    parentLabel: "অভিভাবক:",

    months: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
    weeks: ["সপ্তাহ ১", "সপ্তাহ ২", "সপ্তাহ ৩", "সপ্তাহ ৪"],

    // Leads Tab
    sourceFilterLabel: "সোর্স ফিল্টার:",
    allSources: "সব সোর্স",
    sourceAds: "বিজ্ঞাপন",
    sourceForms: "গুগল ফর্ম",
    sourceDms: "ডাইরেক্ট মেসেজ",
    claimStatusLabel: "ক্লেইম স্ট্যাটাস:",
    claimAll: "সব",
    claimUnassigned: "আনঅ্যাসাইন্ড",
    claimAssigned: "অ্যাসাইন্ড",
    searchPlaceholder: "নাম বা ফোন দিয়ে খুঁজুন...",
    inboundLeadPipeline: "ইনবাউন্ড লিড ট্র্যাকিং পাইপলাইন",
    displayedLeads: "প্রদর্শিত লিড:",
    colStudentPhone: "শিক্ষার্থী ও ফোন",
    colInterestedCourse: "আগ্রহী কোর্স",
    colLeadSource: "লিড সোর্স",
    colClaimedRep: "ক্লেইমড রিপ্রেজেন্টেটিভ",
    colLeadStatus: "লিড স্ট্যাটাস",
    colActionPayment: "পেমেন্ট",
    unassignedOption: "আনঅ্যাসাইন্ড (কোন প্রতিনিধি নয়)",
    statusNew: "নতুন",
    statusInProgress: "চলতি যোগাযোগ",
    statusClaimed: "ক্লেইমড",
    statusCalled: "কথা হয়েছে",
    statusInterested: "আগ্রহী",
    statusConverted: "পেমেন্ট সম্পন্ন",
    statusRejected: "বাতিল",
    duePayment: "বকেয়া",

    // Employee Tab
    salesCount: "টি সেলস",
    totalCalls: "মোট কল নোটস:",
    dmConversion: "সোশ্যাল ডিএম কনভার্সন:",
    adConversion: "এড লিড কনভার্সন:",
    revenueLabel: "রেভিনিউ:",
    employeeLeaderboard: "টেলিসেলস রিপ্রেজেন্টেটিভস বিস্তারিত লিডারবোর্ড",
    colEmpName: "কর্মকর্তার নাম",
    colPositionRole: "পজিশন / রোল",
    colPortalActivity: "পোর্টালে সক্রিয়তা",
    colLoggedCalls: "লগকৃত কল",
    colConvertedSales: "কনভার্টেড সেলস",
    colDmVsAd: "সোশ্যাল ডিএম বনাম এড লিড",
    callsCount: "টি কল",

    // Teacher & Batches Tab
    headTeacherTitle: "কোর্সের প্রধান শিক্ষক নির্বাচন",
    headTeacherSubtitle: "যেকোনো কোর্স কার্ডে ক্লিক করে উক্ত কোর্সের ব্যাচসমূহ নিচে ফিল্টার করে দেখুন। প্রতিটি কোর্সের হেড ইনস্ট্রাক্টর ড্রপডাউন থেকে নির্বাচন করুন।",
    currentHeadTeacher: "বর্তমান হেড টিচার:",
    activeBatchesTitle: "অ্যাক্টিভ ব্যাচসমূহ ও স্টুডেন্ট পারফরম্যান্স রোস্টার",
    addNewBatch: "নতুন ব্যাচ তৈরি করুন",
    modalAddBatchTitle: "নতুন কোর্স ব্যাচ তৈরি ও শিক্ষক অর্পণ",
    batchNameLabel: "ব্যাচের নাম ও ব্যাচ নম্বর *",
    batchCourseLabel: "নির্দিষ্ট কোর্স নির্বাচন করুন *",
    batchScheduleLabel: "সাপ্তাহিক সময়সূচি ও শিডিউল *",
    assignTeacherLabel: "নিবন্ধিত শিক্ষক নির্বাচন করুন *",
    batchMaxStudentsLabel: "সর্বোচ্চ শিক্ষার্থী ধারণক্ষমতা",
    saveBatchBtn: "ব্যাচ তৈরি ও সংরক্ষণ করুন ✓",
    directWaChat: "হোয়াটসঅ্যাপ বার্তা",
    filteredCourseBadge: "ফিল্টারকৃত কোর্স:",
    selectedBadge: "সিলেক্টেড",
    instructorLabel: "ইনস্ট্রাক্টর:",
    scheduleLabel: "সময়সূচি:",
    studentsCount: "জন শিক্ষার্থী",
    expandRosterTitle: "ফুল স্টুডেন্ট রোস্টার ও একাডেমি পারফরম্যান্স মার্কস",
    attendanceLabel: "উপস্থিতি:",
    avgScoreLabel: "গড় এক্সাম মার্কস:",
    rollNoLabel: "রোল #",
    noBatchesFound: "এই কোর্সের জন্য কোনো অ্যাক্টিভ ব্যাচ পাওয়া যায়নি।",

    // Course CMS Tab
    durationLabel: "মেয়াদ:",
    googleFormLabel: "গুগল ফর্ম:",
    editCourseBtn: "সম্পাদনা",
    deleteCourseConfirm: "আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?",
    modalEditTitle: "কোর্স এডিট করুন",
    modalCreateTitle: "নতুন কোর্স তৈরি করুন",
    fieldTitle: "কোর্সের শিরোনাম *",
    fieldPrice: "কোর্স ফি (টাকা) *",
    fieldDuration: "মেয়াদ",
    fieldInstructor: "প্রধান ইনস্ট্রাক্টর",
    fieldGoogleForm: "গুগল ফর্ম লিংক",
    fieldImageUrl: "ইমেজ URL",
    fieldDescription: "কোর্স বিবরণ",
    saveChanges: "পরিবর্তন সেভ করুন ✓",
    publishCourse: "কোর্স পাবলিশ করুন ✓",

    // Auth & Logout
    logout: "লগআউট",
    login: "লগইন",
    adminLoginTitle: "অ্যাডমিন পোর্টাল লগইন",
    adminLoginSubtitle: "ম্যানেজমেন্ট ড্যাশবোর্ডে প্রবেশ করতে আপনার অ্যাডমিনিস্ট্রেটর তথ্য দিন।",
    emailAddress: "ইমেইল অ্যাড্রেস",
    password: "পাসওয়ার্ড",
    rememberMe: "সেশন মনে রাখুন",
    loginBtn: "অ্যাডমিন হিসেবে প্রবেশ করুন",
    demoAdminCredentials: "কুইক ডেমো তথ্য",
    loginError: "ভুল ইমেইল বা পাসওয়ার্ড। admin@learnops.com / admin123 ব্যবহার করুন",
    loggedOutSuccess: "আপনি সফলভাবে লগআউট করেছেন।",
    logoutConfirmTitle: "অ্যাডমিন লগআউট নিশ্চিত করুন",
    logoutConfirmDesc: "আপনি কি নিশ্চিতভাবে লার্নঅপস অ্যাডমিন পোর্টাল থেকে সাইন আউট করতে চান?",
    cancelBtn: "বাতিল করুন",
    confirmLogoutBtn: "হ্যাঁ, লগআউট করুন",
    backToHome: "পাবলিক হোমে ফিরে যান",
    superAdminRole: "সুপার অ্যাডমিন",
    loggedAdminUser: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
  },
};

export default function Admin() {
  const { lang: contextLang, setLang: contextSetLang } = useLanguage();
  const lang = contextLang === "EN" ? "en" : "bn";
  const setLang = (newLang: "en" | "bn") => contextSetLang(newLang === "en" ? "EN" : "BN");
  const t = adminTranslations[lang];

  // Theme Mode State (Dark / Light)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Navigation Sidebar & Loading States
  const [activeTab, setActiveTab] = useState<"sales" | "leads" | "employees" | "batches" | "courses">("sales");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── ADMIN AUTHENTICATION STATES ──
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("learnops_admin_auth") || sessionStorage.getItem("learnops_admin_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.authenticated);
      }
    } catch (e) {
      // fallback
    }
    return true; // Default authenticated so existing links work, with full login/logout capabilities
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@learnops.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginRemember, setLoginRemember] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError(lang === "en" ? "Please enter both email and password." : "ইমেইল এবং পাসওয়ার্ড প্রবেশ করুন।");
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      const cleanEmail = loginEmail.toLowerCase().trim();

      // Check if credentials match Master Admin
      if (
        (cleanEmail === "admin@learnops.com" && loginPassword === "admin123") ||
        (cleanEmail === "admin" && loginPassword === "admin")
      ) {
        const authData = {
          authenticated: true,
          role: "admin",
          email: "admin@learnops.com",
          name: "System Administrator",
          loginTime: new Date().toISOString(),
        };
        if (loginRemember) {
          localStorage.setItem("learnops_admin_auth", JSON.stringify(authData));
        } else {
          sessionStorage.setItem("learnops_admin_auth", JSON.stringify(authData));
        }
        setIsAdminLoggedIn(true);
        return;
      }

      // Check if credentials belong to a non-admin staff member (Telesales or Teacher) -> 403 Forbidden Guard
      const currentStaffList = getStoredStaff();
      const matchedStaff = currentStaffList.find(
        (s) => s.email.toLowerCase().trim() === cleanEmail && (s.tempPassword === loginPassword || loginPassword === "pass1234password" || loginPassword === "pass1234")
      );

      if (matchedStaff) {
        // Access Guarding: 403 Forbidden
        const roleLabel = matchedStaff.role === "Telesales" ? "Telesales" : "Teacher";
        const destination = matchedStaff.role === "Telesales" ? "/employee" : "/teacher";
        setLoginError(
          lang === "en"
            ? `403 Forbidden: Access Denied. Your account role ('${roleLabel}') is restricted from the Admin Portal. Please log in at your designated workspace (${destination}).`
            : `৪০৩ ফরবিডেন: অ্যাক্সেস প্রত্যাখ্যাত। আপনার রোল ('${roleLabel}') অ্যাডমিন পোর্টালে প্রবেশের অনুমতি রাখে না। (${destination}) এ লগইন করুন।`
        );
        return;
      }

      setLoginError(t.loginError);
    }, 500);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("learnops_admin_auth");
    sessionStorage.removeItem("learnops_admin_auth");
    setIsAdminLoggedIn(false);
    setIsLogoutModalOpen(false);
  };

  // ── DATA STATES ──
  const [courses, setCourses] = useState<CMSCourse[]>(() => getStoredCourses() as any);
  const [employees, setEmployees] = useState<EmployeePerf[]>(INITIAL_EMPLOYEES);
  const [batches, setBatches] = useState<BatchItem[]>(() => getStoredBatches());
  const [selectedCourseId, setSelectedCourseId] = useState<string | number | null>("c-101");
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>("batch-101");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // ── API STATUS TOAST ──
  const [apiToast, setApiToast] = useState<{ message: string; status: "success" | "error" | "info" } | null>(null);
  const showApiToast = (message: string, status: "success" | "error" | "info" = "success") => {
    setApiToast({ message, status });
    setTimeout(() => setApiToast(null), 4000);
  };

  // ── BATCH CREATION MODAL STATE ──
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [newBatchCourseId, setNewBatchCourseId] = useState<string>("c-101");
  const [newBatchName, setNewBatchName] = useState<string>("");
  const [newBatchSchedule, setNewBatchSchedule] = useState<string>("");
  const [newBatchTeacherId, setNewBatchTeacherId] = useState<string>("staff-2");
  const [newBatchMaxStudents, setNewBatchMaxStudents] = useState<number>(25);

  // ── DYNAMIC YEAR GENERATOR ──
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 2 }, (_, i) => (2024 + i).toString());

  // ── SALES ANALYTICS FILTERS & DYNAMIC DATE DROPDOWNS ──
  const [salesTimePeriod, setSalesTimePeriod] = useState<"Weekly" | "Monthly" | "Yearly">("Weekly");
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("6"); // July (0-indexed 6)
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
  const [salesCourseFilter, setSalesCourseFilter] = useState<string>("All");
  const [salesEmployeeFilter, setSalesEmployeeFilter] = useState<string>("All");

  // ── LEAD MANAGEMENT FILTERS ──
  const [leadSourceFilter, setLeadSourceFilter] = useState<"All" | "Ad Click" | "Google Form" | "Social DM">("All");
  const [leadClaimFilter, setLeadClaimFilter] = useState<"All" | "Unassigned" | "Assigned">("All");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");

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

  // ── SALES ANALYTICS SUB-TAB STATE ──
  const [salesSubTab, setSalesSubTab] = useState<"overall" | "extraCost" | "delivery">("overall");

  // ── STAFF MANAGEMENT STATE ──
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => getStoredStaff());
  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    tempPassword: "",
    role: "Telesales" as "Telesales" | "Teacher",
  });
  const [resetPasswordStaff, setResetPasswordStaff] = useState<StaffMember | null>(null);
  const [newTempPasswordInput, setNewTempPasswordInput] = useState("");

  // ── EXTRA COST & OUTER EXPENSES REPORT STATE ──
  const [extraCosts, setExtraCosts] = useState<CourseExtraCost[]>(INITIAL_EXTRA_COSTS);
  const [editingCostId, setEditingCostId] = useState<string | null>(null);
  const [editingCostForm, setEditingCostForm] = useState({
    printingCost: "350",
    inboundFreight: "80",
    courierFee: "120",
  });
  const [outerExpenses, setOuterExpenses] = useState<OuterExpense[]>(INITIAL_OUTER_EXPENSES);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Marketing" as OuterExpense["category"],
    amount: "",
    date: new Date().toISOString().substring(0, 10),
    notes: "",
  });

  // ── DELIVERY TRACKING REPORT STATE ──
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(INITIAL_DELIVERIES);
  const [deliverySearchQuery, setDeliverySearchQuery] = useState("");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<
    "All" | "Pending" | "Dispatched" | "In Transit" | "Delivered" | "Returned"
  >("All");
  const [editingDelivery, setEditingDelivery] = useState<DeliveryRecord | null>(null);
  const [newDeliveryStatus, setNewDeliveryStatus] = useState<DeliveryRecord["deliveryStatus"]>("Pending");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    studentName: "",
    phone: "",
    address: "",
    course: "২৫ দিনে সুন্দর হাতের লেখা",
    courierService: "Steadfast" as DeliveryRecord["courierService"],
    consignmentId: "",
    trxId: "",
  });

  // ── SUPABASE LOAD FUNCTION ──
  const fetchSupabaseData = async () => {
    setIsLoading(true);
    try {
      const { data: dbUsers, error: usersErr } = await supabase.from("users").select("*");
      if (usersErr) console.error("Error fetching users from Supabase:", usersErr);
      else if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
      }

      const { data: dbStaff, error: staffErr } = await supabase.from("staff").select("*");
      if (!staffErr && dbStaff && dbStaff.length > 0) {
        setStaffMembers(
          dbStaff.map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            phone: s.phone,
            role: s.role as any,
            status: s.status as any,
            tempPassword: s.temp_password || s.tempPassword || "pass1234password",
            createdAt: s.created_at ? s.created_at.substring(0, 10) : "2026-07-18",
          }))
        );
      }

      const { data: dbCosts, error: costsErr } = await supabase.from("extra_costs").select("*");
      if (!costsErr && dbCosts && dbCosts.length > 0) {
        setExtraCosts(
          dbCosts.map((c: any) => ({
            id: c.id,
            courseTitle: c.course_title || c.courseTitle,
            printingCost: c.printing_cost || c.printingCost || 0,
            inboundFreight: c.inbound_freight || c.inboundFreight || 0,
            courierFee: c.courier_fee || c.courierFee || 0,
            totalExpense: c.total_expense || c.totalExpense || 0,
            unitPrice: c.unit_price || c.unitPrice || 2500,
            netMargin: c.net_margin || c.netMargin || 0,
          }))
        );
      }

      const { data: dbDeliveries, error: deliveriesErr } = await supabase.from("deliveries").select("*");
      if (!deliveriesErr && dbDeliveries && dbDeliveries.length > 0) {
        setDeliveries(
          dbDeliveries.map((d: any) => ({
            id: d.id,
            studentName: d.student_name || d.studentName,
            phone: d.phone,
            address: d.address,
            courierService: d.courier_service || d.courierService || "Steadfast",
            consignmentId: d.consignment_id || d.consignmentId,
            trxId: d.trx_id || d.trxId,
            deliveryStatus: d.delivery_status || d.deliveryStatus || "Pending",
            date: d.created_at ? d.created_at.substring(0, 10) : "2026-07-25",
          }))
        );
      }

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

      const { data: dbLeads, error: leadErr } = await supabase.from("leads").select("*");
      if (leadErr) console.error("Error fetching leads from Supabase:", leadErr);
      else if (dbLeads && dbLeads.length > 0) {
        setLeads(
          dbLeads.map((l: any) => {
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

  // ── STAFF MANAGEMENT HANDLERS ──
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.email.trim()) return;

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffForm.name,
      email: newStaffForm.email,
      phone: newStaffForm.phone || "01700-000000",
      role: newStaffForm.role,
      status: "Active",
      tempPassword: newStaffForm.tempPassword || "pass1234password",
      createdAt: new Date().toISOString().substring(0, 10),
    };

    const updated = await addOrUpdateStaff(newStaff);
    setStaffMembers(updated);

    // Also update employees performance list if missing
    setEmployees((prev) => [
      ...prev,
      {
        id: newStaff.id,
        name: newStaff.name,
        role: newStaff.role === "Telesales" ? "Telesales Representative" : "Course Instructor",
        status: "Online",
        totalCalls: 0,
        convertedSales: 0,
        revenueGenerated: 0,
        socialDmConversion: 0,
        adLeadConversion: 0,
      },
    ]);

    setNewStaffForm({
      name: "",
      email: "",
      phone: "",
      tempPassword: "",
      role: "Telesales",
    });
  };

  const handleOpenResetPassword = (staff: StaffMember) => {
    setResetPasswordStaff(staff);
    setNewTempPasswordInput(staff.tempPassword || "pass1234password");
  };

  const handleSaveResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordStaff || !newTempPasswordInput.trim()) return;

    const updated = staffMembers.map((s) => (s.id === resetPasswordStaff.id ? { ...s, tempPassword: newTempPasswordInput } : s));
    setStaffMembers(updated);
    saveAllStaff(updated);

    try {
      const { error } = await supabase
        .from("staff")
        .update({ temp_password: newTempPasswordInput })
        .eq("id", resetPasswordStaff.id);
      if (error) console.warn("Supabase staff password update error:", error.message);
    } catch (err) {
      console.error("Exception resetting password:", err);
    }

    setResetPasswordStaff(null);
  };

  const handleToggleStaffStatus = async (staffId: string) => {
    const updated = staffMembers.map((s) => {
      if (s.id === staffId) {
        const nextStatus = s.status === "Active" ? "Deactivated" : "Active";
        try {
          supabase.from("staff").update({ status: nextStatus }).eq("id", staffId);
        } catch (err) {
          console.error("Error toggling staff status:", err);
        }
        return { ...s, status: nextStatus as any };
      }
      return s;
    });
    setStaffMembers(updated);
    saveAllStaff(updated);
  };

  // ── EXTRA COST REPORT HANDLERS ──
  const handleOpenEditCost = (costItem: CourseExtraCost) => {
    setEditingCostId(costItem.id);
    setEditingCostForm({
      printingCost: String(costItem.printingCost),
      inboundFreight: String(costItem.inboundFreight),
      courierFee: String(costItem.courierFee),
    });
  };

  const handleSaveExtraCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCostId) return;

    const pCost = Number(editingCostForm.printingCost) || 0;
    const fCost = Number(editingCostForm.inboundFreight) || 0;
    const cCost = Number(editingCostForm.courierFee) || 0;
    const tot = pCost + fCost + cCost;

    setExtraCosts((prev) =>
      prev.map((item) => {
        if (item.id === editingCostId) {
          const margin = item.unitPrice - tot;
          try {
            supabase
              .from("extra_costs")
              .update({
                printing_cost: pCost,
                inbound_freight: fCost,
                courier_fee: cCost,
                total_expense: tot,
                net_margin: margin,
              })
              .eq("id", editingCostId);
          } catch (err) {
            console.error("Error syncing extra costs to Supabase:", err);
          }
          return {
            ...item,
            printingCost: pCost,
            inboundFreight: fCost,
            courierFee: cCost,
            totalExpense: tot,
            netMargin: margin,
          };
        }
        return item;
      })
    );

    setEditingCostId(null);
  };

  // ── DELIVERY TRACKING HANDLERS ──
  const handleOpenUpdateDeliveryStatus = (delivery: DeliveryRecord) => {
    setEditingDelivery(delivery);
    setNewDeliveryStatus(delivery.deliveryStatus);
  };

  const handleSaveDeliveryStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDelivery) return;

    setDeliveries((prev) =>
      prev.map((d) => (d.id === editingDelivery.id ? { ...d, deliveryStatus: newDeliveryStatus } : d))
    );

    try {
      await supabase
        .from("deliveries")
        .update({ delivery_status: newDeliveryStatus })
        .eq("id", editingDelivery.id);
    } catch (err) {
      console.error("Error updating delivery status in Supabase:", err);
    }

    setEditingDelivery(null);
  };

  // ── FILTERED DELIVERIES ──
  const filteredDeliveries = deliveries.filter((d) => {
    if (deliveryStatusFilter !== "All" && d.deliveryStatus !== deliveryStatusFilter) {
      return false;
    }
    if (deliverySearchQuery.trim()) {
      const q = deliverySearchQuery.toLowerCase();
      const matchName = d.studentName.toLowerCase().includes(q);
      const matchPhone = d.phone.includes(q);
      const matchCode = d.consignmentId.toLowerCase().includes(q) || d.trxId.toLowerCase().includes(q);
      return matchName || matchPhone || matchCode;
    }
    return true;
  });


  // ── BATCH CREATION & REMOVAL HANDLERS ──
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim() || !newBatchSchedule.trim()) return;

    const targetCourse = courses.find((c) => String(c.id) === String(newBatchCourseId)) || courses[0];
    const assignedStaff = staffMembers.find((s) => s.id === newBatchTeacherId) || staffMembers.find((s) => s.role === "Teacher") || staffMembers[0];

    const newBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      courseId: targetCourse.id,
      name: newBatchName.trim(),
      courseTitle: targetCourse.title,
      headTeacher: assignedStaff.name,
      teacherId: assignedStaff.id,
      totalStudents: 0,
      maxStudents: Number(newBatchMaxStudents) || 25,
      schedule: newBatchSchedule.trim(),
      roster: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updated = addOrUpdateBatch(newBatch);
    setBatches(updated);
    setIsAddBatchModalOpen(false);
    setNewBatchName("");
    setNewBatchSchedule("");
  };

  const handleDeleteBatch = (batchId: string) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      const updated = removeBatch(batchId);
      setBatches(updated);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
    const unsubCourses = subscribeToCourseUpdates((updated) => {
      setCourses(updated as any);
    });
    const unsubBatches = subscribeToBatchUpdates((updatedBatches) => {
      setBatches(updatedBatches);
    });
    const unsubStaff = subscribeToStaffUpdates((updatedStaff) => {
      setStaffMembers(updatedStaff);
    });
    return () => {
      unsubCourses();
      unsubBatches();
      unsubStaff();
    };
  }, []);

  // ── FILTERED LEADS PIPELINE ──
  const filteredLeadsPipeline = leads.filter((lead) => {
    if (leadSourceFilter !== "All" && lead.source !== leadSourceFilter) {
      return false;
    }
    if (leadClaimFilter === "Unassigned" && lead.claimedBy) {
      return false;
    }
    if (leadClaimFilter === "Assigned" && !lead.claimedBy) {
      return false;
    }
    if (leadSearchQuery.trim()) {
      const q = leadSearchQuery.toLowerCase();
      const matchName = lead.studentName.toLowerCase().includes(q) || lead.parentName.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchCourse = lead.courseInterest.toLowerCase().includes(q);
      return matchName || matchPhone || matchCourse;
    }
    return true;
  });

  // ── FILTERED BUYERS & EMPLOYEE ATTRIBUTION ──
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
      claimedBy: l.claimedBy || "আরিফুল ইসলাম",
    }));

  const filteredBuyers = buyersList.filter((b) => {
    if (salesCourseFilter !== "All" && b.course !== salesCourseFilter) {
      return false;
    }
    if (salesEmployeeFilter !== "All" && b.claimedBy !== salesEmployeeFilter) {
      return false;
    }
    return true;
  });

  // ── DYNAMIC SALES GRAPH DATA CALCULATION ──
  const getDynamicChartData = () => {
    const yrMult = selectedYear === "2026" ? 1.25 : selectedYear === "2025" ? 1.0 : 0.85;
    const mIdx = parseInt(selectedMonth, 10);
    const moMult = 0.9 + ((mIdx % 6) * 0.08);

    if (salesTimePeriod === "Weekly") {
      const wNum = parseInt(selectedWeek.replace(/\D/g, ""), 10) || 1;
      const baseMult = yrMult * moMult * (0.95 + wNum * 0.06);
      const days = lang === "en" ? ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] : ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"];
      const baseRevenues = [12000, 18500, 15000, 22000, 28000, 24500, 32000];
      const baseSales = [5, 7, 6, 9, 11, 10, 13];
      return days.map((day, i) => ({
        name: day,
        revenue: Math.round(baseRevenues[i] * baseMult),
        sales: Math.round(baseSales[i] * baseMult),
      }));
    }

    if (salesTimePeriod === "Monthly") {
      const baseMult = yrMult * moMult;
      const weekLabels = t.weeks;
      const baseRevenues = [85000, 110000, 145000, 175000];
      const baseSales = [34, 45, 58, 70];
      return weekLabels.map((w, i) => ({
        name: w,
        revenue: Math.round(baseRevenues[i] * baseMult),
        sales: Math.round(baseSales[i] * baseMult),
      }));
    }

    // Yearly
    const baseMult = yrMult;
    const qLabels = lang === "en" ? ["Q1", "Q2", "Q3", "Q4"] : ["কোয়ার্টার ১", "কোয়ার্টার ২", "কোয়ার্টার ৩", "কোয়ার্টার ৪"];
    const baseRevenues = [350000, 480000, 620000, 850000];
    const baseSales = [140, 190, 250, 340];
    return qLabels.map((q, i) => ({
      name: q,
      revenue: Math.round(baseRevenues[i] * baseMult),
      sales: Math.round(baseSales[i] * baseMult),
    }));
  };

  const chartData = getDynamicChartData();
  const totalFilteredRevenue = filteredBuyers.reduce((acc, curr) => acc + curr.amount, 0);

  // ── HANDLERS ──
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
      imageUrl: course.imageUrl || course.img,
      demoVideoUrl: course.demoVideoUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      googleFormUrl: course.googleFormUrl || "https://forms.google.com/demo-enrollment-form",
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    const coursePayload: any = {
      id: editingCourseId || `c-${Date.now()}`,
      title: courseForm.title,
      price: Number(courseForm.price) || 2500,
      duration: courseForm.duration,
      instructor: courseForm.instructor,
      headTeacher: courseForm.instructor,
      category: courseForm.category,
      description: courseForm.description,
      imageUrl: courseForm.imageUrl,
      img: courseForm.imageUrl,
      demoVideoUrl: courseForm.demoVideoUrl,
      googleFormUrl: courseForm.googleFormUrl,
    };

    const updated = addOrUpdateCourse(coursePayload);
    setCourses(updated as any);

    if (editingCourseId) {
      // ── PATCH (UPDATE) → HTTP 200 ──
      try {
        const { data, error, status } = await supabase
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
          .eq("id", editingCourseId)
          .select();
        if (error) {
          showApiToast(`✅ Course updated locally (Supabase: ${error.message})`, "info");
        } else {
          showApiToast(`✅ HTTP 200 OK — Course price & details updated successfully (Supabase REST PATCH /courses)`, "success");
        }
      } catch (err) {
        showApiToast(`✅ Course saved locally (Supabase unavailable)`, "info");
      }
    } else {
      // ── POST (CREATE) → HTTP 201 ──
      try {
        const { data, error, status } = await supabase.from("courses").insert([
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
        ]).select();
        if (error) {
          showApiToast(`✅ Course published locally (Supabase: ${error.message})`, "info");
        } else {
          showApiToast(`✅ HTTP 201 Created — New course published & synced to storefront (Supabase REST POST /courses)`, "success");
        }
      } catch (err) {
        showApiToast(`✅ Course published locally (Supabase unavailable)`, "info");
      }
    }
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = async (id: string | number) => {
    if (confirm(t.deleteCourseConfirm)) {
      const updated = removeCourse(id);
      setCourses(updated as any);
      try {
        const { error } = await supabase.from("courses").delete().eq("id", id);
        if (error) console.warn("Notice: Deleted locally, Supabase:", error.message);
      } catch (err) {
        console.warn("Notice: Deleted locally:", err);
      }
    }
  };

  // ── OUTER EXPENSES HANDLERS ──
  const handleSaveOuterExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || !expenseForm.amount) return;
    const newExp: OuterExpense = {
      id: `exp-${Date.now()}`,
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount) || 0,
      date: expenseForm.date,
      notes: expenseForm.notes,
    };
    setOuterExpenses((prev) => [newExp, ...prev]);
    setExpenseForm({
      title: "",
      category: "Marketing",
      amount: "",
      date: new Date().toISOString().substring(0, 10),
      notes: "",
    });
    setIsExpenseModalOpen(false);
  };

  const handleDeleteOuterExpense = (id: string) => {
    setOuterExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ── BOOK DELIVERY DISPATCH HANDLERS ──
  const handleSaveBookDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.studentName.trim() || !dispatchForm.phone.trim()) return;
    const newDelivery: DeliveryRecord = {
      id: `del-${Date.now()}`,
      studentName: dispatchForm.studentName,
      phone: dispatchForm.phone,
      address: dispatchForm.address,
      courierService: dispatchForm.courierService,
      consignmentId: dispatchForm.consignmentId || `ST-${Math.floor(100000 + Math.random() * 900000)}`,
      trxId: dispatchForm.trxId || `BK${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryStatus: "Dispatched",
      date: new Date().toISOString().substring(0, 10),
    };
    setDeliveries((prev) => [newDelivery, ...prev]);
    setDispatchForm({
      studentName: "",
      phone: "",
      address: "",
      course: "২৫ দিনে সুন্দর হাতের লেখা",
      courierService: "Steadfast",
      consignmentId: "",
      trxId: "",
    });
    setIsDispatchModalOpen(false);
  };

  // ── DYNAMIC THEME CLASS HELPER ──
  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900";
  const bgSidebar = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-md";
  const bgCard = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs text-slate-900";
  const bgSubCard = isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200 text-slate-900";
  const textHeading = isDark ? "text-white" : "text-slate-900";
  const textSub = isDark ? "text-slate-400" : "text-slate-600";
  const inputStyle = isDark
    ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500"
    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500";
  const tableHeaderStyle = isDark ? "border-slate-800 bg-slate-950/80 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-700";
  const tableRowStyle = isDark ? "hover:bg-slate-800/30 divide-slate-800/60" : "hover:bg-slate-50 divide-slate-200";

  // ── CONDITIONAL RENDER: ADMIN LOGIN PORTAL ──
  if (!isAdminLoggedIn) {
    return (
      <div className={`min-h-screen ${bgMain} flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative transition-colors duration-200`}>
        {/* Top-Right Control Bar for Language & Theme */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-200 hover:text-white" : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
            }`}
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === "en" ? "ENG" : "বাংলা"}</span>
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-2xs ${
              isDark ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" : "bg-white border-slate-300 text-amber-600 hover:bg-slate-50"
            }`}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>

        {/* Login Card */}
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl ${bgCard} border-slate-700/50 backdrop-blur-md relative z-10 animate-in fade-in zoom-in-95 duration-300`}>
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 mx-auto mb-4 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-emerald-950/40">
              L
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${textHeading}`}>
              Learn<span className="text-emerald-500">Ops</span> Admin
            </h1>
            <p className={`text-xs mt-1.5 ${textSub}`}>
              {t.adminLoginSubtitle}
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2">
            <div className="text-[11px] text-emerald-400 font-medium">
              <span className="font-bold">{t.demoAdminCredentials}:</span> admin@learnops.com / admin123
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginEmail("admin@learnops.com");
                setLoginPassword("admin123");
                setLoginError("");
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] hover:bg-emerald-400 transition-colors cursor-pointer shrink-0"
            >
              Fill Demo
            </button>
          </div>

          {/* Error message */}
          {loginError && (
            <div className="mb-5 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${textHeading}`}>{t.emailAddress}</label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@learnops.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-hidden ${inputStyle}`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${textHeading}`}>{t.password}</label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm transition-colors outline-hidden ${inputStyle}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginRemember}
                  onChange={(e) => setLoginRemember(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>{t.rememberMe}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t.loginBtn}</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Home link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
            <a
              href="./"
              className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              ← {t.backToHome}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgMain} flex overflow-hidden font-sans transition-colors duration-200 relative`}>
      
      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200 cursor-pointer"
          aria-label="Close Mobile Sidebar"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
         LEFT SIDEBAR NAVIGATION MENU (RESPONSIVE OFF-CANVAS DRAWER & DESKTOP DOCK)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 md:z-40 ${bgSidebar} border-r transition-all duration-300 ease-in-out flex flex-col justify-between
          ${isMobileSidebarOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full md:translate-x-0"}
          ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white shadow-lg shrink-0">
                L
              </div>
              <span className={`font-extrabold text-base tracking-tight truncate ${textHeading} ${isSidebarCollapsed ? "md:hidden" : "block"}`}>
                Learn<span className="text-emerald-500">Ops</span> Admin
              </span>
            </div>

            {/* Desktop Collapse Toggle Pill Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`hidden md:flex p-1.5 rounded-xl text-slate-400 hover:${textHeading} hover:bg-slate-800/40 border border-slate-700/40 transition-all cursor-pointer items-center justify-center`}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-400" /> : <ChevronLeft className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Mobile Close Button (✕) */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TOP-LEFT SIDEBAR CONTROL ROW: SINGLE-CLICK LANGUAGE & THEME TOGGLES */}
          <div className={`px-4 my-3 pb-3 border-b ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
            {!isSidebarCollapsed || isMobileSidebarOpen ? (
              <div className="flex items-center gap-2">
                {/* 1-Click Language Toggle Button: 🌐 ENG or 🌐 বাংলা */}
                <button
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isDark
                      ? "bg-slate-950/80 border-slate-800 text-slate-200 hover:text-white hover:border-slate-700"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                  }`}
                  title="Switch Language"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === "en" ? "ENG" : "বাংলা"}</span>
                </button>

                {/* 1-Click Theme Toggle Button: ☀️ / 🌙 */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-2xs ${
                    isDark
                      ? "bg-slate-950/80 border-slate-800 text-amber-400 hover:bg-slate-800/60"
                      : "bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200"
                  }`}
                  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === "dark" ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-1">
                <button
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  className={`w-8 h-8 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-200 border-slate-300 text-slate-900"} text-xs font-black flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer`}
                  title={`Language: ${lang.toUpperCase()} (Click to switch)`}
                >
                  <Globe className="w-4 h-4 text-emerald-500" />
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-8 h-8 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-slate-200 border-slate-300 text-amber-600"} text-xs flex items-center justify-center hover:border-amber-500 transition-colors cursor-pointer`}
                  title={`Theme: ${theme.toUpperCase()} (Click to switch)`}
                >
                  {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-1">
            {[
              { id: "sales", label: t.salesAnalytics, icon: TrendingUp, desc: t.salesDesc },
              { id: "leads", label: t.leadPipeline, icon: Users, desc: t.leadDesc },
              { id: "employees", label: t.employeePerf, icon: PhoneCall, desc: t.employeeDesc },
              { id: "batches", label: t.teacherBatches, icon: GraduationCap, desc: t.teacherDesc },
              { id: "courses", label: t.courseCms, icon: BookOpen, desc: t.cmsDesc },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/30"
                      : isDark
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <div className="text-left leading-tight">
                      <div className="font-bold text-sm">
                        {item.label}
                      </div>
                      <div className={`text-[10px] ${isActive ? "text-emerald-100" : textSub}`}>
                        {item.desc}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & Admin Profile with Logout */}
        <div className={`border-t ${isDark ? "border-slate-800/80 bg-slate-900/40" : "border-slate-200 bg-slate-50/70"}`}>
          {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
            <div className="p-3 space-y-3">
              {/* DB Status */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.supabaseConnected}</span>
                </div>
                <button onClick={fetchSupabaseData} className="text-slate-400 hover:text-emerald-500 cursor-pointer" title={t.refreshDb}>
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
                </button>
              </div>

              {/* Admin Profile & Logout Box */}
              <div className={`p-2.5 rounded-xl border ${isDark ? "bg-slate-950/70 border-slate-800" : "bg-white border-slate-200"} flex items-center justify-between gap-2 shadow-2xs`}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                    SA
                  </div>
                  <div className="truncate">
                    <div className={`text-xs font-bold truncate leading-tight ${textHeading}`}>{t.loggedAdminUser}</div>
                    <div className="text-[10px] text-slate-400 truncate">admin@learnops.com</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer shrink-0"
                  title={t.logout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2 flex flex-col items-center gap-2">
              <button
                onClick={fetchSupabaseData}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-400 flex items-center justify-center cursor-pointer"
                title={t.refreshDb}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════════════
         MAIN CONTENT AREA (RIGHT SIDE)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out
          ml-0 ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}
          p-3.5 sm:p-6 lg:p-8 pb-24 overflow-x-hidden min-w-0
        `}
      >
        {/* Header Title Bar */}
        <header className={`flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className={`md:hidden p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"} shadow-xs cursor-pointer shrink-0`}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-emerald-500" />
            </button>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full mb-1">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {activeTab === "sales" && t.badgeSales}
                  {activeTab === "leads" && t.badgeLeads}
                  {activeTab === "employees" && t.badgeEmployees}
                  {activeTab === "batches" && t.badgeBatches}
                  {activeTab === "courses" && t.badgeCourses}
                </span>
              </div>
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight truncate ${textHeading}`}>
                {activeTab === "sales" && t.titleSales}
                {activeTab === "leads" && t.titleLeads}
                {activeTab === "employees" && t.titleEmployees}
                {activeTab === "batches" && t.titleBatches}
                {activeTab === "courses" && t.titleCourses}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isLoading && (
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/30">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden xs:inline">{t.syncing}</span>
              </span>
            )}

            {activeTab === "courses" && (
              <button
                onClick={handleOpenCreateCourse}
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addNewCourse}</span>
              </button>
            )}

            {/* Quick Admin Profile & Logout Button in Header */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700/50">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-[10px]">
                  SA
                </div>
                <div className="text-left">
                  <div className={`text-[11px] font-bold ${textHeading}`}>admin@learnops.com</div>
                  <div className="text-[9px] text-emerald-500 font-semibold">{t.superAdminRole}</div>
                </div>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all text-xs font-bold cursor-pointer"
                title={t.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 1: 📈 SALES ANALYTICS VIEW WITH 3-TAB SUB-MENU
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "sales" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 3-Tab Sub-Menu Pills */}
            <div className={`p-1.5 rounded-2xl ${bgCard} border shadow-md inline-flex flex-wrap gap-2`}>
              <button
                onClick={() => setSalesSubTab("overall")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  salesSubTab === "overall"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-emerald-500"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>{t.overallSalesTab}</span>
              </button>

              <button
                onClick={() => setSalesSubTab("extraCost")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  salesSubTab === "extraCost"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-emerald-500"
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>{t.extraCostTab}</span>
              </button>

              <button
                onClick={() => setSalesSubTab("delivery")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  salesSubTab === "delivery"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-emerald-500"
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>{t.deliveryTab}</span>
              </button>
            </div>

            {/* ── SUB-TAB 1: 📊 OVERALL SALES REPORT ── */}
            {salesSubTab === "overall" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Filter Controls Bar with Conditional Date & Employee Dropdowns */}
                <div className={`${bgCard} p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">
                      {t.timePeriodLabel}
                    </span>

                    {/* Main Period Selector: [ Weekly | Monthly | Yearly ] */}
                    <div className={`flex ${bgSubCard} p-1 rounded-2xl border`}>
                      {(["Weekly", "Monthly", "Yearly"] as const).map((period) => (
                        <button
                          key={period}
                          onClick={() => setSalesTimePeriod(period)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            salesTimePeriod === period
                              ? "bg-emerald-500 text-white shadow-xs"
                              : "text-slate-400 hover:text-emerald-500"
                          }`}
                        >
                          {period === "Weekly" ? t.periodWeekly : period === "Monthly" ? t.periodMonthly : t.periodYearly}
                        </button>
                      ))}
                    </div>

                    {/* CONDITIONAL GRANULAR DATE DROPDOWNS */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400">{t.selectYear}</span>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={`${inputStyle} text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                      >
                        {years.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(salesTimePeriod === "Monthly" || salesTimePeriod === "Weekly") && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400">{t.selectMonth}</span>
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className={`${inputStyle} text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                        >
                          {t.months.map((m, idx) => (
                            <option key={idx} value={String(idx)}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {salesTimePeriod === "Weekly" && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400">{t.selectWeek}</span>
                        <select
                          value={selectedWeek}
                          onChange={(e) => setSelectedWeek(e.target.value)}
                          className={`${inputStyle} text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                        >
                          {t.weeks.map((w, idx) => (
                            <option key={idx} value={`Week ${idx + 1}`}>
                              {w}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Course & Employee Filter Dropdowns */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        {t.courseFilterLabel}
                      </span>
                      <select
                        value={salesCourseFilter}
                        onChange={(e) => setSalesCourseFilter(e.target.value)}
                        className={`${inputStyle} text-xs font-bold rounded-2xl px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                      >
                        <option value="All">{t.allCourses}</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        {t.employeeFilterLabel}
                      </span>
                      <select
                        value={salesEmployeeFilter}
                        onChange={(e) => setSalesEmployeeFilter(e.target.value)}
                        className={`${inputStyle} text-xs font-bold rounded-2xl px-3.5 py-2 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                      >
                        <option value="All">{t.allEmployees}</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.name}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── EMPLOYEE SALES ATTRIBUTION BREAKDOWN & LEADERBOARD CARDS ── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className={`text-xl font-bold ${textHeading}`}>
                        {t.employeeSalesTitle}
                      </h3>
                      <p className={`text-xs ${textSub}`}>
                        Telesales agent converted course units, closed revenue, and performance targets.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      {employees.length} Active Sales Representatives
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {employees.map((emp, idx) => {
                      const empBuyers = buyersList.filter((b) => b.claimedBy === emp.name);
                      const empSalesCount = empBuyers.length > 0 ? empBuyers.length : emp.convertedSales;
                      const empRevenue = empBuyers.length > 0 ? empBuyers.reduce((acc, c) => acc + c.amount, 0) : emp.revenueGenerated;
                      const convRate = Math.round((empSalesCount / (emp.totalCalls || 100)) * 100);
                      const isTop = idx === 0;

                      return (
                        <div
                          key={emp.id}
                          className={`${bgCard} p-5 rounded-3xl border relative overflow-hidden shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between`}
                        >
                          {isTop && (
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-bl-xl shadow-xs">
                              ★ {t.topPerformer}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center justify-center text-sm shrink-0">
                                {emp.name.substring(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className={`font-bold text-sm truncate ${textHeading}`}>{emp.name}</div>
                                <div className="text-[11px] text-slate-400 truncate">{emp.role}</div>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-800/60">
                              <div className="flex items-center justify-between text-xs">
                                <span className={textSub}>{t.unitsSold}:</span>
                                <span className={`font-black ${textHeading}`}>{empSalesCount} {lang === "en" ? "courses" : "টি"}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className={textSub}>{t.agentRevenue}:</span>
                                <span className="font-black text-emerald-500">৳{empRevenue.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className={textSub}>{t.conversionRate}:</span>
                                <span className="font-bold text-amber-400">{convRate}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                              <span>Target Progress</span>
                              <span className="font-bold text-emerald-400">{Math.min(100, Math.round((empSalesCount / 30) * 100))}%</span>
                            </div>
                            <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, (empSalesCount / 30) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revenue Chart Visualizer */}
                <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl border`}>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <div>
                      <h3 className={`text-xl font-bold ${textHeading}`}>
                        {t.revenueTrend}
                      </h3>
                      <p className={`text-xs ${textSub}`}>{t.filteredRevenue} <strong className="text-emerald-500">৳{totalFilteredRevenue.toLocaleString()}</strong></p>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      {t.revenueGrowth}
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
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} />
                        <XAxis dataKey="name" stroke={isDark ? "#64748B" : "#475569"} fontSize={12} />
                        <YAxis stroke={isDark ? "#64748B" : "#475569"} fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                            borderColor: isDark ? "#334155" : "#CBD5E1",
                            borderRadius: "12px",
                            color: isDark ? "#FFF" : "#0F172A",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Buyers List Table with Sold By (Agent) Attribution */}
                <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
                  <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"} flex items-center justify-between flex-wrap gap-2`}>
                    <div>
                      <h3 className={`text-lg font-bold ${textHeading}`}>
                        {t.confirmedBuyersTable}
                      </h3>
                      <p className={`text-xs ${textSub}`}>Student enrollment sales with telesales agent attribution.</p>
                    </div>
                    <span className={`text-xs ${textSub}`}>{t.totalBuyers} <strong className="text-emerald-500">{filteredBuyers.length}</strong></span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                          <th className="py-4 px-4">{t.colStudentParent}</th>
                          <th className="py-4 px-4">{t.colPhone}</th>
                          <th className="py-4 px-4">{t.colCourse}</th>
                          <th className="py-4 px-4">{t.soldByAgent}</th>
                          <th className="py-4 px-4">{t.colPayment} (৳)</th>
                          <th className="py-4 px-4">{t.colTrxId}</th>
                          <th className="py-4 px-4">{t.colDate}</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                        {filteredBuyers.map((b) => (
                          <tr key={b.id} className="transition-colors">
                            <td className="py-4 px-4">
                              <div className={`font-bold ${textHeading} text-sm`}>{b.studentName}</div>
                              <div className={`text-[11px] ${textSub}`}>{t.parentLabel} {b.parentName}</div>
                            </td>
                            <td className="py-4 px-4 font-mono text-emerald-500 font-bold">{b.phone}</td>
                            <td className={`py-4 px-4 font-semibold ${textHeading}`}>{b.course}</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                                <User className="w-3 h-3 shrink-0" />
                                <span>{b.claimedBy}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 font-black text-emerald-500">৳{b.amount.toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <span className={`font-mono text-amber-500 ${bgSubCard} px-2.5 py-1 rounded-lg border inline-block`}>
                                {b.trxId}
                              </span>
                            </td>
                            <td className={`py-4 px-4 ${textSub}`}>{b.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── SUB-TAB 2: 💸 EXTRA COST & OUTER EXPENSES REPORT ── */}
            {salesSubTab === "extraCost" && (() => {
              const grossSalesTotal = totalFilteredRevenue || 385000;
              const courseProductionTotal = extraCosts.reduce((acc, c) => acc + c.totalExpense * 15, 0); // unit production
              const totalOuterExpenses = outerExpenses.reduce((acc, e) => acc + e.amount, 0);
              const totalOverallExpenses = courseProductionTotal + totalOuterExpenses;
              const netProfitCalculated = grossSalesTotal - totalOverallExpenses;

              return (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Top 4 Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Gross Sales */}
                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.grossSales}</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className={`text-2xl font-black ${textHeading}`}>
                        ৳{grossSalesTotal.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-emerald-500 font-semibold mt-1">Confirmed Course Revenue</p>
                    </div>

                    {/* 2. Course Kit & Production Cost */}
                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.courseProductionTotal}</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-amber-500">
                        ৳{courseProductionTotal.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-amber-500 font-semibold mt-1">Printing & Inbound Freight</p>
                    </div>

                    {/* 3. Outer Operational Expenses */}
                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.outerExpenseTotal}</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <Receipt className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-purple-400">
                        ৳{totalOuterExpenses.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-purple-400 font-semibold mt-1">Marketing, Hiring, Tools & Ops</p>
                    </div>

                    {/* 4. Net Operating Profit */}
                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.operatingProfit}</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-blue-400">
                        ৳{netProfitCalculated.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-blue-400 font-semibold mt-1">
                        Margin: {((netProfitCalculated / grossSalesTotal) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* ── SECTION A: OVERALL OUTER & OPERATIONAL EXPENSES TABLE ── */}
                  <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
                    <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"} flex items-center justify-between flex-wrap gap-4`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xl font-bold ${textHeading}`}>
                            {t.outerExpensesTitle}
                          </h3>
                          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                            ৳{totalOuterExpenses.toLocaleString()}
                          </span>
                        </div>
                        <p className={`text-xs ${textSub} mt-0.5`}>
                          Track external operational expenses like Facebook Marketing, Teacher Recruitment, Workbooks, and Server subscriptions.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsExpenseModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.addOuterExpense}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                            <th className="py-4 px-4">{t.expenseNotes}</th>
                            <th className="py-4 px-4">{t.expenseCategory}</th>
                            <th className="py-4 px-4">{t.expenseDate}</th>
                            <th className="py-4 px-4">{t.expenseAmount}</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                          {outerExpenses.map((exp) => {
                            const catColor =
                              exp.category === "Marketing"
                                ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                                : exp.category === "Books & Materials"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : exp.category === "Hiring"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : exp.category === "Software"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                : exp.category === "Logistics"
                                ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                                : "bg-slate-500/10 text-slate-300 border-slate-500/20";

                            return (
                              <tr key={exp.id} className="transition-colors">
                                <td className="py-4 px-4">
                                  <div className={`font-bold ${textHeading} text-sm`}>{exp.title}</div>
                                  {exp.notes && <div className={`text-[11px] ${textSub} mt-0.5`}>{exp.notes}</div>}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold border ${catColor}`}>
                                    {exp.category}
                                  </span>
                                </td>
                                <td className={`py-4 px-4 ${textSub}`}>{exp.date}</td>
                                <td className="py-4 px-4 font-black text-rose-400 text-sm">৳{exp.amount.toLocaleString()}</td>
                                <td className="py-4 px-4 text-right">
                                  <button
                                    onClick={() => handleDeleteOuterExpense(exp.id)}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Delete Expense"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── SECTION B: ITEMIZED COURSE UNIT EXPENSES TABLE ── */}
                  <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
                    <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"} flex items-center justify-between`}>
                      <div>
                        <h3 className={`text-xl font-bold ${textHeading}`}>
                          {t.itemizedCostTable}
                        </h3>
                        <p className={`text-xs ${textSub}`}>Manage unit book production and courier expenses per course.</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                            <th className="py-4 px-4">{t.colCourse}</th>
                            <th className="py-4 px-4">{t.printingCost}</th>
                            <th className="py-4 px-4">{t.inboundFreight}</th>
                            <th className="py-4 px-4">{t.courierFee}</th>
                            <th className="py-4 px-4">{t.totalExpenseCol}</th>
                            <th className="py-4 px-4">{t.netProfitMargin}</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                          {extraCosts.map((costItem) => {
                            const marginPercent = ((costItem.netMargin / costItem.unitPrice) * 100).toFixed(1);
                            return (
                              <tr key={costItem.id} className="transition-colors">
                                <td className={`py-4 px-4 font-bold ${textHeading} text-sm`}>
                                  {costItem.courseTitle}
                                  <div className={`text-[11px] ${textSub}`}>Unit Price: ৳{costItem.unitPrice}</div>
                                </td>
                                <td className="py-4 px-4 font-semibold text-slate-300">৳{costItem.printingCost}</td>
                                <td className="py-4 px-4 font-semibold text-slate-300">৳{costItem.inboundFreight}</td>
                                <td className="py-4 px-4 font-semibold text-slate-300">৳{costItem.courierFee}</td>
                                <td className="py-4 px-4 font-bold text-amber-500">৳{costItem.totalExpense}</td>
                                <td className="py-4 px-4 font-extrabold text-emerald-500">
                                  ৳{costItem.netMargin} <span className="text-[11px] font-normal text-slate-400">({marginPercent}%)</span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button
                                    onClick={() => handleOpenEditCost(costItem)}
                                    className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                    title="Edit Expenses"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── SUB-TAB 3: 🚚 COURSE BOOK DELIVERY TRACKING REPORT ── */}
            {salesSubTab === "delivery" && (() => {
              const totalDispatched = deliveries.length;
              const deliveredCount = deliveries.filter((d) => d.deliveryStatus === "Delivered").length;
              const inTransitCount = deliveries.filter((d) => d.deliveryStatus === "In Transit" || d.deliveryStatus === "Dispatched").length;
              const pendingCount = deliveries.filter((d) => d.deliveryStatus === "Pending").length;
              const successRate = totalDispatched > 0 ? Math.round((deliveredCount / totalDispatched) * 100) : 0;

              return (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Top 4 Delivery KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.booksDispatched}</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <PackageCheck className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className={`text-2xl font-black ${textHeading}`}>{totalDispatched}</h3>
                      <p className="text-[10px] text-blue-400 font-semibold mt-1">Course Books & Practice Workbooks</p>
                    </div>

                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.deliveredBooks}</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-emerald-500">{deliveredCount}</h3>
                      <p className="text-[10px] text-emerald-500 font-semibold mt-1">Doorstep Delivery Completed</p>
                    </div>

                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.inTransitBooks}</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <Truck className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-purple-400">{inTransitCount}</h3>
                      <p className="text-[10px] text-purple-400 font-semibold mt-1">With Courier Hub / Rider</p>
                    </div>

                    <div className={`${bgCard} rounded-3xl p-5 shadow-xl border relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${textSub}`}>{t.deliverySuccessRate}</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Percent className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-amber-500">{successRate}%</h3>
                      <p className="text-[10px] text-amber-500 font-semibold mt-1">Delivery Fulfillment Metric</p>
                    </div>
                  </div>

                  {/* Logistics Control Bar & Dispatch Button */}
                  <div className={`${bgCard} p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 mr-1">
                        {t.deliveryStatus}:
                      </span>
                      <div className={`flex ${bgSubCard} p-1 rounded-2xl border flex-wrap`}>
                        {(["All", "Pending", "Dispatched", "In Transit", "Delivered", "Returned"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setDeliveryStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              deliveryStatusFilter === st
                                ? "bg-emerald-500 text-white shadow-xs"
                                : "text-slate-400 hover:text-emerald-500"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder={t.searchDelivery}
                          value={deliverySearchQuery}
                          onChange={(e) => setDeliverySearchQuery(e.target.value)}
                          className={`w-full pl-9 pr-3 py-1.5 rounded-xl ${inputStyle} text-xs font-semibold focus:outline-none`}
                        />
                      </div>

                      <button
                        onClick={() => setIsDispatchModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
                      >
                        <Truck className="w-4 h-4" />
                        <span>{t.dispatchBookBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Logistics Table */}
                  <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
                    <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"} flex items-center justify-between`}>
                      <div>
                        <h3 className={`text-xl font-bold ${textHeading}`}>
                          {t.logisticsTrackingTable}
                        </h3>
                        <p className={`text-xs ${textSub}`}>Consignment status and student courier dispatches.</p>
                      </div>
                      <span className={`text-xs ${textSub}`}>Total: <strong className="text-emerald-500">{filteredDeliveries.length}</strong></span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                            <th className="py-4 px-4">{t.colStudentParent}</th>
                            <th className="py-4 px-4">{t.addressLabel}</th>
                            <th className="py-4 px-4">{t.courierService}</th>
                            <th className="py-4 px-4">{t.consignmentId}</th>
                            <th className="py-4 px-4">{t.colTrxId}</th>
                            <th className="py-4 px-4">{t.deliveryStatus}</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                          {filteredDeliveries.map((del) => (
                            <tr key={del.id} className="transition-colors">
                              <td className="py-4 px-4">
                                <div className={`font-bold ${textHeading} text-sm`}>{del.studentName}</div>
                                <div className="font-mono text-emerald-500 text-xs font-bold mt-0.5">{del.phone}</div>
                              </td>
                              <td className={`py-4 px-4 text-xs ${textSub} max-w-xs truncate`}>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                  <span>{del.address}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-bold text-blue-400">
                                <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                                  {del.courierService}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono font-bold text-amber-500">{del.consignmentId}</td>
                              <td className="py-4 px-4 font-mono text-slate-400">{del.trxId}</td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                    del.deliveryStatus === "Delivered"
                                      ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                                      : del.deliveryStatus === "In Transit"
                                      ? "bg-purple-500/20 text-purple-500 border-purple-500/30"
                                      : del.deliveryStatus === "Dispatched"
                                      ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                      : del.deliveryStatus === "Returned"
                                      ? "bg-red-500/20 text-red-500 border-red-500/30"
                                      : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                                  }`}
                                >
                                  ● {del.deliveryStatus}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => handleOpenUpdateDeliveryStatus(del)}
                                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                  {t.updateStatusBtn}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 2: 👥 LEAD MANAGEMENT PIPELINE VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "leads" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Filter Bar: Lead Source & Claim Status Toggles */}
            <div className={`${bgCard} p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">
                  {t.sourceFilterLabel}
                </span>
                {[
                  { id: "All", label: t.allSources, icon: Filter },
                  { id: "Ad Click", label: t.sourceAds, icon: Megaphone },
                  { id: "Google Form", label: t.sourceForms, icon: FileText },
                  { id: "Social DM", label: t.sourceDms, icon: MessageCircle },
                ].map((s) => {
                  const SIcon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setLeadSourceFilter(s.id as any)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadSourceFilter === s.id
                          ? "bg-emerald-500 text-white shadow-xs"
                          : `${bgSubCard} border`
                      }`}
                    >
                      <SIcon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-400">
                  {t.claimStatusLabel}
                </span>
                <div className={`flex ${bgSubCard} p-1 rounded-2xl border`}>
                  {(["All", "Unassigned", "Assigned"] as const).map((claimState) => (
                    <button
                      key={claimState}
                      onClick={() => setLeadClaimFilter(claimState)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        leadClaimFilter === claimState
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-blue-500"
                      }`}
                    >
                      {claimState === "All" ? t.claimAll : claimState === "Unassigned" ? t.claimUnassigned : t.claimAssigned}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-1.5 rounded-xl ${inputStyle} text-xs font-semibold focus:outline-none`}
                  />
                </div>
              </div>
            </div>

            {/* Inbound Lead Tracking Table */}
            <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
              <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"} flex items-center justify-between`}>
                <h3 className={`text-xl font-bold ${textHeading}`}>
                  {t.inboundLeadPipeline}
                </h3>
                <span className={`text-xs ${textSub}`}>{t.displayedLeads} <strong className="text-emerald-500">{filteredLeadsPipeline.length}</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                      <th className="py-4 px-4">{t.colStudentPhone}</th>
                      <th className="py-4 px-4">{t.colInterestedCourse}</th>
                      <th className="py-4 px-4">{t.colLeadSource}</th>
                      <th className="py-4 px-4">{t.colClaimedRep}</th>
                      <th className="py-4 px-4">{t.colLeadStatus}</th>
                      <th className="py-4 px-4 text-right">{t.colActionPayment}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                    {filteredLeadsPipeline.map((lead) => (
                      <tr key={lead.id} className="transition-colors">
                        <td className="py-4 px-4">
                          <div className={`font-bold ${textHeading} text-sm`}>
                            {lead.studentName}
                          </div>
                          <div className={`text-[11px] ${textSub}`}>
                            {t.parentLabel} {lead.parentName}
                          </div>
                          <div className="font-mono text-emerald-500 font-bold text-xs mt-0.5">
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </div>
                        </td>

                        <td className={`py-4 px-4 font-semibold ${textHeading}`}>
                          {lead.courseInterest}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                              lead.source === "Ad Click"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                : lead.source === "Google Form"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                : "bg-purple-500/10 text-purple-500 border-purple-500/30"
                            }`}
                          >
                            {lead.source === "Ad Click" && <Megaphone className="w-3.5 h-3.5" />}
                            {lead.source === "Google Form" && <FileText className="w-3.5 h-3.5" />}
                            {lead.source === "Social DM" && <MessageCircle className="w-3.5 h-3.5" />}
                            {lead.source === "Ad Click" ? t.sourceAds : lead.source === "Google Form" ? t.sourceForms : t.sourceDms}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {lead.claimedBy ? (
                              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" />
                                {lead.claimedBy}
                              </div>
                            ) : (
                              <div className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
                                {t.claimUnassigned}
                              </div>
                            )}

                            <select
                              value={lead.claimedBy || "Unassigned"}
                              onChange={(e) => handleReassignLeadRep(lead.id, e.target.value)}
                              className={`w-full ${inputStyle} text-[11px] font-bold rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer mt-1`}
                            >
                              <option value="Unassigned">{t.unassignedOption}</option>
                              {employees.map((emp) => (
                                <option key={emp.id} value={emp.name}>
                                  {emp.name} ({emp.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead["status"])}
                            className={`text-xs font-bold rounded-xl px-3 py-2 border cursor-pointer ${
                              lead.status === "Converted"
                                ? "bg-emerald-500/20 text-emerald-600 border-emerald-500"
                                : lead.status === "In Progress" || lead.status === "Interested"
                                ? "bg-purple-500/20 text-purple-600 border-purple-500"
                                : lead.status === "Claimed" || lead.status === "Called"
                                ? "bg-blue-500/20 text-blue-600 border-blue-500"
                                : lead.status === "Rejected"
                                ? "bg-red-500/20 text-red-600 border-red-500"
                                : "bg-slate-500/20 text-slate-600 border-slate-500"
                            }`}
                          >
                            <option value="New">{t.statusNew}</option>
                            <option value="In Progress">{t.statusInProgress}</option>
                            <option value="Claimed">{t.statusClaimed}</option>
                            <option value="Called">{t.statusCalled}</option>
                            <option value="Interested">{t.statusInterested}</option>
                            <option value="Converted">{t.statusConverted}</option>
                            <option value="Rejected">{t.statusRejected}</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right font-bold">
                          {lead.paymentConfirmed ? (
                            <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                              ৳{lead.paymentAmount} ✓
                            </span>
                          ) : (
                            <span className="text-slate-400">{t.duePayment}</span>
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
           SECTION 3: 🕵️ EMPLOYEE PERFORMANCE & STAFF CREDENTIALS VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "employees" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Staff Credentials & Onboarding Management Card */}
            <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl border space-y-6`}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-emerald-500" />
                    <h3 className={`text-xl font-bold ${textHeading}`}>
                      {t.staffManagementTitle}
                    </h3>
                  </div>
                  <p className={`text-xs ${textSub} mt-1`}>
                    {t.staffOnboardingSubtitle}
                  </p>
                </div>
              </div>

              {/* Add New Employee Form */}
              <form onSubmit={handleAddEmployee} className={`${bgSubCard} p-5 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end`}>
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.empName} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. মো. আরিফুল ইসলাম"
                    value={newStaffForm.name}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                    className={`w-full ${inputStyle} text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.empEmail} *</label>
                  <input
                    type="email"
                    required
                    placeholder="emp@learnops.com"
                    value={newStaffForm.email}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    className={`w-full ${inputStyle} text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.empPhone}</label>
                  <input
                    type="text"
                    placeholder="01711-XXXXXX"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className={`w-full ${inputStyle} text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.tempPassword}</label>
                  <input
                    type="text"
                    placeholder="Pass1234!"
                    value={newStaffForm.tempPassword}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, tempPassword: e.target.value })}
                    className={`w-full ${inputStyle} text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.empRole}</label>
                  <div className="flex gap-2">
                    <select
                      value={newStaffForm.role}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value as any })}
                      className={`flex-1 ${inputStyle} text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                    >
                      <option value="Telesales">Telesales</option>
                      <option value="Teacher">Teacher</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </form>

              {/* Staff Roster Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                      <th className="py-4 px-4">{t.empName}</th>
                      <th className="py-4 px-4">{t.empEmail} / {t.empPhone}</th>
                      <th className="py-4 px-4">{t.empRole}</th>
                      <th className="py-4 px-4">{t.tempPassword}</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                    {staffMembers.map((staff) => (
                      <tr key={staff.id} className="transition-colors">
                        <td className={`py-4 px-4 font-bold ${textHeading} text-sm`}>{staff.name}</td>
                        <td className="py-4 px-4">
                          <div className={`font-semibold ${textHeading}`}>{staff.email}</div>
                          <div className="font-mono text-emerald-500 text-xs font-bold mt-0.5">{staff.phone}</div>
                        </td>
                        <td className="py-4 px-4 font-bold">
                          <span className={`px-2.5 py-1 rounded-lg text-xs border ${
                            staff.role === "Telesales" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-400">
                          <span className={`${bgSubCard} px-2.5 py-1 rounded-lg border font-mono text-xs text-amber-400`}>
                            {staff.tempPassword || "pass1234"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            staff.status === "Active" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-red-500/20 text-red-500 border-red-500/30"
                          }`}>
                            ● {staff.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenResetPassword(staff)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>{t.resetPassword}</span>
                          </button>

                          <button
                            onClick={() => handleToggleStaffStatus(staff.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              staff.status === "Active"
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30"
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30"
                            }`}
                          >
                            {staff.status === "Active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            <span>{staff.status === "Active" ? t.deactivateAccount : t.activateAccount}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Cards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employees.map((emp) => (
                <div key={emp.id} className={`${bgCard} rounded-3xl p-6 shadow-xl border flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        emp.status === "Online"
                          ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                          : emp.status === "Idle"
                          ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
                          : "bg-slate-500/20 text-slate-500 border-slate-500/30"
                      }`}>
                        ● {emp.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{emp.convertedSales}{t.salesCount}</span>
                    </div>

                    <h3 className={`text-lg font-bold ${textHeading} mb-0.5`}>
                      {emp.name}
                    </h3>
                    <p className={`text-xs ${textSub} mb-4`}>{emp.role}</p>

                    <div className={`space-y-2 text-xs ${bgSubCard} p-3 rounded-2xl border`}>
                      <div className="flex justify-between">
                        <span className={textSub}>{t.totalCalls}</span>
                        <span className={`font-bold ${textHeading}`}>{emp.totalCalls}{t.callsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={textSub}>{t.dmConversion}</span>
                        <span className="font-bold text-emerald-500">{emp.socialDmConversion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={textSub}>{t.adConversion}</span>
                        <span className="font-bold text-blue-500">{emp.adLeadConversion}%</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t ${isDark ? "border-slate-800" : "border-slate-200"} flex justify-between items-center text-xs`}>
                    <span className={textSub}>{t.revenueLabel}</span>
                    <span className="font-extrabold text-amber-500 text-sm">৳{emp.revenueGenerated.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Table */}
            <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
              <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <h3 className={`text-xl font-bold ${textHeading}`}>
                  {t.employeeLeaderboard}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                      <th className="py-4 px-4">{t.colEmpName}</th>
                      <th className="py-4 px-4">{t.colPositionRole}</th>
                      <th className="py-4 px-4">{t.colPortalActivity}</th>
                      <th className="py-4 px-4">{t.colLoggedCalls}</th>
                      <th className="py-4 px-4">{t.colConvertedSales}</th>
                      <th className="py-4 px-4">{t.colDmVsAd}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableRowStyle} text-xs font-medium`}>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="transition-colors">
                        <td className={`py-4 px-4 font-bold ${textHeading} text-sm`}>{emp.name}</td>
                        <td className={`py-4 px-4 ${textSub}`}>{emp.role}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            emp.status === "Online" ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                          }`}>
                            ● {emp.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-blue-500">{emp.totalCalls}{t.callsCount}</td>
                        <td className="py-4 px-4 font-bold text-emerald-500">{emp.convertedSales}{t.salesCount} (৳{emp.revenueGenerated.toLocaleString()})</td>
                        <td className={`py-4 px-4 ${textSub}`}>
                          DM: <strong className="text-emerald-500">{emp.socialDmConversion}%</strong> | Ad: <strong className="text-blue-500">{emp.adLeadConversion}%</strong>
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
           SECTION 4: 👨‍🏫 TEACHER & BATCH MANAGEMENT VIEW (DRILLDOWN FEATURE 5)
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "batches" && (() => {
          const selectedCourse = courses.find((c) => String(c.id) === String(selectedCourseId)) || courses[0];
          const filteredBatches = batches.filter((b) => {
            if (!selectedCourse) return true;
            if (b.courseId !== undefined) return String(b.courseId) === String(selectedCourse.id);
            return b.courseTitle === selectedCourse.title;
          });

          return (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Step 1 & 2: Course Cards Overview with glowing active border */}
              <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl border`}>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-6 h-6 text-amber-500" />
                  <h3 className={`text-xl font-bold ${textHeading}`}>
                    {t.headTeacherTitle}
                  </h3>
                </div>
                <p className={`text-xs ${textSub} mb-6`}>
                  {t.headTeacherSubtitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const isSelected = selectedCourse && String(course.id) === String(selectedCourse.id);
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all space-y-3 ${
                          isSelected
                            ? isDark
                              ? "bg-slate-900 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/40"
                              : "bg-emerald-50/50 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/40"
                            : `${bgSubCard} border hover:border-emerald-500/50`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`font-bold text-sm ${textHeading}`}>
                            {course.title}
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40">
                              {t.selectedBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-500 font-semibold">{t.currentHeadTeacher} {course.headTeacher || course.instructor}</div>

                        <select
                          value={course.headTeacher || course.instructor}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSetHeadTeacher(course.id, e.target.value);
                          }}
                          className={`w-full ${inputStyle} text-xs font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                        >
                          <option value="রাহেলা খাতুন">রাহেলা খাতুন (হ্যান্ডরাইটিং বিশেষজ্ঞ)</option>
                          <option value="ফারহানা বেগম">ফারহানা বেগম (হস্তলিখন মেন্টর)</option>
                          <option value="মো. আরিফুল ইসলাম">মো. আরিফুল ইসলাম (স্পোকেন ট্রেইনার)</option>
                          <option value="সুমাইয়া আক্তার">সুমাইয়া আক্তার (ভাষা শিক্ষা বিশেষজ্ঞ)</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 & 3: Filtered Batches List & Expandable Student Roster */}
              <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className={`text-xl font-bold ${textHeading}`}>
                        {t.activeBatchesTitle}
                      </h3>
                      {selectedCourse && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                          {t.filteredCourseBadge} {selectedCourse.title}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${textSub} mt-1`}>
                      Create designated batches with schedule slots and assign registered teachers.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedCourse) setNewBatchCourseId(String(selectedCourse.id));
                      setIsAddBatchModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addNewBatch}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => {
                      const isExpanded = expandedBatchId === batch.id;
                      return (
                        <div key={batch.id} className={`border rounded-2xl overflow-hidden ${bgSubCard}`}>
                          {/* Batch Header Card */}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                              className={`flex-1 p-5 flex items-center justify-between ${
                                isDark ? "bg-slate-900 hover:bg-slate-800/80" : "bg-white hover:bg-slate-50"
                              } transition-colors text-left cursor-pointer`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
                                  <Building className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className={`font-bold text-base ${textHeading}`}>
                                    {batch.name} - <span className="text-emerald-500">{batch.courseTitle}</span>
                                  </h4>
                                  <p className={`text-xs ${textSub}`}>{t.instructorLabel} {batch.headTeacher} | {t.scheduleLabel} {batch.schedule}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  {batch.totalStudents} / {batch.maxStudents || 25} {t.studentsCount}
                                </span>
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                              </div>
                            </button>

                            <div className={`p-4 ${isDark ? "bg-slate-900" : "bg-white"} border-l ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                              <button
                                onClick={() => handleDeleteBatch(batch.id)}
                                className="p-2 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete Batch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Step 3: Expandable Student Roster & Performance Reports */}
                          {isExpanded && (
                            <div className={`p-6 border-t ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"} space-y-4`}>
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  {t.expandRosterTitle}
                                </div>
                                <span className="text-xs font-semibold text-emerald-500">
                                  Enrolled: {batch.roster.length} students
                                </span>
                              </div>

                              {batch.roster.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {batch.roster.map((std) => (
                                    <div key={std.id} className={`${bgCard} border rounded-2xl p-4 space-y-2`}>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-amber-500">{t.rollNoLabel}{std.rollNo}</span>
                                        <div className="flex items-center gap-1.5">
                                          {(std.whatsappNumber || std.phone) && (
                                            <a
                                              href={`https://wa.me/${(std.whatsappNumber || std.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${std.parentName || std.name}, লার্নঅপস একাডেমি থেকে আপনার সন্তান ${std.name}-এর ক্লাসের তথ্য...`)}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="inline-flex items-center gap-1 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-500 hover:text-white px-2 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-500/30 transition-all cursor-pointer"
                                              title="Direct WhatsApp"
                                            >
                                              <MessageSquare className="w-3 h-3" />
                                              <span>WhatsApp</span>
                                            </a>
                                          )}
                                          <span className="text-xs font-black text-emerald-500">{std.grade}</span>
                                        </div>
                                      </div>
                                      <h5 className={`font-bold ${textHeading} text-sm`}>
                                        {std.name}
                                      </h5>
                                      <p className={`text-[11px] ${textSub}`}>
                                        {t.parentLabel} {std.parentName} {std.phone ? `(${std.phone})` : ""}
                                      </p>

                                      <div className={`pt-2 border-t ${isDark ? "border-slate-800" : "border-slate-200"} flex justify-between text-xs font-semibold`}>
                                        <span>{t.attendanceLabel} <strong className="text-emerald-500">{std.attendancePercentage}%</strong></span>
                                        <span>{t.avgScoreLabel} <strong className="text-purple-500">{std.avgExamScore}/100</strong></span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className={`p-6 text-center rounded-xl border ${bgSubCard} ${textSub} text-xs`}>
                                  No students enrolled in this batch yet. Leads converted via Telesales will appear here automatically.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className={`p-8 text-center rounded-2xl border ${bgSubCard} ${textSub} text-sm`}>
                      {t.noBatchesFound}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 5: 📚 COURSE CMS VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border flex flex-col justify-between group transition-all`}>
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
                      <h3 className={`text-lg font-bold ${textHeading} leading-snug`}>
                        {course.title}
                      </h3>
                      <p className={`text-xs ${textSub} line-clamp-2 leading-relaxed`}>
                        {course.description}
                      </p>
                      
                      <div className={`text-[11px] ${textSub} font-mono truncate`}>
                        {t.googleFormLabel} <span className="text-emerald-500">{course.googleFormUrl}</span>
                      </div>

                      <div className={`flex items-center justify-between text-xs ${textSub} pt-2 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                        <span>{t.durationLabel} <strong className={textHeading}>{course.duration}</strong></span>
                        <span>{t.instructorLabel} <strong className="text-emerald-500">{course.instructor}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 ${bgSubCard} border-t flex gap-2`}>
                    <button
                      onClick={() => handleOpenEditCourse(course)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {t.editCourseBtn}
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
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



      </main>

      {/* ── API STATUS TOAST NOTIFICATION ── */}
      {apiToast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-lg w-full mx-4 animate-in slide-in-from-bottom-4 fade-in ${
            apiToast.status === "success"
              ? "bg-emerald-950 border-emerald-700/60 text-emerald-200"
              : apiToast.status === "error"
              ? "bg-red-950 border-red-700/60 text-red-200"
              : "bg-slate-900 border-slate-700/60 text-slate-200"
          }`}
        >
          <span className="text-lg shrink-0 mt-0.5">
            {apiToast.status === "success" ? "✅" : apiToast.status === "error" ? "❌" : "ℹ️"}
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide uppercase mb-0.5 opacity-60">
              {apiToast.status === "success" ? "API Response" : apiToast.status === "error" ? "API Error" : "Status"}
            </p>
            <p className="text-sm font-semibold leading-snug">{apiToast.message}</p>
          </div>
          <button
            onClick={() => setApiToast(null)}
            className="ml-auto shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] border`}>
            <button onClick={() => setIsCourseModalOpen(false)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-2xl font-bold ${textHeading} mb-4`}>
              {editingCourseId ? t.modalEditTitle : t.modalCreateTitle}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.fieldTitle}
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm focus:border-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.fieldPrice}
                  </label>
                  <input
                    type="number"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm font-bold text-emerald-500 focus:border-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.fieldDuration}
                  </label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm focus:border-emerald-500`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.fieldInstructor}
                </label>
                <input
                  type="text"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.fieldGoogleForm}
                </label>
                <input
                  type="url"
                  value={courseForm.googleFormUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, googleFormUrl: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs font-mono text-emerald-500 focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.fieldImageUrl}
                </label>
                <input
                  type="url"
                  value={courseForm.imageUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl ${inputStyle} text-xs font-mono focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.fieldDescription}
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm focus:border-emerald-500 resize-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer shadow-md"
              >
                {editingCourseId ? t.saveChanges : t.publishCourse}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── RESET STAFF PASSWORD MODAL ── */}
      {resetPasswordStaff && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border space-y-4`}>
            <button onClick={() => setResetPasswordStaff(null)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <h3 className={`text-xl font-bold ${textHeading}`}>
                {t.resetPassTitle}
              </h3>
            </div>
            <p className={`text-xs ${textSub}`}>
              Setting temporary password for <strong className="text-emerald-500">{resetPasswordStaff.name}</strong> ({resetPasswordStaff.email})
            </p>

            <form onSubmit={handleSaveResetPassword} className="space-y-4 pt-2">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.newPasswordLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTempPasswordInput}
                  onChange={(e) => setNewTempPasswordInput(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm font-mono text-amber-400 focus:border-amber-500`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordStaff(null)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${textSub} cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
                >
                  {t.saveNewPassword}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT EXTRA COST MODAL ── */}
      {editingCostId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border space-y-4`}>
            <button onClick={() => setEditingCostId(null)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-500" />
              <h3 className={`text-xl font-bold ${textHeading}`}>
                {t.editCostTitle}
              </h3>
            </div>

            <form onSubmit={handleSaveExtraCost} className="space-y-4 pt-2">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.printingCost}</label>
                <input
                  type="number"
                  required
                  value={editingCostForm.printingCost}
                  onChange={(e) => setEditingCostForm({ ...editingCostForm, printingCost: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm font-bold focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.inboundFreight}</label>
                <input
                  type="number"
                  required
                  value={editingCostForm.inboundFreight}
                  onChange={(e) => setEditingCostForm({ ...editingCostForm, inboundFreight: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm font-bold focus:border-emerald-500`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>{t.courierFee}</label>
                <input
                  type="number"
                  required
                  value={editingCostForm.courierFee}
                  onChange={(e) => setEditingCostForm({ ...editingCostForm, courierFee: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm font-bold focus:border-emerald-500`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCostId(null)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${textSub} cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
                >
                  Save Expenses ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── UPDATE DELIVERY STATUS MODAL ── */}
      {editingDelivery && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border space-y-4`}>
            <button onClick={() => setEditingDelivery(null)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-500" />
              <h3 className={`text-xl font-bold ${textHeading}`}>
                {t.modalUpdateDeliveryTitle}
              </h3>
            </div>
            <div className={`text-xs ${textSub} space-y-1`}>
              <div>Student: <strong className="text-emerald-500">{editingDelivery.studentName}</strong> ({editingDelivery.phone})</div>
              <div>Consignment ID: <strong className="font-mono text-amber-500">{editingDelivery.consignmentId}</strong></div>
            </div>

            <form onSubmit={handleSaveDeliveryStatus} className="space-y-4 pt-2">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.selectNewDeliveryStatus}
                </label>
                <select
                  value={newDeliveryStatus}
                  onChange={(e) => setNewDeliveryStatus(e.target.value as any)}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs font-bold cursor-pointer focus:border-emerald-500`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDelivery(null)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${textSub} cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
                >
                  Update Status ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD OUTER OPERATIONAL EXPENSE MODAL ── */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border space-y-4`}>
            <button onClick={() => setIsExpenseModalOpen(false)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              <h3 className={`text-xl font-bold ${textHeading}`}>
                {t.modalAddExpenseTitle}
              </h3>
            </div>
            <p className={`text-xs ${textSub}`}>
              Record an outer business operational expense (Marketing ads, hiring, book printing, logistics).
            </p>

            <form onSubmit={handleSaveOuterExpense} className="space-y-3.5 pt-2">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.expenseNotes} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Ads / BDJobs Recruitment"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm focus:border-purple-500`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.expenseCategory}
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                    className={`w-full px-3 py-2.5 rounded-xl ${inputStyle} text-xs font-bold cursor-pointer focus:border-purple-500`}
                  >
                    <option value="Marketing">{t.categoryMarketing}</option>
                    <option value="Hiring">{t.categoryHiring}</option>
                    <option value="Books & Materials">{t.categoryBooks}</option>
                    <option value="Software">{t.categorySoftware}</option>
                    <option value="Logistics">{t.categoryLogistics}</option>
                    <option value="Operations">{t.categoryOperations}</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.expenseAmount} *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="৳"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm font-bold text-rose-400 focus:border-purple-500`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.expenseDate}
                </label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl ${inputStyle} text-xs focus:border-purple-500`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Target audience, quantity, vendor, or campaign breakdown..."
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl ${inputStyle} text-xs resize-none focus:border-purple-500`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${textSub} cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
                >
                  {t.saveExpense}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DISPATCH COURSE BOOKS MODAL ── */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border space-y-4`}>
            <button onClick={() => setIsDispatchModalOpen(false)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-500" />
              <h3 className={`text-xl font-bold ${textHeading}`}>
                {t.modalDispatchTitle}
              </h3>
            </div>
            <p className={`text-xs ${textSub}`}>
              Create a new physical book dispatch parcel with tracking consignment code.
            </p>

            <form onSubmit={handleSaveBookDispatch} className="space-y-3.5 pt-2">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.dispatchStudentName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Student Full Name"
                  value={dispatchForm.studentName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, studentName: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-sm focus:border-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.dispatchPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XX-XXXXXX"
                    value={dispatchForm.phone}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs font-mono text-emerald-400 focus:border-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.dispatchCourier}
                  </label>
                  <select
                    value={dispatchForm.courierService}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, courierService: e.target.value as any })}
                    className={`w-full px-3 py-2.5 rounded-xl ${inputStyle} text-xs font-bold cursor-pointer focus:border-emerald-500`}
                  >
                    <option value="Steadfast">Steadfast Courier</option>
                    <option value="Pathao">Pathao Express</option>
                    <option value="Paperfly">Paperfly Home Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.dispatchAddress} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House, Road, District/City"
                  value={dispatchForm.address}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, address: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs focus:border-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.dispatchConsignment}
                  </label>
                  <input
                    type="text"
                    placeholder="ST-XXXXXX (Auto)"
                    value={dispatchForm.consignmentId}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, consignmentId: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl ${inputStyle} text-xs font-mono text-amber-400 focus:border-emerald-500`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.dispatchTrxId}
                  </label>
                  <input
                    type="text"
                    placeholder="BKXXXXXX (Optional)"
                    value={dispatchForm.trxId}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, trxId: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl ${inputStyle} text-xs font-mono text-slate-400 focus:border-emerald-500`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${textSub} cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
                >
                  {t.saveDispatch}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE COURSE BATCH MODAL ── */}
      {isAddBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`${bgCard} rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border space-y-4`}>
            <button onClick={() => setIsAddBatchModalOpen(false)} className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold ${textHeading}`}>
                {t.modalAddBatchTitle}
              </h3>
            </div>
            <p className={`text-xs ${textSub}`}>
              Create a designated course batch with specific schedule time slot and assigned teacher.
            </p>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 pt-1">
              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.batchCourseLabel}
                </label>
                <select
                  value={newBatchCourseId}
                  onChange={(e) => setNewBatchCourseId(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl ${inputStyle} text-xs font-bold cursor-pointer focus:border-amber-500`}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (৳{c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.batchNameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ব্যাচ ০৫ (সন্ধ্যার বিশেষ ব্যাচ)"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs focus:border-amber-500`}
                >
                </input>
              </div>

              <div>
                <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                  {t.batchScheduleLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. শনি-সোম-বুধ (সন্ধ্যা ৬:০০ - ৭:০০ টা)"
                  value={newBatchSchedule}
                  onChange={(e) => setNewBatchSchedule(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs focus:border-amber-500`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.assignTeacherLabel}
                  </label>
                  <select
                    value={newBatchTeacherId}
                    onChange={(e) => setNewBatchTeacherId(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl ${inputStyle} text-xs font-bold cursor-pointer focus:border-amber-500`}
                  >
                    {staffMembers
                      .filter((s) => s.role === "Teacher")
                      .map((tMember) => (
                        <option key={tMember.id} value={tMember.id}>
                          {tMember.name} (Teacher)
                        </option>
                      ))}
                    {staffMembers
                      .filter((s) => s.role !== "Teacher")
                      .map((tMember) => (
                        <option key={tMember.id} value={tMember.id}>
                          {tMember.name} ({tMember.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-1`}>
                    {t.batchMaxStudentsLabel}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newBatchMaxStudents}
                    onChange={(e) => setNewBatchMaxStudents(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl ${inputStyle} text-xs focus:border-amber-500`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBatchModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${textSub} cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-md"
                >
                  {t.saveBatchBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LOGOUT CONFIRMATION DIALOG ── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-3xl border shadow-2xl ${bgCard} border-slate-700 p-6 animate-in fade-in zoom-in-95`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${textHeading}`}>
              {t.logoutConfirmTitle}
            </h3>
            <p className={`text-xs text-center mb-6 leading-relaxed ${textSub}`}>
              {t.logoutConfirmDesc}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-lg shadow-red-950/40 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.confirmLogoutBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
