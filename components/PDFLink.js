import PDFViewer from "./PDFViewer";

const PDFLink = ({ pdfUrl }) => {
  const openPdfWindow = (e) => {
    e.preventDefault();
    window.open(pdfUrl, '_blank', 'width=600,height=800');
  };
  return <button onClick={openPdfWindow}>Open PDF</button>;
};

export default PDFLink;

