import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import {
  mockWeeklyPracticeData,
  mockMonthlyProgressData,
  mockSkillRadarData,
} from "../mockData";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export const GuardianCharts: React.FC = () => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipText = isDark ? "#f8fafc" : "#0f172a";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const axisColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="space-y-8 mb-8">
      
      {/* Top Grid: Weekly Practice & Monthly Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* 1. Weekly Practice Minutes Chart */}
        <div className={`rounded-3xl p-6 border transition-all shadow-lg ${
          isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/90"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Weekly Practice Minutes" : "সাপ্তাহিক অনুশীলন সময় (Weekly Practice)"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isEnglish ? "Daily practice duration in minutes (Mon-Sun)" : "প্রতিদিনের অনুশীলন সময় (মিনিটে)"}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              {isEnglish ? "Avg: 27 mins/day" : "গড়: ২৭ মিনিট/দিন"}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyPracticeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={isEnglish ? "dayEN" : "day"} stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: gridColor,
                    borderRadius: "1rem",
                    color: tooltipText,
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="minutes"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name={isEnglish ? "Practice Mins" : "অনুশীলন মিনিট"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Monthly Progress Line Chart */}
        <div className={`rounded-3xl p-6 border transition-all shadow-lg ${
          isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/90"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? "Monthly Score Improvement" : "মাসিক প্রগ্রেস গ্রাফ (Monthly Growth)"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isEnglish ? "Score progression over 4 weeks" : "সপ্তাহব্যাপী স্কোরের উন্নতি ও গতির ধারা"}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {isEnglish ? "+35% Growth" : "+৩৫% বিকাশ"}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={isEnglish ? "weekEN" : "week"} stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: gridColor,
                    borderRadius: "1rem",
                    color: tooltipText,
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#6366f1" }}
                  name={isEnglish ? "Handwriting Score" : "লেখা স্কোর"}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#10b981"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: "#10b981" }}
                  name={isEnglish ? "Speed Score" : "গতি স্কোর"}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Full Radar Chart: Skill Analytics */}
      <div className={`rounded-3xl p-6 border transition-all shadow-lg ${
        isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/90"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Comprehensive Skill Analytics Radar" : "সামগ্রিক স্কিল অ্যানালিটিক্স (Skill Analytics)"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEnglish ? "Evaluation across 6 core handwriting parameters" : "হাতের লেখার ৬টি প্রধান বিষয়ের মূল্যায়ন ম্যাট্রিক্স"}
              </p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={mockSkillRadarData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey={isEnglish ? "skillEN" : "skill"} stroke={axisColor} fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={axisColor} fontSize={10} />
              <Radar
                name={isEnglish ? "Skill Score" : "স্কিল স্কোর"}
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: gridColor,
                  borderRadius: "1rem",
                  color: tooltipText,
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
