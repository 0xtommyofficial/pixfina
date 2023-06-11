import React, { useState } from 'react';
import apiClient from './apiClient';
import Login from "./Login";
import useCheckLogin from './useCheckLogin';


const HeadshotBooking = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [justLoggedIn, setJustLoggedIn] = useState(false);
    const isLoggedIn = useCheckLogin();


    const handleSubmit = (event) => {
        event.preventDefault();

        const booking = {
            name,
            email,
            phone_number: phoneNumber,
            message,
        };

        apiClient.post('/headshot_booking/', booking)
            .then(res => console.log(res.data));
    }

    if (!isLoggedIn && !justLoggedIn) {
        return <Login onSuccess={() => setJustLoggedIn(true)} />;
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="padded-container full-width">
                <h1>Headshot Booking</h1>
                <h3>Specialising in natural light portraits.</h3>
                <div className="form-container">
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Name</h3>
                                <input className="form-input" type="text" onChange={e => setName(e.target.value)} placeholder="Name" />
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Email</h3>
                                <input className="form-input" type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
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

export default HeadshotBooking;
