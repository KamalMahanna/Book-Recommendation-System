import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import {
  Box,
  Container,
  Image,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import BookCarousel from './BookCarousel';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionImage = motion(Image);

function BookDetails() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [correlationBooks, setCorrelationBooks] = useState([]);
  const [contentBooks, setContentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const nodeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    
    const fetchData = async () => {
      // Add slight delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      try {
        // Search for the book details
        const searchResponse = await axios.get(`http://localhost:8000/api/search?query=${isbn}&limit=1`);
        if (searchResponse.data.length > 0) {
          setBook(searchResponse.data[0]);
          
          // Fetch recommendations
          const [correlationResponse, contentResponse] = await Promise.all([
            axios.get(`http://localhost:8000/api/correlation/${isbn}`),
            axios.get(`http://localhost:8000/api/content/${isbn}`)
          ]);
          
          setCorrelationBooks(correlationResponse.data);
          setContentBooks(contentResponse.data);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isbn]);

  // Show loading spinner while fetching data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show message if book not found
  if (!book) {
    return (
      <Container maxW="container.xl" py={20}>
        <Text fontSize="2xl">Book not found</Text>
      </Container>
    );
  }

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={600}
      classNames="book-details"
      nodeRef={nodeRef}
      unmountOnExit
    >
      <Box ref={nodeRef} as="main">
        {/* Hero Section */}
        <MotionBox
          className="hero-section"
          position="relative"
          backgroundImage={`url(${book.image_url})`}
          backgroundSize="cover"
          backgroundPosition="center"
          mb={20}
          height="80vh"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: location.pathname==='/' ? 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,0.4) 70%, rgba(20,20,20,0.8) 100%)' : 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Container maxW="container.xl" height="100%">
          <Box 
            position="relative"
            height="100%"
            display="flex"
            alignItems="flex-end"
            pb={20}
          zIndex={location.pathname==='/' ? 1 : 2}
          >
            <HStack spacing={8} align="flex-start">
              {/* Book Cover */}
              <MotionBox
                className="glass-card"
                p={2}
                width="300px"
                flexShrink={0}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <MotionImage
                  src={book.image_url}
                  alt={book.title}
                  width="100%"
                  height="400px"
                  objectFit="cover"
                  borderRadius="md"
                  fallbackSrc="https://via.placeholder.com/300x450/141414/FFFFFF?text=No+Cover"
                  initial={{ }}
                  whileHover={{ filter: 'brightness(1)' }}
                  transition={{ duration: 0.3 }}
                />
              </MotionBox>

              {/* Book Info */}
              <VStack align="flex-start" spacing={4} flex={1}>
                <MotionText
                  fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                  fontWeight="bold"
                  textShadow="0 2px 8px rgba(0,0,0,0.8)"
                  lineHeight="1.2"
                  className="text-glow"
                  color="white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {book.title}
                </MotionText>
                
                <MotionText
                  fontSize={{ base: 'xl', md: '2xl' }}
                  textShadow="0 2px 4px rgba(0,0,0,0.8)"
                  className="text-glow"
                  color="white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  By {book.author}
                </MotionText>

                <HStack 
                  spacing={4} 
                  fontSize={{ base: 'sm', md: 'md' }}
                  textShadow="0 1px 2px rgba(0,0,0,0.8)"
                  color="white"
                >
                  <HStack>
                    <Icon as={StarIcon} color="yellow.400" />
                    <Text>
                      {book.rating.toFixed(1)} ({book.total_reviewers.toLocaleString()} reviews)
                    </Text>
                  </HStack>
                  <Text>•</Text>
                  <Text>{book.year}</Text>
                  <Text>•</Text>
                  <Text>{book.publisher}</Text>
                </HStack>

                <Text 
                  fontSize="md" 
                  maxW="800px" 
                  color="white"
                  textShadow="0 1px 2px rgba(0,0,0,0.8)"
                >
                  ISBN: {book.isbn}
                </Text>

              </VStack>
            </HStack>
          </Box>
        </Container>
      </MotionBox>

      {/* Recommendations */}
      <Container maxW="container.xl" pb={20}>
        <Divider mb={10} opacity={0.2} />
        
        {/* Similar Books (Correlation-based) */}
        {correlationBooks.length > 0 && (
          <BookCarousel
            title="Similar Books You Might Like"
            books={correlationBooks}
            bgColor="rgba(16, 56, 9, 0.95)"
            borderColor="#28fc03"
          />
        )}
        
        {/* Content-Based Recommendations */}
        {contentBooks.length > 0 && (
          <BookCarousel
            title="Books with Similar Content"
            books={contentBooks}
            bgColor="rgba(69, 65, 8, 0.95)"
            borderColor="#fcec03"
          />
        )}
      </Container>
      </Box>
    </CSSTransition>
  );
}

export default BookDetails;
