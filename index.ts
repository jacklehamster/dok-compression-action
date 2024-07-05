// index.ts

import * as fs from 'fs';
import * as path from 'path';

async function run() {
  try {
    const repoDir = process.env.GITHUB_WORKSPACE as string;
    const outputFileName = 'consolidated.json';
    const outputFilePath = path.join(repoDir, outputFileName);

    const consolidatedData: Record<string, any> = {};

    // Iterate through the repository directory
    const files = fs.readdirSync(repoDir);
    files.forEach(file => {
      if (file.endsWith('.json') && file !== outputFileName && file.endsWith('lock.json')) {
        const filePath = path.join(repoDir, file);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        consolidatedData[filePath] = fileData;
      }
    });

    // Write consolidated data to a single file
    fs.writeFileSync(outputFilePath, JSON.stringify(consolidatedData, null, 2));
    console.log(`Consolidated JSON files into ${outputFileName}`);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();
