import { useState } from 'react';
import database from '../data/db.json';
import { validateEmail } from "../services/utility";
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage = ({ onBack }: ForgotPasswordPageProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email format');
      return;
    }

    const userExists = database.users.find(u => u.email === email);
    
    if (userExists) {
      setMessage('Password can be reset now.');
      setError('');
      onBack();
    } else {
      setError('Email does not exist.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">Forgot Password</h1>
          <p className="text-secondary">Enter your email to reset your password</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setMessage('');
                }}
                className="w-full pl-3 pr-4 py-3 border border-slate-300 rounded-lg transition-colors placeholder-slate-500"
                placeholder="Enter your email"
                required
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-error">{error}</p>
            )}
            {message && (
              <p className="mt-1 text-sm text-green-600">{message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 py-3 px-4 border border-slate-300 text-secondary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center cursor-pointer justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 cursor-pointer transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;