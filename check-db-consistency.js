require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseConsistency() {
    console.log('🔍 شروع بررسی سازگاری دیتابیس...\n');

    const issues = [];
    const warnings = [];

    try {
        // 1. بررسی وجود جداول
        console.log('📋 بررسی جداول...');
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

        const expectedTables = [
            'users', 'categories', 'brands', 'products',
            'product_images', 'product_variants', 'addresses',
            'orders', 'order_items', 'reviews', 'wishlist'
        ];

        const existingTables = tables.map(t => t.table_name);

        expectedTables.forEach(table => {
            if (!existingTables.includes(table)) {
                issues.push(`❌ جدول ${table} وجود ندارد`);
            } else {
                console.log(`  ✅ ${table}`);
            }
        });

        // 2. بررسی ENUM Types
        console.log('\n📊 بررسی ENUM Types...');
        const enums = await prisma.$queryRaw`
      SELECT t.typname as enum_name, 
             array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname
      ORDER BY t.typname;
    `;

        const expectedEnums = {
            'UserRole': ['customer', 'admin', 'super_admin'],
            'OrderStatus': ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            'PaymentStatus': ['pending', 'paid', 'failed', 'refunded']
        };

        for (const [enumName, expectedValues] of Object.entries(expectedEnums)) {
            const dbEnum = enums.find(e => e.enum_name === enumName);
            if (!dbEnum) {
                issues.push(`❌ ENUM ${enumName} وجود ندارد`);
            } else {
                const dbValues = dbEnum.enum_values;
                const missing = expectedValues.filter(v => !dbValues.includes(v));
                const extra = dbValues.filter(v => !expectedValues.includes(v));

                if (missing.length > 0) {
                    issues.push(`❌ ${enumName}: مقادیر گم‌شده: ${missing.join(', ')}`);
                }
                if (extra.length > 0) {
                    warnings.push(`⚠️  ${enumName}: مقادیر اضافی: ${extra.join(', ')}`);
                }
                if (missing.length === 0 && extra.length === 0) {
                    console.log(`  ✅ ${enumName}: ${dbValues.join(', ')}`);
                }
            }
        }

        // 3. بررسی ستون‌های هر جدول
        console.log('\n🔧 بررسی ستون‌های جداول...');

        for (const table of expectedTables) {
            if (!existingTables.includes(table)) continue;

            const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = ${table}
        ORDER BY ordinal_position;
      `;

            console.log(`\n  📄 ${table}:`);

            // بررسی ستون‌های مهم
            const requiredColumns = {
                'users': ['id', 'email', 'password_hash', 'role', 'created_at'],
                'products': ['id', 'name', 'slug', 'category_id', 'base_price', 'final_price'],
                'orders': ['id', 'order_number', 'user_id', 'status', 'total_amount'],
                'product_variants': ['id', 'product_id', 'sku', 'stock_quantity']
            };

            if (requiredColumns[table]) {
                const columnNames = columns.map(c => c.column_name);
                requiredColumns[table].forEach(col => {
                    if (!columnNames.includes(col)) {
                        issues.push(`❌ ${table}.${col} وجود ندارد`);
                    } else {
                        console.log(`    ✅ ${col}`);
                    }
                });
            }
        }

        // 4. بررسی Indexes
        console.log('\n📇 بررسی Indexes...');
        const indexes = await prisma.$queryRaw`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;

        const importantIndexes = [
            'idx_users_email',
            'idx_products_slug',
            'idx_orders_user',
            'idx_product_variants_product'
        ];

        const existingIndexNames = indexes.map(i => i.indexname);
        importantIndexes.forEach(idx => {
            if (existingIndexNames.includes(idx)) {
                console.log(`  ✅ ${idx}`);
            } else {
                warnings.push(`⚠️  Index ${idx} وجود ندارد (اختیاری)`);
            }
        });

        // 5. بررسی Foreign Keys
        console.log('\n🔗 بررسی Foreign Keys...');
        const foreignKeys = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `;

        console.log(`  ✅ تعداد Foreign Keys: ${foreignKeys.length}`);

        // 6. بررسی Triggers
        console.log('\n⚡ بررسی Triggers...');
        const triggers = await prisma.$queryRaw`
      SELECT 
        trigger_name,
        event_object_table as table_name,
        action_timing,
        event_manipulation
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name;
    `;

        if (triggers.length > 0) {
            console.log(`  ✅ تعداد Triggers: ${triggers.length}`);
            triggers.forEach(t => {
                console.log(`    - ${t.trigger_name} on ${t.table_name}`);
            });
        } else {
            warnings.push('⚠️  هیچ Trigger فعالی یافت نشد');
        }

        // 7. بررسی Extensions
        console.log('\n🔌 بررسی Extensions...');
        const extensions = await prisma.$queryRaw`
      SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pg_trgm');
    `;

        const requiredExtensions = ['uuid-ossp', 'pg_trgm'];
        const installedExtensions = extensions.map(e => e.extname);

        requiredExtensions.forEach(ext => {
            if (installedExtensions.includes(ext)) {
                console.log(`  ✅ ${ext}`);
            } else {
                warnings.push(`⚠️  Extension ${ext} نصب نشده است`);
            }
        });

        // نمایش نتایج
        console.log('\n' + '='.repeat(60));
        console.log('📊 نتیجه بررسی:');
        console.log('='.repeat(60));

        if (issues.length === 0 && warnings.length === 0) {
            console.log('\n✅ دیتابیس کاملاً با schema مطابقت دارد!');
        } else {
            if (issues.length > 0) {
                console.log('\n❌ مشکلات یافت شده:');
                issues.forEach(issue => console.log(`  ${issue}`));
            }

            if (warnings.length > 0) {
                console.log('\n⚠️  هشدارها:');
                warnings.forEach(warning => console.log(`  ${warning}`));
            }
        }

        console.log('\n' + '='.repeat(60));

        // پیشنهادات
        if (issues.length > 0) {
            console.log('\n💡 پیشنهادات:');
            console.log('  1. برای همگام‌سازی دیتابیس با Prisma Schema:');
            console.log('     npx prisma db push');
            console.log('\n  2. یا برای ایجاد migration:');
            console.log('     npx prisma migrate dev --name sync_database');
            console.log('\n  3. برای بازسازی کامل (⚠️ داده‌ها پاک می‌شوند):');
            console.log('     npx prisma migrate reset');
        }

    } catch (error) {
        console.error('\n❌ خطا در بررسی دیتابیس:', error.message);

        if (error.code === 'P1001') {
            console.log('\n💡 نکته: مطمئن شوید که:');
            console.log('  - دیتابیس در حال اجرا است');
            console.log('  - DATABASE_URL در .env صحیح است');
            console.log('  - دسترسی به دیتابیس دارید');
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabaseConsistency();
