import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

interface GuardianWhatsAppButtonProps {
  phoneNumber?: string; // Default: '8801700000000'
  message?: string;
}

export const GuardianWhatsAppButton: React.FC<GuardianWhatsAppButtonProps> = ({
  phoneNumber = "8801700000000",
  message = "Hello, I am a parent/guardian seeking assistance regarding LearnOps courses.",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-20 right-6 z-40 flex items-center gap-3">
      {/* Tooltip on hover */}
      <div
        className={`transition-all duration-300 transform origin-right ${
          showTooltip
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 translate-x-2 pointer-events-none"
        }`}
      >
        <div className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 whitespace-nowrap flex items-center gap-1.5">
          <span>Need Help? Chat on WhatsApp</span>
        </div>
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer group border-2 border-white dark:border-slate-800"
        aria-label="Chat on WhatsApp"
        title="Need Help? Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500 group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};
