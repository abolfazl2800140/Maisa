export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-secondary">قوانین و مقررات</h1>

                <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">1. کلیات</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            با استفاده از سایت فروشگاه مایسا، شما موافقت خود را با قوانین و مقررات زیر اعلام می‌کنید.
                            این قوانین برای تمام کاربران سایت الزام‌آور است.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">2. ثبت‌نام و حساب کاربری</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>اطلاعات ارائه شده باید صحیح و کامل باشد</li>
                            <li>هر فرد تنها مجاز به ایجاد یک حساب کاربری است</li>
                            <li>حفظ امنیت رمز عبور بر عهده کاربر است</li>
                            <li>استفاده از حساب کاربری دیگران ممنوع است</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">3. خرید و پرداخت</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>تمام قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده است</li>
                            <li>پرداخت از طریق درگاه‌های معتبر انجام می‌شود</li>
                            <li>در صورت عدم موجودی، مبلغ پرداختی بازگردانده می‌شود</li>
                            <li>فاکتور خرید از طریق ایمیل و پیامک ارسال می‌شود</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">4. ارسال و تحویل</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>زمان ارسال 1-4 روز کاری است</li>
                            <li>هزینه ارسال برای سفارش‌های بالای 2 میلیون تومان رایگان است</li>
                            <li>مسئولیت کالا تا زمان تحویل با فروشگاه است</li>
                            <li>در صورت عدم حضور گیرنده، کالا به انبار بازگردانده می‌شود</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">5. بازگشت و تعویض</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>امکان بازگشت کالا تا 7 روز پس از خرید</li>
                            <li>کالا باید در شرایط اولیه و بسته‌بندی سالم باشد</li>
                            <li>هزینه بازگشت کالای سالم بر عهده مشتری است</li>
                            <li>بازگشت وجه تا 72 ساعت پس از تأیید انجام می‌شود</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">6. مسئولیت‌ها</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            فروشگاه مایسا متعهد به ارائه محصولات اصل و با کیفیت است. در صورت بروز هرگونه مشکل،
                            با پشتیبانی تماس بگیرید.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">7. تغییرات</h2>
                        <p className="text-gray-700 leading-relaxed">
                            فروشگاه مایسا حق تغییر این قوانین را محفوظ می‌دارد. تغییرات از طریق سایت اطلاع‌رسانی می‌شود.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
