import type { DefaultBlock } from './Block';
import { BlockClassName, BlockStatus } from './Block';

const buildEmptyBoard = ({ rows, columns }: { rows: number, columns: number }) => {
    const tempBlock: DefaultBlock = {
        className: "empty" as keyof typeof BlockClassName,
        blockStatus: "unrevealed" as keyof typeof BlockStatus,
    };

    const emptyBoard: DefaultBlock[][] = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({
            ...tempBlock
        }))
    );

    return emptyBoard;
};


const placeBombs = (board: DefaultBlock[][], numberOfMines: number) => {
    const rows = board.length;
    const columns = board[0].length;
    let currentNumOfMines = 0;

    while (currentNumOfMines < numberOfMines) {
        const row = Math.floor(Math.random() * rows);
        const column = Math.floor(Math.random() * columns);

        if (board[row][column].className === "empty") {
            board[row][column].className = "bomb";
            currentNumOfMines++;
        }
    }
    return board;
};

const numberBoard = (board: DefaultBlock[][]) => {
    const rows = board.length;
    const columns = board[0].length;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (board[row][column].className === "bomb") {
                continue;
            }

            let bombCount = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newColumn = column + j;

                    if (
                        newRow >= 0 &&
                        newRow < rows &&
                        newColumn >= 0 &&
                        newColumn < columns &&
                        board[newRow][newColumn].className === "bomb"
                    ) {
                        bombCount++;
                    }
                }
            }

            if (bombCount > 0) {
                board[row][column].className = bombCount as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
            } else {
                board[row][column].className = "empty";
            }
        }
    }
    return board;
};

const buildInitialBoard = (rows: number, columns: number, numberOfMines: number) => {
    const emptyBoard = buildEmptyBoard({ rows, columns });
    const bombBoard = placeBombs(emptyBoard, numberOfMines);
    const numberedBoard = numberBoard(bombBoard);
    return numberedBoard;
};

{/* function that reveals blocks*/ }

export { buildInitialBoard, placeBombs, numberBoard, buildEmptyBoard };