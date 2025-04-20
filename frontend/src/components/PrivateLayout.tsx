import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import TopBar from './TopBar';

interface ThemedProps {
  theme: 'light' | 'dark';
}

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
`;

const Content = styled.div`
  padding-top: 64px;
  min-height: calc(100vh - 64px);
`;

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <Container theme={theme}>
      <TopBar />
      <Content>{children}</Content>
    </Container>
  );
};

export default PrivateLayout; 