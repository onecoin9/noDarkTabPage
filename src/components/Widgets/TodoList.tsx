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

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <EditableWidget
      name="待办"
      position={position}
      onPositionChange={(pos) => updateSettings({ todoPosition: pos })}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 w-72"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/80 text-sm">✅ 待办事项</span>
          <span className="text-white/60 text-xs">{completedCount}/{todos.length}</span>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="添加待办..."
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40"
          />
          <button onClick={handleAdd} className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors">
            <Plus size={18} className="text-white" />
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {todos.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">暂无待办事项</p>
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
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      todo.completed ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {todo.completed && <Check size={12} className="text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${todo.completed ? 'text-white/40 line-through' : 'text-white/80'}`}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
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
