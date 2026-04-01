import { useState, useEffect } from 'react';
import { gameApi } from '../services/gameAPI';

interface LeaderboardEntry {
    username: string;
    email: string;
    winRate: number;
    gamesPlayed: number;
    wins: number;
}

export function Leaderboard() {
    const [easyLeaders, setEasyLeaders] = useState<LeaderboardEntry[]>([]);
    const [mediumLeaders, setMediumLeaders] = useState<LeaderboardEntry[]>([]);
    const [hardLeaders, setHardLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadLeaderboards();
    }, []);

    const loadLeaderboards = async () => {
        try {
            setLoading(true);
            setError(null);

            const [easy, medium, hard] = await Promise.all([
                gameApi.getLeaderboard('easy'),
                gameApi.getLeaderboard('medium'),
                gameApi.getLeaderboard('hard'),
            ]);

            setEasyLeaders(easy.slice(0, 5));
            setMediumLeaders(medium.slice(0, 5));
            setHardLeaders(hard.slice(0, 5));
        } catch (err: any) {
            console.error('Failed to load leaderboards:', err);
            setError(err.message || 'Failed to load leaderboards');
        } finally {
            setLoading(false);
        }
    };

    const renderLeaderboardTable = (title: string, leaders: LeaderboardEntry[], color: string) => (
        <div className="leaderboard-section">
            <h3 style={{ color }}>{title}</h3>
            {leaders.length === 0 ? (
                <p className="no-data">No players yet</p>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Win Rate</th>
                            <th>Games</th>
                            <th>Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((player, index) => (
                            <tr key={player.email} className={index === 0 ? 'first-place' : ''}>
                                <td className="rank">
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                    {index > 2 && (index + 1)}
                                </td>
                                <td className="player-name">
                                    {player.username || player.email.split('@')[0]}
                                </td>
                                <td className="win-rate">{player.winRate.toFixed(1)}%</td>
                                <td>{player.gamesPlayed}</td>
                                <td>{player.wins}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="leaderboard-container">
                <h2>🏆 Top Players</h2>
                <p>Loading leaderboards...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container">
                <h2>🏆 Top Players</h2>
                <p className="error-text" style={{ fontSize: '14px', color: '#666' }}>
                    Leaderboards not available
                </p>
            </div>
        );
    }

    return (
        <div className="leaderboard-container">
            <h2>🏆 Top Players</h2>
            <div className="leaderboard-grid">
                {renderLeaderboardTable('Easy', easyLeaders, '#4caf50')}
                {renderLeaderboardTable('Medium', mediumLeaders, '#ff9800')}
                {renderLeaderboardTable('Hard', hardLeaders, '#f44336')}
            </div>
        </div>
    );
}
