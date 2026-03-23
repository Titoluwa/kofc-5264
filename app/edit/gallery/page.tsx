'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/image-upload';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner'
import Pagination from '@/components/admin/pagination';
import { Trash2, Edit2, Plus, Images, Loader2, Search, X } from 'lucide-react';
import { AdditionalImages } from '@/components/admin/additional-images';
import { GalleryItem, CATEGORIES_ARRAY, PaginationMeta, PAGE_SIZE } from '@/lib/constants';
import GalleryCardSkeleton from '@/components/skeleton/gallery';

interface FormData {
  title: string;
  category: string;
  year: number;
  description: string;
  heroImage: string;
  images: string[];
}

const EMPTY_FORM: FormData = {
  title: '',
  category: 'events',
  year: new Date().getFullYear(),
  description: '',
  heroImage: '',
  images: [],
};

export default function EditGalleryPage() {
  const [items, setItems]           = useState<GalleryItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');
  const [isOpen, setIsOpen]         = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [formData, setFormData]     = useState<FormData>(EMPTY_FORM);
  const [filterCat, setFilterCat]   = useState('all');
  const [search, setSearch]         = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery');
      const data = await res.json();
      const list: GalleryItem[] = (Array.isArray(data) ? data : data.data ?? []).map(
        (item: GalleryItem) => {
          let parsedImages: string[] = [];
          if (Array.isArray(item.images)) {
            parsedImages = item.images;
          } else if (typeof item.images === 'string') {
            try { parsedImages = JSON.parse(item.images || '[]'); } catch { parsedImages = []; }
          }
          return { ...item, images: parsedImages };
        }
      );
      setItems(list);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load gallery',
        { description: 'There was a problem fetching albums. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Reset page on filter/search change
  useEffect(() => { setCurrentPage(1); }, [filterCat, search]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url    = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
      const payload = {
        title:       formData.title,
        category:    formData.category,
        year:        Number(formData.year),
        description: formData.description || undefined,
        heroImage:   formData.heroImage   || undefined,
        images:      formData.images,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save');
      }
      await fetchItems();
      closeDialog();
      toast.success(editingId ? 'Album updated' : 'Album created',
        { description: editingId
          ? `"${formData.title}" has been updated.`
          : `"${formData.title}" has been added to the gallery.`,
      });
    } catch (err: any) {
      const msg = err.message || 'Failed to save gallery item';
      setFormError(msg);
      toast.error('Failed to save album', {description: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const target = items.find((i) => i.id === deleteId);
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchItems();
      setDeleteId(null);
      toast.success('Album deleted',
       { description: target ? `"${target.title}" has been removed.` : 'The album has been removed.',
      });
    } catch {
      toast.error('Failed to delete album', { 
        description: 'Something went wrong while removing this album.',
      });
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setFormData({
      title:       item.title,
      category:    item.category,
      year:        item.year,
      description: item.description ?? '',
      heroImage:   item.heroImage   ?? '',
      images:      item.images      ?? [],
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

  // Filter + search
  const filteredItems = items.filter((item) => {
    const matchesCat = filterCat === 'all' || item.category === filterCat;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      String(item.year).includes(q);
    return matchesCat && matchesSearch;
  });

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    limit: PAGE_SIZE,
    total: filteredItems.length,
    totalPages: Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE)),
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const itemToDelete = items.find((i) => i.id === deleteId);

  let submitText = 'Create Album';
  if (saving) submitText = 'Saving…';
  else if (editingId) submitText = 'Update Album';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
              {!loading && (
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-sm">
                  {items.length} album{items.length === 1 ? '' : 's'}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Manage photos and memories from council events
            </p>
          </div>

          <Button onClick={openCreate} className="w-full sm:w-auto gap-2 rounded-xl shrink-0">
            <Plus className="w-4 h-4" />
            Add Album
          </Button>
        </div>

        {/* Search + Category filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search albums by title, year…"
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
            {['all', ...CATEGORIES_ARRAY].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 capitalize ${
                  filterCat === cat
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* eslint-disable-next-line react/no-array-index-key */}
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <GalleryCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty — no albums at all */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-2xl bg-muted/20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Images className="w-7 h-7 text-muted-foreground opacity-60" />
            </div>
            <p className="font-semibold text-lg">No albums yet</p>
            <p className="text-muted-foreground text-sm mt-1 mb-5">
              Add your first album to start building the gallery.
            </p>
            <Button onClick={openCreate} className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Album
            </Button>
          </div>
        )}

        {/* Empty — filter/search yields nothing */}
        {!loading && items.length > 0 && filteredItems.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="font-medium">
              No albums match{search ? ` "${search}"` : ''}{filterCat === 'all' ? '' : ` in "${filterCat}"`}
            </p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Gallery grid + pagination */}
        {!loading && filteredItems.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedItems.map((item) => {
                const cover    = item.heroImage ?? item.images?.[0];
                const imgCount = (item.images?.length ?? 0) + (item.heroImage ? 1 : 0);

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl overflow-hidden border border-border hover:shadow-md hover:border-border/80 transition-all duration-200 bg-card flex flex-col"
                  >
                    {/* Cover image */}
                    <div className="relative h-48 bg-muted overflow-hidden shrink-0">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Images className="w-10 h-10 text-muted-foreground opacity-25" />
                        </div>
                      )}

                      {/* Overlaid badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md capitalize font-medium">
                          {item.category}
                        </span>
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md font-semibold">
                          {item.year}
                        </span>
                      </div>

                      {imgCount > 0 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md">
                          <Images className="w-3 h-3" />
                          {imgCount} photo{imgCount === 1 ? '' : 's'}
                        </div>
                      )}

                      {/* Action buttons — hover reveal */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-7 h-7 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
                          title="Edit album"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="w-7 h-7 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete album"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col gap-1">
                      <p className="font-semibold text-sm leading-snug truncate">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

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
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Album' : 'Create New Album'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-1">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="g-title">Title *</Label>
                <Input
                  id="g-title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Annual Charity Gala 2024"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="g-category">Category *</Label>
                  <select
                    id="g-category"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="flex h-9 w-full rounded-md border py-1 border-gray-400 bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
                    required
                  >
                    {CATEGORIES_ARRAY.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="g-year">Year *</Label>
                  <Input
                    id="g-year"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData((p) => ({ ...p, year: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="g-desc">Description</Label>
                <Textarea
                  id="g-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description of this album…"
                />
              </div>

              <ImageUpload
                value={formData.heroImage}
                onChange={(url) => setFormData((p) => ({ ...p, heroImage: url }))}
                label="Cover / Hero Image"
              />

              <AdditionalImages
                images={formData.images}
                onChange={(imgs) => setFormData((p) => ({ ...p, images: imgs }))}
              />

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={closeDialog}
                >
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

        {/* Delete confirmation */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Album</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {itemToDelete ? `"${itemToDelete.title}"` : 'this album'}
                </span>
                {'? All image references will be permanently removed. This cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 rounded-lg"
              >
                Delete Album
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}