import { DefaultTheme as DefaultThemePaper } from 'react-native-paper';

export const theme = {
  ...DefaultThemePaper,
  colors: {
    ...DefaultThemePaper.colors,
    primary: 'rgba(67, 129, 230, 1)', // Alpha 0-1 arası olmalı
    secondary: 'rgba(65, 71, 87, 1)',
    error: 'rgba(241, 58, 89, 1)',
    success: 'rgba(0, 179, 134, 1)',
    surface: 'rgba(67, 129, 230, 1)',
  },
};
