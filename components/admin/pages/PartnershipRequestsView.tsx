import React, { useState } from 'react';

const PartnershipRequestsView = ({ requests }: { requests: any[] }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDownload = (imgSrc: string) => {
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = 'partnership_image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintPartnership = (req: any) => {
        const printHTML = `
          <!DOCTYPE html>
          <html lang="fa" dir="rtl">
            <head>
              <meta charset="UTF-8">
              <title>فرم رسمی درخواست نمایندگی - ${req.fullName}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
              <style>
                body { 
                  font-family: 'Vazirmatn', sans-serif; 
                  background-color: #f8fafc;
                }
                @media print {
                  body { 
                    background-color: #ffffff;
                    -webkit-print-color-adjust: exact; 
                    print-color-adjust: exact; 
                  }
                  .no-print { display: none !important; }
                  .shadow-print-none { box-shadow: none !important; }
                }
              </style>
            </head>
            <body class="text-slate-800 antialiased p-4 sm:p-8">
              <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 relative overflow-hidden shadow-print-none">
                
                <!-- top colored line -->
                <div class="absolute top-0 right-0 w-full h-3 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
    
                <!-- Header -->
                <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-dashed border-slate-200 pb-8 mt-4">
                  <div class="flex items-center gap-4">
                    <img src="/logo2.png" alt="کویر بسپار" class="h-14 w-auto" />
                    <div>
                      <h1 class="font-black text-xl text-slate-900 tracking-tight">شرکت تولیدی کویر بسپار</h1>
                      <p class="text-[10px] text-slate-400 font-medium mt-1">فرم رسمی ثبت اطلاعات و ارزیابی تایید نمایندگی فعال کشوری</p>
                    </div>
                  </div>
                  <div class="space-y-1.5 text-right sm:text-left">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black">
                      <span>وضعیت درخواست:</span>
                      <span>${req.status || 'در انتظار تایید'}</span>
                    </div>
                    <h2 class="text-xs font-black text-slate-500 mt-1">تاریخ ثبت درخواست: <span class="font-mono text-indigo-600">${req.date || '-'}</span></h2>
                  </div>
                </header>
    
                <!-- Information Grid -->
                <h3 class="text-sm font-black text-indigo-600 mb-4 mt-8 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">۱. اطلاعات شناسنامه‌ای و فردی متقاضی</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 border border-slate-100 p-6 rounded-2xl bg-slate-50/30">
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">نام و نام خانوادگی متقاضی:</p>
                    <p class="text-sm font-bold text-slate-950">${req.fullName || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">نام پدر:</p>
                    <p class="text-sm font-bold text-slate-950">${req.fatherName || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">تاریخ تولد:</p>
                    <p class="text-sm font-bold text-slate-950">${req.birthDate || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">شماره تلفن همراه:</p>
                    <p class="text-sm font-bold text-slate-950 font-mono">${req.mobile || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">تلفن ثابت فروشگاه:</p>
                    <p class="text-sm font-bold text-slate-950 font-mono">${req.landline || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">شماره حساب بانکی:</p>
                    <p class="text-sm font-bold text-slate-950 font-mono">${req.accountNumber || '-'}</p>
                  </div>
                </div>
    
                <h3 class="text-sm font-black text-indigo-600 mb-4 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">۲. مشخصات صنفی، فروشگاه و سوابق فعالیت</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 border border-slate-100 p-6 rounded-2xl bg-slate-50/30">
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">نام فروشگاه / عاملیت:</p>
                    <p class="text-sm font-bold text-slate-950">${req.storeName || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">استان / شهر:</p>
                    <p class="text-sm font-bold text-slate-950">${req.province || '-'} / ${req.city || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">نوع مالکیت محل کسب:</p>
                    <p class="text-sm font-bold text-slate-950">${req.ownership || '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">سابقه فعالیت تخصصی:</p>
                    <p class="text-sm font-bold text-slate-950">${req.experience ? `${req.experience} سال` : '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">حجم خرید تقریبی سالانه (ریال):</p>
                    <p class="text-sm font-bold text-slate-950">${req.annualPurchase ? `${parseInt(req.annualPurchase).toLocaleString('fa-IR')} ریال` : '-'}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">ساعات کار عاملیت:</p>
                    <p class="text-sm font-bold text-slate-950">${req.workingHours || '-'}</p>
                  </div>
                  <div class="col-span-2 md:col-span-3">
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">آدرس دقیق پستی فروشگاه:</p>
                    <p class="text-sm font-bold text-slate-950 leading-relaxed">${req.storeAddress || '-'}</p>
                  </div>
                  <div class="col-span-2 md:col-span-3">
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">آدرس وب‌سایت یا اینستاگرام:</p>
                    <p class="text-sm font-bold text-slate-950 font-mono">${req.instagram || '-'}</p>
                  </div>
                  <div class="col-span-2 md:col-span-3">
                    <p class="text-[11px] text-slate-400 mb-1 font-bold">برندهای لوله و پی‌وی‌سی فعال فعلی در مجموعه:</p>
                    <p class="text-sm font-bold text-slate-950 leading-relaxed">${req.brands || '-'}</p>
                  </div>
                </div>
    
                <!-- Attached Store Images in Invoice style, side by side if available -->
                ${(req.storefrontImage || req.interiorImage) ? `
                  <h3 class="text-sm font-black text-indigo-600 mb-4 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">۳. مدارک تصویر محیطی فروشگاه</h3>
                  <div class="grid grid-cols-2 gap-6 mb-8">
                    ${req.storefrontImage ? `
                      <div class="border border-slate-100 p-3 rounded-2xl bg-slate-50 text-center">
                        <p class="text-[10px] text-slate-500 font-bold mb-2">عکس نمای سردر فروشگاه</p>
                        <div class="h-44 w-full rounded-xl overflow-hidden shadow-inner border bg-white">
                          <img src="${req.storefrontImage}" class="h-full w-full object-contain" />
                        </div>
                      </div>
                    ` : ''}
                    ${req.interiorImage ? `
                      <div class="border border-slate-100 p-3 rounded-2xl bg-slate-50 text-center">
                        <p class="text-[10px] text-slate-500 font-bold mb-2">عکس داخل محیط فروشگاه</p>
                        <div class="h-44 w-full rounded-xl overflow-hidden shadow-inner border bg-white">
                          <img src="${req.interiorImage}" class="h-full w-full object-contain" />
                        </div>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
    
                <!-- Company Seal & Customer Signature Footer Section -->
                <footer class="mt-16 pt-8 border-t border-dashed border-slate-200 grid grid-cols-3 gap-6 text-center text-xs text-slate-500">
                  <div class="space-y-12">
                    <p class="font-bold text-slate-700">امضا و اثر انگشت متقاضی نمایندگی</p>
                    <div class="w-32 border-b border-slate-200 mx-auto"></div>
                  </div>
                  <div class="space-y-12">
                    <p class="font-bold text-slate-700 font-sans">امیر غفارنژاد <br><span class="text-[10px] text-slate-400 font-normal">(مدیر امور نمایندگان)</span></p>
                    <div class="w-32 border-b border-slate-200 mx-auto"></div>
                  </div>
                  <div class="space-y-12">
                    <p class="font-bold text-slate-700">مهر و امضا مدیریت عامل کویر بسبار</p>
                    <div class="w-32 border-b border-slate-200 mx-auto"></div>
                  </div>
                </footer>
    
                <!-- Print toolbar (hidden on paper) -->
                <div class="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print bg-slate-50 -mx-8 -mb-8 p-8 max-w-none">
                  <span class="text-xs text-slate-400 font-medium">برای خروجی باکیفیت تر، لطفا گزینه چاپ پس‌زمینه (Background Graphics) را تیک بزنید.</span>
                  <div class="flex items-center gap-3">
                    <button onclick="window.close()" class="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-600 font-bold text-xs transition-colors">بستن پنجره</button>
                    <button onclick="window.print()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transition-all">چاپ فرم / خروجی PDF</button>
                  </div>
                </div>
    
              </div>
            </body>
          </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printHTML);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">درخواست‌های نمایندگی</h2>
            
            {requests.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    هیچ درخواست نمایندگی تاکنون ثبت نشده است.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {requests.map((req, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-xl shadow p-6 border-r-4 border-blue-500"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{req.fullName}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{req.storeName}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                        {req.status}
                                    </span>
                                    <button 
                                        onClick={() => handlePrintPartnership(req)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors text-sm flex items-center gap-2 cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        چاپ فرم
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">تاریخ درخواست</p>
                                    <p className="font-semibold text-gray-800">{req.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">تلفن همراه</p>
                                    <p className="font-semibold text-gray-800">{req.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">استان / شهر</p>
                                    <p className="font-semibold text-gray-800">{req.province} / {req.city}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">نام پدر</p>
                                    <p className="font-semibold text-gray-800">{req.fatherName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">تاریخ تولد</p>
                                    <p className="font-semibold text-gray-800">{req.birthDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">تلفن ثابت</p>
                                    <p className="font-semibold text-gray-800">{req.landline || '-'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">شماره حساب</p>
                                    <p className="font-semibold text-gray-800">{req.accountNumber || '-'}</p>
                                </div>
                                <div className="lg:col-span-3">
                                    <p className="text-xs text-gray-500 mb-1">آدرس فروشگاه</p>
                                    <p className="font-semibold text-gray-800">{req.storeAddress}</p>
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">نوع مالکیت</p>
                                    <p className="font-semibold text-gray-800">{req.ownership}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">سابقه فعالیت</p>
                                    <p className="font-semibold text-gray-800">{req.experience ? `${req.experience} سال` : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">حجم خرید سالانه</p>
                                    <p className="font-semibold text-gray-800">{req.annualPurchase ? `${parseInt(req.annualPurchase).toLocaleString('fa-IR')} ریال` : '-'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">ساعات کاری</p>
                                    <p className="font-semibold text-gray-800">{req.workingHours || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">آیدی اینستاگرام</p>
                                    <p className="font-semibold text-gray-800">{req.instagram || '-'}</p>
                                </div>

                                <div className="lg:col-span-3">
                                    <p className="text-xs text-gray-500 mb-1">برندهای موجود</p>
                                    <p className="font-semibold text-gray-800">{req.brands || '-'}</p>
                                </div>
                            </div>
                            
                            {(req.storefrontImage || req.interiorImage) && (
                                <div className="mt-8 border-t pt-6 border-gray-100">
                                    <h4 className="text-md font-bold text-gray-800 mb-4">تصاویر ارسالی</h4>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {req.storefrontImage && (
                                            <div className="flex-shrink-0">
                                                <p className="text-xs text-gray-500 mb-2">عکس سردر فروشگاه</p>
                                                <img 
                                                    src={req.storefrontImage} 
                                                    alt="Storefront" 
                                                    className="h-48 w-48 object-cover rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity" 
                                                    onClick={() => setSelectedImage(req.storefrontImage)} 
                                                />
                                            </div>
                                        )}
                                        {req.interiorImage && (
                                            <div className="flex-shrink-0">
                                                <p className="text-xs text-gray-500 mb-2">عکس داخل فروشگاه</p>
                                                <img 
                                                    src={req.interiorImage} 
                                                    alt="Interior" 
                                                    className="h-48 w-48 object-cover rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity" 
                                                    onClick={() => setSelectedImage(req.interiorImage)} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="absolute -top-12 right-0 text-white hover:text-gray-300"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img 
                            src={selectedImage} 
                            alt="Preview" 
                            className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" 
                        />
                        <div className="mt-4 text-center">
                            <button 
                                onClick={() => handleDownload(selectedImage)}
                                className="bg-brand text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-brand-dark transition-colors inline-flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                دانلود تصویر
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnershipRequestsView;
