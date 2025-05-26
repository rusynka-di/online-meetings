import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

  return (
    <div>
      <h2>Список зустрічей</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Назва зустрічі"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        /><br />
        <button type="submit">Створити зустріч</button>
      </form>

      <ul>
        {meetings.map((m) => (
          <li key={m._id}>
            <strong>{m.title}</strong><br />
            {m.description}<br />
            <em>{new Date(m.date).toLocaleString()}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
