import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { jwtDecode } from 'jwt-decode';

interface ThemedProps {
  theme: 'light' | 'dark';
}

interface JWTPayload {
  nickname: string;
  email: string;
  user_id: number;
}

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  transition: all 0.3s ease;
  padding-top: 64px; // Altura da Topbar
`;

const Content = styled.div`
  padding: 2rem;
`;

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userNickname, setUserNickname] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setUserNickname(decoded.nickname);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Topbar 
        onMenuClick={toggleMenu} 
        userNickname={userNickname}
      />
      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        userNickname={userNickname}
      />
      <Container theme={theme}>
        <Content>
          {/* Conteúdo será adicionado posteriormente */}
        </Content>
      </Container>
    </>
  );
};

export default Dashboard; 