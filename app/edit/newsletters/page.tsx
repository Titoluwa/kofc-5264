'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import { ImageUpload } from '@/components/image-upload';
import { SubscribersTable } from '@/components/admin/subscribers-table';
import Pagination from '@/components/admin/pagination';
import {
  PaginationMeta, Subscriber, CATEGORIES, Newsletter,
  NL_LIMIT, SUB_LIMIT,
} from '@/lib/constants';
import { Plus, Mail, Users, Search, Loader2, X } from 'lucide-react';
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
  const [newsletters, setNewsletters]       = useState<Newsletter[]>([]);
  const [nlPage, setNlPage]                 = useState(1);
  const [nlSearch, setNlSearch]             = useState('');
  const [nlSearchInput, setNlSearchInput]   = useState('');
  const [nlLoading, setNlLoading]           = useState(true);
  const [filterCat, setFilterCat]           = useState('all');

  // Subscribers state
  const [subscribers, setSubscribers]       = useState<Subscriber[]>([]);
  const [subPage, setSubPage]               = useState(1);
  const [subSearch, setSubSearch]           = useState('');
  const [subSearchInput, setSubSearchInput] = useState('');
  const [subLoading, setSubLoading]         = useState(true);

  // Shared dialog / form state
  const [formError, setFormError]           = useState('');
  const [isOpen, setIsOpen]                 = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [editingId, setEditingId]           = useState<number | null>(null);
  const [deleteId, setDeleteId]             = useState<number | null>(null);
  const [deleteSubId, setDeleteSubId]       = useState<number | null>(null);
  const [formData, setFormData]             = useState<NewsletterFormData>(EMPTY_FORM);
  const [activeTab, setActiveTab]           = useState('newsletters');

  // ── Fetch helpers ─────────────────────────────────────────────────────────

  const fetchNewsletters = useCallback(async () => {
    try {
      setNlLoading(true);
      const res = await fetch('/api/newsletters');
      if (!res.ok) throw new Error('Failed to fetch newsletters');
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data ?? [];
      setNewsletters(list);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load newsletters', {
        description: 'There was a problem fetching newsletters. Please try again.',
      });
    } finally {
      setNlLoading(false);
    }
  }, [toast]);

  const fetchSubscribers = useCallback(async () => {
    try {
      setSubLoading(true);
      const res = await fetch('/api/subscribers');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      const raw = Array.isArray(data) ? data : data.data ?? [];
      const active = raw.filter((s: Subscriber) => s.isActive);
      setSubscribers(active);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subscribers', {
        description: 'There was a problem fetching subscribers. Please try again.',
      });
    } finally {
      setSubLoading(false);
    }
  }, [toast]);

  // Derived state for newsletters
  const filteredNewsletters = newsletters.filter((nl) => {
    const matchesCat = filterCat === 'all' || nl.category === filterCat;
    const q = nlSearch.toLowerCase();
    const matchesSearch =
      !q ||
      nl.title.toLowerCase().includes(q) ||
      (nl.subtitle?.toLowerCase().includes(q)) ||
      (nl.category?.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const parsedNlMeta: PaginationMeta = {
    page: nlPage,
    limit: NL_LIMIT,
    total: filteredNewsletters.length,
    totalPages: Math.max(1, Math.ceil(filteredNewsletters.length / NL_LIMIT)),
  };

  const paginatedNewsletters = filteredNewsletters.slice(
    (nlPage - 1) * NL_LIMIT,
    nlPage * NL_LIMIT,
  );

  // Derived state for subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const q = subSearch.toLowerCase();
    return !q || sub.email.toLowerCase().includes(q);
  });

  const parsedSubMeta: PaginationMeta = {
    page: subPage,
    limit: SUB_LIMIT,
    total: filteredSubscribers.length,
    totalPages: Math.max(1, Math.ceil(filteredSubscribers.length / SUB_LIMIT)),
  };

  const paginatedSubscribers = filteredSubscribers.slice(
    (subPage - 1) * SUB_LIMIT,
    subPage * SUB_LIMIT,
  );

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => { fetchNewsletters(); }, [fetchNewsletters]);
  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

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

  // Reset page on category change
  useEffect(() => { setNlPage(1); }, [filterCat]);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFormError('');
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
      await fetchNewsletters();
      if (!editingId) setNlPage(1);
      closeDialog();
      toast.success(editingId ? 'Newsletter updated' : 'Newsletter created', {
        description: editingId
          ? `"${formData.title}" has been updated.`
          : `"${formData.title}" has been published.`,
      });
    } catch (err: any) {
      const msg = err.message || 'Failed to save newsletter';
      setFormError(msg);
      toast.error('Failed to save newsletter', { description: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const target = newsletters.find((n) => n.id === deleteId);
    try {
      const res = await fetch(`/api/newsletters/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const newTotalPages = Math.max(1, Math.ceil((parsedNlMeta.total - 1) / NL_LIMIT));
      const targetPage    = Math.min(nlPage, newTotalPages);
      setNlPage(targetPage);
      await fetchNewsletters();
      setDeleteId(null);
      toast.success('Newsletter deleted', {
        description: target ? `"${target.title}" has been removed.` : 'The newsletter has been removed.',
      });
    } catch {
      toast.error('Failed to delete newsletter', { description: 'Something went wrong. Please try again.' });
    }
  };

  const handleUnsubscribe = async () => {
    if (!deleteSubId) return;
    const target = subscribers.find((s) => s.id === deleteSubId);
    try {
      const res = await fetch(`/api/subscribers/${deleteSubId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove subscriber');
      const newTotalPages = Math.max(1, Math.ceil((parsedSubMeta.total - 1) / SUB_LIMIT));
      const targetPage    = Math.min(subPage, newTotalPages);
      setSubPage(targetPage);
      await fetchSubscribers();
      setDeleteSubId(null);
      toast.success('Subscriber removed', {
        description: target ? `${target.email} has been unsubscribed.` : 'The subscriber has been removed.',
      });
    } catch {
      toast.error('Failed to remove subscriber', { description: 'Something went wrong. Please try again.' });
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
    setFormError('');
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setFormError('');
  };

  const categoryList = CATEGORIES.filter((c) => c.id !== 'all');
  const nlToDelete   = newsletters.find((n) => n.id === deleteId);

  let submitText = 'Create Newsletter';
  if (saving) submitText = 'Saving…';
  else if (editingId) submitText = 'Update Newsletter';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Newsletters</h1>
              {!nlLoading && (
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-sm">
                  {parsedNlMeta.total}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Manage newsletters and subscriber communications
            </p>
          </div>

          <Button onClick={openCreate} className="w-full sm:w-auto gap-2 rounded-xl shrink-0">
            <Plus className="w-4 h-4" />
            New Newsletter
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 max-w-md gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-4.5 h-4.5 text-sky-500" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none tabular-nums">{parsedNlMeta.total}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Newsletters</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none tabular-nums">{parsedSubMeta.total}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Subscribers</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="newsletters" className="gap-1.5 rounded-lg">
              <Mail className="w-3.5 h-3.5" />
              Newsletters
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5" />
              Subscribers
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums">
                {parsedSubMeta.total}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* ── Newsletters Tab ───────────────────────────────────── */}
          <TabsContent value="newsletters" className="space-y-5 mt-5">

            {/* Search + category filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  className="pl-9 pr-9 rounded-xl"
                  placeholder="Search newsletters…"
                  value={nlSearchInput}
                  onChange={(e) => setNlSearchInput(e.target.value)}
                />
                {nlSearchInput && (
                  <button
                    onClick={() => setNlSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterCat('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    filterCat === 'all'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                  }`}
                >
                  All
                </button>
                {categoryList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCat(cat.name)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      filterCat === cat.name
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {nlLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* eslint-disable-next-line react/no-array-index-key */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i.toFixed()} className="rounded-2xl border border-border overflow-hidden animate-pulse">
                    <div className="h-40 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty — no newsletters at all */}
            {!nlLoading && newsletters.length === 0 && !nlSearch && filterCat === 'all' && (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-2xl bg-muted/20">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-muted-foreground opacity-60" />
                </div>
                <p className="font-semibold text-lg">No newsletters yet</p>
                <p className="text-muted-foreground text-sm mt-1 mb-5">
                  Create your first newsletter to get started.
                </p>
                <Button onClick={openCreate} className="gap-2 rounded-xl">
                  <Plus className="w-4 h-4" />
                  New Newsletter
                </Button>
              </div>
            )}

            {/* Empty — search/filter yields nothing */}
            {!nlLoading && newsletters.length > 0 && filteredNewsletters.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                <p className="font-medium">
                  No newsletters match{nlSearch ? ` "${nlSearch}"` : ''}{filterCat === 'all' ? '' : ` in "${filterCat}"`}
                </p>
                <p className="text-sm mt-1">Try adjusting your search or filter.</p>
              </div>
            )}

            {/* Grid + pagination */}
            {!nlLoading && filteredNewsletters.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedNewsletters.map((nl) => (
                    <NewsletterCard
                      key={nl.id}
                      nl={nl}
                      onEdit={openEdit}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
                <Pagination
                  meta={parsedNlMeta}
                  onPageChange={(p) => {
                    setNlPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </TabsContent>

          {/* ── Subscribers Tab ───────────────────────────────────── */}
          <TabsContent value="subscribers" className="space-y-5 mt-5">

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9 pr-9 rounded-xl"
                placeholder="Search by email…"
                value={subSearchInput}
                onChange={(e) => setSubSearchInput(e.target.value)}
              />
              {subSearchInput && (
                <button
                  onClick={() => setSubSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Loading */}
            {subLoading && (
              <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading subscribers…</span>
              </div>
            )}

            {/* Empty */}
            {!subLoading && subscribers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl bg-muted/20">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-muted-foreground opacity-60" />
                </div>
                <p className="font-semibold">No subscribers yet</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {subSearch ? `No results for "${subSearch}"` : 'Subscribers will appear here once people sign up.'}
                </p>
              </div>
            )}

            {!subLoading && filteredSubscribers.length > 0 && (
              <div className="space-y-6">
                <SubscribersTable
                  subscribers={paginatedSubscribers}
                  onRemove={(id) => setDeleteSubId(id)}
                />
                <Pagination
                  meta={parsedSubMeta}
                  onPageChange={(p) => setSubPage(p)}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* ── Create / Edit Dialog ───────────────────────────────── */}
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Newsletter' : 'Create Newsletter'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <ImageUpload
                value={formData.heroImage}
                onChange={(url) => setFormData((p) => ({ ...p, heroImage: url }))}
                label="Hero / Cover Image"
              />

              <div className="space-y-1.5">
                <Label htmlFor="nl-title">Title *</Label>
                <Input
                  id="nl-title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Newsletter title"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nl-subtitle">Subtitle</Label>
                <Input
                  id="nl-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Short subtitle or tagline"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nl-category">Category</Label>
                  <select
                    id="nl-category"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select category</option>
                    {categoryList.map((c) => (
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
                    onChange={(e) => setFormData((p) => ({ ...p, publishedDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nl-content">Content *</Label>
                <Textarea
                  id="nl-content"
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  rows={10}
                  placeholder="Write the full newsletter content here…"
                  required
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 rounded-xl" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {submitText}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── Delete Newsletter ──────────────────────────────────── */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Newsletter</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {nlToDelete ? `"${nlToDelete.title}"` : 'this newsletter'}
                </span>
                {'? This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 rounded-lg"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── Remove Subscriber ──────────────────────────────────── */}
        <AlertDialog open={deleteSubId !== null} onOpenChange={(open) => { if (!open) setDeleteSubId(null); }}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
              <AlertDialogDescription>
                This will unsubscribe the user. They can resubscribe at any time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUnsubscribe}
                className="bg-destructive hover:bg-destructive/90 rounded-lg"
              >
                Remove
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}