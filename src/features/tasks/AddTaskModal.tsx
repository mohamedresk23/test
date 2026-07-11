import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/components/ui/Toast';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export function AddTaskModal({ isOpen, onClose, defaultDate }: AddTaskModalProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const addToast = useToastStore((state) => state.addToast);
  
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<'high' | 'medium' | 'low'>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = React.useState<number | ''>('');
  const [dueDate, setDueDate] = React.useState(defaultDate || '');

  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setEstimatedMinutes('');
      setDueDate(defaultDate || '');
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ title: 'خطأ', message: 'يرجى إدخال عنوان المهمة', type: 'error' });
      return;
    }
    
    try {
      await addTask({
        title,
        description,
        priority,
        estimated_minutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      addToast({ title: 'تم', message: 'تمت إضافة المهمة بنجاح', type: 'success' });
      onClose();
    } catch {
      addToast({ title: 'خطأ', message: 'حدث خطأ أثناء الإضافة', type: 'error' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة مهمة جديدة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">عنوان المهمة <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 focus:ring-primary-500 text-sm p-2 border"
            placeholder="مثال: مراجعة التقرير الشهري..."
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 focus:ring-primary-500 text-sm p-2 border min-h-[80px]"
            placeholder="تفاصيل المهمة (اختياري)..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">الأولوية</label>
            <select 
              value={priority}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 focus:ring-primary-500 text-sm p-2 border"
            >
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">مرتفعة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الوقت المتوقع (بالدقائق)</label>
            <input 
              type="number" 
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 focus:ring-primary-500 text-sm p-2 border"
              placeholder="مثال: 30"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">تاريخ الاستحقاق</label>
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 focus:ring-primary-500 text-sm p-2 border"
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button type="submit">حفظ المهمة</Button>
        </div>
      </form>
    </Modal>
  );
}
