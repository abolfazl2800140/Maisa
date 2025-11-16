'use client';

import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('پیام شما با موفقیت ارسال شد!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-secondary">تماس با ما</h1>
                <p className="text-lg text-gray-600">
                    ما همیشه آماده پاسخگویی به سوالات شما هستیم
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start gap-4">
                            <FaPhone className="text-2xl text-primary mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-2">تلفن تماس</h3>
                                <p className="text-gray-600">021-12345678</p>
                                <p className="text-gray-600">09123456789</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start gap-4">
                            <FaEnvelope className="text-2xl text-primary mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-2">ایمیل</h3>
                                <p className="text-gray-600">info@maysa.com</p>
                                <p className="text-gray-600">support@maysa.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start gap-4">
                            <FaMapMarkerAlt className="text-2xl text-primary mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-2">آدرس</h3>
                                <p className="text-gray-600">
                                    تهران، خیابان ولیعصر، پلاک 123
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start gap-4">
                            <FaClock className="text-2xl text-primary mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-2">ساعات کاری</h3>
                                <p className="text-gray-600">شنبه تا پنجشنبه</p>
                                <p className="text-gray-600">9:00 صبح - 6:00 عصر</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-4">شبکه‌های اجتماعی</h3>
                        <div className="flex gap-3">
                            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors">
                                <FaInstagram className="text-xl" />
                            </a>
                            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors">
                                <FaTelegram className="text-xl" />
                            </a>
                            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors">
                                <FaWhatsapp className="text-xl" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-secondary">فرم تماس</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">نام و نام خانوادگی</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="نام خود را وارد کنید"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">ایمیل</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="ایمیل خود را وارد کنید"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">شماره تماس</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="شماره تماس خود را وارد کنید"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">موضوع</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="موضوع پیام خود را وارد کنید"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">پیام</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    placeholder="پیام خود را بنویسید..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            >
                                ارسال پیام
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
