import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { getBatchZoomInfo, subscribeToBatchUpdates } from "../services/batchStore";
import { getAttendanceRate, subscribeToAttendanceUpdates } from "../services/attendanceStore";
import { getStoredAssignments, getLatestGrade, subscribeToHomeworkUpdates } from "../services/homeworkStore";

export default function GuardianPage() {
  const { isEnglish } = useLanguage();

  // ── STATIC MOCK (fallback base data) ──
  const mockBase = {
    studentId: "std-1",
    studentName: "আরাফ হোসেন",
    studentNameEN: "Araf Hossain",
    courseName: "২৫ দিনে সুন্দর হাতের লেখা (ব্যাচ ০৪)",
    courseNameEN: "Beautiful Handwriting in 25 Days (Batch 04)",
    totalClasses: 16,
    teacherPhone: "8801711223344",
  };

  // ── LIVE STATE from stores ──
  const [zoomLink, setZoomLink] = useState(() => getBatchZoomInfo().zoomLink);
  const [zoomSchedule, setZoomSchedule] = useState(() => getBatchZoomInfo().zoomSchedule);
  const [zoomScheduleEN, setZoomScheduleEN] = useState(() => getBatchZoomInfo().zoomScheduleEN);
  const [attendanceRate, setAttendanceRate] = useState(() => getAttendanceRate(mockBase.studentId));
  const [assignments, setAssignments] = useState(() => getStoredAssignments());
  const [latestGrade, setLatestGrade] = useState(() => getLatestGrade(mockBase.studentId));
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

  // Subscribe to live updates from Teacher Portal
  useEffect(() => {
    const unsubBatch = subscribeToBatchUpdates((batches) => {
      const b = batches[0];
      if (b) {
        setZoomLink(b.zoomLink || "https://zoom.us/j/9876543210");
        setZoomSchedule(b.zoomSchedule || "আজ বিকাল ৪:০০ টা (লাইভ জুম ক্লাস)");
        setZoomScheduleEN(b.zoomScheduleEN || "Today at 4:00 PM (Live Zoom Class)");
        setLastRefresh(new Date().toLocaleTimeString());
      }
    });
    const unsubAttendance = subscribeToAttendanceUpdates(() => {
      setAttendanceRate(getAttendanceRate(mockBase.studentId));
      setLastRefresh(new Date().toLocaleTimeString());
    });
    const unsubHomework = subscribeToHomeworkUpdates((store) => {
      setAssignments(store.assignments);
      setLatestGrade(getLatestGrade(mockBase.studentId));
      setLastRefresh(new Date().toLocaleTimeString());
    });
    return () => { unsubBatch(); unsubAttendance(); unsubHomework(); };
  }, []);

  const attendedClasses = Math.round((attendanceRate / 100) * mockBase.totalClasses);
  const displayGrade = latestGrade?.grade || "A+";
  const displayScore = latestGrade?.score || 92;
  const displayFeedback = latestGrade?.feedback
    || (isEnglish
      ? "Araf's handwriting is now clean with straight alignment. Please keep up 15 mins daily practice."
      : "আরাফের হাতের লেখা এখন অনেক পরিচ্ছন্ন ও বর্ণমালার মাত্রা সোজা। প্রতিদিন ১৫ মিনিট রেগুলার প্র্যাকটিস ধরে রাখতে হবে।");

  const handlePrintReport = () => window.print();

  const handleWhatsAppHomework = (assignmentTitle: string) => {
    const msg = isEnglish
      ? `📚 Homework Submission - ${assignmentTitle}\n\nStudent: ${mockBase.studentNameEN}\nSubmission attached.`
      : `📚 হোমওয়ার্ক জমা দেওয়া হচ্ছে - ${assignmentTitle}\n\nছাত্র: ${mockBase.studentName}\nসাবমিশন সংযুক্ত।`;
    const url = `https://wa.me/${mockBase.teacherPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pt-8 sm:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── LIVE SYNC INDICATOR ── */}
        <div className="flex items-center justify-end gap-2 mb-4 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3 animate-spin-slow opacity-60" />
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? `Live sync active · Updated ${lastRefresh}` : `লাইভ সিঙ্ক চালু · আপডেট: ${lastRefresh}`}
          </span>
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
                {isEnglish ? `${mockBase.studentNameEN}'s Academic Dashboard` : `${mockBase.studentName}-এর একাডেমি ট্র্যাকিং`}
              </h1>
              <p className="text-blue-100 text-sm mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? mockBase.courseNameEN : mockBase.courseName}
              </p>
            </div>
            {/* Live Zoom Button — reads from batchStore */}
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
          </div>
        </div>

        {/* ── TOP METRICS GRID ── */}
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
              <p className="text-xs text-muted-foreground mt-1 truncate">{zoomLink}</p>
            </div>
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
          </div>

          {/* 2. Attendance — reads from attendanceStore */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Attendance Percentage" : "উপস্থিতির শতকরা হার"}
                </h3>
                <span className="text-2xl font-extrabold text-emerald-600">{attendanceRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish
                  ? `${attendedClasses} of ${mockBase.totalClasses} classes attended`
                  : `মোট ${mockBase.totalClasses}টির মধ্যে ${attendedClasses}টিতে উপস্থিত`}
              </p>
            </div>
            <div className="mt-4 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/50">
              ✓ {isEnglish ? "Excellent attendance! Money-back guarantee criteria met." : "চমৎকার উপস্থিতি! মানি-ব্যাক গ্যারান্টির শর্ত পূরণ।"}
            </div>
          </div>

          {/* 3. Performance — reads from homeworkStore */}
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
                  <p className="text-2xl font-extrabold text-foreground">{displayScore}/100</p>
                  <p className="text-xs text-muted-foreground">{isEnglish ? "Exam Score" : "পরীক্ষার নম্বর"}</p>
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
        {assignments.length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Assigned Homework" : "হোমওয়ার্ক তালিকা"}
              </h2>
              <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                {assignments.length} {isEnglish ? "active" : "টি সক্রিয়"}
              </span>
            </div>
            <div className="space-y-3">
              {assignments.slice(0, 5).map((hw) => (
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

        {/* ── OFFICIAL REPORT CARD — reads from homeworkStore ── */}
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

          {/* Teacher Feedback — from homeworkStore */}
          <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 mb-6">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              শিক্ষকের মূল্যায়ন মন্তব্য (Teacher Remarks)
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed italic" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              "{displayFeedback}"
            </p>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-3xl font-black text-primary">{displayGrade}</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">{isEnglish ? "Letter Grade" : "লেটার গ্রেড"}</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-3xl font-black text-emerald-600">{displayScore}</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">{isEnglish ? "Marks /100" : "নম্বর /১০০"}</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-3xl font-black text-purple-600">{attendanceRate}%</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">{isEnglish ? "Attendance" : "উপস্থিতি"}</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-5 h-5 ${displayScore >= s * 20 ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground font-bold">{isEnglish ? "Overall Rating" : "সামগ্রিক রেটিং"}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
