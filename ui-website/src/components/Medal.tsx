import { Box, ChakraProps, Text } from '@chakra-ui/react';
import React from 'react';



export type MedalProps = {
  type: 'gold' | 'silver' | 'bronze' | 'author' | 'dotted';
  number?: number;
} & ChakraProps;

const medalColors = {
  author: '#0f4e47',
  gold: '#f9ad0e',
  silver: '#d1d7da',
  bronze: '#df7e08',
  dotted: '#d1d7da',
};

const darkMedalColors = {
  author: '#0c3d37',
  gold: '#e89f06',
  silver: '#c3cbcf',
  bronze: '#c67007',
  dotted: '#a5a9ac',
};

const Medal: React.FC<MedalProps> = ({ type, number, ...props }) => {
  const color = medalColors[type];
  const darkColor = darkMedalColors[type];

  const styles = type === 'dotted' ? {
    borderStyle: 'dotted',
    borderColor: '#d1d7da',
    boxShadow: 'none',
    bgGradient: 'none',
    textShadow: 'none',
  } : {
    bgGradient: `linear(to-br, ${color} 50%, ${darkColor} 50%)`,
    boxShadow: `inset 0 0 0 ${darkColor}, 2px 2px 0 rgba(0, 0, 0, 0.08)`,
    borderColor: `${color}`,
    textShadow: `0 0 4px ${darkColor}`,
  };

  return (
    <Box position="relative" mb="16px" {...props}>
      <Box
        fontFamily="'Roboto', sans-serif"
        fontSize="28px"
        fontWeight="500"
        width="56px"
        height="56px"
        borderRadius="full"
        color={type === 'dotted' ? 'black' : 'white'}
        textAlign="center"
        lineHeight="46px"
        verticalAlign="middle"
        position="relative"
        borderWidth="0.2em"
        borderStyle={styles.borderStyle}
        zIndex="1"
        boxShadow={styles.boxShadow}
        borderColor={styles.borderColor}
        textShadow={styles.textShadow}
        bgGradient={styles.bgGradient}
      >
        {number !== undefined && <Text>{number}</Text>}
      </Box>
      {type !== 'dotted' && (
        <>
          <Box
            content="''"
            display="block"
            position="absolute"
            borderStyle="solid"
            borderWidth="6px 10px"
            width="0"
            height="20px"
            top="50px"
            borderColor="#FC402D #FC402D transparent #FC402D"
            left="8px"
            transform="rotate(20deg) translateZ(-32px)"
          />
          <Box
            content="''"
            display="block"
            position="absolute"
            borderStyle="solid"
            borderWidth="6px 10px"
            width="0"
            height="20px"
            top="50px"
            borderColor="#af2c1f #af2c1f transparent #af2c1f"
            left="28px"
            transform="rotate(-20deg) translateZ(-48px)"
          />
        </>
      )}
    </Box>
  );
};

export default Medal;
