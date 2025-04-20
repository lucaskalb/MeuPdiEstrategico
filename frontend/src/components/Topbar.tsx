import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';

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

const AvatarButton = styled.button<ThemedProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  padding: 0;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
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
        <AvatarButton 
          theme={theme} 
          onClick={onMenuClick} 
          aria-label="Abrir menu"
        >
          {userNickname.charAt(0).toUpperCase()}
        </AvatarButton>
        <Title theme={theme}>Meu PDI Estratégico</Title>
      </LeftSection>
    </TopbarContainer>
  );
};

export default Topbar; 