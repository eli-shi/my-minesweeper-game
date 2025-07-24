import "./style.css";
import { BoardBlock } from "./BoardBlock";
import type { DefaultBlock } from '../utils/Block.tsx';

export const Board = ({ board, rows, columns, setBoard }: { board: DefaultBlock[][], rows: number, columns: number, setBoard: (block: DefaultBlock) => void }) => {


    const boardStyle = {
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`
    };



    return (
        <div className="board" style={boardStyle}>
            {board.map((row) =>
                row.map((block) => (
                    <BoardBlock block={block} reveal={setBoard} />
                ))
            )}

            {/* add on click */}
        </div>
    );
};