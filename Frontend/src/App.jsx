import { Routes, Route } from 'react-router-dom'
import OwnerDashboard from './pages/OwnerDashboard'
import MembersPage from './pages/MembersPage'
import ChecklistPage from './pages/ChecklistPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import AnalyticsPage from './pages/Analytics'
import NewEventPage from './pages/NewEventPage'
import LandingPage from './pages/LandingPage'
import TripMain from './pages/TripMain'

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <OwnerDashboard/> : <LandingPage />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />
      <Route path="/trip/:id" element={<TripMain />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/checklists" element={<ChecklistPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/new-event" element={<NewEventPage />} />
    </Routes>
  )
}

export default App 