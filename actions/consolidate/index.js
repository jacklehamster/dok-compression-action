const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const repoDir = process.env.GITHUB_WORKSPACE;
    const outputFileName = 'consolidated.json';
    const outputFilePath = path.join(repoDir, outputFileName);

    let consolidatedData = [];

    // Iterate through the repository directory
    const files = fs.readdirSync(repoDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(repoDir, file);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        consolidatedData.push(fileData);
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
