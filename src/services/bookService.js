import popularBooks from '../data/popular_books.json';
import corrRecDict from '../data/corr_rec_dict.json';
import contRec from '../data/cont_rec.json';
import booksData from '../data/books_data.json';

// Initialize data references
const initialize = () => {
  if (!popularBooks || !corrRecDict || !contRec || !booksData) {
    console.error('Failed to load data files');
    return false;
  }
  return true;
};

// Get popular books
export const getPopularBooks = (top = 5) => {
  if (!initialize()) return [];
  return popularBooks.slice(0, top).map(isbn => {
    const bookDetails = booksData[isbn];
    return formatBookDetails(isbn, bookDetails);
  });
};

// Get correlation-based recommendations
export const getCorrelationRecommendations = (isbn, top = 5) => {
  if (!initialize() || !corrRecDict[isbn]) return [];
  
  return corrRecDict[isbn]
    .slice(0, top)
    .map(recIsbn => {
      const bookDetails = booksData[recIsbn];
      return bookDetails ? formatBookDetails(recIsbn, bookDetails) : null;
    })
    .filter(book => book !== null);
};

// Get content-based recommendations
export const getContentBasedRecommendations = (isbn, top = 5) => {
  if (!initialize() || !contRec[isbn]) return [];
  
  return contRec[isbn]
    .slice(0, top)
    .map(recIsbn => {
      const bookDetails = booksData[recIsbn];
      return bookDetails ? formatBookDetails(recIsbn, bookDetails) : null;
    })
    .filter(book => book !== null);
};

// Search books
export const searchBooks = (query, limit = 10) => {
  if (!initialize()) return [];
  const lowerQuery = query.toLowerCase();
  
  return Object.entries(booksData)
    .filter(([isbn, book]) => 
      book['Book-Title'].toLowerCase().includes(lowerQuery) ||
      book['Book-Author'].toLowerCase().includes(lowerQuery) ||
      isbn.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit)
    .map(([isbn, book]) => formatBookDetails(isbn, book));
};

// Helper function to format book details
const formatBookDetails = (isbn, book) => ({
  isbn: String(isbn),
  title: String(book['Book-Title']),
  author: String(book['Book-Author']),
  year: Number(book['Year-Of-Publication']),
  publisher: String(book.Publisher),
  image_url: String(book['Image-URL-L']),
  rating: Number(book['Book-Rating']),
  total_reviewers: Number(book['Total-Reviewers'])
});

// Initialize data when imported
initialize();

export default {
  getPopularBooks,
  getCorrelationRecommendations,
  getContentBasedRecommendations,
  searchBooks
};
