import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';
import TwitterIcon from './icons/TwitterIcon';
import FacebookIcon from './icons/FacebookIcon';

interface FooterProps {
    onNavigateHome?: () => void;
    onNavigateToAbout?: () => void;
    onNavigateToGoals?: () => void;
    onNavigateToArticles?: () => void;
    onNavigateToContact?: () => void;
    onNavigateToFAQ?: () => void;
    onNavigateToFeedback?: () => void;
    onNavigateToPartnership?: () => void;
    onNavigateToAdminDashboard?: () => void;
    onProductSelect?: (product: { title: string }) => void;
}

const Footer: React.FC<FooterProps> = ({ 
    onNavigateHome,
    onNavigateToAbout,
    onNavigateToGoals,
    onNavigateToArticles,
    onNavigateToContact,
    onNavigateToFAQ,
    onNavigateToFeedback,
    onNavigateToPartnership,
    onNavigateToAdminDashboard,
    onProductSelect
}) => {
    const companyLinks = [
        { label: 'درباره ما', onClick: onNavigateToAbout },
        { label: 'اهداف ما', onClick: onNavigateToGoals },
        { label: 'مقالات علمی', onClick: onNavigateToArticles },
        { label: 'تماس با ما', onClick: onNavigateToContact },
    ];

    const productLinks = [
        { label: 'لوله تک لایه پلیمری', onClick: onProductSelect ? () => onProductSelect({ title: 'لوله تک لایه پلیمری' }) : undefined },
        { label: 'لوله رولی تک لایه', onClick: onProductSelect ? () => onProductSelect({ title: 'لوله تک لایه حلقه ای' }) : undefined },
        { label: 'لوله سه لایه فایبرگلاس', onClick: onProductSelect ? () => onProductSelect({ title: 'لوله سه لایه فایبرگلاس' }) : undefined },
        { label: 'لوله رولی سه لایه فایبرگلاس', onClick: onProductSelect ? () => onProductSelect({ title: 'لوله سه لایه فایبرگلاس حلقه ای' }) : undefined },
        { label: 'اتصالات پلیمری', onClick: onProductSelect ? () => onProductSelect({ title: 'اتصالات پلیمری' }) : undefined },
    ];

    const supportLinks = [
        { label: 'سوالات متداول', onClick: onNavigateToFAQ },
        { label: 'انتقاد و پیشنهادات', onClick: onNavigateToFeedback },
        { label: 'درخواست نمایندگی', onClick: onNavigateToPartnership },
        { label: 'مدیریت مشتریان', onClick: onNavigateToAdminDashboard },
    ];

    return (
        <footer className="bg-[#0f172a] text-gray-300 border-t border-slate-900/40 relative z-20 pb-24 lg:pb-0" dir="rtl">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <button onClick={onNavigateHome} className="flex items-center gap-3 bg-transparent border-none cursor-pointer">
                            <img src="/logo.png" alt="کویر بسپار" className="h-10 w-auto" />
                            <span className="text-white font-extrabold text-xl tracking-tight">کویر بسپار</span>
                        </button>
                        <p className="text-sm leading-relaxed max-w-sm text-gray-400">
                            صنایع تولیدی کویر بسپار، پیشرو در طراحی و تولید متمایز لوله و اتصالات نوین پلیمری برای نسل‌های آینده ساختمان و صنعت.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><LinkedInIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-wider uppercase text-sm border-r-2 border-brand pr-2">شرکت</h3>
                        <ul className="mt-4 space-y-3">
                            {companyLinks.map(link => (
                                <li key={link.label}>
                                    <button 
                                        onClick={link.onClick} 
                                        className="text-sm text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-right w-full block focus:outline-none"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-wider uppercase text-sm border-r-2 border-brand pr-2">محصولات</h3>
                        <ul className="mt-4 space-y-3">
                            {productLinks.map(link => (
                                <li key={link.label}>
                                    <button 
                                        onClick={link.onClick} 
                                        className="text-sm text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-right w-full block focus:outline-none"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-wider uppercase text-sm border-r-2 border-brand pr-2">پشتیبانی و پنل</h3>
                        <ul className="mt-4 space-y-3">
                            {supportLinks.map(link => (
                                <li key={link.label}>
                                    <button 
                                        onClick={link.onClick} 
                                        className="text-sm text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-right w-full block focus:outline-none"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <p className="order-2 sm:order-2 mt-4 sm:mt-0">&copy; ۲۰۲۶ کویر بسپار. تمام حقوق محفوظ است.</p>
                    <div className="flex gap-6 order-1 sm:order-1 font-medium">
                        <a href="#" className="hover:text-gray-400 transition-colors">سیاست حفظ حریم خصوصی</a>
                        <a href="#" className="hover:text-gray-400 transition-colors">شرایط خدمات</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;