(function () {
  const locales = {};
  let currentLocale = 'zh';

  const FALLBACK_MESSAGES = {
    zh: {
      'login.title': '登录到临时邮箱',
      'login.subtitle': 'Secure enterprise mailbox access',
      'login.hint': '注意保管好账号密码。',
      'login.empty.username': '请输入用户名',
      'login.empty.password': '请输入密码',
      'login.logging.in': '登录中...',
      'login.success': '登录成功',
      'login.fail': '登录失败',
      'login.network.fail': '登录请求失败，请稍后重试',
      'login.plz.login': '请先登录',
      'login.mailbox.only': '仅邮箱用户可访问',
      'login.auth.fail': '认证失败，请重新登录',
      'login.refresh.success': '刷新成功',
      'common.loading': '加载中...',
      'common.updating': '更新中...',
      'common.no.emails': '暂无邮件',
      'common.no.subject': '无主题',
      'common.no.preview': '无预览',
      'common.network.error': '网络错误，请稍后重试',
      'common.load.fail': '加载失败',
      'common.delete.fail': '删除失败',
      'common.delete.success': '删除成功',
      'common.copy.fail': '复制失败',
      'common.copy.success': '复制成功',
      'common.op.fail': '操作失败',
      'common.op.success': '操作成功',
      'common.save.fail': '保存失败',
      'common.save.success': '保存成功',
      'common.unknown.error': '未知错误',
      'common.jumping': '正在跳转...',
      'common.click.copy': '点击复制',
      'common.countdown': '{count} 秒后刷新',
      'common.etc.people': '等 {count} 人',
      'mailbox.count': '{total} 个邮箱',
      'mailbox.none': '暂无邮箱',
      'mailbox.plz.select': '请先选择邮箱',
      'mailbox.plz.generate': '请先生成邮箱',
      'mailbox.plz.select.generate': '请先选择或生成邮箱',
      'mailbox.generate.loading': '生成中...',
      'mailbox.generate.success': '邮箱生成成功',
      'mailbox.generate.name.success': '人名邮箱生成成功',
      'mailbox.generate.fail': '邮箱生成失败',
      'mailbox.create.invalid': '邮箱名称格式不正确',
      'mailbox.create.success': '邮箱已创建：{mailbox}',
      'mailbox.create.fail': '邮箱创建失败',
      'mailbox.copied': '已复制邮箱：{mailbox}',
      'mailbox.deleted': '邮箱已删除',
      'mailbox.confirm.delete': '确定删除邮箱 {mailbox} 吗？',
      'mailbox.confirm.delete.simple': '确定删除邮箱 {address} 吗？',
      'mailbox.all.domains': '全部域名',
      'mailbox.pin.success': '置顶状态已更新',
      'email.inbox': '收件箱',
      'email.sentbox': '发件箱',
      'email.sender': '发件人',
      'email.recipient': '收件人',
      'email.subject': '主题',
      'email.content': '内容',
      'email.deleted': '邮件已删除',
      'email.sent.deleted': '已发送邮件已删除',
      'email.confirm.delete': '确定删除这封邮件吗？',
      'email.confirm.delete.sent': '确定删除这封已发送邮件吗？',
      'email.confirm.clear': '确定清空 {mailbox} 的邮件吗？',
      'email.cleared': '邮件已清空',
      'email.clear.fail': '清空邮件失败',
      'email.load.fail': '邮件加载失败',
      'email.code.copied': '验证码已复制',
      'email.code.copied.msg': '验证码已复制：{code}',
      'email.content.copied': '邮件内容已复制',
      'email.content.unavailable': '完整邮件内容暂不可用，以上为摘要信息',
      'email.content.no.data': '此邮件内容暂不可用',
      'email.no.mailbox': '请先选择邮箱',
      'email.no.sender': '请先选择发件邮箱',
      'email.empty.recipient': '请输入收件人',
      'email.empty.content': '请输入主题或内容',
      'email.sending': '发送中...',
      'email.send.fail': '邮件发送失败',
      'email.send.success': '邮件发送成功',
      'email.status.queued': '排队中',
      'email.status.delivered': '已送达',
      'email.status.failed': '失败',
      'email.status.processing': '处理中',
      'email.recipient.label': '收件人',
      'email.status.label': '状态',
      'email.sent.time.label': '发送时间',
      'favorite.on': '已收藏',
      'favorite.off': '收藏邮箱',
      'favorite.remove': '取消收藏',
      'role.super.admin': '超级管理员',
      'role.admin': '管理员 {username}',
      'role.user': '用户 {username}',
      'role.guest': '访客',
      'role.mailbox.owner': '邮箱用户：{mailbox}',
      'role.mailbox': '邮箱用户',
      'role.admin.user': '管理员',
      'role.regular.user': '普通用户',
      'status.pin': '置顶',
      'status.unpin': '取消置顶',
      'status.select.mailbox': '选择邮箱',
      'status.forward.to': '转发到 {forward}',
      'status.forward.none': '未设置转发',
      'status.pwd.default': '默认密码',
      'status.pwd.set': '已设置密码',
      'status.login.allowed': '允许登录',
      'status.login.denied': '禁止登录',
      'status.login.allow': '允许登录',
      'status.login.deny': '禁止登录',
      'status.login.allowed.verb': '已允许登录',
      'status.login.denied.verb': '已禁止登录',
      'status.favorited': '已收藏',
      'status.not.favorited': '未收藏',
      'action.copy': '复制',
      'action.delete': '删除',
      'action.forward.set': '设置转发',
      'action.forward.settings': '转发设置',
      'action.view.email': '查看邮件',
      'selection.selected': '已选择 {count} 项',
      'selection.none': '未选择',
      'selection.deselect.page': '取消本页选择',
      'selection.all.page': '选择本页',
      'pager.page': '第 {page} / {total} 页',
      'pager.page.total': '第 {page} / {total} 页，共 {count} 项',
      'password.fill.all': '请填写完整密码信息',
      'password.mismatch': '两次输入的新密码不一致',
      'password.min.length': '新密码至少 6 位',
      'password.change.confirm': '确定要修改密码吗？',
      'password.change.success': '密码修改成功',
      'password.changed.relogin': '密码已修改，请重新登录',
      'password.set': '设置密码',
      'password.reset': '重置密码',
      'password.set.prompt': '为 {address} 设置密码',
      'password.reset.prompt': '重置 {address} 的密码',
      'password.enter.new': '请输入新密码',
      'password.set.success': '密码设置成功',
      'password.reset.success': '密码重置成功',
      'user.mailbox.limit': '邮箱上限',
      'user.enter.username': '请输入用户名',
      'user.enter.mailbox': '请输入邮箱',
      'user.enter.valid.mailbox': '请输入有效邮箱',
      'user.not.found': '用户不存在',
      'user.load.fail': '用户加载失败',
      'user.empty.fields': '请填写完整用户信息',
      'user.create.success': '用户创建成功',
      'user.create.fail': '用户创建失败',
      'user.assign.success': '成功分配 {count} 个邮箱',
      'user.assign.partial': '成功 {success} 个，失败 {fail} 个',
      'user.assign.fail': '邮箱分配失败',
      'user.unassign.success': '成功解除 {count} 个邮箱',
      'user.unassign.fail': '解除分配失败',
      'user.confirm.delete': '确定删除用户 {username} 吗？',
      'user.deleted': '用户已删除',
      'user.delete.fail': '用户删除失败',
      'batch.enter.emails': '请输入邮箱列表',
      'batch.recognized': '识别到 {count} 个邮箱',
      'batch.needed.input': '请填写必要信息',
      'batch.complete': '批量操作完成',
      'batch.confirm.delete': '确定删除 {count} 个邮箱吗？',
      'batch.no.deletable': '没有可删除的邮箱',
      'batch.deleted.partial': '已删除 {deleted} 个，失败 {fail} 个',
      'batch.deleted': '已删除 {count} 个邮箱',
      'batch.allow.login': '允许登录',
      'batch.deny.login': '禁止登录',
      'batch.favorite': '批量收藏',
      'batch.unfavorite': '取消收藏',
      'batch.forward': '批量转发',
      'batch.clear.forward': '清除转发',
      'batch.enter.emails.desc': '请输入要{action}的邮箱列表',
      'batch.unassigned': '已解除分配',
      'batch.confirm.unassign': '确定解除 {address} 的分配吗？',
      'batch.unassign.fail': '解除分配失败',
      'demo.banner': '演示模式'
    },
    en: {}
  };

  function interpolate(template, params) {
    return String(template).replace(/\{(\w+)\}/g, (_, key) => {
      if (!params || params[key] === undefined || params[key] === null) return '';
      return String(params[key]);
    });
  }

  function translate(key, params) {
    const dict = Object.assign(
      {},
      FALLBACK_MESSAGES.zh,
      locales.zh || {},
      currentLocale === 'zh' ? {} : (FALLBACK_MESSAGES[currentLocale] || {}),
      currentLocale === 'zh' ? {} : (locales[currentLocale] || {})
    );
    const value = dict[key] || key;
    return interpolate(value, params);
  }

  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (key) node.textContent = translate(key);
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (key) node.setAttribute('placeholder', translate(key));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach((node) => {
      const key = node.getAttribute('data-i18n-title');
      if (key) node.setAttribute('title', translate(key));
    });
  }

  window.__ = typeof window.__ === 'function' ? window.__ : translate;
  window.I18n = Object.assign(window.I18n || {}, {
    t: translate,
    apply: applyTranslations,
    setLocale(locale) {
      currentLocale = locale || 'zh';
      applyTranslations(document);
    },
    register(locale, messages) {
      if (!locale || !messages) return;
      locales[locale] = Object.assign(locales[locale] || {}, messages);
      window.__ = translate;
      applyTranslations(document);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTranslations(document), { once: true });
  } else {
    applyTranslations(document);
  }
})();
