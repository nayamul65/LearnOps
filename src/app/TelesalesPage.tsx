import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  Lock,
  Unlock,
  CheckCircle2,
  DollarSign,
  Plus,
  Clock,
  UserCheck,
  Search,
  Filter,
  X,
  CreditCard,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { supabase, Lead } from "../lib/supabase";
import { useLanguage } from "./context/LanguageContext";

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-101",
    studentName: "আরাফ হোসেন",
    parentName: "সামিরা সুলতানা",
    phone: "01711-223344",
    courseInterest: "২৫ দিনে সুন্দর হাতের লেখা",
    status: "New",
    claimedBy: null,
    callNotes: [
      { date: "2026-07-25 10:30 AM", note: "অভিভাবক কোর্সের সময়সূচি জানতে চেয়েছেন।", agent: "সাপোর্ট" },
    ],
    date: "2026-07-25",
  },
  {
    id: "lead-102",
    studentName: "তাহিয়া রহমান",
    parentName: "মাহাবুব আলম",
    phone: "01822-334455",
    courseInterest: "অ্যাডভান্সড স্পিড ও বিউটি কোর্স",
    status: "Claimed",
    claimedBy: "আরিফুল ইসলাম (Agent #4)",
    callNotes: [
      { date: "2026-07-26 02:15 PM", note: "ফোন করা হয়েছিল, আগামীকাল বিকাশ পেমেন্ট করবেন।", agent: "আরিফুল ইসলাম" },
    ],
    date: "2026-07-26",
  },
  {
    id: "lead-103",
    studentName: "সামিন চৌধুরী",
    parentName: "নাসরিন পারভীন",
    phone: "01933-445566",
    courseInterest: "কিডস আর্লি রাইটিং ফাউন্ডেশন",
    status: "Converted",
    claimedBy: "ফারহানা বেগম (Agent #2)",
    paymentConfirmed: true,
    paymentAmount: 2500,
    trxId: "BK892310X",
    callNotes: [
      { date: "2026-07-24 11:00 AM", note: "পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে। এনরোলমেন্ট কমপ্লিট।", agent: "ফারহানা বেগম" },
    ],
    date: "2026-07-24",
  },
  {
    id: "lead-104",
    studentName: "তানভীর আহম্মেদ",
    parentName: "রেজাউল করিম",
    phone: "01644-556677",
    courseInterest: "ENGLISH SPEAKING (start program)",
    status: "New",
    claimedBy: null,
    callNotes: [],
    date: "2026-07-27",
  },
];

export default function TelesalesPage() {
  const { t, isEnglish } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState<Lead['status']>("Called");
  
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<Lead | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("2500");
  const [trxId, setTrxId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");

  const currentAgentName = "আরিফুল ইসলাম (You)";

  // Claim Lead Locking Mechanism
  const handleClaimLead = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: "Claimed",
            claimedBy: currentAgentName,
            callNotes: [
              ...lead.callNotes,
              {
                date: new Date().toLocaleString(),
                note: `${currentAgentName} লিডটি লক করেছেন (Claimed).`,
                agent: currentAgentName,
              },
            ],
          };
        }
        return lead;
      })
    );
  };

  // Log Call Note & Status Change
  const handleAddCallNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForNote || !newNote.trim()) return;

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === selectedLeadForNote.id) {
          return {
            ...lead,
            status: newStatus,
            callNotes: [
              ...lead.callNotes,
              {
                date: new Date().toLocaleString(),
                note: newNote,
                agent: currentAgentName,
              },
            ],
          };
        }
        return lead;
      })
    );

    setSelectedLeadForNote(null);
    setNewNote("");
  };

  // Confirm Payment Modal Handler
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForPayment || !trxId.trim()) return;

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === selectedLeadForPayment.id) {
          return {
            ...lead,
            status: "Converted",
            paymentConfirmed: true,
            paymentAmount: Number(paymentAmount),
            trxId: `${paymentMethod}-${trxId}`,
            callNotes: [
              ...lead.callNotes,
              {
                date: new Date().toLocaleString(),
                note: `পেমেন্ট নিশ্চিত করা হয়েছে: ৳${paymentAmount} (TrxID: ${trxId}, Method: ${paymentMethod})`,
                agent: currentAgentName,
              },
            ],
          };
        }
        return lead;
      })
    );

    setSelectedLeadForPayment(null);
    setTrxId("");
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      activeFilter === "All"
        ? true
        : activeFilter === "MyLeads"
        ? lead.claimedBy === currentAgentName
        : lead.status === activeFilter;
    const matchesSearch =
      lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-8 sm:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <PhoneCall className="w-4 h-4" />
                <span>{isEnglish ? "Telesales & CRM Portal" : "টেলিসেলস ও সিআরএম পোর্টাল"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Lead Calling & Sales Management" : "লিড কলিং ও সেলস ম্যানেজমেন্ট"}
              </h1>
              <p className="text-emerald-100 text-sm mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isEnglish ? "Logged in Agent:" : "লগইনকৃত এজেন্ট:"} <span className="font-bold text-white">{currentAgentName}</span>
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <div className="text-center px-3">
                <div className="text-2xl font-black">{leads.filter((l) => l.claimedBy === currentAgentName).length}</div>
                <div className="text-[11px] text-emerald-100">{isEnglish ? "My Claimed Leads" : "আমার লক করা লিড"}</div>
              </div>
              <div className="border-r border-white/20" />
              <div className="text-center px-3">
                <div className="text-2xl font-black text-amber-300">
                  ৳{leads.reduce((acc, curr) => acc + (curr.paymentAmount || 0), 0)}
                </div>
                <div className="text-[11px] text-emerald-100">{isEnglish ? "Confirmed Revenue" : "মোট কনফার্মড সেলস"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card border border-border p-4 rounded-2xl shadow-xs">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "All", label: isEnglish ? "All Leads" : "সব লিড" },
              { id: "MyLeads", label: isEnglish ? "My Leads" : "আমার লিড" },
              { id: "New", label: isEnglish ? "New" : "নতুন" },
              { id: "Claimed", label: isEnglish ? "Claimed" : "লক করা" },
              { id: "Converted", label: isEnglish ? "Converted" : "কনভার্টেড" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={isEnglish ? "Search by name or phone..." : "নাম বা মোবাইল লিখে খুঁজুন..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            />
          </div>
        </div>

        {/* Leads Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => {
            const isClaimedByMe = lead.claimedBy === currentAgentName;
            const isLockedByOthers = lead.claimedBy && !isClaimedByMe;

            return (
              <div
                key={lead.id}
                className={`bg-card border rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${
                  isClaimedByMe ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                }`}
              >
                <div>
                  {/* Top Status & Lock Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        lead.status === "Converted"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : lead.status === "Claimed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {lead.status === "Converted" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {lead.status}
                    </span>

                    {/* Lock State */}
                    {lead.claimedBy ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        {lead.claimedBy}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                        <Unlock className="w-3.5 h-3.5" />
                        {isEnglish ? "Available to Claim" : "ক্লেম করার জন্য খালি"}
                      </span>
                    )}
                  </div>

                  {/* Student & Guardian Info */}
                  <div className="mb-4 space-y-1">
                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      {lead.studentName}
                    </h3>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      {isEnglish ? "Guardian:" : "অভিভাবক:"} <span className="font-semibold text-foreground">{lead.parentName}</span>
                    </p>
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5 pt-1">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                    </p>
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-200/50 mt-2">
                      🎓 {lead.courseInterest}
                    </div>
                  </div>

                  {/* Call Notes History */}
                  <div className="mb-6 bg-muted/40 p-3.5 rounded-2xl border border-border/50 space-y-2 max-h-36 overflow-y-auto">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-primary" />
                      {isEnglish ? "Call Log & Notes (" : "কল লগ ও নোট ("}{lead.callNotes.length})
                    </div>
                    {lead.callNotes.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">{isEnglish ? "No call notes recorded yet." : "এখনও কোনো কল নোট যুক্ত করা হয়নি।"}</p>
                    ) : (
                      lead.callNotes.map((note, idx) => (
                        <div key={idx} className="text-xs text-foreground bg-background p-2 rounded-xl border border-border/40 space-y-0.5">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{note.agent}</span>
                            <span>{note.date}</span>
                          </div>
                          <p style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{note.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap gap-2">
                  {/* Claim Button */}
                  {!lead.claimedBy && (
                    <button
                      onClick={() => handleClaimLead(lead.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-green-600 transition-all cursor-pointer shadow-xs"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {isEnglish ? "Claim Lead" : "লিড লক করুন (Claim)"}
                    </button>
                  )}

                  {/* Add Note Button */}
                  {(isClaimedByMe || !lead.claimedBy) && (
                    <button
                      onClick={() => {
                        if (!lead.claimedBy) handleClaimLead(lead.id);
                        setSelectedLeadForNote(lead);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-card border border-border text-foreground text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-muted transition-all cursor-pointer"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <Plus className="w-3.5 h-3.5 text-primary" />
                      {isEnglish ? "Log Call Note" : "নোট যুক্ত করুন"}
                    </button>
                  )}

                  {/* Confirm Payment Button */}
                  {(isClaimedByMe || lead.status === "Converted") && (
                    <button
                      onClick={() => setSelectedLeadForPayment(lead)}
                      className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        lead.paymentConfirmed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                          : "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                      }`}
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      {lead.paymentConfirmed ? (isEnglish ? "Paid ✓" : "পেমেন্ট সম্পন্ন ✓") : (isEnglish ? "Confirm Payment" : "পেমেন্ট কনফার্ম")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL 1: ADD CALL NOTE MODAL ── */}
      {selectedLeadForNote && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setSelectedLeadForNote(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              কল নোট যুক্ত করুন - {selectedLeadForNote.studentName}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">ফোন: {selectedLeadForNote.phone}</p>

            <form onSubmit={handleAddCallNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কল স্ট্যাটাস আপডেট করুন
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary"
                >
                  <option value="Called">Called (কথা হয়েছে)</option>
                  <option value="Interested">Interested (আগ্রহী)</option>
                  <option value="Follow-up">Follow-up (পুনরায় কল দিতে হবে)</option>
                  <option value="Converted">Converted (পেমেন্ট করবেন)</option>
                  <option value="Rejected">Rejected (আগ্রহী নন)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  কল নোট / অভিভাবকের মতামত
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="যেমন: অভিভাবক আগামী কাল বিকাশে ২৫০০ টাকা পাঠাতে চেয়েছেন..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary resize-none"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all text-sm cursor-pointer"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                নোট সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CONFIRM PAYMENT MODAL ── */}
      {selectedLeadForPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setSelectedLeadForPayment(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                পেমেন্ট কনফার্মেশন ও এনরোলমেন্ট
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              শিক্ষার্থী: <span className="font-bold text-foreground">{selectedLeadForPayment.studentName}</span> ({selectedLeadForPayment.courseInterest})
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  পেমেন্ট মেথড
                </label>
                <div className="flex gap-2">
                  {["bKash", "Nagad", "Bank Transfer"].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === m ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  পেমেন্ট পরিমাণ (টাকা)
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm font-bold focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  ট্রানজেকশন আইডি (TrxID / Reference) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: BK928301X"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm font-bold focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-all text-sm cursor-pointer shadow-lg"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                পেমেন্ট ভেরিফাই ও এনরোল সম্পূর্ণ করুন ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
