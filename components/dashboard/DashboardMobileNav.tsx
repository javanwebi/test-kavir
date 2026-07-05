import React from 'react';
import { Home, Settings, ShoppingBag, Share2, ClipboardList } from 'lucide-react';
import { DashboardPage } from '../Dashboard';

interface DashboardMobileNavProps {
    activePage: DashboardPage;
    onNavigate: (page: DashboardPage) => void;
}

const DashboardMobileNav: React.FC<DashboardMobileNavProps> = ({ activePage, onNavigate }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-[90] pb-[env(safe-area-inset-bottom,0px)] px-2 pt-2">
            <div className="flex items-center justify-between pb-1">
                <button 
                    onClick={() => onNavigate('dashboard')}
                    className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 rounded-xl transition-all ${activePage === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-blue-500'}`}
                >
                    <Home size={22} className={activePage === 'dashboard' ? 'fill-blue-50' : ''} />
                    <span className="text-[10px] tracking-tight">خانه</span>
                </button>
                <button 
                    onClick={() => onNavigate('catalog')}
                    className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 rounded-xl transition-all ${activePage === 'catalog' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-emerald-500'}`}
                >
                    <ShoppingBag size={22} className={activePage === 'catalog' ? 'fill-emerald-50' : ''} />
                    <span className="text-[10px] tracking-tight">محصولات</span>
                </button>
                <button 
                    onClick={() => onNavigate('reports')}
                    className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 rounded-xl transition-all ${activePage === 'reports' ? 'text-purple-600 font-bold' : 'text-slate-400 hover:text-purple-500'}`}
                >
                    <ClipboardList size={22} className={activePage === 'reports' ? 'fill-purple-50' : ''} />
                    <span className="text-[10px] tracking-tight">گزارشات</span>
                </button>
                <button 
                    onClick={() => onNavigate('referrals')}
                    className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 rounded-xl transition-all ${activePage === 'referrals' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-amber-500'}`}
                >
                    <Share2 size={22} className={activePage === 'referrals' ? 'fill-amber-50' : ''} />
                    <span className="text-[10px] tracking-tight">همکاران</span>
                </button>
                <button 
                    onClick={() => onNavigate('profile')}
                    className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 rounded-xl transition-all ${activePage === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-indigo-500'}`}
                >
                    <Settings size={22} className={activePage === 'profile' ? 'fill-indigo-50' : ''} />
                    <span className="text-[10px] tracking-tight">تنظیمات</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardMobileNav;
