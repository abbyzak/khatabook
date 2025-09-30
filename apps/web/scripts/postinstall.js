const { execSync } = require('child_process');

// This script will run after npm install
try {
  // Run prisma generate
  console.log('Running prisma generate...');
  execSync('cd ../../packages/db && npx prisma generate', { stdio: 'inherit' });

  // Check if we're in production (Vercel)
  if (process.env.VERCEL === '1') {
    // Run prisma deploy in production
    console.log('Running prisma deploy...');
    execSync('cd ../../packages/db && npx prisma migrate deploy', { stdio: 'inherit' });
    
    // Run seed script in production
    if (process.env.SEED_DATABASE === 'true') {
      console.log('Running seed script...');
      execSync('cd ../../packages/db && npm run seed', { stdio: 'inherit' });
    }
  }
} catch (error) {
  console.error('postinstall script failed:', error);
  process.exit(1);
}