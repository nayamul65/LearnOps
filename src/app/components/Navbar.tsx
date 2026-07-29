import React from "react";
import { PenLine, Globe2, Sun, Moon, ArrowRight, X, Menu } from "lucide-react";

function cn(...c: (string | undefined | false)[]) {
  return c.filter(Boolean).join(" ");
}

export default function Navbar({
  page,
  setPage,
  activePage,
  links,
  lang,
  toggleLang,
  dark,
  toggleDark,
  open,
  setOpen,
  scrolled,
  t,
}: {
  page?: any;
  setPage?: (p: any) => void;
  activePage?: any;
  links?: Array<{ label: string; target: any }>;
  lang?: string;
  toggleLang?: () => void;
  dark?: boolean;
  toggleDark?: () => void;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((fn: (prev: boolean) => boolean) => void);
  scrolled?: boolean;
  t?: (key: string) => string;
}) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || page !== "home"
          ? "bg-background/95 backdrop-blur-md shadow-md shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <button onClick={() => setPage && setPage("home")} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-300/30">
              <PenLine className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">
              Learn<span className="text-primary">Ops</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {links?.map((l) => (
              <button
                key={l.target}
                onClick={() => setPage && setPage(l.target)}
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                className={cn(
                  "text-sm font-medium transition-colors relative group cursor-pointer",
                  activePage === l.target ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300",
                    activePage === l.target ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              title="Switch Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <span>{lang === "BN" ? "ENG" : "বাংলা"}</span>
            </button>

            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setPage && setPage("login")}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="text-sm font-semibold text-foreground border border-border px-4 py-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
            >
              {t ? t("login") : "Login"}
            </button>

            <button
              onClick={() => setPage && setPage("courses")}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all shadow-lg shadow-green-200/50 cursor-pointer"
            >
              {t ? t("getStarted") : "Get Started"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
            >
              <Globe2 className="w-3 h-3 text-primary" />
              <span>{lang === "BN" ? "ENG" : "BAN"}</span>
            </button>

            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted cursor-pointer"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setOpen && setOpen((o: boolean) => !o)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-muted cursor-pointer"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Dropdown Container */}
      {open && (
        <div className="lg:hidden bg-background border-t border-border px-4 pb-5 pt-3 space-y-1">
          {links?.map((l) => (
            <button
              key={l.target}
              onClick={() => {
                if (setPage) setPage(l.target);
                if (setOpen) setOpen(false);
              }}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer",
                activePage === l.target
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </button>
          ))}
          <div className="flex gap-2 pt-3">
            <button
              onClick={() => {
                if (setPage) setPage("login");
                if (setOpen) setOpen(false);
              }}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="flex-1 text-sm font-semibold border border-border py-2.5 rounded-xl hover:bg-muted cursor-pointer"
            >
              {t ? t("login") : "Login"}
            </button>
            <button
              onClick={() => {
                if (setPage) setPage("courses");
                if (setOpen) setOpen(false);
              }}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              className="flex-1 text-sm font-semibold bg-primary text-white py-2.5 rounded-xl hover:bg-green-600 cursor-pointer"
            >
              {t ? t("getStarted") : "Get Started"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
