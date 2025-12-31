import { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';

export function NoteWidget() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const position = settings.notePosition || { preset: 'bottom-right', offsetX: 0, offsetY: 0 };
  const width = settings.noteWidth || 280;
  const height = settings.noteHeight || 200;
  
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('widget-note');
    if (saved) setNote(saved);
  }, []);

  const handleChange = (value: string) => {
    setNote(value);
    localStorage.setItem('widget-note', value);
  };

  const content = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20" style={{ width: `${width}px`, height: `${height}px` }}>
      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="在这里写点什么..."
        className="w-full h-full bg-transparent text-white text-sm placeholder-white/30 resize-none focus:outline-none"
      />
      <div className="text-right text-xs text-white/30 mt-1">
        {note.length} 字
      </div>
    </div>
  );

  return (
    <EditableWidget
      name="便签"
      position={position}
      onPositionChange={(pos) => updateSettings({ notePosition: pos })}
      width={width}
      height={height}
      minWidth={200}
      maxWidth={600}
      minHeight={150}
      maxHeight={600}
      onWidthChange={(w) => updateSettings({ noteWidth: w })}
      onHeightChange={(h) => updateSettings({ noteHeight: h })}
    >
      {content}
    </EditableWidget>
  );
}
