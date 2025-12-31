import { motion } from 'framer-motion';
import { Pencil, Check } from 'lucide-react';
import { useEditMode } from '../stores/useEditMode';

export function EditModeButton() {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleEditMode}
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
        isEditMode
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white'
      }`}
      title={isEditMode ? '完成编辑' : '编辑布局'}
    >
      {isEditMode ? <Check size={18} className="md:w-5 md:h-5" /> : <Pencil size={18} className="md:w-5 md:h-5" />}
    </motion.button>
  );
}
