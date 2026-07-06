import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { WalletProvider } from './providers/WalletProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { ToastProvider } from '../hooks/useToast'
import AppLayout from './layout/AppLayout'

const LandingPage = lazy(() => import('../features/landing/LandingPage'))
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const AgentsPage = lazy(() => import('../features/agents/AgentsPage'))
const AgentProfilePage = lazy(() => import('../features/agents/AgentProfilePage'))
const TrustCenterPage = lazy(() => import('../features/trust/TrustCenterPage'))
const WalletPage = lazy(() => import('../features/wallet/WalletPage'))
const TransferPage = lazy(() => import('../features/transfer/TransferPage'))
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'))
const DeveloperToolsPage = lazy(() => import('../features/developer-tools/DeveloperToolsPage'))
const JobsPage = lazy(() => import('../features/jobs/JobsPage'))
const CreateJobPage = lazy(() => import('../features/jobs/CreateJobPage'))
const JobHistoryPage = lazy(() => import('../features/jobs/JobHistoryPage'))
const JobDetailPage = lazy(() => import('../features/jobs/JobDetailPage'))

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
                <Route path="/agents/:wallet" element={<AgentProfilePage />} />
                <Route path="/trust" element={<TrustCenterPage />} />
                <Route path="/reputation" element={<Navigate to="/trust" replace />} />
                <Route path="/validation" element={<Navigate to="/trust" replace />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/transfer" element={<TransferPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/create" element={<CreateJobPage />} />
                <Route path="/jobs/history" element={<JobHistoryPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
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
