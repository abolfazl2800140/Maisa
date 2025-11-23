'use client';

import { useState } from 'react';
import { FaRuler, FaTimes } from 'react-icons/fa';

interface SizeGuideProps {
  category: 'backpack' | 'laptop-bag' | 'school-bag';
}

export default function SizeGuide({ category }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeData = {
    backpack: {
      title: 'راهنمای سایز کوله پشتی',
      sizes: [
        { size: 'کوچک', capacity: '15-20 لیتر', dimensions: '40×25×15 سانتی‌متر', suitable: 'مناسب برای کودکان و استفاده روزمره' },
        { size: 'متوسط', capacity: '20-30 لیتر', dimensions: '45×30×18 سانتی‌متر', suitable: 'مناسب برای دانش‌آموزان و استفاده عمومی' },
        { size: 'بزرگ', capacity: '30-40 لیتر', dimensions: '50×35×20 سانتی‌متر', suitable: 'مناسب برای سفر و حمل وسایل زیاد' },
      ],
    },
    'laptop-bag': {
      title: 'راهنمای سایز کیف لپ‌تاپ',
      sizes: [
        { size: '13 اینچ', capacity: '-', dimensions: '35×25×5 سانتی‌متر', suitable: 'مناسب برای لپ‌تاپ‌های 13 اینچ و کوچکتر' },
        { size: '15 اینچ', capacity: '-', dimensions: '40×30×6 سانتی‌متر', suitable: 'مناسب برای لپ‌تاپ‌های 15 اینچ و کوچکتر' },
        { size: '17 اینچ', capacity: '-', dimensions: '45×35×7 سانتی‌متر', suitable: 'مناسب برای لپ‌تاپ‌های 17 اینچ و کوچکتر' },
      ],
    },
    'school-bag': {
      title: 'راهنمای سایز کیف مدرسه',
      sizes: [
        { size: 'ابتدایی', capacity: '10-15 لیتر', dimensions: '35×25×12 سانتی‌متر', suitable: 'مناسب برای دانش‌آموزان کلاس اول تا سوم' },
        { size: 'راهنمایی', capacity: '15-20 لیتر', dimensions: '40×30×15 سانتی‌متر', suitable: 'مناسب برای دانش‌آموزان کلاس چهارم تا ششم' },
        { size: 'دبیرستان', capacity: '20-25 لیتر', dimensions: '45×32×18 سانتی‌متر', suitable: 'مناسب برای دانش‌آموزان دبیرستان' },
      ],
    },
  };

  const data = sizeData[category];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-semibold"
      >
        <FaRuler />
        <span>راهنمای سایز</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-secondary">{data.title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-4 text-right font-bold text-gray-700">سایز</th>
                      {category === 'backpack' || category === 'school-bag' ? (
                        <th className="border border-gray-200 p-4 text-right font-bold text-gray-700">ظرفیت</th>
                      ) : null}
                      <th className="border border-gray-200 p-4 text-right font-bold text-gray-700">ابعاد</th>
                      <th className="border border-gray-200 p-4 text-right font-bold text-gray-700">مناسب برای</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sizes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 p-4 font-semibold text-primary">{item.size}</td>
                        {category === 'backpack' || category === 'school-bag' ? (
                          <td className="border border-gray-200 p-4">{item.capacity}</td>
                        ) : null}
                        <td className="border border-gray-200 p-4 font-mono text-sm">{item.dimensions}</td>
                        <td className="border border-gray-200 p-4 text-gray-600">{item.suitable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">💡 نکات مهم:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• ابعاد ذکر شده تقریبی است و ممکن است در مدل‌های مختلف کمی متفاوت باشد.</li>
                  <li>• برای انتخاب سایز مناسب، حتماً ابعاد وسایلی که قصد حمل دارید را در نظر بگیرید.</li>
                  <li>• در صورت تردید، سایز بزرگتر را انتخاب کنید.</li>
                  <li>• برای مشاوره بیشتر با پشتیبانی تماس بگیرید.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
