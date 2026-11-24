import { supabase } from './supabase';

export type OAuthProvider = 'github' | 'google';

/** 用户在授权窗口点了取消，不是故障，不应显示错误提示 */
export class OAuthCancelledError extends Error {
  constructor() {
    super('已取消登录');
    this.name = 'OAuthCancelledError';
  }
}

/**
 * 仅在扩展（webextension）运行时有 runtime.id。
 * 普通网页里的 window.chrome 没有该字段，因此不能只判断 `typeof chrome`。
 */
export function isExtensionRuntime(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.runtime !== 'undefined' &&
    Boolean(chrome.runtime.id)
  );
}

/**
 * 授权完成后的回跳地址。
 * - 网页版：回到站点根路径，需在 Supabase Redirect URLs 白名单中
 * - 扩展版：`chrome-extension://` 页面无法作为 OAuth 回跳目标（浏览器会拦截），
 *   必须使用 identity API 提供的 `https://<extension-id>.chromiumapp.org/`
 */
export function getOAuthRedirectUrl(): string {
  if (isExtensionRuntime()) {
    const identity = chrome.identity;
    if (!identity?.getRedirectURL) {
      throw new Error(
        '当前扩展缺少 identity 权限，无法在扩展内使用 OAuth 登录。请改用邮箱登录，或先在网页版登录。'
      );
    }
    return identity.getRedirectURL();
  }

  const base = import.meta.env.BASE_URL || '/';
  const path = base === './' ? '/' : base;
  return new URL(path, window.location.origin).toString();
}

function launchWebAuthFlow(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({ url, interactive: true }, (callbackUrl) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        const message = runtimeError.message ?? '';
        reject(
          /did not approve|cancel|abort/i.test(message)
            ? new OAuthCancelledError()
            : new Error(`扩展内登录失败：${message}`)
        );
        return;
      }
      if (!callbackUrl) {
        reject(new OAuthCancelledError());
        return;
      }
      resolve(callbackUrl);
    });
  });
}

async function completeOAuthCallback(callbackUrl: string, redirectTo: string): Promise<void> {
  const callback = new URL(callbackUrl);
  // implicit 流程把凭据放在 hash 中，PKCE 流程放在 query 中，两者都兼容
  const hash = new URLSearchParams(callback.hash.replace(/^#/, ''));

  const errorDescription =
    hash.get('error_description') ?? callback.searchParams.get('error_description');
  if (errorDescription) throw new Error(errorDescription);

  const code = callback.searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }

  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');
  if (!accessToken || !refreshToken) {
    throw new Error(
      `授权回调缺少凭据。请确认 Supabase → Authentication → URL Configuration 的 Redirect URLs 中已加入 ${redirectTo}`
    );
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;
}

/**
 * OAuth 登录。
 * 网页版走页面跳转；扩展版走 chrome.identity.launchWebAuthFlow（扩展页面无法被第三方重定向）。
 */
export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
  const redirectTo = getOAuthRedirectUrl();

  if (!isExtensionRuntime()) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) throw error;
    return;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error('无法生成授权链接，请稍后重试');

  const callbackUrl = await launchWebAuthFlow(data.url);
  await completeOAuthCallback(callbackUrl, redirectTo);
}
