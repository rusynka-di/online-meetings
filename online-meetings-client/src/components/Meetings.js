import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/meetings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMeetings(res.data);
      } catch (err) {
        setError('Не вдалося завантажити зустрічі');
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div>
      <h2>Список зустрічей</h2>
      {error && <p>{error}</p>}
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
