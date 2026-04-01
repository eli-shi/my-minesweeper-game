import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaderboard } from "./Leaderboard";
import "../css/leaderboard.css";

export const Menu = () => {
    const { backendUser, currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <h1>Minesweeper</h1>

            <Link to="/game">Play</Link>

            {loading ? (
                <span>Loading...</span>
            ) : currentUser ? (
                <>
                    <Link to="/profile">Profile</Link>
                    <span>Welcome, {backendUser?.email || currentUser.email}!</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Register</Link>
                </>
            )}

            <Leaderboard />
        </div>
    );
};