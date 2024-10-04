const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

// Directory containing PNG files
const pngDirectory = './zoomed-pngs'; // Update with the path to your folder

// Directory for JSON output
const jsonOutputDirectory = './DigitalAssetJsons';

// Function to process PNGs and extract text
async function processPNGs() {
    try {
        // Ensure the JSON output directory exists
        if (!fs.existsSync(jsonOutputDirectory)) {
            fs.mkdirSync(jsonOutputDirectory);
        }

        // Get list of all files in the directory
        const files = fs.readdirSync(pngDirectory);
        
        // Filter only PNG files and sort them in the order they are listed
        const pngFiles = files.filter(file => file.endsWith('.png')).sort();

        for (let i = 0; i < pngFiles.length; i++) {
            // Get the base name of the file without the extension for consistency
            const fileName = path.basename(pngFiles[i], '.png');

            // Skip page 177
            if (fileName === '177') {
                console.log(`Skipping page ${fileName}`);
                continue;
            }

            // Full path to the PNG file
            const filePath = path.join(pngDirectory, pngFiles[i]);
            
            // Extract text from the PNG using Tesseract
            const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
                logger: m => console.log(m) // optional logging
            });
            
            // Create a JSON object with the extracted text
            const jsonData = {
                pageNumber: fileName, // Use the file name as the page number
                text: text
            };
            
            // Write the JSON to a file named after the PNG file (e.g., 'page_1.json')
            const jsonFileName = `page_${fileName}.json`;
            const jsonFilePath = path.join(jsonOutputDirectory, jsonFileName);
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

            console.log(`Extracted text from page ${fileName} and saved to ${jsonFileName}`);
        }

        console.log('Processing complete.');
    } catch (error) {
        console.error('Error processing PNGs:', error);
    }
}

// Run the PNG processing
processPNGs();
