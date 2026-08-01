/* ── COURSES DATA FILE (Isolated for Course ID 3 & Course ID 4) ── */

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

export default COURSE_3_DATA;
