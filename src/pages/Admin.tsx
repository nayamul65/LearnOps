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
  Sun,
  Moon,
  Globe,
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
    customization: "Customization",
    customDesc: "Hero & Media Links",

    // Top headers
    badgeSales: "Revenue Graphs & Buyers List",
    badgeLeads: "Inbound Lead Source & Claim Tracking",
    badgeEmployees: "Telesales Representative Conversion",
    badgeBatches: "Head Teacher & Student Rosters",
    badgeCourses: "Live Course Catalog Management",
    badgeCustomization: "Homepage Banner & Demo Video Links",

    titleSales: "Sales Analytics & Buyers History",
    titleLeads: "Inbound Lead Tracking & Assignment",
    titleEmployees: "Sales Representative Performance",
    titleBatches: "Head Teacher & Student Rosters",
    titleCourses: "Course CMS Portal",
    titleCustomization: "Website Banner & Demo Video Settings",

    syncing: "Supabase Syncing...",
    addNewCourse: "Add New Course",

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

    // Customization Tab
    customizationTitle: "Homepage Live Hero & Media Settings",
    customizationSuccess: "Website settings updated successfully!",
    heroTitleLabel: "1. Homepage Hero Title",
    heroSubLabel: "2. Hero Subtitle",
    bannerUrlLabel: "3. Main Banner Image URL",
    demoVideoUrlLabel: "4. Demo Class Video URL",
    saveSiteSettings: "Save Website Settings ✓",
    livePreviewTitle: "Live Site Preview",
    guaranteedBadge: "Guaranteed Learning",
    siteReflectNotice: "These updates will immediately reflect on the platform frontend.",
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
    customization: "কাস্টমাইজেশন",
    customDesc: "হিরো ও মিডিয়া লিংক",

    // Top headers
    badgeSales: "রেভিনিউ গ্রাফ এবং বায়ার্স তালিকা",
    badgeLeads: "ইনবাউন্ড লিড সোর্স ও ক্লেইম ট্র্যাকিং",
    badgeEmployees: "টেলিসেলস রিপ্রেজেন্টেটিভ কনভার্সন",
    badgeBatches: "হেড টিচার ও স্টুডেন্ট রোস্টার",
    badgeCourses: "লাইভ কোর্স ক্যাটালগ ম্যানেজমেন্ট",
    badgeCustomization: "হোমপেজ ব্যানার ও ডেমো ভিডিও সেটিংস",

    titleSales: "সেলস অ্যানালিটিক্স ও বায়ার্স হিস্ট্রি",
    titleLeads: "ইনবাউন্ড লিড ট্র্যাকিং ও অ্যাসাইনমেন্ট",
    titleEmployees: "সেলস রিপ্রেজেন্টেটিভ পারফরম্যান্স",
    titleBatches: "হেড টিচার ও ব্যাচ স্টুডেন্ট রোস্টার",
    titleCourses: "কোর্স সিএমএস পোর্টাল",
    titleCustomization: "ওয়েবসাইট ব্যানার ও ডেমো ভিডিও সেটিংস",

    syncing: "সুভাবেস সিঙ্ক হচ্ছে...",
    addNewCourse: "নতুন কোর্স যোগ করুন",

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

    // Customization Tab
    customizationTitle: "হোমপেজ লাইভ হিরো ও মিডিয়া সেটিংস",
    customizationSuccess: "ওয়েবসাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!",
    heroTitleLabel: "১. হোমপেজ হিরো শিরোনাম",
    heroSubLabel: "২. হিরো সাব-টাইটেল",
    bannerUrlLabel: "৩. মেইন ব্যানার ইমেজ URL",
    demoVideoUrlLabel: "৪. ডেমো ক্লাস ভিডিও URL",
    saveSiteSettings: "ওয়েবসাইট সেটিংস পরিবর্তন সেভ করুন ✓",
    livePreviewTitle: "লাইভ ওয়েবসাইট প্রিভিউ",
    guaranteedBadge: "গ্যারান্টিযুক্ত শিখণ",
    siteReflectNotice: "এই আপডেটগুলো সঙ্গে সঙ্গে প্ল্যাটফর্মের ফ্রন্টেন্ডে রিফ্লেক্ট করবে।",
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
  const [activeTab, setActiveTab] = useState<"sales" | "leads" | "employees" | "batches" | "courses" | "customization">("sales");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── DATA STATES ──
  const [courses, setCourses] = useState<CMSCourse[]>(INITIAL_COURSES);
  const [employees, setEmployees] = useState<EmployeePerf[]>(INITIAL_EMPLOYEES);
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [selectedCourseId, setSelectedCourseId] = useState<string | number | null>("c-101");
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>("batch-101");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // ── DYNAMIC YEAR GENERATOR ──
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 2 }, (_, i) => (2024 + i).toString());

  // ── SALES ANALYTICS FILTERS & DYNAMIC DATE DROPDOWNS ──
  const [salesTimePeriod, setSalesTimePeriod] = useState<"Weekly" | "Monthly" | "Yearly">("Weekly");
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("6"); // July (0-indexed 6)
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
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

  // ── SUPABASE LOAD FUNCTION ──
  const fetchSupabaseData = async () => {
    setIsLoading(true);
    try {
      const { data: dbUsers, error: usersErr } = await supabase.from("users").select("*");
      if (usersErr) console.error("Error fetching users from Supabase:", usersErr);
      else if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
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

  useEffect(() => {
    fetchSupabaseData();
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

  // ── FILTERED BUYERS ──
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
    if (confirm(t.deleteCourseConfirm)) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      try {
        const { error } = await supabase.from("courses").delete().eq("id", id);
        if (error) console.error("Error deleting course in Supabase:", error);
      } catch (err) {
        console.error("Exception deleting course:", err);
      }
    }
  };

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomizationSavedMessage(true);
    setTimeout(() => setCustomizationSavedMessage(false), 3000);
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

  return (
    <div className={`min-h-screen ${bgMain} flex overflow-hidden font-sans transition-colors duration-200`}>
      
      {/* ═══════════════════════════════════════════════════════════════════════════
         LEFT SIDEBAR NAVIGATION MENU WITH TOGGLES ROW (FEATURE 1 & FEATURE 3)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 ${bgSidebar} border-r transition-all duration-300 flex flex-col justify-between`}
        style={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white shadow-lg">
                  L
                </div>
                <span className={`font-extrabold text-base tracking-tight ${textHeading}`}>
                  Learn<span className="text-emerald-500">Ops</span> Admin
                </span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2 rounded-xl text-slate-400 hover:${textHeading} hover:bg-slate-800/30 transition-colors cursor-pointer mx-auto`}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* TOP-LEFT SIDEBAR CONTROL ROW: SINGLE-CLICK LANGUAGE & THEME TOGGLES */}
          <div className={`px-4 my-3 pb-3 border-b ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
            {!isSidebarCollapsed ? (
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
              { id: "sales", label: `📈 ${t.salesAnalytics}`, icon: TrendingUp, desc: t.salesDesc },
              { id: "leads", label: `👥 ${t.leadPipeline}`, icon: Users, desc: t.leadDesc },
              { id: "employees", label: `🕵️ ${t.employeePerf}`, icon: PhoneCall, desc: t.employeeDesc },
              { id: "batches", label: `👨‍🏫 ${t.teacherBatches}`, icon: GraduationCap, desc: t.teacherDesc },
              { id: "courses", label: `📚 ${t.courseCms}`, icon: BookOpen, desc: t.cmsDesc },
              { id: "customization", label: `🖼️ ${t.customization}`, icon: ImageIcon, desc: t.customDesc },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
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
                  {!isSidebarCollapsed && (
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

        {/* Sidebar Footer System Status */}
        {!isSidebarCollapsed && (
          <div className={`p-4 border-t ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50"} flex items-center justify-between`}>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.supabaseConnected}</span>
            </div>
            <button onClick={fetchSupabaseData} className="text-slate-400 hover:text-emerald-500 cursor-pointer" title={t.refreshDb}>
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
        <header className={`flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {activeTab === "sales" && t.badgeSales}
                {activeTab === "leads" && t.badgeLeads}
                {activeTab === "employees" && t.badgeEmployees}
                {activeTab === "batches" && t.badgeBatches}
                {activeTab === "courses" && t.badgeCourses}
                {activeTab === "customization" && t.badgeCustomization}
              </span>
            </div>
            <h1 className={`text-3xl font-extrabold tracking-tight ${textHeading}`}>
              {activeTab === "sales" && t.titleSales}
              {activeTab === "leads" && t.titleLeads}
              {activeTab === "employees" && t.titleEmployees}
              {activeTab === "batches" && t.titleBatches}
              {activeTab === "courses" && t.titleCourses}
              {activeTab === "customization" && t.titleCustomization}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="inline-flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t.syncing}
              </span>
            )}

            {activeTab === "courses" && (
              <button
                onClick={handleOpenCreateCourse}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {t.addNewCourse}
              </button>
            )}
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 1: 📈 SALES ANALYTICS VIEW & GRANULAR DATE FILTERS (FEATURE 4)
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "sales" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Filter Controls Bar with Conditional Date Dropdowns */}
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
                {/* 1. Year Selector (Fully Dynamic Array) */}
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

                {/* 2. Month Selector (Shown for Monthly and Weekly) */}
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

                {/* 3. Week Selector (Shown only for Weekly) */}
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

              {/* Course Filter Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">
                  {t.courseFilterLabel}
                </span>
                <select
                  value={salesCourseFilter}
                  onChange={(e) => setSalesCourseFilter(e.target.value)}
                  className={`${inputStyle} text-xs font-bold rounded-2xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                >
                  <option value="All">{t.allCourses}</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Revenue Chart Visualizer */}
            <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl border`}>
              <div className="flex items-center justify-between mb-6">
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

            {/* Buyers List Table */}
            <div className={`${bgCard} rounded-3xl overflow-hidden shadow-xl border`}>
              <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-slate-200"} flex items-center justify-between`}>
                <h3 className={`text-lg font-bold ${textHeading}`}>
                  {t.confirmedBuyersTable}
                </h3>
                <span className={`text-xs ${textSub}`}>{t.totalBuyers} {filteredBuyers.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${tableHeaderStyle} text-xs font-bold uppercase tracking-wider`}>
                      <th className="py-4 px-4">{t.colStudentParent}</th>
                      <th className="py-4 px-4">{t.colPhone}</th>
                      <th className="py-4 px-4">{t.colCourse}</th>
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
           SECTION 3: 🕵️ EMPLOYEE PERFORMANCE VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "employees" && (
          <div className="space-y-8 animate-in fade-in duration-300">
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className={`text-xl font-bold ${textHeading}`}>
                    {t.activeBatchesTitle}
                  </h3>
                  {selectedCourse && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      {t.filteredCourseBadge} {selectedCourse.title}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => {
                      const isExpanded = expandedBatchId === batch.id;
                      return (
                        <div key={batch.id} className={`border rounded-2xl overflow-hidden ${bgSubCard}`}>
                          {/* Batch Header Card */}
                          <button
                            onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                            className={`w-full p-5 flex items-center justify-between ${
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
                                {batch.totalStudents} {t.studentsCount}
                              </span>
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                          </button>

                          {/* Step 3: Expandable Student Roster & Performance Reports */}
                          {isExpanded && (
                            <div className={`p-6 border-t ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"} space-y-4`}>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {t.expandRosterTitle}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {batch.roster.map((std) => (
                                  <div key={std.id} className={`${bgCard} border rounded-2xl p-4 space-y-2`}>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-amber-500">{t.rollNoLabel}{std.rollNo}</span>
                                      <span className="text-xs font-black text-emerald-500">{std.grade}</span>
                                    </div>
                                    <h5 className={`font-bold ${textHeading} text-sm`}>
                                      {std.name}
                                    </h5>
                                    <p className={`text-[11px] ${textSub}`}>{t.parentLabel} {std.parentName}</p>

                                    <div className={`pt-2 border-t ${isDark ? "border-slate-800" : "border-slate-200"} flex justify-between text-xs font-semibold`}>
                                      <span>{t.attendanceLabel} <strong className="text-emerald-500">{std.attendancePercentage}%</strong></span>
                                      <span>{t.avgScoreLabel} <strong className="text-purple-500">{std.avgExamScore}/100</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
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

        {/* ═══════════════════════════════════════════════════════════════════════════
           SECTION 6: 🖼️ WEBSITE CUSTOMIZATION VIEW
        ═══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "customization" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Inputs Form */}
            <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl border`}>
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                <h3 className={`text-xl font-bold ${textHeading}`}>
                  {t.customizationTitle}
                </h3>
              </div>

              {customizationSavedMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.customizationSuccess}
                </div>
              )}

              <form onSubmit={handleSaveCustomization} className="space-y-5">
                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-2`}>
                    {t.heroTitleLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={siteConfig.heroTitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl ${inputStyle} text-sm font-semibold focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-2`}>
                    {t.heroSubLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={siteConfig.heroSubtitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl ${inputStyle} text-sm focus:outline-none resize-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-2`}>
                    {t.bannerUrlLabel}
                  </label>
                  <input
                    type="url"
                    required
                    value={siteConfig.mainBannerUrl}
                    onChange={(e) => setSiteConfig({ ...siteConfig, mainBannerUrl: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl ${inputStyle} text-sm font-mono text-emerald-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${textHeading} mb-2`}>
                    {t.demoVideoUrlLabel}
                  </label>
                  <input
                    type="url"
                    required
                    value={siteConfig.demoVideoUrl}
                    onChange={(e) => setSiteConfig({ ...siteConfig, demoVideoUrl: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl ${inputStyle} text-sm font-mono text-purple-500 focus:outline-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {t.saveSiteSettings}
                </button>
              </form>
            </div>

            {/* Live Interactive Preview Card */}
            <div className={`${bgCard} rounded-3xl p-6 sm:p-8 shadow-xl border flex flex-col justify-between`}>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t.livePreviewTitle}
                </div>

                <div className={`rounded-2xl border ${bgSubCard} p-6 space-y-4`}>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full">
                    {t.guaranteedBadge}
                  </div>
                  <h2 className={`text-xl font-bold ${textHeading} leading-tight`}>
                    {siteConfig.heroTitle}
                  </h2>
                  <p className={`text-xs ${textSub} leading-relaxed`}>
                    {siteConfig.heroSubtitle}
                  </p>

                  <div className={`relative rounded-xl overflow-hidden aspect-video border ${isDark ? "border-slate-800" : "border-slate-300"}`}>
                    <img src={siteConfig.mainBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl">
                        <Video className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mt-6 text-xs ${textSub} italic text-center`}>
                {t.siteReflectNotice}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── CREATE / EDIT COURSE MODAL ── */}
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

              <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
