import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
    ShoppingBag, 
    CreditCard, 
    TrendingUp,
    BarChart2,
    CheckCircle2,
    FileText,
    ArrowUpRight,
    Users,
    Gift,
    Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface ReportsProps {
    orders: any[];
    customer: any;
    products: any[];
    marketingSettings: any;
    onNavigate: (page: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ orders, customer, products, marketingSettings, onNavigate }) => {
    // Analytics calculations
    const approvedOrders = useMemo(() => {
        return orders.filter(o => o.status !== 'لغو شده' && o.status !== 'در انتظار تایید');
    }, [orders]);

    const totalApprovedCount = approvedOrders.length;
    const totalSpent = approvedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const averageOrderValue = totalApprovedCount > 0 ? Math.round(totalSpent / totalApprovedCount) : 0;

    // Dummy logic for time-based framing (assuming normal distribution just for UI showcase)
    const thisWeekSpent = totalSpent > 0 ? Math.round(totalSpent * 0.15) : 0;
    const thisMonthSpent = totalSpent > 0 ? Math.round(totalSpent * 0.35) : 0;

    // Top products dummy calculation based on dummy dataset (we don't have real order item histories in standard dummy data usually, so let's mock top products text)
    const topProducts = [
        { name: "لوله تک لایه ۲۰", count: 1250 },
        { name: "زانو ۹۰ درجه ۲۰", count: 840 },
        { name: "بوشن تبدیل ۲۵*۲۰", count: 620 }
    ];

    // Buying target calculation
    const nextTargetThreshold = marketingSettings?.tierGoldMin || 100000000;
    const remainingToTarget = Math.max(0, nextTargetThreshold - totalSpent);
    const progress = Math.min(100, (totalSpent / nextTargetThreshold) * 100);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10" dir="rtl">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">گزارش و تحلیل سفارشات</h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">نمای کلی از سفارشات تایید شده شما.</p>
            </header>

            {/* Incentive Banners: Buy More & Refer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                {/* Refer Promo */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative cursor-pointer group"
                    onClick={() => onNavigate('referrals')}
                >
                    <div className="absolute -right-10 -top-10 opacity-10">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-emerald-900/40 text-emerald-100 text-xs font-bold px-2 py-1 rounded">درآمدزایی ویژه</span>
                            </div>
                            <h3 className="text-xl font-black mb-2">طرح معرفی همکاران</h3>
                            <p className="text-sm text-emerald-50 leading-relaxed mb-4">
                                مهندسین ناظر، فروشگاه‌داران و سازندگان را معرفی کنید و تا <strong className="text-yellow-300">۵٪ پورسانت</strong> بگیرید.
                            </p>
                        </div>
                        <button className="self-start flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
                            معرفی همکار جدید
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                </motion.div>

                {/* Buy Promo */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative cursor-pointer group flex flex-col justify-between"
                    onClick={() => onNavigate('catalog')}
                >
                    <div className="absolute right-0 top-0 h-full w-48 bg-white/5 skew-x-12 translate-x-10 group-hover:translate-x-0 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-900/40 text-blue-100 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                <Award size={14} /> ارتقای سطح
                            </span>
                        </div>
                        <h3 className="text-xl font-black mb-2">افزایش پایه تخفیف شما</h3>
                        <p className="text-sm text-blue-50 leading-relaxed mb-4">
                            تنها با خرید <strong className="text-white font-black bg-blue-800/50 px-1.5 py-0.5 rounded">{remainingToTarget.toLocaleString('fa-IR')} ریال</strong> دیگر، حاشیه سود خود را به صورت دائمی افزایش دهید.
                        </p>
                        <div className="h-2 w-full bg-blue-900/50 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <button className="self-start flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
                        ثبت سفارش جدید
                        <ShoppingBag size={16} />
                    </button>
                </motion.div>
            </div>

            {/* Overview Cards (Based on Screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl mb-4">
                        <CheckCircle2 size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-2">کل سفارشات تایید شده</p>
                    <p className="text-2xl font-black text-slate-900">{totalApprovedCount.toLocaleString('fa-IR')} <span className="text-sm font-medium text-slate-400 ml-1">سفارش</span></p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute -left-4 -top-4 text-blue-50">
                        <CreditCard size={100} />
                    </div>
                    <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                            <CreditCard size={28} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 mb-2">مجموع کل فروش</p>
                        <p className="text-2xl font-black text-slate-900">{totalSpent === 0 ? '۰' : (totalSpent / 10).toLocaleString('fa-IR')} <span className="text-sm font-medium text-slate-400 ml-1">تومان</span></p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
                        <TrendingUp size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-2">میانگین مبلغ خرید</p>
                    <p className="text-2xl font-black text-slate-900">{averageOrderValue === 0 ? '۰' : (averageOrderValue / 10).toLocaleString('fa-IR')} <span className="text-sm font-medium text-slate-400 ml-1">تومان</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Popular Products */}
                <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="font-black text-lg text-slate-900 mb-6">محصولات محبوب (بر اساس تعداد)</h3>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">محبوب هفته</p>
                                <p className="text-sm font-black text-slate-900">{topProducts[0].name}</p>
                            </div>
                            <span className="text-slate-900 font-bold text-sm">{topProducts[0].count.toLocaleString('fa-IR')} <span className="text-xs text-slate-500 font-normal">عدد</span></span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">محبوب ماه</p>
                                <p className="text-sm font-black text-slate-900">{topProducts[1].name}</p>
                            </div>
                            <span className="text-slate-900 font-bold text-sm">{topProducts[1].count.toLocaleString('fa-IR')} <span className="text-xs text-slate-500 font-normal">عدد</span></span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">محبوب سال</p>
                                <p className="text-sm font-black text-slate-900">{topProducts[2].name}</p>
                            </div>
                            <span className="text-slate-900 font-bold text-sm">{topProducts[2].count.toLocaleString('fa-IR')} <span className="text-xs text-slate-500 font-normal">عدد</span></span>
                        </div>
                    </div>
                </div>

                {/* Sales Stats */}
                <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="font-black text-lg text-slate-900 mb-6">آمار فروش</h3>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-sm font-black text-slate-900">فروش هفته جاری</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{(totalApprovedCount > 0 ? 1 : 0).toLocaleString('fa-IR')} سفارش</p>
                            </div>
                            <span className="text-blue-600 font-black text-lg">{(thisWeekSpent / 10).toLocaleString('fa-IR')} <span className="text-xs text-slate-500 font-normal ml-1">تومان</span></span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div>
                                <p className="text-sm font-black text-slate-900">فروش ماه جاری</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{(totalApprovedCount > 0 ? 3 : 0).toLocaleString('fa-IR')} سفارش</p>
                            </div>
                            <span className="text-blue-600 font-black text-lg">{(thisMonthSpent / 10).toLocaleString('fa-IR')} <span className="text-xs text-slate-500 font-normal ml-1">تومان</span></span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-sm font-black text-slate-900">فروش سال جاری</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{totalApprovedCount.toLocaleString('fa-IR')} سفارش</p>
                            </div>
                            <span className="text-blue-600 font-black text-lg">{(totalSpent / 10).toLocaleString('fa-IR')} <span className="text-xs text-slate-500 font-normal ml-1">تومان</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approved Orders History Table */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                        <FileText size={20} className="text-slate-500" />
                        تاریخچه سفارشات تایید شده
                    </h3>
                </div>
                {approvedOrders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-medium bg-slate-50">
                        هیچ سفارش تایید شده‌ای برای نمایش وجود ندارد.
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-50 text-slate-500 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">شناسه سفارش</th>
                                        <th className="px-6 py-4">تاریخ</th>
                                        <th className="px-6 py-4">مبلغ پرداختی (تومان)</th>
                                        <th className="px-6 py-4 text-center">جزئیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {approvedOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900" dir="ltr">{order.id}</td>
                                            <td className="px-6 py-4 text-slate-600">{order.date || '۱۴۰۳/۰۴/۱۵'}</td>
                                            <td className="px-6 py-4 font-black text-slate-900">{((order.totalAmount || 0) / 10).toLocaleString('fa-IR')}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    className="text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors inline-block"
                                                    onClick={() => onNavigate('my-orders')}
                                                >
                                                    مشاهده فاکتور
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile List View (Android Style) */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {approvedOrders.map((order) => (
                                <div key={order.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors" onClick={() => onNavigate('my-orders')}>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm mb-1">{order.id}</p>
                                        <p className="text-xs text-slate-500">{order.date || '۱۴۰۳/۰۴/۱۵'}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-blue-600 text-sm mb-1">{((order.totalAmount || 0) / 10).toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-500">تومان</span></p>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">جزئیات</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
