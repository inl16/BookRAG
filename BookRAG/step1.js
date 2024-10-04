const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define the input and output folders
const inputFolder = path.join(__dirname, './Juli');  // Input folder
const outputFolder = path.join(__dirname, 'zoomed-pngs');  // Output folder

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// Function to zoom in and process the image
const zoomInImage = async (inputPath, outputPath) => {
    const image = sharp(inputPath);

    // Get metadata to calculate crop and resize dimensions
    const metadata = await image.metadata();
    const zoomFactor = 0.282; // 28.2% zoom

    // Calculate crop dimensions to zoom into the center
    const cropWidth = Math.floor(metadata.width * (1 - zoomFactor));
    const cropHeight = Math.floor(metadata.height * (1 - zoomFactor));
    const left = Math.floor((metadata.width - cropWidth) / 2);
    const top = Math.floor((metadata.height - cropHeight) / 2);

    // Perform the crop and resize (zoom into the center)
    await image
        .extract({ left: left, top: top, width: cropWidth, height: cropHeight }) // Crop the center
        .resize(metadata.width, metadata.height) // Resize back to original dimensions
        .toFile(outputPath); // Save the zoomed image

    console.log(`Zoomed image saved as: ${outputPath}`);
};

// Function to read files from input folder and process them in order
fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Error reading the input folder:', err);
        return;
    }

    // Filter for PNG files and sort them sequentially (numerical order)
    const pngFiles = files
        .filter(file => path.extname(file).toLowerCase() === '.png')
        .sort((a, b) => {
            // Extract numeric parts from file names for better sorting (if applicable)
            const numA = parseInt(a.match(/\d+/), 10);
            const numB = parseInt(b.match(/\d+/), 10);
            return numA - numB;
        });

    if (pngFiles.length > 0) {
        let pageNumber = 1; // Initialize page number counter

        // Process each PNG file in order
        pngFiles.forEach((file) => {
            if (pageNumber !== 177 && pageNumber !== 178) { // Skip page 177 and page 178
                const inputPath = path.join(inputFolder, file);
                const outputPath = path.join(outputFolder, `page_${pageNumber}.png`); // Name the file "page_1", "page_2", etc.

                // Call the function to zoom in on each image and save it
                zoomInImage(inputPath, outputPath);
            }

            // Increment the page number, skipping 177 and 178
            pageNumber++;
        });
    } else {
        console.log('No PNG files found in the input folder.');
    }
});
