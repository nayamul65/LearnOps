import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Top Route Loading Progress Bar component for snappy visual feedback
 */
export function RouteProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(25);

    const timer1 = setTimeout(() => setProgress(65), 100);
    const timer2 = setTimeout(() => setProgress(100), 250);
    const timer3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-slate-200/20">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 shadow-[0_0_12px_#22c55e] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}

/**
 * Scroll to top automatically on route changes
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

/**
 * Main Page Transition Wrapper
 * Modern fade, scale-lift & slide up transition matching premium educational platforms.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <>
      <RouteProgressBar />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.995 }}
          transition={{
            duration: 0.28,
            ease: [0.16, 1, 0.3, 1], // Custom snappy ease-out spring
          }}
          className="w-full flex-1 flex flex-col min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
