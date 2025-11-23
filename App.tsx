
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import OpenOrders from './pages/OpenOrders';
import Unbilled from './pages/Unbilled';
import SearchPage from './pages/Search';
import Admin from './pages/Admin';
import { User, UserRole, Invoice, StockItem, Order, Customer } from './types';
import { MOCK_USERS, MOCK_INVOICES, MOCK_STOCK, MOCK_ORDERS, MOCK_CUSTOMERS } from './services/mockData';
import { LogIn, ShieldCheck, Lock, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State (Simulating Backend Database) ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES); // Read-only for this demo
  const [stock] = useState<StockItem[]>(MOCK_STOCK);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Auth Logic
    const user = users.find(u => u.username === loginUsername);
    if (user && user.password === loginPassword) {
      setCurrentUser(user);
    } else {
      setLoginError("Invalid credentials. Please check username and password.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // --- Router Logic ---
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={currentUser!} invoices={invoices} target={currentUser!.targetVolume} />;
      case 'stock':
        return <Stock stock={stock} />;
      case 'orders':
        return <OpenOrders orders={orders} />;
      case 'unbilled':
        return <Unbilled customers={customers} invoices={invoices} />;
      case 'search':
        return <SearchPage invoices={invoices} user={currentUser!} />;
      case 'admin':
        return currentUser?.role === UserRole.ADMIN ? <Admin users={users} setUsers={setUsers} /> : <div className="p-8 text-red-500">Access Denied</div>;
      case 'customers':
         return (
             <div className="space-y-6 animate-fade-in">
                 <h2 className="text-2xl font-bold text-white">Customer Master</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {customers.slice(0,12).map(c => (
                         <div key={c.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                             <h3 className="font-bold text-white">{c.name}</h3>
                             <p className="text-sm text-slate-400">{c.location}</p>
                             <p className="text-xs text-indigo-400 mt-2">{c.phone}</p>
                             <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between">
                                 <span className="text-xs text-slate-500">Sales Exec</span>
                                 <span className="text-xs text-white">{c.salesExecutive}</span>
                             </div>
                         </div>
                     ))}
                 </div>
                 <p className="text-slate-500 text-sm text-center">Showing top 12 customers...</p>
             </div>
         )
      default:
        return <Dashboard user={currentUser!} invoices={invoices} target={currentUser!.targetVolume} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-grid-pattern flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-4xl min-h-[500px] rounded-3xl overflow-hidden flex shadow-2xl animate-fade-in">
          
          {/* Left Side: Brand & Visual */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm"></div>
             <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center"></div>
             
             <div className="relative z-10">
               <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
                 <ShieldCheck className="text-white" size={28} />
               </div>
               <h1 className="text-4xl font-bold text-white mb-2">Laxmi Hybrid</h1>
               <p className="text-indigo-200 text-lg">Next-Gen Distribution ERP</p>
             </div>

             <div className="relative z-10 text-sm text-indigo-300">
               <p>© 2024 Castrol Distribution System</p>
               <p className="opacity-70">Secure. Fast. Reliable.</p>
             </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 bg-slate-950/80 p-8 md:p-12 flex flex-col justify-center relative">
             <div className="text-center md:text-left mb-8">
               <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
               <p className="text-slate-400 mt-2">Please sign in to your account</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-5">
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Username</label>
                 <div className="relative">
                   <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                     type="text" 
                     value={loginUsername}
                     onChange={(e) => setLoginUsername(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                     placeholder="Enter username"
                   />
                 </div>
               </div>
               
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Password</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                     type="password" 
                     value={loginPassword}
                     onChange={(e) => setLoginPassword(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                     placeholder="Enter password"
                   />
                 </div>
               </div>

               {loginError && (
                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                   {loginError}
                 </div>
               )}

               <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-xl shadow-indigo-600/20 mt-2">
                 Sign In
               </button>
             </form>

             <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                  Default credentials: 
                  <span className="text-indigo-400 mx-1">admin / 123</span>
                  <span className="text-indigo-400">rahul / 123</span>
                </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={currentUser} 
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto pb-10">
            {renderPage()}
          </div>
      </main>
    </div>
  );
};

export default App;
