import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Phone,
  Youtube,
  X,
  Edit3,
  Save,
  Copy,
  Check,
  Sparkles,
  Users,
  Award,
  ExternalLink,
  Star,
  Settings,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Globe2,
  Headphones,
} from "lucide-react";

/* ── ADMIN EDITABLE DATA INTERFACE FOR COURSE 3 ── */
export interface Course3DetailsData {
  courseId: number;
  courseTitle: string;
  category: string;
  badge: string;
  ageGroup: string;
  duration: string;
  totalEnrolled: string;
  rating: string;
  price: string;
  youtubeReviewVideo: string;
  helplineNumber: string;
  shortDescription: string;
  detailedOverviewText: string;
  programHighlights: string[];
}

/* ── DEFAULT ADMIN DATA FOR COURSE 3 ("8 WEEKS ENGLISH SPEAKING (start program)") ── */
export const DEFAULT_COURSE3_DATA: Course3DetailsData = {
  courseId: 3,
  courseTitle: "8 WEEKS ENGLISH SPEAKING (start program)",
  category: "Spoken English",
  badge: "ইংরেজি স্পোকেন | বিগিনার-মিড",
  ageGroup: "৮-১৫ বছর",
  duration: "৮ সপ্তাহ",
  totalEnrolled: "৭৬০ শিক্ষার্থী",
  rating: "4.9 (198 রিভিউ)",
  price: "৳৩,৫০০",
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

interface Course3DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: () => void;
  initialData?: Course3DetailsData;
}

export default function Course3DetailsModal({
  isOpen,
  onClose,
  onEnroll,
  initialData = DEFAULT_COURSE3_DATA,
}: Course3DetailsModalProps) {
  /* ── ADMIN EDITABLE STATE ── */
  const [data, setData] = useState<Course3DetailsData>(() => {
    const saved = localStorage.getItem("learnops_course3_admin_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [editForm, setEditForm] = useState<Course3DetailsData>(data);
  const [copiedHelpline, setCopiedHelpline] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setEditForm(data);
  }, [data]);

  if (!isOpen) return null;

  /* Helper to convert YouTube URL to embed format */
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("embed/")) return url;
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    }
    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`
      : "https://www.youtube-nocookie.com/embed/QEKrbAwiSrs?autoplay=0&rel=0";
  };

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    setData(editForm);
    localStorage.setItem("learnops_course3_admin_data", JSON.stringify(editForm));
    setIsAdminEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText(data.helplineNumber);
    setCopiedHelpline(true);
    setTimeout(() => setCopiedHelpline(false), 2000);
  };

  const handleAddHighlight = () => {
    setEditForm((prev) => ({
      ...prev,
      programHighlights: [...prev.programHighlights, ""],
    }));
  };

  const handleRemoveHighlight = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      programHighlights: prev.programHighlights.filter((_, i) => i !== index),
    }));
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...editForm.programHighlights];
    updated[index] = val;
    setEditForm((prev) => ({ ...prev, programHighlights: updated }));
  };

  const GOOGLE_FORM_URL = "https://forms.gle/4m35pXN861b5E6p96";

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-card border border-border/80 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* ── MODAL HEADER BANNER ── */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-5 sm:p-7 text-white relative shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur-xs">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{data.category}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-amber-400/25 text-amber-200 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{data.badge}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {data.courseTitle}
              </h2>
            </div>

            {/* Admin Edit Toggle & Close Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdminEditing(!isAdminEditing)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isAdminEditing
                    ? "bg-amber-400 text-slate-950 scale-105"
                    : "bg-white/15 hover:bg-white/25 text-white"
                }`}
                title="Admin Edit Course 3 Data"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">অ্যাডমিন মোড</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── TOAST NOTIFICATION ── */}
        {savedToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            <CheckCircle2 className="w-4 h-4" />
            <span>কোর্স ৩ অ্যাডমিন ডাটা সফলভাবে আপডেট করা হয়েছে!</span>
          </div>
        )}

        {/* ── MODAL BODY CONTENT ── */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">

          {/* ── ADMIN EDIT FORM (If Admin Mode Active) ── */}
          {isAdminEditing && (
            <div className="bg-blue-500/10 border-2 border-blue-500/40 rounded-3xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold border-b border-blue-500/30 pb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3>অ্যাডমিন কন্ট্রোল প্যানেল (কোর্স ৩ ডাটা এডিটর)</h3>
              </div>

              <form onSubmit={handleAdminSave} className="space-y-4 text-xs font-semibold">
                
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">কোর্স শিরোনাম:</label>
                    <input
                      type="text"
                      value={editForm.courseTitle}
                      onChange={(e) => setEditForm({ ...editForm, courseTitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1">ক্যাটাগরি:</label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* Badge & Age Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">ব্যাজ/লেবেল:</label>
                    <input
                      type="text"
                      value={editForm.badge}
                      onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1">বয়সসীমা:</label>
                    <input
                      type="text"
                      value={editForm.ageGroup}
                      onChange={(e) => setEditForm({ ...editForm, ageGroup: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* Duration & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">কোর্স মেয়াদ:</label>
                    <input
                      type="text"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1">কোর্স ফি:</label>
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* YouTube Review Video Link */}
                <div>
                  <label className="block text-foreground mb-1">ইউটিউব রিভিউ ভিডিও লিংক:</label>
                  <input
                    type="text"
                    value={editForm.youtubeReviewVideo}
                    onChange={(e) => setEditForm({ ...editForm, youtubeReviewVideo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                {/* Helpline Number */}
                <div>
                  <label className="block text-foreground mb-1">হেল্পলাইন নম্বর:</label>
                  <input
                    type="text"
                    value={editForm.helplineNumber}
                    onChange={(e) => setEditForm({ ...editForm, helplineNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-foreground mb-1">সংক্ষিপ্ত বিবরণ (Short Description):</label>
                  <input
                    type="text"
                    value={editForm.shortDescription}
                    onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-medium"
                  />
                </div>

                {/* Detailed Overview */}
                <div>
                  <label className="block text-foreground mb-1">বিস্তারিত ওভারভিউ টেক্সট (Detailed Overview):</label>
                  <textarea
                    rows={3}
                    value={editForm.detailedOverviewText}
                    onChange={(e) => setEditForm({ ...editForm, detailedOverviewText: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground resize-none font-medium"
                  />
                </div>

                {/* Program Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-foreground">প্রোগ্রামে যা যা থাকবে (Highlights):</label>
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      + নতুন হাইলাইট যোগ করুন
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editForm.programHighlights.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleHighlightChange(idx, e.target.value)}
                          className="flex-1 p-2 rounded-xl bg-background border border-border text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ করুন (Save Course 3 Admin Data)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── HEADER & OVERVIEW SECTION ── */}
          <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Users className="w-4 h-4" />
                    <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>বয়স: {data.ageGroup}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{data.totalEnrolled}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{data.rating}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {data.shortDescription}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {data.detailedOverviewText}
                </p>
              </div>

              {/* Price & Duration Pill */}
              <div className="flex items-center gap-4 bg-background border border-border/80 p-3.5 rounded-2xl shadow-xs shrink-0">
                <div className="text-center px-3 border-r border-border">
                  <span className="text-lg font-extrabold text-blue-600 block" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {data.duration}
                  </span>
                  <span className="text-[10px] text-muted-foreground">কোর্স মেয়াদ</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-lg font-extrabold text-indigo-600 block" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {data.price}
                  </span>
                  <span className="text-[10px] text-muted-foreground">কোর্স ফি</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── PROGRAM HIGHLIGHTS (প্রোগ্রামে যা যা থাকবে) ── */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              <Award className="w-5 h-5 text-blue-600" />
              প্রোগ্রামে যা যা থাকবে:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.programHighlights.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ✅ {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CONTACT & YOUTUBE REVIEW VIDEO SECTION ── */}
          <div className="space-y-6">
            
            {/* Embedded YouTube Review Video Player */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
              <div className="bg-muted/60 px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <Youtube className="w-5 h-5 fill-red-600 text-white" />
                  <span>🎥 রিভিউ ও ডেমো ক্লাস ভিডিও (YouTube Review Player)</span>
                </div>
                <span className="text-[11px] text-muted-foreground">HD 1080p</span>
              </div>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(data.youtubeReviewVideo)}
                  title="Course 3 YouTube Review Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>

            {/* Helpline Info Box */}
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    বিস্তারিত জানতে কল করুন: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold">{data.helplineNumber}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    আমাদের স্পোকেন মেন্টরদের সাথে সরাসরি কথা বলে ব্যাচ সময় জেনে নিন
                  </p>
                </div>
              </div>

              <a
                href={`tel:${data.helplineNumber.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল করুন</span>
              </a>
            </div>

          </div>

          {/* ── ACTION BUTTONS & ENROLL SECTION ── */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute left-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
              
              {/* Helpline Phone Box */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>লাইভ হেল্পলাইন সাপোর্ট</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <span>📞 হেল্পলাইন:</span>
                  <a href={`tel:${data.helplineNumber.replace(/[^0-9]/g, "")}`} className="hover:underline font-mono">
                    {data.helplineNumber}
                  </a>
                </h4>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyHelpline}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-3.5 rounded-2xl text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {copiedHelpline ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedHelpline ? "কপি হয়েছে" : "📞 হেল্পলাইন: " + data.helplineNumber}</span>
                </button>

                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-blue-50 text-blue-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center gap-2"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <span>🚀 এনরোল করুন ({data.price})</span>
                  <ArrowRight className="w-4 h-4 text-blue-700" />
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="bg-muted/40 px-6 py-4 border-t border-border flex items-center justify-between shrink-0 text-xs text-muted-foreground">
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            LearnOps Verified Spoken English Course · Course ID: 3
          </span>
          <button
            onClick={onClose}
            className="font-bold text-foreground hover:underline cursor-pointer"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            বন্ধ করুন (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
