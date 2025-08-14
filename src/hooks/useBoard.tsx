import { useState, useEffect } from 'react';
import { buildInitialBoard } from '../utils/Board.ts';
import type { DefaultBlock } from '../utils/Block.ts';


export function useBoard({ rows, columns, numberOfMines, triggerGameOver }: { rows: number, columns: number, numberOfMines: number, triggerGameOver: () => void }) {

    const [board, setBoard] = useState(buildInitialBoard(rows, columns, numberOfMines));

    function revealBlock(block: DefaultBlock) {

        if (block.blockStatus === "revealed" || block.blockStatus === "flagged") {
            // If the block is already revealed or flagged, do nothing
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

    function toggleFlag(block: DefaultBlock) {
        if (block.blockStatus === "revealed") {
            // Cannot flag a revealed block
            return;
        }

        if (block.blockStatus === "flagged") {
            block.blockStatus = "unrevealed"; // Unflag the block
        } else {
            block.blockStatus = "flagged"; // Flag the block
        }

        const newBoard: DefaultBlock[][] = [...board];
        setBoard(newBoard); // Update the board state
        console.log("Block flagged/unflagged:", block);
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
    }, [board, rows, columns, numberOfMines, triggerGameOver]);
    {/* should be callback or useEffect so that it can reset the board whenever a new block is reveal, aka when the block.status changes */ }


    return [board, revealBlock, toggleFlag] as const;
}
