'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

interface Review {
    id: string;
    productName: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    isApproved: boolean;
    isVerifiedPurchase: boolean;
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // TODO: داده‌های نمونه
            setTimeout(() => {
                const mockReviews: Review[] = Array.from({ length: 12 }, (_, i) => ({
                    id: `review-${i + 1}`,
                    productName: `کوله پشتی مدل ${i + 1}`,
                    userName: `کاربر ${i + 1}`,
                    rating: Math.floor(Math.random() * 2) + 4,
                    title: `نظر شماره ${i + 1}`,
                    comment: 'محصول بسیار خوبی است. کیفیت عالی و قیمت مناسب. پیشنهاد می‌کنم.',
                    isApproved: Math.random() > 0.5,
                    isVerifiedPurchase: Math.random() > 0.3,
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                }));
                setReviews(mockReviews);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('خطا در دریافت نظرات:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            // TODO: API call
            setReviews(
                reviews.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
            );
            alert('نظر تایید شد');
        } catch (error) {
            alert('خطا در تایید نظر');
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('آیا از رد این نظر اطمینان دارید؟')) return;

        try {
            // TODO: API call
            setReviews(reviews.filter((r) => r.id !== id));
            alert('نظر رد شد');
        } catch (error) {
            alert('خطا در رد نظر');
        }
    };

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'pending' && !review.isApproved) ||
            (filterStatus === 'approved' && review.isApproved);

        return matchesSearch && matchesFilter;
    });

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعت پیش`;
        return `${Math.floor(diffInMinutes / 1440)} روز پیش`;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت نظرات</h1>
                    <p className="text-gray-600 mt-1">{filteredReviews.length} نظر</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`p-4 rounded-lg border-2 transition-all ${filterStatus === 'all'
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <p className="text-2xl font-bold">{reviews.length}</p>
                    <p className="text-sm mt-1">همه نظرات</p>
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={`p-4 rounded-lg border-2 transition-all ${filterStatus === 'pending'
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <p className="text-2xl font-bold">
                        {reviews.filter((r) => !r.isApproved).length}
                    </p>
                    <p className="text-sm mt-1">در انتظار تایید</p>
                </button>
                <button
                    onClick={() => setFilterStatus('approved')}
                    className={`p-4 rounded-lg border-2 transition-all ${filterStatus === 'approved'
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    <p className="text-2xl font-bold">
                        {reviews.filter((r) => r.isApproved).length}
                    </p>
                    <p className="text-sm mt-1">تایید شده</p>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="relative">
                    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="جستجو در نظرات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-800">
                                        {review.productName}
                                    </h3>
                                    {review.isVerifiedPurchase && (
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                            خرید تایید شده
                                        </span>
                                    )}
                                    {review.isApproved && (
                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                            تایید شده
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>{review.userName}</span>
                                    <span>•</span>
                                    <span>{getRelativeTime(review.createdAt)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }
                                        size={16}
                                    />
                                ))}
                            </div>
                        </div>

                        {review.title && (
                            <h4 className="font-medium text-gray-800 mb-2">{review.title}</h4>
                        )}
                        <p className="text-gray-600 mb-4">{review.comment}</p>

                        {!review.isApproved && (
                            <div className="flex items-center gap-3 pt-4 border-t">
                                <button
                                    onClick={() => handleApprove(review.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <FaCheck />
                                    <span>تایید</span>
                                </button>
                                <button
                                    onClick={() => handleReject(review.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <FaTimes />
                                    <span>رد</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredReviews.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500">نظری یافت نشد</p>
                </div>
            )}
        </div>
    );
}
