import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import CourseListPage from "./CourseListPage";
import CourseDetailPage from "./CourseDetailPage";
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Star,
  Play,
  CheckCircle2,
  BookOpen,
  Video,
  Award,
  Users,
  PenLine,
  Clock,
  Globe2,
  MessageCircle,
  Quote,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Search,
  Sparkles,
  TrendingUp,
  Shield,
  Notebook,
  ClipboardCheck,
  BadgeCheck,
  Headphones,
  PlayCircle,
  CalendarDays,
  ThumbsUp,
  Zap,
} from "lucide-react";

function cn(...c: (string | undefined | false)[]) {
  return c.filter(Boolean).join(" ");
}

/* ─── dark mode ─── */
function useDarkMode() {
  const [dark, setDark] = useState(false);
  const toggle = () =>
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  return { dark, toggle };
}

type Page = "home" | "courses" | "course-detail" | "login" | "dashboard";

/* ══════════════════════════════════════════
   COURSE DATA
   We export this so that CourseDetailPage can import it.
══════════════════════════════════════════ */
export const ALL_COURSES = [
  {
    id: 1,
    title: "২৫ দিনে সুন্দর হাতের লেখা",
    titleTag: "সবচেয়ে জনপ্রিয়",
    tagColor: "bg-amber-500",
    ageMin: 6, ageMax: 12,
    ageLabel: "৬–১২ বছর",
    duration: "২৫ দিন",
    durationMonths: 1,
    price: 2500,
    priceLabel: "৳২,৫০০",
    rating: 4.9,
    reviews: 312,
    students: "১,২৪০",
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1400&h=700&fit=crop&auto=format",
    level: "সব স্তর",
    levelColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    desc: "স্বল্প সময়ে বর্ণমালা গঠন, লাইনের সোজা ভাব এবং দ্রুত ও সুন্দর হাতের লেখার বিশেষ টেকনিক।",
    features: ["বর্ণমালা গঠন টেকনিক", "লাইনে সোজা লেখার কৌশল", "দ্রুত লেখার প্র্যাকটিস শিট", "মেন্টর ফিডব্যাক সেশন"],
    instructor: "ফারহানা বেগম",
    badge: "✍️",
    teacherImg: "https://images.unsplash.com/photo-1629360021730-3d258452c425?w=300&h=300&fit=crop&auto=format",
    teacherTitle: "হস্তলিখন মেন্টর",
    teacherExp: "৬ বছর",
    teacherStudents: "৯৪০+",
    teacherRating: 5.0,
    teacherBio: "ফারহানা বেগম শিশুদের হস্তলিখন উন্নয়নে বিশেষজ্ঞ। তিনি ঢাকা বিশ্ববিদ্যালয় থেকে শিক্ষা বিজ্ঞানে স্নাতকোত্তর করেছেন এবং ৬ বছরেরও বেশি সময় ধরে শিশুদের পড়াচ্ছেন।",
  },
  {
    id: 2,
    title: "মাত্র ৩০ দিনে ছোট থেকে সুন্দর হাতের লেখা",
    titleTag: "সেরা বিক্রিত",
    tagColor: "bg-emerald-500",
    ageMin: 4, ageMax: 7,
    ageLabel: "৪–৭ বছর",
    duration: "৩০ দিন",
    durationMonths: 1,
    price: 2000,
    priceLabel: "৳২,০০০",
    rating: 4.8,
    reviews: 284,
    students: "৯৮০",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&h=700&fit=crop&auto=format",
    level: "বিগিনার",
    levelColor: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    desc: "ছোট বাচ্চাদের পেন্সিল গ্রিপ, স্টক প্র্যাকটিস এবং বর্ণমালার নিখুঁত আকৃতি শেখানোর বেসিক কোর্স।",
    features: ["পেন্সিল গ্রিপ কারেকশন", "বেসিক বর্ণমালা গঠন", "রঙিন ক্যালিগ্রাফি চার্ট", "লাইভ প্যারেন্টিং সেশন"],
    instructor: "রাহেলা খাতুন",
    badge: "👦",
    teacherImg: "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=300&h=300&fit=crop&auto=format",
    teacherTitle: "হস্তলিখন বিশেষজ্ঞ",
    teacherExp: "১২ বছর",
    teacherStudents: "১,২০০+",
    teacherRating: 4.9,
    teacherBio: "রাহেলা খাতুন LearnOps-এর প্রধান মেন্টর এবং হাতের লেখা গবেষক।",
  },
  {
    id: 3,
    title: "8 WEEKS ENGLISH SPEAKING (start program)",
    titleTag: "নতুন",
    tagColor: "bg-blue-500",
    ageMin: 8, ageMax: 15,
    ageLabel: "৮–১৫ বছর",
    duration: "৮ সপ্তাহ",
    durationMonths: 2,
    price: 3500,
    priceLabel: "৳৩,৫০০",
    rating: 4.9,
    reviews: 198,
    students: "৭৬০",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1400&h=700&fit=crop&auto=format",
    level: "বিগিনার-মিড",
    levelColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    desc: "শিশুদের জড়তা কাটিয়ে ফ্লুয়েন্টলি ইংরেজিতে কথা বলার আত্মবিশ্বাস তৈরির স্পেশাল স্পোকেন প্রোগ্রাম।",
    features: ["স্পোকেন প্র্যাকটিস সেশন", "ভীতি কাটানোর কৌশল", "দৈনন্দিন কথোপকথন ভোকাবুলারি", "পাবলিক স্পিকিং গেম"],
    instructor: "মো. আরিফুল ইসলাম",
    badge: "🗣️",
    teacherImg: "https://images.unsplash.com/photo-1616587894289-86480e533129?w=300&h=300&fit=crop&auto=format",
    teacherTitle: "ইংরেজি স্পোকেন ট্রেইনার",
    teacherExp: "৮ বছর",
    teacherStudents: "৮৫০+",
    teacherRating: 4.8,
    teacherBio: "মো. আরিফুল ইসলাম ইংরেজি ভাষা শিক্ষা ও ক্যালিগ্রাফিতে বিশেষ অভিজ্ঞতাসম্পন্ন প্রশিক্ষক।",
  },
  {
    id: 4,
    title: "READING & SPELLING DEVELOPMENT with PHONICS",
    titleTag: "সব স্তর",
    tagColor: "bg-purple-500",
    ageMin: 5, ageMax: 10,
    ageLabel: "৫–১০ বছর",
    duration: "২ মাস",
    durationMonths: 2,
    price: 2800,
    priceLabel: "৳২,৮০০",
    rating: 4.8,
    reviews: 221,
    students: "৮৩০",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&h=700&fit=crop&auto=format",
    level: "সব স্তর",
    levelColor: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    desc: "ফোনিক্স সাউন্ডের মাধ্যমে ইংরেজি সঠিকভাবে পড়া, বানান শেখা এবং উচ্চারণের জড়তা দূর করার কোর্স।",
    features: ["ফোনিক্স সাউন্ডস লেসন", "বানান মনে রাখার শর্টকাট", "রিডিং ফ্লুয়েন্সি টেস্ট", "উચ્চারণ সংশোধনী সেশন"],
    instructor: "সুমাইয়া আক্তার",
    badge: "📖",
    teacherImg: "https://images.unsplash.com/photo-1588873281272-14886ba1f737?w=300&h=300&fit=crop&auto=format",
    teacherTitle: "ভাষা শিক্ষা বিশেষজ্ঞ",
    teacherExp: "৫ বছর",
    teacherStudents: "৬৮০+",
    teacherRating: 4.9,
    teacherBio: "সুমাইয়া আক্তার ফোনিক্স ও রিডিং স্কিল ডেভলপমেন্টে দীর্ঘদিনের অভিজ্ঞতাসম্পন্ন একজন মেন্টর।",
  },
  {
    id: 5,
    title: "কুরআন সালাত ও আদব শিক্ষা",
    titleTag: "প্রিমিয়াম",
    tagColor: "bg-teal-500",
    ageMin: 6, ageMax: 15,
    ageLabel: "৬–১৫ বছর",
    duration: "৩ মাস",
    durationMonths: 3,
    price: 3000,
    priceLabel: "৳৩,০০০",
    rating: 5.0,
    reviews: 143,
    students: "৫২০",
    img: "https://images.unsplash.com/photo-1609599006353-e629f1d40968?w=600&h=400&fit=crop&auto=format",
    heroImg: "https://images.unsplash.com/photo-1609599006353-e629f1d40968?w=1400&h=700&fit=crop&auto=format",
    level: "বিগিনার",
    levelColor: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300",
    desc: "মাখরাজ ও তাজবীদ সহ কুরআন তিলাওয়াত, দৈনন্দিন সালাতের নিয়ম এবং ইসলামিক আদব-কায়দা শিক্ষা।",
    features: ["সহীহ তাজবীদ শিক্ষা", "সালাত প্র্যাকটিস ক্লাস", "ইসলামিক আদব ও সুন্নাহ", "মাসিক কুইজ ও উপহার"],
    instructor: "রাহেলা খাতুন",
    badge: "🕌",
    teacherImg: "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=300&h=300&fit=crop&auto=format",
    teacherTitle: "ইসলামিক শিক্ষিকা",
    teacherExp: "১২ বছর",
    teacherStudents: "১,২০০+",
    teacherRating: 4.9,
    teacherBio: "রাহেলা খাতুন তাজবীদুল কুরআন এবং ইসলামিক শিষ্টাচার শিক্ষাদানে দীর্ঘ অভিজ্ঞতাসম্পন্ন।",
  },
];

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar({
  dark, toggleDark, page, setPage,
}: {
  dark: boolean; toggleDark: () => void; page: Page; setPage: (p: Page) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "হোম", target: "home" as Page },
    { label: "কোর্সসমূহ", target: "courses" as Page },
    { label: "সাফল্যের গল্প", target: "home" as Page },
    { label: "শিক্ষকবৃন্দ", target: "home" as Page },
    { label: "যোগাযোগ", target: "home" as Page },
  ];

  const activePage = page === "course-detail" ? "courses" : page;

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled || page !== "home" ? "bg-background/95 backdrop-blur-md shadow-md shadow-black/5" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <button onClick={() => setPage("home")} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-300/30">
              <PenLine className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">Learn<span className="text-primary">Ops</span></span>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <button key={l.label} onClick={() => setPage(l.target)}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className={cn("text-sm font-medium transition-colors relative group cursor-pointer",
                  activePage === l.target ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                {l.label}
                <span className={cn("absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300",
                  activePage === l.target ? "w-full" : "w-0 group-hover:w-full")} />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={toggleDark} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setPage("login")} style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="text-sm font-semibold text-foreground border border-border px-4 py-2 rounded-full hover:bg-muted transition-colors cursor-pointer">লগ ইন</button>
            <button onClick={() => setPage("courses")} style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all shadow-lg shadow-green-200/50 cursor-pointer">
              শুরু করুন <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button onClick={toggleDark} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted cursor-pointer">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setOpen((o) => !o)} className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-muted cursor-pointer">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-background border-t border-border px-4 pb-5 pt-3 space-y-1">
          {links.map((l) => (
            <button key={l.label} onClick={() => { setPage(l.target); setOpen(false); }}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className={cn("w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer",
                activePage === l.target ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
              {l.label}
            </button>
          ))}
          <div className="flex gap-2 pt-3">
            <button onClick={() => { setPage("login"); setOpen(false); }} style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="flex-1 text-sm font-semibold border border-border py-2.5 rounded-xl hover:bg-muted cursor-pointer">লগ ইন</button>
            <button onClick={() => { setPage("courses"); setOpen(false); }}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="flex-1 text-sm font-semibold bg-primary text-white py-2.5 rounded-xl hover:bg-green-600 cursor-pointer">শুরু করুন</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO (homepage)
══════════════════════════════════════════ */
function Hero({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-[700px] h-[700px] rounded-full bg-green-100 dark:bg-green-950/20 blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-red-50 dark:bg-red-950/10 blur-3xl opacity-40" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold px-4 py-2 rounded-full border border-red-100 dark:border-red-900/40"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              বাংলাদেশের সেরা অনলাইন হ্যান্ডরাইটিং কোর্স
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-foreground"
              style={{ fontFamily: "'Hind Siliguri', sans-serif", lineHeight: "1.3" }}>
              সুন্দর হাতের লেখাই{" "}
              <span className="text-primary relative">সন্তানের
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C60 3 120 0 180 4C220 7 260 9 298 6" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              <span className="text-red-500">আত্মবিশ্বাস বাড়ায়</span>
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              ভিডিও ক্লাস, বিশেষ হ্যান্ডরাইটিং খাতা এবং অভিজ্ঞ শিক্ষকদের ব্যক্তিগত গাইডলাইনের মাধ্যমে আপনার শিশুর হাতের লেখা উন্নত করুন।
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPage("courses")}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-4 rounded-full text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-200/60 hover:-translate-y-0.5 cursor-pointer">
                কোর্স দেখুন <ArrowRight className="w-4 h-4" />
              </button>
              <button style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className="inline-flex items-center gap-2.5 bg-card border border-border text-foreground font-bold px-7 py-4 rounded-full text-sm hover:bg-muted transition-all hover:-translate-y-0.5 cursor-pointer">
                <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </span>
                ফ্রি ডেমো দেখুন
              </button>
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              {[{ num: "৫,০০০+", label: "সক্রিয় শিক্ষার্থী" }, { num: "৯৮%", label: "সাফল্যের হার" }, { num: "৫০+", label: "অভিজ্ঞ শিক্ষক" }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.num}</div>
                  <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                <img src="https://images.unsplash.com/photo-1560785496-3c9d27877182?w=600&h=420&fit=crop&auto=format" alt="Child writing" className="w-full h-72 object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>বেগিনার হ্যান্ডরাইটিং কোর্স</span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>লাইভ</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-3"><div className="bg-primary h-1.5 rounded-full" style={{ width: "65%" }} /></div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {["👦", "👧", "🧒", "👦"].map((e, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 border-2 border-background text-sm flex items-center justify-center">{e}</div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>৩২ জন এনরোলড</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-white dark:bg-card border border-border rounded-2xl p-3.5 shadow-xl flex items-center gap-3 max-w-[180px]">
                <img src="https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=80&h=80&fit=crop&auto=format" alt="Teacher" className="w-11 h-11 rounded-xl object-cover" />
                <div>
                  <div className="text-xs font-bold text-foreground">রাহেলা ম্যাম</div>
                  <div className="text-[10px] text-primary font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অনলাইনে আছেন</div>
                  <div className="flex gap-0.5 mt-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CAROUSEL
══════════════════════════════════════════ */
const slides = [
  { img: "https://images.unsplash.com/photo-1678822872007-698d622afeb7?w=1400&h=700&fit=crop&auto=format", tag: "শিক্ষার্থীর খাতা", title: "বিশেষ হ্যান্ডরাইটিং খাতা", desc: "আমাদের ডিজাইন করা বিশেষ খাতায় শিশুরা সহজেই সুন্দর লেখা রপ্ত করতে পারে।" },
  { img: "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=1400&h=700&fit=crop&auto=format", tag: "লাইভ ক্লাস", title: "শিক্ষকের সরাসরি গাইডলাইন", desc: "অভিজ্ঞ শিক্ষকরা প্রতিটি শিক্ষার্থীকে আলাদাভাবে মনোযোগ দেন।" },
  { img: "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=1400&h=700&fit=crop&auto=format", tag: "আগে ও পরে", title: "অবিশ্বাস্য পরিবর্তন মাত্র ৩০ দিনে", desc: "আমাদের শিক্ষার্থীদের হাতের লেখার আগে ও পরের তুলনা দেখলে আপনি অবাক হবেন।" },
  { img: "https://images.unsplash.com/photo-1623076189461-f7706b741c04?w=1400&h=700&fit=crop&auto=format", tag: "অনলাইন ক্লাস", title: "ঘরে বসেই পেশাদার ক্লাস", desc: "উচ্চমানের ভিডিও ক্লাস ও লাইভ সেশনে অংশ নিন।" },
  { img: "https://images.unsplash.com/photo-1778338790249-a2f033a11b99?w=1400&h=700&fit=crop&auto=format", tag: "সার্টিফিকেট", title: "সাফল্যের স্বীকৃতি", desc: "কোর্স সম্পন্ন করলে স্বীকৃত সার্টিফিকেট পাবে আপনার সন্তান।" },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আমাদের প্ল্যাটফর্ম</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>একতু দেখুন, সিদ্ধান্ত নিন</h2>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative h-[320px] sm:h-[440px] lg:h-[540px] bg-muted">
            {slides.map((s, i) => (
              <div key={i} className={cn("absolute inset-0 transition-opacity duration-700", i === current ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.tag}</span>
                  <h3 className="text-xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.title}</h3>
                  <p className="text-sm sm:text-base text-white/80 max-w-lg" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><ArrowRight className="w-5 h-5" /></button>
          <div className="absolute bottom-6 right-8 flex gap-2">
            {slides.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={cn("rounded-full transition-all duration-300", i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/50 hover:bg-white/80")} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   HOME SECTIONS
══════════════════════════════════════════ */
function HomeSections({ setPage }: { setPage: (p: Page) => void }) {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const faqs = [
    { q: "কোন বয়স থেকে ভর্তি হওয়া যাবে?", a: "৫ বছর বয়স থেকে শুরু করে যেকোনো বয়সে ভর্তি হওয়া যাবে।" },
    { q: "কোর্স কীভাবে পরিচালিত হয়?", a: "সপ্তাহে ২টি লাইভ ক্লাস হয় Zoom-এ। প্রতিটি ক্লাস ৪৫ মিনিটের।" },
    { q: "মানি-ব্যাক গ্যারান্টি কীভাবে কাজ করে?", a: "যদি ৩০ দিনের মধ্যে সন্তুষ্ট না হন, আমরা সম্পূর্ণ অর্থ ফেরত দেব।" },
    { q: "একাধিক সন্তান থাকলে কি ছাড় পাব?", a: "হ্যাঁ! ২ বা তার বেশি সন্তানের জন্য ১৫% পারিবারিক ছাড় পাবেন।" },
  ];

  return (
    <>
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>কেন LearnOps বেছে নেবেন?</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আমরা শুধু পড়াই না, <span className="text-primary">গড়ে তুলি</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সুন্দর হাতের লেখা শুধু দেখতে ভালো নয়, এটি শিশুর মনোযোগ ও সৃজনশীলতা বিকাশে গুরুত্বপূর্ণ।</p>
              {["৩০ দিনের মানি-ব্যাক গ্যারান্টি", "বছরে ৪৮টি লাইভ ক্লাস", "অভিভাবক পোর্টালে রিয়েল-টাইম আপডেট"].map((t) => (
                <div key={t} className="flex items-center gap-3 mb-3"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /><span className="text-sm font-medium text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{t}</span></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Video, color: "bg-green-50 dark:bg-green-950/30 text-green-600", border: "border-green-100 dark:border-green-900/30", title: "লাইভ ভিডিও ক্লাস", desc: "প্রতিটি ক্লাস রেকর্ড করা থাকে।" },
                { icon: PenLine, color: "bg-red-50 dark:bg-red-950/30 text-red-600", border: "border-red-100 dark:border-red-900/30", title: "বিশেষ খাতা", desc: "হ্যান্ডরাইটিং খাতা ও কলম।" },
                { icon: Users, color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600", border: "border-blue-100 dark:border-blue-900/30", title: "ব্যক্তিগত মনোযোগ", desc: "ব্যক্তিগতভাবে গাইড করা হয়।" },
                { icon: Award, color: "bg-amber-50 dark:bg-amber-950/30 text-amber-600", border: "border-amber-100 dark:border-amber-900/30", title: "সার্টিফিকেট", desc: "স্বীকৃত সার্টিফিকেট প্রোগ্রাম।" },
                { icon: Clock, color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600", border: "border-purple-100 dark:border-purple-900/30", title: "নিজের সময়ে", desc: "সুবিধামতো সময়ে ক্লাস নিন।" },
                { icon: Globe2, color: "bg-teal-50 dark:bg-teal-950/30 text-teal-600", border: "border-teal-100 dark:border-teal-900/30", title: "সারাদেশে", desc: "যেকোনো জায়গা থেকে শিখুন।" },
              ].map((item) => (
                <div key={item.title} className={cn("bg-card border rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5", item.border)}>
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-3", item.color)}><item.icon className="w-5 h-5" /></div>
                  <h3 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{item.title}</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="success" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সাফল্যের গল্প</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অভিভাবকরা যা বলছেন</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "রাফি আহমেদের মা", role: "ঢাকা", text: "মাত্র ৩ মাসে রাফির লেখা এতটাই সুন্দর হয়ে গেছে যে ওর ক্লাস টিচার অবাক হয়ে গেছেন।", img: "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=80&h=80&fit=crop&auto=format" },
              { name: "তাহিয়ার বাবা", role: "চট্টগ্রাম", text: "তাহিয়া এখন পরীক্ষায় বাড়তি নম্বর পাচ্ছে শুধু সুন্দর লেখার জন্য।", img: "https://images.unsplash.com/photo-1629360021730-3d258452c425?w=80&h=80&fit=crop&auto=format" },
              { name: "সামিনের মা", role: "সিলেট", text: "সামিনের কনফিডেন্স অনেক বেড়ে গেছে। আগে লেখতে চাইত না, এখন নিজেই বসে লেখে।", img: "https://images.unsplash.com/photo-1623076189461-f7706b741c04?w=80&h=80&fit=crop&auto=format" },
            ].map((s) => (
              <div key={s.name} className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-4">
                <Quote className="w-7 h-7 text-primary/30" />
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>"{s.text}"</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <img src={s.img} alt={s.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                  <div>
                    <div className="text-sm font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.name}</div>
                    <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-green-700">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Hind Siliguri', sans-serif", lineHeight: "1.3" }}>আজই আপনার সন্তানের <span className="text-red-300">সুন্দর ভবিষ্যৎ</span> গড়ুন</h2>
          <p className="text-green-100 text-lg mb-8" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>১৪ দিনের বিনামূল্যে ট্রায়াল শুরু করুন।</p>
          <button onClick={() => setPage("courses")} style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-full hover:bg-green-50 transition-all shadow-xl text-sm cursor-pointer">
            বিনামূল্যে শুরু করুন <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-foreground dark:bg-card text-background dark:text-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <PenLine className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl">Learn<span className="text-primary">Ops</span></span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-5 max-w-xs" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              বাংলাদেশের শিশুদের সুন্দর হাতের লেখা শেখানোর সেরা অনলাইন প্ল্যাটফর্ম।
            </p>
            <div className="space-y-2.5">
              {[{ icon: Phone, text: "+880 1700-000000" }, { icon: Mail, text: "hello@learnops.com.bd" }, { icon: MapPin, text: "ধানমন্ডি, ঢাকা ১২০৫" }].map((c) => (
                <div key={c.text} className="flex items-center gap-3 text-sm opacity-70">
                  <c.icon className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors cursor-pointer">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          {[
            { title: "প্ল্যাটফর্ম", links: ["কোর্সসমূহ", "লাইভ ক্লাস", "সার্টিফিকেট", "রেকর্ডেড ভিডিও"] },
            { title: "কোম্পানি", links: ["আমাদের সম্পর্কে", "শিক্ষকবৃন্দ", "ব্লগ", "ক্যারিয়ার"] },
            { title: "সহায়তা", links: ["সাপোর্ট সেন্টার", "গোপনীয়তা নীতি", "শর্তাবলি", "রিফান্ড পলিসি"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm mb-5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}><button className="text-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{l}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex justify-between items-center gap-3 flex-wrap">
          <p className="text-xs opacity-50" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>© ২০২৪ LearnOps Bangladesh। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function App() {
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<"BN" | "EN">("BN");

  const isAuthOrDashboard = location.pathname === "/login" || location.pathname === "/dashboard";

  let page: Page = "home";
  if (location.pathname === "/courses") page = "courses";
  else if (location.pathname.startsWith("/course/")) page = "course-detail";
  else if (location.pathname === "/login") page = "login";
  else if (location.pathname === "/dashboard") page = "dashboard";

  const handleNavigate = (p: Page) => {
    if (p === "home") navigate("/");
    else if (p === "courses") navigate("/courses");
    else if (p === "login") navigate("/login");
    else if (p === "dashboard") navigate("/dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }} className="min-h-screen bg-background text-foreground">
      {!isAuthOrDashboard && (
        <Navbar dark={dark} toggleDark={toggle} page={page} setPage={handleNavigate} />
      )}

      <Routes>
        <Route path="/" element={
          <>
            <Hero setPage={handleNavigate} />
            <Carousel />
            <HomeSections setPage={handleNavigate} />
            <Footer setPage={handleNavigate} />
          </>
        } />
        <Route path="/courses" element={
          <>
            <CourseListPage dark={dark} toggleDark={toggle} lang={lang} setLang={setLang} />
            <Footer setPage={handleNavigate} />
          </>
        } />
        <Route path="/course/:id" element={
          <>
            <CourseDetailPage dark={dark} toggleDark={toggle} lang={lang} />
            <Footer setPage={handleNavigate} />
          </>
        } />
        <Route path="/login" element={
          <LoginPage onLogin={() => navigate("/dashboard")} />
        } />
        <Route path="/dashboard" element={
          <Dashboard dark={dark} toggleDark={toggle} onLogout={() => navigate("/login")} />
        } />
      </Routes>
    </div>
  );
}
