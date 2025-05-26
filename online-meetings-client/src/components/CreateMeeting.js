import { useState } from 'react';
import axios from 'axios';

export default function CreateMeeting() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/meetings', {
        title,
        description,
        date,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message || 'Зустріч створено');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Помилка при створенні');
    }
  };

  return (
    <div>
      <h2>Створити зустріч</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Назва зустрічі"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br />
        <input
          type="text"
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        /><br />
        <button type="submit">Створити</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
