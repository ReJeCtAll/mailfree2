import assert from 'node:assert/strict';
import test from 'node:test';

function installBrowserGlobals() {
  global.window = {
    __: (key, params = {}) => {
      if (key === 'common.etc.people') return `and ${params.count} people`;
      return key;
    },
    currentMailbox: '',
  };
}

test('email list items expose data actions instead of inline handlers', async () => {
  installBrowserGlobals();
  const { renderEmailItem, setView } = await import('../public/js/modules/app/email-list.js');

  setView(false);
  const html = renderEmailItem({
    id: 42,
    sender: 'sender@example.com',
    subject: 'Login code',
    content: 'Your code is 123456',
    received_at: '2026-06-16T10:00:00Z',
  });

  assert.match(html, /data-action="show-email"/);
  assert.match(html, /data-email-id="42"/);
  assert.doesNotMatch(html, /\sonclick=/);
});

test('mailbox list items expose data actions instead of inline handlers', async () => {
  installBrowserGlobals();
  const { renderMailboxItem } = await import('../public/js/modules/app/mailbox-list.js');

  const html = renderMailboxItem({
    address: "test'box@example.com",
    created_at: '2026-06-16T10:00:00Z',
    is_pinned: true,
  });

  assert.match(html, /data-action="select-mailbox"/);
  assert.match(html, /data-action="toggle-pin"/);
  assert.match(html, /data-action="delete-mailbox"/);
  assert.match(html, /data-address="test&#39;box@example\.com"/);
  assert.doesNotMatch(html, /\sonclick=/);
});

test('email HTML iframe is sandboxed', async () => {
  installBrowserGlobals();
  let renderedContent = '';
  let renderedSubject = '';
  let modalShown = false;
  const { showEmailDetail } = await import('../public/js/modules/app/email-viewer.js');

  await showEmailDetail(
    7,
    {
      modal: { classList: { add: () => { modalShown = true; } } },
      modalSubject: {
        set innerHTML(value) {
          renderedSubject = value;
        },
      },
      modalContent: {
        set innerHTML(value) {
          renderedContent = value;
        },
      },
    },
    async () => ({
      json: async () => ({
        id: 7,
        subject: 'HTML mail',
        html_content: '<a href="https://example.com">Open</a>',
      }),
    }),
    () => {},
  );

  assert.equal(modalShown, true);
  assert.match(renderedSubject, /HTML mail/);
  assert.match(renderedContent, /<iframe\b/);
  assert.match(renderedContent, /\bsandbox="/);
  assert.match(renderedContent, /\breferrerpolicy="no-referrer"/);
  assert.doesNotMatch(renderedContent, /allow-scripts/);
});

test('email verification code copy control does not render inline script', async () => {
  installBrowserGlobals();
  let renderedContent = '';
  const { showEmailDetail } = await import('../public/js/modules/app/email-viewer.js');

  await showEmailDetail(
    8,
    {
      modal: { classList: { add: () => {} } },
      modalSubject: {
        set innerHTML(_) {},
      },
      modalContent: {
        set innerHTML(value) {
          renderedContent = value;
        },
        querySelectorAll: () => [],
      },
    },
    async () => ({
      json: async () => ({
        id: 8,
        subject: 'Code mail',
        content: 'Use this code',
        verification_code: "12'34",
      }),
    }),
    () => {},
  );

  assert.match(renderedContent, /data-action="copy-verification-code"/);
  assert.match(renderedContent, /data-code="12&#39;34"/);
  assert.doesNotMatch(renderedContent, /\sonclick=/);
});

test('bootstrap detects the session cookie exactly', async () => {
  const { hasSessionCookie } = await import('../public/js/bootstrap.js');

  assert.equal(hasSessionCookie('iding-session=abc; theme=dark'), true);
  assert.equal(hasSessionCookie('theme=dark; iding-session=abc'), true);
  assert.equal(hasSessionCookie('theme=dark; not-iding-session=abc'), false);
  assert.equal(hasSessionCookie('theme=dark'), false);
});

test('bootstrap only trusts recent auth cache for non-direct navigation', async () => {
  const { shouldUseRecentAuth } = await import('../public/js/bootstrap.js');

  assert.equal(shouldUseRecentAuth({ authCheckedAt: 1000, now: 9000, isDirectAccess: false }), true);
  assert.equal(shouldUseRecentAuth({ authCheckedAt: 1000, now: 12000, isDirectAccess: false }), false);
  assert.equal(shouldUseRecentAuth({ authCheckedAt: 1000, now: 9000, isDirectAccess: true }), false);
  assert.equal(shouldUseRecentAuth({ authCheckedAt: 0, now: 9000, isDirectAccess: false }), false);
});

test('bootstrap app script list includes mobile script only when needed', async () => {
  const { getAppScriptSources } = await import('../public/js/bootstrap.js');

  assert.deepEqual(getAppScriptSources(false), ['/js/app.js']);
  assert.deepEqual(getAppScriptSources(true), ['/js/app.js', '/js/app-mobile.js']);
});
