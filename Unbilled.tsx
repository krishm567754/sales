
import React, { useMemo, useState } from 'react';
import { Customer, Invoice } from '../types';
import { User as UserIcon, MapPin, Phone, AlertTriangle, X } from 'lucide-react';
import { EXCLUDED_PRODUCTS_LIST, AUTOCARE_BRANDS_INCLUDE, THRESHOLD_CORE_UNBILLED } from '../services/constants';

interface UnbilledProps {
  customers: Customer[];
  invoices: Invoice[];
}

const Unbilled: React.FC<UnbilledProps> = ({ customers, invoices }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // --- Logic to Identify Unbilled/Under-billed (< 9L Core) ---
  const unbilledCustomers = useMemo(() => {
    // 1. Filter Invoices for Current Month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // 2. Calculate Core Volume Per Customer
    const customerVolumes: Record<string, number> = {};
    
    invoices.forEach(inv => {
        const d = new Date(inv.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
             inv.items.forEach(item => {
                 const name = (item.itemName || '').toUpperCase();
                 const brand = (item.brand || '').toUpperCase();
                 
                 // Exclusion Logic
                 const isExcluded = EXCLUDED_PRODUCTS_LIST.some(ex => name.includes(ex));
                 const isAutocare = AUTOCARE_BRANDS_INCLUDE.some(ac => brand.includes(ac));

                 if (!isExcluded && !isAutocare) {
                     customerVolumes[inv.customerId] = (customerVolumes[inv.customerId] || 0) + item.liters;
                 }
             });
        }
    });

    // 3. Map Customers and Check Threshold
    return customers.map(c => {
        const vol = customerVolumes[c.id] || 0;
        return { ...c, currentCoreVolume: vol };
    }).filter(c => c.currentCoreVolume < THRESHOLD_CORE_UNBILLED);

  }, [customers, invoices]);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Unbilled & Under-Billed Report</h2>
            <p className="text-slate-400 text-sm">
                Customers with <b>Core Product Volume &lt; {THRESHOLD_CORE_UNBILLED} Liters</b> for the current month.
            </p>
            <div className="flex gap-2 mt-2">
                 <span className="text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">Excludes: Autocare</span>
                 <span className="text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">Excludes: Accessories</span>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unbilledCustomers.map(customer => (
                <div 
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-900/10 cursor-pointer transition-all group"
                >
                   <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-red-400 transition-colors">
                            <UserIcon size={20} />
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs font-bold mb-1">
                                <AlertTriangle size={12} className="mr-1" /> Alert
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase">{customer.salesExecutive || 'Unknown SE'}</span>
                        </div>
                   </div>
                   <h3 className="text-lg font-semibold text-white truncate">{customer.name}</h3>
                   <div className="mt-2 space-y-1">
                       <p className="flex items-center text-xs text-slate-500">
                           <MapPin size={12} className="mr-1" /> {customer.location}
                       </p>
                       <p className="flex items-center text-xs text-slate-500">
                           <Phone size={12} className="mr-1" /> {customer.phone}
                       </p>
                   </div>
                   <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center">
                       <span className="text-xs text-slate-400">Core Volume</span>
                       <span className="text-lg font-mono font-bold text-red-400">{(customer as any).currentCoreVolume.toFixed(2)} L</span>
                   </div>
                </div>
            ))}
        </div>
        
        {unbilledCustomers.length === 0 && (
            <div className="p-10 text-center text-slate-500 bg-slate-800 rounded-xl border border-slate-700">
                <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4 opacity-50" />
                <p>Great job! No under-billed customers found for this month.</p>
            </div>
        )}

        {/* Dealer 360 Modal */}
        {selectedCustomer && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
                <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="bg-gradient-to-r from-red-900/50 to-slate-900 p-6 border-b border-slate-800 relative">
                         <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button>
                         <h3 className="text-xl font-bold text-white">{selectedCustomer.name}</h3>
                         <p className="text-red-300 text-sm flex items-center mt-1"><AlertTriangle size={14} className="mr-1"/> Below Threshold ({THRESHOLD_CORE_UNBILLED}L)</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="text-xs text-slate-500">Last Billed</span>
                                <div className="text-white font-medium">{selectedCustomer.lastBilledDate}</div>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="text-xs text-slate-500">Sales Exec</span>
                                <div className="text-white font-medium truncate">{selectedCustomer.salesExecutive}</div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <h4 className="text-sm font-semibold text-white mb-2">Contact Info</h4>
                            <p className="text-slate-400 text-sm">Location: {selectedCustomer.location}</p>
                            <p className="text-slate-400 text-sm">Phone: {selectedCustomer.phone}</p>
                        </div>
                        <button className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 rounded-lg transition-colors">
                            Call Dealer
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// Simple icon for empty state
const CheckCircle2 = ({size, className}: {size:number, className?:string}) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
);

export default Unbilled;
