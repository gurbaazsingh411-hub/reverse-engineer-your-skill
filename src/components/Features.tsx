import { useRef, useEffect } from "react";
import { Brain, Zap, BarChart3, Users } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Our AI breaks down any goal into a structured learning path with the exact skills you need.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Get your personalized roadmap in seconds. No templates — every path is unique to your goal.",
    gradient: "from-status-learning to-status-learning/60",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Mark skills as learning or completed. Your progress is saved automatically and persists across sessions.",
    gradient: "from-status-completed to-status-completed/60",
  },
  {
    icon: Users,
    title: "Difficulty Levels",
    description: "Skills are organized from beginner to advanced across 4 levels, so you always know where to start.",
    gradient: "from-primary to-primary/60",
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
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
    <section ref={sectionRef} className="px-4 py-24 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
            DevX Features
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything you need to learn smarter
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We handle the planning so you can focus on what matters — actually learning and building.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-card group relative p-6 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Subtle gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
