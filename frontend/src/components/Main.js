import React from 'react';
import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';
import { ReactComponent as Logo } from '../images/PixfinaLogo.svg'

function Main() {
    // if user is already logged in, redirect to landing page
    useRedirectIfLoggedIn();

    return (
        <React.Fragment>
            <div className="centered-column half-rem-line-height">
                <div className="padded-top">
                    <Logo height={"25vmax"} width={"25vmax"}/>
                </div>
                <h1>Photography and Video</h1>
                <h2>Headshots | Editorial | Stock</h2>
            </div>
        </React.Fragment>
    );
}
export default Main;
