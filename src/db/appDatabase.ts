import { TtgtdDatabase } from './database'

/** The real application's database; tests and stories inject their own instead */
export const appDatabase = new TtgtdDatabase()
