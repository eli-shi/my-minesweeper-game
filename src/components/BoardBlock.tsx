import type { DefaultBlock } from "../utils/Block";


export const BoardBlock = ({ block, reveal, toggleFlag }: { block: DefaultBlock, reveal: (block: DefaultBlock) => void, toggleFlag: (block: DefaultBlock) => void }) => {
    return (
        <div
            className={`boardBlock ${block.blockStatus}`}
            data-value={`${block.className}`}
            onClick={() => {
                //if clicked check if flagging is true, if so, set block to flagged
                //if not, check if the block is flagged, if not, reveal the block, if yes, alert user that they cannot reveal a flagged block
                if (block.blockStatus === "flagged") {
                    alert("Cannot reveal a flagged block! Right-click to unflag first.");
                    return;
                }
                console.log("clicked");
                console.log(block.className);
                reveal(block);
            }}
            onContextMenu={(e) => {
                e.preventDefault(); // Prevent the browser context menu
                console.log("right clicked - toggling flag");
                toggleFlag(block);
            }}>
            {block.blockStatus === "flagged" ? (
                <p>🚩</p>
            ) : (block.blockStatus === "revealed" && block.className !== "empty") ? (
                <p>{block.className}</p>
            ) : null}
        </div>
    );
};