import { MainHeader } from '@/components/main-header';
import { AuthGuard } from '@/components/auth-guard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <MainHeader />
        <main className="flex-1 container py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
