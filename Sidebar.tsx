import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, UserX, Search, Users, Settings, LogOut, FileText } from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, user, onLogout }) => {
  const NavItem = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentPage === page 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-indigo-500 rounded-md"></div>
            <h1 className="text-xl font-bold text-white tracking-tight">Laxmi Hybrid</h1>
        </div>
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Welcome</p>
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-indigo-400 mt-1">{user.role}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <NavItem page="dashboard" icon={LayoutDashboard} label="Analysis Hub" />
        <NavItem page="orders" icon={ShoppingCart} label="Open Orders" />
        
        {user.permissions.viewStock && (
          <NavItem page="stock" icon={Package} label="Stock Status" />
        )}
        
        {user.permissions.viewUnbilled && (
          <NavItem page="unbilled" icon={UserX} label="Unbilled List" />
        )}
        
        <NavItem page="search" icon={Search} label="Master Search" />
        <NavItem page="customers" icon={Users} label="Customer Master" />
        
        {user.role === UserRole.ADMIN && (
          <NavItem page="admin" icon={Settings} label="Admin Panel" />
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
