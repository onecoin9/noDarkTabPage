import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useEditMode } from '../stores/useEditMode';

interface ResizableWrapperProps {
  children: ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  sensitivity?: number;
  label?: string;
  className?: string;
  horizontal?: boolean; // 是否是横向布局
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
  horizontal = true,
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
      {/* 编辑模式虚线边框 - 横向长条形 */}
      <div 
        className="absolute border-2 border-dashed border-indigo-500/40 rounded-xl pointer-events-none group-hover:border-indigo-500/70 transition-colors"
        style={{
          top: '-8px',
          bottom: '-8px',
          left: horizontal ? '-16px' : '-8px',
          right: horizontal ? '-16px' : '-8px',
        }}
      />
      
      {/* 左右两端的装饰线 */}
      {horizontal && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-2 h-8 border-l-2 border-t-2 border-b-2 border-indigo-500 rounded-l-lg" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-2 h-8 border-r-2 border-t-2 border-b-2 border-indigo-500 rounded-r-lg" />
        </>
      )}
      
      {children}
      
      {/* 底部中间调整手柄 - 主要的调整方式 */}
      <motion.div
        onMouseDown={handleResizeStart}
        whileHover={{ scale: 1.1 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 cursor-s-resize flex items-center justify-center z-10 group/handle"
      >
        <div className={`w-10 h-1.5 rounded-full transition-colors ${
          isResizing ? 'bg-indigo-400' : 'bg-indigo-500/60 group-hover/handle:bg-indigo-400'
        }`} />
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
