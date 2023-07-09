import React from 'react';
import photoOne from "../images/photos/001.jpg";
import photoTwo from "../images/photos/002.jpg";
import photoThree from "../images/photos/003.jpg";
import photoFour from "../images/photos/005.jpg";
import photoFive from "../images/photos/006.jpg";
import photoSix from "../images/photos/007.jpg";

const HeadShotGallery = () => {
    return (
        <React.Fragment>
            <div className="padding-top">
                {/*  display a grid of images, on mobile they will be 2 columns, on desktop 3  */}
                <div className="headshot-image-grid">
                    <img className="media-image" src={photoTwo} alt="headshot_01" />
                    <img className="media-image" src={photoThree} alt="headshot_02" />
                    <img className="media-image" src={photoOne} alt="headshot_03" />
                    <img className="media-image" src={photoSix} alt="headshot_06" />
                    <img className="media-image" src={photoFive} alt="headshot_05" />
                    <img className="media-image" src={photoFour} alt="headshot_04" />
                </div>
            </div>
        </React.Fragment>
    );
}

export default HeadShotGallery;
