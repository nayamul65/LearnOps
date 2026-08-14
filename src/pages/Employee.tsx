import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  BarChart2,
  Users,
  BookOpen,
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
  FileText,
  UserPlus,
  Filter,
  Sun,
  Moon,
  Globe,
  Lock,
  Unlock,
  CreditCard,
  Copy,
  Share2,
  Send,
  MessageSquare,
  Check,
  Phone,
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
import {
  getStoredBatches,
  enrollStudentInBatch,
  subscribeToBatchUpdates,
  BatchItem,
} from "../services/batchStore";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & MOCK INITIAL DATA FOR FALLBACK
═══════════════════════════════════════════════════════════════════════════ */

export interface GuardianAccountRecord {
  id: string;
  guardianName: string;
  guardianPhone: string;
  studentName: string;
  batchId: string;
  batchName: string;
  loginId: string;
  tempPass: string;
  magicLink: string;
  createdAt: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-101",
    studentName: "আরাফ হোসেন",
    parentName: "সামিরা সুলতানা",
    phone: "01711-223344",
    courseInterest: "২৫ দিনে সুন্দর হাতের লেখা",
    status: "New",
    source: "Ad Click",
    claimedBy: null,
    assignedEmployeeId: null,
    callNotes: [
      { date: "2026-08-01 10:30 AM", note: "অভিভাবক কোর্সের সময়সূচি ও ফিস জানতে চেয়েছেন।", agent: "সাপোর্ট" },
    ],
    date: "2026-08-01",
  },
  {
    id: "lead-102",
    studentName: "তাহিয়া রহমান",
    parentName: "মাহাবুব আলম",
    phone: "01822-334455",
    courseInterest: "অ্যাডভান্সড স্পিড ও বিউটি কোর্স",
    status: "In Progress",
    source: "Google Form",
    claimedBy: "আরিফুল ইসলাম (You)",
    assignedEmployeeId: "emp-1",
    callNotes: [
      { date: "2026-08-02 02:15 PM", note: "ফোন করা হয়েছিল, আগামী পরশু বিকাশ পেমেন্ট করবেন।", agent: "আরিফুল ইসলাম (You)" },
    ],
    date: "2026-08-02",
  },
  {
    id: "lead-103",
    studentName: "সামিন চৌধুরী",
    parentName: "নাসরিন পারভীন",
    phone: "01933-445566",
    courseInterest: "কিডস আর্লি রাইটিং ফাউন্ডেশন",
    status: "Converted",
    source: "Social DM",
    claimedBy: "আরিফুল ইসলাম (You)",
    assignedEmployeeId: "emp-1",
    paymentConfirmed: true,
    paymentAmount: 2500,
    trxId: "BK892310X",
    callNotes: [
      { date: "2026-08-03 11:00 AM", note: "পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে। এনরোলমেন্ট কমপ্লিট।", agent: "আরিফুল ইসলাম (You)" },
    ],
    date: "2026-08-03",
  },
  {
    id: "lead-104",
    studentName: "তানভীর আহম্মেদ",
    parentName: "রেজাউল করিম",
    phone: "01644-556677",
    courseInterest: "8 WEEKS ENGLISH SPEAKING",
    status: "New",
    source: "Ad Click",
    claimedBy: null,
    assignedEmployeeId: null,
    callNotes: [],
    date: "2026-08-04",
  },
  {
    id: "lead-105",
    studentName: "নুসাইবা পারভীন",
    parentName: "জহিরুল ইসলাম",
    phone: "01555-112233",
    courseInterest: "২৫ দিনে সুন্দর হাতের লেখা",
    status: "Follow-up",
    source: "Google Form",
    claimedBy: "আরিফুল ইসলাম (You)",
    assignedEmployeeId: "emp-1",
    callNotes: [
      { date: "2026-08-05 04:00 PM", note: "অভিভাবকের সাথে আগামী কাল সকালে পুনরায় ফোন দিতে বলা হয়েছে।", agent: "আরিফুল ইসলাম (You)" },
    ],
    date: "2026-08-05",
  },
  {
    id: "lead-106",
    studentName: "আতিয়া ফারহিন",
    parentName: "ফারুক আহমেদ",
    phone: "01788-332211",
    courseInterest: "৩০ দিনে ছোটদের হ্যান্ডরাইটিং",
    status: "New",
    source: "Social DM",
    claimedBy: null,
    assignedEmployeeId: null,
    callNotes: [],
    date: "2026-08-06",
  },
];

const MOCK_BATCHES = [
  { id: "batch-101", name: "ব্যাচ ০৪ - ২৫ দিনে সুন্দর হাতের লেখা (বিকাল ৪:০০ টা)" },
  { id: "batch-102", name: "ব্যাচ ০২ - ৩০ দিনে ছোটদের হ্যান্ডরাইটিং (সকাল ১০:০০ টা)" },
  { id: "batch-103", name: "ব্যাচ ০১ - ৮ উইকস ইংলিশ স্পোকেন (রাত ৮:০০ টা)" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CENTRALIZED PURE TRANSLATIONS DICTIONARY (100% ENG & 100% BAN)
═══════════════════════════════════════════════════════════════════════════ */

const employeeTranslations = {
  en: {
    brandName: "LearnOps Salesman",
    portalSubtitle: "Telesales & CRM Workspace",
    supabaseConnected: "Supabase Connected",
    refreshDb: "Refresh Live Data",
    syncing: "Syncing DB...",
    loggedInAs: "Logged in Agent:",

    // Sidebar Tabs
    overviewTab: "Overview",
    overviewDesc: "Stats & Personal KPIs",
    pipelineTab: "Lead Pipeline & Call Desk",
    pipelineDesc: "Claim Leads & Call Logs",
    paymentsTab: "Confirm Payments",
    paymentsDesc: "Verify Sales & Revenue",
    guardianTab: "Guardian Account & Magic Link",
    guardianDesc: "Onboard & WhatsApp Share",

    // Overview Tab
    kpiCallsMade: "Total Calls Made",
    kpiCallsSub: "Calls logged by you",
    kpiConvertedDeals: "Converted Deals",
    kpiConvertedSub: "Successfully enrolled",
    kpiPendingFollowups: "Pending Follow-ups",
    kpiPendingSub: "Requires follow-up call",
    kpiTotalRevenue: "Total Revenue Generated",
    kpiRevenueSub: "Confirmed payments",

    weeklyActivityTitle: "Weekly Calling & Sales Performance",
    targetProgressTitle: "Monthly Sales Target Goal",
    targetProgressSub: "Progress towards ৳1,00,000 monthly quota",
    recentCallActivity: "Recent Call Log Activity",
    noRecentCalls: "No recent call activity logged.",
    callsUnit: "Calls",
    salesUnit: "Sales",

    // Lead Pipeline & Call Desk Tab
    unassignedPoolTitle: "Unassigned Leads Pool",
    unassignedPoolDesc: "Leads available for claiming. Lock leads to start calling.",
    myLeadsTitle: "My Claimed Leads Desk",
    myLeadsDesc: "Manage follow-ups, log call notes, and confirm sales.",
    claimLeadBtn: "Claim Lead",
    leadClaimedSuccess: "Lead claimed successfully!",
    allSources: "All Sources",
    adClick: "Ad Click",
    googleForm: "Google Form",
    socialDm: "Social DM",
    allStatuses: "All Statuses",
    statusNew: "New",
    statusClaimed: "Claimed",
    statusInProgress: "In Progress",
    statusCalled: "Called",
    statusInterested: "Interested",
    statusFollowUp: "Call Back",
    statusConverted: "Converted",
    statusRejected: "Rejected",

    searchPlaceholder: "Search by student, parent, or phone...",
    studentName: "Student Name",
    parentName: "Parent / Guardian",
    phone: "Phone Number",
    courseInterest: "Course Interest",
    sourceBadge: "Source",
    statusBadge: "Status",
    actions: "Actions",
    addCallNoteBtn: "Add Call Note",
    confirmPaymentBtn: "Confirm Payment",
    createGuardianBtn: "Register Guardian",
    callNotesHistory: "Call History & Notes",
    noCallNotes: "No call notes recorded yet.",

    // Modal Add Call Note
    addNoteTitle: "Log Call Note & Update Status",
    selectStatusLabel: "Update Lead Status:",
    callNotePlaceholder: "Enter detailed call summary, parent feedback, or follow-up date...",
    saveNoteBtn: "Save Call Note ✓",

    // Confirm Payments Tab
    paymentsTitle: "Sales & Payment Confirmation Desk",
    paymentsSectionDesc: "Record bKash/Nagad/Bank transactions and convert leads instantly.",
    totalConfirmedSales: "Total Confirmed Sales",
    confirmedRevenue: "Confirmed Revenue",
    selectLeadLabel: "Select Lead / Student *",
    selectCourseBatchLabel: "Select Course & Batch *",
    whatsappNumberLabel: "WhatsApp Number (For Direct Automated Teacher Messaging) *",
    paymentMethodLabel: "Payment Method *",
    amountPaidLabel: "Amount Paid (৳) *",
    trxIdLabel: "Transaction ID (TrxID / Reference) *",
    confirmAndEnrollBtn: "Verify Payment & Confirm Sale ✓",
    paymentConfirmedSuccess: "Payment confirmed, student enrolled in batch, and lead converted successfully!",
    confirmedBuyersTableTitle: "Confirmed Sales & Transactions History",
    colStudent: "Student & Parent",
    colCourseBatch: "Course & Batch",
    colMethodTrx: "Payment Method & TrxID",
    colAmount: "Amount Paid",
    colDate: "Date",

    // Guardian Account & Magic Link Tab
    guardianAccountTitle: "Guardian Account & Shareable Magic Link Generator",
    guardianAccountDesc: "Register a student & guardian, create portal credentials, and generate direct WhatsApp links.",
    registerGuardianFormTitle: "Register New Guardian & Student",
    guardianNameLabel: "Guardian Full Name *",
    guardianPhoneLabel: "Guardian Phone / WhatsApp Number *",
    studentNameLabel: "Student Name *",
    assignBatchLabel: "Assign Course & Batch *",
    createAccountBtn: "Create Guardian Account & Generate Link 🚀",

    magicLinkGeneratedTitle: "Shareable Direct Portal Link Generated!",
    magicLinkDesc: "Send this direct link via WhatsApp or SMS. Guardians can open their child's portal without manual password entry.",
    copyLinkBtn: "Copy Shareable Link",
    copyWhatsAppMsgBtn: "Copy WhatsApp Message",
    openWhatsAppBtn: "Send via WhatsApp Direct 📲",
    linkCopiedAlert: "Shareable link copied to clipboard!",
    msgCopiedAlert: "WhatsApp ready message copied to clipboard!",

    createdGuardiansTableTitle: "Registered Guardians & Active Links Roster",
    loginIdLabel: "Login ID:",
    tempPassLabel: "Temp Password:",
    actionShare: "Share Link",
  },
  bn: {
    brandName: "লার্নঅপস সেলসম্যান",
    portalSubtitle: "টেলিসেলস ও সিআরএম ওয়ার্কস্পেস",
    supabaseConnected: "সুপাবেজ কানেক্টেড",
    refreshDb: "লাইভ ডাটা রিফ্রেশ",
    syncing: "সিঙ্ক হচ্ছে...",
    loggedInAs: "লগইনকৃত এজেন্ট:",

    // Sidebar Tabs
    overviewTab: "ওভারভিউ",
    overviewDesc: "ব্যক্তিগত পরিসংখ্যান ও কেপিআই",
    pipelineTab: "লিড পাইপলাইন ও কল ডেস্ক",
    pipelineDesc: "লিড ক্লেম ও কল লগ",
    paymentsTab: "পেমেন্ট কনফার্মেশন",
    paymentsDesc: "সেলস ও রেভিনিউ ভেরিফাই",
    guardianTab: "গার্জিয়ান অ্যাকাউন্ট ও ম্যাজিক লিঙ্ক",
    guardianDesc: "অনবোর্ডিং ও হোয়াটসঅ্যাপ শেয়ার",

    // Overview Tab
    kpiCallsMade: "মোট সম্পন্ন কল",
    kpiCallsSub: "আপনার প্রদানকৃত কল নোট",
    kpiConvertedDeals: "কনভার্টেড সেলস",
    kpiConvertedSub: "সফলভাবে ভর্তি নিশ্চিত",
    kpiPendingFollowups: "পেন্ডিং ফলো-আপ",
    kpiPendingSub: "পুনরায় কল দেওয়া প্রয়োজন",
    kpiTotalRevenue: "মোট অর্জিত রেভিনিউ",
    kpiRevenueSub: "ভেরিফাইড পেমেন্টসমূহ",

    weeklyActivityTitle: "সাপ্তাহিক কলিং ও সেলস পারফরম্যান্স",
    targetProgressTitle: "মাসিক সেলস টার্গেট অগ্রগতি",
    targetProgressSub: "মাসিক ৳১,০০,০০০ টার্গেটের সাপেক্ষে অগ্রগতি",
    recentCallActivity: "সাম্প্রতিক কল লগ অ্যাক্টিভিটি",
    noRecentCalls: "কোন সাম্প্রতিক কল অ্যাক্টিভিটি নেই।",
    callsUnit: "টি কল",
    salesUnit: "টি সেলস",

    // Lead Pipeline & Call Desk Tab
    unassignedPoolTitle: "আনঅ্যাসাইন্ড লিড পুল",
    unassignedPoolDesc: "যেসব লিড এখনও কোন এজেন্ট ক্লেম করেননি। কল শুরু করতে লিড লক করুন।",
    myLeadsTitle: "আমার ক্লেমকৃত লিড ডেস্ক",
    myLeadsDesc: "ফলো-আপ পরিচালনা, কল নোট সংরক্ষণ ও পেমেন্ট কনফার্ম করুন।",
    claimLeadBtn: "লিড ক্লেম করুন",
    leadClaimedSuccess: "লিড সফলভাবে ক্লেম করা হয়েছে!",
    allSources: "সব সোর্স",
    adClick: "ফেসবুক এড",
    googleForm: "গুগল ফর্ম",
    socialDm: "সোশ্যাল ডিএম",
    allStatuses: "সব স্ট্যাটাস",
    statusNew: "নতুন",
    statusClaimed: "ক্লেইমড",
    statusInProgress: "চলতি যোগাযোগ",
    statusCalled: "কথা হয়েছে",
    statusInterested: "আগ্রহী",
    statusFollowUp: "কল ব্যাক (ফলো-আপ)",
    statusConverted: "কনভার্টেড (পেমেন্ট সম্পন্ন)",
    statusRejected: "বাতিল",

    searchPlaceholder: "শিক্ষার্থী, অভিভাবক বা ফোন নম্বর দিয়ে খুঁজুন...",
    studentName: "শিক্ষার্থীর নাম",
    parentName: "অভিভাবকের নাম",
    phone: "ফোন নম্বর",
    courseInterest: "আগ্রহী কোর্স",
    sourceBadge: "সোর্স",
    statusBadge: "স্ট্যাটাস",
    actions: "অ্যাকশন",
    addCallNoteBtn: "কল নোট যুক্ত করুন",
    confirmPaymentBtn: "পেমেন্ট কনফার্ম",
    createGuardianBtn: "গার্জিয়ান একাউন্ট",
    callNotesHistory: "কল হিস্টোরি ও নোটস",
    noCallNotes: "এখনও কোনো কল নোট যুক্ত করা হয়নি।",

    // Modal Add Call Note
    addNoteTitle: "কল নোট ও স্ট্যাটাস আপডেট",
    selectStatusLabel: "লিড স্ট্যাটাস নির্বাচন করুন:",
    callNotePlaceholder: "কলের বিবরণ, অভিভাবকের মতামত বা পরবর্তী কলের সময় লিখুন...",
    saveNoteBtn: "নোট সংরক্ষণ করুন ✓",

    // Confirm Payments Tab
    paymentsTitle: "সেলস ও পেমেন্ট কনফার্মেশন ডেস্ক",
    paymentsSectionDesc: "বিকাশ/নগদ/ব্যাংক ট্রানজেকশন রেকর্ড করুন এবং ভর্তি সম্পন্ন করুন।",
    totalConfirmedSales: "মোট কনফার্মড সেলস",
    confirmedRevenue: "কনফার্মড রেভিনিউ",
    selectLeadLabel: "লিড / শিক্ষার্থী নির্বাচন করুন *",
    selectCourseBatchLabel: "কোর্স ও ব্যাচ নির্বাচন করুন *",
    whatsappNumberLabel: "হোয়াটসঅ্যাপ নম্বর (শিক্ষক পোর্টাল থেকে অটোমেটেড মেসেজিং) *",
    paymentMethodLabel: "পেমেন্ট মেথড *",
    amountPaidLabel: "পেমেন্ট পরিমাণ (টাকা) *",
    trxIdLabel: "ট্রানজেকশন আইডি (TrxID / রেফারেন্স) *",
    confirmAndEnrollBtn: "পেমেন্ট ভেরিফাই ও সেলস কনফার্ম করুন ✓",
    paymentConfirmedSuccess: "পেমেন্ট ভেরিফাই হয়েছে, ব্যাচে এনরোল সম্পন্ন ও স্ট্যাটাস কনভার্টেড করা হয়েছে!",
    confirmedBuyersTableTitle: "কনফার্মড সেলস ও ট্রানজেকশন হিস্টোরি",
    colStudent: "শিক্ষার্থী ও অভিভাবক",
    colCourseBatch: "কোর্স ও ব্যাচ",
    colMethodTrx: "পেমেন্ট মেথড ও ট্রানজেকশন আইডি",
    colAmount: "পেমেন্ট পরিমাণ",
    colDate: "তারিখ",

    // Guardian Account & Magic Link Tab
    guardianAccountTitle: "গার্জিয়ান অ্যাকাউন্ট ও ম্যাজিক লিঙ্ক জেনারেটর",
    guardianAccountDesc: "শিক্ষার্থী ও অভিভাবক নিবন্ধন করুন, পোর্টাল ক্রেডেনশিয়াল তৈরি করুন এবং সরাসরি হোয়াটসঅ্যাপ লিঙ্ক তৈরি করুন।",
    registerGuardianFormTitle: "নতুন অভিভাবক ও শিক্ষার্থী অনবোর্ডিং",
    guardianNameLabel: "অভিভাবকের পুরো নাম *",
    guardianPhoneLabel: "অভিভাবকের ফোন / হোয়াটসঅ্যাপ নম্বর *",
    studentNameLabel: "শিক্ষার্থীর নাম *",
    assignBatchLabel: "কোর্স ও ব্যাচ সিলেক্ট করুন *",
    createAccountBtn: "গার্জিয়ান অ্যাকাউন্ট তৈরি ও লিঙ্ক জেনারেট করুন 🚀",

    magicLinkGeneratedTitle: "শেয়ারেবল ডাইরেক্ট পোর্টাল লিঙ্ক তৈরি হয়েছে!",
    magicLinkDesc: "এই ডাইরেক্ট লিঙ্কটি হোয়াটসঅ্যাপ বা এসএমএস-এর মাধ্যমে পাঠান। অভিভাবকরা ম্যানুয়াল লগইন ছাড়াই সন্তানের পোর্টাল দেখতে পাবেন।",
    copyLinkBtn: "ডাইরেক্ট লিঙ্ক কপি করুন",
    copyWhatsAppMsgBtn: "হোয়াটসঅ্যাপ মেসেজ কপি করুন",
    openWhatsAppBtn: "সরাসরি হোয়াটসঅ্যাপে পাঠান 📲",
    linkCopiedAlert: "লিঙ্কটি ক্লিপবোর্ডে কপি করা হয়েছে!",
    msgCopiedAlert: "হোয়াটসঅ্যাপ মেসেজ ক্লিপবোর্ডে কপি করা হয়েছে!",

    createdGuardiansTableTitle: "নিবন্ধিত অভিভাবক ও সক্রিয় লিঙ্ক তালিকা",
    loginIdLabel: "লগইন আইডি:",
    tempPassLabel: "টেম্প পাসওয়ার্ড:",
    actionShare: "লিঙ্ক শেয়ার",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EMPLOYEE COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export default function Employee() {
  const { lang: contextLang, setLang: contextSetLang } = useLanguage();
  const lang = contextLang === "EN" ? "en" : "bn";
  const setLang = (newLang: "en" | "bn") => contextSetLang(newLang === "en" ? "EN" : "BN");
  const t = employeeTranslations[lang];

  // Current logged in agent details
  const currentAgent = {
    id: "emp-1",
    name: lang === "en" ? "Ariful Islam" : "আরিফুল ইসলাম",
  };

  // Theme & Navigation state
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<"overview" | "pipeline" | "payments" | "guardian">("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync theme mode to document element for Tailwind dark variant support
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Core Data States
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [batches, setBatches] = useState<BatchItem[]>(() => getStoredBatches());
  const [guardianAccounts, setGuardianAccounts] = useState<GuardianAccountRecord[]>([
    {
      id: "grd-101",
      guardianName: "সামিরা সুলতানা",
      guardianPhone: "01711223344",
      studentName: "আরাফ হোসেন",
      batchId: "batch-101",
      batchName: "ব্যাচ ০৪ - ২৫ দিনে সুন্দর হাতের লেখা",
      loginId: "01711223344",
      tempPass: "pass1234",
      magicLink: `${window.location.origin}/guardian?phone=01711223344&student=std-1`,
      createdAt: "2026-08-05",
    },
  ]);

  // Lead Pipeline Filters & Search
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>("All");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("All");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");

  // Modals state
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteStatus, setNewNoteStatus] = useState<Lead["status"]>("Called");

  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<Lead | null>(null);
  const [paymentSelectedBatchId, setPaymentSelectedBatchId] = useState<string>(() => (getStoredBatches()[0]?.id || "batch-101"));
  const [paymentWhatsappNumber, setPaymentWhatsappNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [paymentAmount, setPaymentAmount] = useState("2500");
  const [paymentTrxId, setPaymentTrxId] = useState("");

  // Guardian Account Form State
  const [guardianNameInput, setGuardianNameInput] = useState("");
  const [guardianPhoneInput, setGuardianPhoneInput] = useState("");
  const [studentNameInput, setStudentNameInput] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(() => (getStoredBatches()[0]?.id || "batch-101"));

  const [generatedLinkInfo, setGeneratedLinkInfo] = useState<{
    guardianName: string;
    studentName: string;
    phone: string;
    batchName: string;
    link: string;
    message: string;
    loginId: string;
    tempPass: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Load live data from Supabase
  const fetchSupabaseData = async () => {
    setIsLoading(true);
    try {
      const { data: dbLeads, error: leadErr } = await supabase.from("leads").select("*");
      if (!leadErr && dbLeads && dbLeads.length > 0) {
        setLeads(
          dbLeads.map((l: any) => ({
            id: l.id,
            studentName: l.student_name || l.studentName || "শিক্ষার্থী",
            parentName: l.parent_name || l.parentName || "অভিভাবক",
            phone: l.phone || "",
            courseInterest: l.course_interest || l.courseInterest || "কোর্স",
            status: l.status || "New",
            source: l.source || "Ad Click",
            claimedBy: l.claimed_by || l.claimedBy || null,
            assignedEmployeeId: l.assigned_employee_id || null,
            paymentConfirmed: l.payment_confirmed || l.paymentConfirmed || false,
            paymentAmount: l.amount_paid || l.paymentAmount || 0,
            trxId: l.trx_id || l.trxId || "",
            callNotes: l.call_notes || l.callNotes || [],
            date: l.created_at ? l.created_at.substring(0, 10) : "2026-08-05",
          }))
        );
      }

      const { data: dbBatches, error: batchErr } = await supabase.from("batches").select("*");
      if (!batchErr && dbBatches && dbBatches.length > 0) {
        setBatches(
          dbBatches.map((b: any) => ({
            id: b.id,
            name: `${b.name || "ব্যাচ"} - ${b.course_title || b.courseTitle || ""}`,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching Supabase data in Salesman portal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
    const unsub = subscribeToBatchUpdates((updatedBatches) => {
      setBatches(updatedBatches);
    });
    return unsub;
  }, []);

  // ── HANDLERS ──

  // Claim Lead Handler
  const handleClaimLead = async (leadId: string) => {
    const agentNameStr = `${currentAgent.name} (You)`;
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updatedNotes = [
            ...l.callNotes,
            {
              date: new Date().toLocaleString(),
              note: lang === "en" ? `Lead claimed by ${currentAgent.name}` : `${currentAgent.name} লিডটি লক করেছেন (Claimed).`,
              agent: currentAgent.name,
            },
          ];
          return {
            ...l,
            status: "In Progress",
            claimedBy: agentNameStr,
            assignedEmployeeId: currentAgent.id,
            callNotes: updatedNotes,
          };
        }
        return l;
      })
    );

    try {
      await supabase
        .from("leads")
        .update({
          status: "In Progress",
          claimed_by: agentNameStr,
          assigned_employee_id: currentAgent.id,
        })
        .eq("id", leadId);
    } catch (err) {
      console.error("Error claiming lead in Supabase:", err);
    }
  };

  // Add Call Note Handler
  const handleAddCallNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForNote || !newNoteText.trim()) return;

    const noteObj = {
      date: new Date().toLocaleString(),
      note: newNoteText,
      agent: currentAgent.name,
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === selectedLeadForNote.id) {
          const updatedNotes = [...l.callNotes, noteObj];
          return {
            ...l,
            status: newNoteStatus,
            callNotes: updatedNotes,
          };
        }
        return l;
      })
    );

    try {
      const updatedNotes = [...selectedLeadForNote.callNotes, noteObj];
      await supabase
        .from("leads")
        .update({
          status: newNoteStatus,
          call_notes: updatedNotes,
        })
        .eq("id", selectedLeadForNote.id);
    } catch (err) {
      console.error("Error saving call note to Supabase:", err);
    }

    setSelectedLeadForNote(null);
    setNewNoteText("");
  };

  // Confirm Payment Handler
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForPayment || !paymentTrxId.trim()) return;

    const amt = Number(paymentAmount) || 0;
    const targetBatch = batches.find((b) => b.id === paymentSelectedBatchId) || batches[0];
    const batchName = targetBatch ? targetBatch.name : "Batch";

    const noteObj = {
      date: new Date().toLocaleString(),
      note: lang === "en"
        ? `Payment Confirmed: ৳${amt} (${paymentMethod}, TrxID: ${paymentTrxId}). Batch: ${batchName}. WhatsApp: ${paymentWhatsappNumber || selectedLeadForPayment.phone}`
        : `পেমেন্ট নিশ্চিত করা হয়েছে: ৳${amt} (${paymentMethod}, TrxID: ${paymentTrxId})। ব্যাচ: ${batchName}`,
      agent: currentAgent.name,
    };

    // 1. Automatically enroll student in selected batch with WhatsApp number
    if (targetBatch) {
      enrollStudentInBatch(targetBatch.id, {
        name: selectedLeadForPayment.studentName,
        parentName: selectedLeadForPayment.parentName,
        phone: selectedLeadForPayment.phone,
        whatsappNumber: paymentWhatsappNumber || selectedLeadForPayment.phone,
        courseTitle: selectedLeadForPayment.courseInterest,
      });
    }

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === selectedLeadForPayment.id) {
          return {
            ...l,
            status: "Converted",
            paymentConfirmed: true,
            paymentAmount: amt,
            trxId: `${paymentMethod}-${paymentTrxId}`,
            callNotes: [...l.callNotes, noteObj],
          };
        }
        return l;
      })
    );

    try {
      const updatedNotes = [...selectedLeadForPayment.callNotes, noteObj];
      await supabase
        .from("leads")
        .update({
          status: "Converted",
          payment_confirmed: true,
          payment_status: "Confirmed",
          amount_paid: amt,
          trx_id: `${paymentMethod}-${paymentTrxId}`,
          call_notes: updatedNotes,
        })
        .eq("id", selectedLeadForPayment.id);
    } catch (err) {
      console.error("Error confirming payment in Supabase:", err);
    }

    setSelectedLeadForPayment(null);
    setPaymentTrxId("");
    setPaymentWhatsappNumber("");
  };

  // Guardian Account Creation & Direct Magic Link Handler
  const handleCreateGuardianAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianNameInput.trim() || !guardianPhoneInput.trim() || !studentNameInput.trim()) return;

    const cleanPhone = guardianPhoneInput.replace(/\D/g, "");
    const batchObj = batches.find((b) => b.id === selectedBatchId) || batches[0];
    const generatedId = `std-${Date.now().toString().slice(-4)}`;
    const tempPass = "pass1234";

    const magicLinkUrl = `${window.location.origin}/guardian?student_id=${generatedId}&phone=${cleanPhone}`;

    const formattedMsg = lang === "en"
      ? `Assalamu Alaikum ${guardianNameInput}! Your child ${studentNameInput} has been registered at LearnOps.\n\n📚 Batch: ${batchObj.name}\n🔑 Login Phone: ${cleanPhone}\n🔐 Temp Password: ${tempPass}\n\n👉 Direct Guardian Portal Link:\n${magicLinkUrl}\n\nClick the link above to view live class schedules, attendance, and exam grades.`
      : `আসসালামু আলাইকুম ${guardianNameInput}! লার্নঅপস-এ আপনার সন্তান ${studentNameInput}-এর এনরোলমেন্ট সম্পন্ন হয়েছে।\n\n📚 ব্যাচ: ${batchObj.name}\n🔑 মোবাইল নম্বর: ${cleanPhone}\n🔐 টেম্পোরারি পাসওয়ার্ড: ${tempPass}\n\n👉 সরাসরি গার্জিয়ান পোর্টাল লিঙ্ক:\n${magicLinkUrl}\n\nউপরের লিঙ্কে ক্লিক করে ক্লাসের সময়সূচি, উপস্থিতি ও পরীক্ষার রেজাল্ট দেখতে পারবেন।`;

    const newRecord: GuardianAccountRecord = {
      id: `grd-${Date.now()}`,
      guardianName: guardianNameInput,
      guardianPhone: cleanPhone,
      studentName: studentNameInput,
      batchId: batchObj.id,
      batchName: batchObj.name,
      loginId: cleanPhone,
      tempPass: tempPass,
      magicLink: magicLinkUrl,
      createdAt: new Date().toISOString().substring(0, 10),
    };

    setGuardianAccounts((prev) => [newRecord, ...prev]);

    setGeneratedLinkInfo({
      guardianName: guardianNameInput,
      studentName: studentNameInput,
      phone: cleanPhone,
      batchName: batchObj.name,
      link: magicLinkUrl,
      message: formattedMsg,
      loginId: cleanPhone,
      tempPass: tempPass,
    });

    // Sync to Supabase `users` table
    try {
      await supabase.from("users").insert([
        {
          name: guardianNameInput,
          phone: cleanPhone,
          role: "guardian",
          temp_password: tempPass,
          student_name: studentNameInput,
          batch_id: batchObj.id,
        },
      ]);
    } catch (err) {
      console.error("Error creating guardian account in Supabase:", err);
    }

    setGuardianNameInput("");
    setGuardianPhoneInput("");
    setStudentNameInput("");
  };

  // Helper copy to clipboard
  const copyToClipboard = (text: string, type: "link" | "msg") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    }
  };

  // Filter calculations
  const myLeads = leads.filter(
    (l) => l.assignedEmployeeId === currentAgent.id || (l.claimedBy && l.claimedBy.includes(currentAgent.name))
  );

  const unassignedLeads = leads.filter(
    (l) => !l.assignedEmployeeId && (!l.claimedBy || l.claimedBy === "Unassigned")
  );

  const filteredMyLeads = myLeads.filter((l) => {
    if (leadSourceFilter !== "All" && l.source !== leadSourceFilter) return false;
    if (leadStatusFilter !== "All" && l.status !== leadStatusFilter) return false;
    if (leadSearchQuery.trim()) {
      const q = leadSearchQuery.toLowerCase();
      const matchStudent = l.studentName.toLowerCase().includes(q);
      const matchParent = l.parentName.toLowerCase().includes(q);
      const matchPhone = l.phone.includes(q);
      return matchStudent || matchParent || matchPhone;
    }
    return true;
  });

  // KPI Performance metrics calculation
  const totalCallsCount = myLeads.reduce((acc, l) => acc + (l.callNotes ? l.callNotes.length : 0), 0);
  const convertedDealsCount = myLeads.filter((l) => l.status === "Converted" || l.paymentConfirmed).length;
  const pendingFollowupsCount = myLeads.filter(
    (l) => l.status === "In Progress" || l.status === "Follow-up" || l.status === "Called" || l.status === "Interested"
  ).length;
  const totalRevenueAmount = myLeads
    .filter((l) => l.status === "Converted" || l.paymentConfirmed)
    .reduce((acc, l) => acc + (l.paymentAmount || 2500), 0);

  // Performance Chart Mock Data
  const callingPerformanceData = [
    { name: lang === "en" ? "Sat" : "শনি", calls: 14, sales: 2 },
    { name: lang === "en" ? "Sun" : "রবি", calls: 22, sales: 4 },
    { name: lang === "en" ? "Mon" : "সোম", calls: 18, sales: 3 },
    { name: lang === "en" ? "Tue" : "মঙ্গল", calls: 26, sales: 5 },
    { name: lang === "en" ? "Wed" : "বুধ", calls: 30, sales: 6 },
    { name: lang === "en" ? "Thu" : "বৃহঃ", calls: 25, sales: 4 },
    { name: lang === "en" ? "Fri" : "শুক্র", calls: 12, sales: 1 },
  ];

  // Dynamic Theme helper classes matching Light & Dark mode contrast rules
  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  const bgSidebar = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";
  const bgCard = isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-xs";
  const bgInnerCard = isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200";
  const bgSubCard = isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200";
  const textHeading = isDark ? "text-white" : "text-slate-900";
  const textSub = isDark ? "text-slate-400" : "text-slate-600";
  const textLabel = isDark ? "text-slate-300" : "text-slate-700";
  const inputBg = isDark
    ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500 placeholder-slate-500"
    : "bg-white border-slate-300 text-slate-900 focus:border-emerald-500 placeholder-slate-400";
  const tableHeaderStyle = isDark
    ? "border-slate-800 bg-slate-950/80 text-slate-400"
    : "border-slate-200 bg-slate-100 text-slate-700";
  const tableRowHover = isDark ? "hover:bg-slate-900/50" : "hover:bg-slate-100/60";
  const modalBg = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-2xl";

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
         LEFT SIDEBAR NAVIGATION (RESPONSIVE OFF-CANVAS DRAWER & DESKTOP DOCK)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 md:z-40 ${bgSidebar} border-r transition-all duration-300 ease-in-out flex flex-col justify-between
          ${isMobileSidebarOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full md:translate-x-0"}
          ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        <div>
          {/* Brand Header */}
          <div className={`h-16 flex items-center justify-between px-4 border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white shadow-lg shrink-0">
                L
              </div>
              <span className={`font-extrabold text-base tracking-tight truncate ${textHeading} ${isSidebarCollapsed ? "md:hidden" : "block"}`}>
                Learn<span className="text-emerald-500">Ops</span> {t.brandName.split(" ")[1] || "Sales"}
              </span>
            </div>

            {/* Desktop Collapse Pill Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`hidden md:flex p-1.5 rounded-xl ${textSub} hover:${textHeading} ${isDark ? "hover:bg-slate-800/40 border-slate-700/40" : "hover:bg-slate-100 border-slate-300"} border transition-all cursor-pointer items-center justify-center`}
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

          {/* TOP-LEFT SIDEBAR CONTROL ROW: 1-CLICK LANGUAGE & THEME TOGGLES */}
          <div className={`px-4 my-3 pb-3 border-b ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
            {!isSidebarCollapsed || isMobileSidebarOpen ? (
              <div className="flex items-center gap-2">
                {/* 1-Click Language Toggle: ENG | BAN */}
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

                {/* 1-Click Theme Toggle: ☀️ / 🌙 */}
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
                  title={`Language: ${lang.toUpperCase()}`}
                >
                  <Globe className="w-4 h-4 text-emerald-500" />
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-8 h-8 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-slate-200 border-slate-300 text-amber-600"} text-xs flex items-center justify-center hover:border-amber-500 transition-colors cursor-pointer`}
                  title={`Theme: ${theme.toUpperCase()}`}
                >
                  {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-1">
            {[
              { id: "overview", label: t.overviewTab, icon: BarChart3, desc: t.overviewDesc },
              { id: "pipeline", label: t.pipelineTab, icon: PhoneCall, desc: t.pipelineDesc },
              { id: "payments", label: t.paymentsTab, icon: CreditCard, desc: t.paymentsDesc },
              { id: "guardian", label: t.guardianTab, icon: UserPlus, desc: t.guardianDesc },
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
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : isDark ? "text-slate-400" : "text-slate-500"}`} />
                  {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <div className="text-left leading-tight">
                      <div className="font-bold text-sm">{item.label}</div>
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
        {(!isSidebarCollapsed || isMobileSidebarOpen) && (
          <div className={`p-4 border-t ${isDark ? "border-slate-800/60" : "border-slate-200"} space-y-2`}>
            <div className={`flex items-center gap-2 text-xs font-semibold p-2.5 rounded-xl border ${
              isDark ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/40" : "text-emerald-700 bg-emerald-50 border-emerald-200"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.supabaseConnected}</span>
            </div>
            <p className={`text-[10px] text-center ${textSub}`}>
              {t.loggedInAs} <span className={`font-bold ${textHeading}`}>{currentAgent.name}</span>
            </p>
          </div>
        )}
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════════════
         MAIN WORKSPACE CONTENT CONTAINER
      ═══════════════════════════════════════════════════════════════════════════ */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out min-h-screen
          ml-0 ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}
          overflow-x-hidden min-w-0
        `}
      >
        {/* Top Sticky Header */}
        <header className={`sticky top-0 z-30 h-16 px-4 sm:px-6 border-b backdrop-blur-md flex items-center justify-between gap-3 ${
          isDark ? "bg-slate-950/80 border-slate-800/80" : "bg-white/80 border-slate-200"
        }`}>
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className={`md:hidden p-2 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"} shadow-xs cursor-pointer shrink-0`}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-emerald-500" />
            </button>

            <h1 className={`text-base sm:text-lg font-bold truncate ${textHeading}`}>
              {activeTab === "overview" && t.overviewTab}
              {activeTab === "pipeline" && t.pipelineTab}
              {activeTab === "payments" && t.paymentsTab}
              {activeTab === "guardian" && t.guardianTab}
            </h1>
            <span className="hidden xs:inline text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 truncate">
              Telesales Desk
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={fetchSupabaseData}
              disabled={isLoading}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-500" : ""}`} />
              <span className="hidden sm:inline">{isLoading ? t.syncing : t.refreshDb}</span>
            </button>
          </div>
        </header>

        <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-6">

          {/* ═══════════════════════════════════════════════════════════════════════════
             TAB 1: 📊 OVERVIEW (PERSONAL STATS & KPIS)
          ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Top 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Total Calls Made */}
                <div className={`p-5 rounded-3xl border ${bgCard} relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textSub} uppercase tracking-wider`}>{t.kpiCallsMade}</span>
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={`text-3xl font-black ${textHeading}`}>{totalCallsCount}</div>
                    <p className={`text-[11px] ${textSub} mt-1`}>{t.kpiCallsSub}</p>
                  </div>
                </div>

                {/* Metric 2: Converted Deals */}
                <div className={`p-5 rounded-3xl border ${bgCard} relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textSub} uppercase tracking-wider`}>{t.kpiConvertedDeals}</span>
                    <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{convertedDealsCount}</div>
                    <p className={`text-[11px] ${textSub} mt-1`}>{t.kpiConvertedSub}</p>
                  </div>
                </div>

                {/* Metric 3: Pending Follow-ups */}
                <div className={`p-5 rounded-3xl border ${bgCard} relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textSub} uppercase tracking-wider`}>{t.kpiPendingFollowups}</span>
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{pendingFollowupsCount}</div>
                    <p className={`text-[11px] ${textSub} mt-1`}>{t.kpiPendingSub}</p>
                  </div>
                </div>

                {/* Metric 4: Total Revenue Generated */}
                <div className={`p-5 rounded-3xl border ${bgCard} relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textSub} uppercase tracking-wider`}>{t.kpiTotalRevenue}</span>
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">৳{totalRevenueAmount.toLocaleString()}</div>
                    <p className={`text-[11px] ${textSub} mt-1`}>{t.kpiRevenueSub}</p>
                  </div>
                </div>
              </div>

              {/* Weekly Performance Graph & Target Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Area Chart: Calling & Sales Trend */}
                <div className={`lg:col-span-2 p-6 rounded-3xl border ${bgCard} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-base font-bold ${textHeading}`}>{t.weeklyActivityTitle}</h3>
                      <p className={`text-xs ${textSub}`}>Calls logged vs Converted Sales per day</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t.callsUnit}
                      </span>
                      <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> {t.salesUnit}
                      </span>
                    </div>
                  </div>

                  <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={callingPerformanceData}>
                        <defs>
                          <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                        <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} />
                        <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#0f172a" : "#ffffff",
                            borderColor: isDark ? "#334155" : "#cbd5e1",
                            borderRadius: "1rem",
                            color: isDark ? "#ffffff" : "#000000",
                          }}
                        />
                        <Area type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#callsGrad)" />
                        <Area type="monotone" dataKey="sales" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Target Progress & Quick Stats */}
                <div className={`p-6 rounded-3xl border ${bgCard} flex flex-col justify-between`}>
                  <div>
                    <h3 className={`text-base font-bold ${textHeading}`}>{t.targetProgressTitle}</h3>
                    <p className={`text-xs ${textSub} mt-0.5`}>{t.targetProgressSub}</p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className={textSub}>Quota Achieved</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {Math.min(100, Math.round((totalRevenueAmount / 100000) * 100))}% (৳{totalRevenueAmount.toLocaleString()} / ৳1,00,000)
                          </span>
                        </div>
                        <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.round((totalRevenueAmount / 100000) * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-2xl border space-y-2 ${bgInnerCard}`}>
                        <div className="flex justify-between text-xs">
                          <span className={textSub}>Conversion Rate:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {myLeads.length > 0 ? Math.round((convertedDealsCount / myLeads.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className={textSub}>Average Deal Size:</span>
                          <span className={`font-bold ${textHeading}`}>৳2,500</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className={textSub}>Active Claimed Leads:</span>
                          <span className="font-bold text-teal-600 dark:text-teal-400">{myLeads.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("pipeline")}
                    className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Go to Call Desk & Pipeline →</span>
                  </button>
                </div>
              </div>

              {/* Recent Call Activity Feed */}
              <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                <h3 className={`text-base font-bold ${textHeading}`}>{t.recentCallActivity}</h3>
                <div className="space-y-3">
                  {myLeads.flatMap((l) => l.callNotes.map((n) => ({ ...n, studentName: l.studentName, phone: l.phone }))).length === 0 ? (
                    <p className={`text-xs ${textSub} italic`}>{t.noRecentCalls}</p>
                  ) : (
                    myLeads
                      .flatMap((l) => l.callNotes.map((n) => ({ ...n, studentName: l.studentName, phone: l.phone })))
                      .slice(-5)
                      .reverse()
                      .map((note, idx) => (
                        <div key={idx} className={`p-3.5 rounded-2xl border flex items-start justify-between gap-4 ${bgInnerCard}`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <span>{note.studentName}</span>
                              <span className={textSub}>•</span>
                              <span className={`font-medium ${textSub}`}>{note.phone}</span>
                            </div>
                            <p className={`text-xs ${isDark ? "text-slate-200" : "text-slate-800"}`}>{note.note}</p>
                          </div>
                          <span className={`text-[10px] ${textSub} whitespace-nowrap`}>{note.date}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════
             TAB 2: 📞 LEAD PIPELINE & CALL DESK
          ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "pipeline" && (
            <div className="space-y-8">
              
              {/* SECTION A: UNASSIGNED LEADS POOL */}
              <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{unassignedLeads.length} Available</span>
                    </div>
                    <h2 className={`text-xl font-extrabold ${textHeading}`}>{t.unassignedPoolTitle}</h2>
                    <p className={`text-xs ${textSub}`}>{t.unassignedPoolDesc}</p>
                  </div>
                </div>

                {unassignedLeads.length === 0 ? (
                  <div className={`p-8 text-center rounded-2xl border text-xs ${bgInnerCard} ${textSub}`}>
                    No unassigned leads in the pool right now. All leads are currently claimed!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unassignedLeads.map((lead) => (
                      <div key={lead.id} className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all ${bgInnerCard}`}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                              {lead.source || "Ad Click"}
                            </span>
                            <span className={`text-[10px] ${textSub}`}>{lead.date}</span>
                          </div>
                          <div>
                            <h4 className={`text-base font-bold ${textHeading}`}>{lead.studentName}</h4>
                            <p className={`text-xs ${textSub}`}>Guardian: {lead.parentName}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </p>
                          </div>
                          <div className={`text-xs p-2.5 rounded-xl border font-medium ${isDark ? "text-slate-300 bg-slate-900 border-slate-800" : "text-slate-800 bg-white border-slate-200"}`}>
                            🎓 {lead.courseInterest}
                          </div>
                        </div>

                        <button
                          onClick={() => handleClaimLead(lead.id)}
                          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{t.claimLeadBtn}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION B: MY CLAIMED LEADS DESK */}
              <div className={`p-6 rounded-3xl border ${bgCard} space-y-6`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-xl font-extrabold ${textHeading}`}>{t.myLeadsTitle}</h2>
                    <p className={`text-xs ${textSub}`}>{t.myLeadsDesc}</p>
                  </div>
                </div>

                {/* Filters & Search Controls */}
                <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border ${bgInnerCard}`}>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Ad Click", "Google Form", "Social DM"].map((src) => (
                      <button
                        key={src}
                        onClick={() => setLeadSourceFilter(src)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          leadSourceFilter === src
                            ? "bg-emerald-500 text-white shadow-xs"
                            : isDark
                            ? "bg-slate-900 text-slate-400 hover:text-white"
                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                        }`}
                      >
                        {src === "All" ? t.allSources : src}
                      </button>
                    ))}
                    <div className={`w-px h-6 mx-1 ${isDark ? "bg-slate-800" : "bg-slate-300"}`} />
                    {["All", "In Progress", "Follow-up", "Converted", "Rejected"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setLeadStatusFilter(st)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          leadStatusFilter === st
                            ? "bg-teal-500 text-white shadow-xs"
                            : isDark
                            ? "bg-slate-900 text-slate-400 hover:text-white"
                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                        }`}
                      >
                        {st === "All" ? t.allStatuses : st}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className={`w-4 h-4 absolute left-3.5 top-3 ${textSub}`} />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium ${inputBg}`}
                    />
                  </div>
                </div>

                {/* Leads Grid/Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMyLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`border rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-400 dark:hover:border-slate-700 transition-all shadow-xs ${bgInnerCard}`}
                    >
                      <div>
                        {/* Header Badge */}
                        <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                              lead.status === "Converted"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                                : lead.status === "Follow-up"
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                                : "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-400 border border-teal-300 dark:border-teal-800"
                            }`}
                          >
                            {lead.status === "Converted" && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {lead.status}
                          </span>
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${
                            isDark ? "text-slate-400 bg-slate-900 border-slate-800" : "text-slate-600 bg-white border-slate-200"
                          }`}>
                            {lead.source || "Ad Click"}
                          </span>
                        </div>

                        {/* Student Details */}
                        <div className="mt-4 space-y-1">
                          <h3 className={`text-lg font-bold ${textHeading}`}>{lead.studentName}</h3>
                          <p className={`text-xs ${textSub}`}>
                            {t.parentName}: <span className={`font-semibold ${textHeading}`}>{lead.parentName}</span>
                          </p>
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                            <PhoneCall className="w-3.5 h-3.5" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </p>
                          <div className="text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 px-3 py-1.5 rounded-xl mt-2">
                            🎓 {lead.courseInterest}
                          </div>
                        </div>

                        {/* Call Notes History */}
                        <div className={`mt-4 p-3.5 rounded-2xl border space-y-2 max-h-36 overflow-y-auto ${bgSubCard}`}>
                          <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${textSub}`}>
                            <MessageSquare className="w-3 h-3 text-emerald-500" />
                            {t.callNotesHistory} ({lead.callNotes.length})
                          </div>
                          {lead.callNotes.length === 0 ? (
                            <p className={`text-xs italic ${textSub}`}>{t.noCallNotes}</p>
                          ) : (
                            lead.callNotes.map((note, idx) => (
                              <div key={idx} className={`text-xs p-2 rounded-xl border space-y-0.5 ${
                                isDark ? "text-slate-200 bg-slate-950 border-slate-800/60" : "text-slate-800 bg-slate-50 border-slate-200"
                              }`}>
                                <div className={`flex justify-between text-[10px] ${textSub}`}>
                                  <span>{note.agent}</span>
                                  <span>{note.date}</span>
                                </div>
                                <p>{note.note}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`pt-3 border-t flex flex-wrap gap-2 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                        <button
                          onClick={() => setSelectedLeadForNote(lead)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 border text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                            isDark
                              ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                              : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t.addCallNoteBtn}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedLeadForPayment(lead);
                            setPaymentWhatsappNumber(lead.phone || "");
                            const matchedBatch = batches.find((b) => b.courseTitle === lead.courseInterest) || batches[0];
                            if (matchedBatch) setPaymentSelectedBatchId(matchedBatch.id);
                          }}
                          className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                            lead.paymentConfirmed
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs"
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{lead.paymentConfirmed ? "Paid ✓" : t.confirmPaymentBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════
             TAB 3: 💳 CONFIRM PAYMENTS & SALES
          ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                <div>
                  <h2 className={`text-xl font-extrabold ${textHeading}`}>{t.paymentsTitle}</h2>
                  <p className={`text-xs ${textSub}`}>{t.paymentsSectionDesc}</p>
                </div>

                {/* Form to Confirm Sales Directly */}
                <form onSubmit={handleConfirmPayment} className={`p-6 rounded-2xl border space-y-4 ${bgInnerCard}`}>
                  <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Quick Payment Confirmation Form</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.selectLeadLabel}</label>
                      <select
                        required
                        value={selectedLeadForPayment?.id || ""}
                        onChange={(e) => {
                          const found = myLeads.find((l) => l.id === e.target.value);
                          setSelectedLeadForPayment(found || null);
                          if (found) {
                            setPaymentWhatsappNumber(found.phone || "");
                            const matchedBatch = batches.find((b) => b.courseTitle === found.courseInterest) || batches[0];
                            if (matchedBatch) setPaymentSelectedBatchId(matchedBatch.id);
                          }
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg}`}
                      >
                        <option value="">-- Select Claimed Student Lead --</option>
                        {myLeads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.studentName} ({l.phone}) - {l.courseInterest}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.selectCourseBatchLabel}</label>
                      <select
                        required
                        value={paymentSelectedBatchId}
                        onChange={(e) => setPaymentSelectedBatchId(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${inputBg}`}
                      >
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} - {b.courseTitle} ({b.schedule})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.whatsappNumberLabel}</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. +8801711223344"
                          value={paymentWhatsappNumber}
                          onChange={(e) => setPaymentWhatsappNumber(e.target.value)}
                          className={`w-full px-4 py-2.5 pl-9 rounded-xl text-xs font-mono font-bold text-emerald-400 ${inputBg}`}
                        />
                        <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3 top-3 pointer-events-none" />
                      </div>
                      <p className={`text-[10px] ${textSub} mt-1`}>Direct automated messaging enabled on Teacher Portal.</p>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.paymentMethodLabel}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {["bKash", "Nagad", "Bank", "Cash"].map((m) => (
                          <button
                            type="button"
                            key={m}
                            onClick={() => setPaymentMethod(m)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              paymentMethod === m
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                                : isDark
                                ? "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                                : "bg-white text-slate-600 border-slate-300 hover:text-slate-900"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.amountPaidLabel}</label>
                      <input
                        type="number"
                        required
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.trxIdLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BK928301X or Reference Code"
                      value={paymentTrxId}
                      onChange={(e) => setPaymentTrxId(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${inputBg}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.confirmAndEnrollBtn}</span>
                  </button>
                </form>
              </div>

              {/* Transactions History Table */}
              <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                <h3 className={`text-base font-bold ${textHeading}`}>{t.confirmedBuyersTableTitle}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-xs font-bold ${tableHeaderStyle}`}>
                        <th className="p-3 rounded-l-xl">{t.colStudent}</th>
                        <th className="p-3">{t.colCourseBatch}</th>
                        <th className="p-3">{t.colMethodTrx}</th>
                        <th className="p-3">{t.colAmount}</th>
                        <th className="p-3 rounded-r-xl">{t.colDate}</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y text-xs ${isDark ? "divide-slate-800/60" : "divide-slate-200"}`}>
                      {myLeads
                        .filter((l) => l.paymentConfirmed || l.status === "Converted")
                        .map((b) => (
                          <tr key={b.id} className={`${tableRowHover} transition-colors`}>
                            <td className={`p-3 font-bold ${textHeading}`}>
                              <div>{b.studentName}</div>
                              <div className={`text-[11px] font-normal ${textSub}`}>{b.phone}</div>
                            </td>
                            <td className={`p-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{b.courseInterest}</td>
                            <td className="p-3">
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                                {b.trxId || "BK892310X"}
                              </span>
                            </td>
                            <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">৳{b.paymentAmount || 2500}</td>
                            <td className={`p-3 ${textSub}`}>{b.date}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════
             TAB 4: 👤 GUARDIAN ACCOUNT & MAGIC LINK GENERATOR
          ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "guardian" && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-3xl border ${bgCard} space-y-6`}>
                <div>
                  <h2 className={`text-xl font-extrabold ${textHeading}`}>{t.guardianAccountTitle}</h2>
                  <p className={`text-xs ${textSub}`}>{t.guardianAccountDesc}</p>
                </div>

                {/* Form to create Guardian Account */}
                <form onSubmit={handleCreateGuardianAccount} className={`p-6 rounded-2xl border space-y-4 ${bgInnerCard}`}>
                  <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>{t.registerGuardianFormTitle}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.guardianNameLabel}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samira Sultana"
                        value={guardianNameInput}
                        onChange={(e) => setGuardianNameInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.guardianPhoneLabel}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 01711223344"
                        value={guardianPhoneInput}
                        onChange={(e) => setGuardianPhoneInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.studentNameLabel}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Araf Hossain"
                        value={studentNameInput}
                        onChange={(e) => setStudentNameInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.assignBatchLabel}</label>
                      <select
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg}`}
                      >
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.createAccountBtn}</span>
                  </button>
                </form>

                {/* Newly Generated Shareable Link Card */}
                {generatedLinkInfo && (
                  <div className={`p-6 rounded-2xl border space-y-4 ${
                    isDark ? "bg-emerald-950/40 border-emerald-500/40" : "bg-emerald-50 border-emerald-300"
                  }`}>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3 className="text-base font-bold">{t.magicLinkGeneratedTitle}</h3>
                    </div>
                    <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.magicLinkDesc}</p>

                    <div className={`p-4 rounded-xl border space-y-2 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
                      <div className={`text-xs flex justify-between ${textSub}`}>
                        <span>{t.loginIdLabel} <strong className={textHeading}>{generatedLinkInfo.loginId}</strong></span>
                        <span>{t.tempPassLabel} <strong className={textHeading}>{generatedLinkInfo.tempPass}</strong></span>
                      </div>
                      <div className={`font-mono text-xs break-all p-2 rounded border ${
                        isDark ? "bg-slate-900 border-slate-800 text-emerald-400" : "bg-slate-100 border-slate-200 text-emerald-700 font-bold"
                      }`}>
                        {generatedLinkInfo.link}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => copyToClipboard(generatedLinkInfo.link, "link")}
                        className={`flex-1 inline-flex items-center justify-center gap-2 border text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                          isDark
                            ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                            : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? t.linkCopiedAlert : t.copyLinkBtn}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(generatedLinkInfo.message, "msg")}
                        className={`flex-1 inline-flex items-center justify-center gap-2 border text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                          isDark
                            ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                            : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {copiedMsg ? <Check className="w-4 h-4 text-emerald-500" /> : <MessageCircle className="w-4 h-4 text-teal-500" />}
                        <span>{copiedMsg ? t.msgCopiedAlert : t.copyWhatsAppMsgBtn}</span>
                      </button>

                      <a
                        href={`https://api.whatsapp.com/send?phone=88${generatedLinkInfo.phone}&text=${encodeURIComponent(generatedLinkInfo.message)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        <Send className="w-4 h-4" />
                        <span>{t.openWhatsAppBtn}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Roster of Active Guardian Accounts */}
                <div className="space-y-4">
                  <h3 className={`text-base font-bold ${textHeading}`}>{t.createdGuardiansTableTitle}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-xs font-bold ${tableHeaderStyle}`}>
                          <th className="p-3 rounded-l-xl">Guardian & Student</th>
                          <th className="p-3">WhatsApp / Phone</th>
                          <th className="p-3">Assigned Batch</th>
                          <th className="p-3">Login Credentials</th>
                          <th className="p-3 rounded-r-xl">Share Action</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y text-xs ${isDark ? "divide-slate-800/60" : "divide-slate-200"}`}>
                        {guardianAccounts.map((g) => (
                          <tr key={g.id} className={`${tableRowHover} transition-colors`}>
                            <td className={`p-3 font-bold ${textHeading}`}>
                              <div>{g.guardianName}</div>
                              <div className={`text-[11px] font-normal ${textSub}`}>Student: {g.studentName}</div>
                            </td>
                            <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{g.guardianPhone}</td>
                            <td className={`p-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{g.batchName}</td>
                            <td className={`p-3 font-mono text-[11px] ${textSub}`}>
                              <div>ID: {g.loginId}</div>
                              <div>Pass: {g.tempPass}</div>
                            </td>
                            <td className="p-3">
                              <a
                                href={`https://api.whatsapp.com/send?phone=88${g.guardianPhone}&text=${encodeURIComponent(
                                  `Guardian Direct Portal Link: ${g.magicLink}`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════════
         MODAL 1: ADD CALL NOTE & UPDATE STATUS MODAL
      ═══════════════════════════════════════════════════════════════════════════ */}
      {selectedLeadForNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 ${modalBg}`}>
            <button
              onClick={() => setSelectedLeadForNote(null)}
              className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-lg font-bold ${textHeading}`}>
              {t.addNoteTitle} - {selectedLeadForNote.studentName}
            </h3>
            <p className={`text-xs ${textSub}`}>Phone: {selectedLeadForNote.phone}</p>

            <form onSubmit={handleAddCallNote} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.selectStatusLabel}</label>
                <select
                  value={newNoteStatus}
                  onChange={(e) => setNewNoteStatus(e.target.value as Lead["status"])}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg}`}
                >
                  <option value="Called">Called</option>
                  <option value="Interested">Interested</option>
                  <option value="Follow-up">Call Back / Follow-up</option>
                  <option value="Converted">Converted (Payment Pending)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>Call Summary & Notes</label>
                <textarea
                  rows={4}
                  required
                  placeholder={t.callNotePlaceholder}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 resize-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all text-xs cursor-pointer shadow-md"
              >
                {t.saveNoteBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
         MODAL 2: CONFIRM PAYMENT MODAL
      ═══════════════════════════════════════════════════════════════════════════ */}
      {selectedLeadForPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 ${modalBg}`}>
            <button
              onClick={() => setSelectedLeadForPayment(null)}
              className={`absolute top-4 right-4 ${textSub} hover:${textHeading} cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className={`text-lg font-bold ${textHeading}`}>Payment & Enrollment Confirmation</h3>
            </div>
            <p className={`text-xs ${textSub}`}>
              Student: <strong className={textHeading}>{selectedLeadForPayment.studentName}</strong> ({selectedLeadForPayment.courseInterest})
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-3.5">
              {/* Batch Selection Dropdown */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.selectCourseBatchLabel}</label>
                <select
                  required
                  value={paymentSelectedBatchId}
                  onChange={(e) => setPaymentSelectedBatchId(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${inputBg}`}
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.courseTitle} ({b.schedule})
                    </option>
                  ))}
                </select>
              </div>

              {/* WhatsApp Number Input Field */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.whatsappNumberLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. +8801711223344"
                    value={paymentWhatsappNumber}
                    onChange={(e) => setPaymentWhatsappNumber(e.target.value)}
                    className={`w-full px-4 py-2.5 pl-9 rounded-xl text-xs font-mono font-bold text-emerald-400 ${inputBg}`}
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3 top-3 pointer-events-none" />
                </div>
                <p className={`text-[10px] ${textSub} mt-1`}>Direct automated messaging will be enabled on Teacher Portal.</p>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.paymentMethodLabel}</label>
                <div className="grid grid-cols-4 gap-2">
                  {["bKash", "Nagad", "Bank", "Cash"].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === m
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : isDark
                          ? "bg-slate-950 text-slate-400 border-slate-800"
                          : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.amountPaidLabel}</label>
                  <input
                    type="number"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${textLabel}`}>{t.trxIdLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BK928301X"
                    value={paymentTrxId}
                    onChange={(e) => setPaymentTrxId(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${inputBg}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-all text-xs cursor-pointer shadow-lg"
              >
                {t.confirmAndEnrollBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
