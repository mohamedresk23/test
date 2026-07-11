import * as React from 'react';
import { Plus, Edit3, Video, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

export function FAB() {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { icon: Edit3, label: 'إضافة مهمة يدوياً', color: 'bg-blue-500 text-white hover:bg-blue-600', onClick: () => console.log('task') },
    { icon: Video, label: 'استيراد من يوتيوب', color: 'bg-red-500 text-white hover:bg-red-600', onClick: () => console.log('yt') },
    { icon: Target, label: 'إضافة هدف', color: 'bg-amber-500 text-white hover:bg-amber-600', onClick: () => console.log('goal') },
    { icon: Clock, label: 'إضافة كتلة زمنية', color: 'bg-green-500 text-white hover:bg-green-600', onClick: () => console.log('time') },
  ];

  return (
    <div className="fixed bottom-24 md:bottom-8 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto z-50 pointer-events-none" ref={menuRef}>
      <div 
        className={cn(
          "absolute bottom-full mb-4 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto flex flex-col items-center gap-3 transition-all duration-300 transform rtl:origin-bottom-left ltr:origin-bottom-right pointer-events-auto",
          isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
        )}
      >
        {actions.map((action, i) => (
          <button 
            key={i} 
            onClick={() => { action.onClick(); setIsOpen(false); }}
            className="flex items-center gap-3 group rtl:flex-row-reverse w-full"
          >
            <span className="hidden md:block px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity">
              {action.label}
            </span>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/10 hover:scale-110 active:scale-95 transition-all text-sm shrink-0", action.color)} title={action.label}>
              <action.icon className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-600/30 transition-transform duration-300 pointer-events-auto",
          isOpen ? "bg-slate-800 dark:bg-slate-700 rotate-45" : "bg-primary-600 hover:bg-primary-700 active:scale-95 hover:scale-105"
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
