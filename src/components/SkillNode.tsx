import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import gsap from "gsap";
import type { Skill } from "@/lib/roadmap-data";

interface SkillNodeProps {
  skill: Skill;
  index: number;
  isLast: boolean;
  onClick: () => void;
  skillNumber: number;
}

const statusIcons: Record<Skill["status"], React.ReactNode> = {
  "not-started": <Circle className="w-4 h-4 text-muted-foreground" />,
  learning: <BookOpen className="w-4 h-4 text-status-learning" />,
  completed: <CheckCircle2 className="w-4 h-4 text-status-completed" />,
};

const difficultyDots: Record<Skill["difficulty"], number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const SkillNode = ({ skill, index, isLast, onClick, skillNumber }: SkillNodeProps) => {
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleEnter = () => {
      gsap.to(card, { y: -3, scale: 1.02, duration: 0.25, ease: "power2.out" });
    };
    const handleLeave = () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <button
        ref={cardRef}
        onClick={onClick}
        className={`group relative w-full max-w-sm px-5 py-4 rounded-xl border transition-all cursor-pointer ${
          skill.status === "completed"
            ? "border-status-completed/30 bg-status-completed/5"
            : skill.status === "learning"
            ? "border-status-learning/30 bg-status-learning/5"
            : "border-border bg-card card-elevated hover:border-primary/30"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {statusIcons[skill.status]}
              <span className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {skillNumber}
              </span>
            </div>
            <div className="text-left">
              <span className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                {skill.title}
              </span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground">{skill.estimatedTime}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < difficultyDots[skill.difficulty] ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                {skill.tools.slice(0, 3).map((tool) => (
                  <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            Details →
          </span>
        </div>
      </button>

      {!isLast && (
        <div className="w-px h-6 connector-line relative overflow-hidden">
          <div className="connector-dot" />
        </div>
      )}
    </motion.div>
  );
};

export default SkillNode;
