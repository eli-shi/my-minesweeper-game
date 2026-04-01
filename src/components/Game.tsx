import { useState, useEffect } from 'react';
import { gameApi, type GameState } from '../services/gameAPI';
import { GameBoard } from './GameBoard';

type Difficulty = 'easy' | 'medium' | 'hard';

export function MinesweeperGame() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [difficulties, setDifficulties] = useState<Record<string, any>>({});
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [, setPendingClick] = useState<{ row: number; col: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        gameApi.getDifficulties()
            .then(setDifficulties)
            .catch(err => setError(err.message));
    }, []);

    useEffect(() => {
        const savedGameId = localStorage.getItem('currentGameId');
        if (savedGameId) {
            setGameId(savedGameId);
            setIsFirstClick(false);
        }
    }, []);

    useEffect(() => {
        if (gameId) {
            localStorage.setItem('currentGameId', gameId);
        }
    }, [gameId]);

    const handleCellClick = async (row: number, col: number, isRightClick: boolean = false) => {
        console.log('🎯 Cell clicked:', { row, col, isRightClick, isFirstClick, hasGameState: !!gameState });

        if (loading) return;

        if (isFirstClick || !gameState) {
            if (isRightClick) return;

            setPendingClick({ row, col });
            setLoading(true);
            setError(null);

            try {
                console.log('🎮 Creating new game...');
                const response = await gameApi.createGame(difficulty, row, col);
                console.log('✅ Game created:', response);

                setGameId(response.gameId);

                const config = difficulties[difficulty];
                setGameState({
                    gameId: response.gameId,
                    status: 'playing',
                    rows: config.rows,
                    cols: config.cols,
                    mines: config.mines,
                    board: response.visibleBoard,
                    flagged: Array(config.rows).fill(null).map(() => Array(config.cols).fill(false)),
                    remainingMines: config.mines,
                });

                setIsFirstClick(false);
                setPendingClick(null);
            } catch (err: any) {
                console.error('❌ Failed to create game:', err);
                setError(err.message);
                setPendingClick(null);
            } finally {
                setLoading(false);
            }
            return;
        }

        if (gameState.status !== 'playing') return;

        if (isRightClick) {
            setLoading(true);
            setError(null);

            try {
                const result = await gameApi.toggleFlag(
                    gameId!,
                    row,
                    col
                );

                setGameState({
                    ...gameState,
                    flagged: result.flagged,
                    remainingMines: result.remainingMines,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        if (gameState.board[row][col] !== null || gameState.flagged[row][col]) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await gameApi.revealCell(
                gameId!,
                row,
                col
            );

            const updatedState: GameState = {
                ...gameState,
                status: result.status as 'playing' | 'won' | 'lost',
                board: result.visibleBoard || gameState.board,
                remainingMines: result.remainingMines,
            };

            setGameState(updatedState);

            if (result.status === 'won' || result.status === 'lost') {
                localStorage.removeItem('currentGameId');


                setTimeout(() => {
                    alert(result.status === 'won' ? 'You won! 🎉' : 'Game Over! 💣');
                }, 100);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startNewGame = () => {
        console.log('🎮 New Game clicked!');
        console.log('Current loading state:', loading);
        console.log('Current gameState:', gameState);
        setGameState(null);
        setGameId(null);
        setIsFirstClick(true);
        setPendingClick(null);
        setError(null);
        localStorage.removeItem('currentGameId');
        localStorage.removeItem('currentGame');
        console.log('✅ New Game state reset complete');
    };

    const changeDifficulty = (newDifficulty: Difficulty) => {
        if (gameState && gameState.status === 'playing') {
            if (!confirm('Start a new game with different difficulty?')) {
                return;
            }
        }
        setDifficulty(newDifficulty);
        startNewGame();
    };

    if (!difficulties[difficulty]) {
        return <div>Loading...</div>;
    }

    const config = difficulties[difficulty];

    return (
        <div className="minesweeper-game">
            <div className="game-controls">
                <select
                    value={difficulty}
                    onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
                    disabled={loading}
                >
                    {Object.keys(difficulties).map(diff => (
                        <option key={diff} value={diff}>
                            {difficulties[diff].name}
                        </option>
                    ))}
                </select>

                <button onClick={startNewGame} disabled={loading}>
                    New Game
                </button>

                {gameState && (
                    <div className="game-info">
                        <span>Mines: {gameState.remainingMines}</span>
                        <span>Status: {gameState.status}</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading">Processing...</div>
            )}

            {gameState ? (
                <GameBoard
                    board={gameState.board}
                    flagged={gameState.flagged}
                    onCellClick={handleCellClick}
                    status={gameState.status}
                />
            ) : (
                <div
                    className="initial-board"
                    style={{
                        gridTemplateColumns: `repeat(${config.cols}, 40px)`,
                    }}
                >
                    {Array.from({ length: config.rows * config.cols }, (_, index) => {
                        const row = Math.floor(index / config.cols);
                        const col = index % config.cols;
                        return (
                            <div
                                key={`${row}-${col}`}
                                className="cell initial"
                                onClick={() => handleCellClick(row, col)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}