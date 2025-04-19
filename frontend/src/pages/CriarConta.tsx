import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

interface ThemedProps {
  theme: 'light' | 'dark';
}

interface FormValues {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorState {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  submit: string;
}

const initialErrorState: ErrorState = {
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  submit: ''
};

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  transition: all 0.3s ease;
`;

const Card = styled.div<ThemedProps>`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;
`;

const Title = styled.h1<ThemedProps>`
  font-size: 2rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label<ThemedProps>`
  font-size: 0.875rem;
  color: ${({ theme }) => theme === 'dark' ? '#a0aec0' : '#4a5568'};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input<ThemedProps>`
  padding: 0.875rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme === 'dark' ? '#666' : '#a0aec0'};
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.span`
  color: #22c55e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Button = styled.button<ThemedProps>`
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${({ theme }) => theme === 'dark' ? '#4b5563' : '#cbd5e0'};
    cursor: not-allowed;
    transform: none;
  }
`;

const ThemeToggle = styled.button<ThemedProps>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
  }
`;

const LinkText = styled(Link)<ThemedProps>`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const CriarConta: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<FormValues>({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ErrorState>(initialErrorState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: ErrorState = { ...initialErrorState };

    if (formData.nickname.length < 2) {
      newErrors.nickname = 'O nome deve ter pelo menos 2 caracteres';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      setErrors(initialErrorState);
      setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message,
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container theme={theme}>
      <ThemeToggle theme={theme} onClick={toggleTheme}>
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </ThemeToggle>
      <Card theme={theme}>
        <Title theme={theme}>Criar Conta</Title>
        <Form onSubmit={handleSubmit}>
          {successMessage && (
            <SuccessMessage>{successMessage}</SuccessMessage>
          )}
          
          <InputGroup>
            <Label theme={theme} htmlFor="nickname">Nome</Label>
            <Input
              theme={theme}
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Seu nome"
              required
              disabled={isSubmitting}
            />
            {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label theme={theme} htmlFor="email">Email</Label>
            <Input
              theme={theme}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              disabled={isSubmitting}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label theme={theme} htmlFor="password">Senha</Label>
            <Input
              theme={theme}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Sua senha"
              required
              disabled={isSubmitting}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label theme={theme} htmlFor="confirmPassword">Confirmação de Senha</Label>
            <Input
              theme={theme}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              required
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <Button theme={theme} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <LinkText theme={theme} to="/login">
            Já tem uma conta? Faça login
          </LinkText>
        </Form>
      </Card>
    </Container>
  );
};

export default CriarConta; 