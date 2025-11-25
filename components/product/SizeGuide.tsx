'use client';

import { useState } from 'react';
import { FaRuler, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface SizeGuideProps {
  category?: string;
}

export default function SizeGuide({ category }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeData: Record<string, { title: string; sizes: { size: string; capacity: string; dimensions: string }[] }> = {
    backpack: {
      title: 'راهنمای سایز کوله پشتی',
      sizes: [
        { size: 'کوچک', capacity: '15-20 لیتر', dimensions: '40×25×15 سانتی‌متر' },
        { size: 'متوسط', capacity: '20-30 لیتر', dimensions: '45×30×18 سانتی‌متر' },
        { size: 'بزرگ', capacity: '30-40 لیتر', dimensions: '50×35×20 سانتی‌متر' },
      ],
    },
    'laptop-bag': {
      title: 'راهنمای سایز کیف لپ‌تاپ',
      sizes: [
        { size: '13 اینچ', capacity: '-', dimensions: '35×25×5 سانتی‌متر' },
        { size: '15 اینچ', capacity: '-', dimensions: '40×30×6 سانتی‌متر' },
        { size: '17 اینچ', capacity: '-', dimensions: '45×35×7 سانتی‌متر' },
      ],
    },
    'school-bag': {
      title: 'راهنمای سایز کیف مدرسه',
      sizes: [
        { size: 'ابتدایی', capacity: '10-15 لیتر', dimensions: '35×25×12 سانتی‌متر' },
        { size: 'راهنمایی', capacity: '15-20 لیتر', dimensions: '40×30×15 سانتی‌متر' },
        { size: 'دبیرستان', capacity: '20-25 لیتر', dimensions: '45×32×18 سانتی‌متر' },
      ],
    },
  };

  const getCategoryKey = (cat?: string): string => {
    if (!cat) return 'backpack';
    if (cat.includes('laptop')) return 'laptop-bag';
    if (cat.includes('school')) return 'school-bag';
    return 'backpack';
  };

  const categoryKey = getCategoryKey(category);
  const data = sizeData[categoryKey];

  if (!data) return null;

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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-secondary">{data.title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="p-4 text-right font-bold text-secondary">سایز</th>
                      {categoryKey === 'backpack' || categoryKey === 'school-bag' ? (
                        <th className="p-4 text-right font-bold text-secondary">ظرفیت</th>
                      ) : null}
                      <th className="p-4 text-right font-bold text-secondary">ابعاد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sizes.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-primary">{item.size}</td>
                        {categoryKey === 'backpack' || categoryKey === 'school-bag' ? (
                          <td className="p-4 text-gray-600">{item.capacity}</td>
                        ) : null}
                        <td className="p-4 text-gray-600">{item.dimensions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-primary/5 border border-primary/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FaInfoCircle className="text-primary" />
                  <h3 className="font-bold text-secondary">نکات مهم</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• ابعاد ذکر شده تقریبی است و ممکن است در مدل‌های مختلف کمی متفاوت باشد.</li>
                  <li>• برای انتخاب سایز مناسب، حتماً ابعاد وسایلی که قصد حمل دارید را در نظر بگیرید.</li>
                  <li>• در صورت تردید، سایز بزرگتر را انتخاب کنید.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
