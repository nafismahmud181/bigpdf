import { 
  ChakraProvider, 
  Box, 
  Container,
  useColorModeValue,
  ColorModeScript
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MergePDF from './pages/MergePDF';
import SplitPDF from './pages/SplitPDF';
import CompressPDF from './pages/CompressPDF';
import theme from './theme';

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Box minH="100vh" bg={bgColor} w="100vw" overflowX="hidden">
          <Navbar />
          <Box w="100%" px={4}>
            <Container maxW="container.xl" py={8} px={0}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/merge" element={<MergePDF />} />
                <Route path="/split" element={<SplitPDF />} />
                <Route path="/compress" element={<CompressPDF />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
