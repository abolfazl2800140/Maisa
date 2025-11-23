'use client';

import { useState } from 'react';
import { useAddress, Address } from '@/lib/context/AddressContext';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleOpenModal = (address?: Address) => {
    setEditingAddress(address || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAddress(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const addressData = {
      title: formData.get('title') as string,
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      province: formData.get('province') as string,
      city: formData.get('city') as string,
      address: formData.get('address') as string,
      postalCode: formData.get('postalCode') as string,
      isDefault: formData.get('isDefault') === 'on',
    };

    if (editingAddress) {
      updateAddress(editingAddress.id, addressData);
      toast.success('آدرس با موفقیت ویرایش شد');
    } else {
      addAddress(addressData);
      toast.success('آدرس با موفقیت اضافه شد');
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
      deleteAddress(id);
      toast.success('آدرس حذف شد');
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast.success('آدرس پیش‌فرض تغییر کرد');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'حساب کاربری', href: '/account' },
          { label: 'آدرس‌های من' },
        ]}
      />

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-secondary">آدرس‌های من</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <FaPlus />
            افزودن آدرس جدید
          </button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon={<FaMapMarkerAlt className="text-6xl text-gray-400" />}
            title="آدرسی ثبت نشده است"
            description="برای ثبت سفارش، ابتدا یک آدرس اضافه کنید"
            actionLabel="افزودن آدرس"
            onAction={() => handleOpenModal()}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border-2 rounded-lg p-6 relative ${
                  address.isDefault ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaCheck />
                    پیش‌فرض
                  </div>
                )}

                <h3 className="text-xl font-bold text-secondary mb-4">{address.title}</h3>

                <div className="space-y-2 text-gray-600 mb-4">
                  <p>
                    <span className="font-semibold">نام:</span> {address.fullName}
                  </p>
                  <p>
                    <span className="font-semibold">تلفن:</span> {address.phone}
                  </p>
                  <p>
                    <span className="font-semibold">استان:</span> {address.province}
                  </p>
                  <p>
                    <span className="font-semibold">شهر:</span> {address.city}
                  </p>
                  <p>
                    <span className="font-semibold">آدرس:</span> {address.address}
                  </p>
                  <p>
                    <span className="font-semibold">کد پستی:</span> {address.postalCode}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      انتخاب به عنوان پیش‌فرض
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenModal(address)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-secondary">
                {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">عنوان آدرس *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingAddress?.title}
                    placeholder="مثلاً: خانه، محل کار"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={editingAddress?.fullName}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">شماره تماس *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingAddress?.phone}
                    placeholder="09123456789"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">استان *</label>
                  <input
                    type="text"
                    name="province"
                    defaultValue={editingAddress?.province}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">شهر *</label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={editingAddress?.city}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">آدرس کامل *</label>
                  <textarea
                    name="address"
                    defaultValue={editingAddress?.address}
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">کد پستی *</label>
                  <input
                    type="text"
                    name="postalCode"
                    defaultValue={editingAddress?.postalCode}
                    placeholder="1234567890"
                    required
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      defaultChecked={editingAddress?.isDefault}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="text-sm font-semibold">انتخاب به عنوان آدرس پیش‌فرض</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-bold"
                >
                  {editingAddress ? 'ذخیره تغییرات' : 'افزودن آدرس'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
