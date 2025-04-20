import { extendTheme, type ThemeConfig, type StyleFunctionProps } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        margin: 0,
        padding: 0,
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
      },
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: 0,
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'blue.400' : 'blue.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'blue.500' : 'blue.600',
          },
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
        },
      },
    },
  },
});

export default theme; 