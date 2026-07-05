import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './Header';
import Footer from './Footer';
import { 
  Users, 
  Phone, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Gift, 
  Briefcase, 
  ShieldCheck, 
  History, 
  Lock, 
  Unlock,
  Info,
  BadgeAlert,
  Send,
  TrendingUp,
  Award
} from 'lucide-react';

interface ColleagueReferralProps {
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
  customer?: any; // If logged in
  referrals: any[];
  onAddReferral: (referralData: any) => void;
  isDashboardMode?: boolean;
  marketingSettings?: any;
}

const ColleagueReferral: React.FC<ColleagueReferralProps> = ({
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
  customer,
  referrals,
  onAddReferral,
  isDashboardMode = false,
  marketingSettings
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [colleagueName, setColleagueName] = useState('');
  const [colleaguePhone, setColleaguePhone] = useState('');
  const [colleagueAddress, setColleagueAddress] = useState('');
  const [colleagueType, setColleagueType] = useState('فروشگاه لوله و اتصالات (خرده‌فروش)');
  
  // Referrer Info (if not logged in)
  const [referrerName, setReferrerName] = useState(customer ? customer.name : '');
  const [referrerPhone, setReferrerPhone] = useState(customer ? customer.phone || '' : '');
  const [referrerCompany, setReferrerCompany] = useState(customer ? customer.company || '' : '');
  const [isReferrerUnlocked, setIsReferrerUnlocked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter referrals submitted by this user (by ID or Phone matching)
  const myReferrals = referrals.filter(ref => {
    if (customer) {
      return ref.referrerId === customer.id || ref.referrerPhone === customer.phone || ref.referrerName === customer.name;
    }
    // For guests, check matching with the input phone state
    return referrerPhone && ref.referrerPhone === referrerPhone;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!colleagueName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی همکار را وارد کنید.');
      return;
    }
    if (!colleaguePhone.trim() || colleaguePhone.length < 10) {
      setErrorMessage('لطفاً شماره تماس معتبر برای همکار وارد کنید.');
      return;
    }
    if (!colleagueAddress.trim()) {
      setErrorMessage('لطفاً آدرس یا محدوده فعالیت همکار را وارد کنید.');
      return;
    }
    if (!customer && (!referrerName.trim() || !referrerPhone.trim())) {
      setErrorMessage('لطفاً مشخصات خود به عنوان معرف را کامل ثبت نمایید.');
      return;
    }

    setIsSubmitting(true);

    const shamsiDateStr = new Date().toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    setTimeout(() => {
      onAddReferral({
        id: `REF-${Math.floor(Math.random() * 9000) + 1000}`,
        referrerId: customer ? customer.id : null,
        referrerName: customer ? (isReferrerUnlocked ? (referrerName || customer.name) : customer.name) : referrerName,
        referrerPhone: customer ? customer.phone : referrerPhone,
        referrerCompany: customer ? customer.company : referrerCompany,
        colleagueName,
        colleaguePhone,
        colleagueAddress,
        colleagueType,
        date: shamsiDateStr,
        status: 'در انتظار بررسی',
        rewardStatus: 'بدون پاداش',
        rewardDetail: ''
      });

      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Clear colleague fields
      setColleagueName('');
      setColleaguePhone('');
      setColleagueAddress('');
      setColleagueType('فروشگاه لوله و اتصالات (خرده‌فروش)');
    }, 1200);
  };

  return (
    <div className={`bg-slate-50 flex flex-col ${isDashboardMode ? 'min-h-0' : 'min-h-screen'}`} dir="rtl">
      {/* Top Header */}
      {!isDashboardMode && (
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
      )}

      {/* Main Container */}
      <div className={`${isDashboardMode ? 'pt-4' : 'pt-28'} pb-8 bg-white border-b border-slate-100 px-4 md:px-8 rounded-3xl shadow-sm`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {!isDashboardMode && (
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={onBack}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand transition-colors bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                بازگشت
              </button>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs text-slate-500 font-bold">طرح معرفی همکاران</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight flex items-center gap-2.5">
                <Users className="w-8 h-8 text-blue-600" />
                طرح ویژه معرفی همکاران و شرکای تجاری
              </h1>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                شبکه تاسیساتی بسپار را گسترش دهید و به ازای خریدهای همکاران معرفی‌شده، از واریز مستقیم پورسانت مالی و افزایش تراز بستانکاری در حسابداری خود بهره‌مند شوید.
              </p>
            </div>
            
            {/* Tab switch buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start md:self-center">
              <button
                onClick={() => setActiveTab('submit')}
                className={`py-2 px-5 text-xs md:text-sm font-bold transition-all rounded-xl cursor-pointer ${activeTab === 'submit' ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-800'}`}
              >
                ثبت معرفی جدید
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-5 text-xs md:text-sm font-bold transition-all rounded-xl cursor-pointer flex items-center gap-1.5 ${activeTab === 'history' ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <History className="w-3.5 h-3.5" />
                سوابق معرفی شما
                {myReferrals.length > 0 && (
                  <span className="bg-brand text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                    {myReferrals.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'submit' ? (
            <motion.div 
              key="submit-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Marketing Promotion (4 cols on desktop) */}
              <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-7 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg shadow-yellow-500/20">
                      <Gift className="w-7 h-7 text-white" />
                    </div>
                    <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-emerald-300">
                      طرح برد-برد
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[22px] font-black text-white leading-snug">چرا همکاران خود را معرفی کنیم؟</h3>
                    <p className="text-xs text-indigo-100 leading-relaxed font-semibold">
                      با دعوت از دوستانتان، هم شبکه حرفه‌ای خود را رشد می‌دهید و هم از مزایای بینظیر و تضمینی باشگاه مشتریان بهرهمند خواهید شد.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex gap-3 items-start bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-bl from-emerald-400 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 mt-0.5">
                        <p className="text-sm font-black text-white">بستانکاری و درآمد مستمر</p>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          با مشارکت در گسترش شبکه متخصصین، بخشی از ارزش معاملات همکاران به صورت خودکار به اعتبار و تراز مالی شما افزوده خواهد شد.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-bl from-amber-400 to-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 mt-0.5 w-full">
                        <p className="text-sm font-black text-white">دریافت امتیازات صعودی باشگاه</p>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          با معرفی هر همکار، امتیاز شما در باشگاه مشتریان به صورت تصاعدی بالا می‌رود:
                        </p>
                        {marketingSettings?.referralPointSteps?.length > 0 && (
                          <div className="mt-2 grid gap-1.5 w-full">
                            {marketingSettings.referralPointSteps.map((step: any, index: number) => (
                              <div key={index} className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/10 text-[10px]">
                                <span className="font-medium text-slate-300">معرفی {step.step}م</span>
                                <span className="font-black text-amber-400">+{step.points} امتیاز</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 items-start bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-bl from-purple-400 to-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 mt-0.5">
                        <p className="text-sm font-black text-white">شروع قدرتمند برای همکاران</p>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          ما هوای اعتبار شما را داریم؛ همکار معرفی‌شده‌ی شما در اولین همراهی خود پیشنهاد ویژه‌ای دریافت می‌کند تا با قدرت کسب‌وکارش را شروع کند.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Badge Info */}
              <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 flex gap-3 text-slate-600">
                <ShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-800">حفظ حریم خصوصی شما</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    همکار معرفی‌شده به هیچ‌وجه از مبلغ بستانکاری شما یا جزئیات حساب‌تان مطلع نخواهد شد. تمامی سوابق در محیطی ۱۰۰٪ محرمانه ثبت می‌گردد.
                  </p>
                </div>
              </div>
            </div>

              {/* Invitation Form (7 cols on desktop) */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
                  {showSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8 space-y-5"
                    >
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-slate-900">معرفی همکار با موفقیت ثبت شد</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                          اطلاعات همکار مجدانه ثبت گردید. کارشناسان ما به زودی با ایشان با احترام تماس خواهند گرفت. پس از تایید نهایی قرارداد، پاداش ویژه شما فعال خواهد شد.
                        </p>
                      </div>

                      <div className="flex gap-3 justify-center pt-4">
                        <button
                          onClick={() => {
                            setShowSuccess(false);
                            setActiveTab('history');
                          }}
                          className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          مشاهده سوابق و وضعیت بررسی
                        </button>
                        <button
                          onClick={() => {
                            setShowSuccess(false);
                          }}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          معرفی همکار دیگر
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-4.5 h-4.5 text-blue-500" />
                          اطلاعات همکار معرفی‌شده جهت مشاوره بسپار
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">لطفا نام و شماره معتبر همکارتان را ثبت کنید تا در اولویت تماس قرار گیرد.</p>
                      </div>

                      {errorMessage && (
                        <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                          <BadgeAlert className="w-4 h-4 flex-shrink-0" />
                          {errorMessage}
                        </div>
                      )}

                      {/* Colleague Input Rows */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">نام و نام خانوادگی همکار</label>
                            <div className="relative">
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Users className="w-4 h-4" />
                              </span>
                              <input 
                                type="text"
                                value={colleagueName}
                                onChange={(e) => setColleagueName(e.target.value)}
                                placeholder="مثال: مهندس حسینی"
                                className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white transition"
                              />
                            </div>
                          </div>
                          
                          {/* Phase 1: Referrer Name (اسم معرف زیر نام و نام خانوادگی همکار بزار) */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">نام شما (معرف)</label>
                            {customer && !isReferrerUnlocked ? (
                                <div className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{referrerName || customer.name}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsReferrerUnlocked(true)}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-extrabold cursor-pointer border border-blue-200 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                                    >
                                        <Unlock className="w-3 h-3" />
                                        ویرایش نام معرف
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Users className="w-4 h-4" />
                                  </span>
                                  <input 
                                    type="text"
                                    value={referrerName || (customer ? customer.name : '')}
                                    onChange={(e) => setReferrerName(e.target.value)}
                                    placeholder="مثال: رضا کریمی"
                                    className="w-full pr-10 pl-24 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white transition"
                                  />
                                  {customer && (
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        setIsReferrerUnlocked(false);
                                        setReferrerName(customer.name);
                                      }}
                                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-700 cursor-pointer bg-slate-200/85 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-300 transition-colors flex items-center gap-1 font-bold"
                                    >
                                        <Lock className="w-3 h-3 text-slate-600" />
                                        قفل مجدد
                                    </button>
                                  )}
                                </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">شماره تلفن همراه همکار</label>
                            <div className="relative">
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Phone className="w-4 h-4" />
                              </span>
                              <input 
                                type="tel"
                                value={colleaguePhone}
                                onChange={(e) => setColleaguePhone(e.target.value)}
                                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                className="w-full pr-10 pl-4 py-3 text-right rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white transition font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700">حوزه تخصصی و نوع فعالیت همکار</label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <Briefcase className="w-4 h-4" />
                            </span>
                            <select 
                              value={colleagueType}
                              onChange={(e) => setColleagueType(e.target.value)}
                              className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white transition appearance-none"
                            >
                              <option value="فروشگاه لوله و اتصالات (خرده‌فروش)">فروشگاه لوله و اتصالات (خرده‌فروش)</option>
                              <option value="پخش‌کننده عمده تاسیساتی منطقه">پخش‌کننده عمده تاسیساتی منطقه</option>
                              <option value="مهندس ناظر یا پیمانکار پروژه">مهندس ناظر یا پیمانکار پروژه</option>
                              <option value="انبوه ساز مسکن و ویلا">انبوه ساز مسکن و ویلا</option>
                              <option value="عامل تاسیساتی دیگر">عامل تاسیساتی دیگر</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5 col-span-1">
                          <label className="text-xs font-black text-slate-700">محدوده فعالیت یا آدرس پستی</label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-10 text-slate-400">
                              <MapPin className="w-4 h-4" />
                            </span>
                            <textarea 
                              rows={1}
                              value={colleagueAddress}
                              onChange={(e) => setColleagueAddress(e.target.value)}
                              placeholder="مثال: تبریز، شهرک باغمیشه، صدف ۴، دفتر مهندسی"
                              className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Referrer Section - locked if customer is logged in */}
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-emerald-600" />
                            مشخصات معرف (شما) جهت پیوند پاداش
                          </h4>
                          {customer && (
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                              وارد شده به پنل
                            </span>
                          )}
                        </div>

                        {customer ? (
                          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                            <div>
                              <span className="text-slate-400 font-medium block text-[10px] mb-0.5">تلفن همراه معرف:</span>
                              <span className="text-slate-900 font-mono">{customer.phone || '-'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium block text-[10px] mb-0.5">فروشگاه / مجموعه معرف:</span>
                              <span className="text-slate-900 truncate block">{customer.company || 'شخصی'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">شماره تلفن همراه شما</label>
                              <input 
                                type="tel"
                                value={referrerPhone}
                                onChange={(e) => setReferrerPhone(e.target.value)}
                                placeholder="۰۹۱۲XXXXXXX"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold bg-white text-slate-800 text-right font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">نام فروشگاه شما (اختیاری)</label>
                              <input 
                                type="text"
                                value={referrerCompany}
                                onChange={(e) => setReferrerCompany(e.target.value)}
                                placeholder="فروشگاه تاسیسات کریمی"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold bg-white text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-brand hover:bg-brand-dark hover:scale-[1.01] text-white font-extrabold text-sm rounded-3xl transition duration-300 shadow-lg shadow-brand/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            در حال ثبت اطلاعات...
                          </>
                        ) : (
                          <>
                            <Send className="w-4.5 h-4.5" />
                            ارسال معرفی‌نامه صنفی همکار
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800">تاریخچه همکاران معرفی‌شده شما</h3>
                    <p className="text-[11px] text-slate-400">آخرین وضعیت همکاری، مذاکرات و پورسانت‌های نقدی (بستانکاری) منظور شده برای شما</p>
                  </div>
                  <div className="text-slate-400 font-mono text-xs font-bold">
                    تعداد کل معرفی‌ها: {myReferrals.length}
                  </div>
                </div>

                {!customer && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800 mb-4">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-black">توجه: شما وارد پنل کاربری خود نشده‌اید</p>
                      <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                        هم‌اکنون سوابق بالا بر اساس شماره تلفن همراه معرفی شده شما نمایش داده می‌شود. برای مدیریت مطمئن‌تر، دریافت نوتیفیکیشن‌ها و تخصیص مستقیم پورسانت مالی به تراز حساب، توصیه می‌کنیم ابتدا از بالای صفحه وارد شوید.
                      </p>
                    </div>
                  </div>
                )}

                {myReferrals.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">هیچ معرفی ثبت نشده است</h4>
                      <p className="text-xs text-slate-500 font-medium">اولین دوست یا همکار فنی خود را معرفی کنید و هدیه باارزش بگیرید!</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('submit')}
                      className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
                    >
                      ثبت اولین همکار
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myReferrals.map((ref) => (
                      <div 
                        key={ref.id}
                        className="p-5 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-100 transition-all duration-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                      >
                        {/* Name & Title */}
                        <div className="md:col-span-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-sm font-black text-slate-900">{ref.colleagueName}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold">
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {ref.colleagueType}</span>
                            <span className="text-mono font-medium">{ref.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold truncate max-w-xs">{ref.colleagueAddress}</p>
                        </div>

                        {/* Colleague Mobile */}
                        <div className="md:col-span-3 text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-slate-200/60 shadow-sm text-xs text-slate-600 font-semibold font-mono">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {ref.colleaguePhone}
                          </div>
                        </div>

                        {/* Current Process Status & Rewards */}
                        <div className="md:col-span-3">
                          <div className="space-y-1">
                            {ref.status === 'در انتظار بررسی' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-amber-700 bg-amber-50 rounded-full border border-amber-100">
                                <span>در انتظار بررسی تلفنی</span>
                              </span>
                            )}
                            {ref.status === 'در حال گفتگو' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-blue-700 bg-blue-50 rounded-full border border-blue-100 animate-pulse">
                                <span>در حال مذاکره تیمی</span>
                              </span>
                            )}
                            {ref.status === 'تایید شده (عقد قرارداد)' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                                <span>تایید شده (ثبت نماینده)</span>
                              </span>
                            )}
                            {ref.status === 'رد شده' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black text-rose-700 bg-rose-50 rounded-full border border-rose-100">
                                <span>غیرقابل تایید / عدم توافق</span>
                              </span>
                            )}

                            {/* Applied Reward Note */}
                            {ref.status === 'تایید شده (عقد قرارداد)' && (
                              <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-extrabold mt-1">
                                <Gift className="w-3 h-3 text-indigo-500" />
                                <span>پاداش: {ref.rewardDetail || 'واریز مستقیم پورسانت به تراز مالی'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ID Code badge */}
                        <div className="md:col-span-2 text-left">
                          <span className="font-mono text-[9px] font-bold text-slate-400 block mb-1">کد پیگیری:</span>
                          <span className="font-mono bg-slate-200/60 font-bold px-2.5 py-1 text-[10px] rounded text-slate-600">{ref.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      {!isDashboardMode && (
        <Footer 
          onNavigateHome={onNavigateHome}
          onNavigateToAbout={onNavigateToAbout}
          onNavigateToGoals={onNavigateToGoals}
          onNavigateToArticles={onNavigateToArticles}
          onNavigateToContact={onNavigateToContact}
          onNavigateToFAQ={onNavigateToFAQ}
          onNavigateToFeedback={onNavigateToFeedback}
          onNavigateToPartnership={onNavigateToPartnership}
          onNavigateToAdminDashboard={onNavigateToFAQ}
          onProductSelect={(prod) => onProductSelect({ title: prod.title, imageUrl: prod.imageUrl })}
        />
      )}
    </div>
  );
};

export default ColleagueReferral;
