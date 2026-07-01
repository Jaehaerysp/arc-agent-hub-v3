import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { WalletProvider } from './providers/WalletProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { ToastProvider } from '../hooks/useToast'
import AppLayout from './layout/AppLayout'

const LandingPage = lazy(() => import('../features/landing/LandingPage'))
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const AgentsPage = lazy(() => import('../features/agents/AgentsPage'))
const ReputationPage = lazy(() => import('../features/reputation/ReputationPage'))
const ValidationPage = lazy(() => import('../features/validation/ValidationPage'))
const TransferPage = lazy(() => import('../features/transfer/TransferPage'))
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'))
const DeveloperToolsPage = lazy(() => import('../features/developer-tools/DeveloperToolsPage'))

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={null}>
                    <LandingPage />
                  </Suspense>
                }
              />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/reputation" element={<ReputationPage />} />
                <Route path="/validation" element={<ValidationPage />} />
                <Route path="/transfer" element={<TransferPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/developer-tools" element={<DeveloperToolsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
