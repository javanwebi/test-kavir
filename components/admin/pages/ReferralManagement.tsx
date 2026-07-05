import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  MapPin, 
  Check, 
  X, 
  Clock, 
  Gift, 
  Search, 
  MessageSquare, 
  Filter, 
  ArrowLeft,
  Building2,
  CheckCircle2,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReferralManagementProps {
  referrals: any[];
  setReferrals: React.Dispatch<React.SetStateAction<any[]>>;
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  announcements: any[];
  setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  marketingSettings?: any;
  setMarketingSettings?: React.Dispatch<React.SetStateAction<any>>;
}

const ReferralManagement: React.FC<ReferralManagementProps> = ({
  referrals,
  setReferrals,
  customers,
  setCustomers,
  announcements,
  setAnnouncements,
  marketingSettings,
  setMarketingSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // States for handling approval dialog
  const [approvingReferral, setApprovingReferral] = useState<any | null>(null);
  const [commissionPercent, setCommissionPercent] = useState<number>(2);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [customMessage, setCustomMessage] = useState<string>('');

  // Status transitions
  const updateStatus = (referralId: string, newStatus: string) => {
    setReferrals(prev => prev.map(ref => {
      if (ref.id === referralId) {
        return { ...ref, status: newStatus };
      }
      return ref;
    }));
  };

  const handleStartApproval = (ref: any) => {
    setApprovingReferral(ref);
    // Set a sensible, professional preset message for the client
    setCustomMessage(`همکار گرامی، با سلام. همکار گرامی شما (جناب آقای / ${ref.colleagueName}) پس از بررسی کارشناسان موفق به دریافت عاملیت رسمی ما گردید.\n\nبه پاس قدردانی از معرف و راهنمایی هوشمندانه شما، مقدار ${commissionPercent}٪ از مبالغ خرید ایشان به مدت ${durationMonths} ماه به عنوان پورسانت (بستانکاری) در حساب مالی شما لحاظ خواهد شد.\nمحرمانه ماندن تعامل با شما در سیستم حفظ شده است.`);
  };

  // When changing discount or months, keep custom message updated
  const handlePercentChange = (val: number) => {
    setCommissionPercent(val);
    if (approvingReferral) {
      setCustomMessage(`همکار گرامی، با سلام. همکار گرامی شما (جناب آقای / ${approvingReferral.colleagueName}) پس از بررسی کارشناسان موفق به دریافت عاملیت رسمی ما گردید.\n\nبه پاس قدردانی از معرف و راهنمایی هوشمندانه شما، مقدار ${val}٪ از مبالغ خرید ایشان به مدت ${durationMonths} ماه به عنوان پورسانت (بستانکاری) در حساب مالی شما لحاظ خواهد شد.\nمحرمانه ماندن تعامل با شما در سیستم حفظ شده است.`);
    }
  };

  const handleMonthsChange = (val: number) => {
    setDurationMonths(val);
    if (approvingReferral) {
      setCustomMessage(`همکار گرامی، با سلام. همکار گرامی شما (جناب آقای / ${approvingReferral.colleagueName}) پس از بررسی کارشناسان موفق به دریافت عاملیت رسمی ما گردید.\n\nبه پاس قدردانی از معرف و راهنمایی هوشمندانه شما، مقدار ${commissionPercent}٪ از مبالغ خرید ایشان به مدت ${val} ماه به عنوان پورسانت (بستانکاری) در حساب مالی شما لحاظ خواهد شد.\nمحرمانه ماندن تعامل با شما در سیستم حفظ شده است.`);
    }
  };

  const handleFinalizeApproval = () => {
    if (!approvingReferral) return;

    // 1. Update referral detail and status
    const rewardText = `پورسانت ${commissionPercent}٪ از خریدهای جدید به عنوان بستانکاری به مدت ${durationMonths} ماه (دعوت همکار)`;
    setReferrals(prev => prev.map(ref => {
      if (ref.id === approvingReferral.id) {
        return { 
          ...ref, 
          status: 'تایید شده (عقد قرارداد)',
          rewardStatus: 'فعال شده',
          rewardDetail: rewardText
        };
      }
      return ref;
    }));

    // 2. We no longer add the commissionPercent to the referring customer's discount rate. 
    // It remains separate to only issue accounting credits later upon purchases.
    if (approvingReferral.referrerPhone || approvingReferral.referrerName) {
      setCustomers(prevCustomers => prevCustomers.map(cust => {
        // Find them to ensure they exist or optionally tag them, but do NO discount modification!
        return cust;
      }));
    }

    // 3. Create a personalized Announcement/Message for the referring customer!
    const timestampStr = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const currentMaxId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) : 0;
    
    // Find the actual customer object if possible
    const targetCust = customers.find(c => 
      (approvingReferral.referrerPhone && c.phone === approvingReferral.referrerPhone) || 
      (approvingReferral.referrerId && c.id === approvingReferral.referrerId) || 
      (approvingReferral.referrerName && c.name === approvingReferral.referrerName)
    );

    const newAnnouncement = {
      id: currentMaxId + 1,
      title: '🎁 پاداش پورسانت معرفی همکار فعال گردید!',
      content: customMessage || `با سلام. به پاس معرفی همکار گرامی جناب آقای ${approvingReferral.colleagueName}، پاداش پورسانت ${commissionPercent}٪ از خریدهای ایشان به مدت ${durationMonths} ماه به عنوان بستانکاری بر روی حساب کاربری شما فعال شد.`,
      type: 'specific',
      customerId: targetCust ? targetCust.id : (approvingReferral.referrerId || 1),
      timestamp: timestampStr,
      isRead: false
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);

    // Close Modal/Form
    setApprovingReferral(null);
  };

  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = 
      ref.colleagueName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ref.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ref.colleaguePhone.includes(searchQuery);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && ref.status === statusFilter;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">مدیریت معرفی همکاران (Referral Control)</h1>
          <p className="text-xs text-slate-500 font-medium">مشاهده همکاران ارجاع شده، تعیین قرار مذاکره، تخصیص تخفیف و جوایز مخفی به معرفین محترم</p>
        </div>
        
        {/* Quick statistics */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-center">
            <span className="block text-[10px] text-slate-400 font-bold">کل معرفی‌ها</span>
            <span className="text-base font-black text-slate-900 font-sans">{referrals.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-center">
            <span className="block text-[10px] text-amber-500 font-bold">در انتظار بررسی</span>
            <span className="text-base font-black text-amber-600 font-sans">
              {referrals.filter(r => r.status === 'در انتظار بررسی').length}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-center">
            <span className="block text-[10px] text-emerald-500 font-bold">قراردادهای موفق</span>
            <span className="text-base font-black text-emerald-600 font-sans">
              {referrals.filter(r => r.status === 'تایید شده (عقد قرارداد)').length}
            </span>
          </div>
        </div>
      </div>

      {/* Referral Points Settings Panel */}
      {marketingSettings && setMarketingSettings && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-500" />
              تنظیمات امتیازات باشگاه مشتریان برای معرفی همکار
            </h3>
            <p className="text-xs text-slate-500 mt-1">تعداد امتیاز باشگاه مشتریان که به معرف بابت معرفی نفر اول، دوم و ... تعلق می‌گیرد را تعریف کنید.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
             {marketingSettings.referralPointSteps?.map((stepData: any, idx: number) => (
               <div key={idx} className="flex flex-col gap-1.5 p-3 bg-white border border-slate-200 rounded-xl w-32 relative">
                  <label className="text-[10px] font-bold text-slate-500">معرفی {stepData.step}م</label>
                  <input
                    type="number"
                    value={stepData.points}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const newSteps = [...marketingSettings.referralPointSteps];
                      newSteps[idx].points = val;
                      setMarketingSettings({ ...marketingSettings, referralPointSteps: newSteps });
                    }}
                    className="w-full text-sm font-black text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                  />
                  <button 
                    onClick={() => {
                        const newSteps = marketingSettings.referralPointSteps.filter((_, i) => i !== idx);
                        // Re-adjust steps to be sequential
                        newSteps.forEach((s: any, i: number) => s.step = i + 1);
                        setMarketingSettings({ ...marketingSettings, referralPointSteps: newSteps });
                    }}
                    className="absolute -top-2 -left-2 bg-rose-100 text-rose-600 rounded-full p-1 cursor-pointer hover:bg-rose-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
               </div>
             ))}
             
             <button 
                onClick={() => {
                   const steps = marketingSettings.referralPointSteps || [];
                   const nextStep = steps.length + 1;
                   // Default new points dynamically larger
                   const nextPoints = steps.length > 0 ? steps[steps.length - 1].points + 50 : 50;
                   setMarketingSettings({
                       ...marketingSettings,
                       referralPointSteps: [...steps, { step: nextStep, points: nextPoints }]
                   });
                }}
                className="h-[64px] px-4 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 border-dashed rounded-xl cursor-pointer transition text-xs font-bold"
             >
                 <Check className="w-4 h-4" /> افزودن گام بعدی
             </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            همه موارد
          </button>
          <button 
            onClick={() => setStatusFilter('در انتظار بررسی')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'در انتظار بررسی' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            در انتظار بررسی
          </button>
          <button 
            onClick={() => setStatusFilter('در حال گفتگو')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'در حال گفتگو' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            در حال گفتگو
          </button>
          <button 
            onClick={() => setStatusFilter('تایید شده (عقد قرارداد)')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'تایید شده (عقد قرارداد)' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            تایید شده (عقد قرارداد)
          </button>
          <button 
            onClick={() => setStatusFilter('رد شده')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'رد شده' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            رد شده
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام همکار یا معرف..."
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-semibold bg-slate-50"
          />
        </div>
      </div>

      {/* Referrals Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReferrals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">هیچ درخواستی پیدا نشد</h3>
            <p className="text-xs text-slate-500 mt-1">گزینه‌های جستجو یا فیلتر بالا را تغییر دهید.</p>
          </div>
        ) : (
          filteredReferrals.map((ref) => (
            <div 
              key={ref.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col md:flex-row justify-between"
            >
              {/* Main Info */}
              <div className="p-6 flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colleague Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5d87ff]"></span>
                    <h3 className="text-base font-black text-slate-900">مشخصات همکار معرفی‌شده</h3>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3.5 border border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold mb-0.5">نام همکار:</span>
                        <span className="text-xs font-black text-slate-800">{ref.colleagueName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold mb-0.5">تلفن همکار:</span>
                        <span className="text-xs font-black text-slate-800 font-mono text-left block" dir="ltr">{ref.colleaguePhone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-2.5">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold mb-0.5">صنف فعالیت:</span>
                        <span className="text-xs font-black text-slate-700">{ref.colleagueType}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold mb-0.5">تاریخ ثبت:</span>
                        <span className="text-xs font-bold text-slate-600 font-mono">{ref.date}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/50 pt-2.5">
                      <span className="block text-[10px] text-slate-400 font-bold mb-0.5">آدرس / محدوده کار:</span>
                      <span className="text-xs font-semibold text-slate-600 flex items-start gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" /> {ref.colleagueAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Referrer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="text-base font-black text-slate-900 font-sans">مشخصات مشتری معرفی‌کننده (معرف)</h3>
                  </div>

                  <div className="bg-emerald-50/25 p-4 rounded-2xl space-y-3.5 border border-emerald-100/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-slate-450 font-bold mb-0.5">نام معرف:</span>
                        <span className="text-xs font-black text-slate-800">{ref.referrerName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-450 font-bold mb-0.5">تلفن معرف:</span>
                        <span className="text-xs font-bold text-slate-800 font-mono" dir="ltr">{ref.referrerPhone}</span>
                      </div>
                    </div>

                    <div className="border-t border-emerald-100/60 pt-2.5">
                      <span className="block text-[10px] text-slate-450 font-bold mb-0.5">فروشگاه / شرکت معرف:</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-emerald-600" /> {ref.referrerCompany || 'ثبت نشده (شخصی)'}</span>
                    </div>

                    {/* Check if user exists in the default customer list */}
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">حساب کاربری در سیستم:</span>
                      {customers.some(c => c.phone === ref.referrerPhone || c.name === ref.referrerName) ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          یافت شد (تطبیق خودکار تخفیف)
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                          ثبت‌نام نشده
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Action Zone with Current Status badge */}
              <div className="p-6 bg-slate-50/80 border-t md:border-t-0 md:border-r border-slate-100 w-full md:w-72 flex flex-col justify-between items-stretch gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">کد پیگیری: <span className="font-sans font-black">{ref.id}</span></span>
                  <div className="mb-4">
                    {ref.status === 'در انتظار بررسی' && (
                      <span className="inline-flex w-full justify-center items-center gap-1 py-1.5 text-xs font-black text-amber-700 bg-amber-100/60 border border-amber-200 rounded-xl">
                        <Clock className="w-4 h-4" />
                        <span>در انتظار بررسی تلفنی</span>
                      </span>
                    )}
                    {ref.status === 'در حال گفتگو' && (
                      <span className="inline-flex w-full justify-center items-center gap-1 py-1.5 text-xs font-black text-[#5d87ff] bg-blue-100/60 border border-blue-200 rounded-xl animate-pulse">
                        <Clock className="w-4 h-4" />
                        <span>در حال گفتگو / مذاکره</span>
                      </span>
                    )}
                    {ref.status === 'تایید شده (عقد قرارداد)' && (
                      <span className="inline-flex w-full justify-center items-center gap-1 py-1.5 text-xs font-black text-emerald-700 bg-emerald-100/60 border border-emerald-200 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تایید شده و عقد قرارداد</span>
                      </span>
                    )}
                    {ref.status === 'رد شده' && (
                      <span className="inline-flex w-full justify-center items-center gap-1 py-1.5 text-xs font-black text-red-700 bg-red-100/60 border border-red-200 rounded-xl">
                        <X className="w-4 h-4" />
                        <span>رد شده / عدم توافق</span>
                      </span>
                    )}
                  </div>
                  
                  {ref.status === 'تایید شده (عقد قرارداد)' && ref.rewardDetail && (
                    <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-150 space-y-1">
                      <span className="text-[10px] font-black text-indigo-700 flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> پورسانت اختصاص یافته:</span>
                      <p className="text-[11px] font-bold text-indigo-900 leading-snug">{ref.rewardDetail}</p>
                    </div>
                  )}
                </div>

                {/* Operations Buttons */}
                {ref.status !== 'تایید شده (عقد قرارداد)' && ref.status !== 'رد شده' && (
                  <div className="space-y-2">
                    {ref.status === 'در انتظار بررسی' && (
                      <button 
                        onClick={() => updateStatus(ref.id, 'در حال گفتگو')}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-extrabold text-xs rounded-xl hover:shadow-md transition cursor-pointer"
                      >
                        تغییر وضعیت به در حال گفتگو
                      </button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleStartApproval(ref)}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300/40 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> تایید و پاداش
                      </button>
                      <button 
                        onClick={() => updateStatus(ref.id, 'رد شده')}
                        className="py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" /> عدم تایید
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approve Colleague modal & reward engine */}
      <AnimatePresence>
        {approvingReferral && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setApprovingReferral(null)}
                className="absolute top-5 left-5 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">تسهیلات و پاداش معرفی همکار</h3>
                  <p className="text-[11px] text-slate-400">تخفیف مستقیم را تایید و پیام تشکر ویژه برای معرف ارسال نمایید.</p>
                </div>
              </div>

              {/* Informative block */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <p className="font-black">معرف: {approvingReferral.referrerName} ({approvingReferral.referrerCompany || 'شخصی'})</p>
                <p className="text-[10px] text-emerald-600 font-bold">همکار با موفقیت پیوست: {approvingReferral.colleagueName} ({approvingReferral.colleagueType})</p>
              </div>

              {/* Settings parameters */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Commission percentage parameter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">درصد پورسانت معرف (قابل تغییر):</label>
                    <div className="relative">
                      <input 
                        type="number"
                        min={1}
                        max={100}
                        value={commissionPercent}
                        onChange={(e) => handlePercentChange(parseInt(e.target.value) || 2)}
                        className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">درصد</span>
                    </div>
                  </div>

                  {/* Duration month parameter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">مدت زمان تسهیلات (ماه):</label>
                    <div className="relative">
                      <input 
                        type="number"
                        min={1}
                        max={120}
                        value={durationMonths}
                        onChange={(e) => handleMonthsChange(parseInt(e.target.value) || 6)}
                        className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ماه</span>
                    </div>
                  </div>
                </div>

                {/* Secret message content */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      متن پیام تشکر و پاداش معرف (محرمانه در سیستم):
                    </label>
                  </div>
                  <textarea 
                    rows={5}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-semibold leading-relaxed text-slate-700 bg-slate-50 focus:bg-white transition"
                    placeholder="پیام تشکر و پاداش برای معرف..."
                  />
                  <span className="text-[10px] text-slate-400 font-bold block">پس از تایید، این پیام به‌صورت مستقیم و اتوماتیک به پنل پیام‌های معرف ارسال می‌شود.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setApprovingReferral(null)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800 font-bold transition cursor-pointer rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  انصراف
                </button>
                <button
                  onClick={handleFinalizeApproval}
                  className="px-6 py-2.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-black rounded-xl transition shadow-lg shadow-emerald-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  تایید نهایی و ارسال پاداش
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferralManagement;
