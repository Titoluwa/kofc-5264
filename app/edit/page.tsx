'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  events: number;
  programs: number;
  resources: number;
  newsletters: number;
  pages: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    programs: 0,
    resources: 0,
    newsletters: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, programs, resources, newsletters, pages] = await Promise.all([
          fetch('/api/events').then((r) => r.json()),
          fetch('/api/programs').then((r) => r.json()),
          fetch('/api/resources').then((r) => r.json()),
          fetch('/api/newsletters').then((r) => r.json()),
          fetch('/api/pages').then((r) => r.json()),
        ]);

        setStats({
          events: Array.isArray(events) ? events.length : 0,
          programs: Array.isArray(programs) ? programs.length : 0,
          resources: Array.isArray(resources) ? resources.length : 0,
          newsletters: Array.isArray(newsletters) ? newsletters.length : 0,
          pages: Array.isArray(pages) ? pages.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the CMS admin panel</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.programs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Newsletters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newsletters}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pages}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>What would you like to do first?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
              <h3 className="font-semibold mb-2">📅 Create an Event</h3>
              <p className="text-sm text-muted-foreground">Add a new event to the website</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
              <h3 className="font-semibold mb-2">📚 Add a Resource</h3>
              <p className="text-sm text-muted-foreground">Create new resources or links</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
              <h3 className="font-semibold mb-2">📧 Send Newsletter</h3>
              <p className="text-sm text-muted-foreground">Compose and send a newsletter</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
              <h3 className="font-semibold mb-2">📄 Manage Pages</h3>
              <p className="text-sm text-muted-foreground">Edit static page content</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
