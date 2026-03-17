'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUpIcon,
  ArrowRightIcon,
  // LayoutDashboardIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Stats, statCards, quickActions } from '@/lib/constants';
import { StatCardSkeleton } from '@/components/skeleton';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    resources: 0,
    newsletters: 0,
    pages: 0,
    gallery: 0,
    members: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, resources, newsletters, pages, gallerys, members] = await Promise.all([
          fetch('/api/events').then((r) => r.json()),
          fetch('/api/resources').then((r) => r.json()),
          fetch('/api/newsletters').then((r) => r.json()),
          fetch('/api/pages').then((r) => r.json()),
          fetch('/api/gallery').then((r) => r.json()),
          fetch('/api/members').then((r) => r.json()),
        ]);

        setStats({
          events: Array.isArray(events) ? events.length : 0,
          resources: Array.isArray(resources) ? resources.length : 0,
          newsletters: Array.isArray(newsletters) ? newsletters.length : 0,
          pages: Array.isArray(pages) ? pages.length : 0,
          gallery: Array.isArray(gallerys) ? gallerys.length : 0,
          members: Array.isArray(members) ? members.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const now = new Date();
  let greeting = 'Good evening';
  if (now.getHours() < 12) {
    greeting = 'Good morning';
  } else if (now.getHours() < 17) {
    greeting = 'Good afternoon';
  }
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            {/* <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium tracking-wide uppercase mb-2">
              <LayoutDashboardIcon className="w-4 h-4" />
              <span>CMS Admin</span>
            </div> */}
            <h1 className="text-4xl font-bold tracking-tight">{greeting} 👋</h1>
            <p className="text-muted-foreground text-base">{dateString} — here's your content overview.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
            <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
            <span>
              <strong className="text-foreground">{Object.values(stats).reduce((a, b) => a + b, 0)}</strong> total
              records
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Content Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i.toFixed()} />)
              : statCards.map(({ key, label, href, icon: Icon, color, accent, border }) => (
                  <Link href={href} key={key}>
                    <div
                      className={`group relative rounded-2xl border ${border} bg-gradient-to-br ${color} p-5 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden`}
                    >
                      {/* Background decoration */}
                      <div className="absolute -bottom-3 -right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon className="w-16 h-16" />
                      </div>

                      <div className={`mb-3 ${accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-3xl font-bold tabular-nums">{stats[key]}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium leading-tight">{label}</div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ href, icon: Icon, label, description, accent }) => (
              <Link href={href} key={href}>
                <div className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card hover:bg-muted/40 hover:shadow-sm hover:border-border/80 transition-all duration-200 cursor-pointer h-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-foreground transition-colors">
                      {label}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>Go</span>
                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}