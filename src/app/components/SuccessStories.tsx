import React, { useState } from "react";
import {
  Star,
  Quote,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Calendar,
  GraduationCap,
  Eye,
  X,
  CheckCircle2,
  Columns,
  Layers,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & INTERFACES (Future Admin/Backend Readiness)
   These interfaces mirror the expected structure from Firebase/Supabase APIs.
═══════════════════════════════════════════════════════════════════════════ */

export interface SuccessStory {
  id: string | number;
  studentName: string;
  studentGradeOrAge: string;
  parentName: string;
  parentRole: string; // e.g. "অভিভাবক", "মা", "বাবা"
  reviewText: string;
  rating: number; // 1 to 5
  beforeImageUrl: string;
  afterImageUrl: string;
  courseName: string;
  date: string;
}

export interface SuccessStat {
  id: string;
  label: string;
  value: string;
  description: string;
  type: "students" | "satisfaction" | "rating";
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA ARRAY
   Can be seamlessly replaced with an API call (e.g. fetchSuccessStories())
═══════════════════════════════════════════════════════════════════════════ */

export const mockSuccessStories: SuccessStory[] = [
  {
    id: "story-1",
    studentName: "আরাফ হোসেন",
    studentGradeOrAge: "শ্রেণী: ৩য় | বয়স: ৮ বছর",
    parentName: "সামিরা সুলতানা",
    parentRole: "আরাফের মা",
    reviewText:
      "মাত্র ৪ সপ্তাহে আরাফের হাতের লেখায় অসাধারণ পরিবর্তন এসেছে! আগে ওর লেখা পড়া খুব কঠিন ছিল, এখন টিচাররা খাতায় অতিরিক্ত মার্কস দিচ্ছেন। LearnOps-এর গাইডলাইন চমৎকার!",
    rating: 5,
    beforeImageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop&auto=format",
    afterImageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&auto=format",
    courseName: "বিগিনার হ্যান্ডরাইটিং কোর্স",
    date: "১৫ জানুয়ারি, ২০২৪",
  },
  {
    id: "story-2",
    studentName: "তাহিয়া রহমান",
    studentGradeOrAge: "শ্রেণী: ৫ম | বয়স: ১০ বছর",
    parentName: "মাহাবুব আলম",
    parentRole: "তাহিয়ার বাবা",
    reviewText:
      "পরীক্ষার খাতায় দ্রুত লিখতে গিয়ে তাহিয়ার লেখা নষ্ট হয়ে যেত। এই কোর্সের স্পিড হ্যান্ডরাইটিং টেকনিক শিখে এখন সে সময়মত এবং পরিচ্ছন্নভাবে পুরো উত্তর লিখে শেষ করতে পারছে।",
    rating: 5,
    beforeImageUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    afterImageUrl:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop&auto=format",
    courseName: "অ্যাডভান্সড স্পিড ও বিউটি কোর্স",
    date: "২৮ ফেব্রুয়ারি, ২০২৪",
  },
  {
    id: "story-3",
    studentName: "সামিন চৌধুরী",
    studentGradeOrAge: "শ্রেণী: ২য় | বয়স: ৭ বছর",
    parentName: "নাসরিন পারভীন",
    parentRole: "সামিনের মা",
    reviewText:
      "সামিনের লেখার প্রতি কোনো আগ্রহই ছিল না। লার্নঅপস-এর মজাদার প্র্যাকটিস শিট এবং মেন্টরদের ভালোবাসাপূর্ণ গাইডেন্সে সে এখন নিজ থেকেই প্রতিদিন লেখা চর্চা করে।",
    rating: 5,
    beforeImageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    afterImageUrl:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=400&fit=crop&auto=format",
    courseName: "কিডস আর্লি রাইটিং ফাউন্ডেশন",
    date: "১০ মার্চ, ২০২৪",
  },
];

export const mockSuccessStats: SuccessStat[] = [
  {
    id: "stat-students",
    label: "মোট শিক্ষার্থী",
    value: "৫০+ শিক্ষার্থী",
    description: "সারাদেশজুড়ে সফলভাবে প্রশিক্ষিত",
    type: "students",
  },
  {
    id: "stat-satisfaction",
    label: "সন্তোষজনক হার",
    value: "৯৮% অভিভাবক সন্তুষ্ট",
    description: "অভিভাবকদের ইতিবাচক রিভিউ",
    type: "satisfaction",
  },
  {
    id: "stat-rating",
    label: "গড় রেটিং",
    value: "৪.৯/৫ স্টার",
    description: "৩০০+ ভেরিফাইড রিভিউয়ের ভিত্তিতে",
    type: "rating",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SUCCESS STORIES COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export const SuccessStories: React.FC = () => {
  // Global view style for handwriting images: "side-by-side" or "tabs"
  const [viewMode, setViewMode] = useState<"side-by-side" | "tabs">("side-by-side");

  // Per-card tab state for cards when in "tabs" view mode
  const [activeTabs, setActiveTabs] = useState<Record<string | number, "before" | "after">>({});

  // Lightbox modal state for full-screen inspection
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  const toggleTab = (id: string | number, tab: "before" | "after") => {
    setActiveTabs((prev) => ({ ...prev, [id]: tab }));
  };

  return (
    <section id="success-stories" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/5 via-emerald-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 1. SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-xs border border-emerald-200 dark:border-emerald-800/50"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>সাফল্যের গল্প</span>
          </div>

          {/* Main Heading */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            আমাদের শিক্ষার্থীদের <span className="text-primary underline decoration-primary/30 underline-offset-8">অভাবনীয় উন্নতি</span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            নিয়মিত অনুশীলন ও বিশেষজ্ঞ মেন্টরদের সঠিক গাইডলাইনে শিশুদের হাতের লেখা কীভাবে বদলে গেছে, তার কিছু বাস্তব চিত্র ও অভিভাবকদের অভিজ্ঞতার গল্প।
          </p>

          {/* View Mode Switcher (Side-by-Side vs Tabs) */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-xl bg-card border border-border shadow-xs">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer ${viewMode === "side-by-side"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Columns className="w-4 h-4" />
              <span>পাশাপাশি ভিউ</span>
            </button>
            <button
              onClick={() => setViewMode("tabs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer ${viewMode === "tabs"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Layers className="w-4 h-4" />
              <span>ট্যাব ভিউ</span>
            </button>
          </div>
        </div>

        {/* ── 2. INTERACTIVE SUCCESS STORY CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockSuccessStories.map((story) => {
            const currentTab = activeTabs[story.id] || "after";

            return (
              <div
                key={story.id}
                className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Course Taken Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
                    <span
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-md"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      {story.courseName}
                    </span>
                    <span
                      className="text-xs text-muted-foreground flex items-center gap-1"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <Calendar className="w-3 h-3" />
                      {story.date}
                    </span>
                  </div>

                  {/* Student & Guardian Info */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3
                        className="text-lg font-bold text-foreground group-hover:text-primary transition-colors"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {story.studentName}
                      </h3>
                      <p
                        className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {story.studentGradeOrAge}
                      </p>
                      <p
                        className="text-xs text-muted-foreground mt-0.5"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {story.parentRole}: <span className="font-semibold text-foreground">{story.parentName}</span>
                      </p>
                    </div>

                    {/* Star Rating Indicator */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-0.5 bg-amber-500/10 px-2 py-1 rounded-lg">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${idx < story.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {story.rating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Guardian Review Quote */}
                  <div className="relative mb-6 bg-muted/40 p-4 rounded-xl border border-border/40">
                    <Quote className="w-5 h-5 text-primary/20 absolute -top-2.5 -left-1" />
                    <p
                      className="text-sm text-foreground/90 leading-relaxed italic"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      "{story.reviewText}"
                    </p>
                  </div>

                  {/* ── BEFORE & AFTER HANDWRITING IMAGES ── */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-bold text-foreground flex items-center gap-1"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        হাতে লেখার পরিবর্তন:
                      </span>
                      <button
                        onClick={() => setSelectedStory(story)}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>জুমে দেখুন</span>
                      </button>
                    </div>

                    {/* Mode A: Side-by-side View */}
                    {viewMode === "side-by-side" && (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Before */}
                        <div
                          className="relative rounded-xl overflow-hidden border border-red-200 dark:border-red-900/40 group/img cursor-pointer"
                          onClick={() => setSelectedStory(story)}
                        >
                          <img
                            src={story.beforeImageUrl}
                            alt={`${story.studentName} - শুরুতে`}
                            className="w-full h-32 object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                            শুরুতে
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* After */}
                        <div
                          className="relative rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 group/img cursor-pointer"
                          onClick={() => setSelectedStory(story)}
                        >
                          <img
                            src={story.afterImageUrl}
                            alt={`${story.studentName} - ৪ সপ্তাহ পর`}
                            className="w-full h-32 object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                            ৪ সপ্তাহ পর
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mode B: Tabbed View */}
                    {viewMode === "tabs" && (
                      <div className="bg-muted/30 rounded-xl p-2 border border-border/50">
                        {/* Tab buttons */}
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => toggleTab(story.id, "before")}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${currentTab === "before"
                                ? "bg-red-500 text-white shadow-xs"
                                : "bg-card text-muted-foreground hover:text-foreground"
                              }`}
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                          >
                            শুরুতে (Before)
                          </button>
                          <button
                            onClick={() => toggleTab(story.id, "after")}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${currentTab === "after"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-card text-muted-foreground hover:text-foreground"
                              }`}
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                          >
                            ৪ সপ্তাহ পর (After)
                          </button>
                        </div>

                        {/* Tab Content Image */}
                        <div
                          className="relative rounded-lg overflow-hidden cursor-pointer group/img"
                          onClick={() => setSelectedStory(story)}
                        >
                          <img
                            src={currentTab === "before" ? story.beforeImageUrl : story.afterImageUrl}
                            alt={`${story.studentName} - ${currentTab === "before" ? "শুরুতে" : "৪ সপ্তাহ পর"}`}
                            className="w-full h-40 object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3. STATISTICS COUNTER BAR (Below Stories) ── */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {mockSuccessStats.map((stat, idx) => {
              const icons = {
                students: <Users className="w-8 h-8 text-primary" />,
                satisfaction: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
                rating: <Award className="w-8 h-8 text-amber-500" />,
              };

              return (
                <div
                  key={stat.id}
                  className={`flex items-center gap-5 ${idx !== 0 ? "pt-6 md:pt-0 md:pl-8" : ""}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center flex-shrink-0 border border-border/50 shadow-xs">
                    {icons[stat.type]}
                  </div>
                  <div>
                    <div
                      className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-sm font-bold text-primary mt-0.5"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {stat.label}
                    </div>
                    <div
                      className="text-xs text-muted-foreground mt-0.5"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {stat.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. BEFORE & AFTER LIGHTBOX MODAL ── */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-md" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {selectedStory.courseName}
              </span>
              <h3 className="text-2xl font-bold text-foreground mt-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {selectedStory.studentName}-এর হস্তলিপি পরিবর্তন
              </h3>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {selectedStory.studentGradeOrAge} • {selectedStory.parentRole}: {selectedStory.parentName}
              </p>
            </div>

            {/* Side-by-side Full Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ● শুরুতে (Before Training)
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-red-500/30">
                  <img src={selectedStory.beforeImageUrl} alt="Before" className="w-full h-56 object-cover" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ● ৪ সপ্তাহ পর (After Training)
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                  <img src={selectedStory.afterImageUrl} alt="After" className="w-full h-56 object-cover" />
                </div>
              </div>
            </div>

            {/* Review quote in modal */}
            <div className="bg-muted/50 p-4 rounded-xl border border-border/60 text-sm italic text-foreground/90" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              "{selectedStory.reviewText}"
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SuccessStories;
