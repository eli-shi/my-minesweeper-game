import "./style.css";
import { BoardBlock } from "./BoardBlock";
import type { DefaultBlock } from '../utils/Block.tsx';

export const Board = ({ board, rows, columns, reveal, toggleFlag }: { board: DefaultBlock[][], rows: number, columns: number, reveal: (block: DefaultBlock) => void, toggleFlag: (block: DefaultBlock) => void }) => {


    const boardStyle = {
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`
    };



    return (
        <div className="board" style={boardStyle}>
            {board.map((row) =>
                row.map((block) => (
                    <BoardBlock block={block} reveal={reveal} toggleFlag={toggleFlag} />
                ))
            )}

            {/* add on click */}
        </div>
    );
};