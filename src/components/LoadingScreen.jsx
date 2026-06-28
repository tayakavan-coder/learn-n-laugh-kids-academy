import { motion, AnimatePresence } from 'framer-motion'

const LETTERS = ['L', 'e', 'a', 'r', 'n', "'", 'N', ' ', 'L', 'a', 'u', 'g', 'h']

export default function LoadingScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FF4FA3, #3B82F6, #22C55E)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-1 mb-8">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className="text-5xl md:text-7xl font-display font-black text-white"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -20, 0], opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                {l}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="text-white/80 text-lg font-body font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Kids Academy
          </motion.div>
          <motion.div
            className="mt-8 h-1.5 w-48 rounded-full bg-white/20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
