import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';

interface Quote {
  content: string;
  author: string;
  source?: string;
}

const quotes: Quote[] = [
  { content: '路漫漫其修远兮，吾将上下而求索。', author: '屈原', source: '离骚' },
  { content: '不积跬步，无以至千里；不积小流，无以成江海。', author: '荀子', source: '劝学' },
  { content: '天行健，君子以自强不息。', author: '周易' },
  { content: '知之者不如好之者，好之者不如乐之者。', author: '孔子', source: '论语' },
  { content: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈', source: '进学解' },
  { content: '千里之行，始于足下。', author: '老子', source: '道德经' },
  { content: '学而不思则罔，思而不学则殆。', author: '孔子', source: '论语' },
  { content: '三人行，必有我师焉。', author: '孔子', source: '论语' },
  { content: '读书破万卷，下笔如有神。', author: '杜甫' },
  { content: '宝剑锋从磨砺出，梅花香自苦寒来。', author: '佚名' },
  { content: '生活不止眼前的苟且，还有诗和远方。', author: '高晓松' },
  { content: '世上无难事，只怕有心人。', author: '谚语' },
];

export function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const position = settings.quotePosition || { preset: 'center', offsetX: 0, offsetY: 60 };
  const scale = settings.quoteScale || 100;

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % quotes.length;
    setQuote(quotes[index]);
  }, []);

  if (!quote) return null;

  return (
    <EditableWidget
      name="每日一言"
      position={position}
      onPositionChange={(pos) => updateSettings({ quotePosition: pos })}
      size={scale}
      minSize={50}
      maxSize={150}
      onSizeChange={(size) => updateSettings({ quoteScale: size })}
      sizeUnit="%"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center max-w-xl"
        style={{ transform: `scale(${scale / 100})`, transformOrigin: 'center center' }}
      >
        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
          「{quote.content}」
        </p>
        <p className="text-white/50 text-sm mt-2">
          —— {quote.author}
          {quote.source && <span>《{quote.source}》</span>}
        </p>
      </motion.div>
    </EditableWidget>
  );
}
