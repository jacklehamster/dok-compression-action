// index.ts

import * as core from '@actions/core';

async function run() {
  try {
    // Set an output that can be used in subsequent steps or workflows
    core.setOutput('Hello', "WORLD");
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
