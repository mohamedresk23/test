
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Target, CalendarDays, BarChart2, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/tasks', label: 'المهام', icon: CheckSquare },
  { path: '/goals', label: 'الأهداف', icon: Target },
  { path: '/calendar', label: 'التقويم', icon: CalendarDays },
  { path: '/stats', label: 'الإحصائيات', icon: BarChart2 },
];

export function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  
  return (
    <aside className="hidden md:flex flex-col w-64 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-500">TaskFlow <span className="text-slate-900 dark:text-slate-100 font-light">Pro</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            )}
          >
            <item.icon className="w-5 h-5 rtl:ml-3 ltr:mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full",
            isActive 
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          )}
        >
          <Settings className="w-5 h-5 rtl:ml-3 ltr:mr-3" />
          الإعدادات
        </NavLink>
        
        <div className="flex items-center gap-3 px-3 py-2 pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm uppercase shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || 'User'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</span>
          </div>
          <button onClick={clearAuth} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-md transition-colors" title="تسجيل الخروج">
            <LogOut className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </aside>
  );
}
