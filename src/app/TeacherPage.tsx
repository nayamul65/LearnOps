import React, { useState } from "react";
import { whatsappNotificationController } from "../services/whatsappNotificationController";
import {
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Award,
  BookOpen,
  FileCheck,
  UserCheck,
  Sparkles,
  Calendar,
  PlusCircle,
  Share2,
  Send,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  Bell,
  TrendingUp,
  Users,
  Layers,
  MessageSquare,
  AlertTriangle,
  FileText,
  CheckSquare,
  Eye,
  Video,
} from "lucide-react";

/* ── DATA TYPES ── */
export interface Student {
  id: string;
  name: string | { bn: string; en: string };
  rollNo: string;
  batch: string | { bn: string; en: string };
  courseId: number;
  phone: string;
  attendanceStatus: "Present" | "Absent" | "Late";
  submittedHwCount: number;
  totalHwCount: number;
  progressPercent: number;
}

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  studentName: string | { bn: string; en: string };
  batch: string | { bn: string; en: string };
  courseId: number;
  title: string | { bn: string; en: string };
  subject: string | { bn: string; en: string };
  submittedDate: string;
  dueDate: string;
  submissionUrl?: string;
  submissionNote?: string | { bn: string; en: string };
  score: number;
  grade: string;
  feedback: string | { bn: string; en: string };
  status: "Graded" | "Pending";
}

export interface NotificationItem {
  id: string;
  title: { bn: string; en: string };
  time: { bn: string; en: string };
  type: "submission" | "deadline" | "attendance" | "system" | "zoom";
  read: boolean;
}

export interface Course {
  id: number | "all";
  title: { bn: string; en: string };
}

/* ── HELPER FUNCTIONS ── */
export function getLocalizedText(
  val: string | { bn: string; en: string } | undefined,
  lang: "bn" | "en"
): string {
  if (!val) return "";
  if (typeof val === "object") {
    return val[lang] || val.bn || "";
  }
  return val;
}

export function toBNDigits(str: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[0-9]/g, (w) => bnDigits[parseInt(w, 10)]);
}

export function formatNumber(num: string | number, lang: "bn" | "en"): string {
  if (lang === "bn") return toBNDigits(num);
  return String(num);
}

/* ── INITIAL MOCK DATA ── */
export const ASSIGNED_COURSES: Course[] = [
  { id: "all", title: { bn: "সকল কোর্স (All Courses)", en: "All Courses" } },
  { id: 1, title: { bn: "২৫ দিনে সুন্দর হাতের লেখা", en: "Beautiful Handwriting in 25 Days" } },
  { id: 2, title: { bn: "মাত্র ৩০ দিনে ছোট থেকে সুন্দর হাতের লেখা", en: "Beautiful Handwriting for Kids in 30 Days" } },
  { id: 3, title: { bn: "8 WEEKS ENGLISH SPEAKING (start program)", en: "8 Weeks English Speaking (Start Program)" } },
  { id: 4, title: { bn: "READING & SPELLING DEVELOPMENT with PHONICS", en: "Reading & Spelling Development with Phonics" } },
  { id: 5, title: { bn: "স্পিড রাইটিং ও অ্যাডভান্সড ক্যালিগ্রাফি", en: "Speed Writing & Advanced Calligraphy" } }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-1",
    name: { bn: "আরাফ হোসেন", en: "Araf Hossain" },
    rollNo: "01",
    batch: { bn: "ব্যাচ ০১ (সকাল ১০:০০)", en: "Batch 01 (10:00 AM)" },
    courseId: 1,
    phone: "+8801712345678",
    attendanceStatus: "Present",
    submittedHwCount: 5,
    totalHwCount: 5,
    progressPercent: 96,
  },
  {
    id: "std-2",
    name: { bn: "তাহিয়া রহমান", en: "Tahiya Rahman" },
    rollNo: "02",
    batch: { bn: "ব্যাচ ০১ (সকাল ১০:০০)", en: "Batch 01 (10:00 AM)" },
    courseId: 1,
    phone: "+8801812345678",
    attendanceStatus: "Present",
    submittedHwCount: 4,
    totalHwCount: 5,
    progressPercent: 88,
  },
  {
    id: "std-3",
    name: { bn: "সামিন চৌধুরী", en: "Samin Chowdhury" },
    rollNo: "03",
    batch: { bn: "ব্যাচ ০২ (বিকেল ৪:০০)", en: "Batch 02 (04:00 PM)" },
    courseId: 2,
    phone: "+8801912345678",
    attendanceStatus: "Late",
    submittedHwCount: 3,
    totalHwCount: 5,
    progressPercent: 72,
  },
  {
    id: "std-4",
    name: { bn: "তানভীর আহম্মেদ", en: "Tanvir Ahmed" },
    rollNo: "04",
    batch: { bn: "ব্যাচ ০২ (বিকেল ৪:০০)", en: "Batch 02 (04:00 PM)" },
    courseId: 2,
    phone: "+8801612345678",
    attendanceStatus: "Absent",
    submittedHwCount: 2,
    totalHwCount: 5,
    progressPercent: 55,
  },
  {
    id: "std-5",
    name: { bn: "নুসাইবা পারভীন", en: "Nusaiba Parveen" },
    rollNo: "05",
    batch: { bn: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)", en: "Batch 03 (07:00 PM)" },
    courseId: 3,
    phone: "+8801512345678",
    attendanceStatus: "Present",
    submittedHwCount: 5,
    totalHwCount: 5,
    progressPercent: 92,
  },
  {
    id: "std-6",
    name: { bn: "রাফিদ আল হাসান", en: "Rafid Al Hasan" },
    rollNo: "06",
    batch: { bn: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)", en: "Batch 03 (07:00 PM)" },
    courseId: 4,
    phone: "+8801312345678",
    attendanceStatus: "Present",
    submittedHwCount: 4,
    totalHwCount: 5,
    progressPercent: 84,
  },
  {
    id: "std-7",
    name: { bn: "ফারজানা ইসলাম", en: "Farzana Islam" },
    rollNo: "07",
    batch: { bn: "ব্যাচ ০১ (সকাল ১০:০০)", en: "Batch 01 (10:00 AM)" },
    courseId: 5,
    phone: "+8801412345678",
    attendanceStatus: "Present",
    submittedHwCount: 5,
    totalHwCount: 5,
    progressPercent: 90,
  }
];

export const INITIAL_HOMEWORKS: HomeworkSubmission[] = [
  {
    id: "hw-1",
    studentId: "std-1",
    studentName: { bn: "আরাফ হোসেন", en: "Araf Hossain" },
    batch: { bn: "ব্যাচ ০১ (সকাল ১০:০০)", en: "Batch 01 (10:00 AM)" },
    courseId: 1,
    subject: { bn: "সুন্দর হাতের লেখা", en: "Handwriting" },
    title: { bn: "মাত্রা ও বর্ণমালা সোজা রাখার অনুশীলন (পৃষ্ঠা ৪)", en: "Line Alignment & Alphabet Practice (Page 4)" },
    submittedDate: "2026-07-27",
    dueDate: "2026-07-28",
    submissionUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
    submissionNote: { bn: "স্যার, পৃষ্ঠা ৪ এবং ৫ এর সম্পূর্ণ হাতের লেখা জমা দিলাম।", en: "Sir, I submitted complete handwriting for pages 4 and 5." },
    score: 95,
    grade: "A+",
    feedback: { bn: "খুব সুন্দর ও পরিচ্ছন্ন হয়েছে! লাইন পুরো সোজা রাখা শিখেছো।", en: "Very neat and clean! You learned to keep lines straight." },
    status: "Graded",
  },
  {
    id: "hw-2",
    studentId: "std-2",
    studentName: { bn: "তাহিয়া রহমান", en: "Tahiya Rahman" },
    batch: { bn: "ব্যাচ ০১ (সকাল ১০:০০)", en: "Batch 01 (10:00 AM)" },
    courseId: 1,
    subject: { bn: "স্পিড রাইটিং", en: "Speed Writing" },
    title: { bn: "দ্রুত লেখার স্পিড টেস্ট ১ (১ মিনিটে ৩০ শব্দ)", en: "Speed Writing Test 1 (30 wpm)" },
    submittedDate: "2026-07-28",
    dueDate: "2026-07-29",
    submissionUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600",
    submissionNote: { bn: "টাইমার সেট করে ৩০টি শব্দ অনুশীলন করেছি।", en: "Practiced 30 words with timer set." },
    score: 88,
    grade: "A",
    feedback: { bn: "স্পিড চমৎকার, যুক্তবর্ণ গঠনে আরও একটু সময় নাও।", en: "Excellent speed, take a bit more time for conjunct letters." },
    status: "Graded",
  },
  {
    id: "hw-3",
    studentId: "std-3",
    studentName: { bn: "সামিন চৌধুরী", en: "Samin Chowdhury" },
    batch: { bn: "ব্যাচ ০২ (বিকেল ৪:০০)", en: "Batch 02 (04:00 PM)" },
    courseId: 2,
    subject: { bn: "স্বরবর্ণ ও কারেকশন", en: "Vowel Correction" },
    title: { bn: "পেন্সিল গ্রিপ ও স্বরবর্ণ কারেকশন অনুশীলন", en: "Pencil Grip & Vowel Correction Practice" },
    submittedDate: "2026-07-28",
    dueDate: "2026-07-29",
    submissionUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600",
    submissionNote: { bn: "পেন্সিল ধরে অ আ ই উ অনুশীলন ছবি তুলে পাঠালাম।", en: "Took picture of pencil grip and vowel practice." },
    score: 0,
    grade: "-",
    feedback: { bn: "", en: "" },
    status: "Pending",
  },
  {
    id: "hw-4",
    studentId: "std-5",
    studentName: { bn: "নুসাইবা পারভীন", en: "Nusaiba Parveen" },
    batch: { bn: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)", en: "Batch 03 (07:00 PM)" },
    courseId: 3,
    subject: { bn: "যুক্তবর্ণ চর্চা", en: "Compound Letters" },
    title: { bn: "ক্ব, ক্ত, গ্ধ এবং ঙ্ক লেখার সঠিক নিয়মাবলী", en: "Rules for writing compound letters" },
    submittedDate: "2026-07-28",
    dueDate: "2026-07-30",
    submissionUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
    submissionNote: { bn: "যুক্তবর্ণগুলো ৫ বার করে লিখে জমা দিলাম।", en: "Submitted compound letters written 5 times each." },
    score: 0,
    grade: "-",
    feedback: { bn: "", en: "" },
    status: "Pending",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: {
      bn: "আরাফ হোসেন হোমওয়ার্ক জমা দিয়েছেন - ব্যাচ ০১",
      en: "Araf Hossain submitted homework - Batch 01"
    },
    time: {
      bn: "১০ মিনিট আগে",
      en: "10 mins ago"
    },
    type: "submission",
    read: false,
  },
  {
    id: "notif-2",
    title: {
      bn: "নতুন লাইভ ক্লাসের লিঙ্ক তৈরি করা হয়েছে - জুম মিটিং",
      en: "New live class link created - Zoom Meeting"
    },
    time: {
      bn: "১ ঘণ্টা আগে",
      en: "1 hour ago"
    },
    type: "zoom",
    read: false,
  },
  {
    id: "notif-3",
    title: {
      bn: "নুসাইবা পারভীন আপনার ফিডব্যাক দেখেছেন",
      en: "Nusaiba Parveen viewed your feedback"
    },
    time: {
      bn: "গতকাল",
      en: "Yesterday"
    },
    type: "submission",
    read: true,
  },
  {
    id: "notif-4",
    title: {
      bn: "তানভীর আহম্মেদ আজকের ক্লাসে অনুপস্থিত ছিলেন",
      en: "Tanvir Ahmed was absent in today's class"
    },
    time: {
      bn: "৩ ঘণ্টা আগে",
      en: "3 hours ago"
    },
    type: "attendance",
    read: true,
  },
];

/* ── BILINGUAL DICTIONARY (BN / EN) ── */
export const dictionary = {
  bn: {
    // Header & Banner
    portalTag: "শিক্ষক ও মেন্টর ড্যাশবোর্ড",
    mainHeading: "১-ক্লিক উপস্থিতি, হোমওয়ার্ক ও হোয়াটসঅ্যাপ হাব",
    loggedInMentor: "লগইনকৃত শিক্ষকের নাম:",
    teacherName: "রাহেলা খাতুন (প্রধান মেন্টর)",
    assignHwBtn: "নতুন হোমওয়ার্ক অ্যাসাইন করুন",
    selectCourseLabel: "অর্পিত কোর্স:",

    // Stats Widgets
    assignedStudents: "মোট অর্পিত শিক্ষার্থী",
    activeStudents: "সক্রিয় শিক্ষার্থী সংখ্যা",
    threeBatches: "৩টি ব্যাচ",
    persons: "জন",
    items: "টি",
    pendingHomework: "বাকি থাকা হোমওয়ার্ক",
    reviewNeeded: "রিভিউ প্রয়োজন",
    submittedFiles: "শিক্ষার্থীদের জমা দেওয়া ফাইল",
    reviewedHomework: "যাচাইকৃত হোমওয়ার্ক",
    gradingCompleted: "গ্রেডিং সম্পন্ন",
    evaluatedAssignments: "মূল্যায়ন করা অ্যাসাইনমেন্ট",
    studentProgress: "শিক্ষার্থীর অগ্রগতি",
    overallProgress: "সামগ্রিক অগ্রগতি",
    excellent: "চমৎকার",

    // Homework & WhatsApp Section
    assignHomework: "হোমওয়ার্ক অ্যাসাইন করুন",
    sendViaWhatsApp: "হোয়াটসঅ্যাপে পাঠান",
    shareWhatsapp: "হোয়াটসঅ্যাপে শেয়ার করুন",
    copyLink: "লিঙ্ক কপি করুন",
    linkCopied: "কপি হয়েছে!",
    copy: "কপি",

    // Zoom Live Class Section
    zoomLiveClass: "জুম লাইভ ক্লাস হাব",
    createLiveClass: "লাইভ ক্লাস লিঙ্ক তৈরি করুন",
    startClass: "ক্লাস শুরু করুন",
    nextLiveClass: "পরবর্তী লাইভ ক্লাস",
    zoomDesc: "শিক্ষার্থীদের সাথে সরাসরি অনলাইনে লাইভ ক্লাসে যুক্ত হন",
    zoomTopic: "সুন্দর হাতের লেখা অ্যাডভান্সড সেশন (ব্যাচ ০১)",
    zoomTime: "আজ বিকেল ৪:০০ টা",
    zoomTopicLabel: "বিষয়/টপিক",
    zoomDateTimeLabel: "তারিখ ও সময়",
    zoomPasscodeLabel: "পাসকোড",
    createLiveClassModalTitle: "লাইভ ক্লাস লিঙ্ক তৈরি করুন",

    // Main Tabs / Sections
    studentList: "শিক্ষার্থী তালিকা",
    homeworkQueue: "হোমওয়ার্ক রিভিউ কিউ",
    oneClickAttendance: "১-ক্লিক উপস্থিতি",
    performanceStats: "পারফরম্যান্স পরিসংখ্যান",
    notifications: "নোটিফিকেশন",

    // Student List Table & Filter
    assignedStudentsList: "অর্পিত শিক্ষার্থীদের তালিকা",
    searchPlaceholder: "শিক্ষার্থীর নাম বা রোল দিয়ে খুঁজুন...",
    allBatches: "সকল ব্যাচ",
    batch1: "ব্যাচ ০১ (সকাল ১০:০০)",
    batch2: "ব্যাচ ০২ (বিকেল ৪:০০)",
    batch3: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)",
    allCourses: "সকল কোর্স",
    rollAndName: "রোল ও নাম",
    batch: "ব্যাচ",
    todayAttendance: "আজকের উপস্থিতি",
    hwCompleted: "হোমওয়ার্ক সম্পন্ন",
    progress: "অগ্রগতি",
    contactWhatsapp: "যোগাযোগ (WhatsApp)",
    present: "উপস্থিত",
    late: "লেট",
    absent: "অনুপস্থিত",
    noStudentsFound: "কোন শিক্ষার্থী পাওয়া যায়নি।",

    // Homework Queue
    queueTitle: "হোমওয়ার্ক রিভিউ কিউ",
    queueDesc: "শিক্ষার্থীদের জমা দেওয়া হোমওয়ার্ক ফাইল দেখুন, নম্বর দিন এবং শিক্ষকের ফিডব্যাক প্রদান করুন।",
    pendingFilter: "বাকি আছে",
    gradedFilter: "যাচাইকৃত",
    allFilter: "সকল",
    gradeLabel: "গ্রেড",
    pendingStatus: "বাকি আছে",
    studentNoteLabel: "শিক্ষার্থীর নোট:",
    previewFileBtn: "জমা দেওয়া ফাইল/ছবি প্রিভিউ করুন 🖼️",
    teacherFeedbackLabel: "শিক্ষকের মতামত/ফিডব্যাক",
    editGradeBtn: "গ্রেড সম্পাদন করুন",
    enterMarksGrade: "মার্কস/গ্রেড দিন",
    markAsReviewed: "যাচাইকৃত হিসেবে মার্ক করুন",
    noHomeworkFound: "এই ক্যাটাগরিতে কোনো হোমওয়ার্ক পাওয়া যায়নি।",
    submittedDateLabel: "জমার তারিখ:",
    dueDateLabelShort: "ডেডলাইন:",

    // 1-Click Attendance
    attendanceTitle: "আজকের ক্লাসের ১-ক্লিক উপস্থিতি রেজিস্টার",
    attendanceDateLabel: "তারিখ:",
    attendanceDesc: "১-ক্লিকে শিক্ষার্থীকে উপস্থিত, লেট বা অনুপস্থিত চিহ্নিত করুন।",
    presentCount: "উপস্থিত:",
    lateCount: "লেট:",
    absentCount: "অনুপস্থিত:",

    // Performance Stats
    statsTitle: "পারফরম্যান্স পরিসংখ্যান",
    completedTag: "সম্পন্ন",
    totalStudentsLabel: "মোট শিক্ষার্থী:",
    avgScoreLabel: "গড় স্কোর:",
    attendanceRateLabel: "মোট উপস্থিতি:",
    batchCompletionRate: "ব্যাচভিত্তিক সম্পন্ন করার হার",

    // Notifications
    notifTitle: "নোটিফিকেশন",
    markAllRead: "সব পড়া হয়েছে চিহ্নিত করুন",

    // Assign Modal
    assignModalTitle: "নতুন হোমওয়ার্ক অ্যাসাইনমেন্ট",
    batchSelectLabel: "ব্যাচ / ক্লাসের নাম *",
    subjectSelectLabel: "বিষয়/টপিক *",
    dueDateLabel: "জমার শেষ তারিখ (Due Date) *",
    hwTitleInputLabel: "হোমওয়ার্কের শিরোনাম *",
    hwTitlePlaceholder: "যেমন: মাত্রা ও বর্ণমালা সোজা রাখার অনুশীলন (পৃষ্ঠা ৪)",
    hwDescInputLabel: "বিস্তারিত দিকনির্দেশনা (ঐচ্ছিক)",
    hwDescPlaceholder: "যেমন: খাতায় স্কেল দিয়ে মার্জিন টেনে ৪ ও ৫ পৃষ্ঠা সম্পূর্ণ লিখবে...",
    waPhoneLabel: "নির্দিষ্ট শিক্ষার্থীর হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)",
    waPhonePlaceholder: "যেমন: +8801712345678 (খালি রাখলে গ্রুপিং মেসেজ জেনারেট হবে)",
    assignAndGenerateWaBtn: "হোমওয়ার্ক অ্যাসাইন এবং হোয়াটসঅ্যাপ লিংক জেনারেট করুন",
    waSuccessMsg: "হোয়াটসঅ্যাপ লিংক সফলভাবে তৈরি হয়েছে!",
    openAndSendWaBtn: "হোয়াটসঅ্যাপে ওপেন করুন & পাঠান",

    // Grade Modal
    gradeModalTitle: "হোমওয়ার্ক মূল্যায়ন - ",
    scoreInputLabel: "স্কোর / নম্বর (১০০ এর মধ্যে) *",
    feedbackPlaceholder: "যেমন: লেখা খুব সুন্দর হয়েছে, স্বরবর্ণগুলোতে আরেকটু মনোযোগী হও...",
    cancelBtn: "বাতিল",
    submitGradeBtn: "যাচাইকৃত হিসেবে মার্ক করুন ✓"
  },
  en: {
    // Header & Banner
    portalTag: "Teacher & Mentor Portal",
    mainHeading: "1-Click Attendance, Homework & WhatsApp Hub",
    loggedInMentor: "Logged-in Mentor:",
    teacherName: "Rahela Khatun (Lead Mentor)",
    assignHwBtn: "Assign New Homework",
    selectCourseLabel: "Assigned Course:",

    // Stats Widgets
    assignedStudents: "Assigned Students",
    activeStudents: "Active Students Count",
    threeBatches: "3 Batches",
    persons: "Students",
    items: "Items",
    pendingHomework: "Pending Homework",
    reviewNeeded: "Review Required",
    submittedFiles: "Submitted Student Files",
    reviewedHomework: "Reviewed Homework",
    gradingCompleted: "Grading Completed",
    evaluatedAssignments: "Evaluated Assignments",
    studentProgress: "Student Progress",
    overallProgress: "Overall Progress",
    excellent: "Excellent",

    // Homework & WhatsApp Section
    assignHomework: "Assign Homework",
    sendViaWhatsApp: "Send via WhatsApp",
    shareWhatsapp: "Share via WhatsApp",
    copyLink: "Copy Link",
    linkCopied: "Copied!",
    copy: "Copy",

    // Zoom Live Class Section
    zoomLiveClass: "Zoom Live Class Hub",
    createLiveClass: "Create Live Class Link",
    startClass: "Start Class",
    nextLiveClass: "Next Live Class",
    zoomDesc: "Join live interactive video sessions with your students",
    zoomTopic: "Advanced Handwriting Masterclass (Batch 01)",
    zoomTime: "Today at 4:00 PM",
    zoomTopicLabel: "Topic/Subject",
    zoomDateTimeLabel: "Date & Time",
    zoomPasscodeLabel: "Passcode",
    createLiveClassModalTitle: "Create Live Class Link",

    // Main Tabs / Sections
    studentList: "Student List",
    homeworkQueue: "Homework Review Queue",
    oneClickAttendance: "1-Click Attendance",
    performanceStats: "Performance Statistics",
    notifications: "Notifications",

    // Student List Table & Filter
    assignedStudentsList: "Assigned Students List",
    searchPlaceholder: "Search by student name or roll...",
    allBatches: "All Batches",
    batch1: "Batch 01 (10:00 AM)",
    batch2: "Batch 02 (04:00 PM)",
    batch3: "Batch 03 (07:00 PM)",
    allCourses: "All Courses",
    rollAndName: "Roll & Name",
    batch: "Batch",
    todayAttendance: "Today's Attendance",
    hwCompleted: "Homework Completed",
    progress: "Progress",
    contactWhatsapp: "Contact (WhatsApp)",
    present: "Present",
    late: "Late",
    absent: "Absent",
    noStudentsFound: "No students found.",

    // Homework Queue
    queueTitle: "Homework Review Queue",
    queueDesc: "Review student homework submissions, assign scores, and leave feedback.",
    pendingFilter: "Pending",
    gradedFilter: "Marked as Reviewed",
    allFilter: "All",
    gradeLabel: "Grade",
    pendingStatus: "Pending",
    studentNoteLabel: "Student Note:",
    previewFileBtn: "Preview Submitted File / Image 🖼️",
    teacherFeedbackLabel: "Teacher Feedback",
    editGradeBtn: "Edit Grade",
    enterMarksGrade: "Enter Marks/Grade",
    markAsReviewed: "Mark as Reviewed",
    noHomeworkFound: "No homework found in this category.",
    submittedDateLabel: "Submitted Date:",
    dueDateLabelShort: "Due Date:",

    // 1-Click Attendance
    attendanceTitle: "1-Click Attendance Register for Today's Class",
    attendanceDateLabel: "Date:",
    attendanceDesc: "Mark students as Present, Late, or Absent with 1 click.",
    presentCount: "Present:",
    lateCount: "Late:",
    absentCount: "Absent:",

    // Performance Stats
    statsTitle: "Performance Statistics",
    completedTag: "Completed",
    totalStudentsLabel: "Total Students:",
    avgScoreLabel: "Average Score:",
    attendanceRateLabel: "Total Attendance:",
    batchCompletionRate: "Batch Completion Rate",

    // Notifications
    notifTitle: "Notifications",
    markAllRead: "Mark all as read",

    // Assign Modal
    assignModalTitle: "New Homework Assignment",
    batchSelectLabel: "Batch / Class Name *",
    subjectSelectLabel: "Topic/Subject *",
    dueDateLabel: "Due Date *",
    hwTitleInputLabel: "Homework Title *",
    hwTitlePlaceholder: "e.g., Line alignment & alphabet practice (Page 4)",
    hwDescInputLabel: "Detailed Instructions (Optional)",
    hwDescPlaceholder: "e.g., Draw margins with scale and complete pages 4 & 5...",
    waPhoneLabel: "Student WhatsApp Number (Optional)",
    waPhonePlaceholder: "e.g., +8801712345678 (Leave empty for group message)",
    assignAndGenerateWaBtn: "Assign Homework & Generate WhatsApp Link",
    waSuccessMsg: "WhatsApp link generated successfully!",
    openAndSendWaBtn: "Open WhatsApp & Send",

    // Grade Modal
    gradeModalTitle: "Homework Evaluation - ",
    scoreInputLabel: "Score / Marks (Out of 100) *",
    feedbackPlaceholder: "e.g., Handwriting is clean, pay attention to vowels...",
    cancelBtn: "Cancel",
    submitGradeBtn: "Mark as Reviewed ✓"
  }
};

export default function TeacherPage() {
  /* ── LANGUAGE STATE (BN / EN) ── */
  const [currentLang, setCurrentLang] = useState<"bn" | "en">("bn");
  const t = dictionary[currentLang];

  /* ── STATES ── */
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [homeworks, setHomeworks] = useState<HomeworkSubmission[]>(INITIAL_HOMEWORKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"students" | "queue" | "assign" | "attendance" | "stats" | "notifs">("students");

  /* Filter & Search States */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [selectedCourseId, setSelectedCourseId] = useState<number | "all">("all");
  const [queueFilter, setQueueFilter] = useState<"all" | "pending" | "graded">("pending");

  /* Homework Modal & WhatsApp State */
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [newHwBatch, setNewHwBatch] = useState("batch1");
  const [newHwSubject, setNewHwSubject] = useState("বাংলা সুন্দর হাতের লেখা");
  const [newHwTitle, setNewHwTitle] = useState("");
  const [newHwDesc, setNewHwDesc] = useState("");
  const [newHwDueDate, setNewHwDueDate] = useState("2026-08-05");
  const [newHwPhone, setNewHwPhone] = useState("");
  const [generatedWaLink, setGeneratedWaLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  /* Zoom Live Class Modal State */
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomTopicInput, setZoomTopicInput] = useState(t.zoomTopic);
  const [zoomDateTimeInput, setZoomDateTimeInput] = useState("2026-08-01T16:00");
  const [zoomPasscodeInput, setZoomPasscodeInput] = useState("123456");

  /* Grade Modal State */
  const [selectedHw, setSelectedHw] = useState<HomeworkSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState("90");
  const [feedbackInput, setFeedbackInput] = useState("");

  /* Preview Image Modal */
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /* ── COMPUTED STATS ── */
  const totalStudents = students.length;
  const pendingHwCount = homeworks.filter((h) => h.status === "Pending").length;
  const reviewedHwCount = homeworks.filter((h) => h.status === "Graded").length;
  const avgProgress = Math.round(
    students.reduce((acc, s) => acc + s.progressPercent, 0) / (students.length || 1)
  );

  /* ── HANDLERS ── */
  const toggleAttendance = (id: string, status: "Present" | "Absent" | "Late") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendanceStatus: status } : s))
    );
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;

    const scoreNum = Number(scoreInput);
    let gradeLetter = "A+";
    if (scoreNum < 60) gradeLetter = "C";
    else if (scoreNum < 75) gradeLetter = "B";
    else if (scoreNum < 90) gradeLetter = "A";

    const studentNameStr = getLocalizedText(selectedHw.studentName, currentLang);

    setHomeworks((prev) =>
      prev.map((hw) =>
        hw.id === selectedHw.id
          ? {
              ...hw,
              score: scoreNum,
              grade: gradeLetter,
              feedback: {
                bn: feedbackInput || "খুব সুন্দর চেষ্টা করা হয়েছে!",
                en: feedbackInput || "Great effort!"
              },
              status: "Graded",
            }
          : hw
      )
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: {
          bn: `${getLocalizedText(selectedHw.studentName, "bn")}-এর হোমওয়ার্ক গ্রেডিং সম্পন্ন করা হয়েছে (${formatNumber(scoreNum, "bn")}/১০০)।`,
          en: `Grading completed for ${getLocalizedText(selectedHw.studentName, "en")} (${scoreNum}/100).`
        },
        time: {
          bn: "এইমাত্র",
          en: "Just now"
        },
        type: "submission",
        read: false,
      },
      ...prev,
    ]);

    // NEW Backend Hook: Executes AFTER existing Save logic completes seamlessly in background
    whatsappNotificationController.handleHomeworkGraded({
      body: {
        homework_id: selectedHw.id,
        student_id: selectedHw.studentId || "std-1",
        guardian_id: "grd-101",
        guardian_phone: "+8801700000000",
        student_name: getLocalizedText(selectedHw.studentName, "bn"),
        lesson_name: getLocalizedText(selectedHw.title, "bn"),
        marks: scoreNum,
        grade: gradeLetter,
        teacher_remarks: feedbackInput || "খুব সুন্দর চেষ্টা করা হয়েছে!",
      },
    });

    setSelectedHw(null);
  };

  const handleAssignHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle) return;

    const messageText = `📚 *LearnOps - ${t.assignModalTitle}* 📚\n\n📌 *${t.subjectSelectLabel.replace(" *", "")}:* ${newHwSubject}\n📖 *${t.hwTitleInputLabel.replace(" *", "")}:* ${newHwTitle}\n👥 *${t.batchSelectLabel.replace(" *", "")}:* ${newHwBatch}\n📝 *${t.hwDescInputLabel}:* ${newHwDesc || "নিয়মিত অনুশীলন করে জমা দিন।"}\n⏰ *${t.dueDateLabel.replace(" *", "")}:* ${newHwDueDate}\n\n🔗 *জমা দিন এখানে:* https://learnops.app/homework/submit`;

    const encodedMsg = encodeURIComponent(messageText);
    const waUrl = newHwPhone
      ? `https://api.whatsapp.com/send?phone=${newHwPhone.replace(/[^0-9]/g, "")}&text=${encodedMsg}`
      : `https://api.whatsapp.com/send?text=${encodedMsg}`;

    setGeneratedWaLink(waUrl);

    // Add to homework list as sample pending
    const newEntry: HomeworkSubmission = {
      id: `hw-${Date.now()}`,
      studentId: "std-new",
      studentName: { bn: "নতুন অ্যাসাইনমেন্ট", en: "New Assignment" },
      batch: { bn: "ব্যাচ ০১ (সকাল ১০:০০)", en: "Batch 01 (10:00 AM)" },
      courseId: selectedCourseId === "all" ? 1 : Number(selectedCourseId),
      subject: { bn: newHwSubject, en: newHwSubject },
      title: { bn: newHwTitle, en: newHwTitle },
      submittedDate: new Date().toISOString().split("T")[0],
      dueDate: newHwDueDate,
      submissionNote: { bn: newHwDesc, en: newHwDesc },
      score: 0,
      grade: "-",
      feedback: { bn: "", en: "" },
      status: "Pending",
    };

    setHomeworks((prev) => [newEntry, ...prev]);
  };

  const handleCreateZoomLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const alertMsg = currentLang === "bn" 
      ? "নতুন লাইভ ক্লাসের লিঙ্ক তৈরি করা হয়েছে - জুম মিটিং" 
      : "New live class link created - Zoom Meeting";
    alert(alertMsg);

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: {
          bn: "নতুন লাইভ ক্লাসের লিঙ্ক তৈরি করা হয়েছে - জুম মিটিং",
          en: "New live class link created - Zoom Meeting"
        },
        time: {
          bn: "এইমাত্র",
          en: "Just now"
        },
        type: "zoom",
        read: false,
      },
      ...prev,
    ]);

    setIsZoomModalOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  /* Filtered Lists */
  const filteredStudents = students.filter((s) => {
    const stdName = getLocalizedText(s.name, currentLang).toLowerCase();
    const stdBatch = getLocalizedText(s.batch, currentLang);
    const matchesSearch =
      stdName.includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery);
    const matchesBatch =
      selectedBatch === "all" ||
      (selectedBatch === "batch1" && stdBatch.includes("01")) ||
      (selectedBatch === "batch2" && stdBatch.includes("02")) ||
      (selectedBatch === "batch3" && stdBatch.includes("03"));
    const matchesCourse =
      selectedCourseId === "all" || s.courseId === Number(selectedCourseId);

    return matchesSearch && matchesBatch && matchesCourse;
  });

  const filteredHomeworkQueue = homeworks.filter((hw) => {
    const matchesCourse =
      selectedCourseId === "all" || hw.courseId === Number(selectedCourseId);
    if (!matchesCourse) return false;
    if (queueFilter === "pending") return hw.status === "Pending";
    if (queueFilter === "graded") return hw.status === "Graded";
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-6 sm:pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── HEADER BANNER ── */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 backdrop-blur-sm">
                <GraduationCap className="w-4 h-4" />
                <span>{t.portalTag}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {t.mainHeading}
              </h1>
              <p className="text-amber-100 text-sm mt-1 flex items-center gap-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                <span>{t.loggedInMentor}</span>
                <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-md">{t.teacherName}</span>
              </p>
            </div>

            {/* Header Controls: Course Selector & Language Switcher & Action Button */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* 5 Assigned Courses Dropdown */}
              <div className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/25 flex items-center">
                <label className="text-xs font-bold text-white/90 px-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.selectCourseLabel}</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="bg-white text-amber-950 font-bold text-xs px-3 py-1.5 rounded-xl border-none focus:ring-2 focus:ring-amber-300 outline-none cursor-pointer max-w-[200px] sm:max-w-[240px] truncate"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  {ASSIGNED_COURSES.map((course) => (
                    <option key={course.id} value={course.id} className="text-foreground">
                      {getLocalizedText(course.title, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🌐 Language Switcher Toggle (বাংলা | English) */}
              <div className="bg-white/15 backdrop-blur-md p-1 rounded-2xl border border-white/25 flex items-center shadow-inner">
                <button
                  type="button"
                  onClick={() => setCurrentLang("bn")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentLang === "bn"
                      ? "bg-white text-amber-900 shadow-md scale-105"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <span>বাংলা</span>
                </button>
                <span className="text-white/40 text-xs px-1">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentLang("en")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentLang === "en"
                      ? "bg-white text-amber-900 shadow-md scale-105"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>English</span>
                </button>
              </div>

              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
              >
                <PlusCircle className="w-4 h-4 text-amber-700" />
                <span>{t.assignHwBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TOP STATS / WIDGETS SECTION (4 CARDS) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Stat 1: Assigned Students */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {t.assignedStudents}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {formatNumber(totalStudents, currentLang)} <span className="text-sm font-normal text-muted-foreground">{t.persons}</span>
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {t.threeBatches}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
              {t.activeStudents}
            </p>
          </div>

          {/* Stat 2: Pending Homework */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {t.pendingHomework}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-amber-600 dark:text-amber-500" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {formatNumber(pendingHwCount, currentLang)} <span className="text-sm font-normal text-muted-foreground">{t.items}</span>
              </h2>
              <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md">
                {t.reviewNeeded}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
              {t.submittedFiles}
            </p>
          </div>

          {/* Stat 3: Reviewed Homework */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {t.reviewedHomework}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {formatNumber(reviewedHwCount, currentLang)} <span className="text-sm font-normal text-muted-foreground">{t.items}</span>
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {t.gradingCompleted}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
              {t.evaluatedAssignments}
            </p>
          </div>

          {/* Stat 4: Student Progress */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {t.studentProgress}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {formatNumber(avgProgress, currentLang)}%
              </h2>
              <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                {t.excellent}
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── ZOOM LIVE CLASS SECTION ── */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-500/30">
                <Video className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-red-500/30 tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    Zoom Live
                  </span>
                  <span className="text-xs text-amber-200/80 font-medium">{t.nextLiveClass}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.zoomTopicLabel}: {t.zoomTopic}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.zoomDesc} • <span className="text-amber-300 font-bold">{t.zoomTime}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
                style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{t.createLiveClass}</span>
              </button>

              <a
                href="https://zoom.us"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
              >
                <Video className="w-4 h-4" />
                <span>{t.startClass}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── MAIN DASHBOARD NAVIGATION TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-border/60">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "students"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
          >
            <Users className="w-4 h-4" />
            <span>{t.studentList} ({formatNumber(filteredStudents.length, currentLang)})</span>
          </button>

          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 relative ${
              activeTab === "queue"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
          >
            <FileCheck className="w-4 h-4" />
            <span>{t.homeworkQueue}</span>
            {pendingHwCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center ml-1">
                {formatNumber(pendingHwCount, currentLang)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "attendance"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.oneClickAttendance}</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "stats"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.performanceStats}</span>
          </button>

          <button
            onClick={() => setActiveTab("notifs")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 relative ${
              activeTab === "notifs"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
          >
            <Bell className="w-4 h-4" />
            <span>{t.notifications}</span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 ml-1 animate-pulse" />
            )}
          </button>
        </div>

        {/* ── SECTION A: STUDENT LIST ── */}
        {activeTab === "students" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.assignedStudentsList}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search Box */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  />
                </div>

                {/* Batch Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  >
                    <option value="all">{t.allBatches}</option>
                    <option value="batch1">{t.batch1}</option>
                    <option value="batch2">{t.batch2}</option>
                    <option value="batch3">{t.batch3}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students Table / Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="py-3 px-4" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>{t.rollAndName}</th>
                    <th className="py-3 px-4" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>{t.batch}</th>
                    <th className="py-3 px-4 text-center" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>{t.todayAttendance}</th>
                    <th className="py-3 px-4 text-center" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>{t.hwCompleted}</th>
                    <th className="py-3 px-4 text-center" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>{t.progress}</th>
                    <th className="py-3 px-4 text-right" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>{t.contactWhatsapp}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-muted/30 transition-colors">
                      
                      {/* Name & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center">
                            #{formatNumber(std.rollNo, currentLang)}
                          </span>
                          <div>
                            <span className="font-bold text-foreground text-sm block" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                              {getLocalizedText(std.name, currentLang)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{std.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                        {getLocalizedText(std.batch, currentLang)}
                      </td>

                      {/* Attendance Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            std.attendanceStatus === "Present"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : std.attendanceStatus === "Late"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                          style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                        >
                          {std.attendanceStatus === "Present" && <CheckCircle2 className="w-3 h-3" />}
                          {std.attendanceStatus === "Late" && <Clock className="w-3 h-3" />}
                          {std.attendanceStatus === "Absent" && <XCircle className="w-3 h-3" />}
                          {std.attendanceStatus === "Present" ? t.present : std.attendanceStatus === "Late" ? t.late : t.absent}
                        </span>
                      </td>

                      {/* Homework Ratio */}
                      <td className="py-3.5 px-4 text-center font-bold text-foreground">
                        {formatNumber(std.submittedHwCount, currentLang)}/{formatNumber(std.totalHwCount, currentLang)} {t.items}
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-28 mx-auto">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span>{formatNumber(std.progressPercent, currentLang)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${std.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* WhatsApp Direct Action */}
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${std.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(`Dear ${getLocalizedText(std.name, currentLang)}, update from LearnOps regarding homework.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                        >
                          <Send className="w-3 h-3" />
                          <span>{t.sendViaWhatsApp}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.noStudentsFound}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SECTION B: HOMEWORK REVIEW QUEUE ── */}
        {activeTab === "queue" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  <FileCheck className="w-5 h-5 text-amber-600" />
                  {t.queueTitle}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.queueDesc}
                </p>
              </div>

              {/* Queue Filters */}
              <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border">
                <button
                  onClick={() => setQueueFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    queueFilter === "pending"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  {t.pendingFilter} ({formatNumber(homeworks.filter((h) => h.status === "Pending").length, currentLang)})
                </button>
                <button
                  onClick={() => setQueueFilter("graded")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    queueFilter === "graded"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  {t.gradedFilter} ({formatNumber(homeworks.filter((h) => h.status === "Graded").length, currentLang)})
                </button>
                <button
                  onClick={() => setQueueFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    queueFilter === "all"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  {t.allFilter} ({formatNumber(homeworks.length, currentLang)})
                </button>
              </div>
            </div>

            {/* Queue Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHomeworkQueue.map((hw) => (
                <div
                  key={hw.id}
                  className="bg-muted/20 border border-border/80 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xs"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                          {getLocalizedText(hw.studentName, currentLang)}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">{getLocalizedText(hw.batch, currentLang)}</p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          hw.status === "Graded"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                        style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                      >
                        {hw.status === "Graded" ? `${t.gradeLabel}: ${hw.grade} (${formatNumber(hw.score, currentLang)}/100)` : t.pendingStatus}
                      </span>
                    </div>

                    {/* Homework Title */}
                    <div className="mb-3">
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md mb-1 inline-block">
                        {getLocalizedText(hw.subject, currentLang)}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                        {getLocalizedText(hw.title, currentLang)}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {t.submittedDateLabel} {hw.submittedDate} | {t.dueDateLabelShort} {hw.dueDate}
                      </p>
                    </div>

                    {/* Submission Attachment / Note Preview */}
                    {hw.submissionNote && (
                      <div className="bg-background border border-border p-3 rounded-xl text-xs text-foreground/80 mb-3" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                        <span className="font-bold block text-muted-foreground text-[10px] mb-0.5">{t.studentNoteLabel}</span>
                        "{getLocalizedText(hw.submissionNote, currentLang)}"
                      </div>
                    )}

                    {hw.submissionUrl && (
                      <button
                        onClick={() => setPreviewImage(hw.submissionUrl || null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 mb-4 cursor-pointer"
                        style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.previewFileBtn}</span>
                      </button>
                    )}

                    {/* Teacher Feedback (if graded) */}
                    {hw.feedback && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 mb-4" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                        <span className="font-bold block text-[10px] text-emerald-700 dark:text-emerald-400 mb-0.5">{t.teacherFeedbackLabel}</span>
                        "{getLocalizedText(hw.feedback, currentLang)}"
                      </div>
                    )}
                  </div>

                  {/* Grading Action */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedHw(hw);
                        setScoreInput(hw.score ? String(hw.score) : "90");
                        setFeedbackInput(getLocalizedText(hw.feedback, currentLang) || "");
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                      style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                    >
                      <Award className="w-4 h-4" />
                      <span>{hw.status === "Graded" ? t.editGradeBtn : t.enterMarksGrade}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredHomeworkQueue.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                {t.noHomeworkFound}
              </div>
            )}
          </div>
        )}

        {/* ── SECTION C: 1-CLICK ATTENDANCE ── */}
        {activeTab === "attendance" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  {t.attendanceTitle}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.attendanceDateLabel} {new Date().toLocaleDateString(currentLang === 'bn' ? "bn-BD" : "en-US")} | {t.attendanceDesc}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                  {t.presentCount} {formatNumber(students.filter((s) => s.attendanceStatus === "Present").length, currentLang)} {t.persons}
                </span>
                <span className="text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                  {t.lateCount} {formatNumber(students.filter((s) => s.attendanceStatus === "Late").length, currentLang)} {t.persons}
                </span>
                <span className="text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                  {t.absentCount} {formatNumber(students.filter((s) => s.attendanceStatus === "Absent").length, currentLang)} {t.persons}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60 hover:bg-muted/60 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 font-bold text-xs flex items-center justify-center">
                      #{formatNumber(student.rollNo, currentLang)}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                        {getLocalizedText(student.name, currentLang)}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">{getLocalizedText(student.batch, currentLang)}</p>
                    </div>
                  </div>

                  {/* 1-Click Toggles */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAttendance(student.id, "Present")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        student.attendanceStatus === "Present"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.present}
                    </button>

                    <button
                      onClick={() => toggleAttendance(student.id, "Late")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        student.attendanceStatus === "Late"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {t.late}
                    </button>

                    <button
                      onClick={() => toggleAttendance(student.id, "Absent")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        student.attendanceStatus === "Absent"
                          ? "bg-red-500 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t.absent}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION D: PERFORMANCE STATISTICS ── */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                <TrendingUp className="w-5 h-5 text-amber-600" />
                {t.statsTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Batch 01 Stats */}
                <div className="bg-muted/30 border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                      {t.batch1}
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {formatNumber(92, currentLang)}% {t.completedTag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{t.batchCompletionRate}: {formatNumber(92, currentLang)}%</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                    <div className="flex justify-between"><span>{t.avgScoreLabel}</span> <span className="font-bold text-foreground">{formatNumber(91, currentLang)}/100</span></div>
                    <div className="flex justify-between"><span>{t.attendanceRateLabel}</span> <span className="font-bold text-foreground">{formatNumber(95, currentLang)}%</span></div>
                    <div className="flex justify-between"><span>{t.totalStudentsLabel}</span> <span className="font-bold text-foreground">{formatNumber(20, currentLang)} {t.persons}</span></div>
                  </div>
                </div>

                {/* Batch 02 Stats */}
                <div className="bg-muted/30 border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                      {t.batch2}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {formatNumber(84, currentLang)}% {t.completedTag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{t.batchCompletionRate}: {formatNumber(84, currentLang)}%</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "84%" }} />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                    <div className="flex justify-between"><span>{t.avgScoreLabel}</span> <span className="font-bold text-foreground">{formatNumber(84, currentLang)}/100</span></div>
                    <div className="flex justify-between"><span>{t.attendanceRateLabel}</span> <span className="font-bold text-foreground">{formatNumber(88, currentLang)}%</span></div>
                    <div className="flex justify-between"><span>{t.totalStudentsLabel}</span> <span className="font-bold text-foreground">{formatNumber(15, currentLang)} {t.persons}</span></div>
                  </div>
                </div>

                {/* Batch 03 Stats */}
                <div className="bg-muted/30 border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                      {t.batch3}
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                      {formatNumber(78, currentLang)}% {t.completedTag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{t.batchCompletionRate}: {formatNumber(78, currentLang)}%</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }} />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                    <div className="flex justify-between"><span>{t.avgScoreLabel}</span> <span className="font-bold text-foreground">{formatNumber(79, currentLang)}/100</span></div>
                    <div className="flex justify-between"><span>{t.attendanceRateLabel}</span> <span className="font-bold text-foreground">{formatNumber(82, currentLang)}%</span></div>
                    <div className="flex justify-between"><span>{t.totalStudentsLabel}</span> <span className="font-bold text-foreground">{formatNumber(13, currentLang)} {t.persons}</span></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── SECTION E: NOTIFICATIONS & ALERTS ── */}
        {activeTab === "notifs" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                <Bell className="w-5 h-5 text-amber-600" />
                {t.notifTitle}
              </h2>
              <button
                onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
              >
                {t.markAllRead}
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                    notif.read
                      ? "bg-muted/20 border-border/50 text-muted-foreground"
                      : "bg-amber-500/5 border-amber-500/30 text-foreground font-medium"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                      {getLocalizedText(notif.title, currentLang)}
                    </p>
                    <span className="text-[11px] text-muted-foreground mt-1 block">
                      {getLocalizedText(notif.time, currentLang)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── ZOOM LIVE CLASS CREATION MODAL ── */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.createLiveClassModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="text-muted-foreground hover:text-foreground font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateZoomLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.zoomTopicLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={zoomTopicInput}
                  onChange={(e) => setZoomTopicInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.zoomDateTimeLabel} *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={zoomDateTimeInput}
                  onChange={(e) => setZoomDateTimeInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.zoomPasscodeLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={zoomPasscodeInput}
                  onChange={(e) => setZoomPasscodeInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer shadow-md text-xs"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  <Video className="w-4 h-4" />
                  <span>{t.createLiveClass}</span>
                </button>

                <div className="flex gap-2">
                  <a
                    href="https://zoom.us/start"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  >
                    <span>{t.startClass}</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Zoom Meeting: ${zoomTopicInput}\nLink: https://zoom.us/j/123456789\nPasscode: ${zoomPasscodeInput}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.shareWhatsapp}</span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ASSIGN HOMEWORK & WHATSAPP INTEGRATION MODAL ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.assignModalTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setGeneratedWaLink("");
                }}
                className="text-muted-foreground hover:text-foreground font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignHomework} className="space-y-4">
              
              {/* Batch Select */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.batchSelectLabel}
                </label>
                <select
                  value={newHwBatch}
                  onChange={(e) => setNewHwBatch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  <option value="batch1">{t.batch1}</option>
                  <option value="batch2">{t.batch2}</option>
                  <option value="batch3">{t.batch3}</option>
                </select>
              </div>

              {/* Subject & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                    {t.subjectSelectLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newHwSubject}
                    onChange={(e) => setNewHwSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                    {t.dueDateLabel}
                  </label>
                  <input
                    type="date"
                    required
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Homework Title */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.hwTitleInputLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.hwTitlePlaceholder}
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.hwDescInputLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.hwDescPlaceholder}
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-amber-500 resize-none"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                />
              </div>

              {/* Optional Direct Student Phone */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.waPhoneLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.waPhonePlaceholder}
                  value={newHwPhone}
                  onChange={(e) => setNewHwPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer shadow-md text-xs sm:text-sm"
                style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
              >
                <Share2 className="w-4 h-4" />
                <span>{t.assignAndGenerateWaBtn}</span>
              </button>
            </form>

            {/* Generated WhatsApp Share Link Component */}
            {generatedWaLink && (
              <div className="mt-6 pt-4 border-t border-border bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.waSuccessMsg}
                </h4>

                <div className="flex items-center gap-2 bg-background p-2.5 rounded-xl border border-border mb-3">
                  <input
                    type="text"
                    readOnly
                    value={generatedWaLink}
                    className="w-full bg-transparent text-[11px] text-muted-foreground outline-none font-mono truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedWaLink)}
                    className="inline-flex items-center gap-1 bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? t.linkCopied : t.copyLink}</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={generatedWaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                    style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.openAndSendWaBtn}</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── GRADE & FEEDBACK MODAL ── */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
            <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
              {t.gradeModalTitle}{getLocalizedText(selectedHw.studentName, currentLang)}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{getLocalizedText(selectedHw.title, currentLang)}</p>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.scoreInputLabel}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}>
                  {t.teacherFeedbackLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.feedbackPlaceholder}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHw(null)}
                  className="flex-1 bg-muted text-muted-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-all text-xs cursor-pointer"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all text-xs cursor-pointer shadow-md"
                  style={{ fontFamily: currentLang === 'bn' ? "'Hind Siliguri', sans-serif" : "inherit" }}
                >
                  {t.markAsReviewed}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── IMAGE PREVIEW MODAL ── */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-card p-4 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-black"
            >
              ✕
            </button>
            <img src={previewImage} alt="Homework Submission" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

    </div>
  );
}
