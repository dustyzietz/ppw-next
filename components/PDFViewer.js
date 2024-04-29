import React from 'react';

function PDFViewer({ pdfUrl }) {
  return (
    <iframe
      src={pdfUrl}
      title="PDF Viewer"
      style={{ height:'260px', width:'260px', border: 'none' }}
    ></iframe>
  );
}

export default PDFViewer;
