import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2 } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';

export function TodoList() {
  const [input, setInput] = useState('');
  const todos = useAppStore((s) => s.todos);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const addTodo = useAppStore((s) => s.addTodo);
  const toggleTodo = useAppStore((s) => s.toggleTodo);
  const removeTodo = useAppStore((s) => s.removeTodo);
  const position = settings.todoPosition || { preset: 'center-right', offsetX: 0, offsetY: 0 };
  const width = settings.todoWidth || 280;
  const height = settings.todoHeight || 320;

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const fontSize = Math.max(12, Math.min(16, Math.round(width / 280 * 14)));
  const iconSize = Math.max(14, Math.min(20, Math.round(width / 280 * 18)));

  return (
    <EditableWidget
      name="待办"
      position={position}
      onPositionChange={(pos) => updateSettings({ todoPosition: pos })}
      width={width}
      height={height}
      minWidth={200}
      maxWidth={600}
      minHeight={200}
      maxHeight={800}
      onWidthChange={(w) => updateSettings({ todoWidth: w })}
      onHeightChange={(h) => updateSettings({ todoHeight: h })}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/80" style={{ fontSize: `${fontSize}px` }}>✅ 待办事项</span>
          <span className="text-white/60" style={{ fontSize: `${fontSize * 0.85}px` }}>{completedCount}/{todos.length}</span>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="添加待办..."
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            style={{ fontSize: `${fontSize}px` }}
          />
          <button onClick={handleAdd} className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors">
            <Plus size={iconSize} className="text-white" />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          <AnimatePresence>
            {todos.length === 0 ? (
              <p className="text-white/40 text-center py-4" style={{ fontSize: `${fontSize}px` }}>暂无待办事项</p>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
                      todo.completed ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {todo.completed && <Check size={12} className="text-white" />}
                  </button>
                  <span 
                    className={`flex-1 ${todo.completed ? 'text-white/40 line-through' : 'text-white/80'}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="p-1 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </EditableWidget>
  );
}
