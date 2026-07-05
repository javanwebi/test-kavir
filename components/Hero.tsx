
import React, { useState, useEffect } from 'react';

const slides = [
  { id: 1, number: '۰۱', text: 'راهکارهای لوله‌کشی کامپوزیت' },
  { id: 2, number: '۰۲', text: 'کامپوزیت‌ها - مواد آینده' },
  { id: 3, number: '۰۳', text: 'فناوری‌های نوآورانه برای مدیریت آب' },
  { id: 4, number: '۰۴', text: 'محصولات سبز برای پروژه‌های سبز شما' },
  { id: 5, number: '۰۵', text: 'راهکارهای پایدار برای فردایی بهتر' },
];

const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(3); // Start at slide 04
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const displaySlides = [...slides, ...slides.slice(0, 2)];
  
  // Calculate translation based on how many items are shown
  // We want to avoid empty space on the right, so we don't center if it means negative translation
  const translationPercent = activeSlide * (100 / itemsToShow);

  return (
    <div className="h-full flex flex-col justify-end p-6 sm:p-12 md:p-20 relative">
      <div className="absolute top-[48%] sm:top-1/2 -translate-y-1/2 right-6 sm:right-12 md:right-20">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white max-w-3xl leading-tight drop-shadow-lg">
          محصولات سبز برای پروژه‌های سبز شما
        </h1>
      </div>

      <div className="absolute bottom-[18%] sm:bottom-[20%] left-6 sm:left-10 md:left-20">
        <div className="bg-brand-dark/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/20 w-64 sm:w-80 text-center space-y-3 sm:space-y-4 shadow-2xl"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
          <h3 className="text-white font-semibold text-sm sm:text-lg leading-tight">
            دانلود کاتالوگ کویر بسپار کلیک کنید
          </h3>
          <button className="bg-white text-black px-6 py-2.5 sm:px-8 sm:py-3 rounded-full flex items-center justify-center w-full font-bold hover:bg-gray-200 transition-colors text-sm sm:text-base">
            دانلود کاتالوگ
          </button>
        </div>
      </div>

      <div className="w-full pb-4 sm:pb-0 z-10 relative mt-auto">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-base sm:text-lg font-semibold">{slides[activeSlide].number}</span>
          <div className="flex-grow h-0.5 bg-white/20 relative">
             <div
                className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-in-out"
                style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
              ></div>
          </div>
        </div>
        <div className="mt-4 flex overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex transition-transform duration-700 ease-in-out w-full"
            style={{ transform: `translateX(${translationPercent}%)` }}
          >
            {displaySlides.map((slide, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4"
                style={{ flexBasis: `${100 / itemsToShow}%` }}
              >
                <p
                  className={`text-sm sm:text-lg transition-all duration-500 text-center leading-snug sm:leading-normal drop-shadow-md w-full whitespace-normal px-2 ${
                    index === activeSlide || (index === activeSlide + slides.length) 
                      ? 'opacity-100 font-bold sm:scale-105 text-white' 
                      : 'opacity-60 font-medium sm:scale-95 text-gray-200'
                  }`}
                >
                  {slide.text}
                </p>
                <div className="hidden sm:block w-px h-6 bg-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
