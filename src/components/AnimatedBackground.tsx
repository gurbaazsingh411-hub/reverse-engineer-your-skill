import { useEffect, useRef } from "react";
import gsap from "gsap";

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const shapes: HTMLDivElement[] = [];

    // Create floating shapes
    const shapeConfigs = [
      { size: 300, x: "15%", y: "20%", color: "hsl(250, 75%, 55%)", opacity: 0.04 },
      { size: 200, x: "75%", y: "15%", color: "hsl(280, 80%, 60%)", opacity: 0.05 },
      { size: 250, x: "60%", y: "65%", color: "hsl(250, 75%, 55%)", opacity: 0.03 },
      { size: 180, x: "25%", y: "75%", color: "hsl(210, 80%, 55%)", opacity: 0.04 },
      { size: 150, x: "85%", y: "50%", color: "hsl(280, 80%, 60%)", opacity: 0.05 },
    ];

    shapeConfigs.forEach((config) => {
      const shape = document.createElement("div");
      shape.style.cssText = `
        position: absolute;
        width: ${config.size}px;
        height: ${config.size}px;
        left: ${config.x};
        top: ${config.y};
        border-radius: 50%;
        background: radial-gradient(circle, ${config.color}, transparent 70%);
        opacity: ${config.opacity};
        pointer-events: none;
        will-change: transform;
      `;
      container.appendChild(shape);
      shapes.push(shape);
    });

    // GSAP floating animations
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: gsap.utils.random(-30, 30),
        x: gsap.utils.random(-20, 20),
        duration: gsap.utils.random(4, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });

      gsap.to(shape, {
        scale: gsap.utils.random(0.9, 1.1),
        duration: gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });

    // Create small floating dots
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement("div");
      const size = gsap.utils.random(3, 6);
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${gsap.utils.random(5, 95)}%;
        top: ${gsap.utils.random(5, 95)}%;
        border-radius: 50%;
        background: hsl(250, 75%, 55%);
        opacity: ${gsap.utils.random(0.06, 0.15)};
        pointer-events: none;
        will-change: transform;
      `;
      container.appendChild(dot);
      dots.push(dot);

      gsap.to(dot, {
        y: gsap.utils.random(-40, 40),
        x: gsap.utils.random(-30, 30),
        duration: gsap.utils.random(5, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 3),
      });

      gsap.to(dot, {
        opacity: gsap.utils.random(0.03, 0.12),
        duration: gsap.utils.random(2, 5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      shapes.forEach((s) => s.remove());
      dots.forEach((d) => d.remove());
      gsap.killTweensOf([...shapes, ...dots]);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-grid-pattern"
    />
  );
};

export default AnimatedBackground;
