import { useAppStore } from '../stores/useAppStore';

export function Background() {
  const background = useAppStore((s) => s.settings.background);

  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      filter: `blur(${background.blur || 0}px) brightness(${(background.brightness || 100) / 100})`,
    };

    switch (background.type) {
      case 'gradient':
        return { ...baseStyle, background: background.value };
      case 'custom':
      case 'unsplash':
      case 'wallhaven':
        return {
          ...baseStyle,
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'bing':
        // Bing 每日壁纸 API
        return {
          ...baseStyle,
          backgroundImage: `url(https://bing.biturl.top/?resolution=1920&format=image)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'solid':
        return { ...baseStyle, backgroundColor: background.value };
      default:
        return { ...baseStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
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
