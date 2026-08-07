import React, { useState } from "react";
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  X,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { HomeworkSubmission } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianHomeworkUploadProps {
  homeworkList: HomeworkSubmission[];
  onUploadSuccess?: () => void;
}

export const GuardianHomeworkUpload: React.FC<GuardianHomeworkUploadProps> = ({
  homeworkList,
  onUploadSuccess,
}) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>(
    homeworkList.find((hw) => hw.status === "Pending")?.id || homeworkList[0]?.id || ""
  );

  const [previews, setPreviews] = useState<string[]>([
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop",
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateFileSelection();
  };

  const simulateFileSelection = () => {
    // Add mock uploaded preview image
    const sampleImages = [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
    ];
    const newImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setPreviews((prev) => [...prev, newImg]);
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitUpload = () => {
    if (previews.length === 0) return;

    setUploadProgress(10);
    setUploadSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadSuccess(true);
          if (onUploadSuccess) onUploadSuccess();
          return null;
        }
        return prev + 30;
      });
    }, 400);
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all mb-8 shadow-lg ${
      isDark
        ? "bg-slate-900/90 border-slate-800 text-slate-100"
        : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish ? "Quick Homework Upload" : "দ্রুত হোমওয়ার্ক আপলোড (Homework Upload)"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isEnglish ? "Upload clear photo of student's handwriting practice sheet" : "শিক্ষার্থীর অনুশীলনকৃত খাতার স্পষ্ট ছবি বা পিডিএফ আপলোড করুন"}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isEnglish ? "Direct Teacher Inspection" : "মেন্টর সরাসরি টিপস দেবেন"}</span>
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Select Homework & Dropzone */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Select Homework Task Dropdown */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {isEnglish ? "Select Lesson / Homework Task" : "হোমওয়ার্ক লেসন নির্বাচন করুন"}
            </label>
            <select
              value={selectedHomeworkId}
              onChange={(e) => setSelectedHomeworkId(e.target.value)}
              className={`w-full p-3.5 rounded-2xl border font-bold text-sm transition-all outline-none ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              {homeworkList.map((hw) => (
                <option key={hw.id} value={hw.id}>
                  {isEnglish ? hw.titleEN : hw.title} ({hw.status === "Pending" ? "Due Now" : "Submitted"})
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative overflow-hidden ${
              isDragging
                ? "border-purple-500 bg-purple-500/10 scale-[1.01]"
                : isDark
                ? "border-slate-700 bg-slate-800/40 hover:border-purple-500/50 hover:bg-slate-800/70"
                : "border-purple-200 bg-purple-50/40 hover:border-purple-400 hover:bg-purple-50/80"
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="text-base font-extrabold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish ? "Drag & Drop Image Here" : "এখানে ফাইল ড্রপ করুন বা ব্রাউজ করুন"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
              {isEnglish ? "Supports JPG, PNG, WEBP or PDF (Max size 10MB)" : "জেপিজি, পিএনজি বা পিডিএফ ফরম্যাট সাপোর্ট করে (সর্বোচ্চ ১০ মেগাবাইট)"}
            </p>

            {/* Action buttons inside dropzone */}
            <div className="flex items-center justify-center gap-3">
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-700 transition-all cursor-pointer shadow-md">
                <ImageIcon className="w-4 h-4" />
                <span>{isEnglish ? "Browse Files" : "ফাইল সিলেক্ট করুন"}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={simulateFileSelection}
                  className="hidden"
                />
              </label>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-md">
                <Camera className="w-4 h-4" />
                <span>{isEnglish ? "Camera Upload" : "ক্যামেরা ছবি"}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={simulateFileSelection}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Progress Indicator */}
          {uploadProgress !== null && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-300 mb-2">
                <span>{isEnglish ? "Uploading Homework Sheet..." : "হোমওয়ার্ক ফাইল আপলোড হচ্ছে..."}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Banner */}
          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{isEnglish ? "Homework successfully submitted! Mentor will grade soon." : "হোমওয়ার্ক সফলভাবে জমা হয়েছে! মেন্টর শীঘ্রই মূল্যায়ন করবেন।"}</span>
              </div>
              <button
                onClick={() => setUploadSuccess(false)}
                className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Previews & Submit Action */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isEnglish ? "Uploaded Previews" : "আপলোডকৃত ছবির প্রিভিউ"}
          </h3>

          {previews.length === 0 ? (
            <div className={`p-8 rounded-3xl border text-center text-xs text-muted-foreground ${
              isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              {isEnglish ? "No preview images uploaded yet." : "এখনও কোনো ছবি যোগ করা হয়নি।"}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {previews.map((url, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img src={url} alt="Homework preview" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => removePreview(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Page {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Submit Action Button */}
          <button
            onClick={handleSubmitUpload}
            disabled={previews.length === 0 || uploadProgress !== null}
            className={`w-full py-4 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 ${
              previews.length > 0
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95 shadow-purple-500/25"
                : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <UploadCloud className="w-5 h-5" />
            <span>{isEnglish ? "Submit Homework to Mentor" : "মেন্টরের কাছে হোমওয়ার্ক জমা দিন"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
