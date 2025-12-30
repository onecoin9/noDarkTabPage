import { motion } from 'framer-motion';
import { useTime } from '../hooks/useTime';
import { useAppStore } from '../stores/useAppStore';

export function Clock() {
  const showSeconds = useAppStore((s) => s.settings.showSeconds);
  const { time, date } = useTime(showSeconds);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="text-7xl md:text-8xl font-extralight tracking-tight text-white drop-shadow-lg">
        {time}
      </div>
      <div className="text-lg md:text-xl text-white/90 mt-3 font-light">
        {date}
      </div>
    </motion.div>
  );
}
