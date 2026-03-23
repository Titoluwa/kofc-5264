'use client';

import { Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Subscriber } from '@/lib/constants';


interface SubscribersTableProps {
    subscribers: Subscriber[];
    onRemove: (id: number) => void;
}

export function SubscribersTable({ subscribers, onRemove }: SubscribersTableProps) {
    if (subscribers.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <p className="font-medium text-muted-foreground">No active subscribers.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                <tr className="bg-muted/60 border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Email
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                    Subscribed
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                    Status
                    </th>
                    <th className="w-16 px-4 py-3" />
                </tr>
                </thead>
                <tbody className="divide-y divide-border">
                {subscribers.map((sub, idx) => (
                    <tr
                    key={sub.id}
                    className={`transition-colors hover:bg-muted/30 ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                    >
                    <td className="px-4 py-3 font-medium truncate max-w-[200px]">{sub.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        })}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        sub.isActive
                            ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td className="px-4 py-3">
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onRemove(sub.id)}
                        title="Remove subscriber"
                        >
                        <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}