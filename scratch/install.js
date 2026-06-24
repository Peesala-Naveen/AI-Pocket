import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Installing dependencies in:', __dirname);
try {
  execSync('npm install', { cwd: __dirname, stdio: 'inherit' });
  console.log('Installation successful!');
} catch (error) {
  console.error('Installation failed:', error);
  process.exit(1);
}
