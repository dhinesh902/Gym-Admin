import React, { useState } from 'react';
import { Bell, UserPlus, CreditCard, Calendar, CheckCircle2, Send, Users, UserCog, Globe, Sparkles } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Membership Expiring Soon', message: 'Rahul Sharma (MEM-001) membership expires in 3 days.', time: '2 hours ago', read: false, icon: Calendar, color: 'text-warning bg-warning/10' },
  { id: 2, type: 'payment', title: 'Payment Received', message: 'Received ₹4,000 from Sneha Patel for Quarterly Pro plan.', time: '5 hours ago', read: false, icon: CreditCard, color: 'text-accent bg-accent/10' },
  { id: 3, type: 'user', title: 'New Member Joined', message: 'Amit Kumar joined the gym with a Half Yearly plan.', time: 'Yesterday', read: true, icon: UserPlus, color: 'text-primary bg-primary/10' },
  { id: 4, type: 'system', title: 'System Update Completed', message: 'The gym admin system was successfully updated to v1.2.', time: '2 days ago', read: true, icon: CheckCircle2, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
];

const Notifications = () => {
  const [recipient, setRecipient] = useState('all');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications & Messages</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Send announcements and view system alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Send Notification Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card overflow-hidden border-0 shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/80 relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
            <div className="bg-transparent p-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Broadcast Message</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reach your gym community instantly</p>
              </div>
            </div>
            <div className="p-5 space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" /> Target Audience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRecipient('all')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${recipient === 'all' ? 'border-transparent bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/80 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] bg-white dark:bg-slate-800'}`}
                  >
                    <Globe className={`h-5 w-5 mb-1.5 ${recipient === 'all' ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold tracking-wide">All</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecipient('members')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${recipient === 'members' ? 'border-transparent bg-gradient-to-br from-secondary to-blue-500 text-white shadow-md shadow-secondary/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/80 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] bg-white dark:bg-slate-800'}`}
                  >
                    <Users className={`h-5 w-5 mb-1.5 ${recipient === 'members' ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold tracking-wide">Members</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecipient('trainers')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${recipient === 'trainers' ? 'border-transparent bg-gradient-to-br from-accent to-purple-500 text-white shadow-md shadow-accent/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-700/80 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] bg-white dark:bg-slate-800'}`}
                  >
                    <UserCog className={`h-5 w-5 mb-1.5 ${recipient === 'trainers' ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold tracking-wide">Trainers</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Title</label>
                <input 
                  type="text" 
                  className="input-field bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-900 transition-colors" 
                  placeholder="e.g., Holiday Schedule Update" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Body</label>
                <textarea 
                  className="input-field min-h-[140px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-900 transition-colors resize-none" 
                  placeholder="Write your announcement here..."
                ></textarea>
              </div>

              <button className="btn-primary w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 group">
                <Sparkles className="h-4 w-4 group-hover:scale-125 transition-transform duration-300" /> 
                <span className="font-bold tracking-wide">Send Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden h-full flex flex-col border-0 shadow-lg shadow-slate-200/40 dark:shadow-none">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-5 border-b border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Bell className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Recent Alerts</h3>
              </div>
              <button className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 group">
                Mark all as read
                <span className="w-0 h-0.5 bg-accent absolute bottom-0 left-0 group-hover:w-full transition-all"></span>
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1 overflow-auto bg-white/50 dark:bg-slate-900/20">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className={`p-5 flex gap-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 group cursor-pointer ${!notif.read ? 'bg-primary/[0.03] dark:bg-primary/[0.02]' : ''}`}>
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${notif.color} group-hover:scale-110 transition-transform duration-300`}>
                    <notif.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 group-hover:translate-x-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`text-sm font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-primary flex-shrink-0 shadow-[0_0_8px_rgba(var(--color-primary),0.6)] animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
