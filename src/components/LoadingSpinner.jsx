import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulseKeyframes = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

function LoadingSpinner() {
  const fadeInAnimation = `${fadeIn} 0.6s ease-out`;
  const pulseAnimation = `${pulseKeyframes} 1.5s ease-in-out infinite`;
  const fadeAnimation = `${fadeInOut} 1.2s ease-in-out infinite`;

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="netflix.black"
      animation={fadeInAnimation}
    >
      <Box
        position="relative"
        width="50px"
        height="50px"
        animation={pulseAnimation}
      >
        {/* Netflix-inspired loading animation */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="brand.200"
          clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)"
          animation={fadeAnimation}
          backdropFilter="blur(8px)"
        />
        <Box
          position="absolute"
          top="20%"
          left="20%"
          width="60%"
          height="60%"
          bg="netflix.black"
          transform="rotate(45deg)"
          borderRadius="2px"
        />
      </Box>
    </Box>
  );
}

export default LoadingSpinner;
