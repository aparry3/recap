/**
 * Converts a Base64 Data URL to a Blob.
 * @param dataUrl - The Base64 Data URL.
 * @returns A Blob representing the data.
 */
export function dataURLToBlob(dataUrl: string): Blob {
    const [header, base64Data] = dataUrl.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
}

/**
 * Downloads a Base64 Data URL as a PNG file.
 * @param dataUrl - The Base64 Data URL.
 * @param filename - The name of the file to be downloaded.
 */
export function downloadDataUrlAsPng(dataUrl: string, filename: string = 'qrcode.png'): void {
    try {
        const blob = dataURLToBlob(dataUrl);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to download image:', error);
    }
}
