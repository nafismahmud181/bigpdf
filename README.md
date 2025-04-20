# BigPDF - PDF Processing Web Application

BigPDF is a full-stack web application that allows users to upload, process, and download PDF files. It provides functionality for merging, splitting, and compressing PDF documents.

## Features

- Merge multiple PDF files into one document
- Split PDF files into individual pages
- Compress PDF files to reduce file size
- Modern and responsive UI built with Chakra UI
- Secure file storage using Supabase

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Chakra UI
- PDF Processing: pdf-lib
- Backend: Supabase
- Routing: React Router

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bigpdf
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Create a storage bucket named 'pdfs' in your Supabase project and set the following bucket policies:
   - Enable public access for reading files
   - Allow authenticated users to upload files

5. Start the development server:
```bash
npm run dev
```

## Usage

1. **Merge PDFs**
   - Navigate to the Merge PDF page
   - Select multiple PDF files
   - Click "Merge PDFs" to combine them into one document

2. **Split PDF**
   - Navigate to the Split PDF page
   - Upload a PDF file
   - Enter the page numbers you want to extract (comma-separated)
   - Click "Split PDF" to create separate PDFs for each page

3. **Compress PDF**
   - Navigate to the Compress PDF page
   - Upload a PDF file
   - Adjust the compression level using the slider
   - Click "Compress PDF" to reduce the file size

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
