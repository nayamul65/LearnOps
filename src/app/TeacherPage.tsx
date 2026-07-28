import React, { useState } from "react";
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
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

/* ── DATA TYPES ── */
interface Student {
  id: string;
  name: string;
  rollNo: string;
  batch: string;
  phone: string;
  attendanceStatus: "Present" | "Absent" | "Late";
  submittedHwCount: number;
  totalHwCount: number;
  progressPercent: number;
}

interface HomeworkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  batch: string;
  title: string;
  subject: string;
  submittedDate: string;
  dueDate: string;
  submissionUrl?: string;
  submissionNote?: string;
  score: number;
  grade: string;
  feedback: string;
  status: "Graded" | "Pending";
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: "submission" | "deadline" | "attendance" | "system";
  read: boolean;
}

/* ── INITIAL MOCK DATA ── */
const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-1",
    name: "আরাফ হোসেন",
    rollNo: "০১",
    batch: "ব্যাচ ০১ (সকাল ১০:০০)",
    phone: "+8801712345678",
    attendanceStatus: "Present",
    submittedHwCount: 5,
    totalHwCount: 5,
    progressPercent: 96,
  },
  {
    id: "std-2",
    name: "তাহিয়া রহমান",
    rollNo: "০২",
    batch: "ব্যাচ ০১ (সকাল ১০:০০)",
    phone: "+8801812345678",
    attendanceStatus: "Present",
    submittedHwCount: 4,
    totalHwCount: 5,
    progressPercent: 88,
  },
  {
    id: "std-3",
    name: "সামিন চৌধুরী",
    rollNo: "০৩",
    batch: "ব্যাচ ০২ (বিকেল ৪:০০)",
    phone: "+8801912345678",
    attendanceStatus: "Late",
    submittedHwCount: 3,
    totalHwCount: 5,
    progressPercent: 72,
  },
  {
    id: "std-4",
    name: "তানভীর আহম্মেদ",
    rollNo: "০৪",
    batch: "ব্যাচ ০২ (বিকেল ৪:০০)",
    phone: "+8801612345678",
    attendanceStatus: "Absent",
    submittedHwCount: 2,
    totalHwCount: 5,
    progressPercent: 55,
  },
  {
    id: "std-5",
    name: "নুসাইবা পারভীন",
    rollNo: "০৫",
    batch: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)",
    phone: "+8801512345678",
    attendanceStatus: "Present",
    submittedHwCount: 5,
    totalHwCount: 5,
    progressPercent: 92,
  },
  {
    id: "std-6",
    name: "রাফিদ আল হাসান",
    rollNo: "০৬",
    batch: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)",
    phone: "+8801312345678",
    attendanceStatus: "Present",
    submittedHwCount: 4,
    totalHwCount: 5,
    progressPercent: 84,
  },
];

const INITIAL_HOMEWORKS: HomeworkSubmission[] = [
  {
    id: "hw-1",
    studentId: "std-1",
    studentName: "আরাফ হোসেন",
    batch: "ব্যাচ ০১ (সকাল ১০:০০)",
    subject: "সুন্দর হাতের লেখা",
    title: "মাত্রা ও বর্ণমালা সোজা রাখার অনুশীলন (পৃষ্ঠা ৪)",
    submittedDate: "2026-07-27",
    dueDate: "2026-07-28",
    submissionUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
    submissionNote: "স্যার, পৃষ্ঠা ৪ এবং ৫ এর সম্পূর্ণ হাতের লেখা জমা দিলাম।",
    score: 95,
    grade: "A+",
    feedback: "খুব সুন্দর ও পরিচ্ছন্ন হয়েছে! লাইন পুরো সোজা রাখা শিখেছো।",
    status: "Graded",
  },
  {
    id: "hw-2",
    studentId: "std-2",
    studentName: "তাহিয়া রহমান",
    batch: "ব্যাচ ০১ (সকাল ১০:০০)",
    subject: "স্পিড রাইটিং",
    title: "দ্রুত লেখার স্পিড টেস্ট ১ (১ মিনিটে ৩০ শব্দ)",
    submittedDate: "2026-07-28",
    dueDate: "2026-07-29",
    submissionUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600",
    submissionNote: "টাইমার সেট করে ৩০টি শব্দ অনুশীলন করেছি।",
    score: 88,
    grade: "A",
    feedback: "স্পিড চমৎকার, যুক্তবর্ণ গঠনে আরও একটু সময় নাও।",
    status: "Graded",
  },
  {
    id: "hw-3",
    studentId: "std-3",
    studentName: "সামিন চৌধুরী",
    batch: "ব্যাচ ০২ (বিকেল ৪:০০)",
    subject: "স্বরবর্ণ ও কারেকশন",
    title: "পেন্সিল গ্রিপ ও স্বরবর্ণ কারেকশন অনুশীলন",
    submittedDate: "2026-07-28",
    dueDate: "2026-07-29",
    submissionUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600",
    submissionNote: "পেন্সিল ধরে অ আ ই উ অনুশীলন ছবি তুলে পাঠালাম।",
    score: 0,
    grade: "-",
    feedback: "",
    status: "Pending",
  },
  {
    id: "hw-4",
    studentId: "std-5",
    studentName: "নুসাইবা পারভীন",
    batch: "ব্যাচ ০৩ (সন্ধ্যা ৭:০০)",
    subject: "যুক্তবর্ণ চর্চা",
    title: "ক্ব, ক্ত, গ্ধ এবং ঙ্ক লেখার সঠিক নিয়মাবলী",
    submittedDate: "2026-07-28",
    dueDate: "2026-07-30",
    submissionUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
    submissionNote: "যুক্তবর্ণগুলো ৫ বার করে লিখে জমা দিলাম।",
    score: 0,
    grade: "-",
    feedback: "",
    status: "Pending",
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "নুসাইবা পারভীন 'যুক্তবর্ণ চর্চা' হোমওয়ার্ক জমা দিয়েছে।",
    time: "১০ মিনিট আগে",
    type: "submission",
    read: false,
  },
  {
    id: "notif-2",
    title: "সামিন চৌধুরী 'পেন্সিল গ্রিপ' হোমওয়ার্ক জমা দিয়েছে।",
    time: "৪৫ মিনিট আগে",
    type: "submission",
    read: false,
  },
  {
    id: "notif-3",
    title: "ব্যাচ ০২-এর হোমওয়ার্কের সময়সীমা আজ রাত ১২টায় শেষ হবে।",
    time: "২ ঘণ্টা আগে",
    type: "deadline",
    read: true,
  },
  {
    id: "notif-4",
    title: "তানভীর আহম্মেদ আজকের ক্লাসে অনুপস্থিত ছিলেন।",
    time: "৩ ঘণ্টা আগে",
    type: "attendance",
    read: true,
  },
];

export default function TeacherPage() {
  const { t, isEnglish } = useLanguage();

  /* ── STATES ── */
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [homeworks, setHomeworks] = useState<HomeworkSubmission[]>(INITIAL_HOMEWORKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"students" | "queue" | "assign" | "attendance" | "stats" | "notifs">("students");

  /* Filter & Search States */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("সকল ব্যাচ");
  const [queueFilter, setQueueFilter] = useState<"all" | "pending" | "graded">("pending");

  /* Homework Modal & WhatsApp State */
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [newHwBatch, setNewHwBatch] = useState("ব্যাচ ০১ (সকাল ১০:০০)");
  const [newHwSubject, setNewHwSubject] = useState("বাংলা সুন্দর হাতের লেখা");
  const [newHwTitle, setNewHwTitle] = useState("");
  const [newHwDesc, setNewHwDesc] = useState("");
  const [newHwDueDate, setNewHwDueDate] = useState("2026-07-30");
  const [newHwPhone, setNewHwPhone] = useState("");
  const [generatedWaLink, setGeneratedWaLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

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

    setHomeworks((prev) =>
      prev.map((hw) =>
        hw.id === selectedHw.id
          ? {
              ...hw,
              score: scoreNum,
              grade: gradeLetter,
              feedback: feedbackInput || "খুব সুন্দর চেষ্টা করা হয়েছে!",
              status: "Graded",
            }
          : hw
      )
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${selectedHw.studentName}-এর হোমওয়ার্ক গ্রেডিং সম্পন্ন করা হয়েছে (${scoreNum}/১০০)।`,
        time: "এইমাত্র",
        type: "submission",
        read: false,
      },
      ...prev,
    ]);

    setSelectedHw(null);
  };

  const handleAssignHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle) return;

    const messageText = `📚 *LearnOps - নতুন হোমওয়ার্ক অ্যাসাইনমেন্ট* 📚\n\n📌 *বিষয়:* ${newHwSubject}\n📖 *শিরোনাম:* ${newHwTitle}\n👥 *ব্যাচ:* ${newHwBatch}\n📝 *দিকনির্দেশনা:* ${newHwDesc || "নিয়মিত অনুশীলন করে জমা দিন।"}\n⏰ *জমার শেষ তারিখ:* ${newHwDueDate}\n\n🔗 *জমা দিন এখানে:* https://learnops.app/homework/submit`;

    const encodedMsg = encodeURIComponent(messageText);
    const waUrl = newHwPhone
      ? `https://api.whatsapp.com/send?phone=${newHwPhone.replace(/[^0-9]/g, "")}&text=${encodedMsg}`
      : `https://api.whatsapp.com/send?text=${encodedMsg}`;

    setGeneratedWaLink(waUrl);

    // Also add to homework list as sample pending
    const newEntry: HomeworkSubmission = {
      id: `hw-${Date.now()}`,
      studentId: "std-new",
      studentName: `${newHwBatch} (নতুন অ্যাসাইনমেন্ট)`,
      batch: newHwBatch,
      subject: newHwSubject,
      title: newHwTitle,
      submittedDate: new Date().toISOString().split("T")[0],
      dueDate: newHwDueDate,
      submissionNote: newHwDesc,
      score: 0,
      grade: "-",
      feedback: "",
      status: "Pending",
    };

    setHomeworks((prev) => [newEntry, ...prev]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  /* Filtered Lists */
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery);
    const matchesBatch =
      selectedBatch === "সকল ব্যাচ" || s.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const filteredHomeworkQueue = homeworks.filter((hw) => {
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
                <span>{isEnglish ? "Teacher & Mentor Portal" : "শিক্ষক ও মেন্টর ড্যাশবোর্ড"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Teacher Management & Homework Center" : "১-ক্লিক উপস্থিতি, হোমওয়ার্ক ও হোয়াটসঅ্যাপ হাব"}
              </h1>
              <p className="text-amber-100 text-sm mt-1 flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <span>{isEnglish ? "LoggedIn Mentor:" : "লগইনকৃত শিক্ষকের নাম:"}</span>
                <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-md">রাহেলা খাতুন (প্রধান মেন্টর)</span>
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <PlusCircle className="w-4 h-4 text-amber-700" />
                <span>{isEnglish ? "Assign & Share Homework" : "নতুন হোমওয়ার্ক অ্যাসাইন করুন"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TOP STATS / WIDGETS SECTION (4 CARDS) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Stat 1: Assigned Students */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                মোট অর্পিত শিক্ষার্থী
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {totalStudents} <span className="text-sm font-normal text-muted-foreground">জন</span>
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> ৩টি ব্যাচ
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              সক্রিয় শিক্ষার্থী সংখ্যা
            </p>
          </div>

          {/* Stat 2: Pending Homework */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                বাকি থাকা হোমওয়ার্ক
              </span>
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-amber-600 dark:text-amber-500" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {pendingHwCount} <span className="text-sm font-normal text-muted-foreground">টি</span>
              </h2>
              <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md">
                রিভিউ প্রয়োজন
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              শিক্ষার্থীদের জমা দেওয়া ফাইল
            </p>
          </div>

          {/* Stat 3: Reviewed Homework */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                যাচাইকৃত হোমওয়ার্ক
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {reviewedHwCount} <span className="text-sm font-normal text-muted-foreground">টি</span>
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                গ্রেডিং সম্পন্ন
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              মূল্যায়ন করা অ্যাসাইনমেন্ট
            </p>
          </div>

          {/* Stat 4: Student Progress */}
          <div className="bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                সামগ্রিক অগ্রগতি
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {avgProgress}%
              </h2>
              <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                চমৎকার
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

        {/* ── MAIN DASHBOARD NAVIGATION TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-border/60">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "students"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <Users className="w-4 h-4" />
            <span>শিক্ষার্থী তালিকা ({totalStudents})</span>
          </button>

          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 relative ${
              activeTab === "queue"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <FileCheck className="w-4 h-4" />
            <span>হোমওয়ার্ক রিভিউ কিউ</span>
            {pendingHwCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center ml-1">
                {pendingHwCount}
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
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <UserCheck className="w-4 h-4" />
            <span>১-ক্লিক উপস্থিতি</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "stats"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>পারফরম্যান্স পরিসংখ্যান</span>
          </button>

          <button
            onClick={() => setActiveTab("notifs")}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 relative ${
              activeTab === "notifs"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <Bell className="w-4 h-4" />
            <span>নোটিফিকেশন</span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 ml-1 animate-pulse" />
            )}
          </button>
        </div>

        {/* ── SECTION A: STUDENT LIST (শিক্ষার্থী তালিকা) ── */}
        {activeTab === "students" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  অর্পিত শিক্ষার্থীদের তালিকা
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search Box */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="শিক্ষার্থীর নাম বা রোল দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>

                {/* Batch Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <option value="সকল ব্যাচ">সকল ব্যাচ</option>
                    <option value="ব্যাচ ০১ (সকাল ১০:০০)">ব্যাচ ০১ (সকাল ১০:০০)</option>
                    <option value="ব্যাচ ০২ (বিকেল ৪:০০)">ব্যাচ ০২ (বিকেল ৪:০০)</option>
                    <option value="ব্যাচ ০৩ (সন্ধ্যা ৭:০০)">ব্যাচ ০৩ (সন্ধ্যা ৭:০০)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students Table / Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="py-3 px-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>রোল ও নাম</th>
                    <th className="py-3 px-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>ব্যাচ</th>
                    <th className="py-3 px-4 text-center" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আজকের উপস্থিতি</th>
                    <th className="py-3 px-4 text-center" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>হোমওয়ার্ক সম্পন্ন</th>
                    <th className="py-3 px-4 text-center" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অগ্রগতি</th>
                    <th className="py-3 px-4 text-right" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>যোগাযোগ (WhatsApp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-muted/30 transition-colors">
                      
                      {/* Name & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center">
                            #{std.rollNo}
                          </span>
                          <div>
                            <span className="font-bold text-foreground text-sm block" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                              {std.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{std.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {std.batch}
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
                          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          {std.attendanceStatus === "Present" && <CheckCircle2 className="w-3 h-3" />}
                          {std.attendanceStatus === "Late" && <Clock className="w-3 h-3" />}
                          {std.attendanceStatus === "Absent" && <XCircle className="w-3 h-3" />}
                          {std.attendanceStatus === "Present" ? "উপস্থিত" : std.attendanceStatus === "Late" ? "লেট" : "অনুপস্থিত"}
                        </span>
                      </td>

                      {/* Homework Ratio */}
                      <td className="py-3.5 px-4 text-center font-bold text-foreground">
                        {std.submittedHwCount}/{std.totalHwCount} টি
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-28 mx-auto">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span>{std.progressPercent}%</span>
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
                          href={`https://api.whatsapp.com/send?phone=${std.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(`প্রিয় ${std.name}, LearnOps থেকে আপনার হোমওয়ার্ক সংক্রান্ত আপডেট পাঠাচ্ছি।`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কোন শিক্ষার্থী পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SECTION B: HOMEWORK REVIEW QUEUE (হোমওয়ার্ক রিভিউ কিউ) ── */}
        {activeTab === "queue" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <FileCheck className="w-5 h-5 text-amber-600" />
                  হোমওয়ার্ক রিভিউ কিউ (Grading Queue)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  শিক্ষার্থীদের জমা দেওয়া হোমওয়ার্ক ফাইল দেখুন, নম্বর দিন এবং শিক্ষকের ফিডব্যাক প্রদান করুন।
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
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  অপেক্ষমাণ ({homeworks.filter((h) => h.status === "Pending").length})
                </button>
                <button
                  onClick={() => setQueueFilter("graded")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    queueFilter === "graded"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  যাচাইকৃত ({homeworks.filter((h) => h.status === "Graded").length})
                </button>
                <button
                  onClick={() => setQueueFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    queueFilter === "all"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  সকল ({homeworks.length})
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
                        <h4 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                          {hw.studentName}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">{hw.batch}</p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          hw.status === "Graded"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {hw.status === "Graded" ? `গ্রেড: ${hw.grade} (${hw.score}/১০০)` : "অপেক্ষমাণ"}
                      </span>
                    </div>

                    {/* Homework Title */}
                    <div className="mb-3">
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md mb-1 inline-block">
                        {hw.subject}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {hw.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        জমার তারিখ: {hw.submittedDate} | ডেডলাইন: {hw.dueDate}
                      </p>
                    </div>

                    {/* Submission Attachment / Note Preview */}
                    {hw.submissionNote && (
                      <div className="bg-background border border-border p-3 rounded-xl text-xs text-foreground/80 mb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        <span className="font-bold block text-muted-foreground text-[10px] mb-0.5">শিক্ষার্থীর নোট:</span>
                        "{hw.submissionNote}"
                      </div>
                    )}

                    {hw.submissionUrl && (
                      <button
                        onClick={() => setPreviewImage(hw.submissionUrl || null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 mb-4 cursor-pointer"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>জমা দেওয়া ফাইল/ছবি প্রিভিউ করুন 🖼️</span>
                      </button>
                    )}

                    {/* Teacher Feedback (if graded) */}
                    {hw.feedback && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 mb-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        <span className="font-bold block text-[10px] text-emerald-700 dark:text-emerald-400 mb-0.5">শিক্ষকের ফিডব্যাক:</span>
                        "{hw.feedback}"
                      </div>
                    )}
                  </div>

                  {/* Grading Action */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedHw(hw);
                        setScoreInput(hw.score ? String(hw.score) : "90");
                        setFeedbackInput(hw.feedback || "");
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <Award className="w-4 h-4" />
                      <span>{hw.status === "Graded" ? "গ্রেড সম্পাদন করুন" : "মূল্যায়ন ও নম্বর দিন (যাচাই সম্পন্ন)"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredHomeworkQueue.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                এই ক্যাটাগরিতে কোনো হোমওয়ার্ক পাওয়া যায়নি।
              </div>
            )}
          </div>
        )}

        {/* ── SECTION C: 1-CLICK ATTENDANCE (১-ক্লিক উপস্থিতি) ── */}
        {activeTab === "attendance" && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  আজকের ক্লাসের ১-ক্লিক উপস্থিতি রেজিস্টার
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  তারিখ: {new Date().toLocaleDateString("bn-BD")} | ১-ক্লিকে শিক্ষার্থীকে উপস্থিত, লেট বা অনুপস্থিত চিহ্নিত করুন।
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                  উপস্থিত: {students.filter((s) => s.attendanceStatus === "Present").length} জন
                </span>
                <span className="text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                  লেট: {students.filter((s) => s.attendanceStatus === "Late").length} জন
                </span>
                <span className="text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                  অনুপস্থিত: {students.filter((s) => s.attendanceStatus === "Absent").length} জন
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
                      #{student.rollNo}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {student.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">{student.batch}</p>
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
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      উপস্থিত
                    </button>

                    <button
                      onClick={() => toggleAttendance(student.id, "Late")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        student.attendanceStatus === "Late"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      লেট
                    </button>

                    <button
                      onClick={() => toggleAttendance(student.id, "Absent")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        student.attendanceStatus === "Absent"
                          ? "bg-red-500 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      অনুপস্থিত
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION D: PERFORMANCE STATISTICS (পারফরম্যান্স পরিসংখ্যান) ── */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <TrendingUp className="w-5 h-5 text-amber-600" />
                ব্যাচভিত্তিক হোমওয়ার্ক ও পারফরম্যান্স পরিসংখ্যান
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Batch 01 Stats */}
                <div className="bg-muted/30 border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      ব্যাচ ০১ (সকাল ১০:০০)
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      ৯২% সম্পন্ন
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">মোট শিক্ষার্থী: ২০ জন</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    <div className="flex justify-between"><span>গড় নম্বর:</span> <span className="font-bold text-foreground">৯১/১০০</span></div>
                    <div className="flex justify-between"><span>উপস্থিতির হার:</span> <span className="font-bold text-foreground">৯৫%</span></div>
                  </div>
                </div>

                {/* Batch 02 Stats */}
                <div className="bg-muted/30 border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      ব্যাচ ০২ (বিকেল ৪:০০)
                    </h3>
                    <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      ৮৪% সম্পন্ন
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">মোট শিক্ষার্থী: ১৫ জন</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "84%" }} />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    <div className="flex justify-between"><span>গড় নম্বর:</span> <span className="font-bold text-foreground">৮৪/১০০</span></div>
                    <div className="flex justify-between"><span>উপস্থিতির হার:</span> <span className="font-bold text-foreground">৮৮%</span></div>
                  </div>
                </div>

                {/* Batch 03 Stats */}
                <div className="bg-muted/30 border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      ব্যাচ ০৩ (সন্ধ্যা ৭:০০)
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                      ৭৮% সম্পন্ন
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">মোট শিক্ষার্থী: ১৩ জন</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }} />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    <div className="flex justify-between"><span>গড় নম্বর:</span> <span className="font-bold text-foreground">৭৯/১০০</span></div>
                    <div className="flex justify-between"><span>উপস্থিতির হার:</span> <span className="font-bold text-foreground">৮২%</span></div>
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
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Bell className="w-5 h-5 text-amber-600" />
                সাম্প্রতিক নোটিফিকেশন ও অ্যালার্ট
              </h2>
              <button
                onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                সব পড়া হয়েছে চিহ্নিত করুন
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
                    <p className="text-xs sm:text-sm font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      {notif.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground mt-1 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── ASSIGN HOMEWORK & WHATSAPP INTEGRATION MODAL ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  নতুন হোমওয়ার্ক অ্যাসাইনমেন্ট
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
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  ব্যাচ / ক্লাসের নাম *
                </label>
                <select
                  value={newHwBatch}
                  onChange={(e) => setNewHwBatch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <option value="ব্যাচ ০১ (সকাল ১০:০০)">ব্যাচ ০১ (সকাল ১০:০০)</option>
                  <option value="ব্যাচ ০২ (বিকেল ৪:০০)">ব্যাচ ০২ (বিকেল ৪:০০)</option>
                  <option value="ব্যাচ ০৩ (সন্ধ্যা ৭:০০)">ব্যাচ ০৩ (সন্ধ্যা ৭:০০)</option>
                </select>
              </div>

              {/* Subject & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    বিষয় *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHwSubject}
                    onChange={(e) => setNewHwSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    জমার শেষ তারিখ (Due Date) *
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
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  হোমওয়ার্কের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মাত্রা ও বর্ণমালা সোজা রাখার অনুশীলন (পৃষ্ঠা ৪)"
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  বিস্তারিত দিকনির্দেশনা (ঐচ্ছিক)
                </label>
                <textarea
                  rows={3}
                  placeholder="যেমন: খাতায় স্কেল দিয়ে মার্জিন টেনে ৪ ও ৫ পৃষ্ঠা সম্পূর্ণ লিখবে..."
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-amber-500 resize-none"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              {/* Optional Direct Student Phone */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  নির্দিষ্ট শিক্ষার্থীর হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: +8801712345678 (খালি রাখলে গ্রুপিং মেসেজ জেনারেট হবে)"
                  value={newHwPhone}
                  onChange={(e) => setNewHwPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer shadow-md text-xs sm:text-sm"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Share2 className="w-4 h-4" />
                <span>হোমওয়ার্ক অ্যাসাইন এবং হোয়াটসঅ্যাপ লিংক জেনারেট করুন</span>
              </button>
            </form>

            {/* Generated WhatsApp Share Link Component */}
            {generatedWaLink && (
              <div className="mt-6 pt-4 border-t border-border bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  হোয়াটসঅ্যাপ লিংক সফলভাবে তৈরি হয়েছে!
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
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "কপি হয়েছে!" : "কপি"}</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={generatedWaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>হোয়াটসঅ্যাপে ওপেন করুন & পাঠান</span>
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
            <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              হোমওয়ার্ক মূল্যায়ন - {selectedHw.studentName}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{selectedHw.title}</p>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  স্কোর / নম্বর (১০০ এর মধ্যে) *
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
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  শিক্ষকের ফিডব্যাক ও মন্তব্য
                </label>
                <textarea
                  rows={3}
                  placeholder="যেমন: লেখা খুব সুন্দর হয়েছে, স্বরবর্ণগুলোতে আরেকটু মনোযোগী হও..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHw(null)}
                  className="flex-1 bg-muted text-muted-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-all text-xs cursor-pointer"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all text-xs cursor-pointer shadow-md"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  গ্রেড ও নম্বর জমা দিন (যাচাই সম্পন্ন) ✓
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
