import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../images/PixfinaLogoP.svg'
import React from "react";
import useCheckLogin from './useCheckLogin';

function Header() {
    const isLoggedIn = useCheckLogin();

    return (
        <header>
            <nav>
                <div className="padding-top padding-left">
                    <Link to="/">
                        <Logo className="header-logo"/>
                    </Link>
                </div>
                <div className="padding-right gapped-row">
                    {!isLoggedIn && (
                        <>
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                            <Link to="/signup">
                                <button>Sign Up</button>
                            </Link>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <Link to="/profile">
                                <button>Profile</button>
                            </Link>
                            <Link to="/logout">
                                <button>Logout</button>
                            </Link>
                        </>
                    )}
                </div>

            </nav>
        </header>
    );
}

export default Header;
