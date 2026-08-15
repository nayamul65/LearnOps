import React from "react";
import { Images, Sparkles, ArrowRight, Award } from "lucide-react";
import { WorkGalleryItem } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianProgressGalleryProps {
  galleryItems: WorkGalleryItem[];
}

export const GuardianProgressGallery: React.FC<GuardianProgressGalleryProps> = ({
  galleryItems,
}) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all mb-8 shadow-lg ${
      isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
          <Images className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Student Progress Gallery" : "হাতের লেখার প্রগ্রেস গ্যালারি (Before & After)"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEnglish ? "Compare student's handwriting transformation over time" : "কোর্সের শুরুতে ও বর্তমান সময়কার হাতের লেখার রূপান্তর তুলনা"}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all ${
              isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50/70 border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? item.titleEN : item.title}
                </h3>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Score: {item.score}%
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Before image */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full inline-block">
                  {isEnglish ? "Before Course" : "কোর্সের শুরুতে"}
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img src={item.beforeImg} alt="Before" className="w-full h-48 object-cover" />
                </div>
              </div>

              {/* After image */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-block">
                  {isEnglish ? "After Improvement" : "বর্তমানের উন্নতি"}
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img src={item.afterImg} alt="After" className="w-full h-48 object-cover" />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/20">
              💡 {isEnglish ? `Teacher Remark: "${item.remarksEN}"` : `শিক্ষকের নোট: "${item.remarks}"`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
