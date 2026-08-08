import React from "react";
import {
  LayoutDashboard,
  Video,
  UploadCloud,
  Settings,
  X,
} from "lucide-react";
import { GuardianTab, StudentProfile } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianSidebarProps {
  activeTab: GuardianTab;
  onTabChange: (tab: GuardianTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  student: StudentProfile;
}

export const GuardianSidebar: React.FC<GuardianSidebarProps> = ({
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  student,
}) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  // Task 1 Final navigation list: Dashboard, Live Classes, Homework Upload, Settings
  const navigationItems = [
    {
      id: "dashboard" as GuardianTab,
      label: isEnglish ? "Dashboard" : "ড্যাশবোর্ড",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "live-classes" as GuardianTab,
      label: isEnglish ? "Live Classes" : "লাইভ ক্লাস",
      icon: Video,
      badge: isEnglish ? "Live" : "লাইভ",
      badgeColor: "bg-red-500 text-white animate-pulse",
    },
    {
      id: "homework-upload" as GuardianTab,
      label: isEnglish ? "Homework Upload" : "হোমওয়ার্ক আপলোড",
      icon: UploadCloud,
      badge: isEnglish ? "Due" : "বাকি",
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "settings" as GuardianTab,
      label: isEnglish ? "Settings" : "সেটিংস",
      icon: Settings,
      badge: null,
    },
  ];

  const handleSelectTab = (tab: GuardianTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Top Header & Branding */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/25">
              ✍️
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-foreground tracking-tight">
                Learn<span className="text-purple-600 dark:text-purple-400">Ops</span>
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                {isEnglish ? "Parent Control SaaS" : "অভিভাবক কন্ট্রোল প্যানেল"}
              </p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                    : isDark
                    ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-purple-50/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mini Student Card */}
      <div className={`mt-6 p-4 rounded-2xl border transition-all ${
        isDark ? "bg-slate-900/90 border-slate-800" : "bg-purple-50/70 border-purple-100"
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={student.avatar}
              alt={student.studentNameEN}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {isEnglish ? student.studentNameEN : student.studentName}
            </p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold truncate">
              {isEnglish ? student.courseNameEN : student.courseName}
            </p>
          </div>
        </div>
        
        {/* Attendance status */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{isEnglish ? "Attendance Rate" : "উপস্থিতির হার"}:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{student.attendancePercentage}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden lg:block w-64 flex-shrink-0 border-r transition-colors ${
        isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200/80"
      }`}>
        <div className="sticky top-0 h-screen">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Sliding panel */}
          <div className={`relative w-72 max-w-full h-full shadow-2xl transition-transform ${
            isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"
          }`}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
