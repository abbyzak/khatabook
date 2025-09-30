/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sabir-khatabook/db', '@sabir-khatabook/ui', '@sabir-khatabook/utils'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  }
}

module.exports = nextConfig