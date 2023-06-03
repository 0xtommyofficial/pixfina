import React from 'react';
// import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';
import { ReactComponent as Logo } from '../images/PixfinaLogo.svg'
import {Link} from "react-router-dom";

function Main() {
    // if user is already logged in, redirect to landing page
    // useRedirectIfLoggedIn();

    return (
        <React.Fragment>
            <div className="centered-column half-rem-line-height">
                <div className="padded-top">
                    <Logo style={{height: "25vmax", width: "25vmax"}}/>
                </div>
                <h1>Photography and Video</h1>
                <h2>Headshots | Editorial | Stock</h2>
                <nav>
                    <div className="padding-top gapped-column" >
                        <Link to="/HeadshotBooking">
                            <button>Headshots</button>
                        </Link>
                        <Link to="/EditorialBooking">
                            <button>Editorial</button>
                        </Link>
                        <Link to="/Stock">
                            <button>Stock</button>
                        </Link>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    );
}
export default Main;
