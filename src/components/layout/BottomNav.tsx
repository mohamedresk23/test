
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Target, CalendarDays, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/stats', label: 'Stats', icon: BarChart2 },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full relative group transition-colors",
              isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 mb-1 transition-transform", isActive ? "scale-110" : "group-active:scale-95")} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 w-1/2 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-b-md" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
