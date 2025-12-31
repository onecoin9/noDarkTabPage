import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GripHorizontal } from 'lucide-react';
import { useEditMode } from '../stores/useEditMode';
import type { ComponentPosition, PositionPreset } from '../types';

interface EditableWidgetProps {
  children: ReactNode;
  name: string;
  position: ComponentPosition;
  onPositionChange: (position: ComponentPosition) => void;
  // 可选的大小调整
  size?: number;
  minSize?: number;
  maxSize?: number;
  onSizeChange?: (size: number) => void;
  className?: string;
}

// 位置预设到CSS的映射
function getPositionStyle(position: ComponentPosition): React.CSSProperties {
  const { preset, offsetX, offsetY } = position;
  
  const presetStyles: Record<PositionPreset, { top?: string; bottom?: string; left?: string; right?: string; transform: string }> = {
    'top-left': { top: '10%', left: '10%', transform: `translate(${offsetX}px, ${offsetY}px)` },
    'top-center': { top: '10%', left: '50%', transform: `translate(calc(-50% + ${offsetX}px), ${offsetY}px)` },
    'top-right': { top: '10%', right: '10%', transform: `translate(${-offsetX}px, ${offsetY}px)` },
    'center-left': { top: '50%', left: '10%', transform: `translate(${offsetX}px, calc(-50% + ${offsetY}px))` },
    'center': { top: '50%', left: '50%', transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))` },
    'center-right': { top: '50%', right: '10%', transform: `translate(${-offsetX}px, calc(-50% + ${offsetY}px))` },
    'bottom-left': { bottom: '10%', left: '10%', transform: `translate(${offsetX}px, ${-offsetY}px)` },
    'bottom-center': { bottom: '10%', left: '50%', transform: `translate(calc(-50% + ${offsetX}px), ${-offsetY}px)` },
    'bottom-right': { bottom: '10%', right: '10%', transform: `translate(${-offsetX}px, ${-offsetY}px)` },
  };
  
  return {
    position: 'fixed',
    ...presetStyles[preset],
  };
}

export function EditableWidget({
  children,
  name,
  position,
  onPositionChange,
  size,
  minSize = 40,
  maxSize = 200,
  onSizeChange,
  className = '',
}: EditableWidgetProps) {
  const { isEditMode } = useEditMode();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(size || 80);
  const containerRef = useRef<HTMLDivElement>(null);

  // 拖拽移动
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartOffset({ x: position.offsetX, y: position.offsetY });
  };

  // 调整大小
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartSize(size || 80);
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        onPositionChange({
          ...position,
          offsetX: startOffset.x + deltaX,
          offsetY: startOffset.y + deltaY,
        });
      }
      if (isResizing && onSizeChange) {
        const deltaY = e.clientY - dragStart.y;
        const newSize = Math.max(minSize, Math.min(maxSize, startSize + deltaY * 0.5));
        onSizeChange(Math.round(newSize));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, startOffset, startSize, position, onPositionChange, onSizeChange, minSize, maxSize]);

  const positionStyle = getPositionStyle(position);

  if (!isEditMode) {
    return (
      <div ref={containerRef} style={positionStyle} className={`z-10 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={positionStyle}
      className={`z-10 group ${className}`}
    >
      {/* 编辑模式工具栏 */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-8 left-0 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white shadow-lg"
      >
        {/* 拖拽手柄 */}
        <button
          onMouseDown={handleDragStart}
          className="p-1 hover:bg-white/10 rounded cursor-move"
          title="拖拽移动"
        >
          <GripHorizontal size={14} />
        </button>
        <span className="text-slate-400 px-1">{name}</span>
      </motion.div>

      {/* 虚线边框 */}
      <div className="absolute -inset-3 border-2 border-dashed border-indigo-500/50 rounded-xl pointer-events-none group-hover:border-indigo-500/80 transition-colors" />

      {children}

      {/* 调整大小手柄 - 右下角 */}
      {onSizeChange && (
        <motion.div
          onMouseDown={handleResizeStart}
          whileHover={{ scale: 1.2 }}
          className="absolute -bottom-2 -right-2 w-4 h-4 cursor-se-resize flex items-center justify-center z-20"
        >
          <svg viewBox="0 0 10 10" className="w-3 h-3 text-indigo-500" fill="currentColor">
            <path d="M9 9H7V7H9V9ZM9 5H7V3H9V5ZM5 9H3V7H5V9Z" />
          </svg>
        </motion.div>
      )}

      {/* 底部调整手柄 */}
      {onSizeChange && (
        <motion.div
          onMouseDown={handleResizeStart}
          whileHover={{ scaleX: 1.1 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 cursor-s-resize flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className={`w-8 h-1 rounded-full ${isResizing ? 'bg-indigo-400' : 'bg-indigo-500/60'}`} />
        </motion.div>
      )}

      {/* 大小/位置提示 */}
      {(isDragging || isResizing) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-indigo-500 text-white text-xs rounded shadow-lg whitespace-nowrap"
        >
          {isResizing && size ? `${size}px` : `X: ${position.offsetX}, Y: ${position.offsetY}`}
        </motion.div>
      )}
    </div>
  );
}
