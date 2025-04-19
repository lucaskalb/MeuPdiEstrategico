import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedProps {
  theme: 'light' | 'dark';
  'data-isopen'?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userNickname: string;
}

const SidebarContainer = styled.div<ThemedProps>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(${({ 'data-isopen': isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div<ThemedProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ 'data-isopen': isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ 'data-isopen': isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  z-index: 999;
`;

const UserSection = styled.div<ThemedProps>`
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
`;

const Avatar = styled.div<ThemedProps>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
`;

const UserName = styled.span<ThemedProps>`
  font-size: 1rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-weight: 500;
`;

const MenuContent = styled.div`
  flex: 1;
  padding: 1rem;
`;

const Footer = styled.div<ThemedProps>`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
`;

const LogoutButton = styled.button<ThemedProps>`
  width: 100%;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userNickname }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <>
      <Overlay theme={theme} data-isopen={isOpen} onClick={onClose} />
      <SidebarContainer theme={theme} data-isopen={isOpen}>
        <UserSection theme={theme}>
          <Avatar theme={theme}>
            {userNickname.charAt(0).toUpperCase()}
          </Avatar>
          <UserName theme={theme}>{userNickname}</UserName>
        </UserSection>
        
        <MenuContent>
          {/* Conteúdo do menu será adicionado posteriormente */}
        </MenuContent>

        <Footer theme={theme}>
          <LogoutButton theme={theme} onClick={handleLogout}>
            <FiLogOut size={20} />
            Sair
          </LogoutButton>
        </Footer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar; 
