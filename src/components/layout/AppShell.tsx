
/**
 * @file AppShell.tsx
 * @description Master structural layout container for the TaskFlow application.
 * Wraps persistent UI navigation elements (`Sidebar` on desktop, `BottomNav` on mobile,
 * and floating action button `FAB`) around the active route view (`<Outlet />`).
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { FAB } from './FAB';
import { ToastContainer } from '@/components/ui/Toast';

/**
 * AppShell Component
 * 
 * Renders the primary application structure and manages scrollable content regions.
 * Also mounts the global `<ToastContainer />` for application-wide alerts.
 */
export function AppShell() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 flex flex-col relative w-full pb-16 md:pb-0 h-screen overflow-y-auto overflow-x-hidden">
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <FAB />
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
