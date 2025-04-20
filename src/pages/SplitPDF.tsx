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
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { PDFService } from '../services/pdfService';
import { useDropzone } from 'react-dropzone';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { FiFileText, FiUpload, FiScissors } from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';

interface Range {
  start: number;
  end: number;
}

interface CustomRange {
  id: number;
  range: Range;
}

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState<'all' | 'custom'>('all');
  const [customRanges, setCustomRanges] = useState<CustomRange[]>([
    { id: 1, range: { start: 1, end: 1 } },
  ]);
  const [nextRangeId, setNextRangeId] = useState(2);
  const toast = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
      try {
        const pages = await PDFService.getPageCount(pdfFile);
        setTotalPages(pages);
        setCustomRanges([{ id: 1, range: { start: 1, end: pages } }]);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to read PDF file',
          status: 'error',
          duration: 3000,
        });
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const addRange = () => {
    setCustomRanges(prev => [
      ...prev,
      { id: nextRangeId, range: { start: 1, end: totalPages } }
    ]);
    setNextRangeId(prev => prev + 1);
  };

  const removeRange = (id: number) => {
    setCustomRanges(prev => prev.filter(range => range.id !== id));
  };

  const updateRange = (id: number, field: 'start' | 'end', value: string) => {
    const numValue = parseInt(value) || 1;
    setCustomRanges(prev =>
      prev.map(range =>
        range.id === id
          ? {
              ...range,
              range: {
                ...range.range,
                [field]: Math.min(Math.max(1, numValue), totalPages)
              }
            }
          : range
      )
    );
  };

  const handleSplit = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      let ranges: Range[];
      if (splitMode === 'all') {
        // Create individual PDFs for each page
        ranges = Array.from({ length: totalPages }, (_, i) => ({
          start: i + 1,
          end: i + 1
        }));
      } else {
        // Use custom ranges
        ranges = customRanges.map(cr => cr.range);
      }

      const splitPdfs = await PDFService.splitPDF(file, ranges);

      // Download each split PDF
      splitPdfs.forEach((pdfBytes, index) => {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = splitMode === 'all'
          ? `page_${ranges[index].start}.pdf`
          : `pages_${ranges[index].start}-${ranges[index].end}.pdf`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });

      toast({
        title: 'Success',
        description: 'PDF split successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Split error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to split PDF',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    'Split PDF into individual pages or custom ranges',
    'Maintain original PDF quality after splitting',
    'Fast and secure PDF processing'
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={4}>Split PDF</Heading>
          <Text color="gray.600" fontSize="lg">
            Split your PDF into multiple files by pages or custom ranges. 
            Our tool maintains the original quality while giving you full control over the split process.
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
              as={isDragActive ? FiUpload : FiScissors} 
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

        {/* Selected File and Split Options */}
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
                    {totalPages} pages
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

            <Divider />

            <RadioGroup value={splitMode} onChange={(value: 'all' | 'custom') => setSplitMode(value)}>
              <Stack direction="column" spacing={4}>
                <Radio value="all">Split into individual pages</Radio>
                <Radio value="custom">Split by custom ranges</Radio>
              </Stack>
            </RadioGroup>

            {splitMode === 'custom' && (
              <VStack spacing={4} align="stretch">
                {customRanges.map((customRange) => (
                  <HStack key={customRange.id} spacing={4}>
                    <FormControl>
                      <FormLabel>From page</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={customRange.range.start}
                        onChange={(e) => updateRange(customRange.id, 'start', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>To page</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={customRange.range.end}
                        onChange={(e) => updateRange(customRange.id, 'end', e.target.value)}
                      />
                    </FormControl>
                    {customRanges.length > 1 && (
                      <IconButton
                        aria-label="Remove range"
                        icon={<DeleteIcon />}
                        onClick={() => removeRange(customRange.id)}
                        alignSelf="flex-end"
                        mb={1}
                      />
                    )}
                  </HStack>
                ))}
                <Button
                  leftIcon={<AddIcon />}
                  variant="ghost"
                  onClick={addRange}
                  alignSelf="flex-start"
                >
                  Add another range
                </Button>
                <Text fontSize="sm" color="gray.500">
                  Enter page ranges to split the PDF into multiple files
                </Text>
              </VStack>
            )}
          </VStack>
        )}

        {isProcessing && <Progress size="xs" isIndeterminate />}
        
        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleSplit}
          isDisabled={!file || isProcessing}
          isLoading={isProcessing}
          loadingText="Splitting PDF..."
        >
          Split PDF
        </Button>
      </VStack>
    </Container>
  );
};

export default SplitPDF; 