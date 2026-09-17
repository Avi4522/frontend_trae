import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { AppShell } from './components/common/AppShell'
import { useCurrentUser } from './hooks/useCurrentUser'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import InvestigationsListPage from './pages/InvestigationsListPage'
import InvestigationDetailPage from './pages/InvestigationDetailPage'
import WalletsPage from './pages/WalletsPage'
import ReportsListPage from './pages/ReportsListPage'
import ReportPreviewPage from './pages/ReportPreviewPage'
import SettingsPage from './pages/SettingsPage'
import NotFound from './pages/NotFound'

function ProtectedLayout() {
  const { isAuthenticated } = useCurrentUser()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <AppShell />
}

function RootRedirect() {
  const { isAuthenticated } = useCurrentUser()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/landing'} replace />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/investigations" element={<InvestigationsListPage />} />
        <Route
          path="/investigations/:id"
          element={<InvestigationDetailPage />}
        />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/reports" element={<ReportsListPage />} />
        <Route path="/reports/:id" element={<ReportPreviewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>,
  ),
)

export default function App() {
  return <RouterProvider router={router} />
}
