import React, { useState } from 'react';
import { Invoice, User } from '../types';
import { Search as SearchIcon, FileText, Filter } from 'lucide-react';

interface SearchProps {
  invoices: Invoice[];
  user: User;
}

const SearchPage: React.FC<SearchProps> = ({ invoices, user }) => {
  const [activeTab, setActiveTab] = useState<'invoice' | 'advanced'>('invoice');
  const [query, setQuery] = useState('');
  const [customerQuery, setCustomerQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');

  const renderResults = () => {
    let results: Invoice[] = [];

    if (activeTab === 'invoice') {
        if (!query) return null;
        results = invoices.filter(inv => inv.invoiceNo.toLowerCase().includes(query.toLowerCase()));
    } else {
        if (!customerQuery && !productQuery) return null;
        results = invoices.filter(inv => {
            const matchCustomer = customerQuery ? inv.customerName.toLowerCase().includes(customerQuery.toLowerCase()) : true;
            const matchProduct = productQuery ? inv.items.some(item => item.itemName.toLowerCase().includes(productQuery.toLowerCase())) : true;
            return matchCustomer && matchProduct;
        });
    }

    if (results.length === 0) {
        return <div className="p-8 text-center text-slate-500">No invoices found matching criteria.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 text-xs uppercase">
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4 text-right">Volume</th>
                        {user.role === 'ADMIN' && <th className="p-4 text-right">Amount</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {results.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-4 text-indigo-400 font-mono text-sm">{inv.invoiceNo}</td>
                            <td className="p-4 text-slate-500 text-sm">{inv.date}</td>
                            <td className="p-4 text-slate-200">{inv.customerName}</td>
                            <td className="p-4 text-right font-bold text-white">{inv.totalLiters} L</td>
                            {user.role === 'ADMIN' && (
                                <td className="p-4 text-right text-emerald-400 font-mono">₹ {inv.totalAmount.toLocaleString()}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white">Master Search Engine</h2>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700">
                <button 
                    onClick={() => setActiveTab('invoice')}
                    className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'invoice' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-750'}`}
                >
                    Search by Invoice No
                </button>
                {user.permissions.advancedSearch && (
                    <button 
                        onClick={() => setActiveTab('advanced')}
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'advanced' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-750'}`}
                    >
                        Customer & Product Search
                    </button>
                )}
            </div>

            <div className="p-6 border-b border-slate-700 bg-slate-850">
                {activeTab === 'invoice' ? (
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Enter Invoice Number (e.g., INV-24-10045)..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="relative">
                            <label className="text-xs text-slate-500 mb-1 block">Customer Name</label>
                            <input 
                                type="text" 
                                placeholder="Start typing customer..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                value={customerQuery}
                                onChange={e => setCustomerQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label className="text-xs text-slate-500 mb-1 block">Product Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Activ, Power1..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                value={productQuery}
                                onChange={e => setProductQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Results Area */}
            <div className="min-h-[200px]">
                {renderResults()}
            </div>
        </div>
    </div>
  );
};

export default SearchPage;
