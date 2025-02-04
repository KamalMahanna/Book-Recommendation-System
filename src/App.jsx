import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BookDetails from './components/BookDetails';
import './styles/slick.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="#141414" pt={6}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:isbn" element={<BookDetails />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
