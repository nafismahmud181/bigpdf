import { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Text,
  Progress,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { PDFService } from '../services/pdfService';
import { supabase } from '../lib/supabase';

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const compressedPdf = await PDFService.compressPDF(file);
      
      // Upload to Supabase storage
      const fileName = `compressed-${Date.now()}.pdf`;
      const { error } = await supabase.storage
        .from('pdfs')
        .upload(fileName, compressedPdf, {
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

      toast({
        title: 'Success',
        description: 'PDF compressed successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to compress PDF',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Heading mb={6}>Compress PDF</Heading>
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
          <FormLabel>Compression Level</FormLabel>
          <Slider
            value={compressionLevel}
            onChange={setCompressionLevel}
            min={0}
            max={100}
            step={1}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text mt={2} textAlign="center">
            {compressionLevel}%
          </Text>
        </FormControl>

        {isProcessing && <Progress size="xs" isIndeterminate />}
        <Button
          colorScheme="blue"
          onClick={handleCompress}
          isDisabled={!file || isProcessing}
        >
          Compress PDF
        </Button>
      </VStack>
    </Box>
  );
};

export default CompressPDF; 