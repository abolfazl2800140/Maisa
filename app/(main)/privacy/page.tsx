export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-secondary">حریم خصوصی</h1>

                <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">1. مقدمه</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            فروشگاه مایسا متعهد به حفظ حریم خصوصی کاربران خود است. این سند نحوه جمع‌آوری،
                            استفاده و محافظت از اطلاعات شخصی شما را توضیح می‌دهد.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">2. اطلاعات جمع‌آوری شده</h2>
                        <h3 className="text-lg font-semibold mb-2">اطلاعات شخصی:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                            <li>نام و نام خانوادگی</li>
                            <li>آدرس ایمیل</li>
                            <li>شماره تلفن</li>
                            <li>آدرس پستی</li>
                            <li>اطلاعات پرداخت (رمزنگاری شده)</li>
                        </ul>

                        <h3 className="text-lg font-semibold mb-2">اطلاعات فنی:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>آدرس IP</li>
                            <li>نوع مرورگر</li>
                            <li>صفحات بازدید شده</li>
                            <li>زمان بازدید</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">3. نحوه استفاده از اطلاعات</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>پردازش و ارسال سفارشات</li>
                            <li>ارتباط با مشتریان</li>
                            <li>بهبود خدمات</li>
                            <li>ارسال اطلاعیه‌های مهم</li>
                            <li>پیشگیری از تقلب</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">4. اشتراک‌گذاری اطلاعات</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            ما اطلاعات شخصی شما را با اشخاص ثالث به اشتراک نمی‌گذاریم، مگر در موارد زیر:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>شرکت‌های حمل و نقل (فقط برای ارسال)</li>
                            <li>درگاه‌های پرداخت (فقط برای تراکنش)</li>
                            <li>موارد قانونی (در صورت درخواست مراجع قضایی)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">5. امنیت اطلاعات</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>استفاده از رمزنگاری SSL</li>
                            <li>ذخیره‌سازی امن در سرورهای محافظت شده</li>
                            <li>دسترسی محدود به اطلاعات</li>
                            <li>بروزرسانی منظم سیستم‌های امنیتی</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">6. کوکی‌ها</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کنیم. شما می‌توانید کوکی‌ها را
                            از طریق تنظیمات مرورگر خود غیرفعال کنید.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">7. حقوق کاربران</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>دسترسی به اطلاعات شخصی</li>
                            <li>تصحیح اطلاعات نادرست</li>
                            <li>حذف اطلاعات (در موارد خاص)</li>
                            <li>لغو اشتراک ایمیل‌های تبلیغاتی</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">8. تماس با ما</h2>
                        <p className="text-gray-700 leading-relaxed">
                            در صورت داشتن سوال درباره حریم خصوصی، با ما تماس بگیرید:
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">ایمیل: privacy@maysa.com</p>
                            <p className="text-gray-700">تلفن: 021-12345678</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">9. تغییرات</h2>
                        <p className="text-gray-700 leading-relaxed">
                            این سیاست حریم خصوصی ممکن است به‌روزرسانی شود. تغییرات از طریق سایت اطلاع‌رسانی می‌شود.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            آخرین بروزرسانی: آذر 1403
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
