import React from "react";
import {
  Sun,
  Moon,
  Bell,
  Globe2,
  Menu,
  Shield,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { StudentProfile } from "../types";

interface GuardianNavbarProps {
  student: StudentProfile;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
  onToggleMobileSidebar: () => void;
  isNotificationsOpen: boolean;
}

export const GuardianNavbar: React.FC<GuardianNavbarProps> = ({
  student,
  unreadNotificationsCount,
  onToggleNotifications,
  onToggleMobileSidebar,
  isNotificationsOpen,
}) => {
  const { isDark, toggleTheme } = useGuardianTheme();
  const { lang, toggleLang, isEnglish } = useLanguage();

  return (
    <header className={`sticky top-0 z-30 w-full border-b transition-colors backdrop-blur-md ${
      isDark
        ? "bg-slate-900/80 border-slate-800 text-slate-100"
        : "bg-white/80 border-slate-200/80 text-slate-800"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left side: Mobile menu toggle + Student identifier */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Guardian Title Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEnglish ? "Parent Portal" : "অভিভাবক পোর্টাল"}</span>
              </div>
              <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>{isEnglish ? student.studentNameEN : student.studentName}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                  {isEnglish ? student.batchEN : student.batch}
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Right side: Language, Theme toggle, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-500" />
            <span>{lang === "BN" ? "ENG" : "বাংলা"}</span>
          </button>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={onToggleNotifications}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative ${
                isNotificationsOpen
                  ? "bg-purple-600 text-white border-purple-600"
                  : isDark
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
              title="Notifications"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Student Profile Quick Avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={student.avatar}
              alt={student.studentNameEN}
              className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/40"
            />
            <div className="text-left leading-tight hidden md:block">
              <p className="text-xs font-bold text-foreground">
                {isEnglish ? student.studentNameEN : student.studentName}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isEnglish ? "Student ID: #8824" : "শিক্ষার্থী আইডি: #৮৮২৪"}
              </p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
