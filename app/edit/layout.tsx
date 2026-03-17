'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpenTextIcon,
  CalendarClockIcon,
  Layers,
  LayoutDashboard,
  LetterTextIcon,
  LogOut,
  Menu,
  Users,
  Image,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { href: '/edit',             label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/edit/members',     label: 'Members',            icon: Users },
  { href: '/edit/pages',       label: 'Pages & Content',    icon: Layers },
  { href: '/edit/events',      label: 'Events & Programs',  icon: CalendarClockIcon },
  { href: '/edit/resources',   label: 'Resources',          icon: BookOpenTextIcon },
  { href: '/edit/newsletters', label: 'Newsletters',        icon: LetterTextIcon },
  { href: '/edit/gallery',     label: 'Gallery',            icon: Image },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function NavLink({
  item,
  active,
  onClick,
}: Readonly<{
  item: (typeof navItems)[0];
  active: boolean;
  onClick?: () => void;
}>) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 shrink-0 transition-transform duration-150',
          !active && 'group-hover:scale-110'
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
    </Link>
  );
}

function SidebarContent({
  user,
  pathname,
  onLogout,
  onNavClick,
}: Readonly<{
  user: User;
  pathname: string;
  onLogout: () => void;
  onNavClick?: () => void;
}>) {
  const initials = getInitials(user.name);

  return (
    <div className="flex flex-col h-full bg-accent/10">
      {/* Brand */}
      <div className="px-4 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-xs font-bold tracking-tight">KC</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight tracking-tight">KofC CMS</p>
            <p className="text-xs text-muted-foreground truncate">Content Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const active =
            item.href === '/edit'
              ? pathname === '/edit'
              : pathname.startsWith(item.href);
          return (
            <NavLink
              key={item.href}
              item={item}
              active={active}
              onClick={onNavClick}
            />
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/60">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-150 group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-150" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

export default function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex md:w-60 md:flex-col border-r border-border bg-background shrink-0">
        <SidebarContent
          user={user}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Top bar — Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-[10px] font-bold">KC</span>
            </div>
            <span className="font-bold text-sm tracking-tight">KofC CMS</span>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent
                user={user}
                pathname={pathname}
                onLogout={handleLogout}
                onNavClick={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14 min-w-0">
        {children}
      </main>
    </div>
  );
}