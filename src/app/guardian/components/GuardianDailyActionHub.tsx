import React from "react";
import { Download, Clock, Lightbulb, FileText, CheckCircle2 } from "lucide-react";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export const GuardianDailyActionHub: React.FC = () => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const pdfPath = "/practice-sheets/todays-practice-sheet.pdf";

  return (
    <div className="mb-8">
      {/* Daily Action & Mentor Tips Hub Container */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* CARD 1 — TODAY'S ASSIGNMENT */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition-all flex flex-col justify-between ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-slate-100"
              : "bg-white border-slate-200/90 text-slate-800"
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2
                  className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {isEnglish ? "📋 Today's Assignment & Worksheet" : "📋 আজকের বাড়ির কাজ ও ওয়ার্কশিট"}
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  {isEnglish ? "Today's Assignment" : "দৈনিক হোমওয়ার্ক ও ডাউনলোড লিঙ্ক"}
                </p>
              </div>
            </div>

            {/* Assignment Content Container */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border mb-6 transition-all ${
                isDark
                  ? "bg-slate-800/60 border-slate-700/80 text-slate-200"
                  : "bg-purple-50/70 border-purple-100 text-slate-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    {isEnglish ? "Task Instructions" : "বাড়ির কাজের বিবরণ"}
                  </h4>
                  <p
                    className="text-sm sm:text-base font-bold leading-relaxed"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {isEnglish
                      ? 'Practice writing Bengali consonants "Ka" (ক) to "Nga" (ঙ) 5 times neatly in your notebook.'
                      : 'ব্যঞ্জনবর্ণ "ক" থেকে "ঙ" পর্যন্ত ৫ বার খাতায় সুন্দর করে লেখা।'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Download Button & Deadline Badge */}
          <div className="space-y-3 pt-2">
            <a
              href={pdfPath}
              download="todays-practice-sheet.pdf"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Download className="w-5 h-5" />
              <span>
                {isEnglish
                  ? "Download Today's Practice Sheet (PDF)"
                  : "📥 আজকের প্র্যাকটিস শিট (PDF) ডাউনলোড করুন"}
              </span>
            </a>

            {/* Deadline Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "⏰ Deadline: Tonight 11:59 PM" : "⏰ শেষ সময়: আজ রাত ১১:৫৯ মিনিট"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2 — MENTOR PRACTICE TIPS */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition-all flex flex-col justify-between ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-slate-100"
              : "bg-white border-slate-200/90 text-slate-800"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {isEnglish ? "💡 Mentor's Practice Guidance" : "💡 মেন্টরের প্র্যাকটিস টিপস"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {isEnglish ? "Mentor's Practice Guidance" : "অভিভাবকদের জন্য বিশেষ দিকনির্দেশনা"}
              </p>
            </div>
          </div>

          {/* 3 Actionable Tip Pills */}
          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            
            {/* TIP 1 (Pastel Purple) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-200"
                  : "bg-purple-50/80 border-purple-200/80 text-purple-950"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">✏️</span>
                <p
                  className="text-xs sm:text-sm font-bold leading-relaxed"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {isEnglish
                    ? "Use the 3-finger support trick to correct your child's pencil grip positioning."
                    : "বাচ্চার পেন্সিল ধরার পজিশন ঠিক করতে ৩-আঙ্গুলের সাপোর্ট ট্রিকসটি ব্যবহার করুন।"}
                </p>
              </div>
            </div>

            {/* TIP 2 (Pastel Blue) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                  : "bg-blue-50/80 border-blue-200/80 text-blue-950"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">⏱️</span>
                <p
                  className="text-xs sm:text-sm font-bold leading-relaxed"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {isEnglish
                    ? "Do not make your child write continuously for more than 20 minutes; give short breaks in between."
                    : "বাচ্চাকে একনাগাড়ে ২০ মিনিটের বেশি লেখাবেন না, মাঝে ছোট ব্রেক দিন।"}
                </p>
              </div>
            </div>

            {/* TIP 3 (Pastel Mint / Amber) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-200"
                  : "bg-amber-50/80 border-amber-200/80 text-amber-950"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">📏</span>
                <p
                  className="text-xs sm:text-sm font-bold leading-relaxed"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {isEnglish
                    ? "Encourage drawing straight lines freehand without using a ruler to build dexterity."
                    : "সোজা লাইন টানার সময় স্কেল ব্যবহার না করে হাত দিয়ে করার অভ্যাস করান।"}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
