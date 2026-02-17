'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { href: '/edit', label: 'Dashboard', icon: '📊' },
  { href: '/edit/events', label: 'Events', icon: '📅' },
  { href: '/edit/programs', label: 'Programs', icon: '🎓' },
  { href: '/edit/resources', label: 'Resources', icon: '📚' },
  { href: '/edit/newsletters', label: 'Newsletters', icon: '📧' },
  { href: '/edit/pages', label: 'Pages', icon: '📄' },
];

export default function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-muted/50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">K of C CMS</h1>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <span>{item.icon} {item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold">K of C CMS</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="mt-8 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <span>{item.icon} {item.label}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}
