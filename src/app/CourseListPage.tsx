import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  CalendarDays,
  Users,
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";

export const GOOGLE_FORM_URL = "https://forms.google.com/demo-enrollment-form";

export interface Course {
  id: number;
  title: string;
  titleEN: string;
  category: string;
  categoryBengali: string;
  ageGroup: string;
  ageGroupEN: string;
  duration: string;
  durationEN: string;
  price: string;
  priceEN: string;
  priceNum: number;
  description: string;
  descriptionEN: string;
  rating: number;
  reviews: number;
  students: string;
  studentsEN: string;
  img: string;
  badge: string;
  gradient: string;
  bgLight: string;
  textAccent: string;
  borderAccent: string;
  ringAccent: string;
  level: string;
  levelEN: string;
}

export const COURSES: Course[] = [
  {
    id: 1,
    title: "২৫ দিনে সুন্দর হাতের লেখা",
    titleEN: "Beautiful Handwriting in 25 Days",
    category: "Bengali Handwriting",
    categoryBengali: "বাংলা হাতের লেখা",
    ageGroup: "৬-১২ বছর",
    ageGroupEN: "6-12 Years",
    duration: "২৫ দিন",
    durationEN: "25 Days",
    price: "৳২,৫০০",
    priceEN: "৳2,500",
    priceNum: 2500,
    description: "স্বল্প সময়ে বর্ণমালা গঠন, লাইনের সোজা ভাব এবং দ্রুত ও সুন্দর হাতের লেখার বিশেষ টেকনিক।",
    descriptionEN: "Special techniques for alphabet formation, straight lines, and fast, beautiful handwriting in a short time.",
    rating: 4.9,
    reviews: 312,
    students: "১,২৪০",
    studentsEN: "1,240",
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    badge: "✍️",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    borderAccent: "border-amber-200 dark:border-amber-900/40",
    ringAccent: "ring-amber-400",
    level: "সব স্তর",
    levelEN: "All Levels",
  },
  {
    id: 2,
    title: "মাত্র ৩০ দিনে ছোট থেকে সুন্দর হাতের লেখা",
    titleEN: "Beautiful Handwriting for Kids in 30 Days",
    category: "Kids Handwriting",
    categoryBengali: "হাতের লেখা বেসিক",
    ageGroup: "৪-৭ বছর",
    ageGroupEN: "4-7 Years",
    duration: "৩০ দিন",
    durationEN: "30 Days",
    price: "৳২,০০০",
    priceEN: "৳2,000",
    priceNum: 2000,
    description: "ছোট বাচ্চাদের পেন্সিল গ্রিপ, স্টক প্র্যাকটিস এবং বর্ণমালার নিখুঁত আকৃতি শেখানোর বেসিক কোর্স।",
    descriptionEN: "Basic course to teach pencil grip, stroke practice, and perfect alphabet shapes for young kids.",
    rating: 4.8,
    reviews: 284,
    students: "৯৮০",
    studentsEN: "980",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    badge: "👦",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-emerald-200 dark:border-emerald-900/40",
    ringAccent: "ring-emerald-400",
    level: "বিগিনার",
    levelEN: "Beginner",
  },
  {
    id: 3,
    title: "8 WEEKS ENGLISH SPEAKING (start program)",
    titleEN: "8 WEEKS ENGLISH SPEAKING (start program)",
    category: "Spoken English",
    categoryBengali: "ইংরেজি স্পোকেন",
    ageGroup: "৮-১৫ বছর",
    ageGroupEN: "8-15 Years",
    duration: "৮ সপ্তাহ",
    durationEN: "8 Weeks",
    price: "৳৩,৫০০",
    priceEN: "৳3,500",
    priceNum: 3500,
    description: "শিশুদের জড়তা কাটিয়ে ফ্লুয়েন্টলি ইংরেজিতে কথা বলার আত্মবিশ্বাস তৈরির স্পেশাল স্পোকেন প্রোগ্রাম।",
    descriptionEN: "Special spoken program to build children's confidence in speaking English fluently by overcoming hesitation.",
    rating: 4.9,
    reviews: 198,
    students: "৭৬০",
    studentsEN: "760",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop&auto=format",
    badge: "🗣️",
    gradient: "from-blue-600 to-indigo-700",
    bgLight: "bg-blue-50 dark:bg-blue-950/20",
    textAccent: "text-blue-600 dark:text-blue-400",
    borderAccent: "border-blue-200 dark:border-blue-900/40",
    ringAccent: "ring-blue-400",
    level: "বিগিনার-মিড",
    levelEN: "Beginner-Mid",
  },
  {
    id: 4,
    title: "READING & SPELLING DEVELOPMENT with PHONICS",
    titleEN: "READING & SPELLING DEVELOPMENT with PHONICS",
    category: "Phonics & Language",
    categoryBengali: "ফোনিক্স ও উচ্চারণ",
    ageGroup: "৫-১০ বছর",
    ageGroupEN: "5-10 Years",
    duration: "২ মাস",
    durationEN: "2 Months",
    price: "৳২,৮০০",
    priceEN: "৳2,800",
    priceNum: 2800,
    description: "ফোনিক্স সাউন্ডের মাধ্যমে ইংরেজি সঠিকভাবে পড়া, বানান শেখা এবং উচ্চারণের জড়তা দূর করার কোর্স।",
    descriptionEN: "Course to correctly read English, learn spelling, and remove pronunciation hesitation through phonics sounds.",
    rating: 4.8,
    reviews: 221,
    students: "৮৩০",
    studentsEN: "830",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop&auto=format",
    badge: "📖",
    gradient: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/20",
    textAccent: "text-purple-600 dark:text-purple-400",
    borderAccent: "border-purple-200 dark:border-purple-900/40",
    ringAccent: "ring-purple-400",
    level: "সব স্তর",
    levelEN: "All Levels",
  },
  {
    id: 5,
    title: "কুরআন সালাত ও আদব শিক্ষা",
    titleEN: "Quran, Prayer & Etiquette Education",
    category: "Islamic Studies",
    categoryBengali: "ইসলামিক স্টাডিজ",
    ageGroup: "৬-১৫ বছর",
    ageGroupEN: "6-15 Years",
    duration: "৩ মাস",
    durationEN: "3 Months",
    price: "৳৩,০০০",
    priceEN: "৳3,000",
    priceNum: 3000,
    description: "মাখরাজ ও তাজবীদ সহ কুরআন তিলাওয়াত, দৈনন্দিন সালাতের নিয়ম এবং ইসলামিক আদব-কায়দা শিক্ষা।",
    descriptionEN: "Recitation of Quran with proper pronunciation and rules, daily prayers, and Islamic etiquette education.",
    rating: 5.0,
    reviews: 143,
    students: "৫২০",
    studentsEN: "520",
    img: "https://images.unsplash.com/photo-1609599006353-e629f1d40968?w=600&h=400&fit=crop&auto=format",
    badge: "🕌",
    gradient: "from-teal-700 to-emerald-800",
    bgLight: "bg-teal-50 dark:bg-teal-950/20",
    textAccent: "text-teal-700 dark:text-teal-400",
    borderAccent: "border-teal-200 dark:border-teal-900/40",
    ringAccent: "ring-teal-400",
    level: "বিগিনার",
    levelEN: "Beginner",
  },
];

interface CourseListPageProps {
  dark?: boolean;
  toggleDark?: () => void;
  lang: "BN" | "EN";
  setLang: (lang: "BN" | "EN") => void;
}

export default function CourseListPage({ dark, toggleDark, lang, setLang }: CourseListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Handwriting", "English", "Language", "Islamic"];

  const getFriendlyCategoryName = (cat: string) => {
    if (lang === "BN") {
      switch (cat) {
        case "Handwriting":
          return "হাতের লেখা";
        case "English":
          return "ইংরেজি স্পোকেন";
        case "Language":
          return "ফোনিক্স ও ভাষা";
        case "Islamic":
          return "ইসলামিক শিক্ষা";
        default:
          return "সব কোর্সসমূহ";
      }
    } else {
      switch (cat) {
        case "Handwriting":
          return "Handwriting";
        case "English":
          return "Spoken English";
        case "Language":
          return "Phonics & Language";
        case "Islamic":
          return "Islamic Studies";
        default:
          return "All Courses";
      }
    }
  };

  const filteredCourses = COURSES.filter((course) => {
    const titleToSearch = lang === "BN" ? course.title : course.titleEN;
    const descToSearch = lang === "BN" ? course.description : course.descriptionEN;
    const matchesSearch =
      titleToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Handwriting" && course.category.includes("Handwriting")) ||
      (selectedCategory === "English" && course.category.includes("English")) ||
      (selectedCategory === "Language" && course.category.includes("Phonics")) ||
      (selectedCategory === "Islamic" && course.category.includes("Islamic"));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Page Header Banner ── */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-700 pt-32 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Theme Toggle integration */}
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center gap-2 text-green-100 text-xs sm:text-sm animate-fade-in"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <span>{lang === "BN" ? "হোম" : "Home"}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-white font-semibold">{lang === "BN" ? "কোর্সসমূহ" : "Courses"}</span>
            </div>

            {toggleDark && (
              <button
                onClick={toggleDark}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/20 cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Title, Subtitle and Language Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-full mb-5"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Sparkles className="w-3.5 h-3.5 text-green-200" />{" "}
                {lang === "BN" ? "আপনার সন্তানের নিখুঁত দক্ষতার বিকাশ" : "Nurturing Your Child's Perfect Skills"}
              </div>

              {/* Title with inline language switcher */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1
                  className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif", lineHeight: "1.3" }}
                >
                  {lang === "BN" ? "আমাদের স্পেশাল কোর্সসমূহ" : "Our Special Courses"}
                </h1>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 flex items-center shadow-lg">
                  <button
                    onClick={() => setLang("BN")}
                    className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      lang === "BN"
                        ? "bg-white text-green-700 shadow-sm"
                        : "text-white hover:bg-white/15"
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setLang("EN")}
                    className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      lang === "EN"
                        ? "bg-white text-green-700 shadow-sm"
                        : "text-white hover:bg-white/15"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <p
                className="text-green-50 text-base sm:text-lg leading-relaxed font-medium"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {lang === "BN"
                  ? "আপনার শিশুর হাতের লেখা ও দক্ষতার বিকাশে বিশেষভাবে তৈরি কোর্সসমূহ"
                  : "Specially designed courses to improve your child's handwriting and skills"}
              </p>
            </div>

            {/* Stats Badge */}
            <div className="flex gap-6 lg:self-center bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
              {[
                { val: `${COURSES.length}টি`, valEN: `${COURSES.length}`, label: "স্পেশাল কোর্স", labelEN: "Special Courses" },
                { val: "৫,০০০+", valEN: "5,000+", label: "সফল শিক্ষার্থী", labelEN: "Students" },
                { val: "১০+", valEN: "10+", label: "বিশেষজ্ঞ মেন্টর", labelEN: "Expert Mentors" },
              ].map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {lang === "BN" ? s.val : s.valEN}
                  </div>
                  <div className="text-[10px] sm:text-xs text-green-200" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {lang === "BN" ? s.label : s.labelEN}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search, Filters, and Navigation Bar ── */}
      <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "BN"
                    ? "কোর্সের নাম বা কি-ওয়ার্ড দিয়ে খুঁজুন..."
                    : "Search by course name or keyword..."
                }
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Category Filter Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-primary border-primary text-white shadow-lg shadow-green-200/50 dark:shadow-green-950/40"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {getFriendlyCategoryName(cat)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Courses Count bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
          {lang === "BN"
            ? `মোট ${filteredCourses.length}টি কোর্স পাওয়া গেছে`
            : `Total ${filteredCourses.length} courses found`}
        </p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary animate-pulse" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {lang === "BN"
              ? "এই সপ্তাহে ৪০০+ শিক্ষার্থী ভর্তি হয়েছে"
              : "400+ students enrolled this week"}
          </span>
        </div>
      </div>

      {/* ── Course Grid View ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-24 bg-card border border-border rounded-3xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {lang === "BN" ? "দুঃখিত, কোনো কোর্স খুঁজে পাওয়া যায়নি!" : "Sorry, no courses found!"}
            </h3>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {lang === "BN" ? "অন্য কোনো কিওয়ার্ড বা ক্যাটাগরি দিয়ে চেষ্টা করুন।" : "Try searching with other keywords or categories."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              return (
                <div
                  key={course.id}
                  className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-green-600/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Image Header with dynamic gradient overlay and badge indicator */}
                  <div className="relative h-56 bg-muted overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={course.img}
                      alt={lang === "BN" ? course.title : course.titleEN}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Dynamic Gradient Overlay based on visual theme */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${course.gradient} opacity-25 mix-blend-overlay`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      {/* Dynamic badge based on gradient */}
                      <span
                        className={`text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md bg-gradient-to-r ${course.gradient}`}
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {lang === "BN" ? course.categoryBengali : course.category}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/10"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {lang === "BN" ? course.level : course.levelEN}
                      </span>
                    </div>

                    {/* Emoji Floating Badge with dynamic theme accent shadow */}
                    <div
                      className={`absolute bottom-4 right-4 w-12 h-12 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-border group-hover:scale-110 transition-transform duration-300`}
                    >
                      {course.badge}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div>
                      <h3
                        className="font-bold text-lg text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {lang === "BN" ? course.title : course.titleEN}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {lang === "BN" ? "ক্যাটাগরি:" : "Category:"}
                        </span>
                        <span
                          className={`text-xs font-bold ${course.textAccent}`}
                          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          {course.category}
                        </span>
                      </div>
                    </div>

                    <p
                      className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {lang === "BN" ? course.description : course.descriptionEN}
                    </p>

                    {/* Pill Badges for metadata */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[11px] font-semibold border border-transparent"
                      >
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span className="ml-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                          {lang === "BN" ? `বয়স: ${course.ageGroup}` : `Age: ${course.ageGroupEN}`}
                        </span>
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[11px] font-semibold border border-transparent"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-primary" />
                        <span className="ml-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                          {lang === "BN" ? `মেয়াদ: ${course.duration}` : `Duration: ${course.durationEN}`}
                        </span>
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[11px] font-semibold border border-transparent"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span className="ml-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                          {lang === "BN" ? `${course.students} শিক্ষার্থী` : `${course.studentsEN} Students`}
                        </span>
                      </Badge>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 text-xs border-t border-border/50 pt-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= Math.round(course.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-foreground">{course.rating}</span>
                      <span className="text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {lang === "BN" ? `(${course.reviews} রিভিউ)` : `(${course.reviews} reviews)`}
                      </span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Pricing and Action Buttons footer */}
                    <div className="border-t border-border pt-4 mt-2">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span
                            className="text-2xl font-extrabold text-foreground"
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                          >
                            {lang === "BN" ? course.price : course.priceEN}
                          </span>
                          <span
                            className="text-xs text-muted-foreground ml-1"
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                          >
                            {lang === "BN" ? "/ সম্পূর্ণ কোর্স" : "/ Full Course"}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-800/40 px-2.5 py-1 rounded-full`}
                          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          {lang === "BN" ? "EMI উপলব্ধ" : "EMI Available"}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/course/${course.id}`)}
                          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                          className="flex-1 text-xs font-bold rounded-2xl border-border py-5 text-foreground hover:bg-muted transition-all cursor-pointer"
                        >
                          {lang === "BN" ? "বিস্তারিত দেখুন" : "View Details"}
                        </Button>
                        <Button
                          asChild
                          className="flex-1 text-xs font-bold rounded-2xl transition-all hover:scale-[1.02] cursor-pointer py-5 flex items-center justify-center gap-1.5 shadow-md bg-primary text-white hover:bg-green-600 shadow-green-200/50 dark:shadow-green-950/40"
                        >
                          <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                            {lang === "BN" ? "এনরোল করুন" : "Enroll Now"} →
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}