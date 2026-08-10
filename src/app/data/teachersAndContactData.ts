/* ═══════════════════════════════════════════════════════════════════════════
   TEACHERS & CONTACT TYPES AND MOCK DATA
   Admin Panel / Backend (Firebase/Supabase) API Ready Schemas
═══════════════════════════════════════════════════════════════════════════ */

export interface Teacher {
  id: string | number;
  name: string;
  title: string; // Designation/Title
  bio: string;
  photoUrl: string;
  onlineStatus: boolean; // true = Online
  rating: number; // e.g. 4.9 or 5.0
  experience?: string; // e.g. "১২ বছর"
  totalStudents?: string; // e.g. "১,২০০+"
}

export interface SocialLink {
  platform: "facebook" | "youtube" | "instagram" | "whatsapp" | string;
  url: string;
  label: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
  socialLinks: SocialLink[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK TEACHERS DATA
═══════════════════════════════════════════════════════════════════════════ */

export const mockTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "রাহেলা খাতুন",
    title: "প্রধান হস্তলিখন মেন্টর ও গবেষক",
    bio: "রাহেলা খাতুন LearnOps-এর প্রধান মেন্টর এবং হাতের লেখা গবেষক। দীর্ঘ ১২ বছরের অভিজ্ঞতায় হাজারো শিক্ষার্থীর হাতের লেখা বদলে দিয়েছেন।",
    photoUrl: "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=400&h=400&fit=crop&auto=format",
    onlineStatus: true,
    rating: 4.9,
    experience: "১২ বছর",
    totalStudents: "১,২০০+",
  },
  {
    id: "teacher-2",
    name: "ফারহানা বেগম",
    title: "হস্তলিখন বিশেষজ্ঞ ও এডুকেটর",
    bio: "ফারহানা বেগম শিশুদের হস্তলিখন উন্নয়নে বিশেষজ্ঞ। তিনি ঢাকা বিশ্ববিদ্যালয় থেকে শিক্ষা বিজ্ঞানে স্নাতকোত্তর করেছেন এবং ৬ বছরেরও বেশি সময় ধরে শিশুদের পড়াচ্ছেন।",
    photoUrl: "https://images.unsplash.com/photo-1629360021730-3d258452c425?w=400&h=400&fit=crop&auto=format",
    onlineStatus: true,
    rating: 5.0,
    experience: "৬ বছর",
    totalStudents: "৯৪০+",
  },
  {
    id: "teacher-3",
    name: "মো. আরিফুল ইসলাম",
    title: "ইংরেজি স্পোকেন ও ক্যালিগ্রাফি ট্রেইনার",
    bio: "মো. আরিফুল ইসলাম ইংরেজি ভাষা শিক্ষা ও ক্যালিগ্রাফিতে বিশেষ অভিজ্ঞতাসম্পন্ন প্রশিক্ষক। শিশুদের ভীতি ও জড়তা কাটিয়ে তুলতে অত্যন্ত পারদর্শী।",
    photoUrl: "https://images.unsplash.com/photo-1616587894289-86480e533129?w=400&h=400&fit=crop&auto=format",
    onlineStatus: false,
    rating: 4.8,
    experience: "৮ বছর",
    totalStudents: "৮৫০+",
  },
  {
    id: "teacher-4",
    name: "সুমাইয়া আক্তার",
    title: "ফোনিক্স ও ভাষা শিক্ষা বিশেষজ্ঞ",
    bio: "সুমাইয়া আক্তার ফোনিক্স ও রিডিং স্কিল ডেভলপমেন্টে দীর্ঘদিনের অভিজ্ঞতাসম্পন্ন একজন নিবেদিত মেন্টর। শিশুদের বর্ণমালা উচ্চারণে সহায়তা করেন।",
    photoUrl: "https://images.unsplash.com/photo-1588873281272-14886ba1f737?w=400&h=400&fit=crop&auto=format",
    onlineStatus: true,
    rating: 4.9,
    experience: "৫ বছর",
    totalStudents: "৬৮০+",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK CONTACT DETAILS
═══════════════════════════════════════════════════════════════════════════ */

export const mockContactInfo: ContactInfo = {
  phone: "+880 1700-000000",
  whatsapp: "+880 1700-000000",
  email: "hello@learnops.com.bd",
  address: "ধানমন্ডি, ঢাকা ১২০৫, বাংলাদেশ",
  officeHours: "সকাল ৯:০০ - রাত ৯:০০ (প্রতিদিন)",
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/share/1Emi21t7xo/", label: "Facebook" },
    { platform: "instagram", url: "https://www.instagram.com/bdlearnplus?igsh=MWM2M2w3MzcweWR3dg==", label: "Instagram" },
    { platform: "youtube", url: "https://youtube.com/@learnplusbd?feature=shared", label: "YouTube" },
    { platform: "whatsapp", url: "https://api.whatsapp.com/send/?phone=8801938153294&text&type=phone_number&app_absent=0", label: "WhatsApp" },
  ],
};
