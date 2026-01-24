import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Schedule from './pages/Schedule/Schedule'
import ScheduleDetail from './pages/ScheduleDetail/ScheduleDetail'
import Study from './pages/Study/Study'
import FAQ from './pages/FAQ/FAQ'
import Profile from './pages/Profile/Profile'

function App() {
  return (
    <Layout>
      <Routes>
        {/* Публичные маршруты (доступны без авторизации) */}
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/schedule/:type/:id" element={<ScheduleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        
        {/* Защищенные маршруты (требуют авторизации) */}
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <Study />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Редирект на главную для неизвестных маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
