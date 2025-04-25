import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      cardBackground: string;
      text: string;
      primary: string;
      secondary: string;
      error: string;
      success: string;
      warning: string;
      info: string;
    };
  }
} 