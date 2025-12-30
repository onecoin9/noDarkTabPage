import { useAppStore } from '../stores/useAppStore';

export function Background() {
  const background = useAppStore((s) => s.settings.background);

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case 'gradient':
        return { background: background.value };
      case 'custom':
        return {
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'solid':
        return { backgroundColor: background.value };
      case 'unsplash':
        const category = background.unsplashCategory || '';
        const url = `https://source.unsplash.com/random/1920x1080${category ? `?${category}` : ''}`;
        return {
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      default:
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-20 transition-all duration-500"
        style={getBackgroundStyle()}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />
    </>
  );
}
