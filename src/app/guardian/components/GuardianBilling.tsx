import React from "react";
import { CreditCard, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import { BillingInvoice } from "../types";
import { mockInvoices } from "../mockData";
import { useGuardianTheme } from "../context/GuardianThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export const GuardianBilling: React.FC = () => {
  const { isDark } = useGuardianTheme();
  const { isEnglish } = useLanguage();

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all mb-8 shadow-lg ${
      isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/90 text-slate-800"
    }`}>
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {isEnglish ? "Course Billing & Payment History" : "পেমেন্ট ইতিহাস ও রসিদ (Billing)"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEnglish ? "View course fee payments and download official money receipt" : "কোর্স ফি পরিশোধের রসিদ ও বকেয়া স্ট্যাটাস"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockInvoices.map((inv) => (
          <div
            key={inv.id}
            className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
              isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-600 dark:text-purple-400">{inv.invoiceNo}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ✓ {isEnglish ? "Paid" : "পরিশোধিত"}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {inv.courseName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {inv.method} • {inv.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-black text-foreground">{inv.amount}</span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs hover:bg-purple-600 hover:text-white transition-all cursor-pointer border border-purple-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isEnglish ? "Invoice PDF" : "রসিদ ডাউনলোড"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
