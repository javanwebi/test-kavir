import React, { useState, useMemo } from 'react';
import { 
    Award, 
    Gift, 
    Users, 
    TrendingUp, 
    Settings, 
    CheckCircle2, 
    Save, 
    Medal,
    Trophy,
    Percent,
    Star
} from 'lucide-react';

const StatCard = ({ icon, title, value, subtitle, color }: { icon: any, title: string, value: any, subtitle?: string, color: string }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
            <h4 className="text-2xl font-black text-slate-800">{value}</h4>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
    </div>
);

const MarketingLoyalty = ({ settings, onSaveSettings, customers, orderRequests }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            onSaveSettings(localSettings);
            setIsSaving(false);
            setSavedMsg(true);
            setTimeout(() => setSavedMsg(false), 2000);
        }, 500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    // Calculate customer metrics
    const customerMetrics = useMemo(() => {
        return customers.map(c => {
            const cOrders = orderRequests.filter(o => o.customerName === c.name && o.status !== 'لغو شده' && o.status !== 'در انتظار تایید');
            const totalValue = cOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            
            const base = localSettings?.basePoints || 50;
            const manualPoints = c?.loyaltyPoints || 0;
            const totalPoints = base + manualPoints;

            let tier = "برنزی";
            let color = "text-orange-500 bg-orange-50";
            
            const reqRoyalV = localSettings.tierRoyalMin || 1000000000;
            const reqDiamondV = localSettings.tierDiamondMin || 500000000;
            const reqPlatinumV = localSettings.tierPlatinumMin || 200000000;
            const reqGoldV = localSettings.tierGoldMin || 100000000;
            const reqSilverV = localSettings.tierSilverMin || 50000000;

            const reqRoyalP = localSettings.tierRoyalPointsMin || 50000;
            const reqDiamondP = localSettings.tierDiamondPointsMin || 20000;
            const reqPlatinumP = localSettings.tierPlatinumPointsMin || 10000;
            const reqGoldP = localSettings.tierGoldPointsMin || 5000;
            const reqSilverP = localSettings.tierSilverPointsMin || 1000;

            if (totalValue >= reqRoyalV || totalPoints >= reqRoyalP) {
                tier = "VIP / رویال";
                color = "text-rose-600 bg-rose-50";
            } else if (totalValue >= reqDiamondV || totalPoints >= reqDiamondP) {
                tier = "الماسی";
                color = "text-blue-600 bg-blue-50";
            } else if (totalValue >= reqPlatinumV || totalPoints >= reqPlatinumP) {
                tier = "پلاتینیوم";
                color = "text-purple-600 bg-purple-50";
            } else if (totalValue >= reqGoldV || totalPoints >= reqGoldP) {
                tier = "طلایی";
                color = "text-amber-600 bg-amber-50";
            } else if (totalValue >= reqSilverV || totalPoints >= reqSilverP) {
                tier = "نقره‌ای";
                color = "text-slate-600 bg-slate-100";
            }

            return {
                ...c,
                totalOrders: cOrders.length,
                totalValue,
                points: totalPoints,
                tier,
                color
            };
        }).sort((a, b) => b.totalValue - a.totalValue);
    }, [customers, orderRequests, localSettings]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">باشگاه مشتریان و بازاریابی</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">مدیریت سیاست‌های تشویقی، امتیازات و سطوح وفاداری مشتریان</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-75"
                >
                    {isSaving ? (
                        <>در حال ذخیره...</>
                    ) : savedMsg ? (
                        <><CheckCircle2 size={18} /> ذخیره شد</>
                    ) : (
                        <><Save size={18} /> ذخیره تغییرات</>
                    )}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard 
                    icon={<Users size={28} />} 
                    title="مجموع اعضا" 
                    value={customers.length} 
                    color="bg-blue-50 text-blue-600" 
                />
                <StatCard 
                    icon={<Trophy size={28} />} 
                    title="مشتریان پلاتینیوم/طلایی" 
                    value={customerMetrics.filter(c => c.tier === 'پلاتینیوم' || c.tier === 'طلایی').length} 
                    color="bg-amber-50 text-amber-500" 
                />
                <StatCard 
                    icon={<Gift size={28} />} 
                    title="میانگین امتیازات" 
                    value={Math.round(customerMetrics.reduce((sum, c) => sum + c.points, 0) / (customers.length || 1)).toLocaleString()} 
                    color="bg-emerald-50 text-emerald-500" 
                />
                <StatCard 
                    icon={<TrendingUp size={28} />} 
                    title="بالاترین امتیاز" 
                    value={customerMetrics[0]?.points?.toLocaleString() || 0} 
                    subtitle={customerMetrics[0]?.name}
                    color="bg-purple-50 text-purple-600" 
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Points Base Setting - Only the required setting */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Award size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">تنظیمات امتیازدهی</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">امتیاز پایه (هدیه عضویت)</label>
                                <input dir="ltr" 
                                    type="number" 
                                    name="basePoints"
                                    value={localSettings.basePoints} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand rtl" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">امتیاز معرفی همکار</label>
                                <input dir="ltr" 
                                    type="number" 
                                    name="referralPoints"
                                    value={localSettings.referralPoints || 0} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand rtl" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* VIP Tiers Settings - Replaces Volume Discounts and Thresholds */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <Medal size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">سطوح باشگاه مشتریان و اهداف خرید</h2>
                        </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { id: 'tierBronze', name: 'برنزی', color: 'text-orange-500', bg: 'bg-orange-50', idea: 'شرایط پایه - پشتیبانی استاندارد' },
                            { id: 'tierSilver', name: 'نقره‌ای', color: 'text-slate-500', bg: 'bg-slate-100', idea: 'ارسال رایگان سفارشات + اولویت در بررسی' },
                            { id: 'tierGold', name: 'طلایی', color: 'text-amber-500', bg: 'bg-amber-100', idea: 'ارسال رایگان + اولویت بارگیری + هدیه تولد' },
                            { id: 'tierPlatinum', name: 'پلاتینیوم', color: 'text-purple-600', bg: 'bg-purple-100', idea: 'کش‌بک (بستانکاری) دوره‌ای + مشاوره اختصاصی' },
                            { id: 'tierDiamond', name: 'الماسی', color: 'text-blue-600', bg: 'bg-blue-100', idea: 'دعوت به رویدادهای تخصصی + تخصیص اعتبار خرید' },
                            { id: 'tierRoyal', name: 'VIP / رویال', color: 'text-rose-600', bg: 'bg-rose-100', idea: 'مدیر حساب + مرجوعی بی‌قید و شرط + بالاترین پورسانت' },
                        ].map((tier, idx) => (
                            <div key={tier.id} className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`font-black text-lg ${tier.color}`}>{tier.name}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${tier.color} ${tier.bg}`}>
                                            سطح {idx + 1}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 mb-4 h-8">{tier.idea}</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">حداقل امتیاز مورد نیاز</label>
                                        <input dir="ltr" 
                                            type="number" 
                                            name={`${tier.id}PointsMin`}
                                            value={localSettings[`${tier.id}PointsMin`] || ''} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">حداقل حجم خرید به ریال (شروع بازه)</label>
                                        <input dir="ltr" 
                                            type="number" 
                                            name={`${tier.id}Min`}
                                            value={localSettings[`${tier.id}Min`] || ''} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">حداکثر حجم خرید به ریال (پایان بازه)</label>
                                        <input dir="ltr" 
                                            type="number" 
                                            name={`${tier.id}Max`}
                                            value={localSettings[`${tier.id}Max`] || ''} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100" 
                                        />
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 font-bold">
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">درصد تخفیف / پورسانت در این بازه (%)</label>
                                        <input dir="ltr" 
                                            type="number" 
                                            name={`${tier.id}Percent`}
                                            value={localSettings[`${tier.id}Percent`] || ''} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-black text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customers Leaderboard */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Star size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">عملکرد و رتبه‌بندی مشتریان</h2>
                    </div>
                </div>
                {/* Mobile horizontal scroll hint */}
                <div className="mx-6 mt-4 md:hidden flex items-center justify-center gap-1.5 text-[11px] font-black text-[#5d87ff] bg-blue-50/50 border border-blue-100/50 rounded-2xl py-2 px-3 animate-pulse">
                    <span>جهت مشاهده تمام ستون‌های جدول رده‌بندی، به چپ یا راست بکشید</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500">
                                <th className="px-6 py-4 font-bold">مشتری</th>
                                <th className="px-6 py-4 font-bold">شرکت</th>
                                <th className="px-6 py-4 font-bold">تعداد سفارشات</th>
                                <th className="px-6 py-4 font-bold">ارزش کل خرید (تومان)</th>
                                <th className="px-6 py-4 font-bold">امتیاز وفاداری</th>
                                <th className="px-6 py-4 font-bold">سطح فعلی</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customerMetrics.map((customer, idx) => (
                                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        <div className="flex items-center gap-2">
                                            {idx < 3 && <span className={`text-xs px-2 py-0.5 rounded-full font-black ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-600'}`}>#{idx + 1}</span>}
                                            {customer.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{customer.company}</td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{customer.totalOrders}</td>
                                    <td className="px-6 py-4 text-slate-600 font-bold">{(customer.totalValue / 10).toLocaleString('fa-IR')}</td>
                                    <td className="px-6 py-4 text-blue-600 font-black text-lg">{customer.points.toLocaleString('fa-IR')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.color}`}>
                                            {customer.tier}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default MarketingLoyalty;
