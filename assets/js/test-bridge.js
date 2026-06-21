(function () {
  'use strict';

  function getBridge() {
    return window.__SETFARM_TEST_BRIDGE__ || {};
  }

  function syncAppToBridge() {
    const app = window.app;
    if (!app) return;
    window.__SETFARM_TEST_BRIDGE__ = Object.assign({}, getBridge(), {
      stack: 'static-html',
      ready: true,
      app: {
        activeRoute: app.activeRoute,
        selectedRecord: app.selectedRecord,
        counts: app.counts,
        storageStatus: app.storageStatus,
        lastError: app.lastError,
        activePanel: app.activePanel,
        getState: app.getState,
        reset: app.reset,
        navigate: app.navigate,
        selectRecord: app.selectRecord,
        toggleRecord: app.toggleRecord
      }
    });
  }

  window.__SETFARM_TEST_BRIDGE__ = Object.assign({}, getBridge(), {
    stack: 'static-html',
    ready: true,
    refresh: syncAppToBridge
  });

  document.addEventListener('setfarm-app-ready', syncAppToBridge);
  window.addEventListener('load', syncAppToBridge);

  if (window.app) syncAppToBridge();
})();
