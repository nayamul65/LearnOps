import React from "react";
import {
  Video,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Download,
  BookOpen,
  Sparkles,
  Shield,
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

export default function GuardianPage() {
  const { t, isEnglish } = useLanguage();

  const mockGuardianData = {
    studentName: "আরাফ হোসেন",
    studentNameEN: "Araf Hossain",
    courseName: "২৫ দিনে সুন্দর হাতের লেখা (ব্যাচ ০৪)",
    courseNameEN: "Beautiful Handwriting in 25 Days (Batch 04)",
    attendancePercentage: 94,
    totalClasses: 16,
    attendedClasses: 15,
    handwritingScore: 92,
    speedScore: 88,
    teacherRemarks: "আরাফের হাতের লেখা এখন অনেক পরিচ্ছন্ন ও বর্ণমালার মাত্রা সোজা। প্রতিদিন ১৫ মিনিট রেগুলার প্র্যাকটিস ধরে রাখতে হবে।",
    teacherRemarksEN: "Araf's handwriting is now clean with straight alignment. Please keep up 15 mins daily practice.",
    upcomingClassTime: "আজ বিকাল ৪:০০ টা (লাইভ জুম ক্লাস)",
    upcomingClassTimeEN: "Today at 4:00 PM (Live Zoom Class)",
    zoomLink: "https://zoom.us/j/9876543210",
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background pt-8 sm:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Guardian Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Shield className="w-4 h-4" />
                <span>{isEnglish ? "Parent & Guardian Portal" : "অভিভাবক ও প্যান্টস পোর্টাল"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? `${mockGuardianData.studentNameEN}'s Academic Dashboard` : `${mockGuardianData.studentName}-এর একাডেমি ট্র্যাকিং`}
              </h1>
              <p className="text-blue-100 text-sm mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? mockGuardianData.courseNameEN : mockGuardianData.courseName}
              </p>
            </div>

            {/* Quick Live Class Link */}
            <a
              href={mockGuardianData.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg text-sm cursor-pointer"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Video className="w-5 h-5 text-red-500 animate-pulse" />
              {isEnglish ? "Join Live Zoom Class" : "লাইভ জুম ক্লাসে যোগ দিন"}
            </a>
          </div>
        </div>

        {/* ── TOP METRICS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* 1. Zoom Class Card */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Upcoming Live Class" : "পরবর্তী লাইভ ক্লাস"}
              </h3>
              <p className="text-lg font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? mockGuardianData.upcomingClassTimeEN : mockGuardianData.upcomingClassTime}
              </p>
            </div>
            <a
              href={mockGuardianData.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white text-xs font-bold py-3 rounded-xl hover:bg-green-600 transition-all cursor-pointer"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              ক্লাস শুরু করুন (Zoom Link)
            </a>
          </div>

          {/* 2. Attendance Percentage Tracking Card */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Attendance Percentage" : "উপস্থিতির শতকরা হার"}
                </h3>
                <span className="text-xl font-extrabold text-emerald-600">{mockGuardianData.attendancePercentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-3 mb-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mockGuardianData.attendancePercentage}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish
                  ? `${mockGuardianData.attendedClasses} out of ${mockGuardianData.totalClasses} classes attended`
                  : `মোট ${mockGuardianData.totalClasses}টি ক্লাসের মধ্যে ${mockGuardianData.attendedClasses}টিতে উপস্থিত`}
              </p>
            </div>
            <div className="mt-4 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/50">
              ✓ চমৎকার উপস্থিতি! মানি-ব্যাক গ্যারান্টির শর্ত পূরণ করছে।
            </div>
          </div>

          {/* 3. Skill Scores Card */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Skill Improvement Progress" : "দক্ষতা বৃদ্ধির অগ্রগতি"}
              </h3>

              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/40">
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>হাতের লেখার সৌন্দর্য স্কোর:</span>
                  <span className="text-primary">{mockGuardianData.handwritingScore}/১০০</span>
                </div>
                <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/40">
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>লেখার গতি (Speed Score):</span>
                  <span className="text-purple-600">{mockGuardianData.speedScore}/১০০</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrintReport}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground text-xs font-bold py-2.5 rounded-xl hover:bg-muted transition-all cursor-pointer"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Download className="w-4 h-4 text-primary" />
              {isEnglish ? "Download Progress Report" : "প্রগ্রেস রিপোর্ট ডাউনলোড"}
            </button>
          </div>
        </div>

        {/* ── REPORT CARD SECTION ── */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg relative print:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Official Student Report Card" : "শিক্ষার্থীর অফিসিয়াল পারফরম্যান্স রিপোর্ট কার্ড"}
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

          <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 mb-6">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              শিক্ষকের মূল্যায়ন মন্তব্য (Teacher Remarks)
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed italic" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              "{isEnglish ? mockGuardianData.teacherRemarksEN : mockGuardianData.teacherRemarks}"
            </p>
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-2xl font-black text-primary">A+</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">বর্ণমালা আকৃতি</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-2xl font-black text-emerald-600">A</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">লাইন সোজা রাখার ভাব</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-2xl font-black text-purple-600">A+</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">পেন্সিল গ্রিপ কারেকশন</div>
            </div>
            <div className="bg-background p-4 rounded-2xl border border-border">
              <div className="text-2xl font-black text-amber-500">৯৪%</div>
              <div className="text-xs text-muted-foreground mt-1 font-bold">সামগ্রিক স্কিল মার্কস</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
