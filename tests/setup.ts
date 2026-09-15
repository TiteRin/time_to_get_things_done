import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Node 25 exposes a global localStorage without any method (no --localstorage-file),
// which shadows jsdom's; replace it with a working in-memory implementation
const store = new Map<string, string>()
const localStorage: Storage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
  key: (index) => [...store.keys()][index] ?? null,
  get length() {
    return store.size
  },
}
for (const target of [globalThis, window]) {
  Object.defineProperty(target, 'localStorage', { value: localStorage, configurable: true })
}

afterEach(() => {
  cleanup()
  store.clear()
})
