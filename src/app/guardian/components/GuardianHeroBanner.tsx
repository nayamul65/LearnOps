import React, { useState, useEffect } from "react";
import { Video, Clock, Sparkles, ArrowRight, Shield, Award } from "lucide-react";
import { StudentProfile } from "../types";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianHeroBannerProps {
  student: StudentProfile;
  onJoinLiveClass: () => void;
}

export const GuardianHeroBanner: React.FC<GuardianHeroBannerProps> = ({
  student,
  onJoinLiveClass,
}) => {
  const { isEnglish } = useLanguage();

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 border border-white/20">
      
      {/* Background Glassmorphic Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Greeting, Student info, Countdown */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <Shield className="w-4 h-4 text-purple-200" />
            <span>{isEnglish ? "Academic Performance & Live Portal" : "অভিভাবক ড্যাশবোর্ড ও একাডেমি ট্র্যাকিং"}</span>
          </div>

          {/* Student Welcome Title */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish
                ? `${student.studentNameEN}'s Learning Progress`
                : `${student.studentName}-এর পড়াশোনা ও দক্ষতা বৃদ্ধি`}
            </h1>
            <p className="text-purple-100 text-sm sm:text-base mt-1 max-w-xl font-medium" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {isEnglish ? student.courseNameEN : student.courseName}
            </p>
          </div>

          {/* Live Countdown Timer Banner (Glassmorphic Card) */}
          <div className="inline-flex flex-wrap items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200">
              <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isEnglish ? "Next Class Starts In:" : "পরবর্তী লাইভ ক্লাস শুরু হতে বাকি:"}</span>
            </div>

            {/* Timer boxes */}
            <div className="flex items-center gap-1.5 font-mono text-sm font-black">
              <div className="bg-black/30 border border-white/10 px-2.5 py-1 rounded-xl text-amber-300">
                {formatTwoDigits(timeLeft.hours)}<span className="text-[10px] font-normal text-white/70 ml-0.5">h</span>
              </div>
              <span className="text-amber-300 animate-pulse">:</span>
              <div className="bg-black/30 border border-white/10 px-2.5 py-1 rounded-xl text-amber-300">
                {formatTwoDigits(timeLeft.minutes)}<span className="text-[10px] font-normal text-white/70 ml-0.5">m</span>
              </div>
              <span className="text-amber-300 animate-pulse">:</span>
              <div className="bg-black/30 border border-white/10 px-2.5 py-1 rounded-xl text-amber-300">
                {formatTwoDigits(timeLeft.seconds)}<span className="text-[10px] font-normal text-white/70 ml-0.5">s</span>
              </div>
            </div>

            <span className="text-xs text-white/80 hidden sm:inline-block border-l border-white/20 pl-3">
              {isEnglish ? student.upcomingClassTimeEN : student.upcomingClassTime}
            </span>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={student.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onJoinLiveClass}
              className="inline-flex items-center gap-2.5 bg-white text-purple-700 hover:bg-purple-50 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-sm cursor-pointer hover:-translate-y-0.5"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <Video className="w-5 h-5 text-red-500 animate-pulse" />
              <span>{isEnglish ? "Join Live Zoom Class Now" : "লাইভ জুম ক্লাসে যোগ দিন"}</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </a>

            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{isEnglish ? `Stars: ${student.starsEarned}/${student.totalStars}` : `অর্জিত স্টার: ${student.starsEarned}/${student.totalStars}`}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Child Illustration / Avatar Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="relative">
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400 to-purple-400 blur-lg opacity-40 animate-pulse" />
            
            <div className="relative bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-2xl max-w-xs text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={student.avatar}
                  alt={student.studentNameEN}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/50 shadow-md mx-auto"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white">
                  {isEnglish ? student.studentNameEN : student.studentName}
                </h3>
                <p className="text-xs text-purple-200 font-medium">
                  {isEnglish ? "Top 5% Student in Handwriting" : "ব্যাচ টপ পারফর্মার শিক্ষার্থী"}
                </p>
              </div>

              {/* Progress Summary Pill */}
              <div className="bg-black/20 border border-white/20 p-2.5 rounded-xl text-xs flex justify-around font-bold">
                <div>
                  <div className="text-amber-300 font-black text-sm">{student.handwritingScore}%</div>
                  <div className="text-[10px] text-purple-200">{isEnglish ? "Accuracy" : "সঠিকতা"}</div>
                </div>
                <div className="border-r border-white/20" />
                <div>
                  <div className="text-emerald-300 font-black text-sm">{student.attendancePercentage}%</div>
                  <div className="text-[10px] text-purple-200">{isEnglish ? "Attendance" : "উপস্থিতি"}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
