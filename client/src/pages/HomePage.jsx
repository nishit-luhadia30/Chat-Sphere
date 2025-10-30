import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Auth/Login.jsx';
import Signup from '../components/Auth/Signup.jsx';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) navigate('/chats');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            ChatSphere
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Connect with friends instantly
          </p>

          <div className="flex mb-6 border-b">
            <button
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                activeTab === 'signup'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
