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

  static async compressPDF(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    // Add compression logic here
    return await pdfDoc.save();
  }

  static async getPageCount(file: File): Promise<number> {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBuffer);
    return pdf.getPageCount();
  }
} 