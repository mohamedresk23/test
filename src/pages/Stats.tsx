import { useTaskStore } from '@/store/taskStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, CheckCircle, Clock, Flame } from 'lucide-react';

export default function Stats() {
  const { tasks } = useTaskStore();

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const highPriorityCompleted = tasks.filter(t => t.status === 'completed' && t.priority === 'high').length;

  const data = [
    { name: 'Sat', completed: 4 },
    { name: 'Sun', completed: 3 },
    { name: 'Mon', completed: 5 },
    { name: 'Tue', completed: 2 },
    { name: 'Wed', completed: 6 },
    { name: 'Thu', completed: 4 },
    { name: 'Fri', completed: 7 },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Statistics & Performance</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your progress and analyze your performance over time.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completed Tasks', val: completedCount, color: 'text-green-600 dark:text-green-500', bg: 'bg-green-100 dark:bg-green-900/40', icon: CheckCircle },
          { label: 'In Progress', val: pendingCount, color: 'text-blue-600 dark:text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40', icon: Clock },
          { label: 'High Priority', val: highPriorityCompleted, color: 'text-amber-600 dark:text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/40', icon: Trophy },
          { label: 'Active Streak', val: 12, color: 'text-orange-600 dark:text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/40', icon: Flame, suffix: ' days' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center gap-2 transition-transform hover:scale-105">
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.val}<span className="text-sm font-normal text-slate-400 rtl:mr-1 ltr:ml-1">{stat.suffix}</span></p>
          </div>
        ))}
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg mb-6">Tasks Completed This Week</h3>
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.2} />
              <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
