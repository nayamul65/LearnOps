import React, { useState } from "react";
import { Settings, Bell, Lock, Globe, Save, CheckCircle2 } from "lucide-react";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export const GuardianSettings: React.FC = () => {
  const { isDark, toggleTheme } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const [saved, setSaved] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all mb-8 shadow-lg ${
      isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Guardian Account Settings" : "অভিভাবক অ্যাকাউন্ট সেটিংস"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEnglish ? "Configure notification preferences and portal appearance" : "নোটিফিকেশন অ্যালার্ট ও পোর্টাল প্রেফারেন্স পরিবর্তন করুন"}
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-xl">
        
        {/* Notification Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-500" />
            <span>{isEnglish ? "Notification Preferences" : "নোটিফিকেশন অ্যালার্ট সেটিংস"}</span>
          </h3>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-foreground">
              {isEnglish ? "WhatsApp Homework & Class Alerts" : "হোয়াটসঅ্যাপ হোমওয়ার্ক ও ক্লাস রিমাইন্ডার"}
            </span>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-foreground">
              {isEnglish ? "SMS Attendance & Grade Alerts" : "এসএমএস উপস্থিতি ও রিপোর্ট নোটিফিকেশন"}
            </span>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </label>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? (isEnglish ? "Settings Saved!" : "সেটিংস সংরক্ষিত হয়েছে!") : (isEnglish ? "Save Settings" : "সেটিংস সেভ করুন")}</span>
        </button>

      </div>
    </div>
  );
};
