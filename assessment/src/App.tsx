import { useState } from 'react';
import LoginPage from './components/Login';
import DashboardPage from './components/Dashboard';
import ForgotPasswordPage from './components/forgotPassword';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  interface User {
    id: number;
    username: string;
    name: string;
    email: string;
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <div className="font-sans">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
      )}
      {currentPage === 'forgot-password' && (
        <ForgotPasswordPage onBack={handleBackToLogin} />
      )}
      {currentPage === 'home' && currentUser && (
        <DashboardPage user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
