import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Meetings from './components/Meetings';
import CreateMeeting from './components/CreateMeeting';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/create" element={<CreateMeeting />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
