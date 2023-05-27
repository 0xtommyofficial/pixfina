import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../images/PixfinaLogoP.svg'
import React from "react";
function Header() {
    return (
        <header>
            <nav>
                <div className="padded-top-left">
                    <Link to="/">
                        <Logo height={"75px"} width={"75px"}/>
                    </Link>
                </div>
                <div className="padding-right">
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                    <Link to="/signup">
                        <button>Sign Up</button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;