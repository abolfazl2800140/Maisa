import Image from 'next/image';
import { FaAward, FaUsers, FaShippingFast, FaHeart } from 'react-icons/fa';

export const metadata = {
    title: 'درباره ما - فروشگاه مایسا',
    description: 'آشنایی با فروشگاه کیف و کوله پشتی مایسا'
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 text-secondary">درباره فروشگاه مایسا</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    ما در مایسا با هدف ارائه بهترین کیف و کوله پشتی‌های با کیفیت و قیمت مناسب،
                    در خدمت شما هستیم
                </p>
            </div>

            {/* Image Section */}
            <div className="relative h-96 rounded-lg overflow-hidden mb-16">
                <Image
                    src="/images/hero-bag.jpg"
                    alt="فروشگاه مایسا"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaUsers className="text-4xl text-primary mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-secondary mb-2">+10000</h3>
                    <p className="text-gray-600">مشتری راضی</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaAward className="text-4xl text-primary mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-secondary mb-2">+500</h3>
                    <p className="text-gray-600">محصول متنوع</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaShippingFast className="text-4xl text-primary mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-secondary mb-2">24 ساعته</h3>
                    <p className="text-gray-600">ارسال سریع</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaHeart className="text-4xl text-primary mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-secondary mb-2">100%</h3>
                    <p className="text-gray-600">رضایت مشتری</p>
                </div>
            </div>

            {/* Story */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-16">
                <h2 className="text-3xl font-bold mb-6 text-secondary">داستان ما</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                    <p>
                        فروشگاه مایسا در سال 1395 با هدف ارائه محصولات با کیفیت و قیمت مناسب
                        در زمینه کیف و کوله پشتی آغاز به کار کرد. ما همواره تلاش کرده‌ایم تا
                        بهترین محصولات را با بهترین قیمت در اختیار مشتریان عزیز قرار دهیم.
                    </p>
                    <p>
                        تیم ما متشکل از افرادی با تجربه و متخصص در زمینه انتخاب و خرید محصولات
                        است که همواره در تلاش هستند تا جدیدترین و بهترین محصولات را برای شما
                        فراهم کنند.
                    </p>
                    <p>
                        رضایت شما برای ما در اولویت است و تمام تلاش خود را می‌کنیم تا تجربه
                        خرید آنلاین لذت‌بخشی را برای شما فراهم کنیم.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div>
                <h2 className="text-3xl font-bold mb-8 text-center text-secondary">ارزش‌های ما</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3 text-primary">کیفیت</h3>
                        <p className="text-gray-600">
                            ما تنها محصولات با کیفیت و استاندارد بالا را انتخاب و ارائه می‌کنیم
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3 text-primary">صداقت</h3>
                        <p className="text-gray-600">
                            شفافیت و صداقت در تمام مراحل خرید و فروش اصل اساسی ماست
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3 text-primary">پشتیبانی</h3>
                        <p className="text-gray-600">
                            تیم پشتیبانی ما همواره آماده پاسخگویی به سوالات شماست
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
