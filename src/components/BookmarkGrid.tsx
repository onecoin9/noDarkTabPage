import { motion } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';
import type { Bookmark } from '../types';

interface BookmarkItemProps {
  bookmark: Bookmark;
  index: number;
  onDelete: (id: string) => void;
}

function BookmarkItem({ bookmark, index, onDelete }: BookmarkItemProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('确定删除这个书签吗？')) {
      onDelete(bookmark.id);
    }
  };

  return (
    <motion.a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onContextMenu={handleContextMenu}
      className="flex flex-col items-center gap-2 p-5 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 text-white cursor-pointer transition-all hover:bg-white/25 hover:shadow-lg"
    >
      <span className="text-4xl">{bookmark.icon}</span>
      <span className="text-sm font-medium text-center">{bookmark.title}</span>
    </motion.a>
  );
}

export function BookmarkGrid() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const removeBookmark = useAppStore((s) => s.removeBookmark);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 w-full max-w-4xl mx-auto"
    >
      {bookmarks.map((bookmark, index) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          index={index}
          onDelete={removeBookmark}
        />
      ))}
    </motion.div>
  );
}
