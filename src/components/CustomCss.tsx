import { useAppStore } from '../stores/useAppStore';

export function CustomCss() {
  const customCss = useAppStore((s) => s.settings.customCss);

  if (!customCss) return null;

  return <style>{customCss}</style>;
}
