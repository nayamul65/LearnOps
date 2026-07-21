import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  Clock,
  Globe2,
  Award,
  Zap,
  Play,
  Shield,
  BadgeCheck,
  CheckCircle2,
  BookOpen,
  ClipboardCheck,
  Headphones,
  PlayCircle,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Quote,
} from "lucide-react";
import { ALL_COURSES } from "./App";
import { GOOGLE_FORM_URL } from "./CourseListPage";

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${
            s <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

const getLearnItems = (category: string, isEnglish: boolean) => {
  if (category.includes("Handwriting")) {
    return isEnglish
      ? [
          "Bangla Handwriting — from letters to sentences",
          "English Handwriting — both Print and Cursive styles",
          "Letter formation — correct size, ratio and alignment",
          "Spacing — correct spacing between words and lines",
          "Writing speed — professional techniques for fast and neat writing",
          "Pressure and tilt control — correct use of pen/pencil",
        ]
      : [
          "বাংলা হাতের লেখা — বর্ণ থেকে বাক্য পর্যন্ত",
          "ইংরেজি হাতের লেখা — Print ও Cursive উভয় স্টাইল",
          "অক্ষর গঠন — সঠিক আকার, অনুপাত ও স্থান",
          "হরফের দূরত্ব — শব্দ ও লাইনের মধ্যে সঠিক ব্যবধান",
          "লেখার গতি — দ্রুত ও সুন্দর লেখার পেশাদার কৌশল",
          "চাপ ও ঢাল নিয়ন্ত্রণ — কলমের সঠিক ব্যবহার",
        ];
  } else if (category.includes("English")) {
    return isEnglish
      ? [
          "Fluency — speaking without hesitation",
          "Vocabulary — daily conversation vocabulary",
          "Pronunciation — standard accent & correct sounds",
          "Public Speaking — storytelling and interactive games",
          "Grammar rules — basic conversational grammar",
          "Active Listening — interactive conversation practice",
        ]
      : [
          "অনর্গল ইংরেজি বলা — কোনো জড়তা ছাড়াই",
          "ভোকাবুলারি — দৈনন্দিন ব্যবহারের গুরুত্বপূর্ণ শব্দাবলি",
          "উচ্চারণ — সঠিক উচ্চারণ ও বাচনভঙ্গি",
          "পাবলিক স্পিকিং — গল্প বলা এবং বিভিন্ন ইন্টারঅ্যাকটিভ গেম",
          "গ্রামার রুলস — বেসিক কথোপকথন উপযোগী ব্যাকরণ",
          "লিসেনিং স্কিল — ইন্টারঅ্যাকটিভ কথোপকথন অনুশীলন",
        ];
  } else if (category.includes("Phonics")) {
    return isEnglish
      ? [
          "Letter Sounds — reading phonics sounds correctly",
          "Spelling Rules — shortcuts to remember spelling patterns",
          "Reading Fluency — building reading speed and flow",
          "Pronunciation — removing pronunciation errors",
          "Vocabulary building — vocabulary with phonics patterns",
          "Confidence — independent reading skills",
        ]
      : [
          "লেটার সাউন্ডস — ফোনিক্স সাউন্ডের সঠিক উচ্চারণ",
          "বানানের নিয়ম — সহজে কঠিন বানান মনে রাখার শর্টকাট",
          "রিডিং স্পিড — দ্রুত ও সাবলীল রিডিং পড়ার কৌশল",
          "উচ্চারণ শুদ্ধিকরণ — উচ্চারণের জড়তা ও ভুল দূর করা",
          "ভোকাবুলারি বৃদ্ধি — ফোনিক্স প্যাটার্নে নতুন শব্দার্থ শেখা",
          "আত্মবিশ্বাস — অভিভাবকের সাহায্য ছাড়াই নিজে পড়তে শেখা",
        ];
  } else if (category.includes("Islamic")) {
    return isEnglish
      ? [
          "Tajweed rules — reading Quran with correct pronunciation",
          "Makhraj — correct sounds of Arabic letters",
          "Daily Prayers — rules, prayers, and surahs for Salah",
          "Islamic Manners — daily Islamic etiquette and sunnah",
          "Islamic Stories — learning from stories of Prophets",
          "Masnoon Duas — daily supplications for kids",
        ]
      : [
          "তাজবীদ নিয়ম — সহীহ মাখরাজ ও নিয়মে কুরআন তিলাওয়াত",
          "আরবি হরফ উচ্চারণ — মাখরাজের সঠিক জ্ঞান ও প্রয়োগ",
          "দৈনন্দিন সালাত — পাঁচ ওয়াক্ত নামাযের নিয়ম, দুয়া ও সুরা",
          "ইসলামিক আদব — দৈনন্দিন আচার-ব্যবহার ও গুরুত্বপূর্ণ সুন্নাহ",
          "নবী ও রাসুলদের জীবনী — ঘটনা থেকে নৈতিক শিক্ষা লাভ",
          "মাসনুন দুয়া — ঘুমানো, খাওয়া ও অন্যান্য সময়ের দুয়াসমূহ",
        ];
  }
  return isEnglish
    ? ["Core concepts", "Practical exercises", "Expert mentoring", "Peer learning", "Weekly assessments", "Official certification"]
    : ["মূল ধারণা", "বাস্তবমুখী অনুশীলন", "মেন্টর গাইডলাইন", "সহপাঠী শিক্ষা", "সাপ্তাহিক মূল্যায়ন", "অফিশিয়াল সার্টিফিকেট"];
};

const getIncludes = (isEnglish: boolean) => {
  return [
    {
      icon: PlayCircle,
      label: isEnglish ? "Video Lessons" : "ভিডিও লেসন",
      desc: isEnglish ? "24+ Recorded Video Classes" : "২৪+ রেকর্ডেড ভিডিও ক্লাস",
      color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: BookOpen,
      label: isEnglish ? "Learning Sheets" : "প্র্যাকটিস শিট",
      desc: isEnglish ? "Practice sheets sent directly" : "বিশেষ প্র্যাকটিস খাতা কুরিয়ারে",
      color: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
    },
    {
      icon: ClipboardCheck,
      label: isEnglish ? "Homework Review" : "হোমওয়ার্ক রিভিউ",
      desc: isEnglish ? "Teacher feedback on homework" : "প্রতিটি হোমওয়ার্কে শিক্ষকের ফিডব্যাক",
      color: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Headphones,
      label: isEnglish ? "Mentor Support" : "শিক্ষক সাপোর্ট",
      desc: isEnglish ? "Ask questions directly anytime" : "সরাসরি প্রশ্ন করুন যেকোনো সময়",
      color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    },
    {
      icon: BadgeCheck,
      label: isEnglish ? "Certificate" : "সার্টিফিকেট",
      desc: isEnglish ? "Official certificate on completion" : "কোর্স শেষে অফিশিয়াল সার্টিফিকেট",
      color: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
    },
  ];
};

const getTestimonials = (isEnglish: boolean) => {
  return [
    {
      name: isEnglish ? "Farhana Begum" : "ফারহানা বেগম",
      role: isEnglish ? "Rafi's Mother · Dhaka" : "রাফির মা · ঢাকা",
      rating: 5,
      text: isEnglish
        ? "My son's writing has completely changed in just 6 weeks. The teachers are very caring and pay individual attention. Books and materials were delivered home."
        : "মাত্র ৬ সপ্তাহে আমার মেয়ের লেখা সম্পূর্ণ বদলে গেছে। শিক্ষকরা অনেক আন্তরিক এবং ব্যক্তিগতভাবে মনোযোগ দেন। খাতা ও উপকরণ বাড়িতে পৌঁছে দেওয়া হয়েছে।",
      img: "https://images.unsplash.com/photo-1629360021730-3d258452c425?w=100&h=100&fit=crop&auto=format",
      verified: true,
    },
    {
      name: isEnglish ? "Md. Kamal Uddin" : "মো. কামাল উদ্দিন",
      role: isEnglish ? "Tahia's Father · Chittagong" : "তাহিয়ার বাবা · চট্টগ্রাম",
      rating: 5,
      text: isEnglish
        ? "Tahia is getting extra marks in exams now because of her handwriting. Her school teacher also praised her. This course is a true investment."
        : "তাহিয়া এখন পরীক্ষায় লেখার কারণে আলাদা নম্বর পাচ্ছে। ওর স্কুলের শিক্ষকও প্রশংসা করেছেন। এই কোর্সটি সত্যিকারের বিনিয়োগ।",
      img: "https://images.unsplash.com/photo-1597933471507-1ca5765185d8?w=100&h=100&fit=crop&auto=format",
      verified: true,
    },
    {
      name: isEnglish ? "Najma Akhter" : "নাজমা আক্তার",
      role: isEnglish ? "Iyan's Mother · Sylhet" : "সামিনের মা · সিলেট",
      rating: 5,
      text: isEnglish
        ? "I didn't expect such a good course online. I watch recordings if live classes are missed. My son practices by himself now — that's the biggest change."
        : "অনলাইনে এত ভালো কোর্স পাব ভাবিনি। লাইভ ক্লাস মিস হলে রেকর্ডিং দেখি। আমার ছেলে এখন নিজেই অনুশীলন করে — এটাই সবচেয়ে বড় পরিবর্তন।",
      img: "https://images.unsplash.com/photo-1623076189461-f7706b741c04?w=100&h=100&fit=crop&auto=format",
      verified: true,
    },
  ];
};

interface CourseDetailPageProps {
  dark?: boolean;
  toggleDark?: () => void;
  lang?: "BN" | "EN";
}

export default function CourseDetailPage({ dark, toggleDark, lang = "BN" }: CourseDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeMonth, setActiveMonth] = useState(0);

  const isEnglish = lang === "EN";
  const course = ALL_COURSES.find((c) => c.id === Number(id)) ?? ALL_COURSES[0];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const months = Array.from({ length: course.durationMonths }, (_, i) => {
    const templatesBN = [
      { title: `মাস ১ — ভিত্তি গড়ি`, topics: ["অক্ষর চেনা ও ধরন", "কলম ধরার সঠিক নিয়ম", "সরল রেখা ও বাঁকা রেখা", "বেসিক স্ট্রোক অনুশীলন"] },
      { title: `মাস ২ — গভীরে যাই`, topics: ["সংযুক্ত অক্ষর", "শব্দ লেখা অনুশীলন", "হরফের দূরত্ব শেখা", "লাইনের উপর লেখা"] },
      { title: `মাস ৩ — গতি ও শৈলী`, topics: ["গতি বাড়ানোর কৌশল", "বাক্য লেখা", "ক্যালিগ্রাফি বেসিক", "ফাইনাল মূল্যায়ন ও সার্টিফিকেট"] },
    ];
    const templatesEN = [
      { title: `Month 1 — Building Foundation`, topics: ["Letter shapes & styles", "Pen grip correction", "Straight & curved lines", "Basic stroke practice"] },
      { title: `Month 2 — Deep Dive`, topics: ["Letter connections", "Word writing practice", "Spacing between words", "Writing on ruled lines"] },
      { title: `Month 3 — Speed & Style`, topics: ["Writing speed techniques", "Sentence construction", "Basic calligraphy", "Assessment & Certification"] },
    ];
    return isEnglish ? (templatesEN[i] ?? { title: `Month ${i + 1}`, topics: [] }) : (templatesBN[i] ?? { title: `মাস ${i + 1}`, topics: [] });
  });

  const learnItems = getLearnItems(course.category, isEnglish);
  const includes = getIncludes(isEnglish);
  const testimonials = getTestimonials(isEnglish);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── HERO BANNER ── */}
      <div className="relative min-h-[80vh] flex items-end overflow-hidden">
        {/* Background image */}
        <img
          src={course.heroImg}
          alt={isEnglish ? course.titleEN : course.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
        {/* Decorative top-right glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32">
          {/* Breadcrumb & Go Back action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div
              className="flex items-center gap-2 text-white/60 text-xs sm:text-sm"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <button onClick={() => navigate("/")} className="hover:text-white transition-colors cursor-pointer">
                {isEnglish ? "Home" : "হোম"}
              </button>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <button onClick={() => navigate("/courses")} className="hover:text-white transition-colors cursor-pointer">
                {isEnglish ? "Courses" : "কোর্সসমূহ"}
              </button>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-white/90 font-medium truncate max-w-[200px]">
                {isEnglish ? course.titleEN : course.title}
              </span>
            </div>

            <button
              onClick={() => navigate(-1)}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs backdrop-blur-sm border border-white/20 cursor-pointer self-start transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {isEnglish ? "Back to Courses" : "কোর্সে ফিরে যান"}
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-end">
            {/* Left: course info */}
            <div className="lg:col-span-3 space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md bg-gradient-to-r ${course.tagColor}`}
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {course.titleTag}
                </span>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/10"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {isEnglish ? course.levelEN : course.level}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {isEnglish ? course.titleEN : course.title}
              </h1>

              <p
                className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl font-medium"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {isEnglish ? course.descriptionEN : course.desc}
              </p>

              {/* Rating row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(course.rating)} />
                  <span className="text-amber-400 font-bold text-sm">{course.rating}</span>
                  <span className="text-white/60 text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {isEnglish ? `(${course.reviews} reviews)` : `(${course.reviews} রিভিউ)`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-sm border-l border-white/20 pl-4">
                  <Users className="w-4 h-4 text-primary" />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {isEnglish ? `${course.studentsEN} Enrolled` : `${course.students} জন ভর্তি`}
                  </span>
                </div>
              </div>

              {/* Hero meta chips */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: Users, label: isEnglish ? `Age: ${course.ageGroupEN}` : `বয়স: ${course.ageLabel}` },
                  { icon: Clock, label: isEnglish ? `Duration: ${course.durationEN}` : `সময়কাল: ${course.duration}` },
                  { icon: Globe2, label: isEnglish ? "Bengali & English" : "বাংলা & ইংরেজি" },
                  { icon: Award, label: isEnglish ? "Certificate Included" : "সার্টিফিকেট অন্তর্ভুক্ত" },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-white/15"
                  >
                    <m.icon className="w-3.5 h-3.5 text-primary" />
                    <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: enroll card */}
            <div className="lg:col-span-2 w-full">
              <div className="bg-card/95 dark:bg-card/98 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl shadow-black/40">
                {/* Price */}
                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className="text-4xl font-extrabold text-foreground"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {isEnglish ? course.priceEN : course.priceLabel}
                  </span>
                  <span
                    className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-200/30"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {isEnglish ? "20% OFF" : "২০% ছাড়"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-6" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish
                    ? "EMI Available · 30-Day Money-Back Guarantee"
                    : "EMI সুবিধা উপলব্ধ · ৩০ দিনের মানি-ব্যাক গ্যারান্টি"}
                </p>

                {/* Enroll button to external Google Form */}
                <Button
                  asChild
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  className="w-full font-bold py-7 rounded-2xl text-base shadow-xl shadow-green-200/40 dark:shadow-green-950/20 hover:-translate-y-0.5 transition-all bg-primary text-white hover:bg-green-600 hover:shadow-2xl cursor-pointer"
                >
                  <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 fill-current" />
                    {isEnglish ? "Enroll Now" : "এখনই ভর্তি হন"}
                  </a>
                </Button>

                <button
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  className="w-full border-2 border-border text-foreground font-semibold py-3.5 rounded-2xl text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2 mt-3 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-primary fill-primary" />
                  {isEnglish ? "Watch Free Demo" : "ফ্রি ডেমো দেখুন"}
                </button>

                {/* Quick facts list */}
                <div className="space-y-3 mt-6 border-t border-border pt-5">
                  {[
                    { icon: Shield, label: isEnglish ? "30-Day Money-Back Guarantee" : "৩০ দিনের মানি-ব্যাক গ্যারান্টি" },
                    { icon: Clock, label: isEnglish ? `Course Duration: ${course.durationEN}` : `কোর্সের মেয়াদ: ${course.duration}` },
                    { icon: Users, label: isEnglish ? `Age Suitability: ${course.ageGroupEN}` : `বয়স উপযুক্ততা: ${course.ageLabel}` },
                    { icon: BadgeCheck, label: isEnglish ? "Official Certificate on Completion" : "সম্পন্নে সার্টিফিকেট প্রদান" },
                  ].map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <f.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* 1. What You'll Learn */}
        <section>
          <div
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-5"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            📚 {isEnglish ? "What You'll Learn" : "কী শিখবেন"}
          </div>
          <h2
            className="text-3xl font-bold text-foreground mb-8"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {isEnglish ? "What students will learn in this course" : "এই কোর্সে শিক্ষার্থীরা যা শিখবে"}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {learnItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span
                  className="text-sm font-medium text-foreground leading-relaxed"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Course Includes */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 rounded-3xl p-8 lg:p-14 border border-green-100 dark:border-green-900/30">
          <div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full mb-5"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            🎁 {isEnglish ? "What's Included" : "কোর্সে যা পাবেন"}
          </div>
          <h2
            className="text-3xl font-bold text-foreground mb-8"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {isEnglish ? "Benefits Included in the Course" : "কোর্স অন্তর্ভুক্ত সুবিধাসমূহ"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {includes.map((item, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div
                  className="font-bold text-sm text-foreground mb-1.5"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {item.label}
                </div>
                <div
                  className="text-xs text-muted-foreground leading-snug font-medium"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Teacher Profile */}
        <section>
          <div
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-5"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            👩‍🏫 {isEnglish ? "Your Instructor" : "আপনার শিক্ষক"}
          </div>
          <h2
            className="text-3xl font-bold text-foreground mb-8"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {isEnglish ? "Instructor Profile" : "শিক্ষকের পরিচয়"}
          </h2>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-3">
              {/* Photo col */}
              <div className="relative lg:col-span-1 h-80 lg:h-auto bg-muted overflow-hidden">
                <img
                  src={course.teacherImg}
                  alt={course.instructor}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r" />
                <div className="absolute bottom-4 left-4 lg:hidden">
                  <div
                    className="text-white font-bold text-xl"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {course.instructor}
                  </div>
                  <div
                    className="text-white/80 text-xs mt-0.5"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {course.teacherTitle}
                  </div>
                </div>
              </div>

              {/* Info col */}
              <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="hidden lg:block mb-2">
                  <div
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {course.instructor}
                  </div>
                  <div
                    className="text-sm text-primary font-bold mt-1"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {course.teacherTitle}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 my-6">
                  {[
                    { val: course.teacherExp, label: isEnglish ? "Experience" : "অভিজ্ঞতা" },
                    { val: course.teacherStudents, label: isEnglish ? "Students" : "শিক্ষার্থী" },
                    { val: `${course.teacherRating}/5`, label: isEnglish ? "Rating" : "রেটিং" },
                  ].map((s, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-2xl p-4 text-center">
                      <div
                        className="text-lg font-bold text-foreground"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {s.val}
                      </div>
                      <div
                        className="text-xs text-muted-foreground mt-0.5 font-medium"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1 mb-4">
                  <StarRating rating={Math.round(course.teacherRating)} />
                  <span className="text-sm font-bold text-amber-500 ml-1.5">{course.teacherRating}</span>
                </div>

                <p
                  className="text-sm text-muted-foreground leading-relaxed font-medium"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {course.teacherBio}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {(isEnglish
                    ? ["Skills Development", "Pedagogy", "Coaching"]
                    : ["দক্ষতা উন্নয়ন", "শিশু শিক্ষা", "মেন্টরিং"]
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary text-xs font-bold px-3.5 py-2 rounded-full"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Course Timeline */}
        <section>
          <div
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-5"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            📅 {isEnglish ? "Course Syllabus" : "কোর্সের সময়সূচি"}
          </div>
          <h2
            className="text-3xl font-bold text-foreground mb-8"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {isEnglish ? "Month-wise Curriculum" : "মাসভিত্তিক পাঠ্যক্রম"}
          </h2>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {months.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveMonth(i)}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className={`text-xs font-bold px-4.5 py-2.5 rounded-full transition-all cursor-pointer ${
                  activeMonth === i
                    ? "bg-primary text-white shadow-md shadow-green-200/50 dark:shadow-green-950/40"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {isEnglish ? `Month ${i + 1}` : `মাস ${i + 1}`}
              </button>
            ))}
          </div>

          {/* Timeline visual */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden sm:block" />

            <div className="space-y-4">
              {months.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setActiveMonth(i)}
                  className={`relative sm:pl-14 cursor-pointer transition-opacity duration-200 ${
                    activeMonth !== i ? "opacity-50 hover:opacity-75" : ""
                  }`}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute left-0 top-5 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 hidden sm:flex transition-all ${
                      activeMonth === i
                        ? "bg-primary text-white border-primary shadow-lg shadow-green-200/50 dark:shadow-green-950/30 scale-110"
                        : "bg-background text-muted-foreground border-border"
                    }`}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {i + 1}
                  </div>

                  <div
                    className={`bg-card border rounded-2xl p-6 transition-all ${
                      activeMonth === i ? "border-primary shadow-lg shadow-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="font-bold text-base text-foreground"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        {m.title}
                      </h3>
                      {activeMonth === i && (
                        <span
                          className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                          {isEnglish ? "ACTIVE" : "বর্তমান"}
                        </span>
                      )}
                    </div>
                    {activeMonth === i && (
                      <div className="grid sm:grid-cols-2 gap-3 mt-4 animate-fade-in">
                        {m.topics.map((t, index) => (
                          <div key={index} className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            <span
                              className="text-xs sm:text-sm text-muted-foreground font-medium"
                              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                              {t}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Parent Testimonials */}
        <section>
          <div
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full mb-5"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            💬 {isEnglish ? "Testimonials" : "অভিভাবকদের মতামত"}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <h2
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {isEnglish ? "What Parents Say" : "বাবা-মা যা বলছেন"}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">{course.rating}</span>
              <span
                className="text-sm text-muted-foreground font-medium"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {isEnglish ? `(from ${course.reviews} reviews)` : `(${course.reviews} রিভিউ থেকে)`}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={t.rating} />
                  {t.verified && (
                    <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-bold">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {isEnglish ? "Verified" : "যাচাইকৃত"}
                      </span>
                    </div>
                  )}
                </div>
                <Quote className="w-6 h-6 text-primary/25" />
                <p
                  className="text-sm text-muted-foreground leading-relaxed flex-1 font-medium italic"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <div
                      className="text-sm font-bold text-foreground"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-xs text-muted-foreground font-medium"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Bottom Enroll CTA */}
        <section className="bg-gradient-to-br from-green-600 via-green-500 to-green-700 rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden shadow-xl shadow-green-100 dark:shadow-green-950/20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            pointer-events-none="true"
          />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="text-4xl mb-4">🎓</div>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {isEnglish ? "Enroll Today and See the Transformation" : "আজই ভর্তি হন এবং পরিবর্তন দেখুন"}
            </h2>
            <p
              className="text-green-50 text-base sm:text-lg mb-2 font-medium"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {isEnglish
                ? `Only ${course.priceEN} — EMI Available · 30-Day Money-Back Guarantee`
                : `মাত্র ${course.priceLabel} — EMI সুবিধা উপলব্ধ · ৩০ দিনের মানি-ব্যাক গ্যারান্টি`}
            </p>
            <p
              className="text-green-200 text-xs sm:text-sm mb-8 font-semibold animate-pulse"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {isEnglish ? "⚡ Limited seats remaining — secure your spot now" : "⚡ সীমিত আসন বাকি আছে — এখনই নিশ্চিত করুন"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-green-700 font-bold px-10 py-7 rounded-full text-base hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-0.5 cursor-pointer"
              >
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                  <Zap className="w-5 h-5 fill-green-600 text-green-600" />
                  {isEnglish ? "Enroll Now" : "এখনই ভর্তি হন"}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <button
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/10 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                {isEnglish ? "Get Consultation" : "পরামর্শ নিন"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
