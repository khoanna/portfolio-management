// app/(dashboard)/layout.tsx
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-foreground text-text">
      <Sidebar />
      <main className="min-h-[100dvh] overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
