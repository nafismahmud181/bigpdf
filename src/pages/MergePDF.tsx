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
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { PDFService } from '../services/pdfService';
import { useDropzone } from 'react-dropzone';
import { DeleteIcon } from '@chakra-ui/icons';
import { FiFileText, FiUpload } from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      toast({
        title: 'Invalid file type',
        description: 'Please select only PDF files',
        status: 'error',
        duration: 3000,
      });
    }
    setFiles(prev => [...prev, ...pdfFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: 'Error',
        description: 'Please select at least 2 PDF files to merge',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFService.mergePDFs(files);
      
      const blob = new Blob([mergedPdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'PDFs merged successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Merge error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to merge PDFs',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    'Merge multiple PDFs into a single file in seconds',
    'Works online on any device and operating system',
    'Trusted by 1.7 billion people since 2013'
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={4}>Merge PDF</Heading>
          <Text color="gray.600" fontSize="lg">
            Quickly and easily combine multiple PDF files into a single, professional document
            online. Our free PDF merger is user-friendly, fast, and doesn't add any watermarks to
            your documents.
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
              as={isDragActive ? FiUpload : FiFileText} 
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
              CHOOSE FILES
            </Button>
            <Text color="white" fontSize="sm">
              {isDragActive ? 'Drop your PDF files here' : 'or drop files here'}
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

        {/* Selected Files */}
        {files.length > 0 && (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold" fontSize="lg">
              Selected Files ({files.length})
            </Text>
            <VStack spacing={2} align="stretch">
              {files.map((file, index) => (
                <Flex
                  key={index}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <HStack spacing={4}>
                    <Icon as={FiFileText} w={6} h={6} color="purple.500" />
                    <Text>{file.name}</Text>
                  </HStack>
                  <IconButton
                    aria-label="Remove file"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                  />
                </Flex>
              ))}
            </VStack>
          </VStack>
        )}

        {isProcessing && <Progress size="xs" isIndeterminate />}
        
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleMerge}
          isDisabled={files.length < 2 || isProcessing}
          isLoading={isProcessing}
          loadingText="Merging PDFs..."
        >
          Merge PDFs
        </Button>
      </VStack>
    </Container>
  );
};

export default MergePDF; 