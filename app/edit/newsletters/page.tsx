'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Newsletter {
  id: number;
  subject: string;
  content: string;
  sentDate?: string;
  createdAt: string;
}

interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    sentDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [nlRes, subRes] = await Promise.all([
        fetch('/api/newsletters'),
        fetch('/api/subscribers')
      ]);
      if (!nlRes.ok || !subRes.ok) throw new Error('Failed to fetch');
      const nlData = await nlRes.json();
      const subData = await subRes.json();
      setNewsletters(Array.isArray(nlData) ? nlData : []);
      setSubscribers(Array.isArray(subData) ? subData : []);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/newsletters/${editingId}` : '/api/newsletters';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save');
      await fetchData();
      setIsOpen(false);
      setEditingId(null);
      setFormData({ subject: '', content: '', sentDate: '' });
    } catch (err) {
      setError('Failed to save newsletter');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/newsletters/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      await fetchData();
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleUnsubscribe = async (id: number) => {
    try {
      await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      setError('Failed to unsubscribe');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Newsletters</h1>
          <p className="text-muted-foreground mt-2">Manage newsletters and subscribers</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({ subject: '', content: '', sentDate: '' }); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Newsletter' : 'Create Newsletter'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div>
                <Label>Subject *</Label>
                <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={8} required />
              </div>
              <div>
                <Label>Send Date (optional)</Label>
                <Input type="datetime-local" value={formData.sentDate} onChange={(e) => setFormData({ ...formData, sentDate: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="newsletters">
        <TabsList>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers ({subscribers.filter(s => s.isActive).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="newsletters" className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading...</p>
          ) : newsletters.length === 0 ? (
            <Card><CardContent className="pt-6 text-center text-muted-foreground">No newsletters yet.</CardContent></Card>
          ) : (
            newsletters.map((nl) => (
              <Card key={nl.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{nl.subject}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(nl.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditingId(nl.id); setFormData({ subject: nl.subject, content: nl.content, sentDate: nl.sentDate || '' }); setIsOpen(true); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDeleteId(nl.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{nl.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading...</p>
          ) : subscribers.filter(s => s.isActive).length === 0 ? (
            <Card><CardContent className="pt-6 text-center text-muted-foreground">No active subscribers.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {subscribers.filter(s => s.isActive).map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="pt-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{sub.email}</p>
                      <p className="text-xs text-muted-foreground">Subscribed {new Date(sub.subscribedAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleUnsubscribe(sub.id)}>
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Newsletter</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
