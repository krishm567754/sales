
import React, { useState } from 'react';
import { User, UserRole, SystemConfig } from '../types';
import { Plus, Trash2, Edit2, CheckSquare, Square, UploadCloud, Database, FileSpreadsheet, RefreshCw, Server, Shield, Building, Save } from 'lucide-react';

interface AdminProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Admin: React.FC<AdminProps> = ({ users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'data' | 'settings'>('users');
  
  // New User State
  const [newUser, setNewUser] = useState<Partial<User>>({
      name: '', 
      username: '',
      password: '', // New password field
      salesExecutiveName: '',
      role: UserRole.SALES, 
      targetVolume: 0,
      permissions: { viewStock: true, advancedSearch: false, viewUnbilled: true, manageData: false }
  });

  // System Settings State
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
      companyName: 'Laxmi Hybrid ERP',
      logoUrl: '',
      maintenanceMode: false
  });

  // Mock upload states
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'idle' | 'uploading' | 'done'}>({
      'sales': 'idle',
      'stock': 'idle',
      'orders': 'idle'
  });

  const handleAddUser = () => {
      if(!newUser.name || !newUser.username || !newUser.password) {
          alert("Name, Username and Password are required!");
          return;
      }
      
      const userToAdd: User = {
          id: `u${Date.now()}`,
          name: newUser.name!,
          username: newUser.username!,
          password: newUser.password!,
          salesExecutiveName: newUser.salesExecutiveName || '',
          role: newUser.role as UserRole,
          targetVolume: newUser.targetVolume || 0,
          permissions: newUser.permissions || { viewStock: false, advancedSearch: false, viewUnbilled: false, manageData: false }
      };

      setUsers([...users, userToAdd]);
      // Reset form
      setNewUser({ 
          name: '', username: '', password: '', salesExecutiveName: '', role: UserRole.SALES, targetVolume: 0, 
          permissions: { viewStock: true, advancedSearch: false, viewUnbilled: true, manageData: false } 
      });
  };

  const togglePermission = (key: keyof typeof newUser.permissions) => {
      if (!newUser.permissions) return;
      setNewUser({
          ...newUser,
          permissions: { ...newUser.permissions, [key]: !newUser.permissions[key] }
      });
  };

  const deleteUser = (id: string) => {
      if (confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(u => u.id !== id));
      }
  }

  const simulateUpload = (type: string) => {
      setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
      setTimeout(() => {
          setUploadStatus(prev => ({ ...prev, [type]: 'done' }));
      }, 2000);
  };

  const FileUploadCard = ({ title, desc, fileType, statusKey }: { title: string, desc: string, fileType: string, statusKey: string }) => (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-between h-full hover:border-indigo-500/50 transition-colors">
        <div>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-slate-900 rounded-lg text-indigo-400">
                    <FileSpreadsheet size={24} />
                </div>
                {uploadStatus[statusKey] === 'done' ? (
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Synced</span>
                ) : (
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Needs Sync</span>
                )}
            </div>
            <h4 className="font-bold text-white text-lg">{title}</h4>
            <p className="text-slate-400 text-sm mt-1">{desc}</p>
            <div className="mt-3 text-xs text-slate-500 font-mono bg-slate-900 p-2 rounded border border-slate-800 break-all">
                /uploads/{fileType}
            </div>
        </div>
        <button 
            onClick={() => simulateUpload(statusKey)}
            disabled={uploadStatus[statusKey] === 'uploading'}
            className="mt-6 w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-all disabled:opacity-50"
        >
            {uploadStatus[statusKey] === 'uploading' ? (
                <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Uploading...</span>
                </>
            ) : (
                <>
                    <UploadCloud size={18} />
                    <span>Select File</span>
                </>
            )}
        </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Admin Control Panel</h2>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    User Management
                </button>
                <button 
                    onClick={() => setActiveTab('data')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'data' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Data Center
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    System Settings
                </button>
            </div>
        </div>

        {activeTab === 'users' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Create User Form */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
                    <div className="flex items-center space-x-2 mb-4">
                        <Shield className="text-indigo-400" size={20} />
                        <h3 className="text-lg font-semibold text-white">Add New User</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Display Name</label>
                                <input 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1 focus:border-indigo-500 focus:outline-none" 
                                    placeholder="e.g. Rahul V"
                                    value={newUser.name}
                                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 ml-1">Username</label>
                                <input 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1 focus:border-indigo-500 focus:outline-none" 
                                    placeholder="e.g. rahul123"
                                    value={newUser.username}
                                    onChange={e => setNewUser({...newUser, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 ml-1">Password</label>
                            <input 
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1 focus:border-indigo-500 focus:outline-none" 
                                placeholder="Set initial password"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs text-slate-400 ml-1">Excel Report Name Mapping</label>
                            <input 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1 focus:border-indigo-500 focus:outline-none" 
                                placeholder="Exact name from Sales Report (e.g. RAHUL VERMA)"
                                value={newUser.salesExecutiveName}
                                onChange={e => setNewUser({...newUser, salesExecutiveName: e.target.value})}
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Links this user to specific rows in the Excel sales dump.</p>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-slate-400 ml-1">Role</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1"
                                    value={newUser.role}
                                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                >
                                    <option value="SALES">Sales Executive</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="text-xs text-slate-400 ml-1">Target (L)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1 focus:border-indigo-500 focus:outline-none"
                                    value={newUser.targetVolume}
                                    onChange={e => setNewUser({...newUser, targetVolume: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Access Permissions</label>
                            <div className="space-y-2">
                                <div 
                                    className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white"
                                    onClick={() => togglePermission('viewStock')}
                                >
                                    {newUser.permissions?.viewStock ? <CheckSquare size={16} className="text-indigo-400 mr-2"/> : <Square size={16} className="text-slate-600 mr-2"/>}
                                    View Stock Status
                                </div>
                                <div 
                                    className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white"
                                    onClick={() => togglePermission('advancedSearch')}
                                >
                                    {newUser.permissions?.advancedSearch ? <CheckSquare size={16} className="text-indigo-400 mr-2"/> : <Square size={16} className="text-slate-600 mr-2"/>}
                                    Access Global Search
                                </div>
                                <div 
                                    className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white"
                                    onClick={() => togglePermission('viewUnbilled')}
                                >
                                    {newUser.permissions?.viewUnbilled ? <CheckSquare size={16} className="text-indigo-400 mr-2"/> : <Square size={16} className="text-slate-600 mr-2"/>}
                                    View Unbilled Reports
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddUser}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center mt-4 shadow-lg shadow-indigo-600/20"
                        >
                            <Plus size={18} className="mr-2" /> Create User
                        </button>
                    </div>
                </div>

                {/* User List */}
                <div className="xl:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 text-xs uppercase">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Report Mapping</th>
                                <th className="p-4 text-center">Permissions</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="text-white font-medium">{u.name}</div>
                                        <div className="text-xs text-slate-500">@{u.username} • <span className="text-indigo-400">{u.role}</span></div>
                                    </td>
                                    <td className="p-4">
                                        {u.salesExecutiveName ? (
                                            <span className="text-sm text-emerald-400 font-mono bg-emerald-400/10 px-2 py-1 rounded">{u.salesExecutiveName}</span>
                                        ) : (
                                            <span className="text-xs text-slate-600 italic">Not Linked</span>
                                        )}
                                        <div className="text-xs text-slate-500 mt-1">Target: {u.targetVolume.toLocaleString()} L</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center space-x-1">
                                            {u.permissions.viewStock && <div className="w-2 h-2 rounded-full bg-blue-400" title="Stock"></div>}
                                            {u.permissions.advancedSearch && <div className="w-2 h-2 rounded-full bg-purple-400" title="Search"></div>}
                                            {u.permissions.viewUnbilled && <div className="w-2 h-2 rounded-full bg-red-400" title="Unbilled"></div>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-slate-700 rounded-full transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : activeTab === 'data' ? (
            // DATA CENTER TAB
            <div className="space-y-6">
                 <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-start space-x-3">
                     <Server className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                     <div>
                         <h4 className="text-blue-400 font-bold text-sm uppercase">Hybrid Backend Connection</h4>
                         <p className="text-slate-400 text-sm mt-1">
                             Files uploaded here are sent to the <code>/uploads</code> folder on your PHP server. 
                             The system will automatically run <code>sync.php</code> to update the dashboard JSON.
                         </p>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <FileUploadCard 
                        title="Sales Dump" 
                        desc="Main sales history. Used for KPI, Trends, and History."
                        fileType="sales_dump.xlsx"
                        statusKey="sales"
                     />
                     <FileUploadCard 
                        title="Stock Data" 
                        desc="Current inventory status from Tally/ERP."
                        fileType="StockData.xlsx"
                        statusKey="stock"
                     />
                     <FileUploadCard 
                        title="Open Orders" 
                        desc="Pending orders list for the 'Open Orders' tab."
                        fileType="Open_Sales_Order.csv"
                        statusKey="orders"
                     />
                 </div>
            </div>
        ) : (
            // SETTINGS TAB
            <div className="max-w-2xl bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <Building className="text-indigo-400" size={24} />
                    <h3 className="text-xl font-bold text-white">System Configuration</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-300">Company Name</label>
                        <input 
                            value={systemConfig.companyName}
                            onChange={e => setSystemConfig({...systemConfig, companyName: e.target.value})}
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300">Logo URL (Optional)</label>
                        <input 
                            value={systemConfig.logoUrl}
                            onChange={e => setSystemConfig({...systemConfig, logoUrl: e.target.value})}
                            placeholder="https://example.com/logo.png"
                            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <p className="text-white font-medium">Maintenance Mode</p>
                            <p className="text-xs text-slate-500">Disable access for non-admin users</p>
                        </div>
                        <div 
                            onClick={() => setSystemConfig({...systemConfig, maintenanceMode: !systemConfig.maintenanceMode})}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${systemConfig.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${systemConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all">
                        <Save size={18} className="mr-2" /> Save Settings
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Admin;
