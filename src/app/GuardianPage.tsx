import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Video,
  CheckCircle2,
  Award,
  FileText,
  Download,
  Shield,
  RefreshCw,
  BookOpen,
  Star,
  MessageCircle,
  LogOut,
  UserCheck,
  Clock,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { getBatchZoomInfo, subscribeToBatchUpdates } from "../services/batchStore";
import { getAttendanceRate, subscribeToAttendanceUpdates } from "../services/attendanceStore";
import { getStoredAssignments, getLatestGrade, subscribeToHomeworkUpdates, HomeworkGrade } from "../services/homeworkStore";
import { findGuardianByPhoneOrId, getStoredGuardians, subscribeToGuardianUpdates, GuardianAccountRecord } from "../services/guardianStore";
import { supabase } from "../lib/supabase";

/* ── ERROR BOUNDARY CLASS COMPONENT ── */
class GuardianErrorBoundary extends React.Component<
  { children: React.ReactNode; isEnglish: boolean },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("GuardianPage ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {this.props.isEnglish ? "Guardian Portal Notice" : "গার্জিয়ান পোর্টাল নোটিশ"}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {this.props.isEnglish
                ? "An issue occurred while loading your profile session. Please refresh or contact support."
                : "আপনার প্রফাইল সেশন লোড করার সময় একটি সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে পেজ রিফ্রেশ করুন।"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer shadow-md hover:opacity-90 transition-all"
            >
              {this.props.isEnglish ? "Reload Portal" : "পোর্টাল রিফ্রেশ করুন"}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── MAIN GUARDIAN PAGE CONTENT ── */
function GuardianPageContent() {
  let isEnglish = false;
  try {
    const langCtx = useLanguage();
    if (langCtx?.isEnglish !== undefined) {
      isEnglish = langCtx.isEnglish;
    }
  } catch (e) {
    // context fallback
  }

  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // Active guardian account from Magic Link URL params or localStorage session
  const [activeGuardian, setActiveGuardian] = useState<GuardianAccountRecord | null>(() => {
    try {
      const params = new URLSearchParams(location.search);
      const phone = params.get("phone");
      const studentId = params.get("student_id") || params.get("student");
      const loginId = params.get("login_id");

      const query = phone || studentId || loginId;
      if (query) {
        const found = findGuardianByPhoneOrId(query);
        if (found) {
          localStorage.setItem("learnops_guardian_session", JSON.stringify(found));
          return found;
        }
      }

      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("learnops_guardian_session");
        if (raw) {
          try {
            return JSON.parse(raw);
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error("Error reading guardian session:", err);
    }

    const stored = getStoredGuardians();
    return (stored && stored.length > 0) ? stored[0] : null;
  });

  const currentStudentId = activeGuardian?.id || "std-1";

  const studentInfo = {
    studentId: currentStudentId,
    studentName: activeGuardian?.studentName || (isEnglish ? "Student" : "শিক্ষার্থী"),
    studentNameEN: activeGuardian?.studentName || "Student",
    guardianName: activeGuardian?.guardianName || (isEnglish ? "Guardian" : "অভিভাবক"),
    courseName: activeGuardian?.batchName || (isEnglish ? "Assigned Course & Batch" : "নির্ধারিত কোর্স ও ব্যাচ"),
    courseNameEN: activeGuardian?.batchName || "Assigned Course & Batch",
    totalClasses: 16,
    teacherPhone: "8801711223344",
  };

  // ── LIVE STATE from stores & Supabase (Strictly Scoped by Student ID) ──
  const initialZoomInfo = getBatchZoomInfo(activeGuardian?.batchId);
  const [zoomLink, setZoomLink] = useState(() => initialZoomInfo?.zoomLink || "");
  const [zoomSchedule, setZoomSchedule] = useState(() => initialZoomInfo?.zoomSchedule || (isEnglish ? "No live class scheduled yet" : "কোনো লাইভ ক্লাস এখনও নির্ধারিত হয়নি"));
  const [zoomScheduleEN, setZoomScheduleEN] = useState(() => initialZoomInfo?.zoomScheduleEN || "No live class scheduled yet");
  const [attendanceRate, setAttendanceRate] = useState<number | null>(() => getAttendanceRate(currentStudentId));
  const [assignments, setAssignments] = useState(() => getStoredAssignments() || []);
  const [latestGrade, setLatestGrade] = useState<HomeworkGrade | null>(() => getLatestGrade(currentStudentId));
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

  // Strict Per-Student Data Fetching from Supabase & Stores
  useEffect(() => {
    async function fetchLiveSupabaseData() {
      if (!currentStudentId) return;

      try {
        // 1. Query Supabase attendance_logs for this specific student
        const { data: attData } = await supabase
          .from("attendance_logs")
          .select("status")
          .eq("student_id", currentStudentId);

        if (attData && attData.length > 0) {
          const present = attData.filter((r) => r.status === "Present" || r.status === "Late").length;
          setAttendanceRate(Math.round((present / attData.length) * 100));
        }

        // 2. Query Supabase homework_submissions for this specific student
        const { data: hwData } = await supabase
          .from("homework_submissions")
          .select("*")
          .eq("student_id", currentStudentId)
          .eq("status", "Graded")
          .order("submitted_date", { ascending: false })
          .limit(1);

        if (hwData && hwData.length > 0) {
          const g = hwData[0];
          setLatestGrade({
            assignmentId: g.assignment_id,
            studentId: g.student_id,
            studentName: g.student_name,
            score: g.score,
            grade: g.grade,
            feedback: g.feedback,
            status: g.status,
            submittedDate: g.submitted_date,
          });
        }

        // 3. Query Supabase batch for Zoom info assigned to activeGuardian.batchId
        if (activeGuardian?.batchId) {
          const { data: bData } = await supabase
            .from("batches")
            .select("zoom_link, zoom_schedule")
            .eq("id", activeGuardian.batchId)
            .maybeSingle();

          if (bData && bData.zoom_link) {
            setZoomLink(bData.zoom_link);
            setZoomSchedule(bData.zoom_schedule || (isEnglish ? "Live Zoom Class" : "লাইভ জুম ক্লাস"));
            setZoomScheduleEN(bData.zoom_schedule || "Live Zoom Class");
          }
        }
      } catch (err) {
        console.error("Error fetching live student data from Supabase:", err);
      }
    }

    fetchLiveSupabaseData();

    // Subscribe to live store updates
    const unsubBatch = subscribeToBatchUpdates((batches) => {
      const targetBatch = (batches || []).find((b) => String(b.id) === String(activeGuardian?.batchId)) || (batches || [])[0];
      if (targetBatch && targetBatch.zoomLink) {
        setZoomLink(targetBatch.zoomLink);
        setZoomSchedule(targetBatch.zoomSchedule || (isEnglish ? "Live Zoom Class" : "লাইভ জুম ক্লাস"));
        setZoomScheduleEN(targetBatch.zoomScheduleEN || "Live Zoom Class");
        setLastRefresh(new Date().toLocaleTimeString());
      }
    });

    const unsubAttendance = subscribeToAttendanceUpdates(() => {
      setAttendanceRate(getAttendanceRate(currentStudentId));
      setLastRefresh(new Date().toLocaleTimeString());
    });

    const unsubHomework = subscribeToHomeworkUpdates((store) => {
      setAssignments(store?.assignments || []);
      setLatestGrade(getLatestGrade(currentStudentId));
      setLastRefresh(new Date().toLocaleTimeString());
    });

    const unsubGuardian = subscribeToGuardianUpdates((guardians) => {
      const currentRaw = localStorage.getItem("learnops_guardian_session");
      if (currentRaw) {
        try {
          const parsed = JSON.parse(currentRaw);
          const updated = (guardians || []).find((g) => g.id === parsed.id || g.guardianPhone === parsed.guardianPhone || g.loginId === parsed.loginId);
          if (updated) {
            setActiveGuardian(updated);
            setLastRefresh(new Date().toLocaleTimeString());
          }
        } catch (e) {}
      }
    });

    return () => { unsubBatch(); unsubAttendance(); unsubHomework(); unsubGuardian(); };
  }, [currentStudentId, activeGuardian?.batchId]);

  const handleLogout = () => {
    localStorage.removeItem("learnops_guardian_session");
    navigate("/login");
  };

  const hasAttendance = attendanceRate !== null;
  const attendedClasses = hasAttendance ? Math.round(((attendanceRate || 0) / 100) * studentInfo.totalClasses) : 0;

  const hasGrades = latestGrade !== null;
  const displayGrade = hasGrades ? latestGrade.grade : "N/A";
  const displayScore = hasGrades ? `${latestGrade.score}` : "N/A";
  const displayFeedback = (hasGrades && latestGrade.feedback)
    ? latestGrade.feedback
    : (isEnglish
      ? "Teacher comments will appear here after the first assessment."
      : "প্রথম মূল্যায়নের পর শিক্ষকের মন্তব্য এখানে প্রদর্শিত হবে।");

  const handlePrintReport = () => window.print();

  const handleWhatsAppHomework = (assignmentTitle: string) => {
    const msg = isEnglish
      ? `📚 Homework Submission - ${assignmentTitle}\n\nStudent: ${studentInfo.studentNameEN}\nSubmission attached.`
      : `📚 হোমওয়ার্ক জমা দেওয়া হচ্ছে - ${assignmentTitle}\n\nছাত্র: ${studentInfo.studentName}\nসাবমিশন সংযুক্ত।`;
    const url = `https://wa.me/${studentInfo.teacherPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // Loader state check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
          {isEnglish ? "Loading Guardian Dashboard..." : "গার্জিয়ান ড্যাশবোর্ড লোড হচ্ছে..."}
        </p>
      </div>
    );
  }

  // Handle no enrollment or pending account cleanly
  if (!activeGuardian || !activeGuardian.paymentConfirmed || activeGuardian.status === "Pending") {
    const guardianName = activeGuardian?.guardianName || (isEnglish ? "Guardian" : "অভিভাবক");
    const studentName = activeGuardian?.studentName || (isEnglish ? "Student" : "শিক্ষার্থী");
    const batchName = activeGuardian?.batchName || (isEnglish ? "Assigned Course & Batch" : "নির্ধারিত কোর্স ও ব্যাচ");

    return (
      <div className="min-h-screen bg-background pt-8 sm:pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Sync & Session Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-foreground">
                {isEnglish ? `Guardian: ${guardianName}` : `অভিভাবক: ${guardianName}`}
              </span>
              <span className="text-muted-foreground">({studentName})</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-bold ml-2 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                {isEnglish ? "Logout" : "লগ আউট"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 opacity-60" />
              <span>{isEnglish ? `Status Check · ${lastRefresh}` : `স্ট্যাটাস চেক · ${lastRefresh}`}</span>
            </div>
          </div>

          {/* Clean Pending Workspace Card */}
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-inner">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {isEnglish
                  ? "Welcome! No course enrollments confirmed yet"
                  : "স্বাগতম! কোনো সক্রিয় কোর্স এনরোলমেন্ট কনফার্মড হয়নি"}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isEnglish
                  ? `Welcome! No active course enrollments found for student ${studentName}. Your active batches, class schedule, and live portal access will appear here once payment confirmation is completed.`
                  : `স্বাগতম! শিক্ষার্থী ${studentName}-এর কোনো সক্রিয় কোর্স এনরোলমেন্ট পাওয়া যায়নি। সেলস পেমেন্ট ভেরিফিকেশনের পর আপনার সক্রিয় ব্যাচ ও ক্লাস পোর্টাল এখানে প্রদর্শিত হবে।`}
              </p>
            </div>

            {/* Account Details Box */}
            <div className="max-w-md mx-auto bg-muted/40 border border-border/80 rounded-2xl p-5 text-left text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <span className="text-muted-foreground">{isEnglish ? "Student Name:" : "শিক্ষার্থীর নাম:"}</span>
                <span className="font-bold text-foreground">{studentName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <span className="text-muted-foreground">{isEnglish ? "Guardian Name:" : "অভিভাবকের নাম:"}</span>
                <span className="font-bold text-foreground">{guardianName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <span className="text-muted-foreground">{isEnglish ? "Login Phone:" : "মোবাইল নম্বর:"}</span>
                <span className="font-mono font-bold text-foreground">{activeGuardian?.guardianPhone || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <span className="text-muted-foreground">{isEnglish ? "Assigned Course:" : "কোর্স ও ব্যাচ:"}</span>
                <span className="font-bold text-foreground text-right max-w-[200px] truncate">{batchName}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">{isEnglish ? "Verification Status:" : "ভেরিফিকেশন স্ট্যাটাস:"}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {isEnglish ? "Pending Verification" : "পেন্ডিং ভেরিফিকেশন"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isEnglish ? "Refresh Verification Status" : "স্ট্যাটাস রিফ্রেশ করুন"}</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/80 transition-all cursor-pointer border border-border"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>{isEnglish ? "Logout Session" : "লগ আউট করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 sm:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── LIVE SYNC INDICATOR & ACTIVE GUARDIAN BADGE ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-2xs">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-foreground">
              {isEnglish ? `Guardian: ${studentInfo.guardianName}` : `অভিভাবক: ${studentInfo.guardianName}`}
            </span>
            <span className="text-muted-foreground">({studentInfo.studentName})</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-bold ml-2 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3 h-3" />
              {isEnglish ? "Logout" : "লগ আউট"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin-slow opacity-60" />
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish ? `Live sync active · Updated ${lastRefresh}` : `লাইভ সিঙ্ক চালু · আপডেট: ${lastRefresh}`}
            </span>
          </div>
        </div>

        {/* ── HEADER ── */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Shield className="w-4 h-4" />
                <span>{isEnglish ? "Parent & Guardian Portal" : "অভিভাবক পোর্টাল"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? `${studentInfo.studentNameEN}'s Academic Dashboard` : `${studentInfo.studentName}-এর একাডেমি ট্র্যাকিং`}
              </h1>
              <p className="text-blue-100 text-sm mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? studentInfo.courseNameEN : studentInfo.courseName}
              </p>
            </div>
            {/* Live Zoom Button — reads from batchStore/Supabase */}
            {zoomLink ? (
              <a
                href={zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg text-sm cursor-pointer"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Video className="w-5 h-5 text-red-500 animate-pulse" />
                {isEnglish ? "Join Live Zoom Class Now" : "লাইভ জুম ক্লাসে যোগ দিন"}
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 font-bold px-4 py-2.5 rounded-2xl text-xs border border-white/20">
                <Video className="w-4 h-4 text-white/50" />
                <span>{isEnglish ? "No Live Class Scheduled" : "কোনো লাইভ ক্লাস নেই"}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── TOP METRICS GRID — REAL PER-STUDENT DATA WITHOUT MOCK FALLBACKS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* 1. Live Class Card */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Upcoming Live Class" : "পরবর্তী লাইভ ক্লাস"}
              </h3>
              <p className="text-base font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? zoomScheduleEN : zoomSchedule}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {zoomLink || (isEnglish ? "No active link" : "লিংক উপলব্ধ নেই")}
              </p>
            </div>
            {zoomLink ? (
              <a
                href={zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white text-xs font-bold py-3 rounded-xl hover:bg-green-600 transition-all cursor-pointer"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Video className="w-4 h-4" />
                {isEnglish ? "Join Now (Live)" : "এখনই যোগ দিন (লাইভ)"}
              </a>
            ) : (
              <div className="w-full mt-4 text-center py-2.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold border border-border">
                {isEnglish ? "No class scheduled" : "ক্লাস নির্ধারিত নেই"}
              </div>
            )}
          </div>

          {/* 2. Attendance — Real Per-Student Attendance Rate */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Attendance Percentage" : "উপস্থিতির শতকরা হার"}
                </h3>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {hasAttendance ? `${attendanceRate}%` : "0%"}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${hasAttendance ? attendanceRate : 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {hasAttendance
                  ? (isEnglish
                    ? `${attendedClasses} of ${studentInfo.totalClasses} classes attended`
                    : `মোট ${studentInfo.totalClasses}টির মধ্যে ${attendedClasses}টিতে উপস্থিত`)
                  : (isEnglish ? "No classes recorded yet" : "কোনো ক্লাস রেকর্ড নেই")}
              </p>
            </div>
            <div className={`mt-4 text-[11px] font-bold p-2.5 rounded-xl border ${hasAttendance && (attendanceRate || 0) >= 80 ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/50" : "text-muted-foreground bg-muted/40 border-border"}`}>
              {hasAttendance && (attendanceRate || 0) >= 80 ? (
                <span>✓ {isEnglish ? "Excellent attendance! Money-back guarantee criteria met." : "চমৎকার উপস্থিতি! মানি-ব্যাক গ্যারান্টির শর্ত পূরণ।"}</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 text-primary" />
                  {isEnglish ? "Class attendance will track here once classes start." : "ক্লাস শুরু হলে উপস্থিতি এখানে সংগ্রহ করা হবে।"}
                </span>
              )}
            </div>
          </div>

          {/* 3. Performance — Real Per-Student Latest Exam Grade */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Latest Grade" : "সর্বশেষ মূল্যায়ন"}
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-primary">{displayGrade}</div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">
                    {hasGrades ? `${displayScore}/100` : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {hasGrades ? (isEnglish ? "Exam Score" : "পরীক্ষার নম্বর") : (isEnglish ? "No exams submitted yet" : "কোনো পরীক্ষা দেওয়া হয়নি")}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrintReport}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground text-xs font-bold py-2.5 rounded-xl hover:bg-muted transition-all cursor-pointer"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Download className="w-4 h-4 text-primary" />
              {isEnglish ? "Download Report" : "রিপোর্ট ডাউনলোড"}
            </button>
          </div>
        </div>

        {/* ── HOMEWORK SECTION — reads from homeworkStore ── */}
        {(assignments || []).length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Assigned Homework" : "হোমওয়ার্ক তালিকা"}
              </h2>
              <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                {(assignments || []).length} {isEnglish ? "active" : "টি সক্রিয়"}
              </span>
            </div>
            <div className="space-y-3">
              {(assignments || []).slice(0, 5).map((hw) => (
                <div key={hw.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{hw.title}</p>
                    <p className="text-xs text-muted-foreground">{hw.subject} · {isEnglish ? "Due" : "জমার তারিখ"}: {hw.dueDate}</p>
                  </div>
                  <button
                    onClick={() => handleWhatsAppHomework(hw.title)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {isEnglish ? "Submit via WhatsApp" : "হোয়াটসঅ্যাপে জমা দিন"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── OFFICIAL REPORT CARD — REAL TEACHER REMARKS & SCORES ── */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg relative print:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Official Student Performance Report" : "শিক্ষার্থীর অফিসিয়াল পারফরম্যান্স রিপোর্ট কার্ড"}
                </h2>
                <p className="text-xs text-muted-foreground">কোর্স মেন্টর: রাহেলা খাতুন (LearnOps Senior Faculty)</p>
              </div>
            </div>
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-muted hover:bg-primary hover:text-white transition-colors cursor-pointer border border-border"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Download className="w-3.5 h-3.5" />
              প্রিন্ট বা পিডিএফ সেভ করুন
            </button>
          </div>

          {/* Teacher Feedback — Real Remarks without Dummy Fallbacks */}
          <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 mb-6">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              শিক্ষকের মূল্যায়ন মন্তব্য (Teacher Remarks)
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed italic" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              "{displayFeedback}"
            </p>
          </div>

          {/* Scores Grid — Displays N/A or Live Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-3xl font-black text-primary">{displayGrade}</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">{isEnglish ? "Letter Grade" : "লেটার গ্রেড"}</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-3xl font-black text-emerald-600">{hasGrades ? displayScore : "N/A"}</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">{isEnglish ? "Marks /100" : "নম্বর /১০০"}</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-3xl font-black text-purple-600">{hasAttendance ? `${attendanceRate}%` : "0%"}</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">{isEnglish ? "Attendance" : "উপস্থিতি"}</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map((s) => {
                  const scoreVal = hasGrades ? Number(latestGrade?.score || 0) : 0;
                  return (
                    <Star key={s} className={`w-5 h-5 ${hasGrades && scoreVal >= s * 20 ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground font-bold">{isEnglish ? "Overall Rating" : "সামগ্রিক রেটিং"}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function GuardianPage() {
  let isEnglish = false;
  try {
    const langCtx = useLanguage();
    if (langCtx?.isEnglish !== undefined) isEnglish = langCtx.isEnglish;
  } catch (e) {}

  return (
    <GuardianErrorBoundary isEnglish={isEnglish}>
      <GuardianPageContent />
    </GuardianErrorBoundary>
  );
}
