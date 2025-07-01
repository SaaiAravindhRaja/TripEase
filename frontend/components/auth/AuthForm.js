import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Toast, { useToast } from '../ui/Toast';

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { showToast, ToastContainer } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for login vs registration
    if (isLogin) {
      if (!formData.email || !formData.password) {
        showToast('Please fill in email and password', 'warning');
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        showToast('Please fill in all required fields', 'warning');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? 'login' : 'register';
      
      // Prepare request body based on endpoint
      const requestBody = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };
      
      const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          showToast('Logged in successfully! Welcome back!', 'success');
          setTimeout(() => {
            onAuthSuccess?.(data.user);
          }, 1000);
        } else {
          showToast('Registration successful! Please login with your credentials.', 'success');
          setIsLogin(true);
          setFormData({ name: formData.name, email: '', password: '' });
        }
      } else {
        showToast(data.message || 'Authentication failed', 'error');
      }
    } catch (error) {
      console.error('Auth error:', error);
      showToast('Network error. Please check your connection and try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-form">
      <ToastContainer />
      
      <Card className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Sign in to continue planning your trips' 
              : 'Join TripEase to start planning amazing trips'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-content">
          {!isLogin && (
            <Input
              type="text"
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          )}
          
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />

          <Button 
            type="submit" 
            disabled={loading}
            variant="primary"
            className="auth-submit-button"
          >
            {loading 
              ? (isLogin ? 'Signing In...' : 'Creating Account...') 
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </Button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              className="auth-switch-button"
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
