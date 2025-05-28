import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      setMessage(res.data.message);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email); 
      localStorage.setItem('userName', res.data.name); 

      navigate('/meetings');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Помилка авторизації');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Вхід</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Увійти</button>
        {message && <p className="auth-message">{message}</p>}
        <div className="auth-switch">
          Немає акаунта? <a href="/register">Зареєструватись</a>
        </div>
      </form>
    </div>
  );
}
