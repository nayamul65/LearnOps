import React from "react";
import { Video, Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { StudentProfile } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianLiveClassesProps {
  student: StudentProfile;
}

export const GuardianLiveClasses: React.FC<GuardianLiveClassesProps> = ({ student }) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const classSchedule = [
    {
      id: "cls-1",
      title: "লাইভ জুম ক্লাস ১৬: যুক্তবর্ণ গঠন ও সমতা",
      titleEN: "Live Class 16: Conjunction Alignment",
      time: "আজ বিকাল ৪:০০ টা",
      timeEN: "Today at 4:00 PM",
      status: "Upcoming",
      zoomLink: student.zoomLink,
    },
    {
      id: "cls-2",
      title: "লাইভ জুম ক্লাস ১৫: স্বরবর্ণ নিখুঁত মাত্রা",
      titleEN: "Live Class 15: Vowel Alignment Practice",
      time: "গতকাল বিকাল ৪:০০ টা",
      timeEN: "Yesterday at 4:00 PM",
      status: "Completed",
      recordingUrl: "#",
    },
    {
      id: "cls-3",
      title: "লাইভ জুম ক্লাস ১৪: স্পিড অ্যান্ড পেন্সিল গ্রিপ ড্রিল",
      titleEN: "Live Class 14: Speed & Pencil Grip Drill",
      time: "০২ আগস্ট, বিকাল ৪:০০ টা",
      timeEN: "02 Aug at 4:00 PM",
      status: "Completed",
      recordingUrl: "#",
    },
  ];

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all mb-8 shadow-lg ${
      isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Live Classes & Zoom Portal" : "লাইভ জুম ক্লাস ও রেকর্ড শিডিউল"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEnglish ? "Join upcoming interactive Zoom sessions and view past recordings" : "সরাসরি শিক্ষক পরিচালিত জুম লাইভ ক্লাসে অংশ নিন"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {classSchedule.map((cls) => (
          <div
            key={cls.id}
            className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
              cls.status === "Upcoming"
                ? "border-blue-500/40 bg-blue-500/10"
                : isDark
                ? "bg-slate-800/40 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                cls.status === "Upcoming" ? "bg-blue-600 text-white animate-pulse" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}>
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? cls.titleEN : cls.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isEnglish ? cls.timeEN : cls.time}</span>
                </div>
              </div>
            </div>

            {cls.status === "Upcoming" ? (
              <a
                href={cls.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md"
              >
                <span>{isEnglish ? "Join Zoom Class Now" : "ক্লাসে প্রবেশ করুন"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-foreground font-bold text-xs hover:bg-slate-300 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isEnglish ? "Class Attended" : "উপস্থিত থাকা হয়েছে"}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
