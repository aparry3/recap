// qrGenerator.ts
import QRCode from 'qrcode';

export interface QRCodeOptions {
  size: number; // Size of the QR code in pixels (width and height)
  foregroundColor: string; // Color of the QR modules
  backgroundColor: string; // Background color
  imageSrc?: string; // Optional center image source (URL or Data URI)
  imageSize?: number; // Size of the center image relative to QR code size (0 < imageSize < 1)
}

export async function generateCustomQRCodePNG(
  text: string,
  options: QRCodeOptions,
  // canvas: HTMLCanvasElement
): Promise<string> {
  const {
    size,
    foregroundColor,
    backgroundColor,
    imageSrc,
    imageSize = 0.2, // Default to 20% of QR code size
  } = options;

  // Generate QR code data as a matrix
  const qrData = await QRCode.create(text, { errorCorrectionLevel: 'H' });
  const modules = qrData.modules;
  const moduleCount = modules.size;
  const moduleSize = size / moduleCount;

  const canvas = document.createElement('canvas');
  // Set canvas dimensions
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Handle the center image
  let imagePixelData: ImageData | null = null;
  let imageDimensions = { width: 0, height: 0 };
  let imagePosition = { x: 0, y: 0 };

  if (imageSrc) {
    const image = await loadImage(imageSrc);
    imageDimensions.width = size * imageSize;
    imageDimensions.height = size * imageSize;
    imagePosition.x = (size - imageDimensions.width) / 2;
    imagePosition.y = (size - imageDimensions.height) / 2;

    // Draw the image onto an offscreen canvas to get pixel data
    const offCanvas = document.createElement('canvas');
    offCanvas.width = imageDimensions.width;
    offCanvas.height = imageDimensions.height;
    const offCtx = offCanvas.getContext('2d');

    if (!offCtx) {
      throw new Error('Failed to get offscreen canvas context');
    }

    offCtx.drawImage(image, 0, 0, imageDimensions.width, imageDimensions.height);
    imagePixelData = offCtx.getImageData(0, 0, imageDimensions.width, imageDimensions.height);
  }

  // Create the overlap matrix
  const overlapMatrix = createOverlapMatrix(
    moduleCount,
    moduleSize,
    imagePixelData,
    imageDimensions,
    imagePosition
  );

  // Draw QR modules with circles, avoiding overlapping with the image
  // Define corner radius for rounded squares
  const CORNER_RADIUS = moduleSize * 0.3; // Adjust as needed for softness
  const MARKER_PADDING = moduleSize * 0.2; // Padding for inner marker square

  // Draw QR modules with circles and rounded squares for markers
  ctx.fillStyle = foregroundColor;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules.get(row, col) && !overlapMatrix[row][col]) {
        const x = col * moduleSize;
        const y = row * moduleSize;

        if (isMarkerModule(row, col, moduleCount)) {
          // Outer rounded square
          ctx.beginPath();
          ctx.moveTo(x + CORNER_RADIUS, y);
          ctx.lineTo(x + moduleSize - CORNER_RADIUS, y);
          ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + CORNER_RADIUS);
          ctx.lineTo(x + moduleSize, y + moduleSize - CORNER_RADIUS);
          ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - CORNER_RADIUS, y + moduleSize);
          ctx.lineTo(x + CORNER_RADIUS, y + moduleSize);
          ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - CORNER_RADIUS);
          ctx.lineTo(x, y + CORNER_RADIUS);
          ctx.quadraticCurveTo(x, y, x + CORNER_RADIUS, y);
          ctx.closePath();
          ctx.fill();

          // Inner rounded square
          ctx.fillStyle = backgroundColor; // Inner square color
          ctx.beginPath();
          ctx.moveTo(x + MARKER_PADDING + CORNER_RADIUS, y + MARKER_PADDING);
          ctx.lineTo(x + moduleSize - MARKER_PADDING - CORNER_RADIUS, y + MARKER_PADDING);
          ctx.quadraticCurveTo(x + moduleSize - MARKER_PADDING, y + MARKER_PADDING, x + moduleSize - MARKER_PADDING, y + MARKER_PADDING + CORNER_RADIUS);
          ctx.lineTo(x + moduleSize - MARKER_PADDING, y + moduleSize - MARKER_PADDING - CORNER_RADIUS);
          ctx.quadraticCurveTo(x + moduleSize - MARKER_PADDING, y + moduleSize - MARKER_PADDING, x + moduleSize - MARKER_PADDING - CORNER_RADIUS, y + moduleSize - MARKER_PADDING);
          ctx.lineTo(x + MARKER_PADDING + CORNER_RADIUS, y + moduleSize - MARKER_PADDING);
          ctx.quadraticCurveTo(x + MARKER_PADDING, y + moduleSize - MARKER_PADDING, x + MARKER_PADDING, y + moduleSize - MARKER_PADDING - CORNER_RADIUS);
          ctx.lineTo(x + MARKER_PADDING, y + MARKER_PADDING + CORNER_RADIUS);
          ctx.quadraticCurveTo(x + MARKER_PADDING, y + MARKER_PADDING, x + MARKER_PADDING + CORNER_RADIUS, y + MARKER_PADDING);
          ctx.closePath();
          ctx.fill();

          // Reset fillStyle for data modules
          ctx.fillStyle = foregroundColor;
        } else {
          // Draw a circle for data modules
          const centerX = x + moduleSize / 2;
          const centerY = y + moduleSize / 2;
          const radius = (moduleSize / 2) * 0.8; // 80% of half module size

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  /**
   * Determines if a module is part of one of the three position markers.
   * @param row - The row index of the module.
   * @param col - The column index of the module.
   * @param moduleCount - Total number of modules per side.
   * @param markerSize - Size of the marker in modules (typically 7).
   * @returns True if the module is part of a marker; otherwise, false.
   */
  function isMarkerModule(
    row: number,
    col: number,
    moduleCount: number,
    markerSize: number = 7
  ): boolean {
    // Top-left marker
    if (row < markerSize && col < markerSize) return true;

    // Top-right marker
    if (row < markerSize && col >= moduleCount - markerSize) return true;

    // Bottom-left marker
    if (row >= moduleCount - markerSize && col < markerSize) return true;

    return false;
  }


  // Draw the center image if provided
  if (imageSrc) {
    ctx.drawImage(
      await loadImage(imageSrc),
      imagePosition.x,
      imagePosition.y,
      imageDimensions.width,
      imageDimensions.height
    );
  }

  // Return the PNG data URL
  return canvas.toDataURL('image/png');
}

/**
 * Loads an image from a source and returns an HTMLImageElement.
 * @param src - The source of the image (URL or Data URI).
 * @returns A promise that resolves to the loaded HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To avoid CORS issues if loading from a different domain
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Creates an overlap matrix indicating which QR modules overlap with the embedded image.
 * @param modules - The QR code modules matrix.
 * @param moduleCount - Total number of modules per side.
 * @param moduleSize - Size of each module in pixels.
 * @param qrSize - Total size of the QR code in pixels.
 * @param imagePixelData - Pixel data of the embedded image.
 * @param imageDimensions - Dimensions of the embedded image in pixels.
 * @param imagePosition - Position of the embedded image on the QR code.
 * @returns A 2D boolean array indicating overlapping modules.
 */
function createOverlapMatrix(
  moduleCount: number,
  moduleSize: number,
  imagePixelData: ImageData | null,
  imageDimensions: { width: number; height: number },
  imagePosition: { x: number; y: number }
): boolean[][] {
  const overlapMatrix: boolean[][] = Array.from({ length: moduleCount }, () =>
    Array(moduleCount).fill(false)
  );

  if (!imagePixelData) return overlapMatrix;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Define the pixel bounds for the current module
      const moduleLeft = col * moduleSize;
      const moduleTop = row * moduleSize;
      const moduleRight = moduleLeft + moduleSize;
      const moduleBottom = moduleTop + moduleSize;

      // Calculate relative positions within the image
      const relativeLeft = moduleLeft - imagePosition.x;
      const relativeTop = moduleTop - imagePosition.y;
      const relativeRight = moduleRight - imagePosition.x;
      const relativeBottom = moduleBottom - imagePosition.y;

      // If the module is entirely outside the image bounds, skip
      if (
        relativeRight <= 0 ||
        relativeLeft >= imageDimensions.width ||
        relativeBottom <= 0 ||
        relativeTop >= imageDimensions.height
      ) {
        continue;
      }

      // Define the pixel bounds within the image
      const startX = Math.max(0, Math.floor(relativeLeft));
      const startY = Math.max(0, Math.floor(relativeTop));
      const endX = Math.min(imageDimensions.width, Math.ceil(relativeRight));
      const endY = Math.min(imageDimensions.height, Math.ceil(relativeBottom));

      // Check if any pixel within the module's bounds is opaque
      let isOverlapping = false;
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const index = (y * imagePixelData.width + x) * 4;
          const alpha = imagePixelData.data[index + 3]; // Alpha channel

          if (alpha > 0) {
            isOverlapping = true;
            break; // No need to check further pixels
          }
        }
        if (isOverlapping) break;
      }

      overlapMatrix[row][col] = isOverlapping;
    }
  }

  // Fill between true values in rows
  for (let row = 0; row < moduleCount; row++) {
    const firstTrue = overlapMatrix[row].indexOf(true);
    const lastTrue = overlapMatrix[row].lastIndexOf(true);
    if (firstTrue !== -1 && lastTrue !== -1 && firstTrue !== lastTrue) {
      for (let col = firstTrue; col <= lastTrue; col++) {
        overlapMatrix[row][col] = true;
      }
    }
  }

  // Fill between true values in columns
  for (let col = 0; col < moduleCount; col++) {
    let firstTrue = -1;
    let lastTrue = -1;
    for (let row = 0; row < moduleCount; row++) {
      if (overlapMatrix[row][col]) {
        if (firstTrue === -1) firstTrue = row;
        lastTrue = row;
      }
    }
    if (firstTrue !== -1 && lastTrue !== -1 && firstTrue !== lastTrue) {
      for (let row = firstTrue; row <= lastTrue; row++) {
        overlapMatrix[row][col] = true;
      }
    }
  }

  return overlapMatrix;
}
