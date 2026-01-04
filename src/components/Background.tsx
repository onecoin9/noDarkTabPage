import { useAppStore } from '../stores/useAppStore';
import { useEffect, useState } from 'react';

export function Background() {
  const background = useAppStore((s) => s.settings.background);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 调试：输出当前壁纸配置
  console.log('当前壁纸配置:', background);

  // 预加载图片
  useEffect(() => {
    if (background.type === 'custom' || background.type === 'unsplash' || background.type === 'wallhaven') {
      setImageLoaded(false);
      setImageError(false);
      
      const img = new Image();
      img.onload = () => {
        console.log('图片加载成功:', background.value);
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error('图片加载失败:', background.value);
        setImageError(true);
      };
      img.src = background.value;
    } else if (background.type === 'bing') {
      setImageLoaded(false);
      setImageError(false);
      
      const img = new Image();
      const bingUrl = 'https://bing.biturl.top/?resolution=1920&format=image';
      img.onload = () => {
        console.log('Bing 图片加载成功');
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error('Bing 图片加载失败');
        setImageError(true);
      };
      img.src = bingUrl;
    }
  }, [background.type, background.value]);

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
        console.log('使用图片背景:', background.value, '加载状态:', imageLoaded, '错误:', imageError);
        if (imageError) {
          console.warn('图片加载失败，使用默认渐变');
          return { ...baseStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
        }
        return {
          ...baseStyle,
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'bing':
        console.log('使用 Bing 每日壁纸', '加载状态:', imageLoaded, '错误:', imageError);
        if (imageError) {
          console.warn('Bing 图片加载失败，使用默认渐变');
          return { ...baseStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
        }
        return {
          ...baseStyle,
          backgroundImage: `url(https://bing.biturl.top/?resolution=1920&format=image)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
