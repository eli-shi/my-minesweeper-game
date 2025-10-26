import { Link } from "react-router-dom";

export const Menu = () => {

    return (
        <div>
            <h1>Minesweeper</h1>



            {/* <button onClick={() => {
                console.log("game reset button clicked");
                resetGameOver();
            }}>Play</button> */}

            <Link to="/game" >Play</Link>
            {/*play minesweeper, should be play as guest later once authorization/user accounts has been implemented*/}
            <a>Login</a>
            <a>Register</a>


        </div>
    );
};