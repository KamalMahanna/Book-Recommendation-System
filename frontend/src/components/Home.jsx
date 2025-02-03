import { useState, useEffect, useRef } from 'react';
import { Box, Container, Text, Button, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CSSTransition } from 'react-transition-group';
import { StarIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import BookCarousel from './BookCarousel';
import LoadingSpinner from './LoadingSpinner';

const MotionBox = motion(Box);
const MotionText = motion(Text);

function Home() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [featuredBook, setFeaturedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularBooksData = bookService.getPopularBooks(20);
        setPopularBooks(popularBooksData);
        
        // Set a random popular book as featured
        if (popularBooksData.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, popularBooksData.length));
          setFeaturedBook(popularBooksData[randomIndex]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <CSSTransition
      in={!isLoading}
      appear={true}
      timeout={500}
      classNames="book-details"
      nodeRef={nodeRef}
      unmountOnExit
    >
      <Box ref={nodeRef} as="main">
        {/* Hero Section */}
        {featuredBook && (
          <MotionBox
            className="hero-section"
            position="relative"
            height="85vh"
            backgroundImage={`url(${featuredBook.image_url})`}
            backgroundSize="cover"
            backgroundPosition="center"
            mb={20}
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
              bg: 'linear-gradient(to bottom, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.7) 50%, rgba(20,20,20,0.95) 100%)',
              pointerEvents: 'none',
            }}
          >
            <Box 
              className="hero-content"
              position="relative"
              height="100%"
              display="flex"
              alignItems="flex-end"
              pb={20}
            >
              <Container maxW="container.xl">
                <Box maxW="600px">
                  <MotionText
                    fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                    fontWeight="bold"
                    mb={4}
                    textShadow="0 2px 8px rgba(0,0,0,0.6)"
                    lineHeight="1.2"
                    className="text-glow"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  >
                    {featuredBook.title}
                  </MotionText>
                  <MotionText
                    fontSize={{ base: 'lg', md: 'xl' }}
                    mb={4}
                    textShadow="0 2px 4px rgba(0,0,0,0.6)"
                    className="text-glow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                  >
                    By {featuredBook.author}
                  </MotionText>
                  <HStack 
                    spacing={4} 
                    mb={6}
                    fontSize={{ base: 'sm', md: 'md' }}
                    opacity={0.9}
                    textShadow="0 1px 2px rgba(0,0,0,0.6)"
                  >
                    <HStack>
                      <Icon as={StarIcon} color="yellow.400" />
                      <Text>
                        {featuredBook.rating.toFixed(1)} ({featuredBook.total_reviewers.toLocaleString()} reviews)
                      </Text>
                    </HStack>
                    <Text>•</Text>
                    <Text>{featuredBook.year}</Text>
                    <Text>•</Text>
                    <Text>{featuredBook.publisher}</Text>
                  </HStack>
                  <Button
                    size="lg"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => navigate(`/book/${featuredBook.isbn}`)}
                    className="glass-card"
                    bg="rgba(229, 9, 20, 0.9)"
                    _hover={{
                      bg: 'rgba(229, 9, 20, 1)',
                      transform: 'scale(1.05)',
                    }}
                    _active={{
                      bg: 'rgba(229, 9, 20, 0.8)',
                    }}
                    transition="all 0.3s ease"
                  >
                    View Details
                  </Button>
                </Box>
              </Container>
            </Box>
          </MotionBox>
        )}

        {/* Book Carousels */}
        <Container maxW="container.xl" pb={20}>
          {/* Popular Books */}
          {popularBooks.length > 0 && (
            <BookCarousel
              title="Popular Books"
              books={popularBooks}
              bgColor="rgba(20, 20, 20, 0.95)"
              borderColor="#e50914"
            />
          )}

          {/* Additional carousels will be added when correlation and content-based recommendations are implemented */}
          {featuredBook && (
            <>
              {/* Similar Books (Correlation-based) */}
              <CorrelationCarousel isbn={featuredBook.isbn} />
              
              {/* Content-Based Recommendations */}
              <ContentBasedCarousel isbn={featuredBook.isbn} />
            </>
          )}
        </Container>
      </Box>
    </CSSTransition>
  );
}

// Carousel components for different recommendation types
function CorrelationCarousel({ isbn }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const recommendations = bookService.getCorrelationRecommendations(isbn);
        setBooks(recommendations);
      } catch (error) {
        console.error('Error fetching correlation recommendations:', error);
      }
    };

    fetchBooks();
  }, [isbn]);

  return books.length > 0 ? (
    <BookCarousel
      title="Similar Books You Might Like"
      books={books}
      bgColor="rgba(16, 56, 9, 0.95)"
      borderColor="#28fc03"
    />
  ) : null;
}

function ContentBasedCarousel({ isbn }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const recommendations = bookService.getContentBasedRecommendations(isbn);
        setBooks(recommendations);
      } catch (error) {
        console.error('Error fetching content-based recommendations:', error);
      }
    };

    fetchBooks();
  }, [isbn]);

  return books.length > 0 ? (
    <BookCarousel
      title="Books with Similar Content"
      books={books}
      bgColor="rgba(69, 65, 8, 0.95)"
      borderColor="#fcec03"
    />
  ) : null;
}

export default Home;
