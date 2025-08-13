import { useBoard } from '../hooks/useBoard.tsx';
import { BoardBlock } from './BoardBlock.tsx';
import "../css/App.css";




export const Minesweeper = ({ rows, columns, numberOfMines, triggerGameOver }: { rows: number, columns: number, numberOfMines: number, triggerGameOver: () => void }) => {
    const [board, revealBlock, toggleFlag] = useBoard({ rows, columns, numberOfMines, triggerGameOver });

    console.log("Minesweeper component");
    console.log(rows);
    console.log(columns);
    console.log(numberOfMines);

    const boardStyle = {
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`
    };


    return (
        <div className="board-wrapper">
            <div className="board" style={boardStyle}>
                {board.map((row: any[]) =>
                    row.map((block, x) => (
                        <BoardBlock
                            key={x * Math.random()}
                            block={block}
                            reveal={(block) => revealBlock(block)}
                            toggleFlag={(block) => toggleFlag(block)}
                        />
                    ))
                )}
                {/* add on click */}
            </div>
        </div>
    );
};