// src/components/PdfEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

// Configurar el worker de PDF.js usando CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfEditor = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [highlights, setHighlights] = useState([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const canvasRef = useRef(null);

  // Cargar anotaciones desde localStorage al montar el componente
  useEffect(() => {
    const savedHighlights = JSON.parse(localStorage.getItem(`highlights-${file}`)) || [];
    setHighlights(savedHighlights);
  }, [file]);

  // Guardar anotaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(`highlights-${file}`, JSON.stringify(highlights));
  }, [highlights, file]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const toggleHighlightMode = () => {
    setIsHighlightMode(!isHighlightMode);
    if (!isHighlightMode) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = 'default';
    }
    setIsDrawing(false);
    setCurrentHighlight(null);
  };

  const handleMouseDown = (event) => {
    if (!isHighlightMode) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentHighlight({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || !currentHighlight) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentHighlight({
      ...currentHighlight,
      width: x - currentHighlight.x,
      height: y - currentHighlight.y,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentHighlight) {
      setHighlights([...highlights, currentHighlight]);
    }
    setIsDrawing(false);
    setCurrentHighlight(null);
  };

  const drawHighlights = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    highlights.forEach((hl) => {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Color amarillo semi-transparente
      ctx.fillRect(hl.x, hl.y, hl.width, hl.height);
    });
    if (currentHighlight) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.fillRect(
        currentHighlight.x,
        currentHighlight.y,
        currentHighlight.width,
        currentHighlight.height
      );
    }
  };

  useEffect(() => {
    drawHighlights();
  }, [highlights, currentHighlight]);

  return (
    <div className="pdf-editor relative">
      <div className="controls mb-4">
        <button
          onClick={toggleHighlightMode}
          className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${
            isHighlightMode ? 'bg-red-500' : ''
          }`}
        >
          {isHighlightMode ? 'Desactivar Marcatextos' : 'Activar Marcatextos'}
        </button>
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Página Anterior
        </button>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Página Siguiente
        </button>
      </div>
      <div
        className="pdf-container relative"
        style={{ position: 'relative' }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="document"
        >
          <Page
            pageNumber={pageNumber}
            width={600}
            className="page"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </Document>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          width={600}
          height={842} // Ajusta según la escala y tamaño de la página
          style={{ zIndex: 10 }}
        ></canvas>
      </div>
    </div>
  );
};

export default PdfEditor;
