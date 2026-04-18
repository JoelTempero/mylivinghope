import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'

// Layout
import AppLayout from './components/layout/AppLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// App pages
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Tasks from './pages/Tasks'
import Contacts from './pages/Contacts'
import Campaigns from './pages/Campaigns'
import Artists from './pages/Artists'
import CardDesign from './pages/CardDesign'
import Brainstorm from './pages/Brainstorm'
import Inspiration from './pages/Inspiration'
import BusinessChecklist from './pages/BusinessChecklist'
import TeamManagement from './pages/TeamManagement'
import Settings from './pages/Settings'
import Claude from './pages/Claude'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/card-design" element={<CardDesign />} />
            <Route path="/brainstorm" element={<Brainstorm />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/checklist" element={<BusinessChecklist />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/claude" element={<Claude />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
