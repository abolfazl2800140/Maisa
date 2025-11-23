import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 شروع Seed...');

  // ایجاد Super Admin
  const superAdminPassword = await bcrypt.hash('Admin@123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@maysa.com' },
    update: {},
    create: {
      email: 'admin@maysa.com',
      passwordHash: superAdminPassword,
      firstName: 'مدیر',
      lastName: 'سیستم',
      phone: '09123456789',
      role: 'super_admin',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log('✅ Super Admin ایجاد شد:', superAdmin.email);

  // ایجاد Admin
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'support@maysa.com' },
    update: {},
    create: {
      email: 'support@maysa.com',
      passwordHash: adminPassword,
      firstName: 'پشتیبانی',
      lastName: 'مایسا',
      phone: '09123456788',
      role: 'admin',
      emailVerified: true,
    },
  });

  console.log('✅ Admin ایجاد شد:', admin.email);

  // ایجاد Customer نمونه
  const customerPassword = await bcrypt.hash('User@123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: customerPassword,
      firstName: 'علی',
      lastName: 'احمدی',
      phone: '09123456787',
      role: 'customer',
      loyaltyPoints: 100,
    },
  });

  console.log('✅ Customer نمونه ایجاد شد:', customer.email);

  // ایجاد برندها
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'maysa' },
      update: {},
      create: {
        name: 'مایسا',
        slug: 'maysa',
        description: 'برند ایرانی کیف و کوله پشتی',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'delsey' },
      update: {},
      create: {
        name: 'دلسی',
        slug: 'delsey',
        description: 'برند فرانسوی چمدان',
      },
    }),
  ]);

  console.log('✅ برندها ایجاد شدند');

  // ایجاد دسته‌بندی‌ها
  const backpackCategory = await prisma.category.upsert({
    where: { slug: 'backpack' },
    update: {},
    create: {
      name: 'کوله پشتی',
      slug: 'backpack',
      description: 'انواع کوله پشتی',
      displayOrder: 1,
    },
  });

  const bagCategory = await prisma.category.upsert({
    where: { slug: 'handbag' },
    update: {},
    create: {
      name: 'کیف دستی',
      slug: 'handbag',
      description: 'انواع کیف دستی',
      displayOrder: 2,
    },
  });

  console.log('✅ دسته‌بندی‌ها ایجاد شدند');

  // ایجاد محصول نمونه
  const product = await prisma.product.create({
    data: {
      name: 'کوله پشتی لپ‌تاپ مایسا مدل Pro',
      slug: 'maysa-laptop-backpack-pro',
      description: 'کوله پشتی حرفه‌ای با جای لپ‌تاپ 15.6 اینچ',
      categoryId: backpackCategory.id,
      brandId: brands[0].id,
      basePrice: 1500000,
      discountPercentage: 10,
      sku: 'MAYSA-BP-001',
      weight: 800,
      tags: ['لپ‌تاپ', 'ضدآب', 'حرفه‌ای'],
      isFeatured: true,
      features: {
        material: 'چرم طبیعی',
        waterproof: true,
        warranty: '12 ماه',
        compartments: 3,
      },
      images: {
        create: [
          {
            imageUrl: '/images/products/backpack-1.jpg',
            altText: 'کوله پشتی مایسا',
            displayOrder: 0,
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'MAYSA-BP-001-BLACK',
            color: 'مشکی',
            colorCode: '#000000',
            stockQuantity: 50,
          },
          {
            sku: 'MAYSA-BP-001-BROWN',
            color: 'قهوه‌ای',
            colorCode: '#8B4513',
            stockQuantity: 30,
          },
        ],
      },
    },
  });

  console.log('✅ محصول نمونه ایجاد شد:', product.name);

  console.log('\n🎉 Seed با موفقیت انجام شد!');
  console.log('\n📝 اطلاعات ورود:');
  console.log('Super Admin: admin@maysa.com / Admin@123');
  console.log('Admin: support@maysa.com / Admin@123');
  console.log('Customer: user@example.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ خطا در Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
