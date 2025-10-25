import "../css/banner.css";

export const Banner = ({ side }: { side: string }) => {
    return (
        <div className={`${side}`}>
            <div className="animatedMinePatches"></div>
        </div>

    )
}