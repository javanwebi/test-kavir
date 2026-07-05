import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from './Header';
import Footer from './Footer';

// Fix for default Leaflet markers in React using CDN paths to avoid TS import errors
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper Component to instantly control view focus and zoom
function MapController({ center, zoom, activeRepId, representatives }: { center: [number, number], zoom: number, activeRepId: number | null, representatives: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeRepId) {
        const found = representatives.find(r => r.id === activeRepId);
        if (found) {
            map.setView([found.lat, found.lng], 15, {
                animate: true,
                duration: 1.2
            });
            return;
        }
    }
    
    map.setView(center, zoom, {
        animate: true,
        duration: 1.2
    });
  }, [center, zoom, activeRepId, map, representatives]);

  return null;
}

interface Representative {
    id: number;
    name: string;
    country: string;
    city: string;
    phone: string;
    mobile: string;
    address: string;
    lat: number;
    lng: number;
    manager: string;
    hours: string;
    status: string;
    shopfrontImage?: string;
    videoUrl?: string;
}

interface StoreLocatorProps {
    representatives: Representative[];
    initialSelection: { country?: string; city?: string } | null;
    onNavigateHome: () => void;
    onNavigateToLogin: () => void;
    onNavigateToPartnership: () => void;
    onNavigateToAbout: () => void;
    onNavigateToGoals: () => void;
    onNavigateToArticles: () => void;
    onNavigateToContact: () => void;
    onNavigateToFAQ: () => void;
    onNavigateToFeedback: () => void;
    onProductSelect: (product: any) => void;
    onNavigateToAdminDashboard: () => void;
}

const StoreLocator: React.FC<StoreLocatorProps> = (props) => {
    const reps = useMemo(() => props.representatives || [], [props.representatives]);

    // Active cities context dynamically computed from available reps to focus map
    const citiesContext = useMemo(() => {
        const context: Record<string, [number, number]> = {
            'تهران': [35.6892, 51.3890],
            'کرمان': [30.2839, 57.0834],
            'شیراز': [29.5918, 52.5836],
            'مشهد': [36.2972, 59.6067],
            'کرج': [35.8327, 50.9915],
            'یزد': [31.8974, 54.3569],
        };
        reps.forEach(rep => {
            if (rep.city && rep.lat && rep.lng && !context[rep.city]) {
                context[rep.city] = [rep.lat, rep.lng];
            }
        });
        return context;
    }, [reps]);

    // Dynamic countries and cities
    const countries = useMemo(() => {
        const unique = new Set(reps.map(r => r.country || 'ایران'));
        return Array.from(unique);
    }, [reps]);

    const [selectedCountry, setSelectedCountry] = useState<string>(props.initialSelection?.country || '');
    const [selectedCity, setSelectedCity] = useState<string>(props.initialSelection?.city || '');
    const [activeRepId, setActiveRepId] = useState<number | null>(null);
    const mapRef = useRef<any>(null);

    // Filter cities based on selected country
    const citiesOfSelectedCountry = useMemo(() => {
        const filtered = reps.filter(r => selectedCountry ? (r.country || 'ایران') === selectedCountry : true);
        const unique = new Set(filtered.map(r => r.city));
        return Array.from(unique);
    }, [reps, selectedCountry]);

    // Reset selected city if it's no longer in the filtered country
    useEffect(() => {
        if (selectedCountry && selectedCity) {
            const stillValid = reps.some(r => (r.country || 'ایران') === selectedCountry && r.city === selectedCity);
            if (!stillValid) {
                setSelectedCity('');
                setActiveRepId(null);
            }
        }
    }, [selectedCountry, selectedCity, reps]);

    // Filtered representatives based on country and city
    const filteredReps = useMemo(() => {
        return reps.filter(rep => {
            const matchesCountry = selectedCountry ? (rep.country || 'ایران') === selectedCountry : true;
            const matchesCity = selectedCity ? rep.city === selectedCity : true;
            return matchesCountry && matchesCity;
        });
    }, [reps, selectedCountry, selectedCity]);

    const activeRep = useMemo(() => {
        if (!activeRepId) return null;
        return reps.find(rep => rep.id === activeRepId);
    }, [activeRepId, reps]);

    // Handle smooth search trigger from context sync
    useEffect(() => {
        if (props.initialSelection?.city) {
            setSelectedCity(props.initialSelection.city);
            const matching = reps.find(rep => rep.city === props.initialSelection?.city);
            if (matching) {
                setActiveRepId(matching.id);
            }
        }
        if (props.initialSelection?.country) {
            setSelectedCountry(props.initialSelection.country);
        }
    }, [props.initialSelection, reps]);

    // Map Coordinates & Zoom Settings
    const mapCenter: [number, number] = useMemo(() => {
        if (activeRep) {
            return [activeRep.lat, activeRep.lng];
        }
        if (selectedCity && citiesContext[selectedCity]) {
            return citiesContext[selectedCity];
        }
        return [32.4279, 53.6880]; // Center of Iran
    }, [selectedCity, activeRep, citiesContext]);
    
    const mapZoom = useMemo(() => {
        if (activeRep) return 15;
        if (selectedCity) return 12;
        return 5; // Nationwide overview
    }, [selectedCity, activeRep]);

    const handleRepSelect = (repId: number) => {
        setActiveRepId(repId);
    };

    return (
        <div className="bg-slate-50 font-sans min-h-screen flex flex-col antialiased">
            <Header 
                variant="light"
                onNavigateToLogin={props.onNavigateToLogin}
                onNavigateHome={props.onNavigateHome}
                onNavigateToPartnership={props.onNavigateToPartnership}
                onNavigateToAbout={props.onNavigateToAbout}
                onNavigateToGoals={props.onNavigateToGoals}
                onNavigateToArticles={props.onNavigateToArticles}
                onNavigateToContact={props.onNavigateToContact}
                onNavigateToFAQ={props.onNavigateToFAQ}
                onNavigateToFeedback={props.onNavigateToFeedback}
                onProductSelect={props.onProductSelect}
            />

            {/* HERO SECTION */}
            <section className="relative pt-28 pb-14 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_45%)]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        مراکز معتبر و رسمی فروش
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                        پیدا کردن نقطه فروش و نمایندگی‌ها
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                        محصولات لوله و اتصالات ما را از طریق شبکه رسمی توزیع و نمایندگان مجاز در سراسر کشور تهیه فرمایید تا از گارانتی طلایی، بیمه‌نامه کالا و خدمات پس از فروش رسمی بهره‌مند شوید.
                    </p>
                    
                    {/* Dynamic Badges / Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-700/50 pt-8 mt-4 text-right">
                        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                            <p className="text-xs text-slate-400 mb-1">تعداد نمایندگان فعال</p>
                            <p className="text-xl font-bold text-emerald-400">{reps.length} مرکز فروش رسمی</p>
                        </div>
                        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                            <p className="text-xs text-slate-400 mb-1">پوشش جغرافیایی کلان‌شهرها</p>
                            <p className="text-xl font-bold text-white">{new Set(reps.map(r => r.city)).size} شهر فعال</p>
                        </div>
                        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                            <p className="text-xs text-slate-400 mb-1">کشورهای دارای نماینده</p>
                            <p className="text-xl font-bold text-white">{countries.length} کشور فعال</p>
                        </div>
                        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                            <p className="text-xs text-slate-400 mb-1">تضمین اصالت و گارانتی</p>
                            <p className="text-xl font-bold text-emerald-400">بیمه‌نامه و ضمانت طلایی</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Interactive Map & Search Dashboard */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Controls & Representatives List Sidebar */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800 mb-1">فیلتر جغرافیایی نمایندگان</h2>
                            <p className="text-xs text-slate-500">موقعیت دلخواه خود را فیلتر کنید تا نماینده‌های فعال روی نقشه و لیست نمایان شوند.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">کشور</label>
                                <select 
                                    value={selectedCountry}
                                    onChange={(e) => {
                                        setSelectedCountry(e.target.value);
                                        setActiveRepId(null);
                                    }}
                                    className="w-full bg-white border-2 border-slate-200 hover:border-brand/40 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm font-semibold text-slate-800"
                                >
                                    <option value="">همه کشورها</option>
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">انتخاب شهر هدف</label>
                                <select 
                                    value={selectedCity} 
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                        setActiveRepId(null);
                                    }}
                                    className="w-full bg-white border-2 border-slate-200 hover:border-brand/40 rounded-xl py-2.5 px-3 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm font-semibold text-slate-800"
                                >
                                    <option value="">همه شهرها</option>
                                    {citiesOfSelectedCountry.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* List of Representatives */}
                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-slate-400">لیست نمایندگان رسمی</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{filteredReps.length} مرکز</span>
                            </div>

                            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                                {filteredReps.map(rep => {
                                    const isSelected = activeRepId === rep.id;
                                    return (
                                        <div 
                                            key={rep.id} 
                                            onClick={() => handleRepSelect(rep.id)}
                                            className={`p-4 rounded-2xl cursor-pointer text-right transition-all border ${
                                                isSelected 
                                                ? 'bg-gradient-to-br from-emerald-50 to-teal-50/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/10' 
                                                : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                                                    {rep.name}
                                                </h3>
                                                <span className={`text-[9px] shrink-0 font-bold px-2 py-0.5 rounded-full ${
                                                    isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {rep.city}
                                                </span>
                                            </div>
                                            
                                            <p className="text-slate-500 text-[11px] leading-relaxed mb-2 line-clamp-1">
                                                {rep.address}
                                            </p>

                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100/30">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-slate-700">تلفن:</span>
                                                    <span dir="ltr">{rep.phone}</span>
                                                </div>
                                                <div className="h-2 w-px bg-slate-200"></div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-slate-700">مدیریت:</span>
                                                    <span>{rep.manager}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredReps.length === 0 && (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-500 text-xs">نماینده‌ای در محدوده انتخابی یافت نشد.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Integrated Compact Live Map View & Quick Details Sheet */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* Map Widget */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
                            {/* Fast-load Map Indicator Badge */}
                            <div className="absolute top-3 left-3 z-[999] bg-white/95 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black text-slate-700">نقشه زنده ماهواره‌ای و شهری</span>
                            </div>

                            <div className="h-[430px] w-full z-0 relative">
                                <MapContainer 
                                    center={mapCenter} 
                                    zoom={mapZoom} 
                                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                                    ref={mapRef}
                                >
                                    <MapController center={mapCenter} zoom={mapZoom} activeRepId={activeRepId} representatives={reps} />
                                    
                                    <TileLayer
                                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                    />
                                    
                                    {filteredReps.map(rep => (
                                        <Marker 
                                            key={rep.id} 
                                            position={[rep.lat, rep.lng]}
                                            eventHandlers={{
                                                click: () => handleRepSelect(rep.id),
                                            }}
                                        >
                                            <Popup>
                                                <div className="text-right font-sans p-1 max-w-[240px]" dir="rtl">
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{rep.name}</h4>
                                                    <p className="text-[10px] text-emerald-600 font-extrabold mb-1">{rep.city} - {rep.status}</p>
                                                    <p className="text-[11px] text-slate-500 leading-normal mb-2">{rep.address}</p>
                                                    <div className="text-[11px] space-y-0.5 border-t border-slate-100 pt-1 text-slate-700">
                                                        <p><span className="font-bold">تلفن ثابت:</span> <span dir="ltr">{rep.phone}</span></p>
                                                        {rep.mobile && <p><span className="font-bold">همراه:</span> <span dir="ltr">{rep.mobile}</span></p>}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>

                        {/* DYNAMIC LIVE REPRESENTATIVE DETAILS CARD */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 transition-all duration-300">
                            {activeRep ? (
                                <div className="text-right">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg mb-1.5 border border-emerald-100">
                                                {activeRep.status}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-800">{activeRep.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-400">شهر:</span>
                                            <span className="text-sm font-extrabold text-brand bg-slate-100 px-3 py-1 rounded-xl">
                                                {activeRep.city}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Contact Numbers and Manager */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600 shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400 font-bold">شماره تماس ثابت</p>
                                                    <a href={`tel:${activeRep.phone}`} className="text-base font-black text-slate-700 hover:text-emerald-600 transition-colors" dir="ltr">
                                                        {activeRep.phone}
                                                    </a>
                                                </div>
                                            </div>

                                            {activeRep.mobile && (
                                                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                                    <div className="bg-cyan-100 p-2.5 rounded-xl text-cyan-600 shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-400 font-bold">تلفن همراه و پشتیبانی</p>
                                                        <a href={`tel:${activeRep.mobile}`} className="text-base font-black text-slate-700 hover:text-cyan-600 transition-colors" dir="ltr">
                                                            {activeRep.mobile}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                                <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400 font-bold">نام مدیریت بخش</p>
                                                    <p className="text-sm font-bold text-slate-700">{activeRep.manager}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address and Working Hours */}
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 h-full">
                                                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600 shrink-0 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="text-right flex-grow">
                                                    <p className="text-[10px] text-slate-400 font-bold">نشانی دقیق پستی</p>
                                                    <p className="text-sm font-bold text-slate-700 leading-relaxed mb-3">{activeRep.address}</p>
                                                    
                                                    <div className="border-t border-slate-100 pt-2 flex flex-col gap-1">
                                                        <span className="text-[10px] text-slate-400 font-bold">ساعات پذیرش کاری</span>
                                                        <span className="text-xs font-semibold text-slate-600">{activeRep.hours}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PHOTO & VIDEO DISPLAY AREA */}
                                    {(activeRep.shopfrontImage || activeRep.videoUrl) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 text-right">
                                            {activeRep.shopfrontImage && (
                                                <div className="space-y-2">
                                                    <span className="block text-xs font-bold text-slate-400 mb-1">تصویر سردر مغازه و فروشگاه</span>
                                                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group aspect-[16/10]">
                                                        <img 
                                                            src={activeRep.shopfrontImage} 
                                                            alt={`عکس سردر ${activeRep.name}`} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {activeRep.videoUrl && (
                                                <div className="space-y-2">
                                                    <span className="block text-xs font-bold text-slate-400 mb-1">ویدیوی معرفی نمایندگی</span>
                                                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-black aspect-[16/10] flex items-center justify-center">
                                                        {activeRep.videoUrl.includes('aparat.com') || activeRep.videoUrl.includes('youtube.com') ? (
                                                            <iframe 
                                                                src={activeRep.videoUrl} 
                                                                title="ویدیوی معرفی نمایندگی" 
                                                                className="w-full h-full border-none"
                                                                allowFullScreen
                                                            />
                                                        ) : (
                                                            <video 
                                                                src={activeRep.videoUrl} 
                                                                controls 
                                                                className="w-full h-full object-contain"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 rounded-xl border border-emerald-100 mt-6 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>خریدار گرامی، برای ارایه بهترین قیمت لطفا در هنگام تماس ذکر فرمایید که از وب‌سایت نمایندگی مرکزی ما با آن‌ها آشنا شدید.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="inline-block p-4 bg-slate-50 rounded-full text-slate-400 mb-3 border border-slate-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-extrabold text-slate-700 mb-1">مکانی برای مشاهده انتخاب نشده است</h4>
                                    <p className="text-slate-400 text-xs">برای مشاهده اطلاعات تماس کامل و لوکیشن دقیق، یک نماینده یا شهر را از بخش سمت راست انتخاب فرمایید.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            <Footer 
                onNavigateHome={props.onNavigateHome}
                onNavigateToAbout={props.onNavigateToAbout}
                onNavigateToGoals={props.onNavigateToGoals}
                onNavigateToArticles={props.onNavigateToArticles}
                onNavigateToContact={props.onNavigateToContact}
                onNavigateToFAQ={props.onNavigateToFAQ}
                onNavigateToFeedback={props.onNavigateToFeedback}
                onNavigateToPartnership={props.onNavigateToPartnership}
                onNavigateToAdminDashboard={props.onNavigateToAdminDashboard}
                onProductSelect={props.onProductSelect}
            />
        </div>
    );
};

export default StoreLocator;
