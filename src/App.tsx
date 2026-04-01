import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './css/App.css'
import { MinesweeperGame } from './components/Game.tsx'
import { Menu } from './components/Menu.tsx'
import { Profile } from './components/Profile.tsx'
import { ForgotPassword } from './components/ForgotPassword.tsx'
import { ResetPassword } from './components/ResetPassword.tsx'
import './css/minesweeper.css'
import './css/profile.css'
import { Banner } from './components/Banner.tsx'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { AuthProvider } from './context/AuthContext'

function GameContent() {

  return (
    <div className="menu">
      <Banner side="rightBanner" />
      <Menu />
      <Banner side="leftBanner" />
    </div>
  )
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<GameContent />} />
      <Route path="/game" element={<MinesweeperGame />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
