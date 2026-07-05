import React, { useMemo, useState } from 'react';
import { 
    Clock, 
    CreditCard, 
    Megaphone, 
    AlertCircle, 
    Ticket, 
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    TrendingUp,
    ChevronRight,
    ShoppingBag,
    Award,
    Trophy,
    Gift,
    Star,
    Share2,
    Copy,
    CheckCircle2,
    BarChart2,
    Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    change?: string;
    isUp?: boolean;
    color: string;
    index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isUp, color, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, ease: 'easeOut' }}
        className="bg-white p-5 lg:p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-l ${color.replace('bg-', 'from-').replace('-500', '-400')} to-transparent opacity-40 group-hover:opacity-100 transition-opacity`}></div>
        <div className="flex justify-between items-start mb-6 w-full">
            <div className={`p-3.5 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20 flex items-center justify-center ring-1 ring-inset ${color.replace('bg-', 'ring-').replace('-500', '-500/20')}`}>
                <div className={`${color.replace('bg-', 'text-')}`}>
                    {icon}
                </div>
            </div>
            {change && (
                <div className={`flex items-center gap-1 mt-1 px-2.5 py-1.5 rounded-xl text-xs font-bold ${isUp ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'}`}>
                    {isUp ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
                    {change}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-[13px] font-bold text-slate-500 mb-1.5 truncate">{title}</h3>
            <p className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-slate-900 group-hover:to-slate-700 transition-all">{value}</p>
        </div>
    </motion.div>
);

const CustomerTierCard = ({ marketingSettings, totalPurchaseValue, customerPoints = 0 }) => {
    
    const reqRoyalV = marketingSettings?.tierRoyalMin || 1000000000;
    const reqDiamondV = marketingSettings?.tierDiamondMin || 500000000;
    const reqPlatinumV = marketingSettings?.tierPlatinumMin || 200000000;
    const reqGoldV = marketingSettings?.tierGoldMin || 100000000;
    const reqSilverV = marketingSettings?.tierSilverMin || 50000000;

    const reqRoyalP = marketingSettings?.tierRoyalPointsMin || 50000;
    const reqDiamondP = marketingSettings?.tierDiamondPointsMin || 20000;
    const reqPlatinumP = marketingSettings?.tierPlatinumPointsMin || 10000;
    const reqGoldP = marketingSettings?.tierGoldPointsMin || 5000;
    const reqSilverP = marketingSettings?.tierSilverPointsMin || 1000;

    let currentTier = "برنزی";
    let tierColor = "text-orange-400";
    let tierGradient = "from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.3)]";
    let nextTier = "نقره‌ای";
    let nextTierThresholdValue = reqSilverV;
    let nextTierThresholdPoints = reqSilverP;
    
    if (totalPurchaseValue >= reqRoyalV || customerPoints >= reqRoyalP) {
        currentTier = "VIP / رویال";
        tierColor = "text-emerald-400";
        tierGradient = "from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
        nextTier = "بالاترین سطح";
        nextTierThresholdValue = totalPurchaseValue;
        nextTierThresholdPoints = customerPoints;
    } else if (totalPurchaseValue >= reqDiamondV || customerPoints >= reqDiamondP) {
        currentTier = "الماسی";
        tierColor = "text-cyan-400";
        tierGradient = "from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
        nextTier = "VIP / رویال";
        nextTierThresholdValue = reqRoyalV;
        nextTierThresholdPoints = reqRoyalP;
    } else if (totalPurchaseValue >= reqPlatinumV || customerPoints >= reqPlatinumP) {
        currentTier = "پلاتینیوم";
        tierColor = "text-purple-400";
        tierGradient = "from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]";
        nextTier = "الماسی";
        nextTierThresholdValue = reqDiamondV;
        nextTierThresholdPoints = reqDiamondP;
    } else if (totalPurchaseValue >= reqGoldV || customerPoints >= reqGoldP) {
        currentTier = "طلایی";
        tierColor = "text-amber-400";
        tierGradient = "from-amber-500 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
        nextTier = "پلاتینیوم";
        nextTierThresholdValue = reqPlatinumV;
        nextTierThresholdPoints = reqPlatinumP;
    } else if (totalPurchaseValue >= reqSilverV || customerPoints >= reqSilverP) {
        currentTier = "نقره‌ای";
        tierColor = "text-slate-300";
        tierGradient = "from-slate-400 to-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.3)]";
        nextTier = "طلایی";
        nextTierThresholdValue = reqGoldV;
        nextTierThresholdPoints = reqGoldP;
    }

    const progressByPoints = nextTierThresholdPoints > 0 ? (customerPoints / nextTierThresholdPoints) * 100 : 100;
    const progressByValue = nextTierThresholdValue > 0 ? (totalPurchaseValue / nextTierThresholdValue) * 100 : 100;
    
    const progress = Math.max(progressByPoints, progressByValue) >= 100 ? 100 : Math.max(progressByPoints, progressByValue);
    const remainingPoints = nextTierThresholdPoints - customerPoints;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] p-8 rounded-[32px] shadow-2xl text-white relative overflow-hidden h-full flex flex-col justify-between border border-slate-800"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Trophy size={200} className="rotate-12" />
            </div>
            <div className="absolute -left-32 -top-32 w-64 h-64 bg-slate-800/50 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div>
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 ${tierColor}`}>
                                    <Award size={24} />
                                </div>
                                <h3 className="font-black text-2xl text-white tracking-tight">سطح وفاداری</h3>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">مشتری ویژه (سطح {currentTier})</p>
                        </div>
                        <div className="text-left bg-white/5 py-3 px-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <p className="text-2xl font-black text-white">{customerPoints.toLocaleString('fa-IR')}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">امتیاز شما</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm font-bold items-center">
                            <span className={`${tierColor} text-base`}>{currentTier}</span>
                            {nextTier !== 'بالاترین سطح' && (
                                <span className="text-slate-300 flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-lg">هدف: {nextTierThresholdPoints.toLocaleString('fa-IR')}</span>
                                    {nextTier}
                                </span>
                            )}
                        </div>
                        <div className="h-4 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner ring-1 ring-inset ring-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                style={{ transformOrigin: 'right' }}
                                className={`h-full rounded-full relative bg-gradient-to-l ${tierGradient}`}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                            </motion.div>
                        </div>
                        {currentTier !== 'بالاترین سطح' && progress < 100 && (
                            <div className="flex items-start gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                                <Activity size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                    تنها <strong className="text-white font-bold">{remainingPoints.toLocaleString('fa-IR')} امتیاز</strong> تا ارتقاء به سطح <span className="text-white font-bold">{nextTier}</span> فاصله دارید. با خریدهای بیشتر امتیاز کسب کنید.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-bold text-white transition-all shadow-sm">
                        <Gift size={18} className="text-slate-300" />
                        کاتالوگ جوایز
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-l from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400/50">
                        مشاهده مزایا
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ReferralPromoCard = ({ marketingSettings, customer, onNavigate }) => {
    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-8 rounded-[32px] text-white relative overflow-hidden group h-full flex flex-col justify-between shadow-xl shadow-emerald-900/20 border border-emerald-400/30">
            <div className="absolute -bottom-16 -left-16 h-48 w-48 bg-emerald-400 rounded-full blur-[80px] opacity-60 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner border border-white/20">
                              <Share2 size={28} className="text-emerald-100" />
                          </div>
                          <div>
                              <h3 className="font-black text-2xl tracking-tight text-white drop-shadow-md">طرح همکار (برد - برد)</h3>
                              <p className="text-xs text-emerald-50 font-medium mt-1">با دعوت از همکاران، از امتیازات ویژه بهره‌مند شوید</p>
                          </div>
                      </div>
                  </div>
                  
                  <p className="text-[13px] font-medium text-emerald-50 mb-5 leading-relaxed bg-black/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner hidden sm:block">
                      با معرفی <strong>مهندسین ناظر، فروشگاه‌داران و سازندگان</strong> به کویر بسپار، علاوه بر ارتقاء سریع به سطوح VIP، به ازای هر معرفی، <strong>امتیازات تصاعدی</strong> دریافت کنید. امتیازات شما افزایش می‌یابد!
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-[11px] font-bold bg-emerald-900/40 border border-emerald-400/30 text-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={14} className="text-emerald-400" /> فروشگاه تاسیسات
                      </span>
                      <span className="text-[11px] font-bold bg-emerald-900/40 border border-emerald-400/30 text-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={14} className="text-emerald-400" /> مهندس ناظر
                      </span>
                      <span className="text-[11px] font-bold bg-emerald-900/40 border border-emerald-400/30 text-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={14} className="text-emerald-400" /> شرکت‌های ساختمانی
                      </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 relative">
                    <button 
                        onClick={() => onNavigate && onNavigate('referrals')}
                         className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 text-emerald-800 rounded-xl text-sm font-black transition-all shadow-[0_8px_30px_rgba(0,0,0,0.15)] group-hover:scale-[1.02] border border-white/50"
                    >
                        <span>ثبت همکار جدید و دریافت پاداش</span>
                        <ArrowUpRight size={20} className="text-emerald-500 opacity-80 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <p className="text-center text-[10px] text-emerald-100 mt-4 font-bold tracking-widest opacity-80 uppercase">
                        تعداد معرفی نامحدود
                    </p>
                </div>
            </div>
        </div>
    );
};

const OrderAnalysisCard = ({ customerOrders }: { customerOrders: any[] }) => {
    const approvedOrdersCount = useMemo(() => {
        if (!customerOrders) return 0;
        return customerOrders.filter(order => order.status === 'تایید شده').length;
    }, [customerOrders]);

    const totalOrdersCount = customerOrders?.length || 0;
    const percentage = totalOrdersCount > 0 ? (approvedOrdersCount / totalOrdersCount) * 100 : 0;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] h-full"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="font-black text-xl text-slate-900 tracking-tight">تحلیل سفارشات</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">وضعیت تحقق سفارشات شما</p>
                </div>
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 shadow-sm">
                    <TrendingUp size={24} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative h-48 w-48 flex items-center justify-center shrink-0">
                    <svg className="h-full w-full rotate-[-90deg] drop-shadow-md">
                        <circle 
                            cx="50%" cy="50%" r="70" 
                            className="stroke-slate-50 fill-none" 
                            strokeWidth="14" 
                        />
                        <motion.circle 
                            initial={{ strokeDasharray: "0, 440" }}
                            animate={{ strokeDasharray: `${percentage * 4.4}, 440` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="50%" cy="50%" r="70" 
                            className="stroke-blue-600 fill-none" 
                            strokeWidth="14" 
                            strokeLinecap="round" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{Math.round(percentage)}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">تکمیل شده</span>
                    </div>
                </div>

                <div className="flex-1 space-y-7 w-full">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm items-end">
                            <span className="text-slate-500 font-bold">سفارشات تایید شده</span>
                            <span className="text-slate-900 font-black text-lg bg-slate-50 px-3 py-1 rounded-lg">{approvedOrdersCount}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className="h-full bg-gradient-to-l from-blue-500 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm items-end">
                            <span className="text-slate-500 font-bold">کل سفارشات</span>
                            <span className="text-slate-900 font-black text-lg">{totalOrdersCount}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full shadow-inner" />
                    </div>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        مشاهده جزئیات کامل بررسی
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const RecentOrders = () => {
    const orders = [
        { id: 'KB-95784', date: '۱۴۰۳/۰۴/۲۵', total: '۱۲۵,۰۰۰,۰۰۰', status: 'تحویل شده', statusColor: 'emerald' },
        { id: 'KB-95780', date: '۱۴۰۳/۰۴/۲۲', total: '۸۲,۰۰۰,۰۰۰', status: 'در حال ارسال', statusColor: 'blue' },
        { id: 'KB-95775', date: '۱۴۰۳/۰۴/۲۰', total: '۳۱۰,۰۰۰,۰۰۰', status: 'در حال پردازش', statusColor: 'amber' },
    ];
    
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-slate-900 tracking-tight">آخرین سفارشات</h3>
                <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100">همه تاریخچه</button>
            </div>
            <div className="space-y-3 flex-1">
                {orders.map(order => (
                    <div key={order.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-${order.statusColor}-50 text-${order.statusColor}-600 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all border border-${order.statusColor}-100`}>
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 tracking-tight">{order.id}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{order.date}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-slate-900 tracking-tighter">{order.total}</p>
                            <div className="flex items-center justify-end gap-1.5 mt-1">
                                <span className={`h-2 w-2 rounded-full bg-${order.statusColor}-500 shadow-[0_0_5px_rgba(0,0,0,0.2)] shadow-${order.statusColor}-500/50`}></span>
                                <span className={`text-[10px] text-${order.statusColor}-700 font-bold bg-${order.statusColor}-50 px-1.5 rounded`}>{order.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SpecialOffers = ({ offers, customer, onNavigate }) => {
    const relevantOffers = useMemo(() => {
        if (!offers || !customer) return [];
        return offers.filter(o => o.type === 'public' || (o.type === 'specific' && o.customerId === customer.id)).slice(0, 2);
    }, [offers, customer]);

    if (relevantOffers.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-800 to-blue-900 p-8 rounded-[32px] text-white overflow-hidden relative group h-full flex flex-col justify-between shadow-xl shadow-blue-900/20 border border-blue-700/50">
            <div className="absolute -top-24 -left-24 h-64 w-64 bg-blue-500 rounded-full blur-[80px] opacity-40 group-hover:scale-125 group-hover:bg-indigo-500 transition-all duration-700"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                        <Megaphone size={20} className="text-blue-200" />
                    </div>
                    <h3 className="font-black text-xl tracking-tight text-white drop-shadow">پیشنهادات طلایی</h3>
                </div>
                <div className="space-y-4">
                    {relevantOffers.map(offer => (
                        <div key={offer.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group/item hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5" onClick={() => onNavigate && onNavigate('catalog')}>
                            <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner group-hover/item:scale-105 transition-transform shrink-0">
                                <img src={offer.imageUrl || undefined} alt={offer.productName} className="max-h-full max-w-full object-contain text-black text-[8px]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-blue-50 truncate mb-1">{offer.productName}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-base font-black text-white bg-blue-500/50 px-2 py-0.5 rounded-lg border border-blue-400/30">{offer.discount}</span>
                                </div>
                            </div>
                            <button className="h-10 w-10 shrink-0 flex items-center justify-center bg-white text-blue-600 rounded-xl shadow-lg ring-4 ring-white/0 group-hover/item:ring-white/20 transition-all group-hover/item:-translate-x-1">
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PurchasesChart = ({ customerOrders }: { customerOrders: any[] }) => {
    const data = useMemo(() => {
        const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        
        const groups: Record<string, { value: number; count: number }> = {};
        months.forEach(m => groups[m] = { value: 0, count: 0 });
        
        const toEnglishDigits = (str: string) => {
            if (!str) return '';
            return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
        };

        customerOrders.forEach(order => {
            // Include successful orders
            if (order.status !== 'لغو شده' && order.status !== 'در انتظار تایید') {
                 const systemDate = new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' });
                 const sysMonth = systemDate.split('/')[1] ? parseInt(systemDate.split('/')[1], 10) - 1 : 3;
                 let monthName = months[sysMonth >= 0 && sysMonth < 12 ? sysMonth : 3];

                 if (order.date && typeof order.date === 'string') {
                      const engDate = toEnglishDigits(order.date);
                      const parts = engDate.split('/');
                      if (parts.length >= 2) {
                           const m = parseInt(parts[1], 10);
                           if (!isNaN(m) && m >= 1 && m <= 12) {
                               monthName = months[m - 1];
                           }
                      }
                 }
                 if (!groups[monthName]) groups[monthName] = { value: 0, count: 0 };
                 groups[monthName].value += (order.totalAmount || 0) / 10000000; // 10,000,000 Rials = 1 Million Tomans
                 groups[monthName].count += 1;
            }
        });

        return months.map(key => ({
            name: key,
            'ارزش خرید (میلیون تومان)': Math.round(groups[key].value * 10) / 10,
            'تعداد خرید (مرتبه)': groups[key].count
        }));
    }, [customerOrders]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.02)] relative overflow-hidden group/chart"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        <h3 className="font-black text-xl text-slate-900 tracking-tight">روند خرید سالانه (دوطرفه)</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">نمودار واقعی دفعات و حجم خریدهای تایید شده شما در هر ماه</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                        <span className="w-2.5 h-2.5 rounded-md bg-indigo-600"></span>
                        <span>ملیون تومان</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                        <span className="w-2.5 h-2.5 rounded-md bg-emerald-500"></span>
                        <span>تعداد سفارش</span>
                    </div>
                </div>
            </div>
            
            <div className="h-[380px] w-full pt-4" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{ top: 10, right: -5, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} 
                            dy={15} 
                        />
                        <YAxis 
                            yAxisId="left"
                            orientation="left"
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4f46e5', fontSize: 11, fontWeight: 700 }} 
                            dx={-10}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#10b981', fontSize: 11, fontWeight: 700 }} 
                            dx={10}
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(99,102,241,0.03)' }} 
                            contentStyle={{ 
                                borderRadius: '20px', 
                                border: '1px solid #f1f5f9', 
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
                                fontFamily: 'inherit',
                                direction: 'rtl',
                                textAlign: 'right',
                                padding: '14px 18px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(8px)'
                            }}
                            itemStyle={{ fontWeight: '800', fontSize: '13px' }}
                            labelStyle={{ color: '#0f172a', fontWeight: '900', marginBottom: '10px', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}
                        />
                        <Bar 
                            yAxisId="left"
                            dataKey="ارزش خرید (میلیون تومان)" 
                            fill="#4f46e5" 
                            radius={[6, 6, 0, 0]} 
                            barSize={24}
                            animationDuration={1500}
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone"
                            dataKey="تعداد خرید (مرتبه)" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', r: 4, strokeWidth: 1 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const DashboardOverview = ({ specialOffers, productDiscounts, customer, customerOrders, marketingSettings, onNavigate }) => {
    
    // Calculate customer points
    const totalPurchaseValue = useMemo(() => {
        return customerOrders
            .filter(order => order.status !== 'لغو شده' && order.status !== 'در انتظار تایید')
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    }, [customerOrders]);

    const totalOrdersCount = customerOrders.length;

    const applicableDiscounts = useMemo(() => {
        if (!productDiscounts || !customer) return [];
        return productDiscounts.filter(d => d.type === 'public' || (d.type === 'specific' && d.customerIds?.includes(customer.id)));
    }, [productDiscounts, customer]);
    
    // Base points + manual loyalty points
    const customerPoints = useMemo(() => {
        const base = marketingSettings?.basePoints || 50;
        const manualPoints = customer?.loyaltyPoints || 0;
        return base + manualPoints;
    }, [customer, marketingSettings]);

    const volumeInfo = useMemo(() => {
        const levels = [
            { threshold: marketingSettings?.tierBronzeMin || 0, percent: marketingSettings?.tierBronzePercent || 0 },
            { threshold: marketingSettings?.tierSilverMin || 50000000, percent: marketingSettings?.tierSilverPercent || 0 },
            { threshold: marketingSettings?.tierGoldMin || 100000000, percent: marketingSettings?.tierGoldPercent || 0 },
            { threshold: marketingSettings?.tierPlatinumMin || 200000000, percent: marketingSettings?.tierPlatinumPercent || 0 },
            { threshold: marketingSettings?.tierDiamondMin || 500000000, percent: marketingSettings?.tierDiamondPercent || 0 },
            { threshold: marketingSettings?.tierRoyalMin || 1000000000, percent: marketingSettings?.tierRoyalPercent || 0 },
        ].filter(l => l.threshold > 0).sort((a, b) => a.threshold - b.threshold);

        let currentDiscount = 0;
        let nextTarget = null;
        for (let i = 0; i < levels.length; i++) {
            if (totalPurchaseValue >= levels[i].threshold) {
                currentDiscount = levels[i].percent;
            } else {
                nextTarget = levels[i];
                break;
            }
        }
        return { currentDiscount, nextTarget };
    }, [marketingSettings, totalPurchaseValue]);

    const activeDiscount = Math.max(customer?.discount || 0, volumeInfo.currentDiscount);

    const dynamicStats = useMemo(() => {
        let processingCount = 0;
        let openInvoiceCount = 0;
        let totalMonthlyPurchase = 0;

        const systemDate = new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' });
        const currentMonthString = systemDate.split('/')[1] ? systemDate.split('/')[1].padStart(2, '0') : '04';

        const toEnglishDigits = (str: string) => {
            if (!str) return '';
            return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
        };

        customerOrders.forEach(order => {
            if (['در انتظار تایید', 'در حال پردازش'].includes(order.status || '')) {
                processingCount++;
            }
            if (order.status === 'فاکتور صادر شده' || order.status === 'تایید شده (عقد قرارداد)') {
                openInvoiceCount++;
            }
            // Real-time calculation for "this month"
            if (order.status !== 'لغو شده' && order.status !== 'در انتظار تایید') {
                const orderDate = toEnglishDigits(order.date || '');
                const orderMonth = orderDate.split('/')[1]?.padStart(2, '0');
                if (orderMonth === currentMonthString || orderMonth === '04') { // Keep 04 as fallback for initial dummy orders
                     totalMonthlyPurchase += (order.totalAmount || 0);
                }
            }
        });

        const formatCurrencyInTomansOrMillions = (rials: number) => {
            if (rials === 0) return '۰';
            const tomans = rials / 10;
            if (tomans >= 1_000_000_000) {
                return (tomans / 1_000_000_000).toFixed(1).replace('.0', '') + ' میلیارد';
            }
            if (tomans >= 1_000_000) {
                return (tomans / 1_000_000).toFixed(1).replace('.0', '') + ' میلیون';
            }
            return tomans.toLocaleString('fa-IR');
        };

        return [
            { icon: <Clock size={22} />, title: "در حال پردازش", value: `${processingCount.toLocaleString('fa-IR')} مورد`, color: "bg-blue-500", change: processingCount > 0 ? "فعال" : "", isUp: true },
            { icon: <CreditCard size={22} />, title: "خرید ماه جاری", value: formatCurrencyInTomansOrMillions(totalMonthlyPurchase), color: "bg-cyan-500", change: "صعودی", isUp: true },
            { icon: <Megaphone size={22} />, title: "تخفیف شما", value: `${activeDiscount}٪`, color: "bg-amber-500" },
            { icon: <AlertCircle size={22} />, title: "سفارش باز", value: `${openInvoiceCount.toLocaleString('fa-IR')} عدد`, color: "bg-rose-500", change: "نیاز به اقدام", isUp: false },
            { icon: <Ticket size={22} />, title: "مجموع خرید", value: formatCurrencyInTomansOrMillions(totalPurchaseValue), color: "bg-indigo-500" },
            { icon: <Wallet size={22} />, title: "اعتبار اعطایی", value: "۲۵۰ میلیون", color: "bg-emerald-500" },
        ];
    }, [customerOrders, totalPurchaseValue, activeDiscount]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
            <header className="mb-2 pt-1 border-b border-slate-100 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-block px-2 py-0.5 bg-indigo-600 rounded-lg text-[9px] text-white font-black tracking-wider uppercase">کویر بسپار</span>
                        <span className="text-[10px] text-slate-400 font-bold">پنل مدیریت هوشمند و کلوپ مشتریان</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                        سلام، {customer?.name ? `${customer.name} عزیز` : 'همکار گرامی'} 👋
                    </h1>
                    <p className="text-slate-500 font-semibold text-xs mt-1.5">خوش آمدید! نگاهی به وضعیت امروز و امتیازهای وفاداری خود بیندازید.</p>
                </div>
                <div className="text-[10px] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-bold text-slate-500 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>به‌روزرسانی خودکار زنده</span>
                </div>
            </header>

            {applicableDiscounts.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="my-4 relative overflow-hidden bg-slate-900 rounded-[24px] p-6 sm:p-8 shadow-lg text-white border border-slate-800 group cursor-pointer"
                    onClick={() => onNavigate && onNavigate('catalog')}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="bg-slate-800 p-4 rounded-2xl flex-shrink-0 border border-slate-700 shadow-inner text-amber-400 group-hover:scale-105 transition-transform duration-500">
                                <Ticket size={32} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-widest">تخفیف ویژه</span>
                                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">پیشنهاد همکاری اختصاصی</h2>
                                </div>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-2xl mt-1.5">
                                    کویر بسپار امتیاز ویژه‌ای برای شما در نظر گرفته است: <span className="inline-block bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md font-black mx-1 tracking-tight">{applicableDiscounts[0].percentage}٪ تخفیف</span> برای <span className="font-bold text-slate-200">{applicableDiscounts[0].productName}</span>. موجودی محدود است.
                                </p>
                            </div>
                        </div>
                        <button className="w-full md:w-auto flex-shrink-0 bg-slate-800 text-white hover:bg-slate-700 font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 group/btn border border-slate-600 text-sm">
                            مشاهده لیست قیمت
                            <ChevronRight size={18} className="text-slate-400 group-hover/btn:-translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            )}

            {activeDiscount > 0 || volumeInfo.nextTarget ? (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-l from-indigo-900 via-slate-800 to-indigo-950 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(31,31,100,0.5)] text-white flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden group/discount border border-indigo-500/20"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-5 relative z-10 w-full lg:w-auto">
                        <div className="bg-gradient-to-b from-indigo-400 to-indigo-600 p-1 rounded-[22px] flex-shrink-0 shadow-lg shadow-indigo-500/20 group-hover/discount:scale-105 transition-transform duration-500">
                             <div className="bg-slate-900/80 p-4 rounded-[18px] backdrop-blur-md border border-white/5">
                                  <Star size={32} className="text-indigo-300 fill-indigo-300/30 group-hover/discount:fill-indigo-300 transition-colors" />
                             </div>
                        </div>
                        <div className="flex-1 w-full relative z-10">
                            <h2 className="text-lg md:text-xl font-black mb-2 tracking-tight flex items-center flex-wrap gap-2 text-indigo-50">
                                {activeDiscount > 0 ? (
                                    <>
                                        وضعیت تخفیف فعال شما:
                                        <span className="bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-xl text-xl font-black shadow-inner border border-indigo-400/30">
                                            {activeDiscount}٪
                                        </span>
                                    </>
                                ) : (
                                    <>ارتقای سطح همکاری</>
                                )}
                            </h2>
                            <div className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mt-1.5">
                                {volumeInfo.nextTarget ? (
                                    <div className="flex flex-col gap-4">
                                        <span className="flex flex-wrap items-center gap-y-2">
                                            با افزایش تنها
                                            <span className="font-bold text-white bg-slate-800/80 border border-slate-600/50 px-3 py-1 rounded-lg shadow-inner mx-1.5 text-sm">
                                                {(volumeInfo.nextTarget.threshold - totalPurchaseValue).toLocaleString('fa-IR')} ریال
                                            </span>
                                            سفارش جدید، تخفیف دائم شما به
                                            <span className="font-extrabold text-indigo-300 mx-1.5 text-base bg-indigo-500/20 border border-indigo-400/20 px-2.5 py-0.5 rounded shadow-sm">{volumeInfo.nextTarget.percent}٪</span>
                                            افزایش می‌یابد.
                                        </span>
                                        
                                        <div className="w-full max-w-md mt-2">
                                            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                                                <span>خرید تایید شده: {(totalPurchaseValue).toLocaleString('fa-IR')} ریال</span>
                                                <span className="text-indigo-300">هدف بعدی: {(volumeInfo.nextTarget.threshold).toLocaleString('fa-IR')} ریال</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                                                <div 
                                                    className="h-full bg-indigo-500 relative" 
                                                    style={{ width: `${Math.min(100, Math.max(2, (totalPurchaseValue / volumeInfo.nextTarget.threshold) * 100))}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    customer?.discountReason || 'بالاترین سطح تخفیف به صورت پیش‌فرض در تمام خرید‌های شما لحاظ می‌شود.'
                                )}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onNavigate && onNavigate('catalog')}
                        className="w-full lg:w-auto flex-shrink-0 relative z-10 bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3.5 rounded-xl font-black transition-all shadow-md hover:shadow-indigo-500/30 active:scale-95 whitespace-nowrap border border-indigo-500/50 flex justify-center items-center gap-2 group/btn2 text-sm"
                    >
                        مشاهده لیست قیمت
                        <ArrowUpRight size={18} className="text-indigo-200 group-hover/btn2:text-white group-hover/btn2:-translate-y-0.5 group-hover/btn2:translate-x-0.5 transition-transform" />
                    </button>
                </motion.div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
                {dynamicStats.map((stat, i) => <StatCard key={stat.title} {...stat} index={i} />)}
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch pt-2">
                <div className="xl:col-span-8 flex">
                    <div className="w-full h-full min-h-[380px]">
                        <CustomerTierCard marketingSettings={marketingSettings} totalPurchaseValue={totalPurchaseValue} customerPoints={customerPoints} />
                    </div>
                </div>
                <div className="xl:col-span-4 flex">
                    <div className="w-full h-full">
                        <ReferralPromoCard marketingSettings={marketingSettings} customer={customer} onNavigate={onNavigate} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
                    <OrderAnalysisCard customerOrders={customerOrders} />
                    <PurchasesChart customerOrders={customerOrders} />
                </div>
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-8">
                   <SpecialOffers offers={specialOffers} customer={customer} onNavigate={onNavigate} />
                   <RecentOrders />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
