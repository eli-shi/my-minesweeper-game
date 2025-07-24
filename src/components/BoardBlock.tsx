import type { DefaultBlock } from "../utils/Block";


export const BoardBlock = ({ block, reveal }: { block: DefaultBlock, reveal: (block: DefaultBlock) => void }) => {
    return (
        <div
            className={`boardBlock ${block.blockStatus}`}
            data-value={`${block.className}`}
            onClick={() => {
                console.log("clicked");
                console.log(block.className);
                reveal(block);
            }}>
            {(block.blockStatus === "revealed" && block.className !== "empty") ? <p>{block.className}</p> : null}
        </div>
    );
};