export const authService = {
  login: (email, password, recaptchaToken) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!recaptchaToken) {
          reject(new Error('Please complete the reCAPTCHA verification'));
          return;
        }
        if (email === 'demo@example.com' && password === 'password123') {
          const user = { id: 1, email, name: 'Demo User' };
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
