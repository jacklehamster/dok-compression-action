import * as fs from 'fs';
import * as path from 'path';

function stripComments(content) {
  // Regular expression to remove comments (both single-line and multi-line)
  return content.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
}

async function run() {
  try {
    const repoDir = process.env.GITHUB_WORKSPACE;
    const outputFileName = 'consolidated.json';
    const outputFilePath = path.join(repoDir, outputFileName);

    let consolidatedData = {};

    // Iterate through the repository directory
    const files = fs.readdirSync(repoDir);
    files.forEach(file => {
      if (file.endsWith('.json') && file !== outputFileName && !file.endsWith('lock.json')) {
        const filePath = path.join(repoDir, file);
        try {
          // Read the file content, strip comments, and parse JSON
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const cleanContent = stripComments(fileContent);
          const fileData = JSON.parse(cleanContent);
          consolidatedData[filePath] = fileData;
        } catch (error) {
          console.error(`Error parsing JSON file ${filePath}: ${error.message}`);
        }
      }
    });

    // Write consolidated data to a single file
    fs.writeFileSync(outputFilePath, JSON.stringify(consolidatedData, null, 2));
    console.log(`Consolidated JSON files into ${outputFileName}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();
