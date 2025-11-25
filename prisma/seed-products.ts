import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// عکس‌های کوله‌پشتی در فضای سفید از Unsplash
const backpackImages = [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&bg=white',
  'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500&bg=white',
  'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&bg=white',
  'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500&bg=white',
  'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=500&bg=white',
  'https://images.unsplash.com/photo-1622560480654-1e8f98c30d94?w=500&bg=white',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&bg=white',
  'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=500&bg=white',
  'https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=500&bg=white',
  'https://images.unsplash.com/photo-1592813630790-8c7195f8c92b?w=500&bg=white',
];

const backpackNames = [
  'کوله پشتی اسپرت مدل Pro',
  'کوله پشتی لپ‌تاپ مدل Business',
  'کوله پشتی کوهنوردی Alpine',
  'کوله پشتی مسافرتی Travel Plus',
  'کوله پشتی دانشجویی Campus',
  'کوله پشتی ورزشی Gym Master',
  'کوله پشتی روزانه Daily',
  'کوله پشتی ضد آب Waterproof',
  'کوله پشتی مینیمال Slim',
  'کوله پشتی چرم Leather Classic',
];

const colors = ['مشکی', 'سرمه‌ای', 'خاکستری', 'قهوه‌ای', 'سبز', 'آبی', 'قرمز', 'بژ'];
const sizes = ['کوچک', 'متوسط', 'بزرگ'];

function generateSlug(name: string, index: number): string {
  return `backpack-${index + 1}`;
}

async function main() {
  console.log('🎒 شروع ایجاد محصولات کوله‌پشتی...');

  // ابتدا یک دسته‌بندی برای کوله‌پشتی ایجاد می‌کنیم
  let category = await prisma.category.findUnique({
    where: { slug: 'backpacks' },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'کوله پشتی',
        slug: 'backpacks',
        description: 'انواع کوله پشتی با کیفیت بالا',
        isActive: true,
      },
    });
    console.log('✅ دسته‌بندی کوله‌پشتی ایجاد شد');
  }

  // ایجاد یک برند
  let brand = await prisma.brand.findUnique({
    where: { slug: 'maysa-bags' },
  });

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: 'Maysa Bags',
        slug: 'maysa-bags',
        description: 'برند معتبر کیف و کوله‌پشتی',
        isActive: true,
      },
    });
    console.log('✅ برند Maysa Bags ایجاد شد');
  }

  // ایجاد 50 محصول
  for (let i = 0; i < 50; i++) {
    const nameIndex = i % backpackNames.length;
    const imageIndex = i % backpackImages.length;
    const basePrice = Math.floor(Math.random() * 2000000) + 500000; // 500,000 تا 2,500,000 تومان
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0;
    const finalPrice = basePrice - (basePrice * discount) / 100;

    const product = await prisma.product.create({
      data: {
        name: `${backpackNames[nameIndex]} - ${i + 1}`,
        slug: generateSlug(backpackNames[nameIndex], i),
        description: `کوله پشتی با کیفیت عالی، مناسب برای استفاده روزانه. دارای جیب‌های متعدد، بند قابل تنظیم و طراحی ارگونومیک. محصول شماره ${i + 1}`,
        categoryId: category.id,
        brandId: brand.id,
        basePrice: basePrice,
        discountPercentage: discount,
        finalPrice: finalPrice,
        sku: `BP-${String(i + 1).padStart(4, '0')}`,
        weight: Math.random() * 1.5 + 0.5,
        features: {
          material: 'پارچه آکسفورد ضد آب',
          capacity: `${Math.floor(Math.random() * 30) + 15} لیتر`,
          laptopSize: '15.6 اینچ',
          warranty: '12 ماه',
        },
        tags: ['کوله پشتی', 'کیف', 'اکسسوری', colors[i % colors.length]],
        ratingAverage: Math.random() * 2 + 3,
        ratingCount: Math.floor(Math.random() * 100),
        reviewCount: Math.floor(Math.random() * 50),
        viewCount: Math.floor(Math.random() * 1000),
        salesCount: Math.floor(Math.random() * 200),
        isFeatured: i < 10,
        isActive: true,
      },
    });

    // اضافه کردن عکس اصلی
    await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: backpackImages[imageIndex],
        altText: product.name,
        displayOrder: 0,
        isPrimary: true,
      },
    });

    // اضافه کردن یک عکس ثانویه
    await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: backpackImages[(imageIndex + 1) % backpackImages.length],
        altText: `${product.name} - نمای دوم`,
        displayOrder: 1,
        isPrimary: false,
      },
    });

    // ایجاد واریانت‌ها (رنگ و سایز)
    const color = colors[i % colors.length];
    const size = sizes[i % sizes.length];
    
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `BP-${String(i + 1).padStart(4, '0')}-${color}-${size}`,
        color: color,
        colorCode: '#333333',
        size: size,
        stockQuantity: Math.floor(Math.random() * 50) + 10,
        isActive: true,
      },
    });

    console.log(`✅ محصول ${i + 1}/50: ${product.name}`);
  }

  console.log('\n🎉 تمام! 50 محصول کوله‌پشتی با موفقیت ایجاد شد.');
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
