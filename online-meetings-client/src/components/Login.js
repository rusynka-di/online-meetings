import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ІМПОРТ
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ ВИКЛИК

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      setMessage(res.data.message);
      localStorage.setItem('token', res.data.token);
      navigate('/meetings'); // ✅ перенаправлення
    } catch (err) {
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
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Увійти</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
