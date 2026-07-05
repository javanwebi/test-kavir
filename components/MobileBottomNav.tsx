import React from 'react';
import { Handshake } from 'lucide-react';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const ProductsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

interface MobileBottomNavProps {
    onNavigateHome: () => void;
    onNavigateToProducts: () => void;
    onNavigateToLogin: () => void;
    onNavigateToContact: () => void;
    onNavigateToPartnership?: () => void;
    currentView: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    onNavigateHome,
    onNavigateToProducts,
    onNavigateToLogin,
    onNavigateToContact,
    onNavigateToPartnership,
    currentView
}) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] border-t border-gray-100 z-[90] pb-2 pt-2 px-2 sm:px-4 transition-transform duration-300">
            <div className="flex items-center justify-between">
                <button 
                    onClick={onNavigateHome}
                    className={`flex flex-col items-center justify-center gap-1.5 transition-colors flex-1 py-1 rounded-xl ${currentView === 'home' || currentView === 'landing' ? 'text-brand bg-brand/5' : 'text-gray-500 hover:text-brand'}`}
                >
                    <HomeIcon />
                    <span className="text-[10px] font-bold tracking-tight">خانه</span>
                </button>
                <button 
                    onClick={onNavigateToProducts}
                    className={`flex flex-col items-center justify-center gap-1.5 transition-colors flex-1 py-1 rounded-xl ${currentView === 'polymer_fittings' || currentView === 'product_categories' || currentView === 'product_detail' ? 'text-brand bg-brand/5' : 'text-gray-500 hover:text-brand'}`}
                >
                    <ProductsIcon />
                    <span className="text-[10px] font-bold tracking-tight">محصولات</span>
                </button>
                <button 
                    onClick={onNavigateToContact}
                    className={`flex flex-col items-center justify-center gap-1.5 transition-colors flex-1 py-1 rounded-xl ${currentView === 'contact' ? 'text-brand bg-brand/5' : 'text-gray-500 hover:text-brand'}`}
                >
                    <PhoneIcon />
                    <span className="text-[10px] font-bold tracking-tight">تماس‌با‌ما</span>
                </button>
                {onNavigateToPartnership && (
                    <button 
                        onClick={onNavigateToPartnership}
                        className={`flex flex-col items-center justify-center gap-1.5 transition-colors flex-1 py-1 rounded-xl ${currentView === 'partnership' ? 'text-brand bg-brand/5' : 'text-gray-500 hover:text-brand'}`}
                    >
                        <Handshake strokeWidth={1.5} className="w-6 h-6" />
                        <span className="text-[10px] font-bold tracking-tight">نمایندگی</span>
                    </button>
                )}
                <button 
                    onClick={onNavigateToLogin}
                    className={`flex flex-col items-center justify-center gap-1.5 transition-colors flex-1 py-1 rounded-xl ${currentView === 'login' ? 'text-brand bg-brand/5' : 'text-gray-500 hover:text-brand'}`}
                >
                    <UserIcon />
                    <span className="text-[10px] font-bold tracking-tight">کاربری</span>
                </button>
            </div>
            {/* Safe area spacing for iOS & gesture nav android */}
            <div className="h-[env(safe-area-inset-bottom,0px)] w-full"></div>
        </div>
    );
};

export default MobileBottomNav;
