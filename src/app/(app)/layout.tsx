import { auth } from "@/auth";
import { Sidebar } from "@/components/Sidebar";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={user?.role} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-700">
              {user?.name ?? user?.email}
            </div>
            {user?.role && (
              <div className="text-xs text-slate-400">{user.role}</div>
            )}
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
