const AUTH_CACHE_MS = 10000;
const MOBILE_QUERY = '(max-width: 1056px)';

export function hasSessionCookie(cookieString = '') {
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .some(cookie => cookie.startsWith('iding-session='));
}

export function shouldUseRecentAuth({ authCheckedAt, now = Date.now(), isDirectAccess }) {
  return Boolean(authCheckedAt && !isDirectAccess && now - authCheckedAt < AUTH_CACHE_MS);
}

export function getAppScriptSources(isMobile) {
  return isMobile ? ['/js/app.js', '/js/app-mobile.js'] : ['/js/app.js'];
}

function preserveHash() {
  try {
    if (location.hash) sessionStorage.setItem('mf:preservedHash', location.hash);
  } catch (_) {}
}

function isDirectAccess() {
  return !document.referrer || window.history.length <= 1;
}

function readAuthCheckedAt() {
  try {
    return Number(sessionStorage.getItem('auth_checked_ts') || '0');
  } catch (_) {
    return 0;
  }
}

function markAuthChecked() {
  try {
    sessionStorage.setItem('auth_checked', 'true');
    sessionStorage.setItem('auth_checked_ts', String(Date.now()));
  } catch (_) {}
}

function isMobileViewport() {
  try {
    return Boolean(window.matchMedia && window.matchMedia(MOBILE_QUERY).matches);
  } catch (_) {
    return false;
  }
}

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.type = 'module';
  script.src = src;
  document.body.appendChild(script);
}

function loadAppScripts() {
  getAppScriptSources(isMobileViewport()).forEach(loadScript);
}

function redirectTo(url) {
  window.location.replace(url);
}

function createLoadingOverlay() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'bootstrap-loading';
  loadingDiv.innerHTML = [
    '<div class="bootstrap-loading-inner">',
    '<div class="bootstrap-loading-icon">📧</div>',
    '<div class="bootstrap-spinner"></div>',
    '</div>',
  ].join('');
  document.body.appendChild(loadingDiv);
  return loadingDiv;
}

async function fetchSession(timeoutMs) {
  const controller = new AbortController();
  const tid = setTimeout(() => {
    try {
      controller.abort();
    } catch (_) {}
  }, timeoutMs);

  try {
    const response = await fetch('/api/session', {
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
      credentials: 'include',
    });
    clearTimeout(tid);
    return response;
  } catch (error) {
    clearTimeout(tid);
    throw error;
  }
}

async function verifySession({ timeoutMs, onUnauthenticated, allowAppFallback }) {
  const response = await fetchSession(timeoutMs);
  if (!response || !response.ok) {
    if (allowAppFallback) {
      markAuthChecked();
      loadAppScripts();
      return null;
    }
    onUnauthenticated();
    return null;
  }

  const session = await response.json();
  if (session && session.role === 'mailbox') {
    redirectTo('/html/mailbox.html');
    return null;
  }

  markAuthChecked();
  loadAppScripts();
  return session;
}

async function bootDirectAccess() {
  const hasCookie = hasSessionCookie(document.cookie || '');

  if (hasCookie) {
    try {
      await verifySession({
        timeoutMs: 3000,
        allowAppFallback: true,
        onUnauthenticated: loadAppScripts,
      });
    } catch (_) {
      markAuthChecked();
      loadAppScripts();
    }
    return;
  }

  const loadingDiv = createLoadingOverlay();
  try {
    const session = await verifySession({
      timeoutMs: 2500,
      allowAppFallback: false,
      onUnauthenticated: () => redirectTo('/templates/loading.html?redirect=/'),
    });
    if (session && loadingDiv) loadingDiv.remove();
  } catch (_) {
    redirectTo('/templates/loading.html?redirect=/');
  }
}

async function bootNavigationAccess() {
  const hasCookie = hasSessionCookie(document.cookie || '');

  try {
    await verifySession({
      timeoutMs: 2000,
      allowAppFallback: hasCookie,
      onUnauthenticated: () => redirectTo('/html/login.html'),
    });
  } catch (_) {
    if (hasCookie) {
      markAuthChecked();
      loadAppScripts();
    } else {
      redirectTo('/html/login.html');
    }
  }
}

export async function bootstrap() {
  preserveHash();

  const directAccess = isDirectAccess();
  if (shouldUseRecentAuth({ authCheckedAt: readAuthCheckedAt(), isDirectAccess: directAccess })) {
    loadAppScripts();
    return;
  }

  if (directAccess) {
    await bootDirectAccess();
  } else {
    await bootNavigationAccess();
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  bootstrap().catch(() => {
    redirectTo('/templates/loading.html?redirect=/');
  });
}
