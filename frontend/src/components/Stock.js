import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './apiClient';
import Login from "./Login";
import useCheckLogin from './useCheckLogin';

function Stock() {
    const navigate = useNavigate();
    const [mediaItems, setMediaItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [justLoggedIn, setJustLoggedIn] = useState(false);
    const isLoggedIn = useCheckLogin();
    const renderMedia = (media) => {
        if (media.media_type === 'P' && media.preview_image) {
            return <img className="media-image" src={media.preview_image} alt={media.title} />;
        } else if (media.media_type === 'V' && media.video_url) {
            return <iframe className="media-video" src={media.video_url} title={media.title} />;
        }
        return null;
    };

    useEffect(() => {
        if (isLoggedIn || justLoggedIn) {
            apiClient.get('/stock_media/')
                .then(response => {
                    setMediaItems(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setIsLoading(false);
                });
        }
    }, [isLoggedIn, justLoggedIn]);

    const handleFavourite = (mediaId, isFavourite) => {
        const method = isFavourite ? 'delete' : 'post';
        apiClient[method](`/favourite_media/${mediaId}/`)
            .then(response => {
                console.log(response);
                // update the state to reflect the new favourite status
                setMediaItems(mediaItems.map(item =>
                    item.id === mediaId ? { ...item, favourite: !isFavourite } : item
                ));
            })
            .catch(error => {
                console.error(error);
                // handle failed submission here
            });
    };

    if (!isLoggedIn && !justLoggedIn) {
        return <Login onSuccess={() => setJustLoggedIn(true)} />;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="media-container">
            {mediaItems.map((media) => (
                <div key={media.id} className="media-card">
                    {renderMedia(media)}
                    <div className="media-info">
                        <h3 className="media-title">{media.title}</h3>
                        <button className="media-button" onClick={() => handleFavourite(media.id, media.favourite)}>
                            {media.favourite ? 'Unfavourite' : 'Favourite'}
                        </button>
                    </div>
                </div>
            ))}
            <button className="media-button" onClick={() => navigate('/LicenceQuote')}>
                Request License Quote
            </button>
        </div>
    );
}

export default Stock;
