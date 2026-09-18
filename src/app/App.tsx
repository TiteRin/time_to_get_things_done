import { Route, Routes } from 'react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { appDatabase } from '@/db/appDatabase'
import type { TtgtdDatabase } from '@/db/database'
import { DatabaseProvider } from '@/db/DatabaseProvider'
import { ChronoPage } from '@/pages/ChronoPage'
import { ConfigurationPage } from '@/pages/ConfigurationPage'
import { ExecutionPage } from '@/pages/ExecutionPage'
import { GenerationPage } from '@/pages/GenerationPage'
import { HomePage } from '@/pages/HomePage'

export function App({ db = appDatabase }: { db?: TtgtdDatabase }) {
  return (
    <ErrorBoundary>
      <DatabaseProvider db={db}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generation" element={<GenerationPage />} />
          <Route path="/chrono" element={<ChronoPage />} />
          <Route path="/execution" element={<ExecutionPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
        </Routes>
      </DatabaseProvider>
    </ErrorBoundary>
  )
}
