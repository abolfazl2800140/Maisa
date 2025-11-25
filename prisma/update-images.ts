import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// عکس‌های جدید کوله‌پشتی
const productImages = [
  '/images/products/0ad8d82bc43b9fa868831ed0ff48891421dd0dcf_1720267520.webp',
  '/images/products/12faf3b5c70f697444072e98e5f691f1c5d67386_1754246228.webp',
  '/images/products/27b7401cbedd8de810227a849b31c041971f7882_1670659483.webp',
  '/images/products/395803149a83a69bf3d60a0e90e7571fa486a0b1_1754245035.webp',
  '/images/products/3a520ac51fbe57a1da713d16a995971afe881944_1754254435.webp',
  '/images/products/3d7a4e752bf65ab7a3cdd636658a5f11cd036e42_1754240189.webp',
  '/images/products/55e96c418ab9970db715421fc477ae1ceb63e411_1688414720.webp',
  '/images/products/5f64af8736b6fc500472939cf5a77a5875914d46_1689153290.webp',
  '/images/products/69b08189e1337a0a5514ebb034945b12ce6bd55b_1703151361.webp',
  '/images/products/7423c5626a565301275afe5e82396277fad403e9_1757151739.webp',
  '/images/products/7c059cd5592fcc34ea6f458250ace97b9fef6401_1754461524.webp',
  '/images/products/89b4a2614d3acc68f5302a4f5cebede1264b31f2_1754246562.webp',
  '/images/products/9c9f1298e4138577ada2497629c014794f5f59d2_1688929796.webp',
  '/images/products/a29a21e8c216a6852b762493087e10d3da781342_1753035219.webp',
  '/images/products/c645c8ae3f9f972fc27c0660ace251059c51fd14_1754836069.webp',
  '/images/products/c8c702139316df44633af648eb019f362dd23a3c_1762869681.webp',
  '/images/products/ca877588e0f627a9e6df3ce67d2081301524922b_1755608687.webp',
  '/images/products/dd90dc8728a4059b04c17bd57af48c3e5974c640_1754253500.webp',
  '/images/products/e9f4f514e02948af92096225fd9105e376fec79d_1754250315.webp',
  '/images/products/f50e7b67878e6e73f3d451aba66432c102a2f93c_1752748812.webp',
  '/images/products/f58eb61834c917c6d2f5cde30d131702eb0e7a50_1754246228.webp',
  '/images/products/fc1db6b89cf6df713dbe858482e89573c382591c_1740498770.webp',
];

async function main() {
  console.log('🔄 شروع آپدیت عکس‌های محصولات...');

  const images = await prisma.productImage.findMany({
    orderBy: { createdAt: 'asc' },
  });

  for (let i = 0; i < images.length; i++) {
    const imageUrl = productImages[i % productImages.length];
    
    await prisma.productImage.update({
      where: { id: images[i].id },
      data: { imageUrl },
    });
  }

  console.log(`✅ ${images.length} عکس آپدیت شد با ${productImages.length} عکس جدید`);
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
