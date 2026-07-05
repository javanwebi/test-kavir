

import React from 'react';
import { PlusIcon } from '../../dashboard/DashboardIcons';
import SearchIcon from '../../icons/SearchIcon';

const getStatusClass = (statusColor) => {
    switch (statusColor) {
        case 'green': return 'bg-green-100 text-green-700';
        case 'red': return 'bg-red-100 text-red-700';
        case 'amber': return 'bg-amber-100 text-amber-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const CustomerManagement = ({ customers, onManageCustomer, onAddCustomerClick }) => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت مشتریان</h1>
                    <p className="mt-1 text-gray-500">لیست مشتریان را مشاهده، ویرایش و مدیریت کنید.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={onAddCustomerClick} className="bg-[#5d87ff] text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                        <PlusIcon />
                        <span>افزودن مشتری جدید</span>
                    </button>
                </div>
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                 <div className="relative w-full sm:flex-grow">
                    <input 
                        type="text" 
                        placeholder="جستجو بر اساس نام، شرکت یا ایمیل..." 
                        className="w-full bg-slate-50 border-2 border-slate-300 rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand transition-all text-gray-700"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <SearchIcon />
                    </div>
                </div>
                <select className="w-full sm:w-auto bg-slate-50 border-2 border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand transition-all text-gray-700">
                    <option>همه وضعیت‌ها</option>
                    <option>فعال</option>
                    <option>غیرفعال</option>
                    <option>در انتظار تایید</option>
                </select>
            </div>

            <div className="mt-4 bg-white rounded-xl shadow-sm overflow-hidden hidden md:block border border-slate-100">
                <table className="w-full text-sm text-right text-gray-600">
                    <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-bold">نام مشتری</th>
                            <th scope="col" className="px-6 py-4 font-bold">شرکت</th>
                            <th scope="col" className="px-6 py-4 font-bold">شماره موبایل</th>
                            <th scope="col" className="px-6 py-4 font-bold">درصد تخفیف</th>
                            <th scope="col" className="px-6 py-4 font-bold">وضعیت</th>
                            <th scope="col" className="px-6 py-4 text-center font-bold">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/50 transition-all">
                                <th scope="row" className="px-6 py-4 font-black text-slate-800 whitespace-nowrap">
                                    {customer.name}
                                </th>
                                <td className="px-6 py-4 text-slate-600 font-medium">{customer.company}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono" dir="ltr">{customer.phone}</td>
                                <td className="px-6 py-4 font-black text-slate-800">{customer.discount || 0}%</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusClass(customer.statusColor)}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => onManageCustomer(customer)}
                                            className="bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-xl hover:bg-blue-100 text-xs transition-all active:scale-95"
                                        >
                                            مدیریت
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Touch-Friendly Card View - Specially optimized for Android and smaller screens */}
            <div className="mt-4 md:hidden space-y-4">
                {customers.map((customer) => (
                    <div key={customer.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 animate-in fade-in duration-300">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{customer.name}</h3>
                                <p className="text-[11px] text-slate-400 font-bold mt-1">{customer.company}</p>
                            </div>
                            <span className={`px-3 py-1 text-[10px] font-black rounded-full shrink-0 ${getStatusClass(customer.statusColor)}`}>
                                {customer.status}
                            </span>
                        </div>
                        
                        <div className="h-[1px] bg-slate-100"></div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-400 font-bold text-[10px]">تلفن همراه</span>
                                <a 
                                    href={`tel:${customer.phone}`} 
                                    className="text-[#5d87ff] font-extrabold text-xs tracking-wide hover:underline active:scale-95 transition-all self-start"
                                    dir="ltr"
                                >
                                    {customer.phone}
                                </a>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-slate-400 font-bold text-[10px]">تخفیف پیش‌فرض</span>
                                <span className="inline-block bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-black text-xs border border-amber-100/80">
                                    {customer.discount || 0}%
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onManageCustomer(customer)}
                            className="w-full bg-[#5d87ff]/10 text-[#5d87ff] hover:bg-[#5d87ff] hover:text-white font-black py-3 rounded-xl text-xs transition-all active:scale-[0.98] mt-1 text-center"
                        >
                            بررسی پرونده و مدیریت مشتری
                        </button>
                    </div>
                ))}
                {customers.length === 0 && (
                    <div className="bg-white p-8 rounded-2xl text-center text-slate-400 text-xs border border-dashed">
                        هیچ مشتری مطابق با فیلترها یافت نشد.
                    </div>
                )}
            </div>
             <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>نمایش ۱ تا {customers.length} از {customers.length} نتیجه</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-100">قبلی</button>
                    <button className="px-3 py-1 border rounded-md bg-[#5d87ff] text-white">۱</button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-100">بعدی</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;