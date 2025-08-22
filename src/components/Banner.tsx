// import minePatch from "../assets/minePatch.png";
// import mine from "../assets/mine.png";
import "../css/banner.css";

export const Banner = ({ side }: { side: string }) => {
    // const tiles = [minePatch, mine]
    return (
        <div className={`${side}`}>
            <div className="animatedMinePatches">

            </div>
        </div>

    )
}