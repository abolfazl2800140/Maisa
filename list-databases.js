require('dotenv').config();
const { Client } = require('pg');

async function listDatabases() {
    // اتصال به postgres database برای لیست کردن دیتابیس‌ها
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Aa@123456@',
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('✅ اتصال به PostgreSQL موفق بود\n');

        const result = await client.query(`
      SELECT datname 
      FROM pg_database 
      WHERE datistemplate = false
      ORDER BY datname;
    `);

        console.log('📊 دیتابیس‌های موجود:');
        console.log('='.repeat(40));
        result.rows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.datname}`);
        });
        console.log('='.repeat(40));

    } catch (error) {
        console.error('❌ خطا:', error.message);
    } finally {
        await client.end();
    }
}

listDatabases();
