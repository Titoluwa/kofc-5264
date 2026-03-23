'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Pagination from '@/components/admin/pagination';
import { PaginationMeta, Resource, R_PAGE_SIZE } from '@/lib/constants';
import { Plus, FileText, Search, X, FolderOpen } from 'lucide-react';
import { uploadFile, ACCEPT_STRINGS } from '@/lib/uploadHelper';
import { ResourceCardSkeleton } from '@/components/skeleton';
import ResourceCard from '@/components/admin/resources-card';

type ResourceFormData = Pick<Resource, 'title' | 'description' | 'category'> &
  Partial<Pick<Resource, 'url' | 'content' | 'file'>>;

const EMPTY_FORM: ResourceFormData = {
  title: '',
  description: '',
  category: '',
  url: '',
  content: '',
  file: '',
};

export default function ResourcesPage() {

  const [resources, setResources]   = useState<Resource[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');
  const [isOpen, setIsOpen]         = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [formData, setFormData]     = useState<ResourceFormData>(EMPTY_FORM);
  const [fileInput, setFileInput]   = useState<File | null>(null);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data: unknown = await res.json();
      setResources(Array.isArray(data) ? (data as Resource[]) : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resources', {
        description: 'There was a problem fetching resources. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // Reset page on search/filter change
  useEffect(() => { setCurrentPage(1); }, [search, filterCat]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const fileUrl = fileInput
        ? await uploadFile(fileInput, { category: 'document' })
        : formData.file;

      const method = editingId ? 'PATCH' : 'POST';
      const url    = editingId ? `/api/resources/${editingId}` : '/api/resources';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, file: fileUrl }),
      });

      if (!res.ok) throw new Error('Failed to save resource');

      await fetchResources();
      handleClose();
      toast.success(editingId ? 'Resource updated' : 'Resource created', {
        description: editingId
          ? `"${formData.title}" has been updated.`
          : `"${formData.title}" has been added to resources.`,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to save resource';
      setFormError(msg);
      toast.error('Failed to save resource', { description: msg });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const target = resources.find((r) => r.id === deleteId);
    try {
      const res = await fetch(`/api/resources/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchResources();
      setDeleteId(null);
      toast.success('Resource deleted', {
        description: target ? `"${target.title}" has been removed.` : 'The resource has been removed.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete resource', {
        description: 'Something went wrong while removing this resource.',
      });
    }
  }

  function handleEdit(resource: Resource) {
    setEditingId(resource.id);
    setFormData({
      title:       resource.title,
      description: resource.description,
      category:    resource.category,
      url:         resource.url     ?? '',
      content:     resource.content ?? '',
      file:        resource.file    ?? '',
    });
    setFileInput(null);
    setFormError('');
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFileInput(null);
    setFormError('');
  }

  function handleOpenNew() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFileInput(null);
    setFormError('');
    setIsOpen(true);
  }

  function patch(field: keyof ResourceFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }


  // All unique categories
  const allCategories = Array.from(new Set(resources.map((r) => r.category))).sort((a, b) => a.localeCompare(b));

  // Filtered resources (search + category)
  const filteredResources = resources.filter((r) => {
    const matchesCat    = filterCat === 'all' || r.category === filterCat;
    const q             = search.toLowerCase();
    const matchesSearch = !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Group filtered resources by category for section headers
  const grouped = filteredResources.reduce<Record<string, Resource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  // Pagination applied across the flat filtered list
  const paginationMeta: PaginationMeta = {
    page:       currentPage,
    limit:      R_PAGE_SIZE,
    total:      filteredResources.length,
    totalPages: Math.max(1, Math.ceil(filteredResources.length / R_PAGE_SIZE)),
  };

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * R_PAGE_SIZE,
    currentPage * R_PAGE_SIZE,
  );

  // Re-group paginated slice for section rendering
  const paginatedGrouped = paginatedResources.reduce<Record<string, Resource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const resourceToDelete = resources.find((r) => r.id === deleteId);

  let submitLabel = 'Create Resource';
  if (saving) submitLabel = 'Saving…';
  else if (editingId) submitLabel = 'Update Resource';

  const SKELETON_ITEMS = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
              {!loading && (
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-sm">
                  {resources.length}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {!loading && (
                <>
                  {resources.length} resource{resources.length === 1 ? '' : 's'} across{' '}
                  {allCategories.length} categor{allCategories.length === 1 ? 'y' : 'ies'}
                </>
              )}
            </p>
          </div>

          <Button onClick={handleOpenNew} className="w-full sm:w-auto gap-2 rounded-xl shrink-0">
            <Plus className="w-4 h-4" />
            Add Resource
          </Button>
        </div>

        {/* Search + Category filters */}
        {!loading && resources.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search resources…"
                className="pl-9 pr-9 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
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
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 capitalize ${
                    filterCat === cat
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, si) => (
              <div key={si.toFixed()} className="space-y-3">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  {SKELETON_ITEMS.map((sk) => (
                    <ResourceCardSkeleton key={`skeleton-${si.toFixed()}-${sk}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty — no resources at all */}
        {!loading && resources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-2xl bg-muted/20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-muted-foreground opacity-60" />
            </div>
            <p className="font-semibold text-lg">No resources yet</p>
            <p className="text-muted-foreground text-sm mt-1 mb-5">
              Add your first resource to build the library.
            </p>
            <Button onClick={handleOpenNew} className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Resource
            </Button>
          </div>
        )}

        {/* Empty — filter/search yields nothing */}
        {!loading && resources.length > 0 && filteredResources.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="font-medium">
              No resources match{search ? ` "${search}"` : ''}{filterCat === 'all' ? '' : ` in "${filterCat}"`}
            </p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Grouped resource sections + pagination */}
        {!loading && paginatedResources.length > 0 && (
          <div className="space-y-8">
            {Object.entries(paginatedGrouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, items]) => (
                <section key={category}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold capitalize">{category}</h2>
                    <Badge variant="secondary" className="rounded-full text-xs px-2 py-0">
                      {grouped[category]?.length ?? items.length}
                    </Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {items.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onEdit={handleEdit}
                        onDelete={setDeleteId}
                      />
                    ))}
                  </div>
                </section>
              ))}

            <Pagination
              meta={paginationMeta}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Create / Edit Dialog */}
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Resource' : 'Create Resource'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={patch('title')}
                  placeholder="Resource title" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={patch('description')}
                  placeholder="Brief description of this resource" rows={3} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" value={formData.category} onChange={patch('category')}
                  placeholder="e.g. Forms, Guides, Announcements" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="url">
                  External URL{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input id="url" type="url" value={formData.url} onChange={patch('url')}
                  placeholder="https://example.com" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content">
                  Content / Notes{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Textarea id="content" value={formData.content} onChange={patch('content')}
                  placeholder="Additional notes for this resource" rows={4} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="file">
                  File Attachment{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept={ACCEPT_STRINGS.document}
                  onChange={(e) => setFileInput(e.target.files?.[0] ?? null)}
                  className="cursor-pointer"
                />
                {formData.file && !fileInput && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <FileText className="w-3 h-3 shrink-0" />
                    Current:{' '}
                    <a href={formData.file} target="_blank" rel="noreferrer"
                      className="underline truncate max-w-xs underline-offset-2">
                      {formData.file.split('/').pop()}
                    </a>
                  </p>
                )}
                {fileInput && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 rounded-xl" disabled={saving}>
                  {submitLabel}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {resourceToDelete ? `"${resourceToDelete.title}"` : 'this resource'}
                </span>
                {'?'} This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 rounded-lg"
              >
                Delete Resource
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}