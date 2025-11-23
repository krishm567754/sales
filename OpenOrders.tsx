import React from 'react';
import { Order } from '../types';
import { MoreVertical, MessageCircle, Eye } from 'lucide-react';

interface OpenOrdersProps {
  orders: Order[];
}

const OpenOrders: React.FC<OpenOrdersProps> = ({ orders }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white">Open Orders (Live)</h2>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 text-xs uppercase">
                            <th className="p-4">Date</th>
                            <th className="p-4">Party Name</th>
                            <th className="p-4">Item</th>
                            <th className="p-4 text-center">Qty</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 text-slate-500 text-sm whitespace-nowrap">{order.date}</td>
                                <td className="p-4 text-white font-medium">{order.customerName}</td>
                                <td className="p-4 text-slate-300">{order.itemName}</td>
                                <td className="p-4 text-center">
                                    <span className="bg-slate-700 text-white px-2 py-1 rounded text-sm font-mono">{order.quantity}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="relative inline-block text-left group">
                                        <button className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                        {/* Dropdown Menu (Pure CSS Hover for simplicity in this artifact) */}
                                        <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                            <a href="#" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white first:rounded-t-lg">
                                                <Eye size={14} className="mr-2" /> Details
                                            </a>
                                            <a href="#" className="flex items-center px-4 py-2 text-sm text-green-400 hover:bg-slate-700 hover:text-green-300 last:rounded-b-lg">
                                                <MessageCircle size={14} className="mr-2" /> WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default OpenOrders;
