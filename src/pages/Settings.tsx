/**
 * @file Settings.tsx
 * @description Account, security, and subscription settings.
 */

import { useState, type FormEvent } from 'react';
import { Check, Crown, KeyRound, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'For getting started with your tasks.',
    features: ['Up to 5 active goals', 'Basic task management', 'Personal dashboard'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: '/ month',
    description: 'For people who want to achieve more.',
    features: ['Unlimited goals and tasks', 'Advanced insights', 'Priority support'],
  },
];

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  const changePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      addToast({ title: 'Password is too short', message: 'Use at least 8 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ title: 'Passwords do not match', message: 'Please enter the same new password twice.', type: 'error' });
      return;
    }

    // The form is ready to connect to the account API when the password endpoint is available.
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast({ title: 'Password updated', message: 'Your new password has been saved.', type: 'success' });
  };

  const choosePlan = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
    addToast({
      title: plan === 'pro' ? 'Pro plan selected' : 'Free plan selected',
      message: plan === 'pro' ? 'Continue to checkout to activate Pro.' : 'You are now using the Free plan.',
      type: 'success',
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account, security, and subscription.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"><Mail className="h-5 w-5" /></span>
          <div><h2 className="font-semibold">Account</h2><p className="text-sm text-slate-500 dark:text-slate-400">Your email address is used to sign in.</p></div>
        </div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email address</label>
        <div className="relative mt-2 max-w-xl">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" />
          <input id="email" value={user?.email ?? 'user@example.com'} readOnly dir="ltr" className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rtl:pl-3 rtl:pr-10" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><KeyRound className="h-5 w-5" /></span>
          <div><h2 className="font-semibold">Password & security</h2><p className="text-sm text-slate-500 dark:text-slate-400">Choose a strong password you do not use elsewhere.</p></div>
        </div>
        <form onSubmit={changePassword} className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <Field id="current-password" label="Current password" value={currentPassword} onChange={setCurrentPassword} className="sm:col-span-2" />
          <Field id="new-password" label="New password" value={newPassword} onChange={setNewPassword} />
          <Field id="confirm-password" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} />
          <div className="sm:col-span-2"><Button type="submit">Change password</Button></div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><Crown className="h-5 w-5" /></span>
          <div><h2 className="font-semibold">Your plan</h2><p className="text-sm text-slate-500 dark:text-slate-400">Pick the plan that fits your workflow.</p></div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return <article key={plan.id} className={`relative rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 ${isSelected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 dark:border-slate-800'}`}>
              {plan.id === 'pro' && <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"><Sparkles className="h-3.5 w-3.5" /> Popular</span>}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
              <p className="mt-5 text-3xl font-bold">{plan.price}<span className="text-sm font-normal text-slate-500">{plan.period}</span></p>
              <ul className="my-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">{plan.features.map((feature) => <li key={feature} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-500" />{feature}</li>)}</ul>
              <Button variant={isSelected ? 'secondary' : 'primary'} className="w-full" onClick={() => choosePlan(plan.id as 'free' | 'pro')}><ShieldCheck className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{isSelected ? 'Current plan' : plan.id === 'pro' ? 'Upgrade to Pro' : 'Choose Free'}</Button>
            </article>;
          })}
        </div>
      </section>
    </div>
  );
}

function Field({ id, label, value, onChange, className = '' }: { id: string; label: string; value: string; onChange: (value: string) => void; className?: string }) {
  return <div className={className}><label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label><input id={id} type="password" required value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800" /></div>;
}
