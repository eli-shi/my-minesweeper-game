import { useState } from 'react';


function useGameOver() {
    const [gameOver, setGameOver] = useState(true);

    function triggerGameOver() {
        console.log("GameOver");
        setGameOver(true);
    }

    function resetGameOver() {
        console.log("resetGameOver");
        setGameOver(false);
    }

    return { gameOver, triggerGameOver, resetGameOver };
}

export { useGameOver };