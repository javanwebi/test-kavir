import React, { useState } from 'react';
import { motion } from 'motion/react';
import Header from './Header';
import Footer from './Footer';
import { 
  ChevronLeft, 
  Layers, 
  Flame, 
  RotateCw, 
  Settings, 
  Search, 
  Info, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface ProductCategoriesProps {
  onBack: () => void;
  onNavigateHome: () => void;
  onNavigateToLogin: () => void;
  onNavigateToPartnership: () => void;
  onNavigateToAbout: () => void;
  onNavigateToGoals: () => void;
  onNavigateToArticles: () => void;
  onNavigateToContact: () => void;
  onNavigateToFAQ: () => void;
  onNavigateToFeedback: () => void;
  onProductSelect: (product: { title: string, imageUrl: string }) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  onBack,
  onNavigateHome,
  onNavigateToLogin,
  onNavigateToPartnership,
  onNavigateToAbout,
  onNavigateToGoals,
  onNavigateToArticles,
  onNavigateToContact,
  onNavigateToFAQ,
  onNavigateToFeedback,
  onProductSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'pipe' | 'fitting'>('all');

  const categories = [
    {
      id: 'single-layer',
      title: 'لوله تک لایه پلیمری',
      subtitle: 'مقاوم در برابر رسوب و افت فشار',
      description: 'لوله‌های پلی‌پروپیلن (PPR) تک لایه جهت مصارف آبرسانی سرد و گرم با طول عمر بالا و بهداشتی.',
      imageUrl: 'https://kavirbaspar.com/wp-content/uploads/2022/02/taklayeh.jpg',
      type: 'pipe',
      badge: 'پرفروش',
      color: 'from-emerald-50 to-teal-50',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      features: ['ضد جلبک و باکتری', 'افت فشار ناچیز', 'نصب فوق‌العاده سریع']
    },
    {
      id: 'fiberglass',
      title: 'لوله سه لایه فایبرگلاس',
      subtitle: 'تقویت شده با الیاف شیشه',
      description: 'نسل متمایز لوله‌های سه لایه کامپوزیت با ضریب انبساط طولی ناچیز و مقاومت دمایی بالا.',
      imageUrl: 'https://kavirbaspar.com/wp-content/uploads/2022/02/3layeh.jpg',
      type: 'pipe',
      badge: 'فناوری نوین',
      color: 'from-blue-50 to-indigo-50',
      icon: <Flame className="w-5 h-5 text-blue-600" />,
      features: ['عدم نیاز به ابزار تراش', 'تحمل دمای بالا', 'افزایش مقاومت مکانیکی']
    },
    {
      id: 'coiled-single',
      title: 'لوله تک لایه حلقه ای',
      subtitle: 'رول‌های انعطاف‌پذیر بلند',
      description: 'لوله‌های رولی (رول شده) ایده‌آل برای بهینه‌سازی مسیرها بدون نیاز به برش و اتصال مکرر.',
      imageUrl: 'https://images.unsplash.com/photo-1632766391910-3a363771b315?q=80&w=800',
      type: 'pipe',
      badge: 'اقتصادی',
      color: 'from-amber-50 to-orange-50',
      icon: <RotateCw className="w-5 h-5 text-amber-600" />,
      features: ['کاهش شدید اتصالات', 'حمل و نقل آسان', 'کاهش ضایعات لوله‌کشی']
    },
    {
      id: 'coiled-fiberglass',
      title: 'لوله سه لایه فایبرگلاس حلقه ای',
      subtitle: 'مقاومت فایبرگلاس در قالب رول',
      description: 'تلفیق نوآورانه مقاومت طولی فایبرگلاس و سهولت خارق‌العاده لوله‌های رولی جهت پروژه‌های نوین.',
      imageUrl: 'https://images.unsplash.com/photo-1599494193939-556b2789445c?q=80&w=800',
      type: 'pipe',
      badge: 'ویژه',
      color: 'from-purple-50 to-rose-50',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      features: ['انبساط ناچیز رولی', 'مناسب گرمایش از کف', 'انعطاف دوچندان با دوام بالا']
    },
    {
      id: 'polymer-fittings',
      title: 'اتصالات پلیمری',
      subtitle: 'مهندسی دقیق زوایا و انشعاب‌ها',
      description: 'بست‌ها، زانوها، بوشن‌ها و اتصالات گوناگون با پیوند آب‌بند و طراحی هماهنگ با لوله‌ها.',
      imageUrl: 'https://kavirbaspar.com/wp-content/uploads/2022/03/%D8%B2%D8%A7%D9%86%D9%88-90-%D8%AF%D8%B1%D8%AC%D9%87-1-1.jpg',
      type: 'fitting',
      badge: 'تنوع بی‌نظیر',
      color: 'from-sky-50 to-cyan-50',
      icon: <Settings className="w-5 h-5 text-sky-600" />,
      features: ['آب‌بندی ۱۰۰٪ تضمینی', 'تطبیق کامل ابعادی', 'مقاوم در برابر مواد حلال']
    }
  ];

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          category.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && category.type === selectedTab;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col" dir="rtl">
      {/* Absolute top spacer/header */}
      <Header 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateHome={onNavigateHome}
        onNavigateToPartnership={onNavigateToPartnership}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToGoals={onNavigateToGoals}
        onNavigateToArticles={onNavigateToArticles}
        onNavigateToContact={onNavigateToContact}
        onNavigateToFAQ={onNavigateToFAQ}
        onNavigateToFeedback={onNavigateToFeedback}
        onProductSelect={(prod) => onProductSelect({ title: prod.title, imageUrl: prod.imageUrl })}
      />

      {/* Hero Section of Category list */}
      <div className="pt-28 pb-12 bg-white border-b border-slate-100 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand transition-colors bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full"
            >
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              بازگشت
            </button>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-500">طبقه‌بندی کالاها</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              طبقه‌بندی محصولات کویر بسپار
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
              تولید‌کننده پیشرو انواع لوله‌های پلیمری تک‌لایه، سه لایه فایبرگلاس شاخه‌ای و رولی و اتصالات مدرن مهندسی شده با تکنولوژی روز.
            </p>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
            {/* Tab selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-2 px-5 text-sm font-bold transition-all rounded-xl cursor-pointer flex-1 sm:flex-none text-center ${selectedTab === 'all' ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-800'}`}
              >
                همه کالاها
              </button>
              <button
                onClick={() => setSelectedTab('pipe')}
                className={`py-2 px-5 text-sm font-bold transition-all rounded-xl cursor-pointer flex-1 sm:flex-none text-center ${selectedTab === 'pipe' ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-800'}`}
              >
                لوله تک لایه و سه لایه
              </button>
              <button
                onClick={() => setSelectedTab('fitting')}
                className={`py-2 px-5 text-sm font-bold transition-all rounded-xl cursor-pointer flex-1 sm:flex-none text-center ${selectedTab === 'fitting' ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-800'}`}
              >
                اتصالات
              </button>
            </div>

            {/* Micro search input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-xs font-semibold bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Section */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 pb-32">
        <div className="space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">محصولی یافت نشد</h3>
              <p className="text-xs text-slate-500 font-medium">لطفاً عبارت دیگری را جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCategories.map((cat, idx) => (
                <motion.div 
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => onProductSelect({ title: cat.title, imageUrl: cat.imageUrl })}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md hover:border-slate-200 transition-all duration-300 group relative"
                >
                  {/* Decorative Gradient Background */}
                  <div className={`absolute top-0 right-0 left-0 h-40 bg-gradient-to-b ${cat.color} opacity-30 z-0`}></div>

                  {/* Top content area */}
                  <div className="p-5 md:p-6 flex-grow relative z-10 flex gap-4">
                    {/* Icon & Details */}
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100/60">
                          {cat.icon}
                        </div>
                        <span className="text-[10px] font-black tracking-wide text-brand/80 bg-brand/5 px-2.5 py-1 rounded-full border border-brand/5">
                          {cat.badge}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-brand transition-colors leading-tight">
                          {cat.title}
                        </h3>
                        <p className="text-[11px] font-extrabold text-slate-500">
                          {cat.subtitle}
                        </p>
                      </div>

                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    {/* Image thumb */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100/80 bg-slate-50 shadow-inner flex-shrink-0 self-start">
                      <img 
                        src={cat.imageUrl} 
                        alt={cat.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Bullet features */}
                  <div className="px-5 md:px-6 py-3 bg-slate-50/50 border-t border-slate-50 flex flex-wrap gap-x-4 gap-y-1.5 z-10">
                    {cat.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-slate-600">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Action area */}
                  <div className="px-5 md:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between z-10 text-xs font-extrabold text-brand group-hover:bg-brand/5 transition duration-300">
                    <span>مشاهده جزئیات و سایزبندی کالا</span>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Styled Footer for beautiful spacing */}
      <Footer 
        onNavigateHome={onNavigateHome}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToGoals={onNavigateToGoals}
        onNavigateToArticles={onNavigateToArticles}
        onNavigateToContact={onNavigateToContact}
        onNavigateToFAQ={onNavigateToFAQ}
        onNavigateToFeedback={onNavigateToFeedback}
        onNavigateToPartnership={onNavigateToPartnership}
        onNavigateToAdminDashboard={onNavigateToFAQ} // Or appropriate fallbacks
        onProductSelect={(prod) => onProductSelect({ title: prod.title, imageUrl: prod.imageUrl })}
      />
    </div>
  );
};

export default ProductCategories;
