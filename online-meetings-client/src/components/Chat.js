import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../Chat.css';

const socket = io('http://localhost:3000');

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) {
      const enteredName = prompt('Введіть ваше ім’я:');
      localStorage.setItem('userName', enteredName);
      setUsername(enteredName);
    } else {
      setUsername(name);
    }
  }, []);

  useEffect(() => {
    socket.emit('requestHistory'); 

    socket.on('messageHistory', (history) => {
      setMessages(history);
    });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('messageHistory');
      socket.off('receiveMessage');
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    socket.emit('sendMessage', { user: username, text: message });
    setMessage('');
  };

  return (
    <div className="chat-wrapper">
      <div className="top-bar">
        <div className="username-display">{username}</div>
        <button className="chat-button" onClick={() => navigate('/meetings')}>
          Повернутись назад
        </button>
      </div>

      <h2 className="chat-title">Груповий чат</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong className="chat-user">{msg.user || 'Гість'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder="Введіть повідомлення"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Надіслати</button>
      </form>
    </div>
  );
}