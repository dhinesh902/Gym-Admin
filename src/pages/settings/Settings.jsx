import React from 'react';
import { Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your gym's core configurations and preferences.</p>
        </div>
        <button onClick={handleLogout} className="btn-outline border-danger text-danger hover:bg-danger hover:text-white flex items-center gap-2 text-sm">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">General Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gym Name</label>
            <input type="text" className="input-field" defaultValue="FitLife Pro Gym" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
            <input type="email" className="input-field" defaultValue="contact@fitlifepro.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
            <input type="text" className="input-field" defaultValue="+91 98765 43210" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
            <textarea className="input-field min-h-[80px]" defaultValue="123 Fitness Street, Health Zone, Mumbai, 400001" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
            <select className="input-field">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
            <select className="input-field">
              <option value="IST">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
