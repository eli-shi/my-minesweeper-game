import { useState } from 'react'
import './css/App.css'
import { Minesweeper } from './components/Minesweeper.tsx'
import { Menu } from './components/Menu.tsx'
import './css/minesweeper.css'
import { Banner } from './components/Banner.tsx'

function App() {
  const [gameOver, setGameOver] = useState(true)


  return (
    <div>

      {gameOver ? (
        <div className="menu">
          {/* <div className="rightBanner"></div> */}
          <Banner side="rightBanner"></Banner>
          <Menu resetGameOver={() => setGameOver(false)} />
          <Banner side="leftBanner"></Banner>
          {/* <div className="leftBanner"></div> */}
        </div>
      ) : (
        <div className="minesweeper">
          <Minesweeper rows={10} columns={10} numberOfMines={5} triggerGameOver={() => setGameOver(true)} />
        </div>
      )}

    </div>
  )
}

export default App
