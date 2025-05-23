import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { FiMenu } from 'react-icons/fi';

interface ThemedProps {
  theme: 'light' | 'dark';
}

interface TopbarProps {
  onMenuClick: () => void;
  userNickname: string;
}

const TopbarContainer = styled.div<ThemedProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1<ThemedProps>`
  font-size: 1.25rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-weight: 600;
  margin: 0;
`;

const MenuButton = styled.button<ThemedProps>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: transparent;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  padding: 0;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, userNickname }) => {
  const { theme } = useTheme();

  return (
    <TopbarContainer theme={theme}>
      <LeftSection>
        <MenuButton 
          theme={theme} 
          onClick={onMenuClick} 
          aria-label="Abrir menu"
        >
          <FiMenu size={24} />
        </MenuButton>
        <Title theme={theme}>Meu PDI Estratégico</Title>
      </LeftSection>
    </TopbarContainer>
  );
};

export default Topbar; 