import { Box, Flex, Link, Heading, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.500, blue.600)',
    'linear(to-r, blue.400, blue.500)'
  );

  return (
    <Box 
      bgGradient={bgGradient}
      w="100%"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Box 
        maxW="container.xl" 
        mx="auto"
        px={6}
        py={4}
      >
        <Flex 
          h={16} 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Heading 
            size="lg" 
            color="white"
            fontWeight="bold"
            letterSpacing="tight"
          >
            <Link 
              as={RouterLink} 
              to="/" 
              _hover={{ textDecoration: 'none', opacity: 0.8 }}
            >
              BigPDF
            </Link>
          </Heading>
          <Flex gap={6}>
            <Button
              as={RouterLink}
              to="/merge"
              color="white"
              variant="ghost"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
            >
              Merge PDF
            </Button>
            <Button
              as={RouterLink}
              to="/split"
              color="white"
              variant="ghost"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
            >
              Split PDF
            </Button>
            <Button
              as={RouterLink}
              to="/compress"
              color="white"
              variant="ghost"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
            >
              Compress PDF
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Navbar; 