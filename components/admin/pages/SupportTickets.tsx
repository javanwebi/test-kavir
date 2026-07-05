
import React from 'react';

const getStatusClass = (status) => {
    if (status === 'بسته شده') return 'bg-gray-100 text-gray-700';
    if (status === 'پاسخ داده شده') return 'bg-green-100 text-green-700';
    return 'bg-amber-100 text-amber-700';
};

const SupportTickets = ({ tickets, onSelectTicket }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">پشتیبانی فنی</h1>
            <p className="mt-1 text-gray-500">تیکت‌های ارسال شده توسط مشتریان را مدیریت کنید.</p>

            <div className="hidden md:block mt-8 bg-white rounded-xl border border-slate-150 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-right text-gray-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-bold">شماره تیکت</th>
                            <th scope="col" className="px-6 py-4 font-bold">نام مشتری</th>
                            <th scope="col" className="px-6 py-4 font-bold">موضوع</th>
                            <th scope="col" className="px-6 py-4 font-bold">آخرین بروزرسانی</th>
                            <th scope="col" className="px-6 py-4 font-bold">وضعیت</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} onClick={() => onSelectTicket(ticket)} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                                <th scope="row" className="px-6 py-4 font-black text-[#5d87ff] whitespace-nowrap">
                                    {ticket.id}
                                </th>
                                <td className="px-6 py-4 font-semibold text-slate-700">{ticket.customerName}</td>
                                <td className="px-6 py-4 text-slate-800 font-bold">{ticket.subject}</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{ticket.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${getStatusClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Touch-Optimized Cards (No horizontal scroll needed!) */}
            <div className="md:hidden mt-6 space-y-4">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.id} 
                        onClick={() => onSelectTicket(ticket)}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-3 hover:border-[#5d87ff]/40 active:scale-[0.99] transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-slate-400">شناسه: #{ticket.id}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg ${getStatusClass(ticket.status)}`}>
                                {ticket.status}
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="font-extrabold text-slate-800 text-sm leading-snug">{ticket.subject}</p>
                            <p className="text-xs text-slate-500 font-semibold">{ticket.customerName}</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-50">
                            <span className="font-bold">آخرین بروزرسانی:</span>
                            <span className="font-mono">{ticket.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupportTickets;
