import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            if (response.data.success) {
                const userData = {
                    ...response.data.user,
                    firstName: response.data.user.firstName || '',
                    lastName: response.data.user.lastName || ''
                };
                localStorage.setItem('user', JSON.stringify(userData));
                navigate('/reserve');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">User Name (Email):</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => navigate('/register')} className="register-link">+</button>
                    </div>
                )}
                <a href="#" onClick={() => alert('Feature not implemented')} className="forget-password">
                    Forget Password
                </a>
            </div>
        </div>
    );
}

export default Login;