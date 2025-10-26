import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './css/App.css'
import { Minesweeper } from './components/Minesweeper.tsx'
import { Menu } from './components/Menu.tsx'
import './css/minesweeper.css'
import { Banner } from './components/Banner.tsx'
// import { Login } from './components/Login'
// import { Signup } from './components/Signup'
// import { AuthProvider, useAuth } from './context/AuthContext'
import { useGameOver } from './hooks/useGameOver.tsx'

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
  // useGameOver returns [gameOver, triggerGameOver, resetGameOver]
  // we need the second item (the function) to pass into Minesweeper
  const [, triggerGameOver] = useGameOver();

  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}
      <Route path="/" element={<GameContent />} />
      <Route path="/game" element={<Minesweeper rows={10} columns={10} numberOfMines={5} triggerGameOver={triggerGameOver} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
      <AppContent />
      {/* </AuthProvider> */}
    </Router>
  )
}

export default App
