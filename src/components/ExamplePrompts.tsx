import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EXAMPLE_PROMPTS } from "@/lib/roadmap-data";
import { Camera, Gamepad2, Rocket, Globe, Dumbbell, ShoppingCart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROMPT_ICONS = [Camera, Gamepad2, Rocket, Globe, Dumbbell, ShoppingCart];

const ExamplePrompts = () => {
  const navigate = useNavigate();
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".prompt-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const handleEnter = () => {
        gsap.to(card, { y: -4, scale: 1.02, duration: 0.3, ease: "power2.out" });
      };
      const handleLeave = () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
      };
      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);
      return () => {
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  return (
    <section ref={sectionRef} className="px-4 pb-24 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Try an example
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLE_PROMPTS.map((prompt, i) => {
            const Icon = PROMPT_ICONS[i] || Globe;
            return (
              <button
                key={prompt}
                ref={(el) => { cardsRef.current[i] = el; }}
                onClick={() => navigate(`/roadmap?goal=${encodeURIComponent(prompt)}`)}
                className="prompt-card group relative px-5 py-4 rounded-xl border border-border bg-card text-left cursor-pointer card-elevated overflow-hidden"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-border-hover pointer-events-none" />
                <div className="relative flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-200 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200 font-medium">
                    {prompt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExamplePrompts;
