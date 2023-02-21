import { createTheme, PaletteColor } from '@mui/material';
import { brown, indigo } from '@mui/material/colors';
import { PaletteColorOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette {
    button: PaletteColor;
    footerButton: PaletteColor;
    checkbox: PaletteColor;
    label: PaletteColor;
    menu: PaletteColor;
    pagination: PaletteColor;
  }

  interface PaletteOptions {
    button: PaletteColorOptions;
    footerButton: PaletteColorOptions;
    checkbox: PaletteColorOptions;
    label: PaletteColorOptions;
    menu: PaletteColorOptions;
    pagination: PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    button: true;
    footerButton: true;
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    checkbox: true;
  }
}

declare module '@mui/material/FormLabel' {
  interface FormLabelPropsColorOverrides {
    label: true;
  }
}

declare module '@mui/material/Pagination' {
  interface PaginationPropsColorOverrides {
    pagination: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      light: brown['600'],
      main: brown['700'],
    },
    secondary: {
      main: indigo['300'],
      dark: indigo['400'],
    },
    button: {
      main: brown['600'],
    },
    footerButton: {
      main: '#ffffff',
    },
    checkbox: {
      main: brown['600'],
    },
    label: {
      main: 'rgba(0, 0, 0, 0.87)',
    },
    menu: {
      main: brown['50'],
    },
    pagination: {
      main: brown['500'],
      dark: brown['600'],
      contrastText: 'white',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});
