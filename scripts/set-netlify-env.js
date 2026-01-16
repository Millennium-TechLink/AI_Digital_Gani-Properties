#!/usr/bin/env node

/**
 * Script to set Netlify environment variables from .env file
 * 
 * Usage:
 *   node scripts/set-netlify-env.js [--site=site-name] [--dry-run]
 * 
 * Requires:
 *   - .env file in project root
 *   - netlify CLI installed: npm install -g netlify-cli
 *   - Logged in to Netlify: netlify login
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const siteArg = args.find(arg => arg.startsWith('--site='));
const siteName = siteArg ? siteArg.split('=')[1] : null;

// Read .env file
function readEnvFile() {
  try {
    const envPath = join(projectRoot, '.env');
    const content = readFileSync(envPath, 'utf-8');
    const envVars = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;
      
      // Parse KEY=VALUE
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        if (key && value) {
          envVars[key] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    console.error('   Make sure .env file exists in project root');
    process.exit(1);
  }
}

// Set environment variable in Netlify
function setNetlifyEnv(key, value, site = null) {
  const siteFlag = site ? `--site=${site}` : '';
  const command = `netlify env:set ${key} "${value}" ${siteFlag}`;
  
  if (dryRun) {
    console.log(`[DRY RUN] Would run: ${command}`);
    return true;
  }
  
  try {
    execSync(command, { stdio: 'inherit', cwd: projectRoot });
    return true;
  } catch (error) {
    console.error(`❌ Failed to set ${key}`);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Setting Netlify environment variables from .env file\n');
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }
  
  if (siteName) {
    console.log(`📌 Target site: ${siteName}\n`);
  }
  
  const envVars = readEnvFile();
  const keys = Object.keys(envVars);
  
  if (keys.length === 0) {
    console.error('❌ No environment variables found in .env file');
    process.exit(1);
  }
  
  console.log(`Found ${keys.length} environment variable(s) to set:\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  keys.forEach(key => {
    const value = envVars[key];
    
    // Skip empty values
    if (!value || value === 'your-...' || value.includes('YOUR_')) {
      console.log(`⏭️  Skipping ${key} (placeholder value)`);
      return;
    }
    
    console.log(`Setting ${key}...`);
    const success = setNetlifyEnv(key, value, siteName);
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully set: ${successCount}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}`);
  }
  console.log('='.repeat(50));
  
  if (!dryRun && successCount > 0) {
    console.log('\n💡 Tip: Redeploy your site for changes to take effect');
    console.log('   netlify deploy --prod');
  }
}

main();
