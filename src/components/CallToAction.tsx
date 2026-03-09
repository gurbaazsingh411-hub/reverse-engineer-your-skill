import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        y: 30,
        opacity: 0,
        duration: 0.7,
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

  const scrollToInput = () => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder]');
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => input.focus(), 500);
    }
  };

  return (
    <section ref={sectionRef} className="px-4 py-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="cta-content relative rounded-3xl overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(280_80%_60%/0.3),transparent_60%)]" />
          
          {/* Noise texture */}
          <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to start learning?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-md mx-auto">
              Describe your dream project and get a personalized roadmap in seconds.
            </p>
            <button
              onClick={scrollToInput}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-foreground text-primary font-display font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
