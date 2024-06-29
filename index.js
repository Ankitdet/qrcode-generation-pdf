

const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to generate a QR code and save it as a PNG file
function generateQRCode(text, outputPath) {
    return new Promise((resolve, reject) => {
        QRCode.toFile(outputPath, text, {
            color: {
                dark: '#000000',  // QR code color
                light: '#FFFFFF'  // Background color
            },
            width: 500, // Width of the QR code image (optional, for better resolution)
        }, (err) => {
            if (err) reject(err);
            else resolve(outputPath);
        });
    });
}

// Function to create a PDF and embed the QR code image
function createPDFWithQRCode(qrImagePath, pdfOutputPath) {
    const doc = new PDFDocument({ size: 'A4' });
    const stream = fs.createWriteStream(pdfOutputPath);

    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const qrSize = Math.min(pageWidth - 100, pageHeight - 100); // Size of the QR code image (with margin)
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = (pageHeight - qrSize) / 2;

    doc.image(qrImagePath, qrX, qrY, { width: qrSize, height: qrSize });

    doc.end();

    stream.on('finish', () => {
        console.log(`PDF created successfully at ${pdfOutputPath}`);
    });
}

// Example usage
const textToEncode = 'https://docs.google.com/forms/d/e/1FAIpQLSc528gqCnnYCEu8SD7fDgdoel6PXd2_lNphhJ5ud0FgeEbXzg/viewform?usp=sf_link';
const qrImagePath = 'qr.png';
const pdfOutputPath = 'output.pdf';

generateQRCode(textToEncode, qrImagePath)
    .then(() => {
        createPDFWithQRCode(qrImagePath, pdfOutputPath);
    })
    .catch(err => {
        console.error('Error:', err);
    });
