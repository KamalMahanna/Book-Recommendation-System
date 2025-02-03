import { Box, Text, useToken, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import BookCard from './BookCard';
import { useRef } from 'react';

const MotionBox = motion(Box);

function BookCarousel({ title, books, bgColor, borderColor }) {
  const [brandRed] = useToken('colors', ['brand.200']);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    swipe: false,
    arrows: false,
    nextArrow: null,
    prevArrow: null,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      mb={10}
      className="carousel-container"
      position="relative"
      _hover={{
        '.custom-arrow': {
          opacity: 1,
        },
      }}
    >
      <Box 
        px={8} 
        position="relative" 
        _hover={{
          '& > .section-title': {
            color: 'white',
          },
        }}
      >
        <Text
          className="section-title"
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          color={brandRed}
          textShadow="0 0 10px rgba(229, 9, 20, 0.3)"
          transition="color 0.3s ease"
        >
          {title}
        </Text>
      </Box>
      <Box className="book-carousel" overflow="visible" mx={-2} px={12}>
        {/* Custom Navigation Arrows */}
        <IconButton
          icon={<ChevronLeftIcon w={8} h={8} />}
          variant="ghost"
          position="absolute"
          left="40px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => sliderRef.current?.slickPrev()}
          className="custom-arrow custom-prev"
          opacity={0}
          transition="opacity 0.3s ease"
          _hover={{
            bg: 'rgba(0,0,0,0.5)',
          }}
          aria-label="Previous"
          size="lg"
          borderRadius="full"
        />
        
        <IconButton
          icon={<ChevronRightIcon w={8} h={8} />}
          variant="ghost"
          position="absolute"
          right="40px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => sliderRef.current?.slickNext()}
          className="custom-arrow custom-next"
          opacity={0}
          transition="opacity 0.3s ease"
          _hover={{
            bg: 'rgba(0,0,0,0.5)',
          }}
          aria-label="Next"
          size="lg"
          borderRadius="full"
        />

        <Slider ref={sliderRef} {...settings}>
          {books.map((book) => (
            <BookCard
              key={book.isbn}
              book={book}
              bgColor={bgColor}
              borderColor={borderColor}
            />
          ))}
        </Slider>
      </Box>
    </MotionBox>
  );
}

export default BookCarousel;
