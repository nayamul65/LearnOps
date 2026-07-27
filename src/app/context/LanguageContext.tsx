import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "BN" | "EN";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isEnglish: boolean;
  t: (key: keyof typeof translations["BN"]) => string;
}

export const translations = {
  BN: {
    // Navigation
    home: "হোম",
    courses: "কোর্সসমূহ",
    successStories: "সাফল্যের গল্প",
    teachers: "শিক্ষকবৃন্দ",
    contact: "যোগাযোগ",
    login: "লগ ইন",
    getStarted: "শুরু করুন",
    dashboard: "ড্যাশবোর্ড",
    langLabel: "English",

    // Hero Section
    heroBadge: "বাংলাদেশের সেরা অনলাইন হ্যান্ডরাইটিং কোর্স",
    heroTitle1: "সুন্দর হাতের লেখাই",
    heroTitle2: "সন্তানের",
    heroTitle3: "আত্মবিশ্বাস বাড়ায়",
    heroSubtitle: "ভিডিও ক্লাস, বিশেষ হ্যান্ডরাইটিং খাতা এবং অভিজ্ঞ শিক্ষকদের ব্যক্তিগত গাইডলাইনের মাধ্যমে আপনার শিশুর হাতের লেখা উন্নত করুন।",
    viewCourses: "কোর্স দেখুন",
    watchDemo: "ফ্রি ডেমো দেখুন",
    activeStudents: "সক্রিয় শিক্ষার্থী",
    successRate: "সাফল্যের হার",
    expertTeachers: "অভিজ্ঞ শিক্ষক",
    onlineNow: "অনলাইনে আছেন",
    offlineNow: "অফলাইন",
    enrolledCount: "৩২ জন এনরোলড",
    popularCourse: "বেগিনার হ্যান্ডরাইটিং কোর্স",
    liveBadge: "লাইভ",
    rahelaName: "রাহেলা ম্যাম",

    // Platform Carousel
    ourPlatform: "আমাদের প্ল্যাটফর্ম",
    carouselTitle: "একটু দেখুন, সিদ্ধান্ত নিন",

    // Home Sections
    whyChooseUs: "কেন LearnOps বেছে নেবেন?",
    whyHeading1: "আমরা শুধু পড়াই না,",
    whyHeading2: "গড়ে তুলি",
    whySubtitle: "সুন্দর হাতের লেখা শুধু দেখতে ভালো নয়, এটি শিশুর মনোযোগ ও সৃজনশীলতা বিকাশে গুরুত্বপূর্ণ।",
    featureMoneyBack: "৩০ দিনের মানি-ব্যাক গ্যারান্টি",
    featureLiveClasses: "বছরে ৪৮টি লাইভ ক্লাস",
    featureParentUpdates: "অভিভাবক পোর্টালে রিয়েল-টাইম আপডেট",

    // Features Cards
    liveVideoTitle: "লাইভ ভিডিও ক্লাস",
    liveVideoDesc: "প্রতিটি ক্লাস রেকর্ড করা থাকে।",
    specialBookTitle: "বিশেষ খাতা",
    specialBookDesc: "হ্যান্ডরাইটিং খাতা ও কলম।",
    personalAttentionTitle: "ব্যক্তিগত মনোযোগ",
    personalAttentionDesc: "ব্যক্তিগতভাবে গাইড করা হয়।",
    certificateTitle: "সার্টিফিকেট",
    certificateDesc: "স্বীকৃত সার্টিফিকেট প্রোগ্রাম।",
    ownTimeTitle: "নিজের সময়ে",
    ownTimeDesc: "সুবিধামতো সময়ে ক্লাস নিন।",
    countrywideTitle: "সারাদেশে",
    countrywideDesc: "যেকোনো জায়গা থেকে শিখুন।",

    // Call To Action Banner
    ctaHeading1: "আজই আপনার সন্তানের",
    ctaHeading2: "সুন্দর ভবিষ্যৎ",
    ctaHeading3: "গড়ুন",
    ctaSubtitle: "১৪ দিনের বিনামূল্যে ট্রায়াল শুরু করুন।",
    ctaButton: "বিনামূল্যে শুরু করুন",

    // Success Stories
    successBadge: "সাফল্যের গল্প",
    successHeading: "আমাদের শিক্ষার্থীদের অভাবনীয় উন্নতি",
    successSubtitle: "নিয়মিত অনুশীলন ও বিশেষজ্ঞ মেন্টরদের সঠিক গাইডলাইনে শিশুদের হাতের লেখা কীভাবে বদলে গেছে, তার কিছু বাস্তব চিত্র ও অভিভাবকদের অভিজ্ঞতার গল্প।",
    sideBySideView: "পাশাপাশি ভিউ",
    tabView: "ট্যাব ভিউ",
    handwritingChange: "হাতে লেখার পরিবর্তন:",
    viewZoom: "জুমে দেখুন",
    beforeText: "শুরুতে",
    afterText: "৪ সপ্তাহ পর",
    totalStudentsTrained: "৫০+ শিক্ষার্থী",
    totalStudentsDesc: "সারাদেশজুড়ে সফলভাবে প্রশিক্ষিত",
    satisfactionRate: "৯৮% অভিভাবক সন্তুষ্ট",
    satisfactionDesc: "অভিভাবকদের ইতিবাচক রিভিউ",
    averageRating: "৪.৯/৫ স্টার",
    ratingDesc: "৩০০+ ভেরিফাইড রিভিউয়ের ভিত্তিতে",
    parentsAreSaying: "অভিভাবকরা যা বলছেন",

    // Teachers Section
    teachersBadge: "শিক্ষকবৃন্দ",
    teachersHeading: "আমাদের অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দ",
    teachersSubtitle: "অভিজ্ঞ শিক্ষক ও মেন্টরদের সঠিক গাইডলাইনে আপনার সন্তানের শেখার যাত্রা হবে সুন্দর ও সাবলীল।",
    verifiedMentor: "ভেরিফাইড মেন্টর",
    facultyTag: "LearnOps Faculty",
    experienceLabel: "অভিজ্ঞতা",
    studentsLabel: "ছাত্র-ছাত্রী",

    // Contact Section
    contactBadge: "যোগাযোগ",
    contactHeading: "যোগাযোগ করুন",
    contactSubtitle: "আপনার যেকোনো প্রশ্ন, পরামর্শ বা ভর্তি সংক্রান্ত তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।",
    phoneLabel: "ফোন নম্বর",
    emailLabel: "ইমেইল এড্রেস",
    addressLabel: "অফিস ঠিকানা",
    hoursLabel: "অফিস সময়সূচি",
    socialLabel: "সামাজিক যোগাযোগ মাধ্যম",
    sendMessage: "সরাসরি মেসেজ পাঠান",
    sendSubtitle: "নিচের ফর্মে আপনার নাম ও মেসেজ লিখে সাবমিট করুন, আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।",
    nameLabel: "আপনার নাম *",
    namePlaceholder: "যেমন: রাশেদুল ইসলাম",
    phoneInputLabel: "মোবাইল নম্বর *",
    subjectLabel: "বিষয় / কোর্স",
    subjectPlaceholder: "যেমন: হ্যান্ডরাইটিং কোর্স সংক্রান্ত তথ্য",
    messageLabel: "আপনার মেসেজ / প্রশ্ন",
    messagePlaceholder: "আপনার প্রশ্ন বিস্তারিত লিখুন...",
    submitButton: "মেসেজ পাঠান",
    thankYouMessage: "ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
    thankYouSubtitle: "আমাদের সাপোর্ট টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।",

    // Footer
    footerDesc: "বাংলাদেশের শিশুদের সুন্দর হাতের লেখা শেখানোর সেরা অনলাইন প্ল্যাটফর্ম।",
    platformCol: "প্ল্যাটফর্ম",
    companyCol: "কোম্পানি",
    supportCol: "সহায়তা",
    allRightsReserved: "© ২০২৪ LearnOps Bangladesh। সর্বস্বত্ব সংরক্ষিত।",
  },
  EN: {
    // Navigation
    home: "Home",
    courses: "Courses",
    successStories: "Success Stories",
    teachers: "Teachers",
    contact: "Contact",
    login: "Log In",
    getStarted: "Get Started",
    dashboard: "Dashboard",
    langLabel: "বাংলা",

    // Hero Section
    heroBadge: "Best Online Handwriting Course in Bangladesh",
    heroTitle1: "Beautiful Handwriting",
    heroTitle2: "Boosts Your Child's",
    heroTitle3: "Self-Confidence",
    heroSubtitle: "Improve your child's handwriting with video classes, specially designed practice notebooks, and personal mentorship.",
    viewCourses: "View Courses",
    watchDemo: "Watch Free Demo",
    activeStudents: "Active Students",
    successRate: "Success Rate",
    expertTeachers: "Expert Teachers",
    onlineNow: "Online Now",
    offlineNow: "Offline",
    enrolledCount: "32 Enrolled",
    popularCourse: "Beginner Handwriting Course",
    liveBadge: "LIVE",
    rahelaName: "Rahela Ma'am",

    // Platform Carousel
    ourPlatform: "Our Platform",
    carouselTitle: "Take a Look, Make a Decision",

    // Home Sections
    whyChooseUs: "Why Choose LearnOps?",
    whyHeading1: "We Don't Just Teach,",
    whyHeading2: "We Build Futures",
    whySubtitle: "Beautiful handwriting is not just pleasant to look at; it is vital for developing focus and creativity in children.",
    featureMoneyBack: "30-Day Money-Back Guarantee",
    featureLiveClasses: "48 Live Classes Per Year",
    featureParentUpdates: "Real-Time Parent Portal Updates",

    // Features Cards
    liveVideoTitle: "Live Video Classes",
    liveVideoDesc: "Every class is recorded for replay.",
    specialBookTitle: "Special Notebook",
    specialBookDesc: "Custom handwriting notebook & pen.",
    personalAttentionTitle: "Personal Attention",
    personalAttentionDesc: "Individually guided learning.",
    certificateTitle: "Certificate",
    certificateDesc: "Recognized certification program.",
    ownTimeTitle: "At Your Own Pace",
    ownTimeDesc: "Attend classes at your convenience.",
    countrywideTitle: "Nationwide Access",
    countrywideDesc: "Learn from anywhere in the country.",

    // Call To Action Banner
    ctaHeading1: "Build Your Child's",
    ctaHeading2: "Bright Future",
    ctaHeading3: "Today",
    ctaSubtitle: "Start your 14-day free trial now.",
    ctaButton: "Start for Free",

    // Success Stories
    successBadge: "Success Stories",
    successHeading: "Unbelievable Growth of Our Students",
    successSubtitle: "Real stories and handwriting transformations of children guided by expert mentors and consistent practice.",
    sideBySideView: "Side-by-Side View",
    tabView: "Tab View",
    handwritingChange: "Handwriting Transformation:",
    viewZoom: "Click to Zoom",
    beforeText: "Before",
    afterText: "After 4 Weeks",
    totalStudentsTrained: "50+ Students",
    totalStudentsDesc: "Successfully trained nationwide",
    satisfactionRate: "98% Parents Satisfied",
    satisfactionDesc: "Based on positive parent reviews",
    averageRating: "4.9/5 Stars",
    ratingDesc: "Based on 300+ verified reviews",
    parentsAreSaying: "What Parents Say",

    // Teachers Section
    teachersBadge: "Our Faculty",
    teachersHeading: "Our Experienced & Dedicated Mentors",
    teachersSubtitle: "Under the guidance of expert mentors, your child's learning journey will be smooth and rewarding.",
    verifiedMentor: "Verified Mentor",
    facultyTag: "LearnOps Faculty",
    experienceLabel: "Experience",
    studentsLabel: "Students",

    // Contact Section
    contactBadge: "Contact",
    contactHeading: "Get In Touch",
    contactSubtitle: "Have questions or need assistance with admission? Feel free to contact us anytime.",
    phoneLabel: "Phone Number",
    emailLabel: "Email Address",
    addressLabel: "Office Address",
    hoursLabel: "Office Hours",
    socialLabel: "Social Media",
    sendMessage: "Send a Direct Message",
    sendSubtitle: "Fill out the form below and our team will get back to you shortly.",
    nameLabel: "Your Name *",
    namePlaceholder: "e.g. Rashedul Islam",
    phoneInputLabel: "Mobile Number *",
    subjectLabel: "Subject / Course",
    subjectPlaceholder: "e.g. Handwriting Course Query",
    messageLabel: "Your Message / Question",
    messagePlaceholder: "Write your question in detail...",
    submitButton: "Send Message",
    thankYouMessage: "Thank you! Your message has been sent successfully.",
    thankYouSubtitle: "Our support team will contact you shortly.",

    // Footer
    footerDesc: "The premier online handwriting learning platform for children in Bangladesh.",
    platformCol: "Platform",
    companyCol: "Company",
    supportCol: "Support",
    allRightsReserved: "© 2024 LearnOps Bangladesh. All rights reserved.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("learnops_lang");
    return (saved === "EN" || saved === "BN") ? saved : "BN";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("learnops_lang", newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === "BN" ? "EN" : "BN";
    setLang(nextLang);
  };

  const t = (key: keyof typeof translations["BN"]): string => {
    return translations[lang][key] || translations["BN"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isEnglish: lang === "EN", t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
