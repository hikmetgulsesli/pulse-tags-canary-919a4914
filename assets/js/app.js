(function () {
  'use strict';

  const DEFAULT_FIXTURE = {
    records: [
      { id: 'h1', title: 'Morning Run', status: 'idle', tag: 'health', notes: '' },
      { id: 'h2', title: 'Read 30 min', status: 'idle', tag: 'growth', notes: '' },
      { id: 'h3', title: 'Drink Water', status: 'done', tag: 'health', notes: '' },
      { id: 'h4', title: 'Call Family', status: 'idle', tag: 'relationships', notes: '' },
      { id: 'h5', title: 'Plan Tomorrow', status: 'idle', tag: 'productivity', notes: '' }
    ],
    preferences: { activeRoute: 'record-operations' }
  };

  const ROUTES = {
    'record-operations': { label: 'Record Operations', hasPanel: true },
    'status-board': { label: 'Status Board', hasPanel: true },
    insights: { label: 'Insights', hasPanel: true },
    'record-editor': { label: 'Record Editor', hasPanel: true },
    settings: { label: 'Settings', hasPanel: false },
    account: { label: 'Account', hasPanel: false }
  };

  const storage = window.PulseTagsCanary.storage;
  const createStore = window.PulseTagsCanary.createStore;

  let store;
  let currentRecords = [];

  function bootstrap(fixture) {
    const persisted = storage.load({ preferences: {}, records: null });
    const savedRecords = persisted.value && persisted.value.records;
    const savedPreferences = persisted.value && persisted.value.preferences;

    const initialRoute =
      (savedPreferences && savedPreferences.activeRoute) ||
      (fixture.preferences && fixture.preferences.activeRoute) ||
      'record-operations';

    store = createStore({
      activeRoute: initialRoute,
      activePanel: initialRoute,
      selectedRecordId: null,
      storageStatus: persisted.status,
      lastError: persisted.error,
      records: savedRecords || fixture.records || []
    });

    store.subscribe(persistState);
    store.subscribe(render);

    window.app = buildAppApi();
    document.dispatchEvent(new CustomEvent('setfarm-app-ready'));
    bindGlobalEvents();
    render(store.getState());
  }

  function buildAppApi() {
    return {
      getState: store.getState,
      navigate: (route) => dispatch({ type: 'NAVIGATE', route }),
      selectRecord: (id) => dispatch({ type: 'SELECT_RECORD', id }),
      toggleRecord: (id) => dispatch({ type: 'TOGGLE_RECORD', id }),
      reset: () => dispatch({ type: 'RESET' }),
      clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
      get activeRoute() { return store.getState().activeRoute; },
      get selectedRecord() {
        const s = store.getState();
        return s.records.find((r) => r.id === s.selectedRecordId) || null;
      },
      get counts() { return store.getState().counts; },
      get storageStatus() { return store.getState().storageStatus; },
      get lastError() { return store.getState().lastError; },
      get activePanel() { return store.getState().activePanel; }
    };
  }

  function dispatch(action) {
    const s = store.getState();
    switch (action.type) {
      case 'NAVIGATE': {
        const route = action.route;
        if (!ROUTES[route]) return;
        store.setState({ activeRoute: route, activePanel: route, lastError: null });
        updateLocationHash(route);
        break;
      }
      case 'SELECT_RECORD':
        store.setState({ selectedRecordId: action.id });
        break;
      case 'TOGGLE_RECORD': {
        const next = s.records.map((r) =>
          r.id === action.id ? { ...r, status: r.status === 'done' ? 'idle' : 'done' } : r
        );
        store.setState({ records: next });
        break;
      }
      case 'RESET':
        storage.clear();
        store.setState({
          activeRoute: 'record-operations',
          activePanel: 'record-operations',
          selectedRecordId: null,
          records: currentRecords.length ? currentRecords : DEFAULT_FIXTURE.records,
          storageStatus: 'ok',
          lastError: null
        });
        break;
      case 'CLEAR_ERROR':
        store.setState({ lastError: null });
        break;
      default:
        break;
    }
  }

  function updateLocationHash(route) {
    try {
      if (window.location.hash !== '#' + route) {
        window.location.hash = route;
      }
    } catch (_) {}
  }

  function persistState(state) {
    currentRecords = state.records;
    const result = storage.save({
      preferences: { activeRoute: state.activeRoute },
      records: state.records
    });
    if (!result.ok && state.storageStatus !== 'error') {
      store.setState({ storageStatus: result.status, lastError: result.error });
    }
  }

  function bindGlobalEvents() {
    document.addEventListener('click', (event) => {
      const nav = event.target.closest('[data-action-id^="nav-"]');
      if (nav) {
        event.preventDefault();
        const route = nav.getAttribute('data-route');
        if (route) dispatch({ type: 'NAVIGATE', route });
        return;
      }

      const actionEl = event.target.closest('[data-action-id]');
      if (!actionEl) return;

      const actionId = actionEl.getAttribute('data-action-id');
      switch (actionId) {
        case 'reset':
          event.preventDefault();
          dispatch({ type: 'RESET' });
          break;
        case 'copy-summary':
          event.preventDefault();
          copySummary();
          break;
        case 'new-record':
        case 'create-habit':
          event.preventDefault();
          dispatch({ type: 'NAVIGATE', route: 'record-editor' });
          break;
        case 'settings':
          event.preventDefault();
          dispatch({ type: 'NAVIGATE', route: 'settings' });
          break;
        case 'account':
          event.preventDefault();
          dispatch({ type: 'NAVIGATE', route: 'account' });
          break;
        case 'dismiss-error':
          event.preventDefault();
          dispatch({ type: 'CLEAR_ERROR' });
          break;
        case 'record-toggle': {
          event.preventDefault();
          const id = actionEl.getAttribute('data-record-id');
          if (id) dispatch({ type: 'TOGGLE_RECORD', id });
          break;
        }
        case 'select-record': {
          event.preventDefault();
          const id = actionEl.getAttribute('data-record-id');
          if (id) dispatch({ type: 'SELECT_RECORD', id });
          break;
        }
        default:
          break;
      }
    });

    window.addEventListener('hashchange', () => {
      const route = parseHashRoute();
      if (route && ROUTES[route]) dispatch({ type: 'NAVIGATE', route });
    });
  }

  function parseHashRoute() {
    try {
      return window.location.hash.replace(/^#/, '') || 'record-operations';
    } catch (_) {
      return 'record-operations';
    }
  }

  function copySummary() {
    const s = store.getState();
    const text = `Pulse Tags Canary — ${s.counts.done}/${s.counts.total} done (${s.counts.idle} idle)`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        store.setState({ lastError: 'Unable to copy summary to clipboard.' });
      });
    } else {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) {
        store.setState({ lastError: 'Unable to copy summary to clipboard.' });
      }
    }
  }

  function render(state) {
    const root = document.querySelector('[data-setfarm-root]');
    if (!root) return;

    const routeInfo = ROUTES[state.activeRoute] || ROUTES['record-operations'];

    root.innerHTML = `
      <header class="app-header">
        <div class="brand">Pulse Tags Canary</div>
        <nav class="app-nav" aria-label="Primary">
          ${renderNavLink('record-operations', 'Record Operations', state.activeRoute)}
          ${renderNavLink('status-board', 'Status Board', state.activeRoute)}
          ${renderNavLink('insights', 'Insights', state.activeRoute)}
        </nav>
        <div class="app-actions">
          <button type="button" class="icon-btn" data-action-id="settings" aria-label="Settings">settings</button>
          <button type="button" class="icon-btn" data-action-id="account" aria-label="Account">account_circle</button>
        </div>
      </header>

      ${state.lastError ? `
        <div class="error-banner" role="alert">
          <span>${escapeHtml(state.lastError)}</span>
          <button type="button" data-action-id="dismiss-error" aria-label="Dismiss">close</button>
        </div>
      ` : ''}

      <section class="surface-panel" data-surface-id="${state.activeRoute}">
        <div class="surface-header">
          <h2>${escapeHtml(routeInfo.label)}</h2>
          <div class="surface-meta">
            <span class="chip">${state.counts.done}/${state.counts.total} done</span>
            <span class="chip storage-${state.storageStatus}">storage: ${state.storageStatus}</span>
          </div>
        </div>
        ${renderSurfaceContent(state)}
      </section>

      <footer class="app-footer">
        <nav class="footer-nav" aria-label="Shortcuts">
          <a href="#record-operations" data-route="record-operations" data-action-id="nav-footer-record-operations">Ops</a>
          <a href="#status-board" data-route="status-board" data-action-id="nav-footer-status-board">Board</a>
          <a href="#insights" data-route="insights" data-action-id="nav-footer-insights">Insights</a>
        </nav>
      </footer>
    `;
  }

  function renderNavLink(route, label, activeRoute) {
    const isActive = route === activeRoute;
    return `<a href="#${route}" data-route="${route}" data-action-id="nav-${route}"${isActive ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a>`;
  }

  function renderSurfaceContent(state) {
    switch (state.activeRoute) {
      case 'record-operations':
        return renderRecordOperations(state);
      case 'status-board':
        return renderStatusBoard(state);
      case 'insights':
        return renderInsights(state);
      case 'record-editor':
        return renderRecordEditor(state);
      case 'settings':
        return `<p class="placeholder">Settings panel placeholder for downstream stories.</p>`;
      case 'account':
        return `<p class="placeholder">Account panel placeholder for downstream stories.</p>`;
      default:
        return `<p class="placeholder">Surface placeholder.</p>`;
    }
  }

  function renderRecordOperations(state) {
    return `
      <div class="toolbar">
        <input type="text" placeholder="Search records..." aria-label="Search records" />
        <button type="button" data-action-id="create-habit">Create Habit</button>
        <button type="button" data-action-id="reset">Reset</button>
        <button type="button" data-action-id="copy-summary">Copy Sum</button>
        <button type="button" data-action-id="getState" disabled>getState</button>
      </div>
      <div class="record-list">
        ${state.records.map((r) => renderRecordRow(r, state.selectedRecordId)).join('')}
      </div>
    `;
  }

  function renderRecordRow(record, selectedId) {
    const selectedClass = record.id === selectedId ? ' selected' : '';
    return `
      <article class="record-row${selectedClass}">
        <button type="button" class="record-toggle ${record.status}" data-action-id="record-toggle" data-record-id="${record.id}" aria-pressed="${record.status === 'done'}">
          ${record.status === 'done' ? 'Done' : 'Idle'}
        </button>
        <button type="button" class="record-title" data-action-id="select-record" data-record-id="${record.id}">
          ${escapeHtml(record.title)}
        </button>
        <span class="record-tag">${escapeHtml(record.tag)}</span>
      </article>
    `;
  }

  function renderStatusBoard(state) {
    const idle = state.records.filter((r) => r.status === 'idle');
    const done = state.records.filter((r) => r.status === 'done');
    return `
      <div class="board">
        <div class="board-column">
          <h3>Idle (${idle.length})</h3>
          ${idle.map((r) => renderRecordRow(r, state.selectedRecordId)).join('')}
        </div>
        <div class="board-column">
          <h3>Done (${done.length})</h3>
          ${done.map((r) => renderRecordRow(r, state.selectedRecordId)).join('')}
        </div>
      </div>
    `;
  }

  function renderInsights(state) {
    return `
      <div class="insights">
        <div class="metric-card"><strong>${state.counts.total}</strong><span>Total</span></div>
        <div class="metric-card"><strong>${state.counts.done}</strong><span>Done</span></div>
        <div class="metric-card"><strong>${state.counts.idle}</strong><span>Idle</span></div>
        <button type="button" data-action-id="copy-summary">Export Summary</button>
      </div>
    `;
  }

  function renderRecordEditor(state) {
    const selected = state.records.find((r) => r.id === state.selectedRecordId) || state.records[0];
    const title = selected ? selected.title : 'New Record';
    return `
      <form class="record-form" onsubmit="return false;">
        <label>Title
          <input type="text" value="${escapeHtml(title)}" placeholder="e.g., Morning Run" />
        </label>
        <div class="form-actions">
          <button type="button" data-action-id="nav-record-operations" data-route="record-operations">Cancel</button>
          <button type="button" data-action-id="nav-record-operations" data-route="record-operations">Save</button>
        </div>
      </form>
    `;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function loadFixture() {
    try {
      const res = await fetch('assets/data/pulse-tags-canary.json');
      if (!res.ok) throw new Error('Fixture unavailable');
      return await res.json();
    } catch (err) {
      return DEFAULT_FIXTURE;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadFixture().then(bootstrap));
  } else {
    loadFixture().then(bootstrap);
  }
})();
