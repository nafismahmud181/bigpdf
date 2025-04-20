import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFileImage, FaFileWord, FaFilePowerpoint, FaFileExcel } from 'react-icons/fa';
import { BiMerge } from 'react-icons/bi';
import { MdPictureAsPdf, MdCompress } from 'react-icons/md';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

const ToolCard = ({ icon, title, description, to }: ToolCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const iconBg = useColorModeValue('purple.50', 'purple.900');
  
  return (
    <RouterLink to={to}>
      <Box
        p={6}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
      >
        <Box
          bg={iconBg}
          w="50px"
          h="50px"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="purple.500"
          fontSize="24px"
          mb={4}
        >
          {icon}
        </Box>
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {title}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      </Box>
    </RouterLink>
  );
};

const Home = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, white)',
    'linear(to-br, gray.900, gray.800)'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const purpleTextColor = useColorModeValue('purple.500', 'purple.300');

  const tools = [
    {
      icon: <FaFileImage />,
      title: 'Image to PDF',
      description: 'Convert your images to PDF format easily',
      to: '/image-to-pdf',
    },
    {
      icon: <FaFileWord />,
      title: 'Word to PDF',
      description: 'Convert Word documents to PDF format',
      to: '/word-to-pdf',
    },
    {
      icon: <FaFilePowerpoint />,
      title: 'PPT to PDF',
      description: 'Convert PowerPoint presentations to PDF',
      to: '/ppt-to-pdf',
    },
    {
      icon: <FaFileExcel />,
      title: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF format',
      to: '/excel-to-pdf',
    },
    {
      icon: <MdPictureAsPdf />,
      title: 'Edit PDF',
      description: 'Edit your PDF files with ease',
      to: '/edit-pdf',
    },
    {
      icon: <BiMerge />,
      title: 'Merge PDF',
      description: 'Combine multiple PDFs into one file',
      to: '/merge',
    },
    {
      icon: <MdCompress />,
      title: 'Compress PDF',
      description: 'Reduce PDF file size without losing quality',
      to: '/compress-pdf',
    },
    {
      icon: <FaFileExcel />,
      title: 'Split PDF',
      description: 'Split your PDF into multiple files',
      to: '/split',
    },
  ];

  return (
    <Box bgGradient={bgGradient} minH="calc(100vh - 60px)" py={20}>
      <Container maxW="container.xl">
        {/* Hero Section */}
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          mb={20}
          gap={10}
        >
          <VStack align="flex-start" spacing={6} flex={1}>
            <Heading
              as="h1"
              size="2xl"
              lineHeight="shorter"
              color={textColor}
            >
              Simplify Your PDF Tasks with{' '}
              <Text as="span" color={purpleTextColor}>
                Big PDF
              </Text>
            </Heading>
            <Text fontSize="xl" color="gray.500">
              All the tools you'll need to be more productive and work smarter with documents.
            </Text>
            <Flex gap={4}>
              <Button
                as={RouterLink}
                to="/tools"
                colorScheme="purple"
                size="lg"
                px={8}
              >
                Explore all PDF Tools
              </Button>
              <Button
                as={RouterLink}
                to="/pricing"
                variant="outline"
                colorScheme="purple"
                size="lg"
                px={8}
              >
                Free Trial
              </Button>
            </Flex>
          </VStack>
          
          <Box flex={1} position="relative">
            <Image
              src="/hero-illustration.svg"
              alt="PDF Tools Illustration"
              w="full"
              maxW="600px"
              mx="auto"
            />
          </Box>
        </Flex>

        {/* Popular Tools Section */}
        <VStack spacing={12}>
          <VStack spacing={4}>
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
            >
              Most Popular{' '}
              <Text as="span" color={purpleTextColor}>
                PDF Tools
              </Text>
            </Heading>
            <Text
              fontSize="lg"
              color="gray.500"
              textAlign="center"
              maxW="container.md"
              mx="auto"
            >
              Transform your document workflow with our comprehensive suite of PDF tools
            </Text>
          </VStack>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={6}
          >
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </Grid>

          <Button
            as={RouterLink}
            to="/tools"
            variant="outline"
            colorScheme="purple"
            size="lg"
            px={8}
          >
            See all PDF Tools
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home; 