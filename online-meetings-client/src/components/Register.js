import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Помилка');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
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
        <button type="submit">Зареєструватися</button>
        {message && <p>{message}</p>}
        <div className="auth-switch">
          Маєте акаунт? <a href="/login">Увійти</a>
        </div>

      </form>
    </div>
  );
}

export default Register;
