import React, { useState } from "react";
import { GuardianTab } from "./types";
import {
  mockStudentData,
  mockBadges,
  mockHomeworkList,
  mockNotifications,
  mockWorkGallery,
} from "./mockData";
import { GuardianThemeProvider, useGuardianTheme } from "./context/GuardianThemeContext";
import { GuardianNavbar } from "./components/GuardianNavbar";
import { GuardianSidebar } from "./components/GuardianSidebar";
import { GuardianHeroBanner } from "./components/GuardianHeroBanner";
import { GuardianStatsCards } from "./components/GuardianStatsCards";
import { GuardianPerformanceReport } from "./components/GuardianPerformanceReport";
import { GuardianHomeworkUpload } from "./components/GuardianHomeworkUpload";
import { GuardianCharts } from "./components/GuardianCharts";
import { GuardianNotifications } from "./components/GuardianNotifications";
import { GuardianProgressGallery } from "./components/GuardianProgressGallery";
import { GuardianLiveClasses } from "./components/GuardianLiveClasses";
import { GuardianMessages } from "./components/GuardianMessages";
import { GuardianBilling } from "./components/GuardianBilling";
import { GuardianSettings } from "./components/GuardianSettings";
import { GuardianWhatsAppButton } from "./components/GuardianWhatsAppButton";

const GuardianDashboardContent: React.FC = () => {
  const { isDark } = useGuardianTheme();

  // Active Tab state (default: 'dashboard')
  const [activeTab, setActiveTab] = useState<GuardianTab>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Top Navbar */}
      <GuardianNavbar
        student={mockStudentData}
        unreadNotificationsCount={unreadCount}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* Main Layout: Left Sidebar + Right Main Content Area */}
      <div className="flex-1 flex w-full relative max-w-7xl mx-auto">
        
        {/* Left Navigation Sidebar */}
        <GuardianSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          student={mockStudentData}
        />

        {/* Notifications Popover */}
        {isNotificationsOpen && (
          <GuardianNotifications
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllAsRead={handleMarkAllRead}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setIsNotificationsOpen(false);
            }}
          />
        )}

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          
          {activeTab === "dashboard" && (
            <>
              {/* Glassmorphism Hero Banner */}
              <GuardianHeroBanner
                student={mockStudentData}
                onJoinLiveClass={() => setActiveTab("live-classes")}
              />

              {/* Statistics Cards */}
              <GuardianStatsCards
                student={mockStudentData}
                onDownloadReport={handleDownloadReport}
              />

              {/* Official Performance Report & Voice Note */}
              <GuardianPerformanceReport
                student={mockStudentData}
                badges={mockBadges}
                onDownloadReport={handleDownloadReport}
              />

              {/* Quick Homework Upload */}
              <GuardianHomeworkUpload
                student={mockStudentData}
                homeworkList={mockHomeworkList}
              />

              {/* Recharts Analytics */}
              <GuardianCharts studentId={mockStudentData.studentId} />
            </>
          )}

          {activeTab === "live-classes" && (
            <GuardianLiveClasses student={mockStudentData} />
          )}

          {activeTab === "homework-upload" && (
            <GuardianHomeworkUpload student={mockStudentData} homeworkList={mockHomeworkList} />
          )}

          {activeTab === "progress-gallery" && (
            <GuardianProgressGallery galleryItems={mockWorkGallery} />
          )}

          {activeTab === "messages" && (
            <GuardianMessages student={mockStudentData} />
          )}

          {activeTab === "billing" && <GuardianBilling />}

          {activeTab === "settings" && <GuardianSettings />}

        </main>
      </div>

      {/* Requirement #10: Floating WhatsApp Contact Button only */}
      <GuardianWhatsAppButton phoneNumber="8801700000000" />

    </div>
  );
};

export const GuardianDashboard: React.FC = () => {
  return (
    <GuardianThemeProvider>
      <GuardianDashboardContent />
    </GuardianThemeProvider>
  );
};

export default GuardianDashboard;
