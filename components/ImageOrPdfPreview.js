import React, { useState, useEffect } from 'react';
//import PDFPreview from './PDFPreview';
import Link from 'next/link';
import PDFViewer from './PDFViewer';
import Image from 'next/image';

function ImageOrPdfPreview({ imageUrl, pdf }) {
    const [isPdf, setIsPdf] = useState(false);

    useEffect(() => {
        const checkFileType = async () => {
            try {
                // Check if the file is a PDF
                setIsPdf(pdf?.type === 'application/pdf' || imageUrl.endsWith('.pdf'));
            } catch (error) {
                console.error('Error checking file type:', error);
                setIsPdf(false);
            }
        };
        checkFileType();
    }, [pdf]);

    return isPdf ? (
        // Render PDF preview component with the PDF file
       // <PDFPreview pdf={pdf} />
       // Link that opens pdf in new small window
       //<button onClick={openPdfWindow}>Open PDF</button>
       <PDFViewer pdfUrl={imageUrl} />
    ) : (
        // Render image component
        <img src={imageUrl} height={260} width={260} alt="profile main cover" />
    );
}

export default ImageOrPdfPreview;
