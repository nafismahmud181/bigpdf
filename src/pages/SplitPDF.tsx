import { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Text,
  Progress,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { PDFService } from '../services/pdfService';
import { supabase } from '../lib/supabase';

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumbers, setPageNumbers] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSplit = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const pages = pageNumbers
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    if (pages.length === 0) {
      toast({
        title: 'Error',
        description: 'Please enter valid page numbers',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const splitPdfs = await PDFService.splitPDF(file, pages);
      
      // Upload each split PDF to Supabase storage
      for (let i = 0; i < splitPdfs.length; i++) {
        const fileName = `split-page-${pages[i]}-${Date.now()}.pdf`;
        const { error } = await supabase.storage
          .from('pdfs')
          .upload(fileName, splitPdfs[i], {
            contentType: 'application/pdf',
          });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('pdfs')
          .getPublicUrl(fileName);

        // Create download link
        const link = document.createElement('a');
        link.href = publicUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: 'Success',
        description: 'PDF split successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to split PDF',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Heading mb={6}>Split PDF</Heading>
      <VStack spacing={4} align="stretch">
        <input
          type="file"
          accept=".pdf"
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
          Select PDF File
        </Button>
        <Text>
          {file ? `Selected: ${file.name}` : 'No file selected'}
        </Text>
        
        <FormControl>
          <FormLabel>Page Numbers (comma-separated)</FormLabel>
          <Input
            placeholder="e.g., 1, 3, 5"
            value={pageNumbers}
            onChange={(e) => setPageNumbers(e.target.value)}
          />
        </FormControl>

        {isProcessing && <Progress size="xs" isIndeterminate />}
        <Button
          colorScheme="blue"
          onClick={handleSplit}
          isDisabled={!file || !pageNumbers || isProcessing}
        >
          Split PDF
        </Button>
      </VStack>
    </Box>
  );
};

export default SplitPDF; 