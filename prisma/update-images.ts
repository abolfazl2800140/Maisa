import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️  شروع آپدیت تصاویر محصولات...');

  // دریافت تمام محصولات
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  console.log(`📦 ${products.length} محصول پیدا شد`);

  // فقط تصاویر کوله پشتی با بک‌گراند تمیز
  const bagImages = [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622560481092-ec4e0c0e8f3f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622560480859-b8dafc9cf30c?w=600&h=600&fit=crop',
  ];

  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // انتخاب تصویر به صورت چرخشی
    const imageUrl = bagImages[i % bagImages.length];

    // حذف تصاویر قدیمی
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    // اضافه کردن تصاویر جدید
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          imageUrl: imageUrl,
          altText: product.name,
          displayOrder: 0,
          isPrimary: true,
        },
        {
          productId: product.id,
          imageUrl: bagImages[(i + 1) % bagImages.length],
          altText: `${product.name} - نمای دوم`,
          displayOrder: 1,
          isPrimary: false,
        },
        {
          productId: product.id,
          imageUrl: bagImages[(i + 2) % bagImages.length],
          altText: `${product.name} - نمای سوم`,
          displayOrder: 2,
          isPrimary: false,
        },
      ],
    });

    updated++;
    if (updated % 10 === 0) {
      console.log(`✅ ${updated} محصول آپدیت شد...`);
    }
  }

  console.log(`\n✅ تصاویر ${updated} محصول با موفقیت آپدیت شدند!`);
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
