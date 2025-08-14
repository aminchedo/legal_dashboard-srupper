import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This component is for testing the authentication flow.
 * It contains buttons to test login, logout, and protected routes.
 */
const TestAuthFlow: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for token whenever the component renders
    const currentToken = localStorage.getItem('accessToken');
    setToken(currentToken);
  }, []);
  
  const handleLogin = () => {
    // Store mock token and redirect to dashboard
    localStorage.setItem('accessToken', 'mock-token-test');
    setToken('mock-token-test');
    navigate('/dashboard');
  };
  
  const handleLogout = () => {
    // Remove token and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    setToken(null);
    navigate('/login');
  };
  
  const testProtectedRoute = () => {
    // Try to navigate to a protected route
    navigate('/dashboard');
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '40px auto',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>Authentication Flow Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current Status:</strong> {token ? 'Authenticated' : 'Not Authenticated'}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleLogin}
          style={{
            padding: '8px 16px',
            background: '#1e3c72',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mock Login
        </button>
        
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
        
        <button 
          onClick={testProtectedRoute}
          style={{
            padding: '8px 16px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Protected Route
        </button>
        
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '8px 16px',
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login Page
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>
          <strong>Test Instructions:</strong>
        </p>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Click "Mock Login" to simulate a successful login and redirect to dashboard</li>
          <li>Click "Logout" to clear authentication and redirect to login page</li>
          <li>Click "Test Protected Route" to navigate to a protected route</li>
          <li>If not authenticated, you should be redirected to login</li>
          <li>After login, you should be redirected back to the original destination</li>
        </ol>
      </div>
    </div>
  );
};

export default TestAuthFlow;
