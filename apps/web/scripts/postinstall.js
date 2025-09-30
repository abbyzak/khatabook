const { execSync } = require('child_process');

// This script will run after npm install
try {
  // Run prisma generate
  console.log('Running prisma generate...');
  execSync('cd ../../packages/db && npx prisma generate', { stdio: 'inherit' });

  // Check if we're in production (Vercel)
  if (process.env.VERCEL === '1') {
    try {
      // Create migrations directory if it doesn't exist
      execSync('cd ../../packages/db && mkdir -p prisma/migrations/0_init', { stdio: 'inherit' });
      
      // Run prisma migrate to create tables
      console.log('Running prisma migrate deploy...');
      execSync('cd ../../packages/db && npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (error) {
      if (error.message && error.message.includes('P3005')) {
        console.log('Database schema already exists, continuing...');
      } else {
        console.error('Migration error:', error);
        process.exit(1);
      }
    }
  }
} catch (error) {
  console.error('postinstall script failed:', error);
  process.exit(1);
}