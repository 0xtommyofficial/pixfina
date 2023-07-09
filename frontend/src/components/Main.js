import React from 'react';
import { ReactComponent as Logo } from '../images/PixfinaLogo.svg'
import { Link } from "react-router-dom";
import placeholderImage from '../images/1080x1080.png';
import photoOne from '../images/photos/002.jpg';
import photoTwo from '../images/photos/008.jpg';
import photoThree from '../images/photos/Bike_Insta.jpg';

function Main() {
    return (
        <React.Fragment>
            <div className="centered-column half-rem-line-height">
                <div className="padded-top">
                    <Logo className="logo"/>
                </div>
                <h1>Photography and Video</h1>
                <nav>
                    <div className="padding-top link-row">
                        <Link to="/HeadshotBooking" className="link-item">
                            <img src={photoOne} alt="Headshots" className="preview-image"/>
                            <button>Headshots</button>
                        </Link>
                        <Link to="/EditorialBooking" className="link-item">
                            <img src={photoTwo} alt="Editorial" className="preview-image"/>
                            <button>Editorial</button>
                        </Link>
                        <Link to="/Stock" className="link-item">
                            <img src={photoThree} alt="Stock" className="preview-image"/>
                            <button>Stock</button>
                        </Link>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    );
}

export default Main;
