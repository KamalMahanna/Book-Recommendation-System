import { Box, Image, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function BookCard({ book, bgColor = 'rgba(0, 0, 0, 0.7)', borderColor = '#e50914' }) {
  const MotionImage = motion(Image);
  const MotionHStack = motion(HStack);

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <RouterLink to={`/book/${book.isbn}`} onClick={handleClick}>
      <MotionBox
        className="book-card"
        whileHover={{ 
          scale: 1.5,
          zIndex: 2,
          transition: { duration: 0.3 }
        }}
        initial={{ scale: 1 }}
        style={{ transformOrigin: 'center center' }}
      >
        <Box 
          position="relative" 
          overflow="hidden" 
          borderRadius="md"
          boxShadow="lg"
          aspectRatio="2/3"
        >
          <MotionImage
            src={book.image_url}
            alt={book.title}
            w="100%"
            h="100%"
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/300x450/141414/FFFFFF?text=No+Cover"
            initial={{ filter: 'brightness(0.9)' }}
            whileHover={{ 
              scale: 1.1,
              filter: 'brightness(1)'
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          />
          
          {/* Info Overlay */}
          <Box
            className="book-info"
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg={bgColor}
            borderTop={`4px solid ${borderColor}`}
            transform="translateY(100%)"
            transition="transform 0.3s ease"
            _groupHover={{ transform: "translateY(0)" }}
            backdropFilter="blur(8px)"
          >
            <VStack align="stretch" spacing={3} p={4}>
              <Text 
                fontWeight="bold" 
                fontSize="md" 
                noOfLines={2}
                lineHeight="tight"
                textShadow="0 2px 4px rgba(0,0,0,0.4)"
                className="text-glow"
              >
                {book.title}
              </Text>
              
              <Text 
                fontSize="sm" 
                color="gray.300" 
                noOfLines={1}
                opacity={0.9}
              >
                {book.author}
              </Text>
              
              <MotionHStack 
                spacing={2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Icon as={StarIcon} color="yellow.400" />
                <Text fontSize="sm" color="gray.300">
                  {book.rating.toFixed(1)} ({book.total_reviewers.toLocaleString()})
                </Text>
              </MotionHStack>

              <Text 
                fontSize="sm" 
                color="gray.400"
                opacity={0.8}
              >
                {book.year} • {book.publisher}
              </Text>
            </VStack>
          </Box>
        </Box>
      </MotionBox>
    </RouterLink>
  );
}

export default BookCard;
