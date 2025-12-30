import { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';

interface WidgetContainerProps {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
  onClose?: () => void;
  defaultSize?: 'small' | 'medium' | 'large';
}

export function WidgetContainer({ 
  title, 
  icon, 
  children, 
  onClose,
  defaultSize = 'medium' 
}: WidgetContainerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState(defaultSize);

  const sizeClasses = {
    small: 'w-48',
    medium: 'w-72',
    large: 'w-96',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden ${sizeClasses[size]}`}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-white/40" />
          <span className="text-sm">{icon}</span>
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSize(size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'small')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {size === 'large' ? (
              <Minimize2 size={12} className="text-white/60" />
            ) : (
              <Maximize2 size={12} className="text-white/60" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 text-xs"
          >
            {isMinimized ? '▼' : '▲'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X size={12} className="text-white/60" />
            </button>
          )}
        </div>
      </div>

      {/* 内容 */}
      <motion.div
        initial={false}
        animate={{ height: isMinimized ? 0 : 'auto' }}
        className="overflow-hidden"
      >
        <div className="p-3">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
