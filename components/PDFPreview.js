import React, { useEffect, useState } from 'react';

function PDFPreview({ pdf }) {
    const [ReactPdf, setReactPdf] = useState(null);

    useEffect(() => {
        import('react-pdf')
            .then(module => {
                setReactPdf(module);
            })
            .catch(error => {
                console.error('Error loading react-pdf:', error);
            });
    }, []);

    if (!ReactPdf) {
        return <div>Loading PDF preview...</div>;
    }

    const { Document, Page } = ReactPdf;

    return (
        <div>
            <Document file={pdf}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
}

export default PDFPreview;
