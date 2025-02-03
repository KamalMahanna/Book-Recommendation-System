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
import axios from 'axios';

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
    const timer = setTimeout(async () => {
      if (searchQuery) {
        try {
          const response = await axios.get(`http://localhost:8000/api/search?query=${searchQuery}`);
          // Parse the response text as JSON if needed
          const results = typeof response.data === 'string' 
            ? JSON.parse(`[${response.data.replace(/}{/g, '},{')}]`)
            : response.data;
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        }
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

            {/* Search Input */}
            <Flex align="center" flex={1} justify="flex-end" mr={2} position="relative" ref={searchContainerRef}>
              <Box
                className={`navbar-search ${isSearchVisible ? 'open' : ''}`}
                w={isSearchVisible ? "400px" : "0"}
                transition="width 0.3s ease"
                overflow="hidden"
              >
                <InputGroup>
                  <Input
                    placeholder="Search for books..."
                    size="md"
                    variant="filled"
                    bg="rgba(255,255,255,0.1)"
                    border="none"
                    _focus={{
                      bg: "rgba(255,255,255,0.15)",
                      borderColor: "brand.100"
                    }}
                    _hover={{
                      bg: "rgba(255,255,255,0.15)"
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    pr="2.5rem"
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                  {isSearchVisible && (
                    <InputRightElement>
                      <IconButton
                        icon={<CloseIcon boxSize={3} />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSearchVisible(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        aria-label="Close search"
                        color="gray.400"
                        _hover={{ color: 'brand.100' }}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
              </Box>
              {!isSearchVisible && (
                <IconButton
                  icon={<SearchIcon boxSize={5} />}
                  variant="ghost"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsSearchVisible(true);
                  }}
                  aria-label="Search"
                  _hover={{ color: 'brand.100' }}
                  size="md"
                />
              )}

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
