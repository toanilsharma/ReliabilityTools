const triggerDownload = (href: string, filename: string) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const serializeSvg = (svgElement: SVGSVGElement) => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
};

const loadImageFromSvgString = (svgString: string): Promise<HTMLImageElement> => {
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };
    img.src = url;
  });
};

export const downloadSvgElement = (svgElement: SVGSVGElement, filename: string) => {
  const svgString = serializeSvg(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
};

export const downloadSvgAsPng = async (
  svgElement: SVGSVGElement,
  filename: string,
  scale: number = 3,
) => {
  const width = Math.max(1, Math.floor(svgElement.clientWidth || svgElement.getBoundingClientRect().width || 800));
  const height = Math.max(1, Math.floor(svgElement.clientHeight || svgElement.getBoundingClientRect().height || 600));

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create 2D drawing context');

  const img = await loadImageFromSvgString(serializeSvg(svgElement));

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0, width, height);

  const pngUrl = canvas.toDataURL('image/png');
  triggerDownload(pngUrl, filename);
};

export const downloadSvgAsEps = async (
  svgElement: SVGSVGElement,
  filename: string,
  scale: number = 3,
) => {
  const width = Math.max(1, Math.floor(svgElement.clientWidth || svgElement.getBoundingClientRect().width || 800));
  const height = Math.max(1, Math.floor(svgElement.clientHeight || svgElement.getBoundingClientRect().height || 600));

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create 2D drawing context');

  const img = await loadImageFromSvgString(serializeSvg(svgElement));

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let hex = '';
  let charsOnLine = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    hex += imageData[i].toString(16).padStart(2, '0');
    hex += imageData[i + 1].toString(16).padStart(2, '0');
    hex += imageData[i + 2].toString(16).padStart(2, '0');
    charsOnLine += 6;
    if (charsOnLine >= 240) {
      hex += '\n';
      charsOnLine = 0;
    }
  }

  const eps = [
    '%!PS-Adobe-3.0 EPSF-3.0',
    `%%BoundingBox: 0 0 ${canvas.width} ${canvas.height}`,
    '%%Creator: Reliability Tools',
    '%%LanguageLevel: 2',
    '%%Pages: 1',
    '%%EndComments',
    '/picstr ' + (canvas.width * 3) + ' string def',
    `${canvas.width} ${canvas.height} 8`,
    `[${canvas.width} 0 0 -${canvas.height} 0 ${canvas.height}]`,
    '{ currentfile picstr readhexstring pop }',
    'false 3 colorimage',
    hex,
    'showpage',
    '%%EOF',
  ].join('\n');

  const blob = new Blob([eps], { type: 'application/postscript' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
};
