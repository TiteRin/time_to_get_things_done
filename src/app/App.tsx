import { Route, Routes } from 'react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { appDatabase } from '@/db/appDatabase'
import type { TtgtdDatabase } from '@/db/database'
import { DatabaseProvider } from '@/db/DatabaseProvider'
import { ConfigurationPage } from '@/pages/ConfigurationPage'
import { ExecutionPage } from '@/pages/ExecutionPage'
import { GenerationPage } from '@/pages/GenerationPage'

export function App({ db = appDatabase }: { db?: TtgtdDatabase }) {
  return (
    <ErrorBoundary>
      <DatabaseProvider db={db}>
        <Routes>
          <Route path="/" element={<GenerationPage />} />
          <Route path="/execution" element={<ExecutionPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
        </Routes>
      </DatabaseProvider>
    </ErrorBoundary>
  )
}
