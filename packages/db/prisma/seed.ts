import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10)
  const hashedManagerPassword = await bcrypt.hash('Manager123!', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@sabirkhatabook.test',
      password: hashedAdminPassword,
      role: 'admin'
    }
  })

  const manager1 = await prisma.user.create({
    data: {
      name: 'احمد علی',
      email: 'ahmed@sabirkhatabook.test',
      password: hashedManagerPassword,
      role: 'manager'
    }
  })

  const manager2 = await prisma.user.create({
    data: {
      name: 'محمد حسن',
      email: 'hassan@sabirkhatabook.test',
      password: hashedManagerPassword,
      role: 'manager'
    }
  })

  const products1 = await Promise.all([
    prisma.product.create({
      data: {
        managerId: manager1.id,
        name: 'یوریا کھاد',
        type: 'fertilizer',
        unit: 'بیگ',
        price: 3500,
        stock: 50
      }
    }),
    prisma.product.create({
      data: {
        managerId: manager1.id,
        name: 'گندم کا بیج',
        type: 'seed',
        unit: 'کلو',
        price: 85,
        stock: 200
      }
    }),
    prisma.product.create({
      data: {
        managerId: manager1.id,
        name: 'کیڑے مار دوا',
        type: 'spray',
        unit: 'لیٹر',
        price: 1200,
        stock: 25
      }
    })
  ])

  const products2 = await Promise.all([
    prisma.product.create({
      data: {
        managerId: manager2.id,
        name: 'ڈی اے پی کھاد',
        type: 'fertilizer',
        unit: 'بیگ',
        price: 4200,
        stock: 30
      }
    }),
    prisma.product.create({
      data: {
        managerId: manager2.id,
        name: 'مکئی کا بیج',
        type: 'seed',
        unit: 'کلو',
        price: 95,
        stock: 150
      }
    })
  ])

  const clients1 = await Promise.all([
    prisma.client.create({
      data: {
        managerId: manager1.id,
        name: 'فرمان علی',
        phone: '03001234567',
        address: 'چک نمبر 123، فیصل آباد',
        balance: 0
      }
    }),
    prisma.client.create({
      data: {
        managerId: manager1.id,
        name: 'اکرم حسین',
        phone: '03009876543',
        address: 'گاؤں میں اب، سیالکوٹ',
        balance: 0
      }
    })
  ])

  const clients2 = await Promise.all([
    prisma.client.create({
      data: {
        managerId: manager2.id,
        name: 'غلام رسول',
        phone: '03001111111',
        address: 'موضع کریم نگر، گوجرانوالہ',
        balance: 0
      }
    })
  ])

  await Promise.all([
    prisma.transaction.create({
      data: {
        clientId: clients1[0].id,
        managerId: manager1.id,
        productId: products1[0].id,
        type: 'sale',
        quantity: 2,
        amount: 7000,
        note: '2 بیگ یوریا کھاد'
      }
    }),
    prisma.transaction.create({
      data: {
        clientId: clients1[0].id,
        managerId: manager1.id,
        type: 'payment',
        amount: 3000,
        note: 'جزوی ادائیگی'
      }
    }),
    prisma.transaction.create({
      data: {
        clientId: clients1[1].id,
        managerId: manager1.id,
        productId: products1[1].id,
        type: 'sale',
        quantity: 10,
        amount: 850,
        note: '10 کلو گندم کا بیج'
      }
    })
  ])

  await prisma.client.update({
    where: { id: clients1[0].id },
    data: { balance: 4000 }
  })

  await prisma.client.update({
    where: { id: clients1[1].id },
    data: { balance: 850 }
  })

  await prisma.product.update({
    where: { id: products1[0].id },
    data: { stock: 48 }
  })

  await prisma.product.update({
    where: { id: products1[1].id },
    data: { stock: 190 }
  })

  console.log('Database seeded successfully!')
  console.log('Admin Login: admin@sabirkhatabook.test / Admin123!')
  console.log('Manager Login: ahmed@sabirkhatabook.test / Manager123!')
  console.log('Manager Login: hassan@sabirkhatabook.test / Manager123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })