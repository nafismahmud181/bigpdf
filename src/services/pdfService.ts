import { PDFDocument } from 'pdf-lib';

interface Range {
  start: number;
  end: number;
}

export class PDFService {
  static async mergePDFs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    
    return mergedPdf.save();
  }

  static async splitPDF(file: File, ranges: Range[]): Promise<Uint8Array[]> {
    const fileBuffer = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(fileBuffer);
    const totalPages = sourcePdf.getPageCount();
    
    // Validate ranges
    for (const range of ranges) {
      if (range.start < 1 || range.end > totalPages || range.start > range.end) {
        throw new Error(`Invalid range: ${range.start}-${range.end}. PDF has ${totalPages} pages.`);
      }
    }

    // Create a new PDF for each range
    const splitPdfs: Uint8Array[] = [];
    
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(sourcePdf, 
        Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start - 1 + i)
      );
      
      pages.forEach(page => {
        newPdf.addPage(page);
      });
      
      const pdfBytes = await newPdf.save();
      splitPdfs.push(pdfBytes);
    }
    
    return splitPdfs;
  }

  static async compressPDF(file: File, quality: 'low' | 'medium' | 'high'): Promise<Uint8Array> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Quality settings
      const compressionSettings = {
        low: { imageQuality: 0.3, imageScale: 0.5 },
        medium: { imageQuality: 0.5, imageScale: 0.75 },
        high: { imageQuality: 0.7, imageScale: 0.9 }
      };
      
      const { imageQuality, imageScale } = compressionSettings[quality];
      
      // Compress each page
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        // Get page dimensions
        const { width, height } = page.getSize();
        
        // Scale down page size
        page.setSize(width * imageScale, height * imageScale);
      }
      
      // Set compression options
      const compressedPdf = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false
      });
      
      return compressedPdf;
    } catch (error) {
      console.error('Error compressing PDF:', error);
      throw new Error('Failed to compress PDF file');
    }
  }

  static async getPageCount(file: File): Promise<number> {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBuffer);
    return pdf.getPageCount();
  }
} 