(function () {
  'use strict';

  const DEFAULT_STATE = {
    activeRoute: 'record-operations',
    activePanel: 'record-operations',
    selectedRecordId: null,
    storageStatus: 'ok',
    lastError: null,
    counts: { total: 0, idle: 0, done: 0 },
    records: [],
    preferences: {}
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function computeCounts(records) {
    return {
      total: records.length,
      idle: records.filter((r) => r.status === 'idle').length,
      done: records.filter((r) => r.status === 'done').length
    };
  }

  function createStore(initialState) {
    let state = Object.assign({}, DEFAULT_STATE, clone(initialState || {}));
    const listeners = [];

    function getState() {
      return clone(state);
    }

    function setState(partial) {
      const next = Object.assign({}, state, clone(partial));
      if (next.records) {
        next.counts = computeCounts(next.records);
      }
      state = next;
      listeners.slice().forEach((fn) => fn(getState()));
    }

    function subscribe(fn) {
      listeners.push(fn);
      return function unsubscribe() {
        const idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    }

    function reset() {
      state = clone(DEFAULT_STATE);
      listeners.slice().forEach((fn) => fn(getState()));
    }

    setState({});

    return { getState, setState, subscribe, reset };
  }

  window.PulseTagsCanary = window.PulseTagsCanary || {};
  window.PulseTagsCanary.createStore = createStore;
  window.PulseTagsCanary.computeCounts = computeCounts;
  window.PulseTagsCanary.DEFAULT_STATE = DEFAULT_STATE;
})();
