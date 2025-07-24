import { useState, useEffect } from 'react';
import { buildInitialBoard } from '../utils/Board.ts';
import type { DefaultBlock } from '../utils/Block.ts';


export function useBoard({ rows, columns, numberOfMines, triggerGameOver }: { rows: number, columns: number, numberOfMines: number, triggerGameOver: () => void }) {

    const [board, setBoard] = useState(buildInitialBoard(rows, columns, numberOfMines));

    function revealBlock(block: DefaultBlock) {

        if (block.blockStatus === "revealed") {
            // If the block is already revealed, do nothing
            return;
        }

        console.log(block);

        if (block.className == "bomb") {
            block.blockStatus = "revealed"; // Mark the bomb as revealed
            const newBoard: DefaultBlock[][] = [...board];
            setBoard(newBoard); // Update the board state
            triggerGameOver(); // Trigger game over
        } else {
            block.blockStatus = "revealed"; // Mark the block as revealed
            const newBoard: DefaultBlock[][] = [...board];
            setBoard(newBoard); // Update the board state
        }


    }

    useEffect(() => {
        const revealed = board.reduce((acc: number, row: DefaultBlock[]) => {
            acc += row.reduce((acc2: number, block: DefaultBlock) => {
                acc2 += (block.blockStatus === "revealed") ? 1 : 0;
                return acc2;
            }, 0);
            return acc;
        }, 0);

        if (revealed === rows * columns - numberOfMines) {
            alert("You won!");
            triggerGameOver();
        }
    }, [board]);
    {/* should be callback or useEffect so that it can reset the board whenever a new block is reveal, aka when the block.status changes */ }


    return [board, revealBlock] as const;
}
