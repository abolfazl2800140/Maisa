require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

async function applyOptimizations() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Aa@123456@',
        database: 'maisa_shop'
    });

    try {
        await client.connect();
        console.log('✅ اتصال به دیتابیس موفق بود\n');

        // خواندن فایل SQL
        const sql = fs.readFileSync('add-optimizations.sql', 'utf8');

        console.log('⏳ در حال اعمال بهینه‌سازی‌ها...\n');

        // اجرای SQL
        await client.query(sql);

        console.log('\n✅ همه بهینه‌سازی‌ها با موفقیت اعمال شدند!');
        console.log('\n📊 موارد اضافه شده:');
        console.log('  ✅ Extensions (uuid-ossp, pg_trgm)');
        console.log('  ✅ Indexes برای بهبود سرعت کوئری‌ها');
        console.log('  ✅ Triggers برای محاسبات خودکار');
        console.log('  ✅ Search Vector برای جستجوی متنی');

    } catch (error) {
        console.error('\n❌ خطا در اعمال بهینه‌سازی‌ها:', error.message);
        console.error('\nجزئیات:', error);
    } finally {
        await client.end();
    }
}

applyOptimizations();
