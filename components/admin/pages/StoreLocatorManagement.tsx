import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    Plus, Edit, Trash2, MapPin, X, Save, Phone, User, Clock, Video, Image, Search, Globe, Building, CheckCircle, Info, Upload, Link, AlertTriangle 
} from 'lucide-react';

// Fix default leaflet icon issue using CDN paths to avoid TS import errors
const AdminMarkerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map click events and update form coordinates
function MapClickSelector({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelectLocation(e.latlng.lat, e.latlng.lng);
        }
    });
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

interface ConfiguredCity {
    name: string;
    country: string;
}

interface StoreLocatorManagementProps {
    representatives: Representative[];
    setRepresentatives: React.Dispatch<React.SetStateAction<Representative[]>>;
    configuredCities: ConfiguredCity[];
    setConfiguredCities: React.Dispatch<React.SetStateAction<ConfiguredCity[]>>;
}

const StoreLocatorManagement: React.FC<StoreLocatorManagementProps> = ({ 
    representatives, 
    setRepresentatives,
    configuredCities,
    setConfiguredCities
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
    const [selectedCityFilter, setSelectedCityFilter] = useState('');
    
    // Active Admin Tab (Reps list vs Cities management)
    const [activeTab, setActiveTab] = useState<'reps' | 'cities'>('reps');
    
    // Form States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRep, setEditingRep] = useState<Representative | null>(null);
    
    const [formName, setFormName] = useState('');
    const [formCountry, setFormCountry] = useState('ایران');
    const [formCity, setFormCity] = useState('');
    const [formCitySelectionMode, setFormCitySelectionMode] = useState<'select' | 'manual'>('select');
    
    // Media Input Modes (upload file vs enter url link)
    const [imageInputMode, setImageInputMode] = useState<'link' | 'upload'>('link');
    const [videoInputMode, setVideoInputMode] = useState<'link' | 'upload'>('link');
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [uploadWarning, setUploadWarning] = useState<string | null>(null);

    // New City Form State (inside Cities management tab)
    const [newCityName, setNewCityName] = useState('');
    const [newCityCountry, setNewCityCountry] = useState('ایران');

    const [formPhone, setFormPhone] = useState('');
    const [formMobile, setFormMobile] = useState('');
    const [formAddress, setFormAddress] = useState('');
    const [formLat, setFormLat] = useState(35.6892); // Default to Tehran
    const [formLng, setFormLng] = useState(51.3890);
    const [formManager, setFormManager] = useState('');
    const [formHours, setFormHours] = useState('۸:۰۰ الی ۱۷:۳۰');
    const [formStatus, setFormStatus] = useState('فعال');
    const [formShopfrontImage, setFormShopfrontImage] = useState('');
    const [formVideoUrl, setFormVideoUrl] = useState('');

    // Prepopulate filters unique countries and cities
    const uniqueCountries = useMemo(() => {
        const set = new Set([
            ...representatives.map(r => r.country || 'ایران'),
            ...(configuredCities || []).map(c => c.country || 'ایران')
        ]);
        return Array.from(set).filter(Boolean);
    }, [representatives, configuredCities]);

    const uniqueCities = useMemo(() => {
        const set = new Set([
            ...representatives.map(r => r.city),
            ...(configuredCities || []).map(c => c.name)
        ]);
        return Array.from(set).filter(Boolean);
    }, [representatives, configuredCities]);

    // Filtered Representatives
    const filteredReps = useMemo(() => {
        return representatives.filter(rep => {
            const matchesSearch = 
                rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rep.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rep.address.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCountry = selectedCountryFilter ? (rep.country || 'ایران') === selectedCountryFilter : true;
            const matchesCity = selectedCityFilter ? rep.city === selectedCityFilter : true;
            
            return matchesSearch && matchesCountry && matchesCity;
        });
    }, [representatives, searchQuery, selectedCountryFilter, selectedCityFilter]);

    // Handle Image upload converting to Base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImageUploading(true);
        setUploadWarning(null);

        if (file.size > 2 * 1024 * 1024) {
            setUploadWarning('حجم فایل تصویر بیش از ۲ مگابایت است. برای ذخیره‌سازی محلی لطفاً فایلی با حجم کمتر انتخاب کنید.');
            setIsImageUploading(false);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormShopfrontImage(reader.result as string);
            setIsImageUploading(false);
        };
        reader.onerror = () => {
            alert('خطا در خواندن فایل تصویر');
            setIsImageUploading(false);
        };
        reader.readAsDataURL(file);
    };

    // Handle Video upload converting to Base64
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsVideoUploading(true);
        setUploadWarning(null);

        if (file.size > 5 * 1024 * 1024) {
            setUploadWarning('حجم ویدیو بیش از ۵ مگابایت است. لطفاً برای کارکرد روان از ویدیوهای کم‌حجم‌تر استفاده کنید یا آدرس آپارات وارد کنید.');
            setIsVideoUploading(false);
            return;
        } else if (file.size > 2 * 1024 * 1024) {
            setUploadWarning('هشدار: فایل انتخابی بزرگتر از ۲ مگابایت است. ممکن است ذخیره‌سازی مرورگر کمی طول بکشد.');
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormVideoUrl(reader.result as string);
            setIsVideoUploading(false);
        };
        reader.onerror = () => {
            alert('خطا در خواندن فایل ویدیو');
            setIsVideoUploading(false);
        };
        reader.readAsDataURL(file);
    };

    // Handle Open Add Form
    const handleOpenAdd = () => {
        setEditingRep(null);
        setFormName('');
        setFormCountry('ایران');
        setFormCity('');
        setFormCitySelectionMode('select');
        setFormPhone('');
        setFormMobile('');
        setFormAddress('');
        setFormLat(35.6892);
        setFormLng(51.3890);
        setFormManager('');
        setFormHours('۸:۰۰ الی ۱۷:۳۰');
        setFormStatus('فعال');
        setFormShopfrontImage('');
        setFormVideoUrl('');
        setImageInputMode('link');
        setVideoInputMode('link');
        setUploadWarning(null);
        setIsFormOpen(true);
    };

    // Handle Open Edit Form
    const handleOpenEdit = (rep: Representative) => {
        setEditingRep(rep);
        setFormName(rep.name);
        setFormCountry(rep.country || 'ایران');
        setFormCity(rep.city);
        
        const isPredefined = (configuredCities || []).some(c => c.name.toLowerCase() === rep.city.toLowerCase());
        setFormCitySelectionMode(isPredefined ? 'select' : 'manual');
        
        setFormPhone(rep.phone);
        setFormMobile(rep.mobile);
        setFormAddress(rep.address);
        setFormLat(rep.lat);
        setFormLng(rep.lng);
        setFormManager(rep.manager);
        setFormHours(rep.hours);
        setFormStatus(rep.status);
        setFormShopfrontImage(rep.shopfrontImage || '');
        setFormVideoUrl(rep.videoUrl || '');
        setImageInputMode(rep.shopfrontImage?.startsWith('data:') ? 'upload' : 'link');
        setVideoInputMode(rep.videoUrl?.startsWith('data:') ? 'upload' : 'link');
        setUploadWarning(null);
        setIsFormOpen(true);
    };

    // Handle Delete Representative
    const handleDelete = (id: number) => {
        if (confirm('آیا از حذف این نقطه فروش اطمینان دارید؟')) {
            setRepresentatives(prev => prev.filter(r => r.id !== id));
        }
    };

    // Form submission
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formName || !formCity || !formAddress || !formManager || !formPhone) {
            alert('لطفاً فیلدهای ضروری ستاره‌دار را تکمیل کنید.');
            return;
        }

        const repData = {
            name: formName,
            country: formCountry,
            city: formCity,
            phone: formPhone,
            mobile: formMobile,
            address: formAddress,
            lat: Number(formLat),
            lng: Number(formLng),
            manager: formManager,
            hours: formHours,
            status: formStatus,
            shopfrontImage: formShopfrontImage,
            videoUrl: formVideoUrl
        };

        // If the city is newly added or not inside configuredCities, append automatically to allow filtering on front-end!
        const trimmedCity = formCity.trim();
        const trimmedCountry = formCountry.trim() || 'ایران';
        if (trimmedCity) {
            const alreadyExists = (configuredCities || []).some(
                c => c.name.toLowerCase() === trimmedCity.toLowerCase()
            );
            if (!alreadyExists) {
                setConfiguredCities(prev => [...prev, { name: trimmedCity, country: trimmedCountry }]);
            }
        }

        if (editingRep) {
            // Update existing
            setRepresentatives(prev => prev.map(r => r.id === editingRep.id ? { ...r, ...repData } : r));
        } else {
            // Add new
            const newId = representatives.length > 0 ? Math.max(...representatives.map(r => r.id)) + 1 : 1;
            setRepresentatives(prev => [...prev, { id: newId, ...repData }]);
        }

        setIsFormOpen(false);
    };

    // Quick preset location setter (Tehran, Isfahan, Mashhad, Shiraz, Kerman, etc.)
    const handleCityPresetChange = (cityName: string) => {
        setFormCity(cityName);
        const presets: Record<string, [number, number]> = {
            'تهران': [35.6892, 51.3890],
            'کرمان': [30.2839, 57.0834],
            'شیراز': [29.5918, 52.5836],
            'مشهد': [36.2972, 59.6067],
            'کرج': [35.8327, 50.9915],
            'یزد': [31.8974, 54.3569],
            'اصفهان': [32.6546, 51.6680],
            'تبریز': [38.0962, 46.2731],
        };
        if (presets[cityName]) {
            setFormLat(presets[cityName][0]);
            setFormLng(presets[cityName][1]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header section with Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">مدیریت نقاط فروش و نمایندگی‌ها</h1>
                    <p className="text-sm text-slate-500 mt-1">تعریف موقعیت‌های جغرافیایی، اطلاعات تماس، عکس و ویدیوی نمایندگان رسمی شرکت</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab(activeTab === 'reps' ? 'cities' : 'reps')}
                        className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                        {activeTab === 'reps' ? 'مدیریت شهرهای هدف' : 'مشاهده لیست نمایندگان'}
                    </button>
                    <button 
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 bg-[#5d87ff] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#5d87ff]/20 hover:bg-[#4570e6] transition-all"
                    >
                        <Plus size={16} />
                        افزودن نقطه فروش جدید
                    </button>
                </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-slate-200 gap-1 bg-slate-100/50 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('reps')}
                    className={`flex-1 py-2.5 text-center rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'reps'
                            ? 'bg-white text-[#5d87ff] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    لیست نقاط فروش و نمایندگی‌ها ({representatives.length})
                </button>
                <button
                    onClick={() => setActiveTab('cities')}
                    className={`flex-1 py-2.5 text-center rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'cities'
                            ? 'bg-white text-[#5d87ff] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    مدیریت شهرهای هدف ({configuredCities.length})
                </button>
            </div>

            {/* Cities Management Panel */}
            {activeTab === 'cities' && (
                <div className="space-y-6">
                    {/* Add City Form */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
                            <Plus size={16} className="text-[#5d87ff]" />
                            افزودن شهر و کشور جدید به لیست اهداف
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!newCityName.trim()) {
                                alert('لطفاً نام شهر را وارد کنید.');
                                return;
                            }
                            const exists = (configuredCities || []).some(
                                c => c.name.toLowerCase() === newCityName.trim().toLowerCase()
                            );
                            if (exists) {
                                alert('این شهر قبلاً در سیستم ثبت شده است.');
                                return;
                            }
                            setConfiguredCities(prev => [...prev, { name: newCityName.trim(), country: newCityCountry.trim() || 'ایران' }]);
                            setNewCityName('');
                        }} className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1.5 w-full">
                                <label className="block text-[11px] font-bold text-slate-600">نام شهر (مثلا: بندرعباس) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={newCityName}
                                    onChange={(e) => setNewCityName(e.target.value)}
                                    placeholder="نام شهر را وارد کنید"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5d87ff]"
                                />
                            </div>
                            <div className="flex-1 space-y-1.5 w-full">
                                <label className="block text-[11px] font-bold text-slate-600">کشور (مثلا: ایران)</label>
                                <input
                                    type="text"
                                    value={newCityCountry}
                                    onChange={(e) => setNewCityCountry(e.target.value)}
                                    placeholder="ایران"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5d87ff]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#5d87ff] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#4570e6] shadow-lg shadow-[#5d87ff]/10 flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
                            >
                                <Plus size={14} />
                                افزودن شهر هدف
                            </button>
                        </form>
                    </div>

                    {/* Cities List */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <span className="text-xs font-black text-slate-800">لیست شهرهای هدف فعال در سامانه</span>
                            <span className="text-[10px] font-bold text-slate-400">حذف یک شهر آن را از لیست گزینش فیلترها و فرم‌ها برمی‌دارد.</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {(configuredCities || []).map((city, index) => (
                                <div key={index} className="p-4 flex justify-between items-center hover:bg-slate-50/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#5d87ff]/10 text-[#5d87ff] p-2.5 rounded-xl">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-xs">{city.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{city.country || 'ایران'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm(`آیا از حذف شهر "${city.name}" اطمینان دارید؟`)) {
                                                setConfiguredCities(prev => prev.filter((_, idx) => idx !== index));
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all"
                                        title="حذف شهر"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {(configuredCities || []).length === 0 && (
                                <div className="text-center py-12 text-slate-400 text-xs">
                                    هیچ شهری تعریف نشده است. لطفاً شهرهای فعال را اضافه کنید.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Representatives Management Panel */}
            {activeTab === 'reps' && (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="bg-[#5d87ff]/10 p-3 rounded-xl text-[#5d87ff]">
                                <Building size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold">کل مراکز ثبت شده</p>
                                <p className="text-lg font-extrabold text-slate-800 mt-0.5">{representatives.length} شعبه / فروشگاه</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold">تعداد شهرهای فعال</p>
                                <p className="text-lg font-extrabold text-slate-800 mt-0.5">{uniqueCities.length} شهر</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                                <Globe size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold">تعداد کشورهای فعال</p>
                                <p className="text-lg font-extrabold text-slate-800 mt-0.5">{uniqueCountries.length} کشور</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                                <Video size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold">نمایش ویدیو یا عکس سردر</p>
                                <p className="text-lg font-extrabold text-slate-800 mt-0.5">
                                    {representatives.filter(r => r.shopfrontImage || r.videoUrl).length} مورد مدیا دار
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute right-3.5 top-3 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="جستجو در نام فروشگاه، مدیر، آدرس..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pr-10 pl-4 py-2.5 text-xs focus:outline-none focus:border-[#5d87ff] focus:ring-4 focus:ring-[#5d87ff]/10 transition-all"
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto shrink-0">
                            <select
                                value={selectedCountryFilter}
                                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                                className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#5d87ff] font-semibold text-slate-700"
                            >
                                <option value="">همه کشورها</option>
                                {uniqueCountries.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <select
                                value={selectedCityFilter}
                                onChange={(e) => setSelectedCityFilter(e.target.value)}
                                className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#5d87ff] font-semibold text-slate-700"
                            >
                                <option value="">همه شهرها</option>
                                {uniqueCities.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table of representatives */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        {/* Mobile Touch-Optimized Cards (Hidden on desktop/tablet) */}
                        <div className="md:hidden space-y-4 p-4">
                            {filteredReps.map((rep) => (
                                <div key={rep.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-extrabold text-slate-400 text-xs mb-1 block">#{rep.id}</span>
                                            <p className="font-bold text-slate-800 text-sm">{rep.name}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button 
                                                onClick={() => handleOpenEdit(rep)}
                                                className="p-1.5 text-slate-500 hover:text-[#5d87ff] bg-slate-50 hover:bg-slate-100 rounded-lg transition-all"
                                                title="ویرایش"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(rep.id)}
                                                className="p-1.5 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
                                                title="حذف"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{rep.address}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-50 py-2">
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">شهر / کشور</span>
                                            <span className="font-bold text-slate-700">{rep.city}</span> <span className="text-[10px] text-slate-400">({rep.country || 'ایران'})</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">مدیریت</span>
                                            <span className="font-bold text-slate-700">{rep.manager}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">تلفن</span>
                                            <span className="font-medium text-slate-600" dir="ltr">{rep.phone}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">موبایل</span>
                                            <span className="font-medium text-slate-600" dir="ltr">{rep.mobile}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {rep.shopfrontImage ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold border border-indigo-100">
                                                <Image size={12} />
                                                عکس سردر
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-bold bg-slate-50 px-2 py-1 rounded-lg">بدون عکس</span>
                                        )}
                                        {rep.videoUrl ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-lg font-bold border border-purple-100">
                                                <Video size={12} />
                                                ویدیو
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                            {filteredReps.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-xs">
                                    هیچ موردی مطابق با فیلترها و جستجوی شما یافت نشد.
                                </div>
                            )}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold border-b border-slate-100">
                                        <th className="p-4">شناسه</th>
                                        <th className="p-4">عنوان فروشگاه / نمایندگی</th>
                                        <th className="p-4">موقعیت</th>
                                        <th className="p-4">مدیریت</th>
                                        <th className="p-4">تلفن‌های ارتباطی</th>
                                        <th className="p-4">مدیا (عکس / فیلم)</th>
                                        <th className="p-4 text-center">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredReps.map((rep) => (
                                        <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-bold text-slate-400">#{rep.id}</td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-bold text-slate-800">{rep.name}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{rep.address}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[11px] font-extrabold text-slate-700">{rep.city}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold">{rep.country || 'ایران'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-700">{rep.manager}</td>
                                            <td className="p-4">
                                                <div className="text-[10px] space-y-1" dir="ltr">
                                                    <p className="font-medium text-slate-600"><span className="text-slate-400">تلفن:</span> {rep.phone}</p>
                                                    <p className="font-medium text-slate-600"><span className="text-slate-400">همراه:</span> {rep.mobile}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {rep.shopfrontImage ? (
                                                        <span className="inline-flex items-center gap-1 text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                                                            <Image size={10} />
                                                            عکس سردر
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] text-slate-300 font-bold">بدون عکس</span>
                                                    )}
                                                    {rep.videoUrl ? (
                                                        <span className="inline-flex items-center gap-1 text-[9px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-bold border border-purple-100">
                                                            <Video size={10} />
                                                            ویدیو
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button 
                                                        onClick={() => handleOpenEdit(rep)}
                                                        className="p-2 text-slate-500 hover:text-[#5d87ff] hover:bg-slate-50 rounded-xl transition-all"
                                                        title="ویرایش"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(rep.id)}
                                                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="حذف"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReps.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                                                هیچ موردی مطابق با فیلترها و جستجوی شما یافت نشد.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Add / Edit */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-sm font-black text-slate-800">
                                    {editingRep ? `ویرایش اطلاعات نمایندگی "${editingRep.name}"` : 'افزودن شعبه یا نماینده فروش جدید'}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1">مشخصات کامل جغرافیایی، موقعیت نقشه و راه‌های ارتباطی را وارد فرمایید.</p>
                            </div>
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body with form */}
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">نام کامل فروشگاه / نمایندگی <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder="مانند: بازرگانی لوله و اتصالات ایساتیس یزد"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff] focus:ring-2 focus:ring-[#5d87ff]/10"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">کشور <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formCountry}
                                                onChange={(e) => setFormCountry(e.target.value)}
                                                placeholder="مانند: ایران"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-[11px] font-bold text-slate-700">شهر <span className="text-red-500">*</span></label>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormCitySelectionMode(formCitySelectionMode === 'select' ? 'manual' : 'select')}
                                                    className="text-[9px] text-[#5d87ff] hover:underline font-bold"
                                                >
                                                    {formCitySelectionMode === 'select' ? 'ورود دستی شهر جدید' : 'انتخاب از لیست'}
                                                </button>
                                            </div>
                                            {formCitySelectionMode === 'select' ? (
                                                <select
                                                    required
                                                    value={formCity}
                                                    onChange={(e) => handleCityPresetChange(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                                >
                                                    <option value="">-- انتخاب شهر هدف --</option>
                                                    {(configuredCities || []).map(c => (
                                                        <option key={c.name} value={c.name}>{c.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={formCity}
                                                    onChange={(e) => handleCityPresetChange(e.target.value)}
                                                    placeholder="مانند: بندرعباس"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                                />
                                            )}
                                            <span className="text-[9px] text-slate-400 block mt-1">با انتخاب شهر، نقشه خودکار زوم می‌شود.</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">نام مدیر شعبه <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formManager}
                                                onChange={(e) => setFormManager(e.target.value)}
                                                placeholder="مانند: مهندس کرمانی پور"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">وضعیت شعبه</label>
                                            <select
                                                value={formStatus}
                                                onChange={(e) => setFormStatus(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                            >
                                                <option value="فعال">فعال</option>
                                                <option value="فعال - شعبه رسمی">فعال - شعبه رسمی</option>
                                                <option value="فعال - نماینده انحصاری">فعال - نماینده انحصاری</option>
                                                <option value="غیرفعال">غیرفعال</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">تلفن ثابت <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formPhone}
                                                onChange={(e) => setFormPhone(e.target.value)}
                                                placeholder="۰۳۴-۳۲۲۴۴۵۵"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                                dir="ltr"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">تلفن همراه پشتیبانی</label>
                                            <input 
                                                type="text" 
                                                value={formMobile}
                                                onChange={(e) => setFormMobile(e.target.value)}
                                                placeholder="۰۹۱۳۱۲۳۴۵۶۷"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">ساعات کاری پذیرش</label>
                                        <input 
                                            type="text" 
                                            value={formHours}
                                            onChange={(e) => setFormHours(e.target.value)}
                                            placeholder="مانند: ۸:۰۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۰:۳۰"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">نشانی دقیق پستی <span className="text-red-500">*</span></label>
                                        <textarea 
                                            required
                                            value={formAddress}
                                            onChange={(e) => setFormAddress(e.target.value)}
                                            placeholder="کرمان، بلوار جمهوری اسلامی، بعد از چهارراه شفا..."
                                            rows={2}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#5d87ff] resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Map Selection & Dynamic Links Column */}
                                <div className="space-y-4">
                                    {/* MAP */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="block text-[11px] font-bold text-slate-700">انتخاب موقعیت روی نقشه <span className="text-[#5d87ff]">(کلیک کنید)</span></label>
                                            <span className="text-[10px] text-slate-400 font-bold">طول و عرض جغرافیایی</span>
                                        </div>

                                        <div className="h-[180px] w-full rounded-2xl border border-slate-200 overflow-hidden relative z-10">
                                            <MapContainer 
                                                center={[formLat, formLng]} 
                                                zoom={12} 
                                                style={{ height: '100%', width: '100%' }}
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                                />
                                                <MapClickSelector onSelectLocation={(lat, lng) => {
                                                    setFormLat(Number(lat.toFixed(6)));
                                                    setFormLng(Number(lng.toFixed(6)));
                                                }} />
                                                <Marker position={[formLat, formLng]} icon={AdminMarkerIcon} />
                                            </MapContainer>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-2 text-[10px]">
                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between">
                                                <span className="text-slate-400 font-bold">Latitude (عرض):</span>
                                                <span className="font-mono text-slate-800 font-semibold">{formLat}</span>
                                            </div>
                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between">
                                                <span className="text-slate-400 font-bold">Longitude (طول):</span>
                                                <span className="font-mono text-slate-800 font-semibold">{formLng}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media Uploads & Links */}
                                    <div className="space-y-4">
                                        {/* Shopfront Image Input */}
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-[11px] font-black text-slate-700">عکس سردر مغازه / نمایندگی</label>
                                                <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[9px] font-bold">
                                                    <button
                                                        type="button"
                                                        onClick={() => setImageInputMode('link')}
                                                        className={`px-2 py-0.5 rounded transition-all ${imageInputMode === 'link' ? 'bg-white text-[#5d87ff] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                    >
                                                        لینک آدرس
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setImageInputMode('upload')}
                                                        className={`px-2 py-0.5 rounded transition-all ${imageInputMode === 'upload' ? 'bg-white text-[#5d87ff] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                    >
                                                        آپلود تصویر
                                                    </button>
                                                </div>
                                            </div>

                                            {imageInputMode === 'link' ? (
                                                <div className="relative">
                                                    <Link className="absolute right-3 top-2.5 text-slate-400" size={14} />
                                                    <input 
                                                        type="url" 
                                                        value={formShopfrontImage.startsWith('data:') ? '' : formShopfrontImage}
                                                        onChange={(e) => setFormShopfrontImage(e.target.value)}
                                                        placeholder="https://images.unsplash.com/... یا لینک عکس"
                                                        className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                                        dir="ltr"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="border border-dashed border-slate-300 hover:border-[#5d87ff]/50 rounded-2xl p-4 text-center cursor-pointer transition-all bg-white relative">
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                        <Upload className="mx-auto text-slate-400 mb-1" size={20} />
                                                        <p className="text-[11px] text-slate-500 font-bold">انتخاب فایل تصویر سردر</p>
                                                        <p className="text-[9px] text-slate-400">حداکثر حجم فایل: ۲ مگابایت</p>
                                                    </div>
                                                </div>
                                            )}

                                            {formShopfrontImage && (
                                                <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                                    <img 
                                                        src={formShopfrontImage} 
                                                        alt="Shopfront Preview" 
                                                        className="w-full h-full object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormShopfrontImage('')}
                                                            className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 font-bold text-[10px] flex items-center gap-1 shadow-md transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                            حذف عکس
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Video Input */}
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-[11px] font-black text-slate-700">ویدیوی معرفی نماینده</label>
                                                <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[9px] font-bold">
                                                    <button
                                                        type="button"
                                                        onClick={() => setVideoInputMode('link')}
                                                        className={`px-2 py-0.5 rounded transition-all ${videoInputMode === 'link' ? 'bg-white text-[#5d87ff] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                    >
                                                        لینک ویدیو / آپارات
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setVideoInputMode('upload')}
                                                        className={`px-2 py-0.5 rounded transition-all ${videoInputMode === 'upload' ? 'bg-white text-[#5d87ff] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                    >
                                                        آپلود مستقیم فایل
                                                    </button>
                                                </div>
                                            </div>

                                            {videoInputMode === 'link' ? (
                                                <div className="relative">
                                                    <Video className="absolute right-3 top-2.5 text-slate-400" size={14} />
                                                    <input 
                                                        type="url" 
                                                        value={formVideoUrl.startsWith('data:') ? '' : formVideoUrl}
                                                        onChange={(e) => setFormVideoUrl(e.target.value)}
                                                        placeholder="https://aparat.com/v/... یا فایل ویدیو"
                                                        className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-[#5d87ff]"
                                                        dir="ltr"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="border border-dashed border-slate-300 hover:border-[#5d87ff]/50 rounded-2xl p-4 text-center cursor-pointer transition-all bg-white relative">
                                                        <input 
                                                            type="file" 
                                                            accept="video/*"
                                                            onChange={handleVideoUpload}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                        <Upload className="mx-auto text-slate-400 mb-1" size={20} />
                                                        <p className="text-[11px] text-slate-500 font-bold">انتخاب فایل ویدیو معرفی</p>
                                                        <p className="text-[9px] text-slate-400">حداکثر حجم فایل: ۵ مگابایت</p>
                                                    </div>
                                                </div>
                                            )}

                                            {uploadWarning && (
                                                <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl text-[10px] font-bold border border-amber-100 flex items-start gap-1.5">
                                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                                    <span>{uploadWarning}</span>
                                                </div>
                                            )}

                                            {formVideoUrl && (
                                                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-700 font-bold">
                                                        <Video className="text-purple-500" size={14} />
                                                        <span className="truncate max-w-[150px]">{formVideoUrl.startsWith('data:') ? 'فایل ویدیوی آپلود شده' : 'آدرس ویدیو ذخیره شد'}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormVideoUrl('')}
                                                        className="text-red-500 hover:text-red-600 font-bold text-[10px] hover:bg-red-50 px-2 py-0.5 rounded transition-all"
                                                    >
                                                        حذف ویدیو
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Banner */}
                            <div className="bg-blue-50 text-blue-800 text-[11px] font-semibold p-3.5 rounded-xl border border-blue-100 flex items-start gap-2">
                                <Info size={16} className="shrink-0 mt-0.5" />
                                <span>پس از ذخیره‌سازی، این اطلاعات در صفحه اصلی و نقشه زنده برای کاربران نمایش داده می‌شود و امکان فیلتر بر اساس کشور و شهر مربوطه برای آن‌ها مهیا خواهد شد.</span>
                            </div>

                            {/* Actions footer */}
                            <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#5d87ff] hover:bg-[#4570e6] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#5d87ff]/10 flex items-center gap-1.5 transition-all"
                                >
                                    <Save size={14} />
                                    ذخیره‌سازی اطلاعات
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreLocatorManagement;
