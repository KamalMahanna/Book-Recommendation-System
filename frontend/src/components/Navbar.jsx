import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Image,
  Input,
  IconButton,
  Container,
  VStack,
  Text,
  HStack,
  Link as ChakraLink,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!searchContainerRef.current || searchContainerRef.current.contains(event.target)) {
        return;
      }
      setIsSearchVisible(false);
      setSearchQuery('');
      setSearchResults([]);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const results = bookService.searchBooks(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <Box 
        className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}
      >
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between" gap={6} py={3}>
            <HStack spacing={8}>
              <RouterLink to="/">
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, brand.100, brand.200)"
                  bgClip="text"
                  letterSpacing="wider"
                >
                  BookFlix
                </Text>
              </RouterLink>

              {/* Navigation Menu */}
              <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
                <ChakraLink 
                  as={RouterLink} 
                  to="/" 
                  _hover={{ color: 'brand.100' }}
                  fontSize="lg"
                >
                  Home
                </ChakraLink>
              </HStack>
            </HStack>

            {/* Integrated Search Component */}
            <Flex flex={1} position="relative" ref={searchContainerRef} justify="flex-end" align="center">
              <Box
                w={isSearchVisible ? "400px" : "40px"}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
              >
                  <InputGroup size="md">
                    <Input
                      placeholder="Search for books..."
                      variant="filled"
                      bg="rgba(255,255,255,0.1)"
                      border="none"
                      opacity={isSearchVisible ? 1 : 0}
                      transition="opacity 0.3s ease"
                      _focus={{
                        bg: "rgba(255,255,255,0.15)",
                        borderColor: "brand.100"
                      }}
                      _hover={{
                        bg: "rgba(255,255,255,0.15)"
                      }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      pl={isSearchVisible ? "1rem" : "2.5rem"}
                      pr="2.5rem"
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                    <InputRightElement>
                      <IconButton
                        icon={isSearchVisible ? <CloseIcon boxSize={3} /> : <SearchIcon boxSize={5} />}
                        variant="ghost"
                        size={isSearchVisible ? "sm" : "md"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSearchVisible) {
                            setSearchQuery('');
                            setSearchResults([]);
                          }
                          setIsSearchVisible(!isSearchVisible);
                        }}
                        aria-label={isSearchVisible ? "Close search" : "Open search"}
                        color={isSearchVisible ? "gray.400" : "white"}
                        _hover={{ color: 'brand.100' }}
                        transition="all 0.3s ease"
                      />
                    </InputRightElement>
                  </InputGroup>
              </Box>

              {/* Search Results Dropdown */}
              {searchQuery && (
                <Box
                  position="absolute"
                  top="calc(100% + 8px)"
                  right="0"
                  width="400px"
                  bg="rgba(20, 20, 20, 0.85)"
                  backdropFilter="blur(20px) saturate(180%)"
                  sx={{
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                  borderRadius="xl"
                  border="1px solid rgba(255,255,255,0.1)"
                  zIndex={1001}
                  boxShadow="0 8px 32px rgba(0,0,0,0.4)"
                  maxH="60vh"
                  overflowY="auto"
                  opacity={searchResults.length > 0 ? 1 : 0}
                  visibility={searchResults.length > 0 ? "visible" : "hidden"}
                  transform={searchResults.length > 0 ? 'translateY(0)' : 'translateY(-20px)'}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Container maxW="container.xl" py={2}>
                    <VStack align="stretch" spacing={2}>
                      {searchResults.map((book) => (
                        <ChakraLink
                          key={book.isbn}
                          as={RouterLink}
                          to={`/book/${book.isbn}`}
                          _hover={{ textDecoration: 'none' }}
                          onClick={() => {
                            setIsSearchVisible(false);
                            setSearchQuery('');
                            setSearchResults([]);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <Flex 
                            gap={4} 
                            className="search-result-item" 
                            p={3}
                            borderRadius="md"
                            transition="all 0.2s ease"
                            _hover={{
                              bg: "rgba(255,255,255,0.15)",
                              transform: "translateX(4px)"
                            }}
                          >
                            <Image
                              src={book.image_url}
                              alt={book.title}
                              boxSize="80px"
                              objectFit="cover"
                              fallbackSrc="https://via.placeholder.com/80x120/141414/FFFFFF?text=No+Cover"
                            />
                            <Box>
                              <Text fontSize="lg" fontWeight="bold">{book.title}</Text>
                              <Text fontSize="sm" color="gray.400">
                                {book.author}
                              </Text>
                            </Box>
                          </Flex>
                        </ChakraLink>
                      ))}
                    </VStack>
                  </Container>
                </Box>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export default Navbar;
