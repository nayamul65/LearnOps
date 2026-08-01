/* ── COURSE 3 DATA FILE (Isolated for Course ID 3) ── */

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

export default COURSE_3_DATA;
