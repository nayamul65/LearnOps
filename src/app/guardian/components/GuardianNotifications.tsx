import React from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  Video,
  UploadCloud,
  X,
  ChevronRight,
} from "lucide-react";
import { NotificationItem, GuardianTab } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianNotificationsProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: GuardianTab) => void;
}

export const GuardianNotifications: React.FC<GuardianNotificationsProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onNavigateTab,
}) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "homework":
        return <UploadCloud className="w-4 h-4 text-amber-500" />;
      case "class":
        return <Video className="w-4 h-4 text-blue-500" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className={`absolute right-4 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl border transition-all overflow-hidden ${
      isDark
        ? "bg-slate-900 border-slate-800 text-slate-100"
        : "bg-white border-slate-200 text-slate-800"
    }`}>
      
      {/* Popover Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="font-extrabold text-sm text-foreground">
            {isEnglish ? "Notifications & Reminders" : "নোটিফিকেশন ও রিমাইন্ডার"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            {isEnglish ? "Mark all read" : "সব পড়া চিহ্নিত করুন"}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            {isEnglish ? "No new notifications" : "কোনো নতুন নোটিফিকেশন নেই"}
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.linkTab) onNavigateTab(notif.linkTab);
                onClose();
              }}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer flex gap-3 ${
                !notif.read
                  ? isDark
                    ? "bg-purple-950/20 hover:bg-purple-950/40"
                    : "bg-purple-50/60 hover:bg-purple-50"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/60 opacity-80"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {isEnglish ? notif.titleEN : notif.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  {isEnglish ? notif.messageEN : notif.message}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-purple-600 self-center flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
