import { useAppStore } from '../stores/useAppStore';

export function Background() {
  const background = useAppStore((s) => s.settings.background);

  // 调试：输出当前壁纸配置
  console.log('当前壁纸配置:', background);

  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      filter: `blur(${background.blur || 0}px) brightness(${(background.brightness || 100) / 100})`,
    };

    switch (background.type) {
      case 'gradient':
        console.log('使用渐变背景:', background.value);
        return { ...baseStyle, background: background.value };
      case 'custom':
      case 'unsplash':
      case 'wallhaven':
        console.log('使用图片背景:', background.value);
        return {
          ...baseStyle,
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'bing':
        console.log('使用 Bing 每日壁纸');
        // Bing 每日壁纸 API
        return {
          ...baseStyle,
          backgroundImage: `url(https://bing.biturl.top/?resolution=1920&format=image)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'solid':
        console.log('使用纯色背景:', background.value);
        return { ...baseStyle, backgroundColor: background.value };
      default:
        console.log('使用默认渐变背景');
        return { ...baseStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }
  };

  const style = getBackgroundStyle();
  console.log('最终背景样式:', style);

  return (
    <>
      <div
        className="fixed inset-0 -z-20 transition-all duration-500"
        style={style}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />
    </>
  );
}
