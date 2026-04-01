import { auth } from '../firebase/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Cell {
    isMine: boolean;
    adjacentMines: number;
}

export interface GameState {
    gameId: string;
    status: 'playing' | 'won' | 'lost';
    rows: number;
    cols: number;
    mines: number;
    board: (Cell | null)[][];
    flagged: boolean[][];
    remainingMines: number;
}

export interface DifficultyConfig {
    name: string;
    rows: number;
    cols: number;
    mines: number;
}

class GameApiService {
    private async getAuthHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken();
            headers['Authorization'] = `Bearer ${idToken}`;
        }

        return headers;
    }

    async getDifficulties(): Promise<Record<string, DifficultyConfig>> {
        const response = await fetch(`${API_BASE_URL}/games/difficulties`);
        if (!response.ok) {
            throw new Error('Failed to fetch difficulties');
        }
        return response.json();
    }

    async createGame(
        difficulty: string,
        firstClickRow: number,
        firstClickCol: number
    ): Promise<{ gameId: string; visibleBoard: (Cell | null)[][] }> {
        console.log('📡 Creating game with:', { difficulty, firstClickRow, firstClickCol });

        const headers = await this.getAuthHeaders();
        console.log('📡 Using Firebase ID token for auth');

        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                difficulty,
                firstClickRow,
                firstClickCol,
            }),
        });

        console.log('📡 Create game response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Create game failed:', error);
            throw new Error(error.error || 'Failed to create game');
        }

        const gameData = await response.json();
        console.log('✅ Game created successfully:', gameData);
        return gameData;
    }

    async revealCell(
        gameId: string,
        row: number,
        col: number
    ): Promise<{ status: string; visibleBoard: (Cell | null)[][]; remainingMines: number }> {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/games/reveal`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                gameId,
                row,
                col,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to reveal cell');
        }

        return response.json();
    }

    async toggleFlag(
        gameId: string,
        row: number,
        col: number
    ): Promise<{ flagged: boolean[][]; remainingMines: number }> {
        const response = await fetch(`${API_BASE_URL}/games/flag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gameId,
                row,
                col,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to toggle flag');
        }

        return response.json();
    }

    async getGameHistory(limit: number = 10) {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/games/history?limit=${limit}`, {
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch game history');
        }

        return response.json();
    }

    async getLeaderboard(difficulty?: string) {
        const url = difficulty
            ? `${API_BASE_URL}/games/leaderboard?difficulty=${difficulty}`
            : `${API_BASE_URL}/games/leaderboard`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }

        return response.json();
    }
}

export const gameApi = new GameApiService();