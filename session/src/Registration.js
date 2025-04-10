import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';

function Registration() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                phone: formData.phone,
                email: formData.email
            };
            console.log(registrationData);
            const response = await axios.post('http://localhost:5000/register', registrationData);
            if (response.data.success) {
                alert('Registration successful');
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-form">
                <h2 className="registration-title">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label className="input-label">First Name:</label>
                        <input 
                            name="firstName" 
                            className="input-field"
                            value={formData.firstName}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Last Name:</label>
                        <input 
                            name="lastName" 
                            className="input-field"
                            value={formData.lastName}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange} 
                            required 
                            minLength="6"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Confirm Password:</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            className="input-field"
                            value={formData.confirmPassword}
                            onChange={handleChange} 
                            required 
                            minLength="6"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Phone Number:</label>
                        <input 
                            type="tel"
                            name="phone" 
                            className="input-field"
                            value={formData.phone}
                            onChange={handleChange} 
                            required 
                            placeholder="1234567890"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="register-button">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Registration;