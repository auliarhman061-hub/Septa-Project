// ══════════════════════════════════════════════
// Dashboard Layout
// Sistem Informasi Akademik SMP
//
// Layout utama untuk semua dashboard role.
// Sidebar dan topbar berubah sesuai role user.
// Auth protection dilakukan oleh middleware.
// ══════════════════════════════════════════════

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import Sidebar from "@/components/layout/sidebar";
import Topbar, { AppFooter } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const role = user.role as Role;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar (Client Component — handles active link) */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <Topbar user={user} role={role} />

        {/* Page Content */}
        <div className="p-8 flex-1">{children}</div>

        {/* Footer */}
        <AppFooter />
      </main>
    </div>
  );
}