import React from "react";
import {
  FileText,
  Download,
  Star,
  Award,
  Sparkles,
  Quote,
} from "lucide-react";
import { StudentProfile, AchievementBadge } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianPerformanceReportProps {
  student: StudentProfile;
  badges: AchievementBadge[];
  onDownloadReport: () => void;
}

export const GuardianPerformanceReport: React.FC<GuardianPerformanceReportProps> = ({
  student,
  badges,
  onDownloadReport,
}) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  return (
    <div className={`rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all relative overflow-hidden mb-8 shadow-lg ${
      isDark
        ? "bg-slate-900/90 border-slate-800 text-slate-100"
        : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      
      {/* Decorative gradient blur background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish ? "Official Student Performance Report" : "শিক্ষার্থীর অফিসিয়াল পারফরম্যান্স রিপোর্ট কার্ড"}
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {isEnglish ? `Course Mentor: ${student.teacherName} (${student.teacherTitle})` : `কোর্স মেন্টর: ${student.teacherName} (LearnOps Senior Faculty)`}
            </p>
          </div>
        </div>

        <button
          onClick={onDownloadReport}
          className="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-300 transition-all cursor-pointer border border-purple-500/20 shadow-sm"
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          <Download className="w-4 h-4" />
          <span>{isEnglish ? "Print or Save PDF" : "প্রিন্ট বা পিডিএফ সেভ করুন"}</span>
        </button>
      </div>

      {/* Grades Grid & Stars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? "bg-slate-800/60 border-slate-800" : "bg-purple-50/50 border-purple-100"
        }`}>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">A+</div>
          <div className="text-xs font-bold text-muted-foreground mt-1">
            {isEnglish ? "Alphabet Shape" : "বর্ণমালা আকৃতি"}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? "bg-slate-800/60 border-slate-800" : "bg-emerald-50/50 border-emerald-100"
        }`}>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">A</div>
          <div className="text-xs font-bold text-muted-foreground mt-1">
            {isEnglish ? "Line Straightness" : "লাইন সোজা রাখার ভাব"}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? "bg-slate-800/60 border-slate-800" : "bg-indigo-50/50 border-indigo-100"
        }`}>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">A+</div>
          <div className="text-xs font-bold text-muted-foreground mt-1">
            {isEnglish ? "Pencil Grip" : "পেন্সিল গ্রিপ কারেকশন"}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? "bg-slate-800/60 border-slate-800" : "bg-amber-50/50 border-amber-100"
        }`}>
          <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-500">
            <span>{student.starsEarned}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-muted-foreground mt-1">
            {isEnglish ? `Stars (${student.starsEarned}/${student.totalStars})` : `মোট অর্জিত স্টার (${student.starsEarned}/${student.totalStars})`}
          </div>
        </div>
      </div>

      {/* Task 2: Expanded Teacher Remarks Box (Full width on Desktop, Tablet, Mobile) */}
      <div className="w-full mb-8">
        <div className={`p-6 rounded-3xl border w-full flex flex-col justify-between ${
          isDark ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-200/80"
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
              <Quote className="w-4 h-4" />
              <span>{isEnglish ? "Teacher's Evaluation Remarks" : "শিক্ষকের মূল্যায়ন মন্তব্য (Teacher Remarks)"}</span>
            </div>
            <p className="text-base text-foreground/90 leading-relaxed italic" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              "{isEnglish ? student.teacherRemarksEN : student.teacherRemarks}"
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
            <img
              src={student.teacherAvatar}
              alt={student.teacherName}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
            />
            <div className="text-xs">
              <p className="font-extrabold text-foreground">{student.teacherName}</p>
              <p className="text-[11px] text-muted-foreground">{student.teacherTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Earned Achievement Badges" : "শিক্ষার্থীর অর্জিত ব্যাজসমূহ (Achievement Badges)"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${badge.bg}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold bg-white dark:bg-slate-800 ${badge.color} shadow-xs`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-foreground leading-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {isEnglish ? badge.titleEN : badge.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {isEnglish ? badge.unlockedAt : badge.unlockedAt}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-snug" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? badge.descriptionEN : badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
