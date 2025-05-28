import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Meetings.css';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const name = localStorage.getItem('userName');
        if (name) setUsername(name);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="wrapper">
      <div className="top-bar">
        <div className="username-display">{username}</div>
        <div>
          <button className="chat-button" onClick={() => navigate('/chat')}>Перейти до чату</button>
          <button className="logout-button" onClick={handleLogout}>Вийти</button>
        </div>
      </div>

      <div className="meetings-container">
        <h2>Список зустрічей</h2>
        {error && <p className="error-message">{error}</p>}

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
          <button type="submit" className="create-btn">Створити зустріч</button>
        </form>

        <ul className="meeting-list">
          {meetings.map((m, index) => (
            <li key={m._id} className="meeting-item">
              <span className="meeting-index">Зустріч {index + 1}</span>
              <div className="meeting-content">
                <strong>{m.title}</strong>
                <div>{m.description}</div>
                <em>{new Date(m.date).toLocaleString()}</em>
                {m.zoomLink && (
                  <div><a href={m.zoomLink} target="_blank" rel="noopener noreferrer">Перейти в Zoom</a></div>
                )}
                <div className="meeting-actions">
                  <button onClick={() => handleDelete(m._id)} className="delete-btn">
                    Видалити
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}