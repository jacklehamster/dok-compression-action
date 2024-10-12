import * as fs from 'fs';
import * as path from 'path';
import dokCompressor from "dok-compression";
const { Compressor } = dokCompressor;
function stripComments(content) {
    // Regular expression to remove comments (both single-line and multi-line)
    return content.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
}
async function run() {
    try {
        const repoDir = process.env.GITHUB_WORKSPACE || __dirname; // Use __dirname if GITHUB_WORKSPACE is not defined
        const outputFileName = 'consolidated.json';
        const outputFilePath = path.join(repoDir, outputFileName);
        let consolidatedData = {};
        // Function to recursively traverse directories
        function traverseDirectory(dir) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                // Skip directories like node_modules
                if (stat.isDirectory() && file !== 'node_modules') {
                    traverseDirectory(filePath);
                }
                else if (file.endsWith('.json') && filePath !== outputFilePath && !file.endsWith('lock.json')) {
                    try {
                        // Read the file content, strip comments, and parse JSON
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        console.info("JSON", fileContent);
                        const cleanContent = stripComments(fileContent);
                        console.info("JSON", cleanContent);
                        const fileData = JSON.parse(cleanContent);
                        consolidatedData[filePath.split(repoDir)[1]] = fileData;
                    }
                    catch (error) {
                        console.error(`Error parsing JSON file ${filePath}: ${error.message}`);
                    }
                }
            });
        }
        // Start traversing from the repository root directory
        traverseDirectory(repoDir);
        // Write consolidated data to a single file
        fs.writeFileSync(outputFilePath, JSON.stringify(consolidatedData, null, 2));
        console.log(`Consolidated JSON files into ${outputFileName}`);
        const compressor = new Compressor();
        const dokbin = compressor.compress(consolidatedData);
        // Convert the dokbin (ArrayBuffer) to Buffer
        const buffer = Buffer.from(dokbin);
        fs.writeFileSync(path.join(repoDir, "consolidated.dokbin"), buffer);
    }
    catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}
run();
