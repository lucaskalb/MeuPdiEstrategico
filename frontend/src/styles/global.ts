import { createGlobalStyle } from 'styled-components';

type Theme = 'light' | 'dark';

interface GlobalStyleProps {
  theme: Theme;
}

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
    color: ${({ theme }) => theme === 'dark' ? '#ffffff' : '#1a1a1a'};
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      transition: all 0.2s ease-in-out;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    }
  }

  html {
    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      transition: all 0.2s ease-in-out;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    }
  }

  * {
    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      transition: all 0.2s ease-in-out;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    }
  }

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`; 