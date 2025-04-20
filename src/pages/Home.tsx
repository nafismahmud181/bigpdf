import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Button,
  useColorModeValue,
  Container,
  VStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Home = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} textAlign="center" mb={12}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading 
            size="2xl" 
            mb={4}
            bgGradient="linear(to-r, blue.500, blue.600)"
            bgClip="text"
          >
            Welcome to BigPDF
          </Heading>
          <Text 
            fontSize="xl" 
            color={useColorModeValue('gray.600', 'gray.400')}
            maxW="2xl"
            mx="auto"
          >
            Your all-in-one PDF solution. Merge, split, and compress PDF files with ease.
          </Text>
        </MotionBox>
      </VStack>
      
      <SimpleGrid 
        columns={{ base: 1, md: 3 }} 
        spacing={8}
      >
        <MotionBox
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            bg={cardBg}
            border="1px"
            borderColor={cardBorderColor}
            boxShadow="lg"
            _hover={{ boxShadow: 'xl' }}
          >
            <CardBody p={8}>
              <VStack spacing={4} align="stretch">
                <Heading size="lg" color="blue.600">Merge PDFs</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Combine multiple PDF files into one document
                </Text>
                <Button 
                  as={RouterLink} 
                  to="/merge" 
                  colorScheme="blue"
                  size="lg"
                  mt={4}
                >
                  Merge PDFs
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
        
        <MotionBox
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            bg={cardBg}
            border="1px"
            borderColor={cardBorderColor}
            boxShadow="lg"
            _hover={{ boxShadow: 'xl' }}
          >
            <CardBody p={8}>
              <VStack spacing={4} align="stretch">
                <Heading size="lg" color="blue.600">Split PDF</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Extract specific pages from your PDF document
                </Text>
                <Button 
                  as={RouterLink} 
                  to="/split" 
                  colorScheme="blue"
                  size="lg"
                  mt={4}
                >
                  Split PDF
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
        
        <MotionBox
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            bg={cardBg}
            border="1px"
            borderColor={cardBorderColor}
            boxShadow="lg"
            _hover={{ boxShadow: 'xl' }}
          >
            <CardBody p={8}>
              <VStack spacing={4} align="stretch">
                <Heading size="lg" color="blue.600">Compress PDF</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Reduce the file size of your PDF documents
                </Text>
                <Button 
                  as={RouterLink} 
                  to="/compress" 
                  colorScheme="blue"
                  size="lg"
                  mt={4}
                >
                  Compress PDF
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </SimpleGrid>
    </Container>
  );
};

export default Home; 