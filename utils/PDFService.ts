import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getToolKnowledge } from './toolKnowledgeRegistry';

export interface PDFReportData {
  toolName: string;
  inputs: Record<string, string | number>;
  results: Record<string, string | number>;
  formula?: string;
  interpretation?: string;
  url?: string;
  chartRef?: React.RefObject<HTMLElement>;
  notes?: string;
}

/**
 * Draws the vector shield brand logo on the jsPDF document
 */
function drawVectorLogo(doc: any, x: number, y: number, size: number) {
  doc.saveGraphicsState();

  // Shield rounded container
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.roundedRect(x, y, size, size, 2, 2, 'F');

  // Inner shield path in dark slate
  doc.setFillColor(15, 23, 42); // slate-900
  const pad = size * 0.18;
  const sx = x + pad;
  const sy = y + pad;
  const sw = size - pad * 2;
  const sh = size - pad * 2;

  // Approximate shield contour with polygon
  doc.triangle(sx + sw * 0.5, sy, sx, sy + sh * 0.4, sx + sw, sy + sh * 0.4, 'F');
  doc.triangle(sx, sy + sh * 0.4, sx + sw, sy + sh * 0.4, sx + sw * 0.5, sy + sh, 'F');

  // Cyan checkmark
  doc.setDrawColor(34, 211, 238); // cyan-400
  doc.setLineWidth(size * 0.1);
  doc.line(sx + sw * 0.25, sy + sh * 0.5, sx + sw * 0.45, sy + sh * 0.72);
  doc.line(sx + sw * 0.45, sy + sh * 0.72, sx + sw * 0.75, sy + sh * 0.35);

  doc.restoreGraphicsState();
}

/**
 * Generates a branded, publication-grade engineering PDF report
 */
export const generateProfessionalPDF = async (data: PDFReportData): Promise<void> => {
  const { toolName, inputs, results, chartRef } = data;
  const knowledge = getToolKnowledge(toolName);

  const formulaText = data.formula || knowledge.formulaDescription || knowledge.formula;
  const interpretationText = data.interpretation || knowledge.interpretation;
  const toolUrl = data.url || (typeof window !== 'undefined' ? window.location.href : 'https://reliabilitytools.co.in');

  // Initialize jsPDF instance safely
  let doc: any;
  try {
    if (typeof jsPDF === 'function') {
      doc = new (jsPDF as any)('p', 'mm', 'a4');
    } else {
      const jsPDFLib = (await import('jspdf')).default || (await import('jspdf')).jsPDF;
      doc = new (jsPDFLib as any)('p', 'mm', 'a4');
    }
  } catch (e) {
    console.error('Failed to initialize jsPDF:', e);
    if (typeof window !== 'undefined') window.print();
    return;
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 0;

  // Helper to add a branded page header if a new page is triggered
  const addPageHeaderIfNeeded = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 25) {
      doc.addPage();
      currentY = 20;
      // Mini top bar on subsequent pages
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`ReliabilityTools.co.in  |  ${toolName} Analysis Report`, margin, 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(new Date().toLocaleDateString(), pageWidth - margin - 20, 8);
      currentY = 24;
    }
  };

  // ==========================================
  // 1. BRANDED MAIN HEADER BAR (Page 1)
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Decorative cyan accent stripe at bottom of header
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 41, pageWidth, 1.5, 'F');

  // Brand Logo
  drawVectorLogo(doc, margin, 11, 18);

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ReliabilityTools', margin + 22, 21);

  doc.setTextColor(6, 182, 212); // cyan-500
  doc.text('.co.in', margin + 22 + doc.getTextWidth('ReliabilityTools'), 21);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('INDUSTRIAL RELIABILITY ENGINEERING & ASSET MANAGEMENT PLATFORM', margin + 22, 27);

  // Top Right Reference Badge
  const reportRefId = `RT-${Date.now().toString(36).toUpperCase()}`;
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('TECHNICAL REPORT', pageWidth - margin, 18, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`REF: ${reportRefId}`, pageWidth - margin, 24, { align: 'right' });
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text('VERIFIED COMPUTATION', pageWidth - margin, 30, { align: 'right' });

  currentY = 52;

  // ==========================================
  // 2. REPORT TITLE & METADATA BAR
  // ==========================================
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${toolName} - Engineering Report`, margin, currentY);

  currentY += 5;
  doc.setDrawColor(6, 182, 212); // cyan-500
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 45, currentY);

  currentY += 8;

  // Metadata Box (Timestamp, URL, Standards)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('Generated Timestamp:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleString(), margin + 38, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Direct Link / URL:', margin + 4, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(2, 132, 199); // sky-600
  const shortUrl = toolUrl.length > 55 ? toolUrl.slice(0, 52) + '...' : toolUrl;
  doc.text(shortUrl, margin + 38, currentY + 11);

  // Right side standard compliance
  const stds = knowledge.standards.slice(0, 3).join(', ');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Governing Standards:', pageWidth - margin - 4, currentY + 6, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(stds, pageWidth - margin - 4, currentY + 11, { align: 'right' });

  currentY += 21;

  // ==========================================
  // 3. GOVERNING FORMULA & METHODOLOGY
  // ==========================================
  addPageHeaderIfNeeded(28);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Governing Engineering Formula & Model', margin, currentY);

  currentY += 4;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  // Left cyan accent bar on formula box
  doc.setFillColor(6, 182, 212);
  doc.roundedRect(margin, currentY, 2.5, 18, 1, 1, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const cleanFormula = formulaText.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
                                 .replace(/\\cdot/g, '·')
                                 .replace(/\\times/g, '×')
                                 .replace(/\\quad/g, '  ')
                                 .replace(/\\le/g, '≤')
                                 .replace(/\\ge/g, '≥')
                                 .replace(/\\text\{([^}]+)\}/g, '$1')
                                 .replace(/[\\]/g, '');
  doc.text(cleanFormula, margin + 7, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const formulaDesc = knowledge.formulaDescription || 'Standard mathematical formulation conforming to industrial reliability engineering principles.';
  doc.text(formulaDesc, margin + 7, currentY + 13);

  currentY += 25;

  // ==========================================
  // 4. INPUT PARAMETERS TABLE
  // ==========================================
  const inputEntries = Object.entries(inputs);
  const inputRowsHeight = Math.max(1, inputEntries.length) * 6.5 + 10;
  addPageHeaderIfNeeded(inputRowsHeight + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Input Parameters & Operating Assumptions', margin, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PARAMETER / OPERATING FACTOR', margin + 4, currentY + 4.8);
  doc.text('VALUE', margin + 110, currentY + 4.8);

  currentY += 7;

  inputEntries.forEach(([key, val], idx) => {
    addPageHeaderIfNeeded(7);
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, currentY, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, contentWidth, 6.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(key, margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(String(val), margin + 110, currentY + 4.5);

    currentY += 6.5;
  });

  currentY += 8;

  // ==========================================
  // 5. CALCULATION RESULTS SECTION
  // ==========================================
  const resultEntries = Object.entries(results);
  const resultRowsHeight = Math.max(1, resultEntries.length) * 7.5 + 12;
  addPageHeaderIfNeeded(resultRowsHeight + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Calculated Engineering Results', margin, currentY);

  currentY += 4;

  // Results Header
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(margin, currentY, contentWidth, 7.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PRIMARY PERFORMANCE METRIC', margin + 4, currentY + 5.2);
  doc.text('RESULT VALUE / RATING', margin + 110, currentY + 5.2);

  currentY += 7.5;

  resultEntries.forEach(([key, val], idx) => {
    addPageHeaderIfNeeded(8);
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 240 : 255, isEven ? 253 : 255, isEven ? 250 : 255); // subtle cyan-50/white
    doc.rect(margin, currentY, contentWidth, 7.5, 'F');
    doc.setDrawColor(207, 250, 254);
    doc.setLineWidth(0.4);
    doc.rect(margin, currentY, contentWidth, 7.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(key, margin + 4, currentY + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 132, 199); // sky-600
    doc.text(String(val), margin + 110, currentY + 5.2);

    currentY += 7.5;
  });

  currentY += 8;

  // ==========================================
  // 6. ENGINEERING INTERPRETATION & ADVICE
  // ==========================================
  addPageHeaderIfNeeded(36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Engineering Interpretation & Recommendations', margin, currentY);

  currentY += 4;
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.setLineWidth(0.5);

  const splitInterpretation = doc.splitTextToSize(interpretationText, contentWidth - 12);
  const interpBoxHeight = Math.max(22, splitInterpretation.length * 4.2 + 8);
  doc.roundedRect(margin, currentY, contentWidth, interpBoxHeight, 2, 2, 'FD');

  // Left amber accent bar
  doc.setFillColor(245, 158, 11); // amber-500
  doc.roundedRect(margin, currentY, 2.5, interpBoxHeight, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text('OPERATIONAL GUIDANCE:', margin + 6, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(splitInterpretation, margin + 6, currentY + 11);

  currentY += interpBoxHeight + 8;

  // ==========================================
  // 7. CHART VISUALIZATION (if chartRef given)
  // ==========================================
  if (chartRef?.current && chartRef.current instanceof HTMLElement) {
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if chart fits or requires a clean page break
      addPageHeaderIfNeeded(imgHeight + 16);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Visual Analysis & Graphical Modeling', margin, currentY);
      currentY += 5;

      doc.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 8;
    } catch (chartErr) {
      console.warn('Could not capture chart for PDF report:', chartErr);
    }
  }

  // ==========================================
  // 8. FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const footerY = pageHeight - 12;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('ReliabilityTools.co.in  •  Free Industrial Reliability Engineering Suite  •  Confidential / Technical', margin, footerY + 2);

    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, footerY + 2, { align: 'right' });
  }

  // ==========================================
  // 9. SAVE FILE
  // ==========================================
  const cleanFileName = toolName.replace(/[^a-zA-Z0-9_-]/g, '-');
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`ReliabilityTools-${cleanFileName}-Report-${dateStr}.pdf`);
};
