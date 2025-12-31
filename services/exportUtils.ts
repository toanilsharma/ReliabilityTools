
export const downloadSvgAsPng = (svgElement: SVGSVGElement, filename: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Get SVG data
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  
  // Create an image from the SVG data
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Set canvas dimensions based on SVG
    const width = svgElement.clientWidth || svgElement.getBoundingClientRect().width || 800;
    const height = svgElement.clientHeight || svgElement.getBoundingClientRect().height || 600;
    
    canvas.width = width;
    canvas.height = height;

    if (ctx) {
        // Fill white background (charts often have transparent backgrounds)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);
    }

    // Convert to PNG and trigger download
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Cleanup
    URL.revokeObjectURL(url);
  };

  img.src = url;
};