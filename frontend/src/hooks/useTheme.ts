import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export interface ThemeType {
  background: string;
  surface: string;
  border: string;
  text: string;
  hover: string;
  primary: string;
  primaryDark: string;
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  const theme: ThemeType = {
    background: context === 'dark' ? '#343541' : '#ffffff',
    surface: context === 'dark' ? '#202123' : '#ffffff',
    border: context === 'dark' ? '#4b4b4b' : '#e5e5e5',
    text: context === 'dark' ? '#ffffff' : '#1a1a1a',
    hover: context === 'dark' ? '#2a2b32' : '#f1f5f9',
    primary: context === 'dark' ? '#2196F3' : '#1976D2',
    primaryDark: context === 'dark' ? '#1976D2' : '#1565C0',
  }

  return theme
} 