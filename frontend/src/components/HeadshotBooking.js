import { useState } from 'react';
import apiClient from './apiClient';

const HeadshotBooking = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

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

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={e => setName(e.target.value)} placeholder="Name" />
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="text" onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
            <textarea onChange={e => setMessage(e.target.value)} placeholder="Message"></textarea>
            <input type="submit" value="Submit" />
        </form>
    );
}

export default HeadshotBooking;
