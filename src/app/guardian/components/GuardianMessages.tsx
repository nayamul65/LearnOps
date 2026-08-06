import React, { useState } from "react";
import { MessageSquare, Send, User, CheckCircle2 } from "lucide-react";
import { StudentProfile } from "../types";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

interface GuardianMessagesProps {
  student: StudentProfile;
}

export const GuardianMessages: React.FC<GuardianMessagesProps> = ({ student }) => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "teacher",
      text: isEnglish
        ? "Assalamu Alaikum. Araf is practicing really well! Please focus 15 mins daily on line straightness."
        : "আসসালামু আলাইকুম। আরাফ ক্লাসে খুব মনোযোগ দিচ্ছে। বাসায় লাইনের সোজা ভাবের ওপর প্রতিদিন ১৫ মিনিট প্র্যাকটিস করাবেন।",
      time: "১০:৩০ AM",
    },
    {
      id: 2,
      sender: "guardian",
      text: isEnglish
        ? "Thank you Rahila ma'am! We will make sure he practices daily."
        : "ধন্যবাদ রাহেলা ম্যাম! আমরা প্রতিদিন নিয়ম করে তাকে প্র্যাকটিস করাচ্ছি।",
      time: "১০:৩৫ AM",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "guardian",
        text: inputMessage,
        time: "এখন",
      },
    ]);
    setInputMessage("");
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all mb-8 shadow-lg ${
      isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <img
          src={student.teacherAvatar}
          alt={student.teacherName}
          className="w-11 h-11 rounded-2xl object-cover border-2 border-purple-500"
        />
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {student.teacherName} ({isEnglish ? "Course Mentor" : "কোর্স শিক্ষক"})
          </h2>
          <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isEnglish ? "Online for Guardian Support" : "অনলাইন আছেন (অভিভাবক চ্যাট)"}</span>
          </p>
        </div>
      </div>

      {/* Message Chat Window */}
      <div className="space-y-4 mb-6 min-h-[250px] max-h-[400px] overflow-y-auto p-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "guardian" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-md p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
              msg.sender === "guardian"
                ? "bg-purple-600 text-white rounded-br-none"
                : isDark
                ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
            }`} style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              <p>{msg.text}</p>
              <div className="text-[9px] opacity-70 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={isEnglish ? "Type your message to mentor..." : "শিক্ষকের সাথে মেসেজ লিখুন..."}
          className={`flex-1 p-3.5 rounded-2xl border text-xs outline-none transition-all ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-purple-500"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500"
          }`}
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        />
        <button
          onClick={handleSendMessage}
          className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white transition-all cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
