import { createClient } from '@supabase/supabase-js';
import type { Bookmark, AppSettings, Todo } from '../types';

export const supabaseUrl = 'https://gbfdfpxlltnvnrsayrou.supabase.co';
const supabaseAnonKey = 'sb_publishable_7Bxn8fxjWr9AOCUVfflw0w_J9F2m-Zx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CloudDiagnostic = {
  ok: boolean;
  status?: number;
  message: string;
};

const PAUSED_HINT =
  '若为 Supabase 免费项目，7 天无数据库活动会被自动暂停，暂停后域名停止解析，需在 Dashboard 点击 Resume project';

/**
 * 探测云端是否可达。
 * 暂停的 Supabase 项目会移除主机名 DNS 记录，此时 fetch 抛错或一直挂起，
 * 与「密钥/RLS 配置错误」表现不同，需要单独提示。
 */
export async function checkCloudConnectivity(timeoutMs = 8000): Promise<CloudDiagnostic> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabaseAnonKey },
      signal: controller.signal,
    });

    if (res.ok) {
      return { ok: true, status: res.status, message: `连接正常（HTTP ${res.status}）` };
    }
    if (res.status === 540) {
      return {
        ok: false,
        status: res.status,
        message: '云端项目已暂停（HTTP 540），请在 Supabase Dashboard 点击 Resume project',
      };
    }
    return {
      ok: false,
      status: res.status,
      message: `云端响应异常（HTTP ${res.status}）`,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        ok: false,
        message: `连接超时（>${Math.round(timeoutMs / 1000)}s），云端无响应。请检查网络或代理；${PAUSED_HINT}`,
      };
    }
    return {
      ok: false,
      message: `无法连接云端（域名解析或 TLS 握手失败）。请检查网络或代理；${PAUSED_HINT}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

export type UserSettings = {
  id: string;
  user_id: string;
  bookmarks: Bookmark[];
  settings: AppSettings;
  todos: Todo[];
  updated_at: string;
};
