import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BarChart3, Wrench, Share2, ExternalLink, BookOpen, Youtube, FileText, RefreshCw, Pencil, Check, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { Skill } from "@/lib/roadmap-data";
import { useIsMobile } from "@/hooks/use-mobile";

const getResources = (skill: Skill) => [
  { label: `Search "${skill.title}" on MDN`, url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(skill.title)}`, icon: FileText },
  { label: `Watch "${skill.title}" tutorials`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill.title + " tutorial")}`, icon: Youtube },
  { label: `Read "${skill.title}" guides`, url: `https://www.google.com/search?q=${encodeURIComponent(skill.title + " beginner guide")}`, icon: BookOpen },
];

interface SkillDetailPanelProps {
  skill: Skill | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Skill["status"]) => void;
  onSkillUpdate: (updatedSkill: Skill) => void;
  onRegenerate: (skill: Skill) => Promise<void>;
  isRegenerating?: boolean;
}

const difficultyColors: Record<Skill["difficulty"], string> = {
  beginner: "text-status-completed bg-status-completed/10 border-status-completed/20",
  intermediate: "text-status-learning bg-status-learning/10 border-status-learning/20",
  advanced: "text-destructive bg-destructive/10 border-destructive/20",
};

const statusOptions: { value: Skill["status"]; label: string }[] = [
  { value: "not-started", label: "Not Started" },
  { value: "learning", label: "Learning" },
  { value: "completed", label: "Completed" },
];

const SkillDetailPanel = ({ skill, onClose, onStatusChange, onSkillUpdate, onRegenerate, isRegenerating }: SkillDetailPanelProps) => {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", estimatedTime: "", tools: "" });

  const startEditing = () => {
    if (!skill) return;
    setEditForm({
      title: skill.title,
      description: skill.description,
      estimatedTime: skill.estimatedTime,
      tools: skill.tools.join(", "),
    });
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveEditing = () => {
    if (!skill) return;
    const updated: Skill = {
      ...skill,
      title: editForm.title.trim() || skill.title,
      description: editForm.description.trim() || skill.description,
      estimatedTime: editForm.estimatedTime.trim() || skill.estimatedTime,
      tools: editForm.tools.split(",").map((t) => t.trim()).filter(Boolean),
    };
    onSkillUpdate(updated);
    setIsEditing(false);
    toast.success("Skill updated!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const panelVariants = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  return (
    <AnimatePresence>
      {skill && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            {...panelVariants}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed z-50 overflow-y-auto shadow-2xl bg-card border-border ${
              isMobile
                ? "left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t"
                : "right-0 top-0 bottom-0 w-full max-w-md border-l"
            }`}
          >
            {isMobile && (
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-md border ${difficultyColors[skill.difficulty]} capitalize mb-3`}>
                    {skill.difficulty}
                  </span>
                  {isEditing ? (
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full text-2xl font-display font-bold text-foreground bg-muted/50 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      {skill.title}
                    </h2>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => onRegenerate(skill)}
                        disabled={isRegenerating}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
                        title="Regenerate with AI"
                      >
                        <RefreshCw className={`w-5 h-5 ${isRegenerating ? "animate-spin" : ""}`} />
                      </button>
                      <button onClick={startEditing} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Edit skill">
                        <Pencil className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <button onClick={saveEditing} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-primary" title="Save">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={cancelEditing} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Cancel">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button onClick={handleShare} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full text-muted-foreground leading-relaxed mb-6 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {skill.description}
                </p>
              )}

              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Why this matters</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{skill.why}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    {isEditing ? (
                      <input
                        value={editForm.estimatedTime}
                        onChange={(e) => setEditForm((f) => ({ ...f, estimatedTime: e.target.value }))}
                        className="w-24 bg-muted/50 border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (
                      skill.estimatedTime
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Level {skill.level}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Tools & Technologies</h3>
                  </div>
                  {isEditing ? (
                    <input
                      value={editForm.tools}
                      onChange={(e) => setEditForm((f) => ({ ...f, tools: e.target.value }))}
                      placeholder="Comma-separated tools"
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skill.tools.map((tool) => (
                        <span key={tool} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted border border-border text-secondary-foreground">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ExternalLink className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Learning Resources</h3>
                    </div>
                    <div className="space-y-2">
                      {getResources(skill).map((res) => (
                        <a
                          key={res.url}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-muted/50 transition-all group"
                        >
                          <res.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{res.label}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/50 ml-auto shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Progress</h3>
                  <div className="flex gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => onStatusChange(skill.id, opt.value)}
                        className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all duration-200 ${
                          skill.status === opt.value
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/20"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SkillDetailPanel;
