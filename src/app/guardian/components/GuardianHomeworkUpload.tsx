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
  MessageCircle,
  Award,
  ExternalLink,
  Share2,
} from "lucide-react";
import { HomeworkSubmission, StudentProfile } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianHomeworkUploadProps {
  student: StudentProfile;
  homeworkList: HomeworkSubmission[];
  onUploadSuccess?: () => void;
}

export const GuardianHomeworkUpload: React.FC<GuardianHomeworkUploadProps> = ({
  student,
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

  const currentHomework = homeworkList.find((hw) => hw.id === selectedHomeworkId) || homeworkList[0];

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

  // Generate WhatsApp pre-filled submission message for teacher
  const generateTeacherWhatsAppUrl = () => {
    const nowStr = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const hwTitle = isEnglish ? currentHomework.titleEN : currentHomework.title;
    const studentName = isEnglish ? student.studentNameEN : student.studentName;

    const messageText = isEnglish
      ? `📚 *HOMEWORK SUBMISSION - LEARNOPS*\n\n` +
        `👤 *Student Name:* ${studentName}\n` +
        `🆔 *Student ID:* ${student.studentId}\n` +
        `📖 *Lesson:* Lesson ${currentHomework.lessonNo}\n` +
        `✍️ *Homework Title:* ${hwTitle}\n` +
        `⏰ *Upload Time:* ${nowStr}\n` +
        `🔗 *Homework File Link:* ${previews[0] || "https://learnops.app/homework/preview"}\n\n` +
        `Respected Teacher, please review the submitted handwriting sheet.`
      : `📚 *হোমওয়ার্ক জমা - LearnOps*\n\n` +
        `👤 *শিক্ষার্থীর নাম:* ${studentName}\n` +
        `🆔 *শিক্ষার্থী আইডি:* ${student.studentId}\n` +
        `📖 *লেসন নাম:* লেসন ${currentHomework.lessonNo}\n` +
        `✍️ *হোমওয়ার্ক শিরোনাম:* ${hwTitle}\n` +
        `⏰ *আপলোড সময়:* ${nowStr}\n` +
        `🔗 *হোমওয়ার্ক লিংক:* ${previews[0] || "https://learnops.app/homework/preview"}\n\n` +
        `শ্রদ্ধেয় শিক্ষক, অনুগ্রহ করে জমা প্রদানকৃত হাতের লেখার খাতাটি পরিদর্শন করুন।`;

    return `https://wa.me/${student.teacherPhone}?text=${encodeURIComponent(messageText)}`;
  };

  // Handler for Green WhatsApp Submission Button
  const handleWhatsAppSubmit = () => {
    if (previews.length === 0) return;

    setUploadProgress(10);
    setUploadSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadSuccess(true);

          // Open WhatsApp in new tab
          window.open(generateTeacherWhatsAppUrl(), "_blank");

          if (onUploadSuccess) onUploadSuccess();
          return null;
        }
        return prev + 30;
      });
    }, 300);
  };

  // Generate WhatsApp Notification message link for Guardian
  const generateGuardianNotificationWhatsAppUrl = (hw: HomeworkSubmission) => {
    const studentName = isEnglish ? student.studentNameEN : student.studentName;
    const hwTitle = isEnglish ? hw.titleEN : hw.title;
    const marks = `${hw.score}/${hw.maxScore || 100}`;

    const msg = isEnglish
      ? `📢 *HOMEWORK EVALUATION REPORT*\n\n` +
        `👤 *Student:* ${studentName}\n` +
        `✍️ *Homework:* ${hwTitle}\n` +
        `📊 *Marks:* ${marks}\n` +
        `🏅 *Grade:* ${hw.grade || "A+"}\n` +
        `📝 *Teacher Summary:* ${hw.teacherSummary || hw.feedback}\n\n` +
        `Please log in to your Guardian Portal to view the complete report.`
      : `📢 *হোমওয়ার্ক মূল্যায়ন রিপোর্ট*\n\n` +
        `👤 *শিক্ষার্থীর নাম:* ${studentName}\n` +
        `✍️ *হোমওয়ার্কের নাম:* ${hwTitle}\n` +
        `📊 *প্রাপ্ত নম্বর:* ${marks}\n` +
        `🏅 *গ্রেড:* ${hw.grade || "A+"}\n` +
        `📝 *শিক্ষকের সারসংক্ষেপ:* ${hw.teacherSummary || hw.feedback}\n\n` +
        `অনুগ্রহ করে সম্পূর্ণ রিপোর্ট দেখতে অভিভাবক পোর্টালে লগইন করুন।`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-8 mb-8">
      
      {/* Upload Box Container */}
      <div className={`rounded-3xl p-6 sm:p-8 border transition-all shadow-lg ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/90 text-slate-800"
      }`}>
        
        {/* Title Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Quick Homework Upload via WhatsApp" : "দ্রুত হোমওয়ার্ক আপলোড (WhatsApp Integration)"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEnglish ? "Upload student practice sheets directly to mentor's WhatsApp" : "শিক্ষার্থীর অনুশীলনী আপলোড করে হোয়াটসঅ্যাপের মাধ্যমে শিক্ষকের কাছে জমা দিন"}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isEnglish ? "WhatsApp Direct Flow" : "হোয়াটসঅ্যাপ সমাকলন সক্রিয়"}</span>
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
                  ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                  : isDark
                  ? "border-slate-700 bg-slate-800/40 hover:border-emerald-500/50 hover:bg-slate-800/70"
                  : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 hover:bg-emerald-50/80"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h3 className="text-base font-extrabold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Drag & Drop Image or PDF Here" : "এখানে ফাইল ড্রপ করুন বা ব্রাউজ করুন"}
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
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-300 mb-2">
                  <span>{isEnglish ? "Preparing WhatsApp Submission..." : "হোয়াটসঅ্যাপে পাঠানোর প্রস্তুতি নেওয়া হচ্ছে..."}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
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
                  <span>
                    {isEnglish
                      ? "WhatsApp opened! Teacher will inspect homework."
                      : "হোয়াটসঅ্যাপ খুলছে! শিক্ষক হোমওয়ার্ক পরীক্ষা করে ফিডব্যাক দেবেন।"}
                  </span>
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

          {/* Right Column: Previews & REQUIRED Green WhatsApp Submit Button */}
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

            {/* 🟢 REQUIRED GREEN WHATSAPP BUTTON: "হোয়াটসঅ্যাপের মাধ্যমে হোমওয়ার্ক জমা দিন" */}
            <button
              onClick={handleWhatsAppSubmit}
              disabled={previews.length === 0 || uploadProgress !== null}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2.5 ${
                previews.length > 0
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:scale-[1.01]"
                  : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              <span>হোয়াটসঅ্যাপের মাধ্যমে হোমওয়ার্ক জমা দিন</span>
            </button>
          </div>

        </div>
      </div>

      {/* Evaluated Homework Results Cards (Displaying Marks, Grade, Summary, Inspection Feedback, Dates) */}
      <div className={`rounded-3xl p-6 sm:p-8 border transition-all shadow-lg ${
        isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/90 text-slate-800"
      }`}>
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish ? "Teacher Evaluated Homework Results" : "শিক্ষকের মূল্যায়নকৃত হোমওয়ার্ক ফলাফল"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEnglish ? "Automatically synced homework marks, grades, and teacher feedback" : "শিক্ষক কর্তৃক পরখকৃত হোমওয়ার্ক নম্বর, গ্রেড ও বিস্তারিত পরিদর্শনের বিবরণ"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {homeworkList.filter((hw) => hw.status === "Graded").map((hw) => (
            <div
              key={hw.id}
              className={`p-6 rounded-3xl border transition-all ${
                isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Lesson {hw.lessonNo}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      ✓ {isEnglish ? "Graded & Inspected" : "মূল্যায়িত"}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-foreground mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {isEnglish ? hw.titleEN : hw.title}
                  </h4>
                </div>

                {/* WhatsApp Share Notification Link for Guardian */}
                <a
                  href={generateGuardianNotificationWhatsAppUrl(hw)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/20"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isEnglish ? "Share WhatsApp Alert" : "হোয়াটসঅ্যাপ নোটিফিকেশন লিংক"}</span>
                </a>
              </div>

              {/* Grid of Results: Marks, Grade, Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{isEnglish ? "Homework Marks" : "প্রাপ্ত নম্বর"}</span>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400">{hw.score}/{hw.maxScore || 100}</div>
                </div>

                <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{isEnglish ? "Grade" : "গ্রেড"}</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{hw.grade || "A+"}</div>
                </div>

                <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{isEnglish ? "Submission Date" : "জমার তারিখ"}</span>
                  <div className="text-xs font-bold text-foreground mt-1">{hw.submittedDate || "N/A"}</div>
                </div>

                <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"}`}>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{isEnglish ? "Review Date" : "মূল্যায়ন তারিখ"}</span>
                  <div className="text-xs font-bold text-foreground mt-1">{hw.reviewDate || "N/A"}</div>
                </div>
              </div>

              {/* Teacher Summary & Teacher Inspection / Feedback */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-900 dark:text-purple-200">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{isEnglish ? "Teacher Summary:" : "শিক্ষকের সারসংক্ষেপ:"} </span>
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>"{hw.teacherSummary || hw.feedback}"</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{isEnglish ? "Teacher Inspection / Feedback:" : "শিক্ষকের পরিদর্শন ও মতামত:"} </span>
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>"{hw.teacherInspection || hw.feedback}"</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
