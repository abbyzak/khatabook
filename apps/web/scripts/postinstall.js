const { execSync } = require('child_process');

// This script will run after npm install
try {
  // Run prisma generate
  console.log('Running prisma generate...');
  execSync('cd ../../packages/db && npx prisma generate', { stdio: 'inherit' });

  // Check if we're in production (Vercel)
  if (process.env.VERCEL === '1') {
    try {
      // Run prisma deploy in production
      console.log('Running prisma migrate deploy...');
      execSync('cd ../../packages/db && npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (migrateError) {
      // Check if it's the "database already exists" error
      if (migrateError.message && migrateError.message.includes('P3005')) {
        console.log('Database already exists and has tables. Skipping migration...');
      } else {
        throw migrateError;
      }
    }
  }
} catch (error) {
  console.error('postinstall script failed:', error);
  process.exit(1);
}