import React, { useState } from 'react';
import AdminDashboardSidebar from './AdminDashboardSidebar';
import AdminDashboardHeader from './AdminDashboardHeader';
import { Users, ClipboardList, MessageSquare, MapPin, Menu } from 'lucide-react';
import CustomerManagement from './admin/pages/CustomerManagement';
import CustomerDetail from './admin/pages/CustomerDetail';
import AddCustomerPage from './admin/pages/AddCustomerPage';
import OrderRequests from './admin/pages/OrderRequests';
import SupportTickets from './admin/pages/SupportTickets';
import TicketDetail from './admin/pages/TicketDetail';
import Announcements from './admin/pages/Announcements';
import Settings from './admin/pages/Settings';
import SpecialOffers from './admin/pages/SpecialOffers';
import ProductDiscounts from './admin/pages/ProductDiscounts';
import ProductManagement from './admin/pages/ProductManagement';
import RegisteredProductList from './admin/pages/RegisteredProductList';
import MarketingLoyalty from './admin/pages/MarketingLoyalty';
import PartnershipRequestsView from './admin/pages/PartnershipRequestsView';
import SurveyManagement from './admin/pages/SurveyManagement';
import SalesManagement from './admin/pages/SalesManagement';
import ReferralManagement from './admin/pages/ReferralManagement';
import StoreLocatorManagement from './admin/pages/StoreLocatorManagement';

export type AdminDashboardPage = 
    | 'customer-management' 
    | 'add-customer' 
    | 'order-requests' 
    | 'support-tickets' 
    | 'announcements' 
    | 'settings' 
    | 'special-offers' 
    | 'product-discounts' 
    | 'product-management' 
    | 'registered-products'
    | 'marketing-loyalty'
    | 'partnership-requests'
    | 'colleague-referrals'
    | 'sales-management'
    | 'store-locator-management'
    | 'surveys';

const AdminDashboard = ({ 
    onNavigateHome, 
    representatives,
    setRepresentatives,
    configuredCities,
    setConfiguredCities,
    customers, 
    setCustomers,
    onUpdateCustomer,
    tickets, 
    setTickets, 
    announcements, 
    setAnnouncements,
    orderRequests,
    setOrderRequests,
    partnershipRequests,
    onApproveRequest,
    specialOffers,
    setSpecialOffers,
    salesClosures,
    setSalesClosures,
    productDiscounts,
    setProductDiscounts,
    products,
    setProducts,
    marketingSettings,
    setMarketingSettings,
    surveys,
    setSurveys,
    surveyResponses,
    setSurveyResponses,
    colleagueReferrals,
    setColleagueReferrals
}: {
    onNavigateHome: () => void;
    representatives: any[];
    setRepresentatives: React.Dispatch<React.SetStateAction<any[]>>;
    configuredCities: any[];
    setConfiguredCities: React.Dispatch<React.SetStateAction<any[]>>;
    customers: any[];
    setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
    onUpdateCustomer: (id: any, updates: any) => void;
    tickets: any[];
    setTickets: React.Dispatch<React.SetStateAction<any[]>>;
    announcements: any[];
    setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
    orderRequests: any[];
    setOrderRequests: React.Dispatch<React.SetStateAction<any[]>>;
    onApproveRequest: (id: any) => void;
    partnershipRequests: any[];
    specialOffers: any[];
    setSpecialOffers: React.Dispatch<React.SetStateAction<any[]>>;
    salesClosures?: any[];
    setSalesClosures: React.Dispatch<React.SetStateAction<any[]>>;
    productDiscounts: any[];
    setProductDiscounts: React.Dispatch<React.SetStateAction<any[]>>;
    products: any[];
    setProducts: React.Dispatch<React.SetStateAction<any[]>>;
    marketingSettings: any;
    setMarketingSettings: React.Dispatch<React.SetStateAction<any>>;
    surveys: any[];
    setSurveys: React.Dispatch<React.SetStateAction<any[]>>;
    surveyResponses: any[];
    setSurveyResponses: React.Dispatch<React.SetStateAction<any[]>>;
    colleagueReferrals: any[];
    setColleagueReferrals: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
    const [activePage, setActivePage] = useState<AdminDashboardPage>('customer-management');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    const pendingRequestsCount = orderRequests.filter(req => req.status === 'در انتظار تایید').length;
    const modifiedDateCount = orderRequests.filter(req => req.dateModified).length;
    const totalNotifications = pendingRequestsCount + modifiedDateCount;

    const handleAddCustomer = (newCustomer) => {
        setCustomers(prev => [...prev, { id: `CUS-${Math.floor(Math.random() * 9000) + 1000}`, ...newCustomer }]);
        setActivePage('customer-management');
    };

    const handleAdminReply = (ticketId, replyText) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId ? {
                    ...ticket,
                    status: 'پاسخ داده شده',
                    date: new Date().toLocaleDateString('fa-IR'),
                    messages: [...ticket.messages, { sender: 'admin', text: replyText, timestamp: new Date().toLocaleString('fa-IR') }]
                } : ticket
            )
        );
    };

    const handleSendAnnouncement = ({ title, content, type, customerIds }) => {
        const timestamp = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        let currentId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) : 0;

        if (type === 'public') {
            const newAnnouncement = {
                id: currentId + 1,
                title,
                content,
                type: 'public',
                customerId: null,
                timestamp,
                isRead: false
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        } else if (type === 'specific' && customerIds && customerIds.length > 0) {
            const newAnnouncements = customerIds.map((cId) => {
                currentId++;
                return {
                    id: currentId,
                    title,
                    content,
                    type: 'specific',
                    customerId: cId,
                    timestamp,
                    isRead: false
                };
            });
            setAnnouncements(prev => [...newAnnouncements, ...prev]);
        }
    };
    
    const handleDeleteAnnouncement = (announcementId) => {
        setAnnouncements(prev => prev.filter(ann => ann.id !== announcementId));
    };

    const handleArchiveAnnouncement = (announcementId) => {
        setAnnouncements(prev => prev.map(ann => 
            ann.id === announcementId ? { ...ann, isArchived: !ann.isArchived } : ann
        ));
    };

    const handleSendSpecialOffer = ({ productName, discount, imageUrl, type, customerIds }) => {
        const timestamp = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        let currentId = specialOffers.length > 0 ? Math.max(...specialOffers.map(o => o.id)) : 0;

        if (type === 'public') {
            const newOffer = {
                id: currentId + 1,
                productName,
                discount,
                imageUrl,
                type: 'public',
                customerId: null,
                timestamp,
            };
            setSpecialOffers(prev => [newOffer, ...prev]);
        } else if (type === 'specific' && customerIds && customerIds.length > 0) {
            const newOffers = customerIds.map((cId) => {
                currentId++;
                return {
                    id: currentId,
                    productName,
                    discount,
                    imageUrl,
                    type: 'specific',
                    customerId: cId,
                    timestamp,
                };
            });
            setSpecialOffers(prev => [...newOffers, ...prev]);
        }
    };

    const handleDeleteSpecialOffer = (offerId) => {
        setSpecialOffers(prev => prev.filter(o => o.id !== offerId));
    };
    
    const handleAddProductDiscount = (newDiscount) => {
        const nextId = productDiscounts.length > 0 ? Math.max(...productDiscounts.map(d => d.id)) + 1 : 1;
        setProductDiscounts(prev => [...prev, { id: nextId, ...newDiscount }]);
    };
    
    const handleDeleteProductDiscount = (discountId) => {
        setProductDiscounts(prev => prev.filter(d => d.id !== discountId));
    };


    const renderActivePage = () => {
        if (selectedTicket) {
            return <TicketDetail 
                ticket={selectedTicket} 
                onBack={() => setSelectedTicketId(null)}
                onReply={handleAdminReply}
            />;
        }

        if (selectedCustomer) {
            return <CustomerDetail 
                customer={selectedCustomer} 
                onBack={() => setSelectedCustomer(null)}
                onUpdate={onUpdateCustomer}
            />;
        }

        switch (activePage) {
            case 'customer-management':
                return <CustomerManagement 
                            customers={customers}
                            onManageCustomer={setSelectedCustomer} 
                            onAddCustomerClick={() => setActivePage('add-customer')}
                        />;
            case 'add-customer':
                return <AddCustomerPage
                            onBack={() => setActivePage('customer-management')}
                            onAdd={handleAddCustomer}
                        />;
            case 'order-requests':
                return <OrderRequests requests={orderRequests} setRequests={setOrderRequests} onApprove={onApproveRequest} products={products} />;
            case 'support-tickets':
                return <SupportTickets tickets={tickets} onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)} />;
            case 'announcements':
                return <Announcements 
                            announcements={announcements}
                            onSend={handleSendAnnouncement} 
                            onDelete={handleDeleteAnnouncement}
                            onArchive={handleArchiveAnnouncement}
                            customers={customers}
                        />;
            case 'special-offers':
                return <SpecialOffers 
                            offers={specialOffers}
                            onSend={handleSendSpecialOffer}
                            onDelete={handleDeleteSpecialOffer}
                            customers={customers}
                            products={products}
                        />;
            case 'product-discounts':
                return <ProductDiscounts 
                            discounts={productDiscounts}
                            onAdd={handleAddProductDiscount}
                            onDelete={handleDeleteProductDiscount}
                            customers={customers}
                            products={products}
                        />;
            case 'product-management':
                return <ProductManagement 
                            products={products}
                            setProducts={setProducts}
                            customers={customers}
                        />;
            case 'registered-products':
                return <RegisteredProductList
                            products={products}
                            setProducts={setProducts}
                            customers={customers}
                        />;
            case 'marketing-loyalty':
                return <MarketingLoyalty
                            settings={marketingSettings}
                            onSaveSettings={setMarketingSettings}
                            customers={customers}
                            orderRequests={orderRequests}
                        />;
            case 'partnership-requests':
                return <PartnershipRequestsView requests={partnershipRequests} />;
            case 'colleague-referrals':
                return <ReferralManagement
                            referrals={colleagueReferrals}
                            setReferrals={setColleagueReferrals}
                            customers={customers}
                            setCustomers={setCustomers}
                            announcements={announcements}
                            setAnnouncements={setAnnouncements}
                            marketingSettings={marketingSettings}
                            setMarketingSettings={setMarketingSettings}
                        />;
            case 'sales-management':
                return <SalesManagement 
                            closures={salesClosures}
                            onSend={(closure) => {
                                const newClosure = { id: Date.now(), timestamp: new Date().toLocaleString('fa-IR'), ...closure };
                                setSalesClosures(prev => [newClosure, ...prev]);
                            }}
                            onDelete={(id) => {
                                setSalesClosures(prev => prev.filter(c => c.id !== id));
                            }}
                            customers={customers}
                        />;
            case 'store-locator-management':
                return <StoreLocatorManagement 
                            representatives={representatives}
                            setRepresentatives={setRepresentatives}
                            configuredCities={configuredCities}
                            setConfiguredCities={setConfiguredCities}
                        />;
            case 'surveys':
                return <SurveyManagement surveys={surveys} responses={surveyResponses} setSurveys={setSurveys} />;
            case 'settings':
                return <Settings />;
            default:
                return <CustomerManagement 
                            customers={customers}
                            onManageCustomer={setSelectedCustomer} 
                            onAddCustomerClick={() => setActivePage('add-customer')} 
                        />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-slate-700 font-poppins selection:bg-[#5d87ff]/10" dir="rtl">
            <AdminDashboardSidebar 
                activePage={activePage} 
                onNavigate={(page) => {
                    setSelectedCustomer(null);
                    setSelectedTicketId(null);
                    setActivePage(page);
                }}
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                notificationCount={totalNotifications}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminDashboardHeader 
                    onToggleMobileSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                    onNavigateHome={onNavigateHome}
                    notificationCount={totalNotifications}
                    activePage={activePage}
                    onNavigate={(page) => {
                        setSelectedCustomer(null);
                        setSelectedTicketId(null);
                        setActivePage(page as any);
                    }}
                    hasDetailOpen={!!selectedCustomer || !!selectedTicketId}
                    onBackFromDetail={() => {
                        setSelectedCustomer(null);
                        setSelectedTicketId(null);
                    }}
                    detailTitle={
                        selectedCustomer 
                            ? `مشتری: ${(selectedCustomer as any).shopName || (selectedCustomer as any).name}` 
                            : selectedTicket 
                                ? `پاسخ تیکت #${(selectedTicket as any).id}` 
                                : undefined
                    }
                />
                <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto pb-24 lg:pb-8">
                    {renderActivePage()}
                </main>
            </div>

            {/* Premium Mobile Bottom Navigation Bar - Optimized for Android viewports */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center lg:hidden py-2 px-1 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe-bottom">
                <button 
                    onClick={() => {
                        setSelectedCustomer(null);
                        setSelectedTicketId(null);
                        setActivePage('customer-management');
                    }}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all active:scale-90 ${
                        activePage === 'customer-management' && !selectedCustomer && !selectedTicketId 
                            ? 'text-[#5d87ff] font-extrabold' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Users size={20} className={activePage === 'customer-management' && !selectedCustomer && !selectedTicketId ? 'scale-110 text-[#5d87ff]' : ''} />
                    <span className="text-[9px] font-bold">مشتریان</span>
                </button>

                <button 
                    onClick={() => {
                        setSelectedCustomer(null);
                        setSelectedTicketId(null);
                        setActivePage('order-requests');
                    }}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all active:scale-90 relative ${
                        activePage === 'order-requests' 
                            ? 'text-[#5d87ff] font-extrabold' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <ClipboardList size={20} className={activePage === 'order-requests' ? 'scale-110 text-[#5d87ff]' : ''} />
                    {totalNotifications > 0 && (
                        <span className="absolute top-1 right-6 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                    <span className="text-[9px] font-bold">سفارشات</span>
                </button>

                <button 
                    onClick={() => {
                        setSelectedCustomer(null);
                        setSelectedTicketId(null);
                        setActivePage('support-tickets');
                    }}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all active:scale-90 ${
                        activePage === 'support-tickets' 
                            ? 'text-[#5d87ff] font-extrabold' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <MessageSquare size={20} className={activePage === 'support-tickets' ? 'scale-110 text-[#5d87ff]' : ''} />
                    <span className="text-[9px] font-bold">تیکت‌ها</span>
                </button>

                <button 
                    onClick={() => {
                        setSelectedCustomer(null);
                        setSelectedTicketId(null);
                        setActivePage('store-locator-management');
                    }}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all active:scale-90 ${
                        activePage === 'store-locator-management' 
                            ? 'text-[#5d87ff] font-extrabold' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <MapPin size={20} className={activePage === 'store-locator-management' ? 'scale-110 text-[#5d87ff]' : ''} />
                    <span className="text-[9px] font-bold">نقاط فروش</span>
                </button>

                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                >
                    <Menu size={20} />
                    <span className="text-[9px] font-bold">سایر منو</span>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;