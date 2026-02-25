'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Edit2, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Page {
  id: number;
  slug: string;
  name: string;
  contents: string[];
  navbar: boolean;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    navbar: false,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/pages/${editingId}` : '/api/pages';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save page');

      await fetchPages();
      setIsOpen(false);
      setEditingId(null);
      setFormData({ slug: '', name: '', navbar: false });
    } catch (err) {
      setError('Failed to save page');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/pages/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      await fetchPages();
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete page');
      console.error(err);
    }
  };

  let pageListContent: React.ReactNode;
  if (loading) {
    pageListContent = <p className="text-center text-muted-foreground py-12">Loading...</p>;
  } else if (pages.length === 0) {
    pageListContent = <Card><CardContent className="pt-6 text-center text-muted-foreground">No pages yet. Create one to get started.</CardContent></Card>;
  } else {
    pageListContent = (
      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{page.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {page.navbar ? '/' : '#'}{page.slug} {"  "}
                    <span className={cn("mt-1", page.navbar ? "text-primary" : "text-red-500")}>
                      ({page.navbar ? 'Navbar Page' : 'Not a Navbar Page'})
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/${page.slug}`} target="_blank">
                    <Button variant="outline" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingId(page.id);
                      setFormData({
                        slug: page.slug,
                        name: page.name,
                        navbar: page.navbar
                      });
                      setIsOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDeleteId(page.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{page.contents}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <p className="text-muted-foreground mt-2">Manage static pages and content</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({ slug: '', name: '', navbar: false }); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Page' : 'Create New Page'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="flex flex-col gap-2">
                <Label>Slug (URL path) </Label>
                <Input 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replaceAll(/\s+/g, '-') })} 
                  placeholder="about" 
                  required 
                  className='border border-primary'
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Title *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required  className='border border-primary'/>
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Navbar </Label>
                <Switch checked={formData.navbar} onCheckedChange={(value: any) => setFormData({ ...formData, navbar: value })} required className='primary'>
                </Switch>
              </div>
              <Button type="submit" className="w-full">{editingId ? 'Update Page' : 'Create Page'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {pageListContent}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
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
