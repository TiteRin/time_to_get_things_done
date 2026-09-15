const KEY = 'ttgtd.lastList'

/** Saves the ordered task ids of the last generated list; storage failures are ignored */
export function saveLastList(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    // Quota exceeded or private browsing: starting the session matters more than persisting it
  }
}

/** Ordered task ids of the last generated list; empty when absent or unreadable */
export function loadLastList(): string[] {
  try {
    const ids: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    if (!Array.isArray(ids)) return []
    return [...new Set(ids.filter((id): id is string => typeof id === 'string'))]
  } catch {
    return []
  }
}
