import React, { useState, useEffect, useRef } from 'react';
import { 
    Bell, 
    Moon, 
    Sun, 
    Search, 
    Home, 
    ArrowRight, 
    User, 
    Settings, 
    LogOut, 
    ChevronDown, 
    X, 
    Sparkles, 
    CheckCircle2, 
    Clock, 
    ShieldAlert,
    Smartphone
} from 'lucide-react';
import MenuIcon from './icons/MenuIcon';
import { motion, AnimatePresence } from 'motion/react';

const PAGE_TITLES: Record<string, string> = {
    'customer-management': 'مدیریت مشتریان',
    'add-customer': 'افزودن مشتری جدید',
    'order-requests': 'درخواست‌های سفارش',
    'support-tickets': 'تیکت‌های پشتیبانی',
    'announcements': 'اطلاعیه‌ها و پیام‌ها',
    'settings': 'تنظیمات سامانه',
    'special-offers': 'پیشنهادات ویژه',
    'product-discounts': 'مدیریت تخفیفات کالا',
    'product-management': 'تعریف کالا و قیمت',
    'registered-products': 'محصولات ثبت‌شده',
    'marketing-loyalty': 'باشگاه مشتریان',
    'partnership-requests': 'درخواست‌های نمایندگی',
    'colleague-referrals': 'سیستم معرفی همکار',
    'sales-management': 'مدیریت وضعیت فروش',
    'store-locator-management': 'مدیریت نقاط فروش',
    'surveys': 'مدیریت نظرسنجی‌ها'
};

interface AdminDashboardHeaderProps {
    onToggleMobileSidebar: () => void;
    onNavigateHome: () => void;
    notificationCount: number;
    activePage: string;
    hasDetailOpen?: boolean;
    onBackFromDetail?: () => void;
    detailTitle?: string;
    onNavigate?: (page: string) => void;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ 
    onToggleMobileSidebar, 
    onNavigateHome, 
    notificationCount,
    activePage,
    hasDetailOpen = false,
    onBackFromDetail,
    detailTitle,
    onNavigate
}) => {
    const pageTitle = hasDetailOpen && detailTitle ? detailTitle : (PAGE_TITLES[activePage] || 'داشبورد مدیریت');

    // UI state
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Refs for outside click handling
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close on outside clicks
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (profileRef.current && !profileRef.current.contains(target)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Hotkey for search (Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Simulated premium notifications
    const notifications = [
        { id: 1, title: 'سفارش ثبت‌شده جدید', desc: 'فروشگاه نگین کویر فاکتور پیش‌نویس ثبت کرد.', time: '۲ دقیقه پیش', type: 'order', page: 'order-requests' },
        { id: 2, title: 'تیکت پشتیبانی جدید', desc: 'مشتری «علیرضا رضایی» تیکت جدید ارسال کرده است.', time: '۱۰ دقیقه پیش', type: 'ticket', page: 'support-tickets' },
        { id: 3, title: 'درخواست همکاری ثبت شد', desc: 'یک تقاضای جدید نمایندگی برای بررسی ارسال شد.', time: '۱ ساعت پیش', type: 'partnership', page: 'partnership-requests' }
    ];

    // Handle search click result
    const handleSearchResultClick = (pageKey: string) => {
        if (onNavigate) {
            onNavigate(pageKey);
        }
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    // Filter page titles for command search
    const filteredSearchPages = Object.entries(PAGE_TITLES).filter(([key, value]) => 
        value.toLowerCase().includes(searchQuery.toLowerCase()) || 
        key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3">
                {hasDetailOpen ? (
                    <button 
                        onClick={onBackFromDetail}
                        className="p-2 -mr-1.5 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5 font-bold text-xs"
                        aria-label="Back"
                    >
                        <ArrowRight size={20} className="text-slate-800" />
                        <span className="hidden sm:inline text-slate-700">بازگشت</span>
                    </button>
                ) : (
                    <button 
                        className="lg:hidden p-2.5 -mr-1.5 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all" 
                        onClick={onToggleMobileSidebar}
                        aria-label="Menu"
                    >
                        <MenuIcon />
                    </button>
                )}
                
                {/* Dynamic Title */}
                <div className="flex flex-col text-right">
                    <h1 className="text-sm sm:text-base font-black text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
                        {pageTitle}
                        {hasDetailOpen && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#5d87ff]/10 text-[#5d87ff]">
                                جزئیات پرونده
                            </span>
                        )}
                    </h1>
                    <span className="text-[10px] text-slate-400 font-bold hidden sm:block">
                        پنل مدیریت تخصصی کویر بسپار
                    </span>
                </div>
            </div>

            {/* Quick Command Bar Search - Desktop */}
            <div className="hidden md:flex items-center relative max-w-xs w-full mx-8">
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full flex items-center gap-2.5 text-slate-400 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl px-3.5 py-2 text-xs text-right transition-all cursor-pointer group"
                >
                    <Search size={15} className="text-slate-400 group-hover:text-[#5d87ff] transition-colors" />
                    <span className="flex-1 text-slate-500 font-medium select-none">جستجوی صفحات پنل...</span>
                    <kbd className="hidden sm:inline-block font-mono text-[9px] font-bold bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-3xs text-slate-400">
                        Ctrl+K
                    </kbd>
                </button>
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Site main icon link */}
                <button 
                    onClick={onNavigateHome} 
                    className="p-2.5 text-slate-600 hover:text-[#5d87ff] hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                    title="مشاهده سایت اصلی"
                >
                    <Home size={18} />
                    <span className="hidden lg:block text-xs font-black">نمای سایت</span>
                </button>

                <div className="h-6 w-[1px] bg-slate-100 mx-0.5"></div>

                {/* Mobile Search Button */}
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 md:hidden text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
                    aria-label="Search"
                >
                    <Search size={18} />
                </button>

                {/* Dark Mode Toggle Sim */}
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 text-slate-600 hover:text-amber-500 hover:bg-amber-50/50 rounded-xl transition-all active:scale-95 hidden sm:block"
                    title={isDarkMode ? "حالت روشن" : "حالت تاریک"}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            setIsProfileOpen(false);
                        }}
                        className={`p-2.5 rounded-xl transition-all relative active:scale-95 ${
                            isNotificationsOpen ? 'bg-slate-100 text-[#5d87ff]' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                        {notificationCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse shadow-sm ring-2 ring-white">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:left-0 sm:mt-2.5 w-auto sm:w-80 bg-white rounded-2xl border border-slate-150 shadow-2xl sm:shadow-xl z-50 overflow-hidden max-h-[80vh] sm:max-h-auto flex flex-col"
                            >
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-extrabold text-xs text-slate-800">اطلاعیه‌های سیستمی</h3>
                                    <span className="text-[10px] font-black bg-[#5d87ff]/10 text-[#5d87ff] px-2 py-0.5 rounded-full">
                                        {notificationCount} مورد جدید
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                                    {notifications.map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={() => {
                                                if (onNavigate) onNavigate(item.page);
                                                setIsNotificationsOpen(false);
                                            }}
                                            className="w-full p-4 hover:bg-slate-50 transition-colors flex gap-3 text-right text-xs"
                                        >
                                            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 self-start shrink-0">
                                                <Clock size={14} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="font-bold text-slate-800 text-xs">{item.title}</p>
                                                <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                                                <p className="text-[9px] text-slate-400 font-medium">{item.time}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                    <button 
                                        onClick={() => {
                                            if (onNavigate) onNavigate('order-requests');
                                            setIsNotificationsOpen(false);
                                        }}
                                        className="text-[11px] font-black text-[#5d87ff] hover:underline"
                                    >
                                        مشاهده همه درخواست‌ها و تیکت‌ها
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-[1px] bg-slate-100 mx-0.5"></div>

                {/* Profile Selector Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotificationsOpen(false);
                        }}
                        className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                            alt="Admin Avatar" 
                            className="h-7 w-7 rounded-lg object-cover ring-2 ring-slate-100 shadow-sm shrink-0" 
                        />
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-slate-700' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:left-0 sm:mt-2.5 w-auto sm:w-64 bg-white rounded-2xl border border-slate-150 shadow-2xl sm:shadow-xl z-50 overflow-hidden"
                            >
                                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                    <img 
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                                        alt="Admin Avatar" 
                                        className="h-11 w-11 rounded-xl object-cover ring-2 ring-white shadow-sm" 
                                    />
                                    <div className="flex flex-col text-right">
                                        <span className="font-extrabold text-slate-800 text-xs">سید مجتبی</span>
                                        <span className="text-[10px] text-slate-400 font-black mt-0.5">مدیر ارشد سامانه</span>
                                    </div>
                                </div>
                                <div className="p-1.5 space-y-0.5">
                                    <button 
                                        onClick={() => {
                                            if (onNavigate) onNavigate('settings');
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold"
                                    >
                                        <Settings size={15} className="text-slate-400" />
                                        <span>تنظیمات سامانه</span>
                                    </button>
                                    <button 
                                        onClick={onNavigateHome}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold"
                                    >
                                        <Home size={15} className="text-slate-400" />
                                        <span>مشاهده وب‌سایت</span>
                                    </button>
                                </div>
                                <div className="p-1.5 border-t border-slate-100">
                                    <button 
                                        onClick={() => {
                                            alert('شبیه‌سازی خروج با موفقیت انجام شد.');
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right text-xs text-rose-600 hover:bg-rose-50 transition-all font-bold"
                                    >
                                        <LogOut size={15} />
                                        <span>خروج از پنل مدیریت</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Smart Command Search Palette Overlay/Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
                        />

                        {/* Search Container */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10"
                            ref={searchRef}
                        >
                            {/* Search Header Input */}
                            <div className="p-4 border-b border-slate-150 flex items-center gap-3">
                                <Search size={18} className="text-slate-400 shrink-0" />
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="کجا می‌خواهید بروید؟ (نام صفحه را بنویسید...)" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:ring-0 text-right"
                                    dir="rtl"
                                />
                                <button 
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-80 overflow-y-auto p-2">
                                <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">
                                    صفحات و میانبرهای پنل مدیریت
                                </div>
                                <div className="space-y-1">
                                    {filteredSearchPages.map(([key, value]) => (
                                        <button 
                                            key={key}
                                            onClick={() => handleSearchResultClick(key)}
                                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-right text-xs transition-all ${
                                                activePage === key 
                                                    ? 'bg-[#5d87ff]/10 text-[#5d87ff] font-extrabold' 
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className={`p-1.5 rounded-lg ${activePage === key ? 'bg-[#5d87ff]/20 text-[#5d87ff]' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Sparkles size={14} />
                                                </div>
                                                <span className="font-bold">{value}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                                {key}
                                            </span>
                                        </button>
                                    ))}

                                    {filteredSearchPages.length === 0 && (
                                        <div className="p-8 text-center text-slate-400 text-xs">
                                            موردی متناسب با عبارت جستجو یافت نشد.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Help Footer */}
                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-semibold px-4">
                                <span>با کلیک روی گزینه‌ها فوراً هدایت می‌شوید</span>
                                <span className="flex items-center gap-1">
                                    <Smartphone size={12} />
                                    کاملاً سازگار با لمس اندروید
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default AdminDashboardHeader;
