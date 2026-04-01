import type { Cell } from "../services/gameAPI";

interface GameBoardProps {
    board: (Cell | null)[][];
    flagged: boolean[][];
    onCellClick: (row: number, col: number, isRightClick: boolean) => void;
    status: string;
}

export function GameBoard({ board, flagged, onCellClick, status }: GameBoardProps) {
    const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        if (status === 'playing') {
            onCellClick(row, col, true);
        }
    };

    if (!board || board.length === 0) {
        return <div>Loading board...</div>;
    }

    const cols = board[0]?.length || 0;

    return (
        <div
            className="game-board"
            style={{
                gridTemplateColumns: `repeat(${cols}, 40px)`,
            }}
        >
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => {
                        const isRevealed = cell !== null;
                        const isFlagged = flagged?.[rowIndex]?.[colIndex] || false;
                        const isMine = cell?.isMine || false;
                        const adjacentMines = cell?.adjacentMines || 0;

                        let cellContent = '';
                        let cellClass = 'cell';

                        if (isFlagged) {
                            cellClass += ' flagged';
                            cellContent = '🚩';
                        } else if (isRevealed && cell) {
                            cellClass += ' revealed';
                            if (isMine) {
                                cellClass += ' mine';
                                cellContent = '💣';
                            } else if (adjacentMines > 0) {
                                cellContent = adjacentMines.toString();
                            }
                        }

                        return (
                            <div
                                key={colIndex}
                                className={cellClass}
                                data-value={isRevealed && !isMine && cell ? adjacentMines : undefined}
                                onClick={() => !isFlagged && !isRevealed && onCellClick(rowIndex, colIndex, false)}
                                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                            >
                                {cellContent}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}