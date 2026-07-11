import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import arLocale from '@fullcalendar/core/locales/ar-sa';
import './calendar.css';
import { useTaskStore } from '@/store/taskStore';
import { AddTaskModal } from '@/features/tasks/AddTaskModal';

export default function Calendar() {
  const { tasks, loadTasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>();

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const events = tasks.filter(t => t.due_date).map(t => ({
    id: t.id,
    title: t.title,
    start: t.due_date,
    allDay: !t.due_date?.includes('T'),
    backgroundColor: t.status === 'completed' ? '#10b981' : '#3b82f6',
    borderColor: 'transparent',
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in h-[calc(100vh-120px)] flex flex-col pt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">التقويم</h1>
          <p className="text-slate-500 dark:text-slate-400">نظرة شاملة لجدولك الزمني.</p>
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-2 sm:p-4 overflow-hidden calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[arLocale]}
          locale="ar-sa"
          direction="rtl"
          headerToolbar={{
            right: 'prev,next today',
            center: 'title',
            left: 'dayGridMonth,timeGridWeek'
          }}
          events={events}
          dateClick={handleDateClick}
          height="100%"
          navLinks={true}
        />
      </div>
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDate={selectedDate} 
      />
    </div>
  );
}
