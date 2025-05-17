const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const ghPagesUrl = 'https://jamietp.github.io/equidistant-app/';
const buildDir = 'build';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Helper to execute shell commands
function runCommand(command) {
  console.log(`${colors.blue}> ${command}${colors.reset}`);
  execSync(command, { stdio: 'inherit' });
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
    
    // Step 4: Deploy to GitHub Pages with clean options
    console.log(`\n${colors.yellow}Deploying to GitHub Pages...${colors.reset}`);
    runCommand(`npx gh-pages -d ${buildDir} --no-history`);
    
    // Step 5: Done!
    console.log(`\n${colors.green}✅ Deployment complete!${colors.reset}`);
    console.log(`\n${colors.green}Your site should be live at: ${ghPagesUrl}${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}Deployment failed:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the deployment
deploy().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});