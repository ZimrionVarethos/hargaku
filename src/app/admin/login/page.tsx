import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminLoginShowcase } from '@/components/admin/AdminLoginShowcase';

export const metadata: Metadata = {
  title: 'Masuk Konsol Admin · HargaKu',
  description:
    'Portal autentikasi petugas pemantau pasar untuk pengelolaan data komoditas dan moderasi.',
};

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-paper)] text-[var(--text-primary)] flex items-center justify-center p-3 sm:p-6 lg:p-8 transition-colors">
      <div className="w-full max-w-5xl min-h-[640px] market-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 hidden lg:block">
          <AdminLoginShowcase />
        </div>

        <div className="lg:col-span-5 bg-[var(--bg-paper)] lg:border-l-2 border-[var(--border-ink)] p-6 sm:p-10 flex flex-col justify-center items-center">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
