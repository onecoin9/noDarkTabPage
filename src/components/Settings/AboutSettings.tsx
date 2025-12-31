import { Github, Heart, ExternalLink, Globe } from 'lucide-react';

export function AboutSettings() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <div className="mb-4 flex justify-center">
          <img 
            src="/magic-book.svg" 
            alt="Constantine's Tab" 
            className="w-20 h-20"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Constantine's Tab</h2>
        <p className="text-slate-400">魔法新标签页 - 功能丰富、高度可定制</p>
        <p className="text-slate-500 text-sm mt-2">版本 2.0.0</p>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">功能特性</h3>
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard emoji="⏰" title="智能时钟" />
          <FeatureCard emoji="🔍" title="多引擎搜索" />
          <FeatureCard emoji="📚" title="书签同步" />
          <FeatureCard emoji="🖼️" title="多源壁纸" />
          <FeatureCard emoji="🍅" title="番茄钟" />
          <FeatureCard emoji="✅" title="待办事项" />
          <FeatureCard emoji="🌤️" title="实时天气" />
          <FeatureCard emoji="📜" title="每日一言" />
          <FeatureCard emoji="📅" title="日历" />
          <FeatureCard emoji="⏱️" title="倒计时" />
          <FeatureCard emoji="📝" title="便签" />
          <FeatureCard emoji="☁️" title="云端同步" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">技术栈</h3>
        <div className="flex flex-wrap gap-2">
          <TechBadge>React 19</TechBadge>
          <TechBadge>TypeScript</TechBadge>
          <TechBadge>Vite</TechBadge>
          <TechBadge>Tailwind CSS</TechBadge>
          <TechBadge>Zustand</TechBadge>
          <TechBadge>Framer Motion</TechBadge>
          <TechBadge>Supabase</TechBadge>
          <TechBadge>@dnd-kit</TechBadge>
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
          <a
            href="https://constantine9.ggff.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Globe size={20} />
            <span>在线访问</span>
            <ExternalLink size={16} className="ml-auto text-slate-500" />
          </a>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">特色功能</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-white mb-1">🎨 完全自定义</div>
            <div className="text-slate-400">时钟字体、颜色、大小、位置全部可调，支持自定义 CSS</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-white mb-1">🧩 拖拽布局</div>
            <div className="text-slate-400">所有小组件支持拖拽定位和调整大小，打造专属布局</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-white mb-1">📚 书签同步</div>
            <div className="text-slate-400">支持浏览器原生书签、WebDAV 同步、XBEL 文件上传</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="font-medium text-white mb-1">☁️ 云端同步</div>
            <div className="text-slate-400">基于 Supabase，支持 GitHub/Google OAuth 登录</div>
          </div>
        </div>
      </section>

      <section className="text-center py-4 border-t border-slate-700/50">
        <p className="text-slate-400 flex items-center justify-center gap-1">
          Made with <Heart size={16} className="text-red-500 fill-red-500" /> by Constantine
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
