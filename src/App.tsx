import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

// Lazy loaded page components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Goals = React.lazy(() => import('./pages/Goals'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Stats = React.lazy(() => import('./pages/Stats'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bold">
          Loading...
        </div>
      }>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="goals" element={<Goals />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="stats" element={<Stats />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
