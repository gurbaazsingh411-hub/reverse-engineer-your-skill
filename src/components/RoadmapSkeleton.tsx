import { motion } from "framer-motion";

const SkeletonCard = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex flex-col items-center"
  >
    <div className="w-full max-w-sm px-5 py-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
          <div className="flex gap-2">
            <div className="h-3 bg-muted rounded-md animate-pulse w-16" />
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-px h-6 bg-border/50" />
  </motion.div>
);

const RoadmapSkeleton = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((level) => (
        <div key={level}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-3 w-28 bg-muted/60 rounded animate-pulse" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex flex-col items-center">
            {Array.from({ length: level === 1 ? 2 : level === 2 ? 3 : 2 }).map((_, i) => (
              <SkeletonCard key={`${level}-${i}`} delay={0.1 * (level + i)} />
            ))}
          </div>
          {level < 3 && <div className="w-px h-10 bg-border/30 mx-auto" />}
        </div>
      ))}
    </div>
  );
};

export default RoadmapSkeleton;
