import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Award,
  BookOpen,
  FileCheck,
  Save,
  UserCheck,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  status: "Present" | "Absent" | "Late";
}

interface HomeworkSubmission {
  id: string;
  studentName: string;
  title: string;
  date: string;
  score: number;
  grade: string;
  feedback: string;
  status: "Graded" | "Pending";
}

const INITIAL_ATTENDANCE: StudentAttendance[] = [
  { id: "std-1", name: "আরাফ হোসেন", rollNo: "01", status: "Present" },
  { id: "std-2", name: "তাহিয়া রহমান", rollNo: "02", status: "Present" },
  { id: "std-3", name: "সামিন চৌধুরী", rollNo: "03", status: "Late" },
  { id: "std-4", name: "তানভীর আহম্মেদ", rollNo: "04", status: "Absent" },
  { id: "std-5", name: "নুসাইবা পারভীন", rollNo: "05", status: "Present" },
];

const INITIAL_HOMEWORKS: HomeworkSubmission[] = [
  {
    id: "hw-1",
    studentName: "আরাফ হোসেন",
    title: "মাত্রা ও বর্ণমালা সোজা রাখার অনুশীলন (পৃষ্ঠা ৪)",
    date: "2026-07-26",
    score: 95,
    grade: "A+",
    feedback: "খুব সুন্দর ও পরিচ্ছন্ন হয়েছে! লাইন পুরো সোজা রাখা শিখেছো।",
    status: "Graded",
  },
  {
    id: "hw-2",
    studentName: "তাহিয়া রহমান",
    title: "দ্রুত লেখার স্পিড টেস্ট ১ (১ মিনিটে ৩০ শব্দ)",
    date: "2026-07-27",
    score: 88,
    grade: "A",
    feedback: "স্পিড চমৎকার, যুক্তবর্ণ গঠনে আরও একটু সময় নাও।",
    status: "Graded",
  },
  {
    id: "hw-3",
    studentName: "সামিন চৌধুরী",
    title: "পেন্সিল গ্রিপ ও স্বরবর্ণ কারেকশন",
    date: "2026-07-27",
    score: 0,
    grade: "-",
    feedback: "",
    status: "Pending",
  },
];

export default function TeacherPage() {
  const { t, isEnglish } = useLanguage();
  const [attendance, setAttendance] = useState<StudentAttendance[]>(INITIAL_ATTENDANCE);
  const [homeworks, setHomeworks] = useState<HomeworkSubmission[]>(INITIAL_HOMEWORKS);
  const [activeTab, setActiveTab] = useState<"attendance" | "gradebook">("attendance");

  // Grade Modal State
  const [selectedHw, setSelectedHw] = useState<HomeworkSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState("90");
  const [feedbackInput, setFeedbackInput] = useState("");

  const toggleAttendance = (id: string, status: "Present" | "Absent" | "Late") => {
    setAttendance((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;

    const scoreNum = Number(scoreInput);
    let gradeLetter = "A+";
    if (scoreNum < 60) gradeLetter = "C";
    else if (scoreNum < 80) gradeLetter = "B";
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

    setSelectedHw(null);
  };

  return (
    <div className="min-h-screen bg-background pt-8 sm:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>{isEnglish ? "Teacher & Faculty Portal" : "শিক্ষক ও মেন্টর পোর্টাল"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Attendance Checklist & Homework Gradebook" : "১-ক্লিক উপস্থিতি ও হোমওয়ার্ক গ্রেডবুক"}
              </h1>
              <p className="text-amber-100 text-sm mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "LoggedIn Mentor:" : "লগইনকৃত শিক্ষক:"} <span className="font-bold text-white">রাহেলা খাতুন (প্রধান মেন্টর)</span>
              </p>
            </div>

            {/* Tab Controls */}
            <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
              <button
                onClick={() => setActiveTab("attendance")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "attendance" ? "bg-white text-amber-800 shadow-sm" : "text-white hover:bg-white/15"
                }`}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                ✓ {isEnglish ? "1-Click Attendance" : "১-ক্লিক উপস্থিতি"}
              </button>
              <button
                onClick={() => setActiveTab("gradebook")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "gradebook" ? "bg-white text-amber-800 shadow-sm" : "text-white hover:bg-white/15"
                }`}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                📝 {isEnglish ? "Homework Gradebook" : "হোমওয়ার্ক গ্রেডবুক"}
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION A: 1-CLICK ATTENDANCE CHECKLIST ── */}
        {activeTab === "attendance" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  {isEnglish ? "Daily Class Attendance Register" : "আজকের ক্লাস উপস্থিতি খাতা (২৫ দিনে সুন্দর হাতের লেখা)"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">তারিখ: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-emerald-600">উপস্থিত: {attendance.filter((s) => s.status === "Present").length} জন</span>
                <span className="text-amber-600">দেড়িতে: {attendance.filter((s) => s.status === "Late").length} জন</span>
                <span className="text-red-500">অনুপস্থিত: {attendance.filter((s) => s.status === "Absent").length} জন</span>
              </div>
            </div>

            <div className="space-y-3">
              {attendance.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 font-bold text-xs flex items-center justify-center">
                      #{student.rollNo}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {student.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">ব্যাচ: 04 (বিকাল ৪:০০)</p>
                    </div>
                  </div>

                  {/* 1-Click Status Toggles */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAttendance(student.id, "Present")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        student.status === "Present"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isEnglish ? "Present" : "উপস্থিত"}
                    </button>

                    <button
                      onClick={() => toggleAttendance(student.id, "Late")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        student.status === "Late"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {isEnglish ? "Late" : "লেট"}
                    </button>

                    <button
                      onClick={() => toggleAttendance(student.id, "Absent")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        student.status === "Absent"
                          ? "bg-red-500 text-white shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {isEnglish ? "Absent" : "অনুপস্থিত"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION B: HOMEWORK GRADEBOOK ── */}
        {activeTab === "gradebook" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <FileCheck className="w-5 h-5 text-amber-600" />
                  {isEnglish ? "Student Homework Submissions & Grading" : "শিক্ষার্থীদের জমা দেওয়া হোমওয়ার্ক ও গ্রেডিং"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">জমা দেওয়া হোমওয়ার্ক রিভিউ করে নম্বর ও মন্তব্য প্রদান করুন।</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homeworks.map((hw) => (
                <div key={hw.id} className="bg-muted/30 border border-border rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {hw.studentName}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          hw.status === "Graded"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {hw.status === "Graded" ? `গ্রেড: ${hw.grade} (${hw.score}/১০০)` : "অপেক্ষমাণ"}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-primary mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      📖 {hw.title}
                    </h4>

                    {hw.feedback && (
                      <div className="bg-background p-3 rounded-xl border border-border/50 text-xs italic text-muted-foreground mb-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        "{hw.feedback}"
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedHw(hw);
                      setScoreInput(hw.score ? String(hw.score) : "90");
                      setFeedbackInput(hw.feedback || "");
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer mt-2"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <Award className="w-4 h-4" />
                    {hw.status === "Graded" ? "গ্রেড এডিট করুন" : "মূল্যায়ন ও নম্বর দিন"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── GRADE MODAL ── */}
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
                  স্কোর / নম্বর (১০০ এর মধ্যে)
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
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all text-xs cursor-pointer shadow-md"
                >
                  গ্রেড ও নম্বর জমা দিন ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
