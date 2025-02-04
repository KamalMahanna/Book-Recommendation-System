import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#141414',
        color: 'white',
        fontFamily: "'Netflix Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        overflowX: 'hidden',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        backgroundColor: '#141414',
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#4b4b4b',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#686868',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        solid: {
          bg: 'brand.200',
          color: 'white',
          _hover: {
            bg: 'brand.300',
            transform: 'scale(1.05)',
          },
          _active: {
            bg: 'brand.400',
          },
        },
        ghost: {
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.200',
          },
        },
        outline: {
          borderColor: 'white',
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.200',
          },
        },
      },
      defaultProps: {
        variant: 'solid',
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: 'whiteAlpha.200',
        },
        item: {
          bg: 'transparent',
          _hover: {
            bg: 'whiteAlpha.200',
          },
          _focus: {
            bg: 'whiteAlpha.200',
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          backdropFilter: 'blur(10px)',
        },
        dialog: {
          bg: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'lg',
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'gray.800',
        color: 'white',
        fontSize: 'sm',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'lg',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'scale(1.02)',
            boxShadow: 'xl',
          },
        },
      },
    },
  },
  colors: {
    brand: {
      100: '#ff0000',
      200: '#e50914',
      300: '#b81d24',
      400: '#831010',
      500: '#831010',
    },
    netflix: {
      black: '#141414',
      red: '#e50914',
      gray: {
        100: '#ffffff',
        200: '#e5e5e5',
        300: '#b3b3b3',
        400: '#808080',
        500: '#4b4b4b',
        600: '#2f2f2f',
        700: '#232323',
        800: '#171717',
        900: '#141414',
      },
    },
  },
  shadows: {
    outline: 'none',
  },
  fonts: {
    body: "'Netflix Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    heading: "'Netflix Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  breakpoints: {
    sm: '30em',    // 480px
    md: '48em',    // 768px
    lg: '62em',    // 992px
    xl: '80em',    // 1280px
    '2xl': '96em', // 1536px
  },
});

export default theme;
