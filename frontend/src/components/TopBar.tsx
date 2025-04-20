import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiMenu } from 'react-icons/fi';

interface ThemedProps {
  theme: 'light' | 'dark';
}

const Container = styled.div<ThemedProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.1)' 
      : '0 4px 6px rgba(0, 0, 0, 0.05)'
  };
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
`;

const MenuButton = styled.button<ThemedProps>`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#f1f5f9'};
  }
`;

const AvatarButton = styled.button<ThemedProps>`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#f1f5f9'};
  }
`;

const Menu = styled.div<ThemedProps & { isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 1rem;
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  border-radius: 8px;
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.2)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  padding: 0.5rem;
  min-width: 200px;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  z-index: 1001;
`;

const MenuItem = styled.button<ThemedProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#f1f5f9'};
  }
`;

const UserInfo = styled.div<ThemedProps>`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
  margin-bottom: 0.5rem;
`;

const UserName = styled.div<ThemedProps>`
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div<ThemedProps>`
  color: ${({ theme }) => theme === 'dark' ? '#a0aec0' : '#4a5568'};
  font-size: 0.875rem;
`;

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userNickname = localStorage.getItem('userNickname') || 'Usuário';
  const userEmail = localStorage.getItem('userEmail') || '';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <Container theme={theme}>
      <MenuButton theme={theme} onClick={onMenuClick}>
        <FiMenu />
      </MenuButton>
      <AvatarButton theme={theme} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FiMenu />
        <Menu theme={theme} isOpen={isMenuOpen}>
          <UserInfo theme={theme}>
            <UserName theme={theme}>{userNickname}</UserName>
            <UserEmail theme={theme}>{userEmail}</UserEmail>
          </UserInfo>
          <MenuItem theme={theme} onClick={handleLogout}>
            Sair
          </MenuItem>
        </Menu>
      </AvatarButton>
    </Container>
  );
};

export default TopBar; 