import { createContext } from 'react'
import type { TtgtdDatabase } from './database'

export const DatabaseContext = createContext<TtgtdDatabase | null>(null)
