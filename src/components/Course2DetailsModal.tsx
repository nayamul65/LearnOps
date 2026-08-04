import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Phone,
  Youtube,
  Facebook,
  Play,
  X,
  Edit3,
  Save,
  Copy,
  Check,
  Sparkles,
  Users,
  Award,
  ExternalLink,
  Bell,
  ArrowRight,
  ShieldCheck,
  Star,
  Settings,
  Baby,
  BookOpen,
} from "lucide-react";

/* ── ADMIN EDITABLE DATA INTERFACE FOR COURSE 2 ── */
export interface Course2DetailsData {
  courseId: number;
  courseTitle: string;
  category: string;
  ageGroup: string;
  duration: string;
  totalEnrolled: string;
  rating: string;
  price: string;
  youtubeDemoLink: string;
  facebookPastBatchVideo: string;
  helplineNumber: string;
  shortDescription: string;
  detailedOverviewText: string;
  programHighlights: string[];
}

/* ── DEFAULT ADMIN DATA FOR COURSE 2 ("মাত্র ৩০ দিনে ছোট থেকে সুন্দর হাতের লেখা") ── */
export const DEFAULT_COURSE2_DATA: Course2DetailsData = {
  courseId: 2,
  courseTitle: "মাত্র ৩০ দিনে ছোট থেকে সুন্দর হাতের লেখা",
  category: "Kids Handwriting",
  ageGroup: "৪-৭ বছর",
  duration: "৩০ দিন",
  totalEnrolled: "৯৮০ শিক্ষার্থী",
  rating: "4.8 (284 রিভিউ)",
  price: "৳২,০০০",
  youtubeDemoLink: "https://youtu.be/bHm2XTgFCuM?si=lI8WKgN8Q5N2XTTk",
  facebookPastBatchVideo: "https://www.facebook.com/share/v/198fBxFSwJ/",
  helplineNumber: "09611-678344",
  shortDescription:
    "ছোট বাচ্চাদের পেন্সিল গ্রিপ, স্ট্রোক প্র্যাকটিস এবং বর্ণমালার নিখুঁত আকৃতি শেখানোর বেসিক কোর্স।",
  detailedOverviewText:
    "ছোট শিশুদের জন্য প্রথম থেকেই সঠিক উপায়ে পেন্সিল ধরা ও বর্ণমালার সঠিক গঠন শেখানো অত্যন্ত জরুরি। এই ৩০ দিনের প্র্যাকটিক্যাল প্রোগ্রামে আপনার শিশু খেলার ছলে এবং আনন্দের সাথে পেন্সিল ধরা, স্ট্রোক নিয়ন্ত্রণ ও সুন্দর হাতের লেখার বেসিক ট্রিকস শিখবে।",
  programHighlights: [
    "সঠিক পেন্সিল গ্রিপ (Pencil Grip) শেখানো",
    "বেসিক স্ট্রোক ও শেইপ প্র্যাকটিস",
    "বাংলা ও ইংরেজি বর্ণমালার নিখুঁত আকৃতি",
    "ছোটদের উপযোগী বিশেষ প্র্যাকটিস ওয়ার্কবুক (PDF)",
    "নিয়মিত শিক্ষক কর্তৃক হোমওয়ার্ক ফিডব্যাক",
  ],
};

interface Course2DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: () => void;
  initialData?: Course2DetailsData;
}

export default function Course2DetailsModal({
  isOpen,
  onClose,
  onEnroll,
  initialData = DEFAULT_COURSE2_DATA,
}: Course2DetailsModalProps) {
  /* ── ADMIN EDITABLE STATE ── */
  const [data, setData] = useState<Course2DetailsData>(() => {
    const saved = localStorage.getItem("learnops_course2_admin_data");
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
  const [editForm, setEditForm] = useState<Course2DetailsData>(data);
  const [copiedHelpline, setCopiedHelpline] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setEditForm(data);
  }, [data]);

  if (!isOpen) return null;

  /* Helper to convert YouTube URL to embed format */
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/bHm2XTgFCuM";
    let videoId = "";
    const trimmed = url.trim();
    if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes("?")) {
      videoId = trimmed;
    } else {
      if (trimmed.includes("youtu.be/")) {
        videoId = trimmed.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0] || "";
      } else if (trimmed.includes("v=")) {
        videoId = trimmed.split("v=")[1]?.split("&")[0]?.split("?")[0] || "";
      } else if (trimmed.includes("embed/")) {
        videoId = trimmed.split("embed/")[1]?.split("?")[0]?.split("&")[0] || "";
      }
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : "https://www.youtube.com/embed/bHm2XTgFCuM";
  };

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    setData(editForm);
    localStorage.setItem("learnops_course2_admin_data", JSON.stringify(editForm));
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
    setEditForm((prev) => {
      const updated = [...prev.programHighlights];
      updated[index] = val;
      return { ...prev, programHighlights: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* ── MODAL TOP HEADER BAR (Teal / Emerald Theme for Kids Course 2) ── */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-2xl flex items-center justify-center shadow-inner">
              ✏️
            </span>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                <Baby className="w-3 h-3 text-teal-200" />
                <span>কোর্স ID: 2 | {data.category} ({data.ageGroup})</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {data.courseTitle}
              </h2>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            {/* Admin Edit Toggle */}
            <button
              onClick={() => setIsAdminEditing(!isAdminEditing)}
              title="Admin Editable Settings"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isAdminEditing
                  ? "bg-white text-teal-900 border-white shadow-md"
                  : "bg-white/15 text-white border-white/20 hover:bg-white/25"
              }`}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{isAdminEditing ? "ভিউ মোড" : "অ্যাডমিন এডিট"}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── TOAST NOTIFICATION ── */}
        {savedToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            <CheckCircle2 className="w-4 h-4" />
            <span>কোর্স ২ অ্যাডমিন ডাটা সফলভাবে আপডেট করা হয়েছে!</span>
          </div>
        )}

        {/* ── MODAL BODY CONTENT ── */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">

          {/* ── ADMIN EDIT FORM (If Admin Mode Active) ── */}
          {isAdminEditing ? (
            <div className="bg-teal-500/10 border-2 border-teal-500/40 rounded-3xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold border-b border-teal-500/30 pb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Edit3 className="w-5 h-5 text-teal-600" />
                <h3>অ্যাডমিন কন্ট্রোল প্যানেল (কোর্স ২ ডাটা এডিটর)</h3>
              </div>

              <form onSubmit={handleAdminSave} className="space-y-4 text-xs font-semibold">
                
                {/* Title */}
                <div>
                  <label className="block text-foreground mb-1">কোর্স শিরোনাম:</label>
                  <input
                    type="text"
                    value={editForm.courseTitle}
                    onChange={(e) => setEditForm({ ...editForm, courseTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
                </div>

                {/* Enrolled & Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">মোট এনরোলড শিক্ষার্থী:</label>
                    <input
                      type="text"
                      value={editForm.totalEnrolled}
                      onChange={(e) => setEditForm({ ...editForm, totalEnrolled: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1">রেটিং ও রিভিউ:</label>
                    <input
                      type="text"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* YouTube Demo Link */}
                <div>
                  <label className="block text-foreground mb-1">ইউটিউব ডেমো ভিডিও লিংক:</label>
                  <input
                    type="text"
                    value={editForm.youtubeDemoLink}
                    onChange={(e) => setEditForm({ ...editForm, youtubeDemoLink: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                {/* Facebook Past Batch Video */}
                <div>
                  <label className="block text-foreground mb-1">ফেসবুক পাস্ট ব্যাচ ভিডিও লিংক:</label>
                  <input
                    type="text"
                    value={editForm.facebookPastBatchVideo}
                    onChange={(e) => setEditForm({ ...editForm, facebookPastBatchVideo: e.target.value })}
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

                {/* Detailed Overview */}
                <div>
                  <label className="block text-foreground mb-1">বিস্তারিত ওভারভিউ টেক্সট:</label>
                  <textarea
                    rows={3}
                    value={editForm.detailedOverviewText}
                    onChange={(e) => setEditForm({ ...editForm, detailedOverviewText: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground resize-none"
                  />
                </div>

                {/* Program Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-foreground">প্রোগ্রামে যা যা থাকছে (Highlights):</label>
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
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
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <Save className="w-4 h-4" />
                    <span>পরিবর্তন সংরক্ষণ করুন (Save Admin Data)</span>
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* ── HEADER & OVERVIEW SECTION ── */}
          <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Baby className="w-4 h-4" />
                    <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>বয়স: {data.ageGroup}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Users className="w-4 h-4" />
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

                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {data.detailedOverviewText}
                </p>
              </div>

              {/* Price & Duration Pill */}
              <div className="flex items-center gap-4 bg-background border border-border/80 p-3 rounded-2xl shadow-xs shrink-0">
                <div className="text-center px-3 border-r border-border">
                  <span className="text-lg font-extrabold text-teal-600 block" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {data.duration}
                  </span>
                  <span className="text-[10px] text-muted-foreground">কোর্স মেয়াদ</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-lg font-extrabold text-emerald-600 block" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {data.price}
                  </span>
                  <span className="text-[10px] text-muted-foreground">কোর্স ফি</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── PROGRAM HIGHLIGHTS (প্রোগ্রামে যা যা থাকছে) ── */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              <Award className="w-5 h-5 text-teal-600" />
              প্রোগ্রামে যা যা থাকছে:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.programHighlights.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── VIDEO SECTION (YOUTUBE DEMO & FACEBOOK PAST BATCH) ── */}
          <div className="space-y-6">
            
            {/* 1. YouTube Demo Video Embed */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
              <div className="bg-muted/60 px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <Youtube className="w-5 h-5 fill-red-600 text-white" />
                  <span>🎥 কোর্স রিভিউ ভিডিও (Course Review Video)</span>
                </div>
                <span className="text-[11px] text-muted-foreground">এইচডি ভিডিও</span>
              </div>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(data.youtubeDemoLink)}
                  title="Course 2 YouTube Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>

            {/* 2. Facebook Past Batch Video */}
            <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/20 rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Facebook className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    📹 পাস্ট ব্যাচ সাকসেস ভিডিও (Facebook)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    ছোটদের সুন্দর লেখার বাস্তব পরিবর্তন ও অভিভাবকদের প্রতিক্রিয়া
                  </p>
                </div>
              </div>

              <a
                href={data.facebookPastBatchVideo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                <span>ফেসবুক ভিডিও দেখুন</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* ── ACTION BUTTONS & HELPLINE ── */}
          <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute left-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
              
              {/* Helpline Phone Box */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>লাইভ হেল্পলাইন সাপোর্ট</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <span>📞 কল করুন:</span>
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
                  <span>{copiedHelpline ? "কপি হয়েছে" : "নম্বর কপি"}</span>
                </button>

                <button
                  onClick={onEnroll ? onEnroll : onClose}
                  className="bg-white hover:bg-teal-50 text-teal-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center gap-2"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <span>🚀 এনরোল করুন ({data.price})</span>
                  <ArrowRight className="w-4 h-4 text-teal-700" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="bg-muted/40 px-6 py-4 border-t border-border flex items-center justify-between shrink-0 text-xs text-muted-foreground">
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            LearnOps Verified Kids Course · Course ID: 2
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
