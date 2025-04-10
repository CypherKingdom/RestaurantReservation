import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reservation.css';

function Reservation() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        guestNbr: '',
        area: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.guestNbr || !formData.area || !formData.date || !formData.time) {
            alert('Please fill all mandatory fields');
            return;
        }
        try {
            const reservationData = {
                userId: user.id,
                guestNbr: formData.guestNbr,
                lastName: user.lastName,
                firstName: user.firstName,
                phone: user.phone,
                email: user.email,
                date: formData.date,
                time: formData.time,
                area: formData.area
            };
            const response = await axios.post('http://localhost:5000/reserve', reservationData);
            if (response.data.success) {
                alert('Reservation successfully saved!');
                navigate('/'); // Optional: redirect after success
            }
        } catch (err) {
            alert('Reservation failed');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="reservation-container">
            <div className="reservation-form">
                <h2 className="reservation-title">Reservation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">First Name:</label>
                        <input
                            type="text"
                            className="input-field"
                            value={user.firstName || ''}
                            readOnly
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Last Name:</label>
                        <input
                            type="text"
                            className="input-field"
                            value={user.lastName || ''}
                            readOnly
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Number of Guests:</label>
                        <input
                            type="number"
                            name="guestNbr"
                            className="input-field"
                            value={formData.guestNbr}
                            onChange={handleChange}
                            required
                            min="1"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Area:</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="area"
                                    value="Smoking"
                                    onChange={handleChange}
                                    required
                                /> Smoking
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="area"
                                    value="No Smoking"
                                    onChange={handleChange}
                                    required
                                /> No Smoking
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="area"
                                    value="Indoor"
                                    onChange={handleChange}
                                    required
                                /> Indoor
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="area"
                                    value="Outdoor"
                                    onChange={handleChange}
                                    required
                                /> Outdoor
                            </label>
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Reservation Date:</label>
                        <input
                            type="date"
                            name="date"
                            className="input-field"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Reservation Time:</label>
                        <input
                            type="time"
                            name="time"
                            className="input-field"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="reserve-button">Reserve</button>
                </form>
            </div>
        </div>
    );
}

export default Reservation;