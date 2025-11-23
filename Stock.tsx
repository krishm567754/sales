import React, { useState } from 'react';
import { StockItem } from '../types';
import { Search, Package } from 'lucide-react';

interface StockProps {
  stock: StockItem[];
}

const Stock: React.FC<StockProps> = ({ stock }) => {
  const [search, setSearch] = useState('');

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Stock Status</h2>
          <p className="text-slate-400 text-sm">Real-time inventory levels converted to liters.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search item or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
       </div>

       <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 text-xs uppercase">
                 <th className="p-4">SKU</th>
                 <th className="p-4">Item Name</th>
                 <th className="p-4 text-center">Category</th>
                 <th className="p-4 text-right">Pack Size</th>
                 <th className="p-4 text-right">Boxes</th>
                 <th className="p-4 text-right">Total Liters</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-700">
               {filteredStock.map(item => {
                 const totalLiters = item.quantityBoxes * item.unitsPerBox * item.packSize;
                 return (
                   <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                     <td className="p-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                     <td className="p-4 text-slate-200 font-medium">{item.name}</td>
                     <td className="p-4 text-center">
                       <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                         ${item.category === 'Activ' ? 'bg-green-500/10 text-green-400' :
                           item.category === 'Power1' ? 'bg-yellow-500/10 text-yellow-400' :
                           'bg-slate-700 text-slate-400'
                         }
                       `}>
                         {item.category}
                       </span>
                     </td>
                     <td className="p-4 text-right text-slate-400">{item.packSize} L</td>
                     <td className="p-4 text-right text-slate-300">{item.quantityBoxes}</td>
                     <td className="p-4 text-right font-mono font-bold text-indigo-400">
                       {totalLiters.toLocaleString()} L
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
           {filteredStock.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <Package size={48} className="mb-4 opacity-50" />
                <p>No stock items found.</p>
              </div>
           )}
         </div>
       </div>
    </div>
  );
};

export default Stock;
