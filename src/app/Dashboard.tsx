import { useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  CreditCard, BarChart3, Settings, Bell, Search,
  Sun, Moon, ChevronDown, TrendingUp, TrendingDown,
  GraduationCap, PenLine, Menu, X, LogOut,
  UserCircle, CheckCircle2, CircleDollarSign,
  Megaphone, Activity, ArrowUpRight, MoreHorizontal,
  Star, Zap, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

function cn(...c: (string | undefined | false)[]) {
  return c.filter(Boolean).join(" ");
}

/* ── DATA ── */
const revenueData = [
  { month: "জানু", revenue: 42000, target: 50000 },
  { month: "ফেব্রু", revenue: 58000, target: 55000 },
  { month: "মার্চ", revenue: 67000, target: 60000 },
  { month: "এপ্রিল", revenue: 54000, target: 65000 },
  { month: "মে", revenue: 78000, target: 70000 },
  { month: "জুন", revenue: 92000, target: 75000 },
  { month: "জুলাই", revenue: 88000, target: 80000 },
  { month: "আগস্ট", revenue: 105000, target: 85000 },
  { month: "সেপ্টেম্বর", revenue: 98000, target: 90000 },
  { month: "অক্টোবর", revenue: 120000, target: 95000 },
  { month: "নভেম্বর", revenue: 134000, target: 100000 },
  { month: "ডিসেম্বর", revenue: 148000, target: 110000 },
];

const studentGrowthData = [
  { month: "জানু", students: 320 },
  { month: "ফেব্রু", students: 480 },
  { month: "মার্চ", students: 620 },
  { month: "এপ্রিল", students: 740 },
  { month: "মে", students: 900 },
  { month: "জুন", students: 1100 },
  { month: "জুলাই", students: 1380 },
  { month: "আগস্ট", students: 1620 },
  { month: "সেপ্টেম্বর", students: 1890 },
  { month: "অক্টোবর", students: 2200 },
  { month: "নভেম্বর", students: 2580 },
  { month: "ডিসেম্বর", students: 3100 },
];

const conversionData = [
  { name: "ভর্তি হয়েছে", value: 68, color: "#22C55E" },
  { name: "বিবেচনায়", value: 18, color: "#F59E0B" },
  { name: "বাতিল", value: 14, color: "#EF4444" },
];

const teacherData = [
  { teacher: "রাহেলা", rating: 4.9, students: 248, completion: 97 },
  { teacher: "আরিফুল", rating: 4.8, students: 192, completion: 94 },
  { teacher: "ফারহানা", rating: 5.0, students: 215, completion: 98 },
  { teacher: "সুমাইয়া", rating: 4.9, students: 178, completion: 96 },
  { teacher: "করিম স্যার", rating: 4.7, students: 163, completion: 92 },
];

const ACTIVITIES = [
  { type: "enroll",   icon: GraduationCap, color: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",  title: "নতুন ভর্তি",           desc: "রাফি আহমেদ — হ্যান্ডরাইটিং বিশেষ কোর্স",        time: "২ মিনিট আগে",   amount: "+৳২,৫০০" },
  { type: "homework", icon: ClipboardList,  color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",    title: "হোমওয়ার্ক জমা",       desc: "তাহিয়া ইসলাম — অক্ষর গঠন চর্চা",               time: "৮ মিনিট আগে",   amount: null },
  { type: "payment",  icon: CreditCard,     color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400", title: "পেমেন্ট পাওয়া গেছে",  desc: "সামিন করিম — বিকাশ পেমেন্ট",                    time: "১৫ মিনিট আগে",  amount: "+৳৩,০০০" },
  { type: "enroll",   icon: GraduationCap, color: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",  title: "নতুন ভর্তি",           desc: "নাফিসা বেগম — বাংলা সুন্দর হাতের লেখা কোর্স",  time: "৩২ মিনিট আগে",  amount: "+৳৩,০০০" },
  { type: "homework", icon: ClipboardList,  color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",    title: "হোমওয়ার্ক জমা",       desc: "ইয়ান করিম — হরফের দূরত্ব অনুশীলন",             time: "৪৫ মিনিট আগে",  amount: null },
  { type: "payment",  icon: CreditCard,     color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400", title: "পেমেন্ট পাওয়া গেছে",  desc: "মাহিয়া আক্তার — নগদ পেমেন্ট",                  time: "১ ঘণ্টা আগে",   amount: "+৳৪,৫০০" },
  { type: "enroll",   icon: GraduationCap, color: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",  title: "নতুন ভর্তি",           desc: "রিয়াদ হোসেন — স্পিড রাইটিং কোর্স",             time: "২ ঘণ্টা আগে",   amount: "+৳২,৮০০" },
];

const STUDENTS = [
  { name: "রাফি আহমেদ",    course: "হ্যান্ডরাইটিং বিশেষ কোর্স",   age: "৮ বছর",  progress: 72, status: "সক্রিয়",   statusColor: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  { name: "তাহিয়া ইসলাম",  course: "বাংলা সুন্দর হাতের লেখা",      age: "১১ বছর", progress: 45, status: "সক্রিয়",   statusColor: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  { name: "সামিন করিম",    course: "ইংরেজি ক্যালিগ্রাফি কোর্স",   age: "৭ বছর",  progress: 88, status: "সম্পন্ন",   statusColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  { name: "নাফিসা বেগম",   course: "অ্যাডভান্সড মাস্টার কোর্স",   age: "১৩ বছর", progress: 31, status: "নতুন",     statusColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  { name: "ইয়ান হোসেন",    course: "স্পিড রাইটিং কোর্স",          age: "১২ বছর", progress: 60, status: "সক্রিয়",   statusColor: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
];

type NavItem = { id: string; label: string; icon: React.ElementType; badge?: number };
const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { id: "crm",       label: "CRM",         icon: Megaphone,   badge: 3 },
  { id: "students",  label: "শিক্ষার্থী",  icon: Users,       badge: 12 },
  { id: "teachers",  label: "শিক্ষক",      icon: GraduationCap },
  { id: "homework",  label: "হোমওয়ার্ক",   icon: ClipboardList, badge: 8 },
  { id: "payments",  label: "পেমেন্ট",     icon: CreditCard },
  { id: "reports",   label: "রিপোর্ট",     icon: BarChart3 },
  { id: "settings",  label: "সেটিংস",      icon: Settings },
];

const STAT_CARDS = [
  { title: "মোট শিক্ষার্থী", value: "৫,২৪৮", change: "+১২.৫%", up: true,  icon: Users,             color: "bg-blue-50 dark:bg-blue-950/30",    iconColor: "text-blue-500",   sub: "গত মাসে ৩৪৮ জন নতুন" },
  { title: "মাসিক আয়",      value: "৳১,৪৮,০০০", change: "+২৩.১%", up: true, icon: CircleDollarSign, color: "bg-green-50 dark:bg-green-950/30",  iconColor: "text-primary",    sub: "লক্ষ্যমাত্রার ১৩৫%" },
  { title: "মোট সেলস",      value: "২,৮৪০", change: "+৮.৩%",  up: true,  icon: TrendingUp,        color: "bg-amber-50 dark:bg-amber-950/30",  iconColor: "text-amber-500",  sub: "এই মাসে ৩৫০+ নতুন" },
  { title: "সক্রিয় শিক্ষক", value: "৫২",    change: "-২",     up: false, icon: BookOpen,          color: "bg-purple-50 dark:bg-purple-950/30",iconColor: "text-purple-500", sub: "৪টি পদ খালি আছে" },
  { title: "সক্রিয় কোর্স",  value: "১৮",    change: "+৩",     up: true,  icon: Zap,              color: "bg-red-50 dark:bg-red-950/30",      iconColor: "text-red-500",    sub: "৫টি নতুন কোর্স আসছে" },
];

/* ── CUSTOM TOOLTIP ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-xl text-xs">
      <p className="font-bold text-foreground mb-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, fontFamily: "'Hind Siliguri', sans-serif" }}>
          {p.name}: {typeof p.value === "number" && p.value > 999
            ? `৳${(p.value / 1000).toFixed(0)}k`
            : p.value}
        </p>
      ))}
    </div>
  );
}

interface DashboardProps {
  dark: boolean;
  toggleDark: () => void;
  onLogout: () => void;
}

export default function Dashboard({ dark, toggleDark, onLogout }: DashboardProps) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ═══════════ SIDEBAR ═══════════ */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md shadow-green-300/30">
              <PenLine className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base text-foreground">Learn<span className="text-primary">Ops</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-white shadow-md shadow-green-200/40 dark:shadow-green-900/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                      active ? "bg-white/20 text-white" : "bg-red-500 text-white")}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-muted/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">Admin</div>
              <div className="text-xs text-muted-foreground truncate">admin@learnops.com.bd</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4" />
            লগ আউট
          </button>
        </div>
      </aside>

      {/* ═══════════ MAIN ═══════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── TOP NAVBAR ── */}
        <header className="h-16 bg-card border-b border-border flex items-center gap-4 px-4 sm:px-6 flex-shrink-0">
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="শিক্ষার্থী, কোর্স বা পেমেন্ট খুঁজুন..."
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 z-50">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>নোটিফিকেশন</span>
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">৫ নতুন</span>
                  </div>
                  <div className="divide-y divide-border max-h-72 overflow-y-auto">
                    {ACTIVITIES.slice(0, 4).map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", a.color)}>
                          <a.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.title}</div>
                          <div className="text-[11px] text-muted-foreground truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.desc}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border">
                    <button className="w-full text-xs font-semibold text-primary text-center" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সকল নোটিফিকেশন দেখুন</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">A</div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-foreground">Admin</div>
                  <div className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সুপার অ্যাডমিন</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 z-50 overflow-hidden">
                  {[
                    { icon: UserCircle, label: "প্রোফাইল" },
                    { icon: Settings, label: "সেটিংস" },
                  ].map((item) => (
                    <button key={item.label}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-border">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      <LogOut className="w-4 h-4" />
                      লগ আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Page title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>ড্যাশবোর্ড</h1>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>বৃহস্পতিবার, ১৭ জুলাই ২০২৫</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-2 rounded-full"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <Activity className="w-3.5 h-3.5" />
                সিস্টেম সক্রিয়
              </div>
              <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-green-600 transition-all shadow-md shadow-green-200/40"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                রিপোর্ট
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {STAT_CARDS.map((card) => (
              <div key={card.title}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all hover:-translate-y-0.5 group">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.color)}>
                    <card.icon className={cn("w-5 h-5", card.iconColor)} />
                  </div>
                  <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                    card.up
                      ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400")}>
                    {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {card.change}
                  </div>
                </div>
                <div className="font-bold text-xl sm:text-2xl text-foreground leading-none mb-0.5"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{card.value}</div>
                <div className="text-xs font-semibold text-foreground mb-1"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{card.title}</div>
                <div className="text-[10px] text-muted-foreground"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* ── CHARTS ROW 1 ── */}
          <div className="grid lg:grid-cols-3 gap-4">

            {/* Monthly Revenue */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>মাসিক আয় বিশ্লেষণ</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আয় বনাম লক্ষ্যমাত্রা</p>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আয়</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>লক্ষ্য</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "'Hind Siliguri', sans-serif", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="আয়" stroke="#22C55E" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: "#22C55E" }} />
                  <Area type="monotone" dataKey="target" name="লক্ষ্য" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="5 3" fill="url(#targetGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Conversion Pie */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="mb-5">
                <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সেলস কনভার্শন</h3>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>এই মাসের ফানেল</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={conversionData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {conversionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {conversionData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CHARTS ROW 2 ── */}
          <div className="grid lg:grid-cols-2 gap-4">

            {/* Student Growth */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>শিক্ষার্থী বৃদ্ধি</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সারা বছরের ট্রেন্ড</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <TrendingUp className="w-3 h-3" /> +৮৬৮%
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={studentGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "'Hind Siliguri', sans-serif", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="students" name="শিক্ষার্থী" fill="#22C55E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Teacher Performance */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>শিক্ষক পারফরম্যান্স</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>রেটিং ও শিক্ষার্থী সংখ্যা</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {teacherData.map((t) => (
                  <div key={t.teacher} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {t.teacher[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{t.teacher}</span>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-foreground">{t.rating}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                          style={{ width: `${t.completion}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-[10px] font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{t.students}</div>
                      <div className="text-[9px] text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>শিক্ষার্থী</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="grid lg:grid-cols-5 gap-4">

            {/* Recent Activity */}
            <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সাম্প্রতিক কার্যক্রম</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আজকের আপডেট</p>
                </div>
                <button className="text-xs font-semibold text-primary hover:text-green-700 transition-colors"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সব দেখুন</button>
              </div>
              <div className="space-y-3">
                {ACTIVITIES.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", a.color)}>
                      <a.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.title}</span>
                        {i < 2 && <span className="bg-red-100 dark:bg-red-900/30 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>নতুন</span>}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {a.amount && <div className="text-xs font-bold text-primary" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.amount}</div>}
                      <div className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Students */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সক্রিয় শিক্ষার্থী</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>অগ্রগতি ট্র্যাকার</p>
                </div>
                <button className="text-xs font-semibold text-primary" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>সব</button>
              </div>
              <div className="space-y-3">
                {STUDENTS.map((s) => (
                  <div key={s.name} className="p-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {s.name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.name}</div>
                          <div className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.age}</div>
                        </div>
                      </div>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1", s.statusColor)}
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", s.progress >= 80 ? "bg-primary" : s.progress >= 50 ? "bg-amber-400" : "bg-blue-400")}
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground flex-shrink-0">{s.progress}%</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 truncate" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>{s.course}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </main>
      </div>
    </div>
  );
}
