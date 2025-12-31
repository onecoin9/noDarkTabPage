import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

export function SettingsButton() {
  const toggleSettings = useAppStore((s) => s.toggleSettings);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      whileHover={{ rotate: 90 }}
      onClick={toggleSettings}
      className="fixed top-3 right-3 md:top-5 md:right-5 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors z-30"
    >
      <Settings size={18} className="md:w-[22px] md:h-[22px]" />
    </motion.button>
  );
}
