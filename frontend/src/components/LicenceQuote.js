import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import apiClient from './apiClient';
import Login from "./Login";
import useCheckLogin from './useCheckLogin';

const LicenceQuote = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [favourites, setFavourites] = useState([]);
    const [selectedFavourites, setSelectedFavourites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [justLoggedIn, setJustLoggedIn] = useState(false);
    const isLoggedIn = useCheckLogin();

    useEffect(() => {
        apiClient.get('/favourites/')
            .then(res => {
                const formattedFavs = res.data.map(fav => ({
                    value: fav.id,
                    label: fav.title
                }));
                setFavourites(formattedFavs);
                setIsLoading(false);
            })
    }, []);

    const handleSelectChange = (selectedOptions) => {
        setSelectedFavourites(selectedOptions || []);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const quote = {
            name,
            email,
            phone_number: phoneNumber,
            media: selectedFavourites.map(fav => fav.value),
            message,
        };

        apiClient.post('/licence_quotes/', quote)
            .then((res) => {
                alert("Your enquiry has been submitted!");
                setName('');
                setEmail('');
                setPhoneNumber('');
                setMessage('');
            });
    }

    if (!isLoggedIn && !justLoggedIn) {
        return <Login onSuccess={() => setJustLoggedIn(true)} />;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="padded-container">
                <h1>Licence Quote Form</h1>
                <h3>Please select which of your favourites to include in the licence.</h3>
                <div className="form-container">
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Favourites</h3>
                                <Select
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    isMulti
                                    options={favourites}
                                    onChange={handleSelectChange}
                                />

                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Name</h3>
                                <input className="form-input" type="text"
                                       onChange={e => setName(e.target.value)}
                                       placeholder="Name"
                                       value={name} />
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Email</h3>
                                <input className="form-input" type="email"
                                       onChange={e => setEmail(e.target.value)}
                                       placeholder="Email"
                                       value={email} />
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Phone Number</h3>
                                <input className="form-input" type="text"
                                       onChange={e => setPhoneNumber(e.target.value)}
                                       placeholder="Phone Number"
                                       value={phoneNumber} />
                            </div>
                        </div>
                    </div>
                    <div className="form-row pegged-center">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Message</h3>
                                <textarea className="disableResize form-input message-box"
                                          onChange={e => setMessage(e.target.value)}
                                          placeholder="Message" value={message}>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className="form-row pegged-right">
                        <div className="form-group">
                            <button className="form-button" type="submit">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}

export default LicenceQuote;
