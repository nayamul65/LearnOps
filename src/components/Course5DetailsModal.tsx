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
} from "lucide-react";
import { COURSE_5_DATA, Course5Data } from "../data/coursesData";

export interface Course5DetailsData extends Course5Data {
  courseTitle?: string;
  totalEnrolled?: string;
  youtubeReviewVideo?: string;
  facebookVideoLink?: string;
  helplineNumber?: string;
  shortDescription?: string;
  highlightBannerText?: string;
  promoText?: string;
}

export const DEFAULT_COURSE5_DATA: Course5DetailsData = {
  ...COURSE_5_DATA,
  courseTitle: COURSE_5_DATA.title,
  totalEnrolled: "৫২০+",
  youtubeReviewVideo: "https://youtu.be/kiwCdNcVks4",
  facebookVideoLink: "https://www.facebook.com/share/v/1859syYPUS/",
  helplineNumber: COURSE_5_DATA.helpline || "09611-678344",
  shortDescription: COURSE_5_DATA.description,
  highlightBannerText: "📌 সঠিক কুরআন তিলাওয়াত ও সালাতের নিয়ম শেখা আমাদের সকলের জন্য আবশ্যক।",
  promoText:
    "আমাদের ৩ মাসের কুরআন সালাত ও আদব শিক্ষা প্রোগ্রামের মাধ্যমে অভিজ্ঞ মেন্টরদের তত্ত্বাবধানে সঠিক তাজবীদ, মাখরাজ ও সালাতের প্র্যাকটিক্যাল গাইডলাইন অর্জন করুন।",
  price: "৳২,৫০০",
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
  /* ── ADMIN EDITABLE STATE ── */
  const [data, setData] = useState<Course5DetailsData>(() => {
    const saved = localStorage.getItem("learnops_course5_admin_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_COURSE5_DATA,
          ...parsed,
        };
      } catch (e) {
        return DEFAULT_COURSE5_DATA;
      }
    }
    return DEFAULT_COURSE5_DATA;
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
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return "https://www.youtube.com/embed/kiwCdNcVks4";
    if (url.includes("embed/")) return url;
    
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "https://www.youtube.com/embed/kiwCdNcVks4";
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* ── MODAL TOP HEADER BAR ── */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-2xl flex items-center justify-center shadow-inner">
              🕌
            </span>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>কোর্স ID: 5 | কুরআন সালাত ও আদব শিক্ষা</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {data.courseTitle || data.title}
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
                  ? "bg-white text-amber-900 border-white shadow-md"
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
            <span>অ্যাডমিন ডাটা সফলভাবে আপডেট করা হয়েছে!</span>
          </div>
        )}

        {/* ── MODAL BODY CONTENT ── */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">

          {/* ── ADMIN EDIT FORM (If Admin Mode Active) ── */}
          {isAdminEditing ? (
            <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold border-b border-amber-500/30 pb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3>অ্যাডমিন কন্ট্রোল প্যানেল (কোর্স ৫ ডাটা এডিটর)</h3>
              </div>

              <form onSubmit={handleAdminSave} className="space-y-4 text-xs font-semibold">
                
                {/* Course Title */}
                <div>
                  <label className="block text-foreground mb-1">কোর্স টাইটেল:</label>
                  <input
                    type="text"
                    value={editForm.courseTitle || editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, courseTitle: e.target.value, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
                </div>

                {/* Total Enrolled */}
                <div>
                  <label className="block text-foreground mb-1">মোট এনরোলড শিক্ষার্থী সংখ্যা:</label>
                  <input
                    type="text"
                    value={editForm.totalEnrolled}
                    onChange={(e) => setEditForm({ ...editForm, totalEnrolled: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
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

                {/* YouTube Link */}
                <div>
                  <label className="block text-foreground mb-1">ইউটিউব রিভিউ ভিডিও লিংক:</label>
                  <input
                    type="text"
                    value={editForm.youtubeReviewVideo || editForm.youtubeReviewUrl}
                    onChange={(e) => setEditForm({ ...editForm, youtubeReviewVideo: e.target.value, youtubeReviewUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                {/* Facebook Video Link */}
                <div>
                  <label className="block text-foreground mb-1">ফেসবুক সাকসেস ভিডিও লিংক:</label>
                  <input
                    type="text"
                    value={editForm.facebookVideoLink}
                    onChange={(e) => setEditForm({ ...editForm, facebookVideoLink: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                {/* Helpline Number */}
                <div>
                  <label className="block text-foreground mb-1">হেল্পলাইন নম্বর:</label>
                  <input
                    type="text"
                    value={editForm.helplineNumber || editForm.helpline}
                    onChange={(e) => setEditForm({ ...editForm, helplineNumber: e.target.value, helpline: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-bold"
                  />
                </div>

                {/* Program Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-foreground">প্রোগ্রামের বিশেষ ফিচারসমূহ (Checklist):</label>
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
                    >
                      + নতুন ফিচার যোগ করুন
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
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
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
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs px-3.5 py-1 rounded-full mb-3">
                  <Users className="w-4 h-4" />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    🎉 {data.totalEnrolled} শিক্ষার্থী ইতোমধ্যে ক্লাস সম্পন্ন করেছে
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  আগে ও পরে কুরআন সালাত ও আদব শিক্ষার সুন্দর পরিবর্তন ও সাফল্য
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {data.promoText}
                </p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-4 bg-background border border-border/80 p-3 rounded-2xl shadow-xs">
                <div className="text-center px-3 border-r border-border">
                  <span className="text-lg font-extrabold text-amber-600 block" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
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

          {/* ── VIDEO SECTION (YOUTUBE & FACEBOOK) ── */}
          <div className="space-y-6">
            
            {/* 1. YouTube Demo Video Embed */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
              <div className="bg-muted/60 px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <Youtube className="w-5 h-5 fill-red-600 text-white" />
                  <span>🎥 কোর্স রিভিউ ভিডিও (Course Review Video)</span>
                </div>
                <span className="text-[11px] text-muted-foreground">এইচডি ভিডিও প্লেয়ার</span>
              </div>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(data.youtubeReviewVideo || data.youtubeReviewUrl || "")}
                  title="Course 5 YouTube Review Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>

            {/* 2. Facebook Past Batch Success Video Link */}
            {data.facebookVideoLink && (
              <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/20 rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Facebook className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      📹 ফেসবুক পাস্ট ব্যাচ সাকসেস ভিডিও দেখুন
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      আগের ব্যাচের শিক্ষার্থীদের অবিশ্বাস্য পরিবর্তন ও সরাসরি অভিভাবক রিভিউ
                    </p>
                  </div>
                </div>

                <a
                  href={data.facebookVideoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <span>ফেসবুকে সাকসেস ভিডিও দেখুন</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

          </div>

          {/* ── PROMOTIONAL TEXT & CHECKLIST ── */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Award className="w-5 h-5 text-amber-600" />
                কেন আমাদের এই কুরআন সালাত ও আদব শিক্ষা প্রোগ্রামটি সেরা?
              </h3>
            </div>

            {/* Features Green Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.programHighlights.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {feature.startsWith("✅") ? feature.replace(/^✅\s*/, "") : feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Highlight Banner */}
            <div className="bg-amber-500/15 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold leading-relaxed flex items-center gap-3">
              <span className="text-xl">📌</span>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {data.highlightBannerText}
              </p>
            </div>
          </div>

          {/* ── CTA & CONTACT SECTION ── */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
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
                  <a href={`tel:${helplineNum.replace(/[^0-9]/g, "")}`} className="hover:underline font-mono">
                    {helplineNum}
                  </a>
                </h4>
              </div>

              {/* Enroll Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyHelpline}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {copiedHelpline ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedHelpline ? "কপি হয়েছে" : "নম্বর কপি"}</span>
                </button>

                <button
                  onClick={onEnroll ? onEnroll : onClose}
                  className="bg-white hover:bg-amber-50 text-amber-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center gap-2"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <span>🚀 এখনই ভর্তি হন ({data.price})</span>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </button>
              </div>

            </div>

            {/* Subscribe Callout */}
            <div className="pt-4 border-t border-white/20 flex items-center justify-between gap-4 text-xs font-bold text-amber-100 relative z-10">
              <div className="flex items-center gap-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Bell className="w-4 h-4 text-amber-200 animate-bounce" />
                <span>🔔 আমাদের চ্যানেলটি সাবস্ক্রাইব করুন আরও এমন সফলতার গল্প ও শেখার ভিডিও পেতে!</span>
              </div>
              <a
                href={data.youtubeReviewVideo || data.youtubeReviewUrl || ""}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                <span>Subscribe</span>
              </a>
            </div>

          </div>

        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="bg-muted/40 px-6 py-4 border-t border-border flex items-center justify-between shrink-0 text-xs text-muted-foreground">
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            LearnOps Verified Quality Course · Course ID: 5
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
