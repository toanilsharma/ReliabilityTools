import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFReportData {
  toolName: string;
  inputs: Record<string, string | number>;
  results: Record<string, string | number>;
  chartRef?: React.RefObject<HTMLElement>;
}

export const generateProfessionalPDF = async (data: PDFReportData) => {
  const { toolName, inputs, results, chartRef } = data;
  
  // Create jsPDF instance safely
  let doc: any;
  try {
    // Some versions of jspdf use default export, others named
    if (typeof jsPDF === 'function') {
      doc = new (jsPDF as any)('p', 'mm', 'a4');
    } else {
      // Fallback for some bundling environments
      const jsPDFLib = (await import('jspdf')).default || (await import('jspdf')).jsPDF;
      doc = new (jsPDFLib as any)('p', 'mm', 'a4');
    }
  } catch (e) {
    console.error('Failed to initialize jsPDF:', e);
    // Ultimate fallback
    window.print();
    return;
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // --- Header ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('ReliabilityTools.co.in', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Reliability Engineering Reports', 20, 32);
  
  currentY = 55;

  // --- Tool Title ---
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${toolName} Analysis Report`, 20, currentY);
  
  currentY += 10;
  doc.setDrawColor(8, 145, 178); // cyan-600
  doc.setLineWidth(1);
  doc.line(20, currentY, 80, currentY);
  
  currentY += 15;

  // --- Metadata ---
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, currentY);
  
  currentY += 15;

  // --- Inputs Section ---
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Input Parameters', 20, currentY);
  
  currentY += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  Object.entries(inputs).forEach(([key, value]) => {
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${key}:`, 25, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 80, currentY);
    currentY += 7;
  });

  currentY += 10;

  // --- Results Section ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Calculation Results', 20, currentY);
  
  currentY += 8;
  doc.setFontSize(11);
  
  // Results background box
  const resultsStart = currentY - 5;
  const resultsCount = Object.keys(results).length;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(20, resultsStart, pageWidth - 40, (resultsCount * 8) + 5, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(20, resultsStart, pageWidth - 40, (resultsCount * 8) + 5, 'S');

  Object.entries(results).forEach(([key, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${key}:`, 25, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(8, 145, 178); // cyan-600
    doc.text(String(value), 80, currentY);
    currentY += 8;
  });

  currentY += 15;

  // --- Chart Section ---
  if (chartRef?.current) {
    // Only attempt if it's a DOM element
    if (chartRef.current instanceof HTMLElement) {
        if (currentY > 180) { // Check if chart will fit on current page
          doc.addPage();
          currentY = 20;
        }
        
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Data Visualization', 20, currentY);
        currentY += 10;

        try {
          const canvas = await html2canvas(chartRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
          });
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          doc.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 15;
        } catch (error) {
          console.error('PDF Chart Generation Error:', error);
          doc.setTextColor(239, 68, 68);
          doc.text('Failed to capture chart image.', 20, currentY);
          currentY += 10;
        }
    }
  }

  // --- Footer ---
  const footerY = 285;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setDrawColor(241, 245, 249); // slate-100
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  doc.text('This report was generated using ReliabilityTools.co.in. All calculations are based on standard industrial formulas.', 20, footerY);
  doc.text('Page 1 of 1', pageWidth - 35, footerY);

  // --- Save ---
  doc.save(`${toolName.replace(/\s+/g, '-')}-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};
