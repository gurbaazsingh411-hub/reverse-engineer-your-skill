import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Target, Share2 } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { Skill } from "@/lib/roadmap-data";
import { generateRoadmap } from "@/lib/generate-roadmap";
import { regenerateSkill } from "@/lib/regenerate-skill";
import SkillNode from "@/components/SkillNode";
import SkillDetailPanel from "@/components/SkillDetailPanel";
import AnimatedBackground from "@/components/AnimatedBackground";
import RoadmapSkeleton from "@/components/RoadmapSkeleton";
import Navbar from "@/components/Navbar";

const STORAGE_PREFIX = "rl_progress_";

const getStoredProgress = (goal: string): Record<string, Skill["status"]> => {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + btoa(goal));
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
};

const storeProgress = (goal: string, skills: Skill[]) => {
  const progress: Record<string, Skill["status"]> = {};
  skills.forEach((s) => { if (s.status !== "not-started") progress[s.title] = s.status; });
  localStorage.setItem(STORAGE_PREFIX + btoa(goal), JSON.stringify(progress));
};

const Roadmap = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const goal = searchParams.get("goal") || "";
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (!goal) navigate("/", { replace: true });
  }, [goal, navigate]);

  useEffect(() => {
    if (!goal) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateRoadmap(goal);
        if (!cancelled) {
          const stored = getStoredProgress(goal);
          const withProgress = result.map((s) => ({
            ...s,
            status: stored[s.title] || s.status,
          }));
          setSkills(withProgress);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to generate roadmap";
        if (!cancelled) {
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [goal]);

  const handleStatusChange = useCallback((id: string, status: Skill["status"]) => {
    setSkills((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status } : s));
      storeProgress(goal, updated);
      return updated;
    });
    if (selectedSkill?.id === id) {
      setSelectedSkill((prev) => (prev ? { ...prev, status } : null));
    }
  }, [goal, selectedSkill?.id]);

  const handleSkillUpdate = useCallback((updatedSkill: Skill) => {
    setSkills((prev) => {
      const updated = prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s));
      storeProgress(goal, updated);
      return updated;
    });
    setSelectedSkill(updatedSkill);
  }, [goal]);

  const handleRegenerate = useCallback(async (skill: Skill) => {
    setIsRegenerating(true);
    try {
      const otherTitles = skills.filter((s) => s.id !== skill.id).map((s) => s.title);
      const newSkill = await regenerateSkill(goal, skill, otherTitles);
      setSkills((prev) => {
        const updated = prev.map((s) => (s.id === skill.id ? newSkill : s));
        storeProgress(goal, updated);
        return updated;
      });
      setSelectedSkill(newSkill);
      toast.success("Skill regenerated!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to regenerate skill");
    } finally {
      setIsRegenerating(false);
    }
  }, [goal, skills]);

  // Confetti celebration
  const completedCount = skills.filter((s) => s.status === "completed").length;
  useEffect(() => {
    if (skills.length > 0 && completedCount === skills.length && !celebrated) {
      setCelebrated(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      toast.success("🎉 Congratulations! You've completed all skills!");
    }
  }, [completedCount, skills.length, celebrated]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const levels = [1, 2, 3, 4];
  const levelLabels: Record<number, string> = {
    1: "Foundations",
    2: "Core Development",
    3: "Product Architecture",
    4: "Scaling & Deployment",
  };

  let globalSkillIndex = 0;

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-24 pt-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground leading-tight">{goal}</h1>
                {!isLoading && !error && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span>{skills.length} skills</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span>{completedCount}/{skills.length} completed</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleShare} className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground" title="Share roadmap">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          {!isLoading && skills.length > 0 && (
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / skills.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </motion.div>

        {isLoading && <RoadmapSkeleton />}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <p className="text-destructive font-medium">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {!isLoading && !error && levels.map((level) => {
          const levelSkills = skills.filter((s) => s.level === level);
          if (levelSkills.length === 0) return null;

          return (
            <div key={level} className="mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * level }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Level {level}
                </span>
                <span className="text-xs text-muted-foreground">
                  {levelLabels[level]}
                </span>
                <div className="flex-1 h-px bg-border" />
              </motion.div>

              <div className="flex flex-col items-center">
                {levelSkills.map((skill, i) => {
                  globalSkillIndex++;
                  return (
                    <SkillNode
                      key={skill.id}
                      skill={skill}
                      index={skills.indexOf(skill)}
                      isLast={i === levelSkills.length - 1 && level === 4}
                      onClick={() => setSelectedSkill(skill)}
                      skillNumber={globalSkillIndex}
                    />
                  );
                })}
                {level < 4 && (
                  <div className="w-px h-10 connector-line" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SkillDetailPanel
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onStatusChange={handleStatusChange}
        onSkillUpdate={handleSkillUpdate}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
      />
    </div>
  );
};

export default Roadmap;
