import React, { useState, useEffect } from 'react';
import apiClient from './apiClient';
import Login from "./Login";
import useCheckLogin from './useCheckLogin';

function Stock() {
    const [mediaItems, setMediaItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    const isLoggedIn = useCheckLogin();

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
        <div>
            {mediaItems.map((media) => (
                <div key={media.id}>
                    <img src={media.imageUrl} alt={media.title} />
                    <button onClick={() => handleFavourite(media.id, media.favourite)}>
                        {media.favourite ? 'Unfavourite' : 'Favourite'}
                    </button>
                    <button onClick={() => window.location.href='/licence_quote'}>Request License Quote</button>
                </div>
            ))}
        </div>
    );
}

export default Stock;
