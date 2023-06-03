import { useState } from 'react';
import apiClient from './apiClient';

const EditorialBooking = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mediaType, setMediaType] = useState('P');
    const [message, setMessage] = useState('');

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

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={e => setName(e.target.value)} placeholder="Name" />
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="text" onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
            <select onChange={e => setMediaType(e.target.value)}>
                <option value="P">Photo</option>
                <option value="V">Video</option>
            </select>
            <textarea onChange={e => setMessage(e.target.value)} placeholder="Message"></textarea>
            <input type="submit" value="Submit" />
        </form>
    );
}

export default EditorialBooking;
