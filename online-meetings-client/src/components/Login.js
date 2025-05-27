import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        setMessage('Успішна авторизація');
        navigate('/meetings'); 
      } else {
        console.warn('⚠️ Токен відсутній у відповіді:', res.data);
        setMessage('Сервер не надіслав токен');
      }

    } catch (err) {
      console.error('❌ Помилка при вході:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Помилка авторизації');
    }
  };

  return (
    <div>
      <h2>Вхід</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Увійти</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
