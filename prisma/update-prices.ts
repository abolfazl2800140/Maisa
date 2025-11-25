import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// قیمت‌های رند (به تومان)
const roundPrices = [
  450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000,
  950000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000,
  1900000, 2000000, 2200000, 2500000, 2800000, 3000000
];

async function main() {
  console.log('🔄 شروع آپدیت قیمت‌های محصولات...');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });

  for (let i = 0; i < products.length; i++) {
    const basePrice = roundPrices[i % roundPrices.length];
    const discount = products[i].discountPercentage || 0;
    const finalPrice = basePrice - (basePrice * discount) / 100;

    await prisma.product.update({
      where: { id: products[i].id },
      data: {
        basePrice: basePrice,
        finalPrice: finalPrice,
      },
    });
  }

  console.log(`✅ قیمت ${products.length} محصول به اعداد رند تغییر کرد`);
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
