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
      create: { name: 'مایسا', slug: 'maysa', description: 'برند ایرانی کیف و کوله پشتی' },
    }),
    prisma.brand.upsert({
      where: { slug: 'delsey' },
      update: {},
      create: { name: 'دلسی', slug: 'delsey', description: 'برند فرانسوی چمدان' },
    }),
    prisma.brand.upsert({
      where: { slug: 'samsonite' },
      update: {},
      create: { name: 'سامسونایت', slug: 'samsonite', description: 'برند آمریکایی چمدان' },
    }),
    prisma.brand.upsert({
      where: { slug: 'nike' },
      update: {},
      create: { name: 'نایک', slug: 'nike', description: 'برند ورزشی' },
    }),
    prisma.brand.upsert({
      where: { slug: 'adidas' },
      update: {},
      create: { name: 'آدیداس', slug: 'adidas', description: 'برند ورزشی' },
    }),
  ]);

  console.log('✅ برندها ایجاد شدند');

  // ایجاد دسته‌بندی‌ها
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'backpack' },
      update: {},
      create: { name: 'کوله پشتی', slug: 'backpack', description: 'انواع کوله پشتی', displayOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'handbag' },
      update: {},
      create: { name: 'کیف دستی', slug: 'handbag', description: 'انواع کیف دستی', displayOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'suitcase' },
      update: {},
      create: { name: 'چمدان', slug: 'suitcase', description: 'انواع چمدان مسافرتی', displayOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'wallet' },
      update: {},
      create: { name: 'کیف پول', slug: 'wallet', description: 'انواع کیف پول', displayOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'sports-bag' },
      update: {},
      create: { name: 'کیف ورزشی', slug: 'sports-bag', description: 'کیف‌های ورزشی', displayOrder: 5 },
    }),
  ]);

  console.log('✅ دسته‌بندی‌ها ایجاد شدند');

  // محصولات
  const products = [
    // کوله پشتی‌ها (15 محصول)
    { name: 'کوله پشتی لپ‌تاپ مایسا Pro', category: 0, brand: 0, price: 1500000, discount: 10, featured: true },
    { name: 'کوله پشتی دانشجویی مایسا Classic', category: 0, brand: 0, price: 890000, discount: 15, featured: true },
    { name: 'کوله پشتی ورزشی نایک Elite', category: 0, brand: 3, price: 2100000, discount: 0, featured: false },
    { name: 'کوله پشتی مدرسه آدیداس Kids', category: 0, brand: 4, price: 750000, discount: 20, featured: false },
    { name: 'کوله پشتی کوهنوردی مایسا Mountain', category: 0, brand: 0, price: 3200000, discount: 5, featured: true },
    { name: 'کوله پشتی چرمی دلسی Leather', category: 0, brand: 1, price: 4500000, discount: 0, featured: true },
    { name: 'کوله پشتی ضدآب مایسا Waterproof', category: 0, brand: 0, price: 1200000, discount: 12, featured: false },
    { name: 'کوله پشتی لپ‌تاپ سامسونایت Business', category: 0, brand: 2, price: 5200000, discount: 8, featured: true },
    { name: 'کوله پشتی دوچرخه سواری نایک Cycling', category: 0, brand: 3, price: 1800000, discount: 0, featured: false },
    { name: 'کوله پشتی کودک مایسا Kids Fun', category: 0, brand: 0, price: 650000, discount: 25, featured: false },
    { name: 'کوله پشتی اسپرت آدیداس Sport Pro', category: 0, brand: 4, price: 1950000, discount: 10, featured: false },
    { name: 'کوله پشتی مینی مایسا Mini', category: 0, brand: 0, price: 580000, discount: 15, featured: false },
    { name: 'کوله پشتی گیمینگ دلسی Gaming', category: 0, brand: 1, price: 2800000, discount: 0, featured: false },
    { name: 'کوله پشتی دوشی مایسا Sling', category: 0, brand: 0, price: 720000, discount: 18, featured: false },
    { name: 'کوله پشتی حرفه‌ای سامسونایت Pro', category: 0, brand: 2, price: 6500000, discount: 5, featured: true },

    // کیف دستی (12 محصول)
    { name: 'کیف دستی زنانه مایسا Elegant', category: 1, brand: 0, price: 1350000, discount: 10, featured: true },
    { name: 'کیف دستی چرمی دلسی Luxury', category: 1, brand: 1, price: 3800000, discount: 0, featured: true },
    { name: 'کیف دستی اداری مایسا Office', category: 1, brand: 0, price: 980000, discount: 15, featured: false },
    { name: 'کیف دستی مجلسی دلسی Party', category: 1, brand: 1, price: 2500000, discount: 20, featured: true },
    { name: 'کیف دستی روزمره مایسا Daily', category: 1, brand: 0, price: 750000, discount: 12, featured: false },
    { name: 'کیف دستی اسپرت نایک Sport', category: 1, brand: 3, price: 1200000, discount: 0, featured: false },
    { name: 'کیف دستی دخترانه مایسا Girls', category: 1, brand: 0, price: 680000, discount: 25, featured: false },
    { name: 'کیف دستی چرم طبیعی دلسی Natural', category: 1, brand: 1, price: 5200000, discount: 5, featured: true },
    { name: 'کیف دستی کوچک مایسا Mini Bag', category: 1, brand: 0, price: 520000, discount: 15, featured: false },
    { name: 'کیف دستی دوشی آدیداس Shoulder', category: 1, brand: 4, price: 1450000, discount: 10, featured: false },
    { name: 'کیف دستی لپ‌تاپ سامسونایت Laptop', category: 1, brand: 2, price: 3200000, discount: 0, featured: false },
    { name: 'کیف دستی مسافرتی مایسا Travel', category: 1, brand: 0, price: 1850000, discount: 8, featured: false },

    // چمدان (10 محصول)
    { name: 'چمدان کابین دلسی Cabin', category: 2, brand: 1, price: 4500000, discount: 10, featured: true },
    { name: 'چمدان بزرگ سامسونایت Large', category: 2, brand: 2, price: 8500000, discount: 5, featured: true },
    { name: 'چمدان متوسط مایسا Medium', category: 2, brand: 0, price: 3200000, discount: 15, featured: false },
    { name: 'چمدان چرخ‌دار دلسی Spinner', category: 2, brand: 1, price: 6800000, discount: 8, featured: true },
    { name: 'چمدان سخت سامسونایت Hardside', category: 2, brand: 2, price: 9500000, discount: 0, featured: true },
    { name: 'چمدان نرم مایسا Softside', category: 2, brand: 0, price: 2800000, discount: 20, featured: false },
    { name: 'چمدان کوچک دلسی Small', category: 2, brand: 1, price: 3500000, discount: 12, featured: false },
    { name: 'چمدان لوکس سامسونایت Luxury', category: 2, brand: 2, price: 12000000, discount: 0, featured: true },
    { name: 'چمدان ست مایسا Set', category: 2, brand: 0, price: 7500000, discount: 18, featured: true },
    { name: 'چمدان ضدضربه دلسی Shockproof', category: 2, brand: 1, price: 5500000, discount: 10, featured: false },

    // کیف پول (8 محصول)
    { name: 'کیف پول چرمی مایسا Leather', category: 3, brand: 0, price: 450000, discount: 10, featured: false },
    { name: 'کیف پول مردانه دلسی Men', category: 3, brand: 1, price: 850000, discount: 15, featured: true },
    { name: 'کیف پول زنانه مایسا Women', category: 3, brand: 0, price: 380000, discount: 20, featured: false },
    { name: 'کیف پول کوچک نایک Mini', category: 3, brand: 3, price: 320000, discount: 0, featured: false },
    { name: 'کیف پول جیبی آدیداس Pocket', category: 3, brand: 4, price: 280000, discount: 25, featured: false },
    { name: 'کیف پول لوکس دلسی Luxury', category: 3, brand: 1, price: 1200000, discount: 5, featured: true },
    { name: 'کیف پول کارتی مایسا Card', category: 3, brand: 0, price: 250000, discount: 15, featured: false },
    { name: 'کیف پول اسپرت سامسونایت Sport', category: 3, brand: 2, price: 680000, discount: 10, featured: false },

    // کیف ورزشی (5 محصول)
    { name: 'کیف ورزشی نایک Gym', category: 4, brand: 3, price: 1850000, discount: 10, featured: true },
    { name: 'کیف ورزشی آدیداس Training', category: 4, brand: 4, price: 1650000, discount: 15, featured: true },
    { name: 'کیف ورزشی مایسا Sport', category: 4, brand: 0, price: 980000, discount: 20, featured: false },
    { name: 'کیف ورزشی نایک Duffel', category: 4, brand: 3, price: 2200000, discount: 0, featured: false },
    { name: 'کیف ورزشی آدیداس Team', category: 4, brand: 4, price: 1950000, discount: 12, featured: false },
  ];

  console.log('🔄 در حال ایجاد محصولات...');

  const colors = [
    { name: 'مشکی', code: '#000000' },
    { name: 'قهوه‌ای', code: '#8B4513' },
    { name: 'آبی', code: '#0000FF' },
    { name: 'قرمز', code: '#FF0000' },
    { name: 'سبز', code: '#008000' },
    { name: 'خاکستری', code: '#808080' },
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const finalPrice = p.price * (1 - p.discount / 100);
    
    await prisma.product.create({
      data: {
        name: p.name,
        slug: `product-${i + 1}-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
        description: `${p.name} با کیفیت عالی و طراحی مدرن. مناسب برای استفاده روزمره و مسافرت.`,
        categoryId: categories[p.category].id,
        brandId: brands[p.brand].id,
        basePrice: p.price,
        discountPercentage: p.discount,
        finalPrice: finalPrice,
        sku: `SKU-${String(i + 1).padStart(3, '0')}`,
        weight: 500 + Math.random() * 1500,
        tags: ['جدید', 'پرفروش', 'با کیفیت'],
        isFeatured: p.featured,
        ratingAverage: 4 + Math.random(),
        ratingCount: Math.floor(Math.random() * 100) + 10,
        reviewCount: Math.floor(Math.random() * 50) + 5,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        salesCount: Math.floor(Math.random() * 200) + 20,
        features: {
          material: 'چرم مصنوعی با کیفیت',
          waterproof: Math.random() > 0.5,
          warranty: '12 ماه',
          origin: 'ایران',
        },
        images: {
          create: [
            {
              imageUrl: `/images/products/product-${i + 1}-1.jpg`,
              altText: p.name,
              displayOrder: 0,
              isPrimary: true,
            },
            {
              imageUrl: `/images/products/product-${i + 1}-2.jpg`,
              altText: `${p.name} - تصویر 2`,
              displayOrder: 1,
              isPrimary: false,
            },
          ],
        },
        variants: {
          create: colors.slice(0, 2 + Math.floor(Math.random() * 2)).map((color, idx) => ({
            sku: `SKU-${String(i + 1).padStart(3, '0')}-${color.name}`,
            color: color.name,
            colorCode: color.code,
            stockQuantity: Math.floor(Math.random() * 100) + 20,
            priceAdjustment: idx === 0 ? 0 : Math.floor(Math.random() * 100000),
          })),
        },
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`✅ ${i + 1} محصول ایجاد شد...`);
    }
  }

  console.log(`\n✅ تمام ${products.length} محصول با موفقیت ایجاد شدند!`);

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
