'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ImageUpload } from '@/components/image-upload';
import { SubscribersTable } from '@/components/admin/subscribers-table';
import Pagination from '@/components/admin/pagination';
import {
  PaginationMeta, Subscriber, CATEGORIES, Newsletter,
  NL_LIMIT, SUB_LIMIT,
} from '@/lib/constants';
import { Plus, Mail, Users, Search, Loader2 } from 'lucide-react';
import { NewsletterCard } from '@/components/admin/newsletter-cards';

interface NewsletterFormData {
  title: string;
  subtitle: string;
  content: string;
  category: string;
  publishedDate: string;
  heroImage: string;
}

const EMPTY_FORM: NewsletterFormData = {
  title: '',
  subtitle: '',
  content: '',
  category: '',
  publishedDate: '',
  heroImage: '',
};


export default function EditNewsletters() {
  // Newsletters state
  const [newsletters, setNewsletters]   = useState<Newsletter[]>([]);
  const [nlMeta, setNlMeta]             = useState<PaginationMeta>({ page: 1, limit: NL_LIMIT, total: 0, totalPages: 1 });
  const [nlPage, setNlPage]             = useState(1);
  const [nlSearch, setNlSearch]         = useState('');
  const [nlSearchInput, setNlSearchInput] = useState('');
  const [nlLoading, setNlLoading]       = useState(true);
  const [filterCat, setFilterCat]       = useState('all');

  // Subscribers state
  const [subscribers, setSubscribers]   = useState<Subscriber[]>([]);
  const [subMeta, setSubMeta]           = useState<PaginationMeta>({ page: 1, limit: SUB_LIMIT, total: 0, totalPages: 1 });
  const [subPage, setSubPage]           = useState(1);
  const [subSearch, setSubSearch]       = useState('');
  const [subSearchInput, setSubSearchInput] = useState('');
  const [subLoading, setSubLoading]     = useState(true);

  // Shared
  const [error, setError]               = useState('');
  const [isOpen, setIsOpen]             = useState(false);
  const [saving, setSaving]             = useState(false);
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [deleteId, setDeleteId]         = useState<number | null>(null);
  const [deleteSubId, setDeleteSubId]   = useState<number | null>(null);
  const [formData, setFormData]         = useState<NewsletterFormData>(EMPTY_FORM);
  const [activeTab, setActiveTab]       = useState('newsletters');

  // Fetch Newsletters

  const fetchNewsletters = useCallback(async (page: number, search: string, category: string) => {
    try {
      setNlLoading(true);
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(NL_LIMIT),
        ...(search                       ? { search }   : {}),
        ...(category && category !== 'all' ? { category } : {}),
      });
      const res  = await fetch(`/api/newsletters?${params}`);
      if (!res.ok) throw new Error('Failed to fetch newsletters');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNewsletters(data);
        setNlMeta({ page, limit: NL_LIMIT, total: data.length, totalPages: 1 });
      } else {
        setNewsletters(data.data ?? []);
        setNlMeta(data.meta ?? { page, limit: NL_LIMIT, total: 0, totalPages: 1 });
      }
    } catch (err) {
      setError('Failed to load newsletters');
      console.error(err);
    } finally {
      setNlLoading(false);
    }
  }, []);

  // Fetch Subscribers

  const fetchSubscribers = useCallback(async (page: number, search: string) => {
    try {
      setSubLoading(true);
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(SUB_LIMIT),
        ...(search ? { search } : {}),
      });
      const res  = await fetch(`/api/subscribers?${params}`);
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      if (Array.isArray(data)) {
        const active = data.filter((s: Subscriber) => s.isActive);
        setSubscribers(active);
        setSubMeta({ page, limit: SUB_LIMIT, total: active.length, totalPages: 1 });
      } else {
        setSubscribers(data.data ?? []);
        setSubMeta(data.meta ?? { page, limit: SUB_LIMIT, total: 0, totalPages: 1 });
      }
    } catch (err) {
      setError('Failed to load subscribers');
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  }, []);

  // Effects

  useEffect(() => { fetchNewsletters(nlPage, nlSearch, filterCat); }, [nlPage, nlSearch, filterCat, fetchNewsletters]);
  useEffect(() => { fetchSubscribers(subPage, subSearch); },         [subPage, subSearch, fetchSubscribers]);

  // Debounce newsletter search
  useEffect(() => {
    const t = setTimeout(() => { setNlSearch(nlSearchInput); setNlPage(1); }, 400);
    return () => clearTimeout(t);
  }, [nlSearchInput]);

  // Debounce subscriber search
  useEffect(() => {
    const t = setTimeout(() => { setSubSearch(subSearchInput); setSubPage(1); }, 400);
    return () => clearTimeout(t);
  }, [subSearchInput]);

  // Reset page when category filter changes
  useEffect(() => { setNlPage(1); }, [filterCat]);

  // CRUD

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url    = editingId ? `/api/newsletters/${editingId}` : '/api/newsletters';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:         formData.title,
          subtitle:      formData.subtitle      || undefined,
          content:       formData.content,
          category:      formData.category      || undefined,
          publishedDate: formData.publishedDate || undefined,
          heroImage:     formData.heroImage     || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save');
      }
      await fetchNewsletters(editingId ? nlPage : 1, nlSearch, filterCat);
      if (!editingId) setNlPage(1);
      setIsOpen(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message || 'Failed to save newsletter');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/newsletters/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const newTotal     = nlMeta.total - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / NL_LIMIT));
      const targetPage   = Math.min(nlPage, newTotalPages);
      setNlPage(targetPage);
      await fetchNewsletters(targetPage, nlSearch, filterCat);
      setDeleteId(null);
    } catch {
      setError('Failed to delete newsletter');
    }
  };

  const handleUnsubscribe = async () => {
    if (!deleteSubId) return;
    try {
      const res = await fetch(`/api/subscribers/${deleteSubId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove subscriber');
      const newTotal      = subMeta.total - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / SUB_LIMIT));
      const targetPage    = Math.min(subPage, newTotalPages);
      setSubPage(targetPage);
      await fetchSubscribers(targetPage, subSearch);
      setDeleteSubId(null);
    } catch {
      setError('Failed to remove subscriber');
    }
  };

  const openEdit = (nl: Newsletter) => {
    setEditingId(nl.id);
    setFormData({
      title:         nl.title,
      subtitle:      nl.subtitle      ?? '',
      content:       nl.content,
      category:      nl.category      ?? '',
      heroImage:     nl.heroImage     ?? '',
      publishedDate: nl.publishedDate
        ? new Date(nl.publishedDate).toISOString().slice(0, 16)
        : '',
    });
    setError('');
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
    setIsOpen(true);
  };

  // Render

  const handleDialogOpen = () => {
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setError('');
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      handleDialogOpen();
    } else {
      handleDialogClose();
    }
  };

  const getSubmitButtonLabel = () => {
    if (saving) return 'Saving…';
    if (editingId) return 'Update Newsletter';
    return 'Create Newsletter';
  };

  const renderNewslettersGrid = () => {
    if (nlLoading) {
      return (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading newsletters…</span>
        </div>
      );
    }

    if (newsletters.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-medium text-muted-foreground">
              {nlSearch || filterCat !== 'all' ? 'No newsletters match your filters.' : 'No newsletters yet.'}
            </p>
            {!nlSearch && filterCat === 'all' && (
              <Button variant="outline" size="sm" className="mt-4" onClick={openCreate}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Create your first newsletter
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsletters.map(nl => (
            <NewsletterCard
              key={nl.id}
              nl={nl}
              onEdit={openEdit}
              onDelete={id => setDeleteId(id)}
            />
          ))}
        </div>
        <Pagination
          meta={nlMeta}
          onPageChange={p => { setNlPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      </>
    );
  };

  const categoryList = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="p-4 md:p-8 space-y-6 mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletters</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage newsletters and subscribers</p>
        </div>

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" /> New Newsletter
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Newsletter' : 'Create Newsletter'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Hero Image */}
              <ImageUpload
                value={formData.heroImage}
                onChange={url => setFormData(p => ({ ...p, heroImage: url }))}
                label="Hero / Cover Image"
              />

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="nl-title">Title *</Label>
                <Input
                  id="nl-title"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Newsletter title"
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <Label htmlFor="nl-subtitle">Subtitle</Label>
                <Input
                  id="nl-subtitle"
                  value={formData.subtitle}
                  onChange={e => setFormData(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Short subtitle or tagline"
                />
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nl-category">Category</Label>
                  <select
                    id="nl-category"
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select category</option>
                    {categoryList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nl-date">Publish Date</Label>
                  <Input
                    id="nl-date"
                    type="datetime-local"
                    value={formData.publishedDate}
                    onChange={e => setFormData(p => ({ ...p, publishedDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <Label htmlFor="nl-content">Content *</Label>
                <Textarea
                  id="nl-content"
                  value={formData.content}
                  onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                  rows={10}
                  placeholder="Write the full newsletter content here…"
                  required
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {getSubmitButtonLabel()}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Global error */}
      {error && !isOpen && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 max-w-md gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{nlMeta.total}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Newsletters</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{subMeta.total}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Subscribers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="newsletters" className="gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Newsletters
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="gap-1.5">
            <Users className="w-3.5 h-3.5" /> Subscribers
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium">
              {subMeta.total}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ── Newsletters Tab ────────────────────────────────────────── */}
        <TabsContent value="newsletters" className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search newsletters…"
              value={nlSearchInput}
              onChange={e => setNlSearchInput(e.target.value)}
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCat('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filterCat === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-transparent hover:border-border'
              }`}
            >
              All
            </button>
            {categoryList.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  filterCat === cat.name
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          {renderNewslettersGrid()}
        </TabsContent>

        {/* ── Subscribers Tab ────────────────────────────────────────── */}
        <TabsContent value="subscribers" className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search subscribers by email…"
              value={subSearchInput}
              onChange={e => setSubSearchInput(e.target.value)}
            />
          </div>

          {subLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading subscribers…</span>
            </div>
          ) : (
            <>
              <SubscribersTable
                subscribers={subscribers}
                onRemove={id => setDeleteSubId(id)}
              />
              <Pagination meta={subMeta} onPageChange={p => setSubPage(p)} />
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Newsletter */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Newsletter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this newsletter? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Subscriber */}
      <AlertDialog open={deleteSubId !== null} onOpenChange={open => !open && setDeleteSubId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              This will unsubscribe the user. They can resubscribe at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsubscribe} className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}