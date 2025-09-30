const { execSync } = require('child_process');

// This script will run after npm install
try {
  // Run prisma generate
  console.log('Running prisma generate...');
  execSync('cd ../../packages/db && npx prisma generate', { stdio: 'inherit' });

  // Check if we're in production (Vercel)
  if (process.env.VERCEL === '1') {
    try {
      // Run prisma deploy in production with --skip-seed flag
      console.log('Running prisma deploy...');
      execSync('cd ../../packages/db && npx prisma migrate deploy --skip-seed', { stdio: 'inherit' });
    } catch (migrateError) {
      if (migrateError.message.includes('P3005')) {
        console.log('Database already exists, skipping migration...');
      } else {
        throw migrateError;
      }
    }
  }
} catch (error) {
  console.error('postinstall script failed:', error);
  process.exit(1);
}