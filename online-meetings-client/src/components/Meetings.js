import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Meetings.css';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/meetings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeetings(res.data);
      } catch (err) {
        setError('Не вдалося завантажити зустрічі');
      }
    };
    fetchMeetings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3000/api/meetings',
        { title, description, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMeetings((prev) => [...prev, res.data.meeting]);
      setTitle('');
      setDescription('');
      setDate('');
      setError('');
    } catch (err) {
      setError('Не вдалося створити зустріч');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/meetings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Не вдалося видалити зустріч');
    }
  };

  return (
    <div className="meetings-container">
      <h2>Список зустрічей</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate} className="meeting-form">
        <input
          type="text"
          placeholder="Назва зустрічі"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Створити зустріч</button>
      </form>

      <ul className="meeting-list">
        {meetings.map((m) => (
          <li key={m._id} className="meeting-item">
            <strong>{m.title}</strong><br />
            {m.description}<br />
            <em>{new Date(m.date).toLocaleString()}</em><br />
            {m.zoomLink && (
              <a href={m.zoomLink} target="_blank" rel="noopener noreferrer">
                Перейти в Zoom
              </a>
            )}
            <div className="meeting-actions">
              <button onClick={() => handleDelete(m._id)} className="delete-btn">Видалити</button>
              {/* Для оновлення додамо окрему логіку, якщо потрібно */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
