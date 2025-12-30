import { useState, useEffect } from 'react';

export function NoteWidget() {
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('widget-note');
    if (saved) setNote(saved);
  }, []);

  const handleChange = (value: string) => {
    setNote(value);
    localStorage.setItem('widget-note', value);
  };

  return (
    <div>
      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="在这里写点什么..."
        className="w-full h-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:border-white/30"
      />
      <div className="text-right text-xs text-white/30 mt-1">
        {note.length} 字
      </div>
    </div>
  );
}
