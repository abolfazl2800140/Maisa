'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            category: 'خرید و پرداخت',
            questions: [
                {
                    q: 'چگونه می‌توانم سفارش دهم؟',
                    a: 'برای ثبت سفارش، محصول مورد نظر را انتخاب کنید، به سبد خرید اضافه کنید و مراحل تکمیل خرید را طی کنید.'
                },
                {
                    q: 'روش‌های پرداخت چیست؟',
                    a: 'شما می‌توانید از طریق درگاه پرداخت آنلاین یا پرداخت در محل (COD) سفارش خود را پرداخت کنید.'
                },
                {
                    q: 'آیا پرداخت آنلاین امن است؟',
                    a: 'بله، ما از معتبرترین درگاه‌های پرداخت استفاده می‌کنیم و تمام اطلاعات شما رمزنگاری می‌شود.'
                },
                {
                    q: 'آیا می‌توانم سفارش خود را لغو کنم؟',
                    a: 'بله، تا قبل از ارسال سفارش می‌توانید آن را لغو کنید. با پشتیبانی تماس بگیرید.'
                }
            ]
        },
        {
            category: 'ارسال و تحویل',
            questions: [
                {
                    q: 'مدت زمان ارسال چقدر است؟',
                    a: 'ارسال به تهران 1-2 روز کاری و به شهرستان‌ها 2-4 روز کاری طول می‌کشد.'
                },
                {
                    q: 'هزینه ارسال چقدر است؟',
                    a: 'هزینه ارسال برای سفارش‌های بالای 2 میلیون تومان رایگان است. برای سفارش‌های کمتر، 50 هزار تومان.'
                },
                {
                    q: 'آیا ارسال به خارج از کشور دارید؟',
                    a: 'در حال حاضر فقط به سراسر ایران ارسال داریم.'
                },
                {
                    q: 'چگونه سفارش خود را پیگیری کنم؟',
                    a: 'با ورود به پنل کاربری، می‌توانید وضعیت سفارش خود را مشاهده کنید. همچنین کد پیگیری از طریق پیامک ارسال می‌شود.'
                }
            ]
        },
        {
            category: 'بازگشت و تعویض',
            questions: [
                {
                    q: 'آیا امکان بازگشت کالا وجود دارد؟',
                    a: 'بله، تا 7 روز پس از دریافت کالا می‌توانید آن را بازگردانید.'
                },
                {
                    q: 'شرایط بازگشت کالا چیست؟',
                    a: 'کالا باید در شرایط اولیه، با برچسب و بسته‌بندی سالم باشد و استفاده نشده باشد.'
                },
                {
                    q: 'هزینه بازگشت کالا با کیست؟',
                    a: 'اگر کالا معیوب باشد، هزینه بازگشت با ماست. در غیر این صورت با مشتری.'
                },
                {
                    q: 'چگونه کالا را تعویض کنم؟',
                    a: 'با پشتیبانی تماس بگیرید تا فرآیند تعویض را برای شما انجام دهیم.'
                }
            ]
        },
        {
            category: 'محصولات',
            questions: [
                {
                    q: 'آیا محصولات اصل هستند؟',
                    a: 'بله، تمام محصولات ما 100% اصل و با گارانتی اصالت هستند.'
                },
                {
                    q: 'آیا گارانتی دارند؟',
                    a: 'بله، تمام محصولات دارای گارانتی سلامت فیزیکی و اصالت هستند.'
                },
                {
                    q: 'چگونه از موجود بودن محصول مطمئن شوم؟',
                    a: 'وضعیت موجودی در صفحه محصول نمایش داده می‌شود. همچنین می‌توانید با پشتیبانی تماس بگیرید.'
                },
                {
                    q: 'آیا می‌توانم محصول را قبل از خرید ببینم؟',
                    a: 'در حال حاضر امکان بازدید حضوری نداریم، اما تصاویر با کیفیت و توضیحات کامل ارائه می‌دهیم.'
                }
            ]
        },
        {
            category: 'حساب کاربری',
            questions: [
                {
                    q: 'چگونه ثبت‌نام کنم؟',
                    a: 'روی آیکون کاربر کلیک کنید و فرم ثبت‌نام را تکمیل کنید.'
                },
                {
                    q: 'رمز عبور خود را فراموش کرده‌ام',
                    a: 'در صفحه ورود، روی "فراموشی رمز عبور" کلیک کنید و ایمیل خود را وارد کنید.'
                },
                {
                    q: 'آیا باید حتماً ثبت‌نام کنم؟',
                    a: 'برای خرید، ثبت‌نام الزامی است تا بتوانید سفارشات خود را پیگیری کنید.'
                }
            ]
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-secondary">سوالات متداول</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    پاسخ سوالات رایج شما درباره خرید، ارسال و خدمات فروشگاه مایسا
                </p>
            </div>

            {/* FAQ Categories */}
            <div className="max-w-4xl mx-auto space-y-8">
                {faqs.map((category, catIndex) => (
                    <div key={catIndex}>
                        <h2 className="text-2xl font-bold mb-4 text-secondary flex items-center gap-2">
                            <span className="w-2 h-8 bg-primary rounded"></span>
                            {category.category}
                        </h2>
                        <div className="space-y-3">
                            {category.questions.map((faq, qIndex) => {
                                const index = catIndex * 100 + qIndex;
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={qIndex}
                                        className="bg-white rounded-lg shadow-md overflow-hidden border border-transparent hover:border-primary/20 transition-all"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-semibold text-lg text-secondary">
                                                {faq.q}
                                            </span>
                                            {isOpen ? (
                                                <FaChevronUp className="text-primary flex-shrink-0" />
                                            ) : (
                                                <FaChevronDown className="text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t pt-4">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-primary text-white rounded-lg p-8 text-center max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">سوال دیگری دارید؟</h3>
                <p className="mb-6 text-lg">
                    تیم پشتیبانی ما آماده پاسخگویی به تمام سوالات شماست
                </p>
                <Link
                    href="/contact"
                    className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                    تماس با ما
                </Link>
            </div>
        </div>
    );
}
