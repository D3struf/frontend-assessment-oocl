import { useState } from "react";
import database from '../data/db.json';
import { validateEmail } from "../services/utility";

interface LoginPageProps {
  onLogin: (user: any) => void;
  onForgotPassword: () => void;
}

const LoginPage = ({ onLogin, onForgotPassword }: LoginPageProps) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  // const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Username is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Input valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      setErrors({general: 'Maximum limit of invalid password attempts reached. Please try again later.' })
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const user = database.users.find(u => 
      u.email === formData.email && u.password === formData.password
    );

    if (user) {
      onLogin(user);
      setLoginAttempts(0);
      setErrors({});
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsBlocked(true);
        setErrors({ general: 'Maximum limit of invalid password attempts reached. Please try again later.' });
      } else {
        setErrors({ general: 'Either the email or password is incorrect.' });
      }
    }
  };

  const isLoginDisabled = formData.password.length < 4 || isBlocked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-col p-4 space-y-6">
      <h1 className="text-primary font-inter text-[40px] font-bold">Exam track</h1>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-full max-h-340px p-6 space-y-6 border border-slate-200 items-center flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-9 font-inter max-w-sm w-full">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Name
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-3 pr-14 py-2 placeholder-secondary/50 border border-slate-300 rounded-md transition-colors"
                placeholder="Username or Email"
              />
            </div>
            { errors.email && 
              <p className="text-error text-sm leading-[20px]">{errors.email}</p>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type='password'
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-3 pr-14 py-2 placeholder-secondary/50 border border-slate-300 rounded-lg transition-colors"
                placeholder="Password"
                required
              />
            </div>
            { errors.password && 
              <p className="text-error text-sm leading-[20px]">{errors.password}</p>
            }
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoginDisabled}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoginDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
            }`}
          >
            Login
          </button>

          {loginAttempts > 0 && loginAttempts < 3 && (
            <div className="mt-4 text-center text-sm text-yellow-600">
              Login attempts: {loginAttempts}/3
            </div>
          )}
        </form>
        <div className="text-center">
          <button
            onClick={onForgotPassword}
            className="text-slate-500 hover:text-primary text-sm leading-5 font-normal transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>
      <p className=" text-slate-500 text-[14px] leading-5 font-inter">Copyright © 2024 FE Exam track, All Rights Reserved.</p>
    </div>
  );
};

export default LoginPage;