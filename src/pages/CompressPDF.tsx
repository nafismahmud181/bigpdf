import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  useToast,
  Progress,
  HStack,
  Icon,
  List,
  ListItem,
  ListIcon,
  Radio,
  RadioGroup,
  Stack,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { PDFService } from '../services/pdfService';
import { useDropzone } from 'react-dropzone';
import { DeleteIcon } from '@chakra-ui/icons';
import { FiFileText, FiUpload, FiZoomOut } from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { formatFileSize } from '../utils/fileUtils';

type CompressionQuality = 'low' | 'medium' | 'high';

const CompressionOptions = {
  low: {
    label: 'Maximum Compression',
    description: 'Smallest file size, reduced quality',
    reduction: '70-80%'
  },
  medium: {
    label: 'Balanced',
    description: 'Good balance of size and quality',
    reduction: '50-60%'
  },
  high: {
    label: 'Minimum Compression',
    description: 'Best quality, moderate size reduction',
    reduction: '30-40%'
  }
};

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState<CompressionQuality>('medium');
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0];
      if (pdfFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF file',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      setFile(pdfFile);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressedPdfBytes = await PDFService.compressPDF(file, quality);
      
      // Create and download the compressed file
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'PDF compressed successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to compress PDF',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    'Reduce PDF file size while maintaining readability',
    'Choose from three compression levels',
    'Fast and secure compression'
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={4}>Compress PDF</Heading>
          <Text color="gray.600" fontSize="lg">
            Reduce your PDF file size while maintaining the best possible quality.
            Perfect for sharing via email or uploading to websites.
          </Text>
        </Box>

        {/* Drop Zone */}
        <Box
          {...getRootProps()}
          bg={isDragActive ? 'purple.600' : 'purple.500'}
          borderRadius="xl"
          p={10}
          textAlign="center"
          position="relative"
          cursor="pointer"
          borderWidth={2}
          borderStyle="dashed"
          borderColor={isDragActive ? 'white' : 'whiteAlpha.500'}
          transition="all 0.2s"
          _hover={{ bg: 'purple.600', borderColor: 'white' }}
        >
          <input {...getInputProps()} />
          <VStack spacing={4}>
            <Icon 
              as={isDragActive ? FiUpload : FiZoomOut} 
              w={16} 
              h={16} 
              color="white"
              transition="transform 0.2s"
              transform={isDragActive ? 'scale(1.1)' : 'scale(1)'}
            />
            <Button
              colorScheme="white"
              variant="outline"
              size="lg"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              CHOOSE PDF FILE
            </Button>
            <Text color="white" fontSize="sm">
              {isDragActive ? 'Drop your PDF file here' : 'or drop file here'}
            </Text>
          </VStack>
        </Box>

        {/* Feature List */}
        <List spacing={3}>
          {features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={BsCheckCircleFill} color="green.500" />
              <Text>{feature}</Text>
            </ListItem>
          ))}
        </List>

        {/* Selected File and Compression Options */}
        {file && (
          <VStack spacing={6} align="stretch">
            <Flex
              p={4}
              bg="gray.50"
              borderRadius="md"
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack spacing={4}>
                <Icon as={FiFileText} w={6} h={6} color="purple.500" />
                <VStack align="flex-start" spacing={0}>
                  <Text fontWeight="medium">{file.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatFileSize(file.size)}
                  </Text>
                </VStack>
              </HStack>
              <IconButton
                aria-label="Remove file"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => setFile(null)}
              />
            </Flex>

            <Box>
              <Text fontWeight="medium" mb={4}>Compression Level</Text>
              <RadioGroup value={quality} onChange={(value: CompressionQuality) => setQuality(value)}>
                <Stack direction="column" spacing={4}>
                  {(Object.entries(CompressionOptions) as [CompressionQuality, typeof CompressionOptions.low][]).map(([key, option]) => (
                    <Box
                      key={key}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor={quality === key ? 'purple.500' : 'gray.200'}
                      _hover={{ borderColor: 'purple.500' }}
                    >
                      <Radio value={key} size="lg">
                        <Box ml={2}>
                          <Text fontWeight="medium">{option.label}</Text>
                          <Text fontSize="sm" color="gray.500">{option.description}</Text>
                          <Text fontSize="sm" color="purple.500">Size reduction: {option.reduction}</Text>
                        </Box>
                      </Radio>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          </VStack>
        )}

        {isProcessing && <Progress size="xs" isIndeterminate />}
        
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleCompress}
          isDisabled={!file || isProcessing}
          isLoading={isProcessing}
          loadingText="Compressing PDF..."
        >
          Compress PDF
        </Button>
      </VStack>
    </Container>
  );
};

export default CompressPDF; 