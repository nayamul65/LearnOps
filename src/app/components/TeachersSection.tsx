import React from "react";
import { Star, Users, Award, GraduationCap, CheckCircle2, Sparkles } from "lucide-react";
import { Teacher, mockTeachers } from "../data/teachersAndContactData";

interface TeachersSectionProps {
  teachers?: Teacher[];
  title?: string;
  subtitle?: string;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers = mockTeachers,
  title = "আমাদের অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দ",
  subtitle = "অভিজ্ঞ শিক্ষক ও মেন্টরদের সঠিক গাইডলাইনে আপনার সন্তানের শেখার যাত্রা হবে সুন্দর ও সাবলীল।",
}) => {
  return (
    <section id="teachers" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-xs border border-emerald-200 dark:border-emerald-800/50"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>শিক্ষকবৃন্দ</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {title}
          </h2>

          <p
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Dynamic Teacher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group relative"
            >
              <div>
                {/* Photo & Online Badge Container */}
                <div className="relative mb-5 rounded-2xl overflow-hidden aspect-square bg-muted">
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Online Status Badge */}
                  {teacher.onlineStatus && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-card/90 backdrop-blur-md border border-border rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        অনলাইনে আছেন
                      </span>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{teacher.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="mb-4">
                  <h3
                    className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {teacher.name}
                  </h3>
                  <p
                    className="text-xs font-semibold text-primary mb-3"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {teacher.title}
                  </p>

                  {/* Stats pills (Experience & Students) */}
                  <div className="flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground flex-wrap">
                    {teacher.experience && (
                      <span
                        className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg border border-border/50"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        {teacher.experience} অভিজ্ঞতা
                      </span>
                    )}
                    {teacher.totalStudents && (
                      <span
                        className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg border border-border/50"
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                      >
                        <Users className="w-3.5 h-3.5 text-primary" />
                        {teacher.totalStudents} ছাত্র-ছাত্রী
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p
                    className="text-xs text-muted-foreground leading-relaxed line-clamp-3"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {teacher.bio}
                  </p>
                </div>
              </div>

              {/* Verified Mentor Badge */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ভেরিফাইড মেন্টর
                </span>
                <span
                  className="text-[11px] font-medium text-muted-foreground"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  LearnOps Faculty
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
