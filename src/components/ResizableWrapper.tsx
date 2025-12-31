import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useEditMode } from '../stores/useEditMode';

interface ResizableWrapperProps {
  children: ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  sensitivity?: number; // 拖拽灵敏度
  label?: string;
  className?: string;
}

export function ResizableWrapper({
  children,
  value,
  min,
  max,
  onChange,
  sensitivity = 0.5,
  label = 'px',
  className = '',
}: ResizableWrapperProps) {
  const { isEditMode } = useEditMode();
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartY(e.clientY);
    setStartValue(value);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newValue = Math.max(min, Math.min(max, startValue + deltaY * sensitivity));
      onChange(Math.round(newValue));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startY, startValue, min, max, sensitivity, onChange]);

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {/* 编辑模式虚线边框 */}
      <div className="absolute -inset-3 border-2 border-dashed border-indigo-500/40 rounded-xl pointer-events-none group-hover:border-indigo-500/70 transition-colors" />
      
      {/* 四个角的装饰 */}
      <div className="absolute -top-3 -left-3 w-2 h-2 border-t-2 border-l-2 border-indigo-500 rounded-tl" />
      <div className="absolute -top-3 -right-3 w-2 h-2 border-t-2 border-r-2 border-indigo-500 rounded-tr" />
      <div className="absolute -bottom-3 -left-3 w-2 h-2 border-b-2 border-l-2 border-indigo-500 rounded-bl" />
      <div className="absolute -bottom-3 -right-3 w-2 h-2 border-b-2 border-r-2 border-indigo-500 rounded-br" />
      
      {children}
      
      {/* 右下角调整大小手柄 */}
      <motion.div
        onMouseDown={handleResizeStart}
        whileHover={{ scale: 1.2 }}
        className="absolute -bottom-3 -right-3 w-5 h-5 cursor-se-resize flex items-center justify-center z-10"
      >
        <svg 
          viewBox="0 0 10 10" 
          className={`w-3 h-3 transition-colors ${isResizing ? 'text-indigo-300' : 'text-indigo-500 hover:text-indigo-400'}`}
          fill="currentColor"
        >
          <path d="M9 9H7V7H9V9ZM9 5H7V3H9V5ZM5 9H3V7H5V9ZM9 1H7V0H9V1ZM5 5H3V3H5V5ZM1 9H0V7H1V9Z" />
        </svg>
      </motion.div>
      
      {/* 底部中间调整手柄 */}
      <motion.div
        onMouseDown={handleResizeStart}
        whileHover={{ scale: 1.1 }}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-3 cursor-s-resize flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className={`w-6 h-1 rounded-full transition-colors ${isResizing ? 'bg-indigo-300' : 'bg-indigo-500/50 hover:bg-indigo-400'}`} />
      </motion.div>
      
      {/* 大小提示气泡 */}
      {isResizing && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs rounded-lg shadow-lg whitespace-nowrap"
        >
          {value}{label}
        </motion.div>
      )}
    </div>
  );
}
