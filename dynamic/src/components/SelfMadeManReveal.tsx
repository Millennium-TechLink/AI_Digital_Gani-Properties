import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Hammer, HardHat, Ruler } from 'lucide-react';

interface SelfMadeManRevealProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function SelfMadeManReveal({ isOpen, onClose, title }: SelfMadeManRevealProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gp-ink/95 backdrop-blur-xl"
          />

          {/* Construction Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
          </div>

          {/* Content Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl aspect-[16/10] bg-gp-ink rounded-none overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
          >
            {/* Image Section - The "Constructed" Man */}
            <div className="relative flex-1 h-full overflow-hidden">
              <motion.img
                initial={{ scale: 1.2, filter: 'blur(20px)', opacity: 0 }}
                animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                src="/images/self-made-man.png"
                alt="Self Made Man"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Animation Layers: Blueprint Lines */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-1/4 left-0 right-0 h-px bg-gp-accent/30 origin-left"
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute top-0 bottom-0 left-1/3 w-px bg-gp-accent/30 origin-top"
              />

              {/* Floating Architectural Labels */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-12 left-12 flex items-center gap-3 bg-gp-accent px-4 py-2 text-white"
              >
                <Ruler className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Precision Engineering</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-12 right-12 flex items-center gap-3 bg-white px-4 py-2 text-gp-ink"
              >
                <HardHat className="w-4 h-4 text-gp-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Constructing Excellence</span>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-r from-gp-ink via-transparent to-transparent hidden md:block" />
            </div>

            {/* Info Section */}
            <div className="relative w-full md:w-[400px] p-8 md:p-12 flex flex-col justify-center bg-gp-ink/50 backdrop-blur-md border-l border-white/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gp-accent/10 border-l-2 border-gp-accent mb-6">
                  <Sparkles className="w-4 h-4 text-gp-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gp-accent">The Visionary Choice</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                  {title} <br />
                  <span className="text-gp-accent">Partner</span>
                </h2>

                <p className="text-white/60 text-lg leading-relaxed mb-8">
                  "At Gani Properties, we don't just sell land. We construct the future for the self-made leaders of tomorrow."
                </p>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10">
                      <Hammer className="w-5 h-5 text-gp-accent" />
                    </div>
                    <span className="text-sm font-medium">Proven Success Framework</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10">
                      <Zap className="w-5 h-5 text-gp-accent" />
                    </div>
                    <span className="text-sm font-medium">Accelerated Market Capture</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-white text-gp-ink py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-gp-accent hover:text-white transition-all duration-500 rounded-none shadow-xl"
                >
                  Close Exploration
                </button>
              </motion.div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
