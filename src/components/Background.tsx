import { useAppStore } from '../stores/useAppStore';
import { useEffect, useState } from 'react';

export function Background() {
  const background = useAppStore((s) => s.settings.background);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 检测是否为移动端
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 移动端强制使用 Bing 每日壁纸
  const effectiveBackground = isMobile 
    ? { type: 'bing' as const, value: '', blur: 0, brightness: 100 }
    : background;

  // 调试：输出当前壁纸配置
  console.log('当前壁纸配置:', background);
  console.log('是否移动端:', isMobile);
  console.log('实际使用的壁纸:', effectiveBackground);

  // 预加载图片
  useEffect(() => {
    if (effectiveBackground.type === 'custom' || effectiveBackground.type === 'unsplash' || effectiveBackground.type === 'wallhaven') {
      setImageLoaded(false);
      setImageError(false);
      
      const img = new Image();
      img.onload = () => {
        console.log('图片加载成功:', effectiveBackground.value);
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error('图片加载失败:', effectiveBackground.value);
        setImageError(true);
      };
      img.src = effectiveBackground.value;
    } else if (effectiveBackground.type === 'bing') {
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
  }, [effectiveBackground.type, effectiveBackground.value]);

  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      filter: `blur(${effectiveBackground.blur || 0}px) brightness(${(effectiveBackground.brightness || 100) / 100})`,
    };

    switch (effectiveBackground.type) {
      case 'gradient':
        console.log('使用渐变背景:', effectiveBackground.value);
        return { ...baseStyle, background: effectiveBackground.value };
      case 'custom':
      case 'unsplash':
      case 'wallhaven':
        console.log('使用图片背景:', effectiveBackground.value, '加载状态:', imageLoaded, '错误:', imageError);
        if (imageError) {
          console.warn('图片加载失败，使用默认渐变');
          return { ...baseStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
        }
        return {
          ...baseStyle,
          backgroundImage: `url(${effectiveBackground.value})`,
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
        console.log('使用纯色背景:', effectiveBackground.value);
        return { ...baseStyle, backgroundColor: effectiveBackground.value };
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
        className="fixed inset-0 transition-all duration-500"
        style={{
          ...style,
          zIndex: -20,
        }}
      />
      <div 
        className="fixed inset-0 bg-black/20" 
        style={{ zIndex: -10 }}
      />
    </>
  );
}
