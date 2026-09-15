const KEY = 'ttgtd.lastList'

/** Saves the ordered task ids of the last generated list */
export const saveLastList = (ids: string[]) => window.localStorage.setItem(KEY, JSON.stringify(ids))

/** Ordered task ids of the last generated list; empty when absent or unreadable */
export function loadLastList(): string[] {
  try {
    const ids: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}
