import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const TYPEWRITER_PROMPTS = [
  "Build a social media app like Instagram",
  "Create a multiplayer online game",
  "Launch an AI-powered SaaS startup",
  "Build a personal portfolio website",
  "Create a mobile fitness tracking app",
];

const HeroSection = () => {
  const [goal, setGoal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const navigate = useNavigate();
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Typewriter effect
  useEffect(() => {
    if (isUserTyping || goal) return;

    let promptIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = TYPEWRITER_PROMPTS[promptIdx];
      if (!isDeleting) {
        setPlaceholder(current.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx >= current.length) {
          timeout = setTimeout(() => { isDeleting = true; tick(); }, 2000);
          return;
        }
        timeout = setTimeout(tick, 60);
      } else {
        setPlaceholder(current.slice(0, charIdx));
        charIdx--;
        if (charIdx < 0) {
          isDeleting = false;
          charIdx = 0;
          promptIdx = (promptIdx + 1) % TYPEWRITER_PROMPTS.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 30);
      }
    };

    timeout = setTimeout(tick, 800);
    return () => clearTimeout(timeout);
  }, [isUserTyping, goal]);

  const handleGenerate = useCallback(() => {
    if (goal.trim()) {
      navigate(`/roadmap?goal=${encodeURIComponent(goal.trim())}`);
    }
  }, [goal, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleGenerate();
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:0;height:0;border-radius:50%;
      background:hsl(0 0% 100% / 0.3);
      transform:translate(-50%,-50%);
      pointer-events:none;
    `;
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.appendChild(ripple);

    gsap.to(ripple, {
      width: 200, height: 200, opacity: 0,
      duration: 0.6, ease: "power2.out",
      onComplete: () => ripple.remove(),
    });

    handleGenerate();
  };

  // GSAP hover animation for button
  useEffect(() => {
    if (!buttonRef.current) return;
    const btn = buttonRef.current;
    const handleEnter = () => gsap.to(btn, { scale: 1.03, duration: 0.25, ease: "power2.out" });
    const handleLeave = () => gsap.to(btn, { scale: 1, duration: 0.25, ease: "power2.out" });
    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);
    return () => {
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Radial glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse,hsl(250_75%_55%/0.06),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-semibold">AI-powered learning paths</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50"
          >
            <span className="text-sm text-muted-foreground font-medium">A <span className="text-foreground font-bold text-primary">DevX</span> Studio Project</span>
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 leading-[1.1] text-foreground">
          Start with what you
          <br />
          <span className="text-gradient">want to build.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Tell us your goal. We'll reverse-engineer the skills you need and build your personalized learning roadmap.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative max-w-2xl mx-auto"
        >
          <div
            ref={inputWrapperRef}
            className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 rounded-2xl border bg-card transition-all duration-300 ${isFocused
                ? "border-primary/30 shadow-[0_0_0_4px_hsl(250_75%_55%/0.08)]"
                : "border-border glow-border"
              }`}
          >
            <input
              type="text"
              value={goal}
              onChange={(e) => { setGoal(e.target.value); setIsUserTyping(true); }}
              onKeyDown={handleKeyDown}
              onFocus={() => { setIsFocused(true); setIsUserTyping(true); }}
              onBlur={() => { setIsFocused(false); if (!goal) setIsUserTyping(false); }}
              placeholder={placeholder || "What do you want to build?"}
              className="flex-1 bg-transparent text-foreground text-lg px-4 py-3 outline-none placeholder:text-muted-foreground/50 font-body"
            />
            <button
              ref={buttonRef}
              onClick={handleRipple}
              disabled={!goal.trim()}
              className="relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              Generate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Subtle helper text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xs text-muted-foreground/60 mt-3"
          >
            Try: "Build a SaaS app" or "Create a mobile game" — no signup required
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-muted-foreground/40"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
