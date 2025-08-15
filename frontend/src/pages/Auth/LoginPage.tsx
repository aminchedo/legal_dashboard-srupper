import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeOutlined, EyeInvisibleOutlined, CheckCircleFilled } from '../../icons/antd-stub';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const { TabPane } = Tabs;

// Mock credentials for testing
const MOCK_USERS = [
  { email: 'admin', password: 'admin', username: 'admin' },
  { email: 'admin@legal.ai', password: 'admin', username: 'admin' }
];

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.3) 0%, transparent 100%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 100%),
      radial-gradient(circle at 40% 80%, rgba(120, 199, 255, 0.3) 0%, transparent 100%);
    z-index: 0;
    animation: ${fadeIn} 2s ease-out forwards;
  }
`;

const GlassCard = styled.div`
  position: relative;
  width: 440px;
  max-width: 95vw;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(255, 255, 255, 0.1) inset;
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  z-index: 1;
  animation: ${fadeInUp} 0.8s ease-out forwards;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #ff9ff3);
    z-index: 2;
    opacity: 0.8;
    background-size: 200% 100%;
    animation: ${shimmer} 5s linear infinite;
  }
`;

const BrandTitle = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 35px 0;
  background: linear-gradient(135deg, #fff, #a8edea 50%, #fed6e3);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
  
  span {
    display: inline-block;
    margin-right: 10px;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

const FormContainer = styled.div`
  position: relative;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav::before {
    border-bottom: none !important;
  }

  .ant-tabs-tab {
    font-size: 16px;
    padding: 12px 0;
    margin: 0 20px 0 0;
    transition: all 0.3s ease;
    
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fff !important;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background: #fff !important;
    height: 3px !important;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }
`;

const StyledForm = styled(Form)`
  margin-top: 25px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const FloatingLabel = styled.label<{ focused: boolean; hasValue: boolean }>`
  position: absolute;
  left: 44px;
  top: ${props => (props.focused || props.hasValue ? '-10px' : '50%')};
  transform: ${props => (props.focused || props.hasValue ? 'translateY(0)' : 'translateY(-50%)')};
  background: ${props => (props.focused || props.hasValue ? 'linear-gradient(90deg, #2a5298, #667eea)' : 'transparent')};
  -webkit-background-clip: ${props => (props.focused || props.hasValue ? 'text' : 'none')};
  background-clip: ${props => (props.focused || props.hasValue ? 'text' : 'none')};
  -webkit-text-fill-color: ${props => (props.focused || props.hasValue ? 'transparent' : 'rgba(255,255,255,0.6)')};
  color: ${props => (props.focused || props.hasValue ? '#fff' : 'rgba(255,255,255,0.6)')};
  padding: ${props => (props.focused || props.hasValue ? '2px 8px' : '0')};
  font-size: ${props => (props.focused || props.hasValue ? '12px' : '14px')};
  font-weight: ${props => (props.focused || props.hasValue ? '600' : '400')};
  transition: all 0.3s ease;
  z-index: 2;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.2);
    z-index: -1;
    border-radius: 10px;
    opacity: ${props => (props.focused || props.hasValue ? '1' : '0')};
    transition: all 0.3s ease;
  }
`;

const StyledInput = styled(Input)`
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  height: 50px !important;
  padding: 4px 15px 4px 40px !important;
  color: #fff !important;
  font-size: 16px !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
  
  &:hover, &:focus {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  }
  
  &::placeholder {
    color: transparent;
  }
  
  .ant-input {
    background: transparent !important;
    color: #fff !important;
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  height: 50px !important;
  padding: 4px 15px 4px 40px !important;
  color: #fff !important;
  font-size: 16px !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
  
  &:hover, &:focus {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  }
  
  &::placeholder {
    color: transparent;
  }
  
  .ant-input {
    background: transparent !important;
    color: #fff !important;
  }
  
  .ant-input-suffix {
    color: rgba(255, 255, 255, 0.6) !important;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  z-index: 2;
`;

const PasswordVisibilityIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  z-index: 2;
  font-size: 18px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #fff;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #1e3c72, #2a5298, #3a6fc8) !important;
  border: none !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
    background: linear-gradient(135deg, #2a5298, #3a6fc8, #4a89e8) !important;
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
  }
  
  &.loading {
    .ant-btn-loading-icon {
      animation: ${rotate} 1.5s linear infinite;
    }
  }
  
  &.error {
    animation: ${shake} 0.5s ease-in-out;
  }
`;

const DemoInfoBox = styled.div`
  margin-top: 30px;
  padding: 12px;
  background: rgba(74, 137, 232, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border: 1px solid rgba(74, 137, 232, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  
  strong {
    color: #a8edea;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`;

const FloatingParticle = styled.div<{ size: string; top: string; left: string; delay: string }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ${fadeInUp} 15s infinite ease-in-out;
  animation-delay: ${props => props.delay};
  opacity: 0.6;
  z-index: 0;
`;

const PasswordStrengthContainer = styled.div`
  margin-top: 8px;
  height: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const PasswordStrengthIndicator = styled.div<{ strength: number }>`
  height: 100%;
  width: ${props => `${props.strength}%`};
  background: ${props => {
    if (props.strength < 33) return 'linear-gradient(90deg, #ff5252, #ff7675)';
    if (props.strength < 66) return 'linear-gradient(90deg, #feca57, #fdcb6e)';
    return 'linear-gradient(90deg, #26de81, #2ecc71)';
  }};
  border-radius: 3px;
  transition: all 0.5s ease;
`;

const PasswordStrengthText = styled.div<{ strength: number }>`
  font-size: 12px;
  margin-top: 5px;
  text-align: right;
  color: ${props => {
    if (props.strength < 33) return '#ff7675';
    if (props.strength < 66) return '#fdcb6e';
    return '#2ecc71';
  }};
  font-weight: 500;
`;

const PasswordRequirementsList = styled.div`
  margin-top: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 10px;
  font-size: 12px;
`;

const PasswordRequirement = styled.div<{ met: boolean }>`
  color: ${props => (props.met ? '#2ecc71' : 'rgba(255, 255, 255, 0.6)')};
  margin: 5px 0;
  display: flex;
  align-items: center;
  
  .ant-icon {
    margin-right: 5px;
  }
`;

interface PasswordCriteria {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [registerValues, setRegisterValues] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [formError, setFormError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect location if coming from a protected route
  const from = location.state?.from?.pathname || '/dashboard';

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (activeTab === '2') {
      const password = registerValues.password;
      let strength = 0;
      const criteria = {
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[^A-Za-z0-9]/.test(password)
      };

      // Calculate strength percentage
      if (criteria.hasMinLength) strength += 20;
      if (criteria.hasUppercase) strength += 20;
      if (criteria.hasLowercase) strength += 20;
      if (criteria.hasNumber) strength += 20;
      if (criteria.hasSpecialChar) strength += 20;

      setPasswordStrength(strength);
      setPasswordCriteria(criteria);
    }
  }, [registerValues.password, activeTab]);

  const handleLogin = async () => {
    const bypass = import.meta.env.VITE_BYPASS_AUTH === '1' || (typeof process !== 'undefined' && process.env && process.env.VITE_BYPASS_AUTH === '1');
    if (bypass) {
      localStorage.setItem('accessToken', 'dev-bypass-token');
      message.success('Dev bypass enabled. Redirecting...');
      navigate(from);
      return;
    }

    if (!loginValues.email || !loginValues.password) {
      setFormError(true);
      setTimeout(() => setFormError(false), 500);
      message.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Check mock credentials first
    const mockUser = MOCK_USERS.find(user =>
      (user.email === loginValues.email || user.username === loginValues.email) &&
      user.password === loginValues.password
    );

    if (mockUser) {
      localStorage.setItem('accessToken', 'mock-token-admin');
      message.success('Welcome Admin! 👋');
      navigate(from);
      setLoading(false);
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginValues),
      });
      const data = await response.json();
      if (response.ok && (data.token || data.accessToken)) {
        const token = data.accessToken || data.token;
        localStorage.setItem('accessToken', token);
        message.success('Login successful! 🎉');
        navigate(from);
      } else {
        setFormError(true);
        setTimeout(() => setFormError(false), 500);
        message.error(data.message || 'Login failed. Try: admin/admin');
      }
    } catch {
      setFormError(true);
      setTimeout(() => setFormError(false), 500);
      message.error('Connection error. Try: admin/admin');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!registerValues.username || !registerValues.email || !registerValues.password || !registerValues.confirmPassword) {
      setFormError(true);
      setTimeout(() => setFormError(false), 500);
      message.error('Please fill in all fields');
      return;
    }

    if (registerValues.password !== registerValues.confirmPassword) {
      setFormError(true);
      setTimeout(() => setFormError(false), 500);
      message.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 60) {
      setFormError(true);
      setTimeout(() => setFormError(false), 500);
      message.error('Password is too weak');
      return;
    }

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerValues),
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Registration successful! Please log in.');
        setActiveTab('1');
        setRegisterValues({ username: '', email: '', password: '', confirmPassword: '' });
      } else {
        setFormError(true);
        setTimeout(() => setFormError(false), 500);
        message.error(data.message || 'Registration failed.');
      }
    } catch {
      setFormError(true);
      setTimeout(() => setFormError(false), 500);
      message.error('Connection error. Use admin/admin to login.');
    }
    setLoading(false);
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginValues(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterValues(prev => ({ ...prev, [name]: value }));
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 33) return 'Weak';
    if (passwordStrength < 66) return 'Moderate';
    return 'Strong';
  };

  return (
    <Container>
      {/* Floating particles for background effect */}
      <FloatingParticle size="15px" top="20%" left="10%" delay="0s" />
      <FloatingParticle size="8px" top="15%" left="25%" delay="2s" />
      <FloatingParticle size="12px" top="70%" left="15%" delay="1s" />
      <FloatingParticle size="10px" top="80%" left="60%" delay="0.5s" />
      <FloatingParticle size="6px" top="30%" left="80%" delay="1.5s" />
      <FloatingParticle size="14px" top="60%" left="90%" delay="0.8s" />

      <GlassCard>
        <BrandTitle>
          <span>⚖️</span> AI Legal Dashboard
        </BrandTitle>

        <FormContainer>
          <StyledTabs
            defaultActiveKey="1"
            centered
            activeKey={activeTab}
            onChange={(key: string) => setActiveTab(key)}
          >
            <TabPane tab="🔑 Login" key="1">
              <StyledForm layout="vertical">
                <InputWrapper>
                  <InputIcon><UserOutlined /></InputIcon>
                  <FloatingLabel
                    focused={focusedInput === 'email'}
                    hasValue={!!loginValues.email}
                  >
                    Email or Username
                  </FloatingLabel>
                  <StyledInput
                    name="email"
                    value={loginValues.email}
                    onChange={handleLoginInputChange}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputIcon><LockOutlined /></InputIcon>
                  <FloatingLabel
                    focused={focusedInput === 'password'}
                    hasValue={!!loginValues.password}
                  >
                    Password
                  </FloatingLabel>
                  {passwordVisible ? (
                    <StyledInput
                      name="password"
                      value={loginValues.password}
                      onChange={handleLoginInputChange}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      type="text"
                    />
                  ) : (
                    <StyledInput
                      name="password"
                      value={loginValues.password}
                      onChange={handleLoginInputChange}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      type="password"
                    />
                  )}
                  <PasswordVisibilityIcon onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </PasswordVisibilityIcon>
                </InputWrapper>

                <StyledButton
                  type="primary"
                  onClick={handleLogin}
                  loading={loading}
                  className={formError ? 'error' : ''}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </StyledButton>
              </StyledForm>

              <DemoInfoBox>
                💡 Demo Credentials: <strong>admin</strong> / <strong>admin</strong>
              </DemoInfoBox>
            </TabPane>

            <TabPane tab="📝 Register" key="2">
              <StyledForm layout="vertical">
                <InputWrapper>
                  <InputIcon><UserOutlined /></InputIcon>
                  <FloatingLabel
                    focused={focusedInput === 'username'}
                    hasValue={!!registerValues.username}
                  >
                    Username
                  </FloatingLabel>
                  <StyledInput
                    name="username"
                    value={registerValues.username}
                    onChange={handleRegisterInputChange}
                    onFocus={() => setFocusedInput('username')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputIcon><MailOutlined /></InputIcon>
                  <FloatingLabel
                    focused={focusedInput === 'registerEmail'}
                    hasValue={!!registerValues.email}
                  >
                    Email
                  </FloatingLabel>
                  <StyledInput
                    name="email"
                    type="email"
                    value={registerValues.email}
                    onChange={handleRegisterInputChange}
                    onFocus={() => setFocusedInput('registerEmail')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </InputWrapper>

                <InputWrapper>
                  <InputIcon><LockOutlined /></InputIcon>
                  <FloatingLabel
                    focused={focusedInput === 'registerPassword'}
                    hasValue={!!registerValues.password}
                  >
                    Password
                  </FloatingLabel>
                  {passwordVisible ? (
                    <StyledInput
                      name="password"
                      value={registerValues.password}
                      onChange={handleRegisterInputChange}
                      onFocus={() => {
                        setFocusedInput('registerPassword');
                        setShowPasswordRequirements(true);
                      }}
                      onBlur={() => setFocusedInput(null)}
                      type="text"
                    />
                  ) : (
                    <StyledInput
                      name="password"
                      value={registerValues.password}
                      onChange={handleRegisterInputChange}
                      onFocus={() => {
                        setFocusedInput('registerPassword');
                        setShowPasswordRequirements(true);
                      }}
                      onBlur={() => setFocusedInput(null)}
                      type="password"
                    />
                  )}
                  <PasswordVisibilityIcon onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </PasswordVisibilityIcon>
                </InputWrapper>

                {/* Password strength meter */}
                {registerValues.password && (
                  <>
                    <PasswordStrengthContainer>
                      <PasswordStrengthIndicator strength={passwordStrength} />
                    </PasswordStrengthContainer>
                    <PasswordStrengthText strength={passwordStrength}>
                      {getPasswordStrengthText()}
                    </PasswordStrengthText>
                  </>
                )}

                {/* Password requirements */}
                {showPasswordRequirements && (
                  <PasswordRequirementsList>
                    <PasswordRequirement met={passwordCriteria.hasMinLength}>
                      {passwordCriteria.hasMinLength ? <CheckCircleFilled /> : '○'} At least 8 characters
                    </PasswordRequirement>
                    <PasswordRequirement met={passwordCriteria.hasUppercase}>
                      {passwordCriteria.hasUppercase ? <CheckCircleFilled /> : '○'} One uppercase letter
                    </PasswordRequirement>
                    <PasswordRequirement met={passwordCriteria.hasLowercase}>
                      {passwordCriteria.hasLowercase ? <CheckCircleFilled /> : '○'} One lowercase letter
                    </PasswordRequirement>
                    <PasswordRequirement met={passwordCriteria.hasNumber}>
                      {passwordCriteria.hasNumber ? <CheckCircleFilled /> : '○'} One number
                    </PasswordRequirement>
                    <PasswordRequirement met={passwordCriteria.hasSpecialChar}>
                      {passwordCriteria.hasSpecialChar ? <CheckCircleFilled /> : '○'} One special character
                    </PasswordRequirement>
                  </PasswordRequirementsList>
                )}

                <InputWrapper>
                  <InputIcon><LockOutlined /></InputIcon>
                  <FloatingLabel
                    focused={focusedInput === 'confirmPassword'}
                    hasValue={!!registerValues.confirmPassword}
                  >
                    Confirm Password
                  </FloatingLabel>
                  {passwordVisibleConfirm ? (
                    <StyledInput
                      name="confirmPassword"
                      value={registerValues.confirmPassword}
                      onChange={handleRegisterInputChange}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      type="text"
                    />
                  ) : (
                    <StyledInput
                      name="confirmPassword"
                      value={registerValues.confirmPassword}
                      onChange={handleRegisterInputChange}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      type="password"
                    />
                  )}
                  <PasswordVisibilityIcon onClick={() => setPasswordVisibleConfirm(!passwordVisibleConfirm)}>
                    {passwordVisibleConfirm ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </PasswordVisibilityIcon>
                </InputWrapper>

                <StyledButton
                  type="primary"
                  onClick={handleRegister}
                  loading={loading}
                  className={formError ? 'error' : ''}
                >
                  {loading ? 'Creating account...' : 'Register'}
                </StyledButton>
              </StyledForm>
            </TabPane>
          </StyledTabs>
        </FormContainer>
      </GlassCard>
    </Container>
  );
};

export default LoginPage;