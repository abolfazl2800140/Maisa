import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 ایجاد کاربر ادمین...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // ایجاد یا آپدیت کاربر ادمین
  const admin = await prisma.user.upsert({
    where: { email: 'admin@maysa.com' },
    update: {
      passwordHash: hashedPassword,
      role: 'admin',
    },
    create: {
      email: 'admin@maysa.com',
      passwordHash: hashedPassword,
      firstName: 'ادمین',
      lastName: 'مایسا',
      role: 'admin',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('✅ کاربر ادمین ایجاد شد:');
  console.log('   ایمیل: admin@maysa.com');
  console.log('   رمز عبور: admin123');
  console.log('   نقش: admin');

  // ایجاد سوپر ادمین
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@maysa.com' },
    update: {
      passwordHash: hashedPassword,
      role: 'super_admin',
    },
    create: {
      email: 'superadmin@maysa.com',
      passwordHash: hashedPassword,
      firstName: 'سوپر ادمین',
      lastName: 'مایسا',
      role: 'super_admin',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('\n✅ کاربر سوپر ادمین ایجاد شد:');
  console.log('   ایمیل: superadmin@maysa.com');
  console.log('   رمز عبور: admin123');
  console.log('   نقش: super_admin');
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
