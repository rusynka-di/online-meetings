import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); 

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div>
      <h2>Груповий чат</h2>
      <div style={{ border: '1px solid gray', height: '200px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '5px' }}>{msg}</div>
        ))}
      </div>
      <form onSubmit={handleSend}>
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
