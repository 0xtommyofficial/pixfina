import React, { useState} from 'react';
import apiClient from './apiClient';
import Login from "./Login";
import useCheckLogin from './useCheckLogin';

const EditorialBooking = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mediaType, setMediaType] = useState('P');
    const [message, setMessage] = useState('');
    const [justLoggedIn, setJustLoggedIn] = useState(false);
    const isLoggedIn = useCheckLogin();

    const handleSubmit = (event) => {
        event.preventDefault();

        const booking = {
            name,
            email,
            phone_number: phoneNumber,
            media_type: mediaType,
            message,
        };

        apiClient.post('/editorial_booking/', booking)
            .then(res => console.log(res.data));
    }

    if (!isLoggedIn && !justLoggedIn) {
        return <Login onSuccess={() => setJustLoggedIn(true)} />;
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="padded-container">
                <h1>Editorial Booking Form</h1>
                <h3>Editorial commissions are for press, magazines, newspapers, blogs, etc.</h3>
                <div className="form-container">
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Media Type</h3>
                                <select className="form-input" onChange={e => setMediaType(e.target.value)}>
                                    <option value="P">Photo</option>
                                    <option value="V">Video</option>
                                    <option value="B">Both</option>
                                </select>
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Name</h3>
                                <input className="form-input" type="text" onChange={e => setName(e.target.value)} placeholder="Name" />
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Email</h3>
                                <input className="form-input" type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Phone Number</h3>
                                <input className="form-input" type="text" onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
                            </div>
                        </div>
                    </div>
                    <div className="form-row pegged-center">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Message</h3>
                                <textarea className="disableResize form-input message-box" onChange={e => setMessage(e.target.value)} placeholder="Message"></textarea>
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

export default EditorialBooking;
