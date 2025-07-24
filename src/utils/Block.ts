
export const BlockStatus = {
    unrevealed: "unrevealed",
    revealed: "revealed",
    flagged: "flagged",
    question: "question",
} as const;

export const BlockClassName = {
    bomb: "bomb",
    empty: "empty",
} as const;

type DefaultBlock = {
    blockStatus: keyof typeof BlockStatus,
    className: keyof typeof BlockClassName | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
};

export type { DefaultBlock };