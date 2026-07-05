
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PersianDatePicker from './dashboard/PersianDatePicker';
import CheckIcon from './icons/CheckIcon';

const PartnershipRequest: React.FC<{ 
    onBack: () => void; 
    onNavigateHome: () => void; 
    onNavigateToLogin: () => void; 
    onNavigateToAbout: () => void;
    onNavigateToPartnership: () => void;
    onNavigateToGoals: () => void;
    onNavigateToArticles?: () => void;
    onSubmitRequest: (data: any) => void;
    onProductSelect?: (product: any) => void;
    onNavigateToContact?: () => void;
    onNavigateToFAQ?: () => void;
    onNavigateToFeedback?: () => void;
    onNavigateToAdminDashboard?: () => void;
}> = ({ 
    onBack, 
    onNavigateHome, 
    onNavigateToLogin, 
    onNavigateToAbout, 
    onNavigateToPartnership, 
    onNavigateToGoals, 
    onNavigateToArticles, 
    onSubmitRequest, 
    onProductSelect, 
    onNavigateToContact, 
    onNavigateToFAQ, 
    onNavigateToFeedback,
    onNavigateToAdminDashboard
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        nationalId: '',
        fatherName: '',
        accountNumber: '',
        landline: '',
        mobile: '',
        storeName: '',
        storeAddress: '',
        birthDate: '',
        province: '',
        city: '',
        annualPurchase: '',
        brands: '',
        ownership: '',
        experience: '',
        workingHours: '',
        instagram: '',
    });

    const [files, setFiles] = useState<{ storefront: File | null; interior: File | null }>({
        storefront: null,
        interior: null,
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const numericFields = ['mobile', 'landline', 'accountNumber', 'experience', 'annualPurchase', 'nationalId'];
        
        if (name === 'province') {
            setFormData(prev => ({ ...prev, [name]: value, city: '' }));
        } else if (numericFields.includes(name)) {
            let numericValue = value.replace(/[^0-9]/g, '');
            if (name === 'annualPurchase') {
                numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'storefront' | 'interior') => {
        if (e.target.files?.[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let storefrontBase64 = '';
        let interiorBase64 = '';

        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

        if (files.storefront) storefrontBase64 = await toBase64(files.storefront);
        if (files.interior) interiorBase64 = await toBase64(files.interior);

        console.log('Form Submitted:', formData, files);
        onSubmitRequest({
            ...formData,
            storefrontImage: storefrontBase64,
            interiorImage: interiorBase64,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('fa-IR'),
            status: 'در انتظار بررسی'
        });
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const IRAN_PROVINCES: Record<string, string[]> = {
        "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "میانه", "اسکو"],
        "آذربایجان غربی": ["ارومیه", "خوی", "میاندوآب", "مهاباد", "سلماس"],
        "اردبیل": ["اردبیل", "پارس آباد", "مشگین شهر", "خلخال", "نمین"],
        "اصفهان": ["اصفهان", "کاشان", "خمینی شهر", "نجف آباد", "شاهین شهر"],
        "البرز": ["کرج", "ساوجبلاغ", "فردیس", "نظرآباد", "اشتهارد"],
        "ایلام": ["ایلام", "دهلران", "ایوان", "آبدانان", "دره شهر"],
        "بوشهر": ["بوشهر", "برازجان", "گناوه", "کنگان", "خورموج"],
        "تهران": ["تهران", "ری", "اسلامشهر", "شهریار", "قدس", "ملارد", "پاکدشت"],
        "چهارمحال و بختیاری": ["شهرکرد", "بروجن", "لردگان", "فارسان"],
        "خراسان جنوبی": ["بیرجند", "قائن", "طبس", "فردوس"],
        "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "کاشمر"],
        "خراسان شمالی": ["بجنورد", "شیروان", "اسفراین", "آشخانه"],
        "خوزستان": ["اهواز", "دزفول", "آبادان", "ماهشهر", "خرمشهر", "اندیمشک"],
        "زنجان": ["زنجان", "ابهر", "خرمدره", "قیدار"],
        "سمنان": ["سمنان", "شاهرود", "دامغان", "گرمسار"],
        "سیستان و بلوچستان": ["زاهدان", "زابل", "ایرانشهر", "چابهار", "سراوان"],
        "فارس": ["شیراز", "مرودشت", "جهرم", "فسا", "کازرون"],
        "قزوین": ["قزوین", "الوند", "تاکستان", "آبیک", "بویین زهرا"],
        "قم": ["قم", "قنوات", "جعفریه", "کهک", "دستجرد"],
        "کردستان": ["سنندج", "سقز", "مریوان", "بانه", "قروه"],
        "کرمان": ["کرمان", "سیرجان", "رفسنجان", "جیرفت", "بم"],
        "کرمانشاه": ["کرمانشاه", "اسلام آباد غرب", "جوانرود", "کنگاور", "سرپل ذهاب"],
        "کهگیلویه و بویراحمد": ["یاسوج", "دوگنبدان", "دهدشت", "لیکک"],
        "گلستان": ["گرگان", "گنبد کاووس", "علی آباد کتول", "بندر ترکمن"],
        "گیلان": ["رشت", "بندر انزلی", "لاهیجان", "لنگرود", "تالش"],
        "لرستان": ["خرم آباد", "بروجرد", "دورود", "الیگودرز", "کوهدشت"],
        "مازندران": ["ساری", "بابل", "آمل", "قائم شهر", "بهشهر"],
        "مرکزی": ["اراک", "ساوه", "خمین", "محلات", "دلیجان"],
        "هرمزگان": ["بندرعباس", "میناب", "قشم", "بندر لنگه", "کیش"],
        "همدان": ["همدان", "ملایر", "نهاوند", "تویسرکان", "اسدآباد"],
        "یزد": ["یزد", "میبد", "اردکان", "بافق", "مهریز"]
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
                <Header 
                    onNavigateToLogin={onNavigateToLogin} 
                    onNavigateHome={onNavigateHome} 
                    onNavigateToAbout={onNavigateToAbout}
                    onNavigateToPartnership={onNavigateToPartnership}
                    onNavigateToGoals={onNavigateToGoals}
                    onNavigateToArticles={onNavigateToArticles}
                    onProductSelect={onProductSelect}
                    onNavigateToContact={onNavigateToContact}
                    onNavigateToFAQ={onNavigateToFAQ}
                    onNavigateToFeedback={onNavigateToFeedback}
                    variant="light" 
                />
                <main className="flex-grow flex items-center justify-center p-6 pt-32 pb-20">
                    <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 text-center animate-fade-in transition-all">
                        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">درخواست شما ثبت شد</h2>
                        <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                            سپاس از اعتماد شما.<br/> اطلاعات شما با موفقیت دریافت شد و کارشناسان فروش کویر بسپار پس از بررسی اولیه در اسرع وقت با شما تماس خواهند گرفت.
                        </p>
                        <button 
                            onClick={onNavigateHome} 
                            className="w-full bg-gradient-to-r from-brand to-brand-dark text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            بازگشت به سایت
                        </button>
                    </div>
                </main>
                <Footer onNavigateToAbout={onNavigateToAbout} onNavigateToGoals={onNavigateToGoals}
                    onNavigateToArticles={onNavigateToArticles} onNavigateToPartnership={onNavigateToPartnership} />
            </div>
        );
    }

    const inputClasses = "w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand transition-all";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 mr-1";
    const requiredSpan = <span className="text-red-500 mr-1">*</span>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
            <Header 
                onNavigateToLogin={onNavigateToLogin} 
                onNavigateHome={onNavigateHome} 
                onNavigateToAbout={onNavigateToAbout}
                onNavigateToPartnership={onNavigateToPartnership}
                onNavigateToGoals={onNavigateToGoals}
                    onNavigateToArticles={onNavigateToArticles}
                onProductSelect={onProductSelect}
                onNavigateToContact={onNavigateToContact}
                onNavigateToFAQ={onNavigateToFAQ}
                onNavigateToFeedback={onNavigateToFeedback}
                variant="light" 
            />

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">درخواست اخذ نمایندگی</h1>
                    <div className="max-w-3xl mx-auto p-6 bg-blue-50 border-r-4 border-brand rounded-xl mb-6">
                        <p className="text-brand text-lg font-medium leading-relaxed">
                            چنانچه تمایل دارید که عضوی از خانواده کویر بسپار شوید لطفا کلیه آیتم‌های فرم زیر را تکمیل فرمایید تا کارشناسان فروش ما در اسرع وقت با شما تماس حاصل فرمایند.
                        </p>
                    </div>

                    <div className="flex justify-center mb-10">
                        <a 
                            href="/NEMONE.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-4 px-6 md:px-8 py-4 md:py-5 bg-white hover:bg-slate-50 border-2 border-indigo-100/80 rounded-[2rem] text-sm md:text-base font-extrabold text-indigo-700 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1 overflow-hidden w-full md:w-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <div className="relative flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm border border-indigo-100/50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div className="relative flex flex-col text-right flex-1">
                                <span className="tracking-tight">دانلود و مطالعه نمونه قراردادهای ما</span>
                                <span className="text-[11px] font-medium text-slate-500 mt-1 tracking-tight">فایل PDF - قبل از درخواست مطالعه فرمایید</span>
                            </div>
                            <div className="relative mr-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Personal Info */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-brand flex items-center justify-center text-sm">۱</span>
                                اطلاعات هویتی
                            </h3>
                            <div>
                                <label className={labelClasses}>نام و نام خانوادگی {requiredSpan}</label>
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder="مثال: علی علوی" />
                            </div>
                            <div>
                                <label className={labelClasses}>کد ملی {requiredSpan}</label>
                                <input type="text" name="nationalId" required value={formData.nationalId} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸" maxLength={10} minLength={10} pattern="[0-9]{10}" title="کد ملی باید ۱۰ رقم باشد" />
                            </div>
                            <div>
                                <label className={labelClasses}>نام پدر {requiredSpan}</label>
                                <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>تاریخ تولد</label>
                                <PersianDatePicker value={formData.birthDate} onChange={(date) => setFormData(p => ({...p, birthDate: date}))} inputClassName={inputClasses} />
                            </div>
                             <div>
                                <label className={labelClasses}>شماره حساب {requiredSpan}</label>
                                <input type="text" name="accountNumber" required value={formData.accountNumber} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} placeholder="شماره حساب فعال جهت مراودات مالی" maxLength={26} minLength={10} pattern="[0-9]{10,26}" title="شماره حساب باید بین ۱۰ تا ۲۶ رقم باشد" />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-brand flex items-center justify-center text-sm">۲</span>
                                اطلاعات تماس و مکان
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>استان {requiredSpan}</label>
                                    <select name="province" required value={formData.province} onChange={handleChange} className={inputClasses}>
                                        <option value="">انتخاب استان...</option>
                                        {Object.keys(IRAN_PROVINCES).map(prov => (
                                            <option key={prov} value={prov}>{prov}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>شهر {requiredSpan}</label>
                                    <select name="city" required value={formData.city} onChange={handleChange} className={inputClasses} disabled={!formData.province}>
                                        <option value="">انتخاب شهر...</option>
                                        {formData.province && IRAN_PROVINCES[formData.province]?.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>تلفن همراه (ضروری) {requiredSpan}</label>
                                <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} placeholder="۰۹۱۲۰۰۰۰۰۰۰" maxLength={11} minLength={11} pattern="09[0-9]{9}" title="شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد" />
                            </div>
                            <div>
                                <label className={labelClasses}>تلفن ثابت</label>
                                <input type="tel" name="landline" value={formData.landline} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} maxLength={11} minLength={11} pattern="0[0-9]{10}" title="شماره ثابت باید با ۰ شروع شود و ۱۱ رقم باشد" placeholder="02112345678" />
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-brand flex items-center justify-center text-sm">۳</span>
                                اطلاعات کسب و کار
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>نام فروشگاه {requiredSpan}</label>
                                    <input type="text" name="storeName" required value={formData.storeName} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>نوع مالکیت {requiredSpan}</label>
                                    <select name="ownership" required value={formData.ownership} onChange={handleChange} className={inputClasses}>
                                        <option value="">انتخاب کنید...</option>
                                        <option value="تملیکی">تملیکی</option>
                                        <option value="استیجاری">استیجاری</option>
                                        <option value="سایر">سایر</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>سابقه فعالیت (سال)</label>
                                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} />
                                </div>
                                <div>
                                    <label className={labelClasses}>حجم خرید سالانه (ریال)</label>
                                    <input type="text" name="annualPurchase" value={formData.annualPurchase} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} placeholder="مثال: ۵,۰۰۰,۰۰۰,۰۰۰" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>آدرس فروشگاه {requiredSpan}</label>
                                    <textarea name="storeAddress" required rows={2} value={formData.storeAddress} onChange={handleChange} className={inputClasses}></textarea>
                                </div>
                                <div>
                                    <label className={labelClasses}>برندهای موجود در فروشگاه</label>
                                    <input type="text" name="brands" value={formData.brands} onChange={handleChange} className={inputClasses} placeholder="برندهایی که در حال حاضر با آن‌ها کار می‌کنید" />
                                </div>
                                <div>
                                    <label className={labelClasses}>ساعات کاری</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">از:</span>
                                            <select 
                                                className={`${inputClasses} py-3 pl-3 pr-8 text-sm`}
                                                value={formData.workingHours.split('-')[0] || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, workingHours: `${e.target.value}-${prev.workingHours.split('-')[1] || ''}`}))}
                                            >
                                                <option value="">ساعت...</option>
                                                {Array.from({length: 24}, (_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}:00</option>)}
                                            </select>
                                        </div>
                                        <div className="relative flex-1">
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">تا:</span>
                                            <select 
                                                className={`${inputClasses} py-3 pl-3 pr-8 text-sm`}
                                                value={formData.workingHours.split('-')[1] || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, workingHours: `${prev.workingHours.split('-')[0] || ''}-${e.target.value}`}))}
                                            >
                                                <option value="">ساعت...</option>
                                                {Array.from({length: 24}, (_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}:00</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>آیدی اینستاگرام</label>
                                    <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} dir="ltr" className={`text-left ${inputClasses}`} placeholder="@username" />
                                </div>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-brand flex items-center justify-center text-sm">۴</span>
                                مدارک و تصاویر
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-brand transition-colors bg-gray-50 group">
                                    <label className="cursor-pointer block">
                                        <div className="text-brand mb-3 flex justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="block text-gray-700 font-bold mb-1">عکس سردر فروشگاه {requiredSpan}</span>
                                        <span className="text-xs text-gray-500">{files.storefront ? files.storefront.name : 'فایلی انتخاب نشده است'}</span>
                                        <input type="file" required accept="image/*" onChange={(e) => handleFileChange(e, 'storefront')} className="hidden" />
                                    </label>
                                </div>
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-brand transition-colors bg-gray-50 group">
                                    <label className="cursor-pointer block">
                                        <div className="text-brand mb-3 flex justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <span className="block text-gray-700 font-bold mb-1">عکس نمای داخلی {requiredSpan}</span>
                                        <span className="text-xs text-gray-500">{files.interior ? files.interior.name : 'فایلی انتخاب نشده است'}</span>
                                        <input type="file" required accept="image/*" onChange={(e) => handleFileChange(e, 'interior')} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 flex flex-col items-center gap-4">
                        <button 
                            type="submit" 
                            className="w-full md:w-auto md:px-20 bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-blue-100"
                        >
                            ارسال درخواست نهایی
                        </button>
                        <p className="text-sm text-gray-400">
                             با کلیک بر روی دکمه بالا، تمامی اطلاعات وارد شده جهت بررسی به واحد فروش ارسال خواهد شد.
                        </p>
                    </div>
                </form>
            </main>

            <Footer 
                onNavigateHome={onNavigateHome}
                onNavigateToAbout={onNavigateToAbout}
                onNavigateToGoals={onNavigateToGoals}
                onNavigateToArticles={onNavigateToArticles}
                onNavigateToContact={onNavigateToContact}
                onNavigateToFAQ={onNavigateToFAQ}
                onNavigateToFeedback={onNavigateToFeedback}
                onNavigateToPartnership={onNavigateToPartnership}
                onNavigateToAdminDashboard={onNavigateToAdminDashboard}
                onProductSelect={onProductSelect}
            />
        </div>
    );
};

export default PartnershipRequest;
