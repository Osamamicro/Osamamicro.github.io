import 'expo-sqlite/localStorage/install';

import { useSyncExternalStore } from 'react';

/*
 * Tiny reactive key-value store. On web it is the browser's localStorage; on
 * iOS/Android expo-sqlite installs a synchronous localStorage polyfill.
 * Values are cached so useSyncExternalStore gets a stable snapshot.
 */

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();
const PREFIX = 'qimma:';

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  try {
    const raw = globalThis.localStorage?.getItem(PREFIX + key);
    if (raw != null) value = JSON.parse(raw) as T;
  } catch {
    // Corrupt or unavailable storage: fall back to the default.
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    globalThis.localStorage?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode); keep the in-memory value.
  }
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, listener: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)?.delete(listener);
}

export interface Store<T> {
  get: () => T;
  set: (value: T) => void;
  update: (fn: (prev: T) => T) => void;
  use: () => T;
}

export function createStore<T>(key: string, fallback: T): Store<T> {
  const get = () => read(key, fallback);
  const set = (value: T) => write(key, value);
  return {
    get,
    set,
    update: (fn) => set(fn(get())),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    use: () => useSyncExternalStore((cb) => subscribe(key, cb), get, get),
  };
}
