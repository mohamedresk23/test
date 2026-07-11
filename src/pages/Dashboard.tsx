
import { useAuthStore } from '@/store/authStore';
import { Target, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">
          مرحباً بك، <span className="text-primary-600">{user?.name?.split(' ')[0] || 'المستخدم'}</span> 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          إليك ملخص سريع لمهامك وأهدافك اليوم.
        </p>
      </header>

      {/* Quick Add Task */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 items-center">
        <input 
          type="text" 
          placeholder="إضافة مهمة سريعة..." 
          className="flex-1 bg-transparent border-0 focus:ring-0 text-sm md:text-base outline-none pr-2 rtl:pl-2 ltr:pr-2 dark:placeholder-slate-500 w-full"
        />
        <Button size="sm" className="whitespace-nowrap w-fit rounded-full px-6">حفظ</Button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Ring Widget */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 col-span-1 md:col-span-2">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="40" className="stroke-primary-500 z-10 transition-all duration-1000 ease-out" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset="100.48" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold">60%</span>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-lg">إنجاز اليوم</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">لقد أنجزت 3 من أصل 5 مهام اليوم.</p>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium pt-1">+ 45 دقيقة عمل مركز</p>
          </div>
        </section>

        {/* Streak Widget */}
        <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-md text-white flex flex-col justify-center items-center gap-2">
          <Flame className="w-10 h-10 text-yellow-200 drop-shadow-md" />
          <h3 className="font-bold text-2xl font-mono">12 <span className="text-base font-normal">يوم</span></h3>
          <p className="text-amber-100 text-sm">شعلة النشاط الحالية</p>
        </section>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upcoming Tasks */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              المهام القادمة
            </h3>
            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full font-medium">1 متأخرة</span>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {[1, 2, 3].map(i => (
              <div key={i} className="py-3 flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 mt-0.5 cursor-pointer hover:border-green-500 transition-colors"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium group-hover:text-primary-600 transition-colors">مراجعة كود التحديث الأخير ({i})</p>
                  <p className="text-xs text-slate-500">اليوم, 3:00 م</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Goals */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            الأهداف النشطة
          </h3>
          <div className="space-y-4 pt-2">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">تعلم اللغة الإنجليزية</span>
                  <span className="text-xs font-bold text-primary-600">75%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-primary-500 h-full rounded-full w-[75%]"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
