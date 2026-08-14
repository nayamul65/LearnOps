import { supabase } from '../lib/supabase';

export interface UnifiedCourse {
  id: string | number;
  title: string;
  titleEN?: string;
  category: string;
  categoryBengali?: string;
  ageGroup?: string;
  ageGroupEN?: string;
  duration: string;
  durationEN?: string;
  price: number | string;
  priceEN?: string;
  priceNum?: number;
  description: string;
  descriptionEN?: string;
  instructor?: string;
  headTeacher?: string;
  rating?: number;
  reviews?: number;
  students?: string;
  studentsEN?: string;
  imageUrl?: string;
  img?: string;
  demoVideoUrl?: string;
  googleFormUrl?: string;
  badge?: string;
  gradient?: string;
  bgLight?: string;
  textAccent?: string;
  borderAccent?: string;
  ringAccent?: string;
  level?: string;
  levelEN?: string;
  levelColor?: string;
  features?: string[];
  [key: string]: any;
}

export const DEFAULT_COURSES: UnifiedCourse[] = [
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
    price: 2500,
    priceEN: "৳2,500",
    priceNum: 2500,
    description: "স্বল্প সময়ে বর্ণমালা গঠন, লাইনের সোজা ভাব এবং দ্রুত ও সুন্দর হাতের লেখার বিশেষ টেকনিক।",
    descriptionEN: "Special techniques for alphabet formation, straight lines, and fast, beautiful handwriting in a short time.",
    instructor: "ফারহানা বেগম",
    headTeacher: "ফারহানা বেগম",
    rating: 4.9,
    reviews: 312,
    students: "১,২৪০",
    studentsEN: "1,240",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
    badge: "✍️",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    borderAccent: "border-amber-200 dark:border-amber-900/40",
    ringAccent: "ring-amber-400",
    level: "সব স্তর",
    levelEN: "All Levels",
    levelColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    features: ["বর্ণমালা গঠন টেকনিক", "লাইনে সোজা লেখার কৌশল", "দ্রুত লেখার প্র্যাকটিস শিট", "মেন্টর ফিডব্যাক সেশন"],
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
    price: 2000,
    priceEN: "৳2,000",
    priceNum: 2000,
    description: "ছোট বাচ্চাদের পেন্সিল গ্রিপ, স্ট্রোক প্র্যাকটিস এবং বর্ণমালার নিখুঁত আকৃতি শেখানোর ফাউন্ডেশন কোর্স।",
    descriptionEN: "Foundation course teaching young kids proper pencil grip, stroke practice, and exact alphabet shapes.",
    instructor: "রাহেলা খাতুন",
    headTeacher: "রাহেলা খাতুন",
    rating: 4.8,
    reviews: 198,
    students: "৮৫০",
    studentsEN: "850",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
    badge: "🎨",
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50 dark:bg-sky-950/20",
    textAccent: "text-sky-600 dark:text-sky-400",
    borderAccent: "border-sky-200 dark:border-sky-900/40",
    ringAccent: "ring-sky-400",
    level: "প্রাথমিক",
    levelEN: "Beginner",
    levelColor: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
    features: ["পেন্সিল গ্রিপ সংশোধন", "স্ট্রোক ও প্যাটার্ন ওয়ার্কবুক", "প্রতিদিন লাইভ ড্রিল", "প্যারেন্ট গাইডলাইন"],
  },
  {
    id: 3,
    title: "8 WEEKS ENGLISH SPEAKING (start program)",
    titleEN: "8 Weeks English Speaking (Start Program)",
    category: "English Spoken",
    categoryBengali: "ইংরেজি স্পোকেন",
    ageGroup: "৭-১৪ বছর",
    ageGroupEN: "7-14 Years",
    duration: "৮ সপ্তাহ",
    durationEN: "8 Weeks",
    price: 3500,
    priceEN: "৳3,500",
    priceNum: 3500,
    description: "শিশুদের জড়তা কাটিয়ে নির্ভুল ও আত্মবিশ্বাসের সাথে দৈনন্দিন জীবনে ফ্লুয়েন্টলি ইংরেজিতে কথা বলার প্রোগ্রাম।",
    descriptionEN: "Program designed to remove hesitation and build confidence for kids to speak English fluently in daily life.",
    instructor: "মো. আরিফুল ইসলাম",
    headTeacher: "মো. আরিফুল ইসলাম",
    rating: 4.95,
    reviews: 420,
    students: "১,৮৯০",
    studentsEN: "1,890",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop&auto=format",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
    badge: "🗣️",
    gradient: "from-purple-500 to-indigo-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/20",
    textAccent: "text-purple-600 dark:text-purple-400",
    borderAccent: "border-purple-200 dark:border-purple-900/40",
    ringAccent: "ring-purple-400",
    level: "স্পেশাল",
    levelEN: "Special",
    levelColor: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    features: ["ডেইলি কনভার্সেশন প্র্যাকটিস", "ভোকাবুলারি ও উচ্চারণ", "পাবলিক স্পিকিং গেম", "সাপ্তাহিক ওরাল টেস্ট"],
  },
  {
    id: 4,
    title: "ইংলিশ গ্রামার ও রাইটিং মাস্টারক্লাস",
    titleEN: "English Grammar & Writing Masterclass",
    category: "English Grammar",
    categoryBengali: "ইংরেজি গ্রামার",
    ageGroup: "৮-১৫ বছর",
    ageGroupEN: "8-15 Years",
    duration: "৬ সপ্তাহ",
    durationEN: "6 Weeks",
    price: 2800,
    priceEN: "৳2,800",
    priceNum: 2800,
    description: "বাক্য গঠন, টেন্স, প্যারাগ্রাফ রাইটিং এবং পরীক্ষায় সর্বোচ্চ নম্বর পাওয়ার কার্যকর কৌশল।",
    descriptionEN: "Effective techniques for sentence construction, tenses, paragraph writing, and acing school exams.",
    instructor: "তানভীর আহমেদ",
    headTeacher: "তানভীর আহমেদ",
    rating: 4.85,
    reviews: 145,
    students: "৬৭০",
    studentsEN: "670",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&auto=format",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&auto=format",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    googleFormUrl: "https://forms.google.com/demo-enrollment-form",
    badge: "📖",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-emerald-200 dark:border-emerald-900/40",
    ringAccent: "ring-emerald-400",
    level: "মাঝারি",
    levelEN: "Intermediate",
    levelColor: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    features: ["টেন্স ও স্ট্রাকচার স্পষ্টীকরণ", "ক্রিয়েটিভ রাইটিং গাইড", "পরীক্ষার মডেল টেস্ট", "হোমওয়ার্ক ও অ্যাসাইনমেন্ট রিভিউ"],
  },
];

const STORAGE_KEY = 'learnops_courses_catalog';
const EVENT_NAME = 'learnops_courses_updated';

// Helper to normalize course format
export function normalizeCourse(c: any): UnifiedCourse {
  const priceNum = typeof c.price === 'number' ? c.price : parseInt(String(c.price || '0').replace(/[^0-9]/g, ''), 10) || 2000;
  const image = c.imageUrl || c.img || c.image_url || DEFAULT_COURSES[0].imageUrl;
  
  return {
    id: c.id,
    title: c.title || 'Course Title',
    titleEN: c.titleEN || c.title,
    category: c.category || 'General',
    categoryBengali: c.categoryBengali || c.category || 'সাধারণ',
    ageGroup: c.ageGroup || '৬-১৪ বছর',
    ageGroupEN: c.ageGroupEN || '6-14 Years',
    duration: c.duration || '৪ সপ্তাহ',
    durationEN: c.durationEN || '4 Weeks',
    price: priceNum,
    priceEN: `৳${priceNum.toLocaleString()}`,
    priceNum: priceNum,
    description: c.description || c.desc || 'Comprehensive learning course with live mentor support.',
    descriptionEN: c.descriptionEN || c.description || 'Comprehensive learning course with live mentor support.',
    instructor: c.instructor || c.headTeacher || 'Senior Mentor',
    headTeacher: c.headTeacher || c.instructor || 'Senior Mentor',
    rating: c.rating || 4.9,
    reviews: c.reviews || 120,
    students: c.students || '৫০০+',
    studentsEN: c.studentsEN || '500+',
    imageUrl: image,
    img: image,
    demoVideoUrl: c.demoVideoUrl || c.demo_video_url || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    googleFormUrl: c.googleFormUrl || c.google_form_url || 'https://forms.google.com/demo-enrollment-form',
    badge: c.badge || '✨',
    gradient: c.gradient || 'from-emerald-500 to-teal-600',
    bgLight: c.bgLight || 'bg-emerald-50 dark:bg-emerald-950/20',
    textAccent: c.textAccent || 'text-emerald-600 dark:text-emerald-400',
    borderAccent: c.borderAccent || 'border-emerald-200 dark:border-emerald-900/40',
    ringAccent: c.ringAccent || 'ring-emerald-400',
    level: c.level || 'সব স্তর',
    levelEN: c.levelEN || 'All Levels',
    levelColor: c.levelColor || 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    features: c.features || ['লাইভ ইন্টারেক্টিভ ক্লাস', 'মেন্টর ফিডব্যাক ও অ্যাসাইনমেন্ট', 'রেকর্ডেড ব্যাকআপ ভিডিও', 'সার্টিফিকেট ও প্র্যাকটিস শিট'],
  };
}

export function getStoredCourses(): UnifiedCourse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeCourse);
      }
    }
  } catch (e) {
    console.error('Error reading course store:', e);
  }
  return DEFAULT_COURSES.map(normalizeCourse);
}

export function saveAllCourses(courses: UnifiedCourse[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: courses }));
  } catch (e) {
    console.error('Error saving course store:', e);
  }
}

export function addOrUpdateCourse(course: Partial<UnifiedCourse>): UnifiedCourse[] {
  const current = getStoredCourses();
  const normalized = normalizeCourse(course);
  const existingIdx = current.findIndex(c => String(c.id) === String(course.id));
  
  let updated: UnifiedCourse[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...current[existingIdx], ...normalized };
  } else {
    updated = [normalized, ...current];
  }

  saveAllCourses(updated);
  return updated;
}

export function removeCourse(id: string | number): UnifiedCourse[] {
  const current = getStoredCourses();
  const updated = current.filter(c => String(c.id) !== String(id));
  saveAllCourses(updated);
  return updated;
}

export function subscribeToCourseUpdates(callback: (courses: UnifiedCourse[]) => void): () => void {
  const handleEvent = (e: any) => {
    if (e.detail) {
      callback(e.detail);
    } else {
      callback(getStoredCourses());
    }
  };

  window.addEventListener(EVENT_NAME, handleEvent);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredCourses());
    }
  });

  return () => {
    window.removeEventListener(EVENT_NAME, handleEvent);
  };
}
