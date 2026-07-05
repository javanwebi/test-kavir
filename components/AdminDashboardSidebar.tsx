import React from 'react';
import { 
    KavirBasparLogo, ProfileIcon, ChartBarIcon, PowerIcon, SettingsIcon, MyOrdersIcon, SupportIcon, AnnouncementsIcon, RocketIcon, PercentBadgeIcon, CubeIcon, CatalogIcon
} from './dashboard/DashboardIcons';
import { ClipboardList, Users, MapPin } from 'lucide-react';
import { AdminDashboardPage } from './AdminDashboard';
import CloseIcon from './icons/CloseIcon';
import { motion, AnimatePresence } from 'motion/react';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    page: AdminDashboardPage;
    activePage: AdminDashboardPage;
    onNavigate: (page: AdminDashboardPage) => void;
    notification?: number;
}
const NavItem: React.FC<NavItemProps> = ({ icon, label, page, activePage, onNavigate, notification }) => (
    <button 
        onClick={() => onNavigate(page)}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all text-right active:scale-[0.98] ${
        activePage === page 
            ? 'bg-[#5d87ff] text-white shadow-lg shadow-[#5d87ff]/25 font-bold' 
            : 'text-slate-600 hover:bg-slate-50'
    }`}>
        <div className={`transition-transform duration-300 ${activePage === page ? 'scale-110' : ''}`}>
            {icon}
        </div>
        <span className="flex-1 text-[11px] sm:text-xs">{label}</span>
        {notification && notification > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {notification}
            </span>
        )}
    </button>
);

interface AdminDashboardSidebarProps {
    activePage: AdminDashboardPage;
    onNavigate: (page: AdminDashboardPage) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    notificationCount: number;
}

const SidebarContent: React.FC<{
    activePage: AdminDashboardPage;
    onNavigate: (page: AdminDashboardPage) => void;
    notificationCount: number;
}> = ({ activePage, onNavigate, notificationCount}) => (
     <>
        <div className="px-6 py-5 border-b flex items-center justify-between">
            <KavirBasparLogo />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">مدیریت</h3>
                <NavItem icon={<ProfileIcon />} label="مدیریت مشتریان" page="customer-management" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<CubeIcon />} label="تعریف کالا" page="product-management" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<CatalogIcon />} label="لیست محصولات ثبت شده" page="registered-products" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<MyOrdersIcon />} label="درخواست‌های سفارش" page="order-requests" activePage={activePage} onNavigate={onNavigate} notification={notificationCount} />
                <NavItem icon={<MyOrdersIcon />} label="درخواست‌های نمایندگی" page="partnership-requests" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<Users size={18} />} label="معرفی همکاران" page="colleague-referrals" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<SupportIcon />} label="پشتیبانی فنی" page="support-tickets" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<AnnouncementsIcon />} label="اطلاعیه‌ها" page="announcements" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<RocketIcon />} label="پیشنهادات ویژه" page="special-offers" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<PercentBadgeIcon />} label="مدیریت تخفیف کالا" page="product-discounts" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<ChartBarIcon />} label="باشگاه مشتریان و بازاریابی" page="marketing-loyalty" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<ClipboardList size={18} />} label="مدیریت نظرسنجی‌ها" page="surveys" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<RocketIcon />} label="مدیریت وضعیت فروش" page="sales-management" activePage={activePage} onNavigate={onNavigate} />
                <NavItem icon={<MapPin size={18} />} label="مدیریت نقاط فروش (نقشه)" page="store-locator-management" activePage={activePage} onNavigate={onNavigate} />
            </div>
             <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">سیستم</h3>
                <NavItem icon={<SettingsIcon />} label="تنظیمات" page="settings" activePage={activePage} onNavigate={onNavigate} />
            </div>
        </nav>
        <div className="p-4 mt-auto">
            <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-3">
                <img src="https://i.pravatar.cc/40?u=admin" alt="Admin Avatar" className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">نام ادمین</p>
                    <p className="text-xs text-gray-500">مدیر سیستم</p>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-200">
                    <PowerIcon />
                </button>
            </div>
        </div>
    </>
);

const AdminDashboardSidebar: React.FC<AdminDashboardSidebarProps> = ({ activePage, onNavigate, isOpen, setIsOpen, notificationCount }) => {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-l border-slate-100 flex-col flex-shrink-0 h-screen sticky top-0 hidden lg:flex shadow-sm">
                <SidebarContent activePage={activePage} onNavigate={onNavigate} notificationCount={notificationCount} />
            </aside>
            
            {/* Mobile Animated Sidebar with framer-motion */}
            <AnimatePresence>
                {isOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />
                        
                        {/* Sliding Panel */}
                        <motion.aside 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-slate-100 flex flex-col h-full shadow-2xl overflow-hidden"
                        >
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="absolute top-5 left-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
                                aria-label="Close menu"
                            >
                                <CloseIcon/>
                            </button>
                            <SidebarContent activePage={activePage} onNavigate={page => { onNavigate(page); setIsOpen(false); }} notificationCount={notificationCount} />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminDashboardSidebar;