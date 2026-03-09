import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToInput = () => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder]');
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => input.focus(), 500);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            Reverse<span className="text-primary">Learning</span>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] uppercase tracking-tighter text-primary font-black border border-primary/20">by DevX</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={toggleTheme}
              className="relative w-9 h-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "moon" : "sun"}
                  initial={{ scale: 0, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          )}

          {isHome && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={scrollToInput}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-display font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-200"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
