import React from 'react';
import { ReactComponent as Logo } from '../images/PixfinaLogo.svg'
import {Link} from "react-router-dom";
import placeholderImage from '../images/1080x1080.png';

function Main() {

    return (
        <React.Fragment>
            <div className="centered-column half-rem-line-height">
                <div className="padded-top">
                    <Logo className="logo"/>
                </div>
                <h1>Photography and Video</h1>
                <div className="padding-top">
                {/*  display 3 images, in mobile they will be in a column, in desktop a row  */}
                    <div className="main-image-grid">
                        <img className="media-image" src={placeholderImage} alt="headshot" />
                        <img className="media-image" src={placeholderImage} alt="editorial" />
                        <img className="media-image" src={placeholderImage} alt="stock" />
                    </div>
                </div>
                <nav>
                    <div className="padding-top gapped-row" >
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
