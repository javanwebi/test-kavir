
import React, { useState, useEffect } from 'react';
import { Phone, User, LayoutDashboard, Search, Home, Building2, Package, Mail, Users, HardHat, FileText, ChevronLeft, Handshake, MapPin } from 'lucide-react';
import ChevronDownIcon from './icons/ChevronDownIcon';
import SearchIcon from './icons/SearchIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import MenuIcon from './icons/MenuIcon';
import GlobeIcon from './icons/GlobeIcon';
import CloseIcon from './icons/CloseIcon';

// --- Desktop Navigation Components ---

const DesktopNavItem: React.FC<{ children: React.ReactNode; href?: string; onClick?: () => void; className?: string }> = ({ children, href = '#', onClick, className }) => {
    const finalClass = className || "flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm font-medium";
    if (onClick) {
        return (
            <button onClick={onClick} className={`${finalClass} bg-transparent border-none cursor-pointer`}>
                {children}
            </button>
        );
    }
    return (
        <a href={href} className={finalClass}>
            {children}
        </a>
    );
};

const DesktopDropdown: React.FC<{ title: string, children: React.ReactNode, className?: string, dropdownBgClass?: string, itemClass?: string }> = ({ title, children, className, dropdownBgClass, itemClass }) => (
    <div className="relative group">
        <button className={className || "flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm font-medium"}>
            <span>{title}</span>
            <ChevronDownIcon />
        </button>
        <div className={`absolute top-full right-0 mt-4 w-60 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 ${dropdownBgClass || "bg-white/10 backdrop-blur-xl"}`}>
            {React.Children.map(children, child => 
                React.isValidElement(child) 
                    ? React.cloneElement(child as React.ReactElement<any>, { className: itemClass }) 
                    : child
            )}
        </div>
    </div>
);

const DesktopDropdownItem: React.FC<{ children: React.ReactNode, href?: string, onClick?: (e: React.MouseEvent) => void, className?: string }> = ({ children, href = '#', onClick, className }) => (
    <a href={href} onClick={onClick} className={className || "block w-full text-right px-4 py-2.5 text-sm text-white rounded-lg hover:bg-white/20 transition-colors"}>
        {children}
    </a>
);

// --- Mobile Navigation Components ---

const MobileNavItem: React.FC<{ title: string; children?: React.ReactNode; href?: string; onClick?: () => void; icon?: React.ReactNode }> = ({ title, children, href="#", onClick, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!children) {
    if (onClick) {
        return (
            <button onClick={onClick} className="w-full flex items-center justify-between py-3.5 text-base text-slate-100 font-bold border-b border-white/10 hover:bg-white/5 px-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                    {icon && <span className="text-brand-light group-hover:text-white transition-colors">{icon}</span>}
                    <span>{title}</span>
                </div>
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-white transition-colors" />
            </button>
        );
    }
    return (
      <a href={href} className="flex items-center justify-between py-3.5 text-base text-slate-100 font-bold border-b border-white/10 hover:bg-white/5 px-2 rounded-lg transition-colors group">
        <div className="flex items-center gap-3">
            {icon && <span className="text-brand-light group-hover:text-white transition-colors">{icon}</span>}
            <span>{title}</span>
        </div>
        <ChevronLeft size={16} className="text-slate-400 group-hover:text-white transition-colors" />
      </a>
    );
  }

  return (
    <div className="border-b border-white/10 rounded-lg overflow-hidden transition-colors">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex justify-between items-center py-3.5 px-2 text-base font-bold transition-colors ${isOpen ? 'text-white bg-white/10' : 'text-slate-100 hover:bg-white/5'}`}>
        <div className="flex items-center gap-3">
            {icon && <span className={isOpen ? 'text-white' : 'text-brand-light'}>{icon}</span>}
            <span>{title}</span>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`}>
            <ChevronDownIcon />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-1 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pr-6 pl-2 py-1 space-y-0.5 border-r-2 border-brand/30 mr-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const MobileDropdownItem: React.FC<{ children: React.ReactNode; href?: string; onClick?: (e: React.MouseEvent) => void }> = ({ children, href="#", onClick }) => (
    <a href={href} onClick={onClick} className="block py-2.5 px-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95">
        {children}
    </a>
)

// --- Main Header Component ---

interface HeaderProps {
    onNavigateToLogin: () => void;
    onNavigateHome?: () => void;
    onNavigateToPartnership?: () => void;
    onNavigateToAbout?: () => void;
    onNavigateToGoals?: () => void;
    onNavigateToArticles?: () => void;
    onProductSelect?: (product: any) => void;
    onNavigateToContact?: () => void;
    onNavigateToFAQ?: () => void;
    onNavigateToFeedback?: () => void;
    onNavigateToReferral?: () => void;
    onNavigateToStoreLocator?: () => void;
    variant?: 'dark' | 'light';
}

const Header: React.FC<HeaderProps> = ({ onNavigateToLogin, onNavigateHome, onNavigateToPartnership, onNavigateToAbout, onNavigateToGoals, onNavigateToArticles, onProductSelect, onNavigateToContact, onNavigateToFAQ, onNavigateToFeedback, onNavigateToReferral, onNavigateToStoreLocator, variant = 'dark' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isLight = variant === 'light';

    // Dynamic Styles
    const containerClass = isLight 
        ? "bg-white/90 backdrop-blur-lg shadow-md border border-gray-100 rounded-full px-6 py-2 flex items-center justify-between"
        : "bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 flex items-center justify-between";

    const textClass = isLight ? "flex items-center gap-1 text-gray-700 hover:text-brand transition-colors text-sm font-medium" : undefined;
    const dropdownBgClass = isLight ? "bg-white shadow-xl border border-gray-100" : undefined;
    const dropdownItemClass = isLight ? "block w-full text-right px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" : undefined;
    
    const logoTextClass = isLight ? "text-gray-900" : "text-white";
    const logoSubTextClass = isLight ? "text-gray-500" : "text-white opacity-80";

    const iconColorClass = isLight ? "text-gray-600" : "text-white";
    const iconButtonClass = isLight ? "p-2.5 rounded-full hover:bg-gray-100 transition-colors" : "p-2.5 rounded-full hover:bg-white/20 transition-colors";

    const dashboardBtnClass = isLight 
        ? "hidden sm:flex items-center gap-2 bg-transparent text-gray-700 border border-gray-300 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
        : "hidden sm:flex items-center gap-2 bg-transparent text-white border border-white/50 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors";

    const agencyBtnClass = isLight
        ? "hidden sm:flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors shadow-sm"
        : "hidden sm:flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors";

    const openMobileMenu = () => {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(true);
    };

    const closeMobileMenu = () => {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleHomeClick = () => {
        if (onNavigateHome) {
            onNavigateHome();
            closeMobileMenu();
        }
    };

    const handlePartnershipClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToPartnership) {
            onNavigateToPartnership();
            closeMobileMenu();
        }
    };

    const handleAboutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToAbout) {
            onNavigateToAbout();
            closeMobileMenu();
        }
    };

    const handleGoalsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToGoals) {
            onNavigateToGoals();
            closeMobileMenu();
        }
    };

    const handleArticlesClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToArticles) {
            onNavigateToArticles();
            closeMobileMenu();
        }
    };

    const handleContactClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToContact) {
            onNavigateToContact();
            closeMobileMenu();
        }
    };

    const handleFAQClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToFAQ) {
            onNavigateToFAQ();
            closeMobileMenu();
        }
    };

    const handleFeedbackClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToFeedback) {
            onNavigateToFeedback();
            closeMobileMenu();
        }
    };

    const handleReferralClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToReferral) {
            onNavigateToReferral();
            closeMobileMenu();
        }
    };

    const handleStoreLocatorClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigateToStoreLocator) {
            onNavigateToStoreLocator();
            closeMobileMenu();
        } else {
            const event = new CustomEvent('navigate-to-store-locator');
            window.dispatchEvent(event);
            closeMobileMenu();
        }
    };

    const handleProductSelectClick = (e: React.MouseEvent, title: string) => {
        e.preventDefault();
        if (onProductSelect) {
            onProductSelect({ title });
            closeMobileMenu();
        }
    };

    const companyLinks = [
        { title: 'درباره ما', href: '#', onClick: handleAboutClick },
        { title: 'اهداف ما', href: '#', onClick: handleGoalsClick },
        { title: 'مقالات', href: '#', onClick: handleArticlesClick },
    ];
    const productLinks = [
        { title: 'لوله تک لایه', href: '#', onClick: (e: React.MouseEvent) => handleProductSelectClick(e, 'لوله تک لایه پلیمری') },
        { title: 'لوله رولی تک لایه', href: '#', onClick: (e: React.MouseEvent) => handleProductSelectClick(e, 'لوله تک لایه حلقه ای') },
        { title: 'لوله سه لایه فایبر گلاس', href: '#', onClick: (e: React.MouseEvent) => handleProductSelectClick(e, 'لوله سه لایه فایبرگلاس') },
        { title: 'لوله رولی سه لایه فایبر گلاس', href: '#', onClick: (e: React.MouseEvent) => handleProductSelectClick(e, 'لوله سه لایه فایبرگلاس حلقه ای') },
        { title: 'اتصالات پلیمری', href: '#', onClick: (e: React.MouseEvent) => handleProductSelectClick(e, 'اتصالات پلیمری') },
    ];
    const contactLinks = [
        { title: 'یافتن نقاط فروش روی نقشه', href: '#', onClick: handleStoreLocatorClick },
        { title: 'تماس با ما', href: '#', onClick: handleContactClick },
        { title: 'سوالات متداول', href: '#', onClick: handleFAQClick },
        { title: 'نظرسنجی', href: '#' },
        { title: 'معرفی همکار و کسب پاداش', href: '#', onClick: handleReferralClick },
        { title: 'درخواست نمایندگی', href: '#', onClick: handlePartnershipClick },
        { title: 'انتقاد و پیشنهادات', href: '#', onClick: handleFeedbackClick },
    ];
    const languages = [
        { code: 'ar', name: 'العربية' },
        { code: 'tr', name: 'Türkçe' },
    ];

  return (
    <>
    <header className="absolute top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-screen-xl z-50">
      <div className={containerClass}>
        
        {/* Left side: Logo & Desktop Nav */}
        <div className="flex items-center gap-10">
          <button onClick={handleHomeClick} className="flex items-center">
            <img src={isLight ? "/logo2.png" : "/logo.png"} alt="کویر بسپار" className="h-10 w-auto" />
          </button>
          <nav className="hidden lg:flex items-center gap-6">
            <DesktopNavItem onClick={handleHomeClick} className={textClass}>صفحه اصلی</DesktopNavItem>
            <DesktopDropdown title="شرکت" className={textClass} dropdownBgClass={dropdownBgClass} itemClass={dropdownItemClass}>
                {companyLinks.map(link => <DesktopDropdownItem key={link.title} href={link.href} onClick={link.onClick}>{link.title}</DesktopDropdownItem>)}
            </DesktopDropdown>
            <DesktopDropdown title="محصولات" className={textClass} dropdownBgClass={dropdownBgClass} itemClass={dropdownItemClass}>
                {productLinks.map(link => <DesktopDropdownItem key={link.title} href={link.href} onClick={link.onClick}>{link.title}</DesktopDropdownItem>)}
            </DesktopDropdown>
            <DesktopDropdown title="ارتباط با ما" className={textClass} dropdownBgClass={dropdownBgClass} itemClass={dropdownItemClass}>
                {contactLinks.map(link => (
                    <DesktopDropdownItem 
                        key={link.title} 
                        href={link.href} 
                        onClick={link.onClick ? (e) => link.onClick?.(e) : undefined}
                    >
                        {link.title}
                    </DesktopDropdownItem>
                ))}
            </DesktopDropdown>
            <DesktopNavItem onClick={(e) => handleStoreLocatorClick(e!)} className={textClass}>یافتن نقاط فروش</DesktopNavItem>
            <DesktopNavItem className={textClass}>فرم استخدام</DesktopNavItem>
            <a href="#" className={textClass || "flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-base font-semibold"}>پنل مجریان</a>
          </nav>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
                <DesktopDropdown title="FA" className={textClass} dropdownBgClass={dropdownBgClass} itemClass={dropdownItemClass}>
                    {languages.map(lang => <DesktopDropdownItem key={lang.code}>{lang.name}</DesktopDropdownItem>)}
                </DesktopDropdown>
                <div className="relative">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={iconButtonClass}>
                        <SearchIcon className={`h-5 w-5 ${iconColorClass}`} />
                    </button>
                    {isSearchOpen && (
                        <div className="absolute top-full right-0 mt-3 w-64 p-2 z-50">
                            <form>
                                <input
                                    type="search"
                                    placeholder="جستجو..."
                                    className={`w-full backdrop-blur-xl rounded-full px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition ${isLight ? 'bg-white shadow-lg border border-gray-200 text-gray-800 focus:ring-brand/20' : 'bg-white/10 text-white focus:ring-white/50'}`}
                                    autoFocus
                                />
                            </form>
                        </div>
                    )}
                </div>
            </div>
             <button onClick={onNavigateToLogin} className={dashboardBtnClass}>
                داشبورد مشتریان
            </button>
            <button onClick={onNavigateToPartnership} className={agencyBtnClass}>
                درخواست نمایندگی
                <ArrowRightIcon />
            </button>
            <button className={`lg:hidden ${iconButtonClass}`} onClick={openMobileMenu}>
                <MenuIcon className={`h-6 w-6 ${iconColorClass}`} />
            </button>
        </div>
      </div>
    </header>

    {/* Mobile Menu */}
    <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMobileMenu}></div>
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col border-l border-white/10 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                <img src="/logo2.png" alt="کویر بسپار" className="h-8 w-auto relative z-10 drop-shadow-md" />
                <button onClick={closeMobileMenu} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 active:scale-90 transition-all relative z-10 border border-white/10">
                    <CloseIcon />
                </button>
            </div>

            {/* Mobile Search */}
            <div className="p-5 pb-2">
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="search"
                        placeholder="جستجو در محصولات..."
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-4 pr-11 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light transition-all shadow-inner"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                </form>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-grow overflow-y-auto px-4 py-2 custom-scrollbar">
                <div className="space-y-1">
                    <MobileNavItem title="صفحه اصلی" icon={<Home size={20} />} onClick={handleHomeClick} />
                    <MobileNavItem title="محصولات" icon={<Package size={20} />}>
                        {productLinks.map(link => <MobileDropdownItem key={link.title} href={link.href} onClick={link.onClick}>{link.title}</MobileDropdownItem>)}
                    </MobileNavItem>
                    <MobileNavItem title="نقاط فروش روی نقشه" icon={<MapPin size={20} />} onClick={(e) => handleStoreLocatorClick(e as any)} />
                    <MobileNavItem title="درخواست نمایندگی" icon={<Handshake size={20} />} onClick={() => { if (onNavigateToPartnership) onNavigateToPartnership(); closeMobileMenu(); }} />
                    <MobileNavItem title="معرفی همکار" icon={<Users size={20} />} onClick={() => { if (onNavigateToReferral) onNavigateToReferral(); closeMobileMenu(); }} />
                    <MobileNavItem title="درباره ما" icon={<Building2 size={20} />} onClick={() => { if (onNavigateToAbout) onNavigateToAbout(); closeMobileMenu(); }} />
                    <MobileNavItem title="تماس با ما" icon={<Mail size={20} />} onClick={() => { if (onNavigateToContact) onNavigateToContact(); closeMobileMenu(); }} />
                </div>
            </nav>

            {/* Mobile Footer Actions */}
            <div className="p-5 border-t border-white/10 bg-slate-950/50 space-y-5">
                <div className="flex items-center justify-between text-slate-200" dir="ltr">
                    <div className="flex items-center gap-3 group/phone">
                        <div className="w-11 h-11 bg-brand/20 rounded-full flex items-center justify-center border border-brand/30 shadow-inner group-hover/phone:bg-brand/30 transition-colors">
                            <Phone className="w-5 h-5 text-brand-light" />
                        </div>
                        <span className="font-bold text-lg tracking-wider text-white drop-shadow-sm">021-34533158</span>
                    </div>
                    
                    {/* Language Dropdown Mobile */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                            className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors shadow-sm"
                        >
                            <GlobeIcon />
                            <span className="font-bold">FA</span>
                            <div className={`transition-transform duration-300 ${isMobileLangOpen ? 'rotate-180' : ''}`}>
                                <ChevronDownIcon />
                            </div>
                        </button>
                        
                        {/* Simple inline dropdown for languages */}
                        <div className={`absolute bottom-full right-0 mb-2 w-full bg-slate-800 border border-white/10 rounded-lg overflow-hidden transition-all duration-200 origin-bottom shadow-xl ${isMobileLangOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            {languages.map(lang => (
                                <button 
                                    key={lang.code}
                                    className="w-full text-right px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                                    onClick={() => setIsMobileLangOpen(false)}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={(e) => { onNavigateToLogin(); closeMobileMenu(); }} className="flex items-center justify-center gap-2 bg-brand text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:bg-brand-light active:scale-95 transition-all text-sm border border-brand/50">
                        <User size={18} />
                        ورود کاربر
                    </button>
                    <button onClick={handlePartnershipClick} className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 py-3.5 rounded-xl font-bold hover:bg-white/20 active:scale-95 transition-all text-sm shadow-sm hover:shadow-md">
                        <Handshake size={18} />
                        نمایندگی
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default Header;
