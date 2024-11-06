
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { MultiSelectTheme } from 'chakra-multiselect';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const gradientColor = '#09f1b8, #00a2ff, #ff00d2, #fed90f, #09f1b8, #00a2ff'

const customTheme = extendTheme({
  config,
  components: {
    MultiSelect: MultiSelectTheme,
    Heading: {
      variants: {
        gradientOutline: {
          bgClip: 'text',
          backgroundSize: "500% auto",
          animation: 'slide 8s linear infinite', 
          backgroundImage: `linear-gradient(to right, ${gradientColor})`, 
          color: 'var(--chakra-colors-chakra-body-bg)',
          WebkitTextStrokeColor: 'transparent',
          fontWeight: "700",
          WebkitTextStrokeWidth: 'calc(1em / 10)',
          padding: '2',
        },
        gradient: {
          bgClip: 'text',
          backgroundSize: "500% auto",
          backgroundImage: `linear-gradient(to right, ${gradientColor})`,
          color: 'transparent',
          WebkitTextStrokeColor: 'var(--chakra-colors-chakra-body-bg)',
          animation: 'slide 8s linear infinite',
          fontWeight: "700",
        }
      }
    },
    Button: {
      variants: {
        gradient: {
          bg: 'gray.900',
          color: 'white',
          borderRadius: '14px',
          position: 'relative',
          zIndex: 0,
          borderStyle: 'solid',
          borderColor: 'gray.700',
          borderWidth: '4px',
          _before: {
            content: '""',
            bgGradient: `linear-gradient(to right, ${gradientColor})`,
            bgSize: '500%',
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            zIndex: -1,
            filter: 'blur(5px)',
            width: 'calc(100% )',
            height: 'calc(100% )',
            animation: 'slide 2s linear infinite',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) no-clip',
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.5)", // beacause chrome is weird otherwise
            maskComposite: 'exclude',
            border: 'solid',
            borderWidth: '4px',
            borderColor: 'transparent',
          },
          _hover: {
            _before: {
              opacity: 1
            },
            borderColor: 'transparent',
          },
          _active: {
            color: 'black',
            _before: {
              mask: 'none',
              filter: 'none',
              //filter: 'drop-shadow(0 0 0.75rem rgba(0,0,0 0.5))',
            },
          },
        },
        gradientTransparent: {
          bg: 'transparent',
          color: 'white',
          borderRadius: '14px',
          position: 'relative',
          zIndex: 0,
          borderStyle: 'solid',
          borderColor: 'gray.700',
          borderWidth: '4px',
          _before: {
            content: '""',
            bgGradient: `linear-gradient(to right, ${gradientColor})`,
            bgSize: '500%',
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            zIndex: -1,
            filter: 'blur(5px)',
            width: 'calc(100% )',
            height: 'calc(100% )',
            animation: 'slide 2s linear infinite',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) no-clip',
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.5)", // beacause chrome is weird otherwise
            maskComposite: 'exclude',
            border: 'solid',
            borderWidth: '4px',
            borderColor: 'transparent',
          },
          _hover: {
            _before: {
              opacity: 1
            },
            borderColor: 'transparent',
          },
          _active: {
            color: 'black',
            _before: {
              mask: 'none',
              filter: 'none',
              //filter: 'drop-shadow(0 0 0.75rem rgba(0,0,0 0.5))',
            },
          },
         
        }
      }
    }
  },
  styles: {
    global: {
      '@keyframes slide': {
        '0%': { backgroundPosition: '100% 0%' }, // Start with the gradient fully to the right
        '100%': { backgroundPosition: '0% 0%' }  // End with the gradient fully to the left
      },
     '@keyframes glowing': {
        '0%': { backgroundPosition: '0 0' },
        '50%': { backgroundPosition: '400% 0' },
        '100%': { backgroundPosition: '0 0' },
      },
      body: {
        bg: 'gray.900',
      }
    },
  }
});



export default customTheme