import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameApi } from '../services/gameAPI';
import { useNavigate } from 'react-router-dom';

interface GameHistory {
    id: string;
    difficulty: string | { diff_id: number; diff_name: string };
    status: 'won' | 'lost' | 'playing';
    mines: number;
    rows: number;
    cols: number;
    createdAt: string;
    completedAt?: string;
}

export function Profile() {
    const { currentUser, backendUser, loading: authLoading } = useAuth();
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !currentUser) {
            navigate('/login');
            return;
        }

        if (currentUser) {
            loadGameHistory();
        }
    }, [currentUser, authLoading, navigate]);

    const loadGameHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📊 Fetching game history...');
            const history = await gameApi.getGameHistory(10);
            console.log('✅ Game history loaded:', history);
            setGameHistory(history);
        } catch (err: any) {
            console.error('❌ Failed to load game history:', err);
            setError(err.message || 'Failed to load game history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getStatusEmoji = (status: string) => {
        switch (status) {
            case 'won':
                return '🎉';
            case 'lost':
                return '💣';
            case 'playing':
                return '🎮';
            default:
                return '❓';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'won':
                return 'status-won';
            case 'lost':
                return 'status-lost';
            case 'playing':
                return 'status-playing';
            default:
                return '';
        }
    };

    const getDifficultyName = (difficulty: string | { diff_id: number; diff_name: string }): string => {
        if (typeof difficulty === 'string') {
            return difficulty;
        }
        return difficulty.diff_name || 'Unknown';
    };

    const getFilteredGames = () => {
        if (activeTab === 'all') {
            return gameHistory;
        }
        return gameHistory.filter(game => {
            const diffName = getDifficultyName(game.difficulty).toLowerCase();
            return diffName === activeTab;
        });
    };

    const filteredGames = getFilteredGames();

    const getStatsForGames = (games: GameHistory[]) => {
        const completed = games.filter(g => g.status !== 'playing');
        const won = games.filter(g => g.status === 'won').length;
        const lost = games.filter(g => g.status === 'lost').length;
        const winRate = completed.length > 0 ? Math.round((won / completed.length) * 100) : 0;

        return { total: games.length, won, lost, winRate };
    };

    if (authLoading || loading) {
        return (
            <div className="profile-page">
                <h1>Profile</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <h1>Profile</h1>
                <div className="error-message">
                    {error}
                    {error.includes('Failed to fetch') && (
                        <p style={{ marginTop: '10px', fontSize: '14px' }}>
                            The game history endpoint may not be available on your backend yet.
                            Make sure your backend has a GET /games/history endpoint.
                        </p>
                    )}
                </div>
                <button onClick={loadGameHistory}>Retry</button>
                <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Back to Menu</button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h1>Player Profile</h1>

            <div className="profile-info">
                <h2>Account Information</h2>
                <p><strong>Email:</strong> {backendUser?.email || currentUser?.email}</p>
                <p><strong>Username:</strong> {backendUser?.username || 'N/A'}</p>
                <p><strong>Member since:</strong> {backendUser?.created_at ? formatDate(backendUser.created_at) : 'N/A'}</p>
            </div>

            <div className="game-history">
                <h2>Game History</h2>

                {gameHistory.length === 0 ? (
                    <p className="no-games">No games played yet. <a href="/game">Start playing!</a></p>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="history-tabs">
                            <button
                                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All Games
                            </button>
                            <button
                                className={`tab ${activeTab === 'easy' ? 'active' : ''}`}
                                onClick={() => setActiveTab('easy')}
                            >
                                Easy
                            </button>
                            <button
                                className={`tab ${activeTab === 'medium' ? 'active' : ''}`}
                                onClick={() => setActiveTab('medium')}
                            >
                                Medium
                            </button>
                            <button
                                className={`tab ${activeTab === 'hard' ? 'active' : ''}`}
                                onClick={() => setActiveTab('hard')}
                            >
                                Hard
                            </button>
                        </div>

                        {/* Stats for filtered games */}
                        <div className="stats-summary">
                            <div className="stat">
                                <span className="stat-label">Total Games:</span>
                                <span className="stat-value">{getStatsForGames(filteredGames).total}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Won:</span>
                                <span className="stat-value won">{getStatsForGames(filteredGames).won}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Lost:</span>
                                <span className="stat-value lost">{getStatsForGames(filteredGames).lost}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Win Rate:</span>
                                <span className="stat-value">{getStatsForGames(filteredGames).winRate}%</span>
                            </div>
                        </div>

                        {filteredGames.length === 0 ? (
                            <p className="no-games">No games found for this difficulty.</p>
                        ) : (
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Difficulty</th>
                                        <th>Grid Size</th>
                                        <th>Mines</th>
                                        <th>Started</th>
                                        <th>Completed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGames.map((game) => (
                                        <tr key={game.id} className={getStatusClass(game.status)}>
                                            <td className="status-cell">
                                                <span className="status-emoji">{getStatusEmoji(game.status)}</span>
                                                <span className="status-text">{game.status}</span>
                                            </td>
                                            <td className="difficulty-cell">{getDifficultyName(game.difficulty)}</td>
                                            <td>{game.rows} × {game.cols}</td>
                                            <td>{game.mines}</td>
                                            <td>{formatDate(game.createdAt)}</td>
                                            <td>{game.completedAt ? formatDate(game.completedAt) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>            <div className="profile-actions">
                <button onClick={() => navigate('/game')}>Play Game</button>
                <button onClick={() => navigate('/')}>Back to Menu</button>
            </div>
        </div>
    );
}
