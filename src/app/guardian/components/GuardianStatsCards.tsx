import React from "react";
import {
  Video,
  CheckCircle2,
  Award,
  Download,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { StudentProfile } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianStatsCardsProps {
  student: StudentProfile;
  onDownloadReport: () => void;
}

export const GuardianStatsCards: React.FC<GuardianStatsCardsProps> = ({
  student,
  onDownloadReport,
}) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      
      {/* 1. Next Live Class Card */}
      <div className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/90 text-slate-800 shadow-sm"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {isEnglish ? "Scheduled" : "নির্ধারিত"}
            </span>
          </div>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Next Live Class" : "পরবর্তী লাইভ ক্লাস"}
          </h3>
          <p className="text-base font-extrabold text-foreground leading-snug" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? student.upcomingClassTimeEN : student.upcomingClassTime}
          </p>
        </div>

        <a
          href={student.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold py-3 rounded-2xl hover:opacity-95 transition-all cursor-pointer shadow-md shadow-blue-500/20"
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          <Video className="w-4 h-4 text-red-300 animate-pulse" />
          <span>{isEnglish ? "Join Zoom Class" : "ক্লাস শুরু করুন (Zoom)"}</span>
        </a>
      </div>

      {/* 2. Attendance Rate Card */}
      <div className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/90 text-slate-800 shadow-sm"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {student.attendancePercentage}%
            </span>
          </div>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Attendance Rate" : "উপস্থিতির শতকরা হার"}
          </h3>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-700"
              style={{ width: `${student.attendancePercentage}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground font-medium" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish
              ? `${student.attendedClasses} out of ${student.totalClasses} classes attended`
              : `মোট ${student.totalClasses}টি ক্লাসের মধ্যে ${student.attendedClasses}টিতে উপস্থিত`}
          </p>
        </div>

        <div className="mt-4 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-2xl border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{isEnglish ? "Qualified for Money-Back Guarantee" : "মানি-ব্যাক গ্যারান্টির শর্ত পূরণ করছে"}</span>
        </div>
      </div>

      {/* 3. Skill Improvement Score Card */}
      <div className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/90 text-slate-800 shadow-sm"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Grade {student.overallGrade}
            </span>
          </div>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Skill Analytics" : "দক্ষতা বৃদ্ধির স্কোর"}
          </h3>

          <div className="space-y-2 text-xs font-bold">
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground">{isEnglish ? "Handwriting Accuracy:" : "হাতের লেখার নিখুঁততা:"}</span>
              <span className="text-purple-600 dark:text-purple-400 font-extrabold">{student.handwritingScore}/১০০</span>
            </div>
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-muted-foreground">{isEnglish ? "Writing Speed Score:" : "লেখার গতি স্কোর:"}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{student.speedScore}/১০০</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-purple-500" />
          <span>{isEnglish ? "+24% Improvement from last month" : "গত মাসের তুলনায় +২৪% অগ্রগতি"}</span>
        </div>
      </div>

      {/* 4. Download Official Report Card */}
      <div className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/90 text-slate-800 shadow-sm"
      }`}>
        <div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <Download className="w-6 h-6" />
          </div>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Progress Report" : "পারফরম্যান্স রিপোর্ট"}
          </h3>
          <p className="text-sm font-bold text-foreground leading-relaxed" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Download official PDF performance certificate" : "অফিসিয়াল প্রগ্রেস রিপোর্ট ও সার্টিফিকেট ডাউনলোড করুন"}
          </p>
        </div>

        <button
          onClick={onDownloadReport}
          className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold py-3 rounded-2xl hover:opacity-90 transition-all cursor-pointer shadow-md"
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          <Download className="w-4 h-4 text-purple-400 dark:text-purple-600" />
          <span>{isEnglish ? "Download PDF Report" : "রিপোর্ট ডাউনলোড"}</span>
        </button>
      </div>

    </div>
  );
};
