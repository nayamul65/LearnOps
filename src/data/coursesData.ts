/* ── COURSES DATA FILE (Isolated for Course ID 3 & Course ID 4) ── */

export const COURSE_1_YOUTUBE_URL = "https://www.youtube.com/embed/E_WC6BxHIpE";

export const COURSE_1_DATA = {
  youtubeReviewUrl: "https://www.youtube.com/embed/E_WC6BxHIpE",
  enrollUrl: "https://forms.gle/gMzsJJxmq9RqpSW66"
};

export interface Course3Data {
  courseId: number;
  title: string;
  category: string;
  badge: string;
  ageGroup: string;
  duration: string;
  youtubeReviewVideo: string;
  helplineNumber: string;
  shortDescription: string;
  detailedOverviewText: string;
  programHighlights: string[];
}

export const COURSE_3_DATA: Course3Data = {
  courseId: 3,
  title: "8 WEEKS ENGLISH SPEAKING (start program)",
  category: "Spoken English",
  badge: "ইংরেজি স্পোকেন | বিগিনার-মিড",
  ageGroup: "৮-১৫ বছর",
  duration: "৮ সপ্তাহ",
  youtubeReviewVideo: "https://youtu.be/QEKrbAwiSrs?si=4_DD0DlC3ObPjFzN",
  helplineNumber: "09611-678344",
  shortDescription:
    "শিশুদের জড়তা কাটিয়ে ফ্লুয়েন্টলি ইংরেজিতে কথা বলার আত্মবিশ্বাস তৈরির স্পেশাল স্পোকেন প্রোগ্রাম।",
  detailedOverviewText:
    "ইংলিশ স্পোকেনের মূল বাঁধা হলো মুখের জড়তা ও ভয়। এই ৮ সপ্তাহের স্পেশাল স্পোকেন প্রোগ্রামে শিশুরা একদম বেসিক থেকে ফ্লুয়েন্টলি ইংরেজিতে কথা বলা শিখবে।",
  programHighlights: [
    "প্রতিদিনের হোমওয়ার্ক",
    "স্টেপ বাই স্টেপ গাইডলাইন",
    "গাইড টিচার এর সাহায্য",
    "লাইভ সাপোর্ট ও মোটিভেশন",
    "আগে ও পরে লেখার তুলনা",
  ],
};

/* ── COURSE 4 DATA INTERFACE & OBJECT ── */
export interface Course4Data {
  courseId: number;
  title: string;
  category: string;
  badges: string[];
  description: string;
  detailedOverviewText: string;
  ageGroup: string;
  duration: string;
  enrolledStudents: string;
  rating: string;
  price: string;
  youtubeReviewUrl: string;
  helpline: string;
  programHighlights: string[];
}

export const COURSE_4_DATA: Course4Data = {
  courseId: 4,
  title: "READING & SPELLING DEVELOPMENT with PHONICS",
  category: "Phonics & Language",
  badges: ["ফোনিক্স ও উচ্চারণ", "সব স্তর"],
  description:
    "ফোনিক্স সাউন্ডের মাধ্যমে ইংরেজি সঠিকভাবে পড়া, বানান শেখা এবং উচ্চারণের জড়তা দূর করার কোর্স।",
  detailedOverviewText:
    "ফোনিক্স সাউন্ডের মাধ্যমে ইংরেজি সঠিকভাবে পড়া, বানান শেখা এবং উচ্চারণের জড়তা দূর করার বিশেষ কোর্স। এই কোর্সে শিশুরা শব্দ সাউন্ড ধরে পড়া ও নির্ভুল বানানের কৌশল আয়ত্ত করবে।",
  ageGroup: "৫-১০ বছর",
  duration: "২ মাস",
  enrolledStudents: "৮৩০ শিক্ষার্থী",
  rating: "4.8 (221 রিভিউ)",
  price: "৳২,৮০০",
  youtubeReviewUrl: "https://youtu.be/QEKrbAwiSrs?si=4_DD0DlC3ObPjFzN",
  helpline: "09611-678344",
  programHighlights: [
    "প্রতিদিনের হোমওয়ার্ক",
    "স্টেপ বাই স্টেপ গাইডলাইন",
    "গাইড টিচার এর সাহায্য",
    "লাইভ সাপোর্ট ও মোটিভেশন",
    "আগে ও পরে লেখার তুলনা",
  ],
};

/* ── COURSE 5 DATA INTERFACE & OBJECT ── */
export interface Course5Data {
  courseId: number;
  title: string;
  category: string;
  badges: string[];
  description: string;
  detailedOverviewText: string;
  ageGroup: string;
  duration: string;
  enrolledStudents: string;
  rating: string;
  price: string;
  youtubeReviewUrl: string;
  helpline: string;
  programHighlights: string[];
}

export const COURSE_5_DATA: Course5Data = {
  courseId: 5,
  title: "কুরআন সালাত ও আদব শিক্ষা",
  category: "Islamic Studies",
  badges: ["ইসলামিক শিক্ষা", "বিগিনার"],
  description:
    "মাখরাজ ও তাজবীদ সহ কুরআন তিলাওয়াত, দৈনন্দিন সালাতের নিয়ম এবং ইসলামিক আদব-কায়দা শিক্ষা।",
  detailedOverviewText:
    "মাখরাজ ও তাজবীদ সহ কুরআন তিলাওয়াত, দৈনন্দিন সালাতের নিয়ম এবং ইসলামিক আদব-কায়দা শিক্ষার বিশেষ কোর্স। সঠিক উচ্চারণ, সালাতের সঠিক আহকাম ও দৈনন্দিন শিষ্টাচার চর্চায় অভিজ্ঞ মেন্টরদের তত্ত্বাবধানে গাইডলাইন দেওয়া হয়।",
  ageGroup: "৬-৬৫ বছর",
  duration: "৩ মাস",
  enrolledStudents: "৫২০ শিক্ষার্থী",
  rating: "5 (143 রিভিউ)",
  price: "৳২,৫০০",
  youtubeReviewUrl: "https://youtu.be/kiwCdNcVks4?si=RzmhEd969uDPweWV",
  helpline: "09611-678344",
  programHighlights: [
    "✅ প্রতিদিনের তিলাওয়াত ও অনুশীলন",
    "✅ মাখরাজ ও তাজবীদের প্র্যাকটিক্যাল গাইডলাইন",
    "✅ অভিজ্ঞ গাইড টিচারের সাহায্য",
    "✅ লাইভ সাপোর্ট ও মাসআলা-মাসায়েল সমাধান",
    "✅ সঠিক উচ্চারণ ও আদব-কায়দা চর্চা",
  ],
};

export default COURSE_3_DATA;

