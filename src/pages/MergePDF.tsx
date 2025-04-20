import { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Text,
  Progress,
  SimpleGrid,
  Card,
  CardBody,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { PDFService } from '../services/pdfService';
import { Document, Page } from 'react-pdf';
import { DeleteIcon } from '@chakra-ui/icons';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      
      // Create preview URLs for the new files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
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

  return (
    <Box>
      <Heading mb={6}>Merge PDFs</Heading>
      <VStack spacing={6} align="stretch">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <Button
          as="label"
          htmlFor="file-upload"
          colorScheme="blue"
          variant="outline"
          cursor="pointer"
        >
          Select PDF Files
        </Button>
        
        {files.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {files.map((file, index) => (
              <Card key={index} position="relative">
                <CardBody p={2}>
                  <Flex direction="column" align="center">
                    <Box position="relative" width="100%" height="200px" overflow="hidden">
                      <Document file={previewUrls[index]}>
                        <Page 
                          pageNumber={1} 
                          width={200}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </Box>
                    <Text mt={2} fontSize="sm" noOfLines={1}>
                      {file.name}
                    </Text>
                    <IconButton
                      aria-label="Remove file"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => removeFile(index)}
                    />
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {isProcessing && <Progress size="xs" isIndeterminate />}
        <Button
          colorScheme="blue"
          onClick={handleMerge}
          isDisabled={files.length < 2 || isProcessing}
        >
          Merge PDFs
        </Button>
      </VStack>
    </Box>
  );
};

export default MergePDF; 