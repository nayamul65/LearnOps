import React, { createContext, useContext, useState, useEffect } from "react";

type GuardianTheme = "light" | "dark";

interface GuardianThemeContextType {
  theme: GuardianTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

const GuardianThemeContext = createContext<GuardianThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export const GuardianThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<GuardianTheme>(() => {
    const saved = localStorage.getItem("guardian-theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("guardian-theme", next);
      return next;
    });
  };

  const isDark = theme === "dark";

  return (
    <GuardianThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <div className={`guardian-portal-wrapper transition-colors duration-300 ${isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
        {children}
      </div>
    </GuardianThemeContext.Provider>
  );
};

export const useGuardianTheme = () => useContext(GuardianThemeContext);
