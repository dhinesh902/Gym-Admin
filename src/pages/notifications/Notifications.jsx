import React, { useState } from 'react';
import { Bell, UserPlus, CreditCard, Calendar, CheckCircle2, Send, Users, UserCog, Globe, Sparkles } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Membership Expiring Soon', message: 'Rahul Sharma (MEM-001) membership expires in 3 days.', time: '2 hours ago', read: false, icon: Calendar, color: 'text-yellow-400 bg-yellow-400/10' },
  { id: 2, type: 'payment', title: 'Payment Received', message: 'Received ₹4,000 from Sneha Patel for Quarterly Pro plan.', time: '5 hours ago', read: false, icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 3, type: 'user', title: 'New Member Joined', message: 'Amit Kumar joined the gym with a Half Yearly plan.', time: 'Yesterday', read: true, icon: UserPlus, color: 'text-[#FBBF24] bg-[#FBBF24]/10' },
  { id: 4, type: 'system', title: 'System Update Completed', message: 'The gym admin system was successfully updated to v1.2.', time: '2 days ago', read: true, icon: CheckCircle2, color: 'text-gray-400 bg-gray-800' },
];

const Notifications = () => {
  const [recipient, setRecipient] = useState('all');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Notifications & Messages</h2>
          <p className="text-sm text-gray-400 mt-1">Send announcements and view system alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Send Notification Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#16181d] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/5 rounded-full blur-3xl group-hover:bg-[#FBBF24]/10 transition-colors duration-700"></div>
            
            <div className="p-6 border-b border-gray-800/80 flex items-center gap-3 relative z-10">
              <div className="p-2.5 bg-[#FBBF24]/10 rounded-xl">
                <Send className="h-5 w-5 text-[#FBBF24]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-50 text-lg">Broadcast Message</h3>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Reach your gym instantly</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6 relative z-10">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> Target Audience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRecipient('all')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${recipient === 'all' ? 'border-[#FBBF24] bg-[#FBBF24]/10 text-[#FBBF24] scale-[1.02]' : 'border-gray-800 bg-[#0d0e12] text-gray-500 hover:border-gray-700 hover:bg-white/5'}`}
                  >
                    <Globe className={`h-5 w-5 mb-1.5 ${recipient === 'all' ? 'text-[#FBBF24]' : 'text-gray-500'}`} />
                    <span className="text-[10px] font-bold tracking-wider uppercase">All</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecipient('members')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${recipient === 'members' ? 'border-blue-500 bg-blue-500/10 text-blue-400 scale-[1.02]' : 'border-gray-800 bg-[#0d0e12] text-gray-500 hover:border-gray-700 hover:bg-white/5'}`}
                  >
                    <Users className={`h-5 w-5 mb-1.5 ${recipient === 'members' ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className="text-[10px] font-bold tracking-wider uppercase">Members</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecipient('trainers')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${recipient === 'trainers' ? 'border-purple-500 bg-purple-500/10 text-purple-400 scale-[1.02]' : 'border-gray-800 bg-[#0d0e12] text-gray-500 hover:border-gray-700 hover:bg-white/5'}`}
                  >
                    <UserCog className={`h-5 w-5 mb-1.5 ${recipient === 'trainers' ? 'text-purple-400' : 'text-gray-500'}`} />
                    <span className="text-[10px] font-bold tracking-wider uppercase">Trainers</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Message Title</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner" 
                  placeholder="e.g., Holiday Schedule Update" 
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Message Body</label>
                <textarea 
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors min-h-[120px] shadow-inner resize-none" 
                  placeholder="Write your announcement here..."
                ></textarea>
              </div>

              <button className="w-full bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] group mt-4">
                <Sparkles className="h-4 w-4 group-hover:scale-125 transition-transform duration-300" /> 
                <span className="tracking-wide">Send Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-2">
          <div className="bg-[#16181d] border border-gray-800/80 rounded-2xl overflow-hidden h-full flex flex-col shadow-xl">
            <div className="p-6 border-b border-gray-800/80 flex justify-between items-center bg-[#1a1d24]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <Bell className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-50 text-lg">Recent Alerts</h3>
              </div>
              <button className="text-[11px] font-bold text-[#FBBF24] hover:text-yellow-300 uppercase tracking-wider transition-colors flex items-center gap-1">
                Mark all as read
              </button>
            </div>
            
            <div className="divide-y divide-gray-800/60 flex-1 overflow-auto bg-[#0d0e12]">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className={`p-5 flex gap-4 transition-all duration-300 hover:bg-[#16181d] group cursor-pointer ${!notif.read ? 'bg-[#FBBF24]/[0.02]' : ''}`}>
                  
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 ${notif.color} group-hover:scale-110 transition-transform duration-300`}>
                    <notif.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 group-hover:translate-x-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`text-sm font-bold tracking-wide ${!notif.read ? 'text-[#FBBF24]' : 'text-gray-300'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap ml-2 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-md">{notif.message}</p>
                  </div>
                  
                  {!notif.read && (
                    <div className="w-2 h-2 mt-2 rounded-full bg-[#FBBF24] flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"></div>
                  )}
                </div>
              ))}
              
              {MOCK_NOTIFICATIONS.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-3 text-gray-600 opacity-50" />
                  <p>You have no notifications.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
