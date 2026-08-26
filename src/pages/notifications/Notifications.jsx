import React from 'react';
import { Bell, UserPlus, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Membership Expiring Soon', message: 'Rahul Sharma (MEM-001) membership expires in 3 days.', time: '2 hours ago', read: false, icon: Calendar, color: 'text-warning bg-warning/10' },
  { id: 2, type: 'payment', title: 'Payment Received', message: 'Received ₹4,000 from Sneha Patel for Quarterly Pro plan.', time: '5 hours ago', read: false, icon: CreditCard, color: 'text-accent bg-accent/10' },
  { id: 3, type: 'user', title: 'New Member Joined', message: 'Amit Kumar joined the gym with a Half Yearly plan.', time: 'Yesterday', read: true, icon: UserPlus, color: 'text-primary bg-primary/10' },
  { id: 4, type: 'system', title: 'System Update Completed', message: 'The gym admin system was successfully updated to v1.2.', time: '2 days ago', read: true, icon: CheckCircle2, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
];

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Stay updated with what's happening in your gym.</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!notif.read ? 'bg-primary/5 dark:bg-primary/5' : ''}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                <notif.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-semibold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
