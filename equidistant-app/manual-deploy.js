const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const ghPagesUrl = 'https://jamietp.github.io/equidistant-app/';
const buildDir = 'build';
const tempDir = 'gh-pages-temp';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Helper to execute shell commands
function runCommand(command) {
  console.log(`${colors.blue}> ${command}${colors.reset}`);
  return execSync(command, { stdio: 'inherit' });
}

// Main deployment function
async function deploy() {
  try {
    // Step 1: Build the project
    console.log(`\n${colors.yellow}Building the project...${colors.reset}`);
    runCommand('npm run build');
    
    // Step 2: Create .nojekyll file to prevent Jekyll processing
    console.log(`\n${colors.yellow}Creating .nojekyll file...${colors.reset}`);
    fs.writeFileSync(path.join(buildDir, '.nojekyll'), '');
    
    // Step 3: Fix paths in index.html if needed
    console.log(`\n${colors.yellow}Fixing paths in index.html if needed...${colors.reset}`);
    const indexPath = path.join(buildDir, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(/\/equidistant-app\/static\//g, './static/');
    fs.writeFileSync(indexPath, indexContent);
    
    // Step 4: Create a temporary directory for the deployment
    console.log(`\n${colors.yellow}Creating temporary directory for deployment...${colors.reset}`);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir);
    
    // Step 5: Copy build files to temporary directory
    console.log(`\n${colors.yellow}Copying build files to temporary directory...${colors.reset}`);
    fs.cpSync(buildDir, tempDir, { recursive: true });
    
    // Step 6: Initialize a new Git repository in the temporary directory
    console.log(`\n${colors.yellow}Initializing Git repository in temporary directory...${colors.reset}`);
    process.chdir(tempDir);
    runCommand('git init');
    runCommand('git config --local user.email "deployment@example.com"');
    runCommand('git config --local user.name "Deployment Script"');
    runCommand('git add .');
    runCommand('git commit -m "Deploy to GitHub Pages"');
    
    // Step 7: Force push to the gh-pages branch
    console.log(`\n${colors.yellow}Pushing to gh-pages branch...${colors.reset}`);
    runCommand('git push -f https://github.com/jamietp/equidistant-app.git master:gh-pages');
    
    // Step 8: Clean up by returning to the original directory
    console.log(`\n${colors.yellow}Cleaning up...${colors.reset}`);
    process.chdir('..');
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    // Step 9: Done!
    console.log(`\n${colors.green}✅ Deployment complete!${colors.reset}`);
    console.log(`\n${colors.green}Your site should be live at: ${ghPagesUrl}${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}Deployment failed:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the deployment
deploy().catch((error) => {
  console.error(`${colors.red}Deployment failed:${colors.reset}`, error);
  process.exit(1);
});