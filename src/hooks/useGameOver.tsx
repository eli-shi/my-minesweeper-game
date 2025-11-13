import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';

export function useGameOver() {
    const [gameOver, setGameOver] = useState(true);
    const navigate = useNavigate();

    const triggerGameOver = useCallback((): void => {
        try {
            setGameOver(true);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Navigation error:", error);
        }
    }, [navigate]);

    // createGame function instead of reset, to store information of the game and send it to storage after triggerGameOver
    const resetGameOver = useCallback(() => {
        try {
            setGameOver(false);
            navigate("/game", { replace: true });
        } catch (error) {
            console.error("Navigation error:", error);
        }
    }, [navigate]);

    return [gameOver, triggerGameOver, resetGameOver] as const;
}

