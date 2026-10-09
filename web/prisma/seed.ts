import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Create categories
  const skincare = await prisma.category.upsert({ where: { name: 'Skincare' }, update: {}, create: { name: 'Skincare' } })
  const makeup = await prisma.category.upsert({ where: { name: 'Makeup' }, update: {}, create: { name: 'Makeup' } })
  const haircare = await prisma.category.upsert({ where: { name: 'Haircare' }, update: {}, create: { name: 'Haircare' } })
  const fragrance = await prisma.category.upsert({ where: { name: 'Fragrance' }, update: {}, create: { name: 'Fragrance' } })
  const skincareTools = await prisma.category.upsert({ where: { name: 'Tools & Accessories' }, update: {}, create: { name: 'Tools & Accessories' } })

  // 2. Create products, linked to categories
  const products = [
      // Skincare
      {
        name: 'Vitamin C Brightening Serum',
        description: 'Lightweight serum with 15% vitamin C to even skin tone and boost radiance.',
        price: 2999,
        discount: 10,
        stock: 50,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: skincare.id
      },
      {
        name: 'Hyaluronic Acid Moisturizer',
        description: 'Deep hydration gel-cream for all skin types.',
        price: 2499,
        discount: 0,
        stock: 80,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: skincare.id
      },
      {
        name: 'Niacinamide 10% Serum',
        description: 'Pore-refining serum to reduce blemishes and control oil.',
        price: 1899,
        discount: 15,
        stock: 60,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: skincare.id
      },
      {
        name: 'Gentle Foaming Cleanser',
        description: 'Sulfate-free daily cleanser for sensitive skin.',
        price: 1499,
        discount: 0,
        stock: 100,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: skincare.id
      },

      // Makeup
      {
        name: 'Matte Liquid Lipstick',
        description: 'Long-lasting, transfer-proof matte finish.',
        price: 1599,
        discount: 0,
        stock: 120,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: makeup.id
      },
      {
        name: 'Full Coverage Foundation',
        description: '24-hour wear foundation available in 30 shades.',
        price: 3299,
        discount: 5,
        stock: 70,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: makeup.id
      },
      {
        name: 'Volumizing Mascara',
        description: 'Buildable formula for dramatic lash volume.',
        price: 1299,
        discount: 0,
        stock: 150,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: makeup.id
      },
      {
        name: 'Eyeshadow Palette – Nude Edition',
        description: '12-shade matte and shimmer nude palette.',
        price: 3599,
        discount: 20,
        stock: 40,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: makeup.id
      },

      // Haircare
      {
        name: 'Argan Oil Hair Serum',
        description: 'Smooths frizz and adds shine without weighing hair down.',
        price: 1999,
        discount: 0,
        stock: 65,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: haircare.id
      },
      {
        name: 'Repairing Shampoo',
        description: 'Sulfate-free shampoo for damaged, color-treated hair.',
        price: 1799,
        discount: 10,
        stock: 90,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: haircare.id
      },

      // Fragrance
      {
        name: 'Floral Eau de Parfum',
        description: 'Soft floral scent with notes of jasmine and vanilla.',
        price: 4999,
        discount: 0,
        stock: 30,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: fragrance.id
      },
      {
        name: 'Citrus Body Mist',
        description: 'Light, refreshing everyday fragrance.',
        price: 1299,
        discount: 0,
        stock: 100,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: fragrance.id
      },

      // Tools & Accessories
      {
        name: 'Jade Facial Roller',
        description: 'Reduces puffiness and promotes lymphatic drainage.',
        price: 999,
        discount: 0,
        stock: 45,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: skincareTools.id
      },
      {
        name: 'Makeup Brush Set (12pc)',
        description: 'Professional-grade synthetic brush set with case.',
        price: 2799,
        discount: 25,
        stock: 55,
        imageUrl: '/images/nonProduct.jpg',
        categoryId: skincareTools.id
      }
    ]
  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name, categoryId: product.categoryId } })
    if (!existing) await prisma.product.create({ data: product })
  }

  console.log('✅ Missing seed categories and products added; existing records preserved')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
