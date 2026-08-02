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
  Star,
  Settings,
  ArrowRight,
  BookOpen,
  Headphones,
} from "lucide-react";
import { COURSE_5_DATA, Course5Data } from "../data/coursesData";

export interface Course5DetailsData extends Course5Data {
  courseTitle?: string;
  totalEnrolled?: string;
  youtubeReviewVideo?: string;
  helplineNumber?: string;
  shortDescription?: string;
}

export const DEFAULT_COURSE5_DATA: Course5DetailsData = {
  ...COURSE_5_DATA,
  courseTitle: COURSE_5_DATA.title,
  totalEnrolled: COURSE_5_DATA.enrolledStudents,
  youtubeReviewVideo: COURSE_5_DATA.youtubeReviewUrl,
  helplineNumber: COURSE_5_DATA.helpline,
  shortDescription: COURSE_5_DATA.description,
};

interface Course5DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: () => void;
  initialData?: Course5DetailsData;
}

export default function Course5DetailsModal({
  isOpen,
  onClose,
  onEnroll,
  initialData = DEFAULT_COURSE5_DATA,
}: Course5DetailsModalProps) {
  /* ── ADMIN EDITABLE STATE FOR COURSE 5 ── */
  const [data, setData] = useState<Course5DetailsData>(() => {
    const saved = localStorage.getItem("learnops_course5_admin_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_COURSE5_DATA,
          ...parsed,
          badges: Array.isArray(parsed.badges) ? parsed.badges : DEFAULT_COURSE5_DATA.badges,
        };
      } catch (e) {
        return DEFAULT_COURSE5_DATA;
      }
    }
    return {
      ...DEFAULT_COURSE5_DATA,
      ...initialData,
    };
  });

  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [editForm, setEditForm] = useState<Course5DetailsData>(data);
  const [copiedHelpline, setCopiedHelpline] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setEditForm(data);
  }, [data]);

  if (!isOpen) return null;

  /* Helper to convert YouTube URL to embed format */
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/kiwCdNcVks4?autoplay=0&rel=0";
    if (url.includes("embed/")) return url;
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
      : "https://www.youtube.com/embed/kiwCdNcVks4?autoplay=0&rel=0";
  };

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    setData(editForm);
    localStorage.setItem("learnops_course5_admin_data", JSON.stringify(editForm));
    setIsAdminEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const helplineNum = data.helplineNumber || data.helpline || "09611-678344";

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText(helplineNum);
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

  const handleEnrollClick = () => {
    if (onEnroll) {
      onEnroll();
    } else {
      window.open("https://forms.google.com/demo-enrollment-form", "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 bg-teal-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Course 5 Admin Data Updated Successfully!</span>
        </div>
      )}

      {/* Main Modal Container */}
      <div
        className="bg-card border border-border rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >

        {/* ── MODAL HEADER ── */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-white/20 text-white font-bold text-[11px] px-3 py-0.5 rounded-full border border-white/30 backdrop-blur-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-teal-200" />
                  <span>কোর্স ৫</span>
                </span>
                {data.badges?.map((b, i) => (
                  <span
                    key={i}
                    className="bg-emerald-500/30 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-400/40"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {data.title || data.courseTitle}
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm mt-1 flex items-center gap-1.5 font-medium">
                <span>বিষয়: {data.category}</span>
                <span>•</span>
                <span>কোর্স আইডি: {data.courseId}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAdminEditing(!isAdminEditing)}
                className={`p-2.5 rounded-full transition-all cursor-pointer ${
                  isAdminEditing
                    ? "bg-amber-500 text-white ring-2 ring-amber-300"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
                title={isAdminEditing ? "Close Admin Mode" : "Admin Edit Course 5"}
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── MODAL SCROLLABLE CONTENT BODY ── */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-background text-foreground">

          {/* ── ADMIN EDIT PANEL ── */}
          {isAdminEditing && (
            <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  <Settings className="w-4 h-4" />
                  <span>এডমিন মোড (Course 5 Data Customization)</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold">
                  Admin Panel
                </span>
              </div>

              <form onSubmit={handleAdminSave} className="space-y-4 text-xs">
                {/* Course Title */}
                <div>
                  <label className="block text-foreground mb-1 font-bold">কোর্স টাইটেল (Title):</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
                </div>

                {/* Category & Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1 font-bold">ক্যাটাগরি (Category):</label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1 font-bold">রেটিং ও রিভিউ (Rating):</label>
                    <input
                      type="text"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* Age Group & Enrolled Students */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1 font-bold">বয়সসীমা (Age Group):</label>
                    <input
                      type="text"
                      value={editForm.ageGroup}
                      onChange={(e) => setEditForm({ ...editForm, ageGroup: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1 font-bold">শিক্ষার্থী সংখ্যা (Enrolled Students):</label>
                    <input
                      type="text"
                      value={editForm.enrolledStudents}
                      onChange={(e) => setEditForm({ ...editForm, enrolledStudents: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* Duration & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1 font-bold">কোর্স মেয়াদ (Duration):</label>
                    <input
                      type="text"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1 font-bold">কোর্স ফি (Price):</label>
                    <input
                      type="text"
                      value={editForm.price || "৳৩,০০০"}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                    />
                  </div>
                </div>

                {/* YouTube Review Video Link */}
                <div>
                  <label className="block text-foreground mb-1 font-bold">ইউটিউব রিভিউ ভিডিও লিংক (YouTube Review Video):</label>
                  <input
                    type="text"
                    value={editForm.youtubeReviewUrl || editForm.youtubeReviewVideo}
                    onChange={(e) => setEditForm({ ...editForm, youtubeReviewUrl: e.target.value, youtubeReviewVideo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                {/* Helpline Number */}
                <div>
                  <label className="block text-foreground mb-1 font-bold">হেল্পলাইন নম্বর (Helpline Number):</label>
                  <input
                    type="text"
                    value={editForm.helpline || editForm.helplineNumber}
                    onChange={(e) => setEditForm({ ...editForm, helpline: e.target.value, helplineNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-foreground mb-1 font-bold">সংক্ষিপ্ত বিবরণ (Description):</label>
                  <textarea
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground resize-none font-medium"
                  />
                </div>

                {/* Program Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-foreground font-bold">প্রোগ্রাম হাইলাইটস (Program Highlights):</label>
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
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ করুন (Save Course 5 Data)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── HEADER & OVERVIEW SECTION ── */}
          <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Users className="w-4 h-4" />
                    <span>বয়স: {data.ageGroup}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    <span>{data.enrolledStudents || data.totalEnrolled || "৫২০ শিক্ষার্থী"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs px-3 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{data.rating || "5 (143 রিভিউ)"}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {data.description || data.shortDescription}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed">
                  {data.detailedOverviewText}
                </p>
              </div>

              {/* Price & Duration Pill */}
              <div className="flex items-center gap-4 bg-background border border-border/80 p-3.5 rounded-2xl shadow-xs shrink-0">
                <div className="text-center px-3 border-r border-border">
                  <span className="text-lg font-extrabold text-teal-600 block">
                    {data.duration}
                  </span>
                  <span className="text-[10px] text-muted-foreground">কোর্স মেয়াদ</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-lg font-extrabold text-emerald-600 block">
                    {data.price || "৳৩,০০০"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">কোর্স ফি</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── PROGRAM HIGHLIGHTS (মডালে যা দেখাবে) ── */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              প্রোগ্রাম হাইলাইটস (Program Highlights):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.programHighlights.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">
                    {feature.startsWith("✅") ? feature : `✅ ${feature}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── YOUTUBE REVIEW VIDEO PLAYER SECTION ── */}
          <div className="space-y-6">
            
            {/* Embedded YouTube Review Video Player */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
              <div className="bg-muted/60 px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm">
                  <Youtube className="w-5 h-5 fill-red-600 text-white" />
                  <span>🎥 রিভিউ ও ডেমো ক্লাস ভিডিও (YouTube Review Player)</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">HD 1080p</span>
              </div>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(data.youtubeReviewUrl || data.youtubeReviewVideo || "")}
                  title="Course 5 YouTube Review Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>

            {/* Helpline Info Box */}
            <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground">
                    বিস্তারিত জানতে কল করুন: <span className="font-mono text-teal-600 dark:text-teal-400 font-extrabold">{helplineNum}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    আমাদের ইসলামিক স্টাডিজ মেন্টরদের সাথে সরাসরি কথা বলে ব্যাচ সময় জেনে নিন
                  </p>
                </div>
              </div>

              <a
                href={`tel:${helplineNum.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল করুন</span>
              </a>
            </div>

          </div>

          {/* ── ACTION BUTTONS & ENROLL SECTION ── */}
          <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute left-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
              
              {/* Helpline Phone Box */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>লাইভ হেল্পলাইন সাপোর্ট</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                  <span>📞 হেল্পলাইন:</span>
                  <a href={`tel:${helplineNum.replace(/[^0-9]/g, "")}`} className="hover:underline font-mono">
                    {helplineNum}
                  </a>
                </h4>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyHelpline}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-3.5 rounded-2xl text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedHelpline ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedHelpline ? "কপি হয়েছে" : "📞 হেল্পলাইন: " + helplineNum}</span>
                </button>

                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <span>🚀 এনরোল করুন ({data.price || "৳৩,০০০"})</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="bg-muted/40 px-6 py-4 border-t border-border flex items-center justify-between shrink-0 text-xs text-muted-foreground">
          <span>
            LearnOps Verified Islamic Studies Course · Course ID: 5
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-foreground hover:underline cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>বন্ধ করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
}
