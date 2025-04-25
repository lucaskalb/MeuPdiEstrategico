import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeContextProvider, useTheme } from './contexts/ThemeContext';
import { GlobalStyle } from './styles/global';
import { lightTheme, darkTheme } from './styles/theme';
import AppRoutes from './routes';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle theme={theme} />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeContextProvider>
        <AppContent />
      </ThemeContextProvider>
    </Router>
  );
};

export default App;
