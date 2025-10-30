import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ChatPage from './pages/ChatPage.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
