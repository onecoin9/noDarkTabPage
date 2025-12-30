import { Github, Heart, ExternalLink } from 'lucide-react';

export function AboutSettings() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <div className="text-6xl mb-4">🍅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Constantine's Tab</h2>
        <p className="text-slate-400">一个现代化的浏览器新标签页</p>
        <p className="text-slate-500 text-sm mt-2">版本 2.0.0</p>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">功能特性</h3>
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard emoji="⏰" title="实时时钟" />
          <FeatureCard emoji="🔍" title="多引擎搜索" />
          <FeatureCard emoji="🔖" title="书签管理" />
          <FeatureCard emoji="🎨" title="自定义壁纸" />
          <FeatureCard emoji="🍅" title="番茄钟" />
          <FeatureCard emoji="✅" title="待办事项" />
          <FeatureCard emoji="🌤️" title="天气显示" />
          <FeatureCard emoji="📜" title="每日一言" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">技术栈</h3>
        <div className="flex flex-wrap gap-2">
          <TechBadge>React 19</TechBadge>
          <TechBadge>TypeScript</TechBadge>
          <TechBadge>Vite</TechBadge>
          <TechBadge>TailwindCSS</TechBadge>
          <TechBadge>Zustand</TechBadge>
          <TechBadge>Framer Motion</TechBadge>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">链接</h3>
        <div className="space-y-2">
          <a
            href="https://github.com/onecoin9/noDarkTabPage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Github size={20} />
            <span>GitHub 仓库</span>
            <ExternalLink size={16} className="ml-auto text-slate-500" />
          </a>
        </div>
      </section>

      <section className="text-center py-4 border-t border-slate-700/50">
        <p className="text-slate-400 flex items-center justify-center gap-1">
          Made with <Heart size={16} className="text-red-500" /> by Constantine
        </p>
        <p className="text-slate-500 text-sm mt-1">© 2025 All rights reserved</p>
      </section>
    </div>
  );
}

function FeatureCard({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
      <span className="text-2xl">{emoji}</span>
      <span className="text-slate-300">{title}</span>
    </div>
  );
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
      {children}
    </span>
  );
}
