import { useState } from "react";
import {
  Eye, EyeOff, ArrowRight, PenLine, ShieldCheck,
  Users, BookOpen, TrendingUp, Star, CheckCircle2,
} from "lucide-react";

function cn(...c: (string | undefined | false)[]) {
  return c.filter(Boolean).join(" ");
}

const ROLES = [
  { id: "admin",    label: "অ্যাডমিন",   icon: ShieldCheck, color: "text-red-500",    bg: "bg-red-50 dark:bg-red-950/30",    ring: "ring-red-400" },
  { id: "sales",    label: "সেলস",        icon: TrendingUp,  color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30",   ring: "ring-blue-400" },
  { id: "teacher",  label: "শিক্ষক",      icon: BookOpen,    color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/30", ring: "ring-amber-400" },
  { id: "guardian", label: "অভিভাবক",    icon: Users,       color: "text-primary",    bg: "bg-green-50 dark:bg-green-950/30", ring: "ring-primary" },
] as const;

type Role = typeof ROLES[number]["id"];

const ROLE_WELCOME: Record<Role, string> = {
  admin:    "প্ল্যাটফর্মের সম্পূর্ণ নিয়ন্ত্রণ আপনার হাতে",
  sales:    "আজকের লক্ষ্য অর্জনে স্বাগতম",
  teacher:  "আপনার শিক্ষার্থীরা আপনার অপেক্ষায়",
  guardian: "সন্তানের অগ্রগতি দেখুন আজই",
};

interface LoginPageProps {
  onLogin: (role: Role) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<Role>("guardian");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const activeRole = ROLES.find((r) => r.id === role)!;

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = "ইমেইল প্রবেশ করুন";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "সঠিক ইমেইল দিন";
    if (!password) e.password = "পাসওয়ার্ড প্রবেশ করুন";
    else if (password.length < 6) e.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 1200);
  }

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1771765812031-22653b4c70a6?w=1200&h=900&fit=crop&auto=format"
          alt="Children learning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/80 to-emerald-900/90" />
        {/* Dot pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Content */}
        <div className="relative flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <PenLine className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">Learn<span className="text-green-300">Ops</span></span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-6 self-start"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              বাংলাদেশের সেরা শিক্ষা প্ল্যাটফর্ম
            </div>

            <h2
              className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-5"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              সুন্দর ভবিষ্যতের জন্য{" "}
              <span className="text-green-300">সেরা শিক্ষা</span>{" "}
              আজই শুরু করুন
            </h2>

            <p
              className="text-white/75 text-base leading-relaxed mb-8"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              হাজার হাজার শিক্ষার্থী, অভিভাবক এবং শিক্ষকরা LearnOps-এ বিশ্বাস রাখেন।
              আজই যোগ দিন এবং পার্থক্য অনুভব করুন।
            </p>

            {/* Feature list */}
            <div className="space-y-3 mb-10">
              {[
                "লাইভ ক্লাস ও রেকর্ডেড ভিডিও",
                "ব্যক্তিগত হোমওয়ার্ক রিভিউ",
                "রিয়েল-টাইম অভিভাবক ট্র্যাকিং",
                "অফিশিয়াল সার্টিফিকেট প্রোগ্রাম",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-400/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-green-300" />
                  </div>
                  <span className="text-white/80 text-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Floating stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "৫,০০০+", label: "শিক্ষার্থী" },
                { val: "৫০+",    label: "শিক্ষক" },
                { val: "৯৮%",   label: "সন্তুষ্টি" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.val}</div>
                  <div className="text-xs text-white/60 mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-3" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              "LearnOps ব্যবহার করে আমার মেয়ের হাতের লেখা সম্পূর্ণ বদলে গেছে। ড্যাশবোর্ডে সব কিছু এত সুন্দরভাবে দেখা যায়!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-green-400/30 flex items-center justify-center text-sm">👩</div>
              <div>
                <div className="text-white text-xs font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>নাজমা বেগম</div>
                <div className="text-white/50 text-[10px]" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অভিভাবক, চট্টগ্রাম</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-10 xl:p-14 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl text-foreground">Learn<span className="text-primary">Ops</span></span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold text-foreground mb-1.5"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              স্বাগতম! 👋
            </h1>
            <p
              className="text-muted-foreground text-sm"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {ROLE_WELCOME[role]}
            </p>
          </div>

          {/* Role tabs */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {ROLES.map((r) => {
              const active = r.id === role;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200",
                    active
                      ? cn("border-transparent shadow-md", r.bg, `ring-2 ${r.ring}`)
                      : "border-border hover:border-border hover:bg-muted"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", active ? r.bg : "bg-muted")}>
                    <r.icon className={cn("w-4 h-4", active ? r.color : "text-muted-foreground")} />
                  </div>
                  <span
                    className={cn("text-[10px] font-bold", active ? "text-foreground" : "text-muted-foreground")}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold text-foreground mb-2"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: undefined })); }}
                placeholder="example@email.com"
                className={cn(
                  "w-full px-4 py-3.5 bg-muted border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all",
                  errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-border"
                )}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  পাসওয়ার্ড
                </label>
                <button type="button"
                  className="text-xs font-semibold text-primary hover:text-green-700 transition-colors"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: undefined })); }}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3.5 bg-muted border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-12",
                    errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-border"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRemember((r) => !r)}
                className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                  remember ? "bg-primary border-primary" : "border-border hover:border-primary/50"
                )}
              >
                {remember && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
              <span
                className="text-sm text-muted-foreground cursor-pointer select-none"
                onClick={() => setRemember((r) => !r)}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                আমাকে মনে রাখুন
              </span>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className={cn(
                "w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm transition-all",
                loading
                  ? "bg-primary/60 text-white cursor-not-allowed"
                  : "bg-primary text-white hover:bg-green-600 shadow-lg shadow-green-200/50 dark:shadow-green-900/30 hover:-translate-y-0.5 hover:shadow-xl"
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  লগ ইন হচ্ছে...
                </>
              ) : (
                <>
                  লগ ইন করুন
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অথবা</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google login */}
            <button
              type="button"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="w-full flex items-center justify-center gap-3 border-2 border-border bg-card text-foreground font-semibold py-3.5 rounded-2xl text-sm hover:bg-muted hover:border-primary/30 transition-all"
            >
              {/* Google G icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google দিয়ে লগ ইন
            </button>
          </form>

          {/* Footer note */}
          <p
            className="text-center text-xs text-muted-foreground mt-8"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            অ্যাকাউন্ট নেই?{" "}
            <button className="text-primary font-semibold hover:text-green-700 transition-colors">
              নিবন্ধন করুন
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
