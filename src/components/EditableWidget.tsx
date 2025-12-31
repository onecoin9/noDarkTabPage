import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Move } from 'lucide-react';
import { useEditMode } from '../stores/useEditMode';
import type { ComponentPosition, PositionPreset } from '../types';

interface EditableWidgetProps {
  children: ReactNode;
  name: string;
  position: ComponentPosition;
  onPositionChange: (position: ComponentPosition) => void;
  size?: number;
  minSize?: number;
  maxSize?: number;
  onSizeChange?: (size: number) => void;
  className?: string;
  sizeUnit?: 'px' | '%'; // 新增：大小单位
}

// 位置预设到CSS的映射
// 关键：右侧定位时，offsetX 为负值表示向右移动；底部定位时，offsetY 为负值表示向下移动
function getPositionStyle(position: ComponentPosition): React.CSSProperties {
  const { preset, offsetX, offsetY } = position;
  
  // 右侧定位时，translate 需要取反（正的 offsetX 应该向右移动，但 right 定位下 translate 正值是向右）
  // 所以右侧定位时，我们直接使用 offsetX，但在拖拽时不取反
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
  sizeUnit = 'px',
}: EditableWidgetProps) {
  const { isEditMode } = useEditMode();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(size || 80);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartOffset({ x: position.offsetX, y: position.offsetY });
  };

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
        // 直接使用鼠标移动的差值，CSS 层面已经处理了方向
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
        // 根据单位调整灵敏度
        const sensitivity = sizeUnit === '%' ? 0.2 : 0.5;
        const newSize = Math.max(minSize, Math.min(maxSize, startSize + deltaY * sensitivity));
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
        onMouseDown={handleDragStart}
        className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-indigo-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white shadow-lg cursor-move select-none hover:bg-indigo-500 transition-colors"
      >
        <Move size={12} />
        <span className="font-medium">{name}</span>
        {onSizeChange && size && (
          <span className="text-indigo-200 ml-1">{size}{sizeUnit}</span>
        )}
      </motion.div>

      {/* 虚线边框 */}
      <div className={`absolute -inset-2 border-2 border-dashed rounded-xl pointer-events-none transition-colors ${
        isDragging || isResizing ? 'border-indigo-400' : 'border-indigo-500/40 group-hover:border-indigo-500/70'
      }`} />

      {children}

      {/* 调整大小手柄 */}
      {onSizeChange && (
        <motion.div
          onMouseDown={handleResizeStart}
          whileHover={{ scale: 1.3 }}
          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-500 rounded-full cursor-se-resize shadow-md hover:bg-indigo-400 transition-colors"
        />
      )}

      {/* 位置提示 */}
      {(isDragging || isResizing) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap"
        >
          {isResizing && size ? `${size}${sizeUnit}` : `${position.offsetX}, ${position.offsetY}`}
        </motion.div>
      )}
    </div>
  );
}
