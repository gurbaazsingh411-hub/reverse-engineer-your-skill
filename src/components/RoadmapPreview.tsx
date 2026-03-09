import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MOCK_ROADMAP } from "@/lib/roadmap-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RoadmapPreview = () => {
  const previewSkills = MOCK_ROADMAP.skills.slice(0, 5);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".preview-node", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 pb-32 relative z-10">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Example Roadmap
        </h2>
        <div className="flex items-center justify-center gap-2 mb-10">
          <p className="text-2xl font-display font-bold text-foreground">
            "Build Instagram"
          </p>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-completed opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-completed" />
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-0 cursor-pointer group"
          onClick={() => navigate(`/roadmap?goal=${encodeURIComponent(MOCK_ROADMAP.goal)}`)}
        >
          {previewSkills.map((skill, i) => (
            <div key={skill.id} className="preview-node flex flex-col items-center">
              <div className="px-6 py-3 rounded-xl border border-border bg-card text-sm font-display font-medium text-foreground card-elevated group-hover:border-primary/20 transition-colors duration-300">
                <span className="text-xs text-primary font-bold mr-2">{i + 1}.</span>
                {skill.title}
              </div>
              {i < previewSkills.length - 1 && (
                <div className="w-px h-8 connector-line" />
              )}
            </div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-4 text-primary text-sm font-medium group-hover:underline"
          >
            View full roadmap →
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapPreview;
