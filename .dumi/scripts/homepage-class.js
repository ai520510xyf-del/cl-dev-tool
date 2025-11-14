// 为首页的 dumi-default-content 添加额外类名
(function() {
  const addHomePageClass = () => {
    const contentElement = document.querySelector('.dumi-default-content');
    const heroElement = document.querySelector('.dumi-default-hero');

    if (contentElement && heroElement) {
      contentElement.classList.add('dumi-home-content');
    } else if (contentElement) {
      // 如果不是首页，移除类名
      contentElement.classList.remove('dumi-home-content');
    }
  };

  // 立即执行一次
  addHomePageClass();

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHomePageClass);
  }

  // 使用 MutationObserver 监听 DOM 变化（dumi 是 SPA，路由变化时 DOM 会更新）
  const observer = new MutationObserver(() => {
    addHomePageClass();
  });

  // 观察 body 的变化
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // 监听路由变化（SPA 路由）
  if (window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(addHomePageClass, 200);
    };

    window.addEventListener('popstate', () => {
      setTimeout(addHomePageClass, 200);
    });
  }

  // 监听 hash 变化
  window.addEventListener('hashchange', () => {
    setTimeout(addHomePageClass, 200);
  });

  // 定期检查（作为备用方案）
  setInterval(addHomePageClass, 1000);
})();
