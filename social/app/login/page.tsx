'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard (full reload to sync auth state)
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-section">
          <div className="logo-large">✨</div>
          <h1>Lumu</h1>
          <p>AI-Powered Social Media Automation</p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>AI-Generated Captions</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📅</span>
              <span>Smart Scheduling</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Analytics Dashboard</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔗</span>
              <span>Multi-Platform Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to continue to Lumu' : 'Join Lumu today'}</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>


        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%);
        }

        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse-bg 15s ease-in-out infinite;
        }

        @keyframes pulse-bg {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .brand-section {
          text-align: center;
          color: white;
          position: relative;
          z-index: 1;
        }

        .logo-large {
          font-size: 80px;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .brand-section h1 {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .brand-section p {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 40px;
        }

        .features-list {
          text-align: left;
          max-width: 280px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
          font-size: 16px;
        }

        .feature-icon {
          font-size: 24px;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1F2937;
          margin: 0 0 8px 0;
        }

        .login-header p {
          color: #6B7280;
          margin: 0;
        }

        .error-message {
          background: #FEE2E2;
          color: #DC2626;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
          background: #F9FAFB;
        }

        .form-group input:focus {
          outline: none;
          border-color: #8B5CF6;
          background: white;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .form-group input::placeholder {
          color: #9CA3AF;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6B7280;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: #8B5CF6;
        }

        .forgot-link {
          font-size: 14px;
          color: #8B5CF6;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 20px;
          transition: transform 0.2s ease;
        }

        .submit-btn:hover .btn-icon {
          transform: translateX(4px);
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: #9CA3AF;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E7EB;
        }

        .divider span {
          padding: 0 16px;
        }

        .social-buttons {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          border-color: #8B5CF6;
          background: #FAF5FF;
        }

        .toggle-text {
          text-align: center;
          margin-top: 24px;
          color: #6B7280;
          font-size: 14px;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #8B5CF6;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .toggle-btn:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }

          .login-left {
            padding: 60px 40px;
          }

          .logo-large {
            font-size: 60px;
          }

          .brand-section h1 {
            font-size: 36px;
          }

          .features-list {
            display: none;
          }

          .login-card {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
}
