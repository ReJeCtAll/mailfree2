(function () {
  if (!window.I18n || typeof window.I18n.register !== 'function') return;
  window.I18n.register('en', {
    'login.title': 'Sign in to MailFree2',
    'login.hint': 'Keep your account credentials safe.',
    'login.empty.username': 'Enter your username',
    'login.empty.password': 'Enter your password',
    'login.logging.in': 'Signing in...',
    'login.success': 'Signed in',
    'login.fail': 'Sign in failed',
    'login.network.fail': 'Sign in request failed. Try again later.',
    'common.loading': 'Loading...',
    'common.network.error': 'Network error. Try again later.'
  });
})();
