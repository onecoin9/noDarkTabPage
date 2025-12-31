import { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import { BookmarkPanel } from './BookmarkPanel';

export function BookmarkPanelButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsPanelOpen(true)}
        className="fixed left-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors z-30 shadow-lg"
        title="书签文件夹"
      >
        <Folder size={22} />
      </motion.button>

      <BookmarkPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}
