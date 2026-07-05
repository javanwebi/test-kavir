
import React, { useState, useEffect } from 'react';
import { BackIcon, CartIcon } from '../DashboardIcons';
import PlaceholderIcon from '../../icons/PlaceholderIcon';

// Helper to find variants
const getProductVariants = (selectedProduct, allProducts) => {
    let baseName = selectedProduct.name;
    
    // Check if the selected product name has size info (in case passed from somewhere else or raw product)
    const separator = ' سایز ';
    const sizeIndex = baseName.lastIndexOf(separator);
    
    if (sizeIndex !== -1) {
        baseName = baseName.substring(0, sizeIndex);
    }

    // Find all products that match the base name exactly OR match "BaseName Size X"
    const variants = allProducts.filter(p => {
        // Exact match (base product)
        if (p.name === baseName) return true;
        // Variant match (starts with base name + separator)
        if (p.name.startsWith(baseName + separator)) return true;
        return false;
    });

    // If variants found, return them. Use grouping logic.
    if (variants.length > 0) {
        return { baseName, variants };
    }
    
    return { baseName, variants: [selectedProduct] };
};

const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    const englishPrice = String(priceStr)
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
        .replace(/[^\d]/g, '');
    return parseInt(englishPrice, 10) || 0;
};

const getPercentFromDiscountString = (discountStr: string) => {
    if (!discountStr) return 0;
    let clean = String(discountStr)
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    if (clean.includes('%') || clean.includes('٪') || clean.includes('درصد')) {
        const match = clean.match(/(\d+(?:\.\d+)?)/);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return 0;
};

const getProductImages = (product) => {
    const name = product.name || '';
    const code = product.code || '';
    const baseImg = product.imageUrl || '';
    
    // Check if the product matches any known categories or codes
    if (name.includes('تک لایه') && (name.includes('PPR') || name.includes('پلیمری')) && !name.includes('حلقه')) {
        return [
            baseImg || 'https://kavirbaspar.com/wp-content/uploads/2022/02/taklayeh.jpg',
            'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800',
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800'
        ];
    }
    if (name.includes('سه لایه') && name.includes('فایبرگلاس') && !name.includes('حلقه')) {
        return [
            baseImg || 'https://kavirbaspar.com/wp-content/uploads/2022/02/3layeh.jpg',
            'https://images.unsplash.com/photo-1532593198780-3c2048675812?q=80&w=800',
            'https://images.unsplash.com/photo-1605118732641-3495e23b771d?q=80&w=800'
        ];
    }
    if (name.includes('تک لایه') && (name.includes('حلقه') || name.includes('رولی'))) {
        return [
            baseImg || 'https://images.unsplash.com/photo-1632766391910-3a363771b315?q=80&w=800',
            'https://images.unsplash.com/photo-1517646287309-9f76dd6f4ba9?q=80&w=800',
            'https://images.unsplash.com/photo-1581092921461-eab62e97a78e?q=80&w=800'
        ];
    }
    if (name.includes('سه لایه') && name.includes('فایبرگلاس') && name.includes('حلقه')) {
        return [
            baseImg || 'https://images.unsplash.com/photo-1599494193939-556b2789445c?q=80&w=800',
            'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
            'https://images.unsplash.com/photo-1580584126903-c17d41830450?q=80&w=800'
        ];
    }
    if (name.includes('بوشن') || code === 'KB-A205') {
        return [
            baseImg || '/image etesal/153_social_media_post_template.jpg',
            '/image etesal/1.jpg',
            '/image etesal/2.jpg',
            '/image etesal/3.jpg'
        ];
    }
    if (name.includes('زانو') || code === 'KB-A201') {
        return [
            baseImg || 'https://kavirbaspar.com/wp-content/uploads/2022/03/%D8%B2%D8%A7%D9%86%D9%88-90-%D8%AF%D8%B1%D8%AC%D9%87-1-1.jpg',
            'https://images.unsplash.com/photo-1532593198780-3c2048675812?q=80&w=800',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800'
        ];
    }
    if (name.includes('سه راه') || code === 'KB-A203') {
        return [
            baseImg || 'https://kavirbaspar.com/wp-content/uploads/2022/03/%D8%B3%D9%87-%D8%B1%D8%A7%D9%87%DB%8C-1-1.jpg',
            'https://images.unsplash.com/photo-1585561005661-39c5d7b194f7?q=80&w=800',
            'https://images.unsplash.com/photo-1605118732641-3495e23b771d?q=80&w=800'
        ];
    }
    if (name.includes('شیر') || code === 'KB-V401' || code === 'KB-V405') {
        return [
            baseImg || 'https://kavirbaspar.com/wp-content/uploads/2022/03/%D8%B4%DB%8C%D8%B1-%D9%81%D9%84%DA%A9%D9%87-1-1.jpg',
            'https://images.unsplash.com/photo-1595416927025-1499459823a3?q=80&w=800',
            'https://images.unsplash.com/photo-1517646287309-9f76dd6f4ba9?q=80&w=800'
        ];
    }
    
    const list = [
        baseImg,
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800',
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800'
    ].filter(Boolean);
    return list;
};

const ProductDetail = ({ product, onBack, onAddToCart, products, customer, specialOffers = [], productDiscounts = [] }) => {
    const { baseName, variants } = getProductVariants(product, products);
    
    const getProductDiscount = (productCode: string) => {
        if (!customer || !productDiscounts) return 0;
        
        // Check for specific discount for this customer
        const specificDiscount = productDiscounts.find(d => 
            d.productId === productCode && 
            d.type === 'specific' && 
            d.customerIds?.includes(customer.id)
        );
        if (specificDiscount) return specificDiscount.percentage;

        // Check for public discount
        const publicDiscount = productDiscounts.find(d => 
            d.productId === productCode && 
            d.type === 'public'
        );
        if (publicDiscount) return publicDiscount.percentage;

        return 0;
    };

    const getSpecialOffer = (name: string) => {
        if (!specialOffers) return null;
        const matchingProducts = products.filter(p => p.name.includes(name) || name.includes(p.name));
        for (const p of matchingProducts) {
             const offer = specialOffers.find(o => {
                 const nameMatches = o.productName === p.name || 
                                     p.name.includes(o.productName) || 
                                     o.productName.includes(p.name);
                 const isForCustomer = o.type === 'public' || 
                                       (o.type === 'specific' && customer && Number(o.customerId) === Number(customer.id));
                 return nameMatches && isForCustomer;
             });
             if (offer) return offer;
        }
        return null;
    };

    const specialOffer = getSpecialOffer(baseName);
    const specialOfferPercent = specialOffer ? getPercentFromDiscountString(specialOffer.discount) : 0;
    const productGroup = product.category;
    const images = getProductImages(product);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [product.code, product.name]);

    const [quantities, setQuantities] = useState<{ [key: string]: { packages: number, cartons: number } }>({});
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePackageQuantityChange = (productCode: string, newQuantity: number) => {
        setQuantities(prev => {
            const variant = variants.find(v => v.code === productCode);
            const currentPackages = prev[productCode]?.packages || 0;
            const currentCartons = prev[productCode]?.cartons || 0;
            
            const updatedState = { ...prev };

            // Default: just update package count
            updatedState[productCode] = {
                cartons: currentCartons,
                packages: Math.max(0, newQuantity)
            };

            // Smart conversion logic for buttons
            if (variant && variant.packageQuantity > 0 && variant.cartonQuantity > 0) {
                const packagesPerCarton = variant.cartonQuantity / variant.packageQuantity;
                if (Number.isInteger(packagesPerCarton)) {
                    const isButtonIncrement = newQuantity === currentPackages + 1;
                    const isButtonDecrement = newQuantity === currentPackages - 1;

                    if (isButtonIncrement && newQuantity >= packagesPerCarton) {
                        updatedState[productCode] = { cartons: currentCartons + 1, packages: 0 };
                    } else if (isButtonDecrement && newQuantity < 0 && currentCartons > 0) {
                        updatedState[productCode] = { cartons: currentCartons - 1, packages: packagesPerCarton - 1 };
                    }
                }
            }

            return updatedState;
        });
    };
    
    const handleCartonQuantityChange = (productCode: string, newQuantity: number) => {
        setQuantities(prev => ({
            ...prev,
            [productCode]: {
                ...(prev[productCode] || { packages: 0 }),
                cartons: Math.max(0, newQuantity)
            }
        }));
    };

    const handleAddToCartClick = () => {
        setIsAdding(true);

        const itemsToAdd = variants
            .map(variant => {
                const packages = quantities[variant.code]?.packages || 0;
                const cartons = quantities[variant.code]?.cartons || 0;
                const totalQuantity = (packages * variant.packageQuantity) + (cartons * variant.cartonQuantity);
                return { product: variant, quantity: totalQuantity, packages, cartons };
            })
            .filter(item => item.quantity > 0);

        if (itemsToAdd.length > 0) {
            onAddToCart(itemsToAdd);
            setQuantities({});
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }

        setIsAdding(false);
    };

    const totalItems = Object.keys(quantities).filter(k => quantities[k].packages > 0 || quantities[k].cartons > 0).length;


    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6">
                <BackIcon />
                بازگشت به کاتالوگ
            </button>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className="relative aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 group transition-all duration-300 hover:shadow-md">
                            {images.length > 0 ? (
                                <>
                                    <img 
                                        src={images[currentImageIndex]} 
                                        alt={baseName} 
                                        className="max-w-full h-auto max-h-80 object-contain p-4 transition-all duration-500 ease-out transform"
                                    />
                                    
                                    {/* Navigation Arrows */}
                                    {images.length > 1 && (
                                        <>
                                            {/* Left Arrow Button */}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 hover:text-[#5d87ff] p-2.5 rounded-full shadow-md border border-slate-100 hover:shadow-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]"
                                                aria-label="Previous image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            {/* Right Arrow Button */}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 hover:text-[#5d87ff] p-2.5 rounded-full shadow-md border border-slate-100 hover:shadow-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5d87ff]"
                                                aria-label="Next image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    {/* Indicator dots */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#5d87ff] scale-125 w-3' : 'bg-white/60 hover:bg-white/80'}`}
                                                    aria-label={`Go to slide ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <PlaceholderIcon />
                            )}
                        </div>

                        {/* Thumbnails row */}
                        {images.length > 1 && (
                            <div className="flex gap-2.5 overflow-x-auto py-1.5 scrollbar-none justify-center">
                                {images.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-16 h-16 bg-white rounded-xl border-2 overflow-hidden flex items-center justify-center p-1.5 transition-all duration-200 ${idx === currentImageIndex ? 'border-[#5d87ff] scale-105 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'}`}
                                    >
                                        <img src={imgUrl} alt={`${baseName} thumbnail ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-2">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{productGroup}</span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-3">{baseName}</h1>
                        <div className="mt-4 flex items-center gap-x-6 gap-y-2 text-sm flex-wrap">
                            <div>
                                <span className="text-gray-500">برند:</span>
                                <span className="font-semibold text-gray-800 mr-2">آذین لوله</span>
                            </div>
                        </div>
                        <p className="mt-5 text-gray-600 leading-relaxed text-justify">
                            این محصول با استفاده از بهترین مواد اولیه و با بهره‌گیری از تکنولوژی روز دنیا تولید شده است تا بالاترین کیفیت و دوام را برای پروژه‌های شما به ارمغان بیاورد. مناسب برای انواع کاربردهای مسکونی، تجاری و صنعتی، و تضمین‌کننده عملکردی بی‌نقص در سیستم‌های لوله‌کشی.
                        </p>
                        {specialOffer && (
                            <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-start gap-3">
                                <div className="mt-0.5 bg-amber-400 px-3 py-1.5 rounded-xl text-amber-950 font-black text-xs shrink-0 shadow-sm shadow-amber-200">
                                   پیشنهاد طلایی
                                </div>
                                <div className="flex-1">
                                   <p className="font-bold text-sm text-amber-950">شرایط ویژه خرید با پیشنهاد طلایی:</p>
                                   <p className="text-xs text-amber-800 mt-1 font-semibold leading-relaxed">{specialOffer.discount}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Variants Selection Container */}
                <div className="mt-12">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">انتخاب سایز و افزودن به سبد خرید</h2>
                    
                    {/* Desktop/Tablet Table (Hidden on mobile) */}
                    <div className="hidden md:block overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700 w-16">ردیف</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">سایز (میلی‌متر)</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">کد محصول</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">تعداد در بسته</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">تعداد در کارتن</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700">قیمت (ریال)</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700 text-center w-36">تعداد بسته</th>
                                    <th className="px-4 py-3 font-semibold text-gray-700 text-center w-36">تعداد کارتن</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => {
                                    const size = variant.name.split(' سایز ')[1] || '-';
                                    const price = variant.price;
                                    const isAvailable = variant.stock !== 'ناموجود';
                                    const packageQty = quantities[variant.code]?.packages || 0;
                                    const cartonQty = quantities[variant.code]?.cartons || 0;

                                    return (
                                        <tr key={variant.code} className="border-b last:border-b-0 hover:bg-gray-50">
                                            <td className="px-4 py-4 text-gray-600">{index + 1}</td>
                                            <td className="px-4 py-4 font-medium text-gray-800">{size}</td>
                                            <td className="px-4 py-4 text-gray-600">{variant.code}</td>
                                            <td className="px-4 py-4 text-gray-600">{variant.packageQuantity}</td>
                                            <td className="px-4 py-4 text-gray-600">{variant.cartonQuantity}</td>
                                            <td className="px-4 py-4 font-semibold text-gray-900">
                                                {(() => {
                                                    const numericPrice = parsePrice(variant.price);
                                                    const generalDiscount = getProductDiscount(variant.code);
                                                    const finalDiscountPercent = generalDiscount + specialOfferPercent;
                                                    const hasDiscount = finalDiscountPercent > 0;
                                                    const discountedPrice = hasDiscount ? numericPrice * (1 - finalDiscountPercent / 100) : numericPrice;
                                                    return hasDiscount ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-slate-400 line-through font-normal">{variant.price}</span>
                                                            <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded self-start my-0.5">٪{finalDiscountPercent} تخفیف</span>
                                                            <span className="text-sm text-rose-600 font-bold tracking-tight">{Math.round(discountedPrice).toLocaleString('fa-IR')}</span>
                                                        </div>
                                                    ) : (
                                                        <span>{variant.price}</span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                 <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handlePackageQuantityChange(variant.code, packageQty + 1)}
                                                        disabled={!isAvailable}
                                                        className="bg-blue-500 text-white rounded-md h-7 w-7 flex items-center justify-center font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                    <input dir="ltr"
                                                        type="number"
                                                        value={packageQty}
                                                        onChange={(e) => handlePackageQuantityChange(variant.code, parseInt(e.target.value) || 0)}
                                                        className="w-12 text-center border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                                        disabled={!isAvailable}
                                                        min="0"
                                                    />
                                                    <button
                                                        onClick={() => handlePackageQuantityChange(variant.code, packageQty - 1)}
                                                        disabled={!isAvailable || (packageQty === 0 && cartonQty === 0)}
                                                        className="bg-gray-200 text-gray-700 rounded-md h-7 w-7 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                 <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleCartonQuantityChange(variant.code, cartonQty + 1)}
                                                        disabled={!isAvailable}
                                                        className="bg-blue-500 text-white rounded-md h-7 w-7 flex items-center justify-center font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                    <input dir="ltr"
                                                        type="number"
                                                        value={cartonQty}
                                                        onChange={(e) => handleCartonQuantityChange(variant.code, parseInt(e.target.value) || 0)}
                                                        className="w-12 text-center border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                                        disabled={!isAvailable}
                                                        min="0"
                                                    />
                                                    <button
                                                        onClick={() => handleCartonQuantityChange(variant.code, cartonQty - 1)}
                                                        disabled={!isAvailable || cartonQty === 0}
                                                        className="bg-gray-200 text-gray-700 rounded-md h-7 w-7 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Touch-Optimized Cards (Hidden on desktop/tablet) */}
                    <div className="md:hidden space-y-4">
                        {variants.map((variant, index) => {
                            const size = variant.name.split(' سایز ')[1] || '-';
                            const price = variant.price;
                            const isAvailable = variant.stock !== 'ناموجود';
                            const packageQty = quantities[variant.code]?.packages || 0;
                            const cartonQty = quantities[variant.code]?.cartons || 0;

                            const numericPrice = parsePrice(variant.price);
                            const generalDiscount = getProductDiscount(variant.code);
                            const finalDiscountPercent = generalDiscount + specialOfferPercent;
                            const hasDiscount = finalDiscountPercent > 0;
                            const discountedPrice = hasDiscount ? numericPrice * (1 - finalDiscountPercent / 100) : numericPrice;

                            return (
                                <div 
                                    key={variant.code} 
                                    className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs space-y-4 transition-all hover:border-[#5d87ff]/30"
                                >
                                    {/* Header: Row index, size, product code */}
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-lg bg-[#5d87ff]/10 text-[#5d87ff] flex items-center justify-center font-bold text-xs">{index + 1}</span>
                                            <span className="font-extrabold text-slate-800 text-sm">سایز {size} میلی‌متر</span>
                                        </div>
                                        <span className="text-xs font-mono text-slate-400 font-bold">کد: {variant.code}</span>
                                    </div>

                                    {/* Pack quantities */}
                                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                                        <div className="bg-slate-50/65 p-2 rounded-xl border border-slate-100/60">
                                            <span className="text-slate-400 block mb-0.5">تعداد در بسته</span>
                                            <span className="font-bold text-slate-800">{variant.packageQuantity} عدد</span>
                                        </div>
                                        <div className="bg-slate-50/65 p-2 rounded-xl border border-slate-100/60">
                                            <span className="text-slate-400 block mb-0.5">تعداد در کارتن</span>
                                            <span className="font-bold text-slate-800">{variant.cartonQuantity} عدد</span>
                                        </div>
                                    </div>

                                    {/* Price and discount */}
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-xs font-bold text-slate-500">قیمت واحد (ریال):</span>
                                        <div className="text-left">
                                            {hasDiscount ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-slate-400 line-through font-normal">{variant.price}</span>
                                                    <span className="text-[10px] text-rose-500 font-black bg-rose-50 px-2 py-0.5 rounded-lg my-1">٪{finalDiscountPercent} تخفیف</span>
                                                    <span className="text-base text-rose-600 font-black tracking-tight">{Math.round(discountedPrice).toLocaleString('fa-IR')}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-extrabold text-slate-800">{variant.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Size select controllers */}
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                                        {/* Pack quantity controller */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-black text-slate-500 block text-center">تعداد بسته</span>
                                            <div className="flex items-center justify-between bg-slate-50/80 border border-slate-200 rounded-xl p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePackageQuantityChange(variant.code, packageQty + 1)}
                                                    disabled={!isAvailable}
                                                    className="bg-blue-500 text-white rounded-lg h-8 w-8 flex items-center justify-center font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed focus:outline-none"
                                                >
                                                    +
                                                </button>
                                                <input 
                                                    dir="ltr"
                                                    type="number"
                                                    value={packageQty}
                                                    onChange={(e) => handlePackageQuantityChange(variant.code, parseInt(e.target.value) || 0)}
                                                    className="w-10 text-center bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-800 disabled:opacity-50"
                                                    disabled={!isAvailable}
                                                    min="0"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handlePackageQuantityChange(variant.code, packageQty - 1)}
                                                    disabled={!isAvailable || (packageQty === 0 && cartonQty === 0)}
                                                    className="bg-gray-200 text-gray-700 rounded-lg h-8 w-8 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        </div>

                                        {/* Carton quantity controller */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-black text-slate-500 block text-center">تعداد کارتن</span>
                                            <div className="flex items-center justify-between bg-slate-50/80 border border-slate-200 rounded-xl p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCartonQuantityChange(variant.code, cartonQty + 1)}
                                                    disabled={!isAvailable}
                                                    className="bg-blue-500 text-white rounded-lg h-8 w-8 flex items-center justify-center font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed focus:outline-none"
                                                >
                                                    +
                                                </button>
                                                <input 
                                                    dir="ltr"
                                                    type="number"
                                                    value={cartonQty}
                                                    onChange={(e) => handleCartonQuantityChange(variant.code, parseInt(e.target.value) || 0)}
                                                    className="w-10 text-center bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-800 disabled:opacity-50"
                                                    disabled={!isAvailable}
                                                    min="0"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleCartonQuantityChange(variant.code, cartonQty - 1)}
                                                    disabled={!isAvailable || cartonQty === 0}
                                                    className="bg-gray-200 text-gray-700 rounded-lg h-8 w-8 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="sticky bottom-0 -mx-8 -mb-8 mt-8 p-4 bg-white/80 backdrop-blur-sm border-t">
                    <div className="max-w-screen-2xl mx-auto flex justify-end items-center gap-4">
                        {showSuccess && <p className="text-green-600 font-semibold transition-opacity duration-300">محصولات با موفقیت به سبد خرید اضافه شدند!</p>}
                        <button 
                            onClick={handleAddToCartClick}
                            disabled={totalItems === 0 || isAdding}
                            className="bg-green-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <CartIcon />
                            {isAdding ? 'در حال افزودن...' : `افزودن ${totalItems} محصول به سبد خرید`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
