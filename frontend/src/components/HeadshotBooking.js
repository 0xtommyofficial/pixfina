import React, { useState } from 'react';
import apiClient from './apiClient';
import Login from "./Login";
import useCheckLogin from './useCheckLogin';
import HeadShotGallery from "./headshotGallery";


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

        apiClient.post('/headshot_bookings/', booking)
            // .then(res => console.log(res.data));
            .then((res) => {
                alert("Your booking request has been submitted!");
                setName('');
                setEmail('');
                setPhoneNumber('');
                setMessage('');
            });
    }

    if (!isLoggedIn && !justLoggedIn) {
        return (
            <React.Fragment>
                <div className="half-rem-line-height centered-column">
                    <h1>Headshot Booking</h1>
                    <h3>Specialising in natural light portraits.</h3>
                </div>
                <HeadShotGallery />
                <Login onSuccess={() => setJustLoggedIn(true)} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className="half-rem-line-height centered-column">
                <h1>Headshot Booking</h1>
                <h3>Specialising in natural light portraits.</h3>
            </div>
            <HeadShotGallery />
            <form onSubmit={handleSubmit} className="padded-container">
                <h1>Headshot Booking</h1>
                <h3>Specialising in natural light portraits.</h3>
                <div className="form-container">
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
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <h3>Email</h3>
                                <input className="form-input" type="email"
                                       onChange={e => setEmail(e.target.value)}
                                       placeholder="Email"
                                       value={email} />
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
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
                                          placeholder="Message"
                                          value={message} >
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

export default HeadshotBooking;
