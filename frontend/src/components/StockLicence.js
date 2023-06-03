import React, { useState, useEffect } from 'react';
import apiClient from './apiClient';

function StockLicense() {
    const [favourites, setFavourites] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/favourites/')
            .then(response => {
                setFavourites(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const handleSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.options)
            .filter(option => option.selected)
            .map(option => option.value);
        setSelectedMedia(selectedOptions);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        apiClient.post('/licence_quote/', {
            media: selectedMedia,
            message
        })
            .then(response => {
                console.log(response);
                // handle successful submission here
            })
            .catch(error => {
                console.error(error);
                // handle failed submission here
            });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (favourites.length === 0) {
        return <div>You have no favourites. Please add some before submitting a licence request.</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <select multiple={true} value={selectedMedia} onChange={handleSelectChange}>
                {favourites.map((media) => (
                    <option key={media.id} value={media.id}>
                        {media.title}
                    </option>
                ))}
            </select>
            <textarea value={message} onChange={e => setMessage(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    );
}

export default StockLicense;
