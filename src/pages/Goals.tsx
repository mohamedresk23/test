import * as React from 'react';
import { useGoalStore } from '@/store/goalStore';
import { Button } from '@/components/ui/Button';
import { Target, Plus, Trash2 } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { useToastStore } from '@/components/ui/Toast';

export default function Goals() {
  const { goals, addGoal, updateProgress, deleteGoal } = useGoalStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [targetDate, setTargetDate] = React.useState('');
  const addToast = useToastStore(s => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return addToast({ title: 'خطأ', message: 'يرجى إدخال عنوان الهدف', type: 'error' });
    addGoal({ title, target_date: targetDate });
    setIsModalOpen(false);
    setTitle('');
    addToast({ title: 'نجاح', message: 'تم إضافة الهدف', type: 'success' });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">أهدافك الممتدة</h1>
          <p className="text-slate-500 dark:text-slate-400">سجل طموحاتك وقسمها لخطوات نرى تقدمها.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 rtl:ml-2 ltr:mr-2" /> إضافة هدف
        </Button>
      </header>
      
      <div className="flex-1">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">لا توجد أهداف نشطة</h3>
            <p className="text-sm text-slate-500 mb-4">حدد وجهتك وابدأ العمل للوصول لها.</p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>سجل أول أهدافك</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-primary-300 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.target_date && <p className="text-xs text-slate-500 mt-1">المستهدف: {goal.target_date}</p>}
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-slate-400 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-slate-400">نسبة الإنجاز</span>
                    <span className="text-primary-600">{goal.progress}%</span>
                  </div>
                  <ProgressBar value={goal.progress} colorClass="bg-primary-500" />
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" className="border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" size="sm" onClick={() => updateProgress(goal.id, Math.max(goal.progress - 10, 0))}>-10%</Button>
                  <Button variant="ghost" size="sm" onClick={() => updateProgress(goal.id, Math.min(goal.progress + 10, 100))} className="bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400">+10% إنجاز</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة هدف جديد">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان الهدف <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border-slate-300 bg-white dark:bg-slate-800 p-2 border text-sm"
              placeholder="مثال: إطلاق المشروع..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">تاريخ التحقيق المستهدف (اختياري)</label>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-md border-slate-300 bg-white dark:bg-slate-800 p-2 border text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button type="submit">حفظ الهدف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
