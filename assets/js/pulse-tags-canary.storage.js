(function () {
  'use strict';

  const STORAGE_KEY = 'pulse-tags-canary';

  function isStorageAvailable() {
    try {
      const test = '__setfarm_storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function load(defaultValue) {
    if (!isStorageAvailable()) {
      return { value: defaultValue, status: 'unavailable', error: null };
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return { value: defaultValue, status: 'ok', error: null };
      }
      const parsed = JSON.parse(raw);
      return { value: parsed, status: 'ok', error: null };
    } catch (err) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      return {
        value: defaultValue,
        status: 'recovered',
        error: 'Corrupted storage was cleared and reset.'
      };
    }
  }

  function save(value) {
    if (!isStorageAvailable()) {
      return { ok: false, status: 'unavailable', error: 'localStorage is unavailable.' };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return { ok: true, status: 'ok', error: null };
    } catch (err) {
      return { ok: false, status: 'error', error: err && err.message ? err.message : 'Save failed.' };
    }
  }

  function clear() {
    if (!isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }

  window.PulseTagsCanary = window.PulseTagsCanary || {};
  window.PulseTagsCanary.storage = { STORAGE_KEY, load, save, clear, isStorageAvailable };
})();
