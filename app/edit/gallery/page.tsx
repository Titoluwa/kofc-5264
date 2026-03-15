'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/image-upload';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit2, Plus, Images, Loader2 } from 'lucide-react';
import { AdditionalImages } from '@/components/admin/additional-images';
import { GalleryItem, CATEGORIES_ARRAY } from '@/lib/constants';

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
  const [items, setItems]       = useState<GalleryItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [isOpen, setIsOpen]     = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [filterCat, setFilterCat] = useState('all');


  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery');
      const data = await res.json();
      const list: GalleryItem[] = (Array.isArray(data) ? data : data.data ?? []).map(
        (item: GalleryItem) => {
          let parsedImages: string[] = [];
          if (Array.isArray(item.images)) {
            parsedImages = item.images;
          } else if (typeof item.images === 'string') {
            try {
              parsedImages = JSON.parse(item.images || '[]');
            } catch {
              parsedImages = [];
            }
          }
          return {
            ...item,
            images: parsedImages,
          };
        }
      );
      setItems(list);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);


  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
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
        images:      formData.images,       // sent as array; API should JSON.stringify before DB
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
      setIsOpen(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message || 'Failed to save gallery item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchItems();
      setDeleteId(null);
    } catch {
      setError('Failed to delete gallery item');
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
    setError('');
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
    setIsOpen(true);
  };

  const displayed = filterCat === 'all'
    ? items
    : items.filter(i => i.category === filterCat);

  const getSubmitButtonLabel = () => {
    if (saving) return 'Saving…';
    if (editingId) return 'Update Album';
    return 'Create Album';
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setError('');
  };

  const handleDialogOpen = () => {
    setIsOpen(true);
  };
  const handleOpenChange = (open: boolean) =>
  open ? handleDialogOpen() : handleDialogClose();

  const renderGalleryContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading gallery…</span>
        </div>
      );
    }

    if (displayed.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <Images className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground font-medium">
              {filterCat === 'all' ? 'No albums yet.' : `No albums in "${filterCat}".`}
            </p>
            {filterCat === 'all' && (
              <Button variant="outline" size="sm" className="mt-4" onClick={openCreate}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add your first album
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayed.map(item => {
          const cover     = item.heroImage ?? item.images?.[0];
          const imgCount  = (item.images?.length ?? 0) + (item.heroImage ? 1 : 0);
          return (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Cover */}
              <div className="relative h-44 bg-muted">
                {cover ? (
                  <Image src={cover} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
                    <Images className="w-10 h-10 text-primary/40" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                    {item.year}
                  </span>
                </div>
                {imgCount > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Images className="w-3 h-3" /> {imgCount} photo{imgCount === 1 ? '' : 's'}
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base leading-snug truncate">{item.title}</CardTitle>
                    {item.description && (
                      <CardDescription className="mt-1 line-clamp-2 text-xs">{item.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      variant="outline" size="icon" className="h-8 w-8"
                      onClick={() => openEdit(item)} title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline" size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                      onClick={() => setDeleteId(item.id)} title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage photos and memories — {items.length} album{items.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add Album
        </Button>
      </div>

      {/* Global error */}
      {error && !isOpen && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...CATEGORIES_ARRAY].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors capitalize ${
              filterCat === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-transparent hover:border-border'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {renderGalleryContent()}

      {/* Create / Edit Dialog  */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Album' : 'Create New Album'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-1">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="g-title">Title *</Label>
              <Input
                id="g-title"
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Annual Charity Gala 2024"
                required
              />
            </div>

            {/* Category + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="g-category">Category *</Label>
                <select
                  id="g-category"
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
                  required
                >
                  {CATEGORIES_ARRAY.map(c => (
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
                  onChange={e => setFormData(p => ({ ...p, year: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="g-desc">Description</Label>
              <Textarea
                id="g-desc"
                rows={3}
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Short description of this album…"
              />
            </div>

            {/* Hero Image */}
            <ImageUpload
              value={formData.heroImage}
              onChange={url => setFormData(p => ({ ...p, heroImage: url }))}
              label="Cover / Hero Image"
            />

            {/* Additional Images */}
            <AdditionalImages
              images={formData.images}
              onChange={imgs => setFormData(p => ({ ...p, images: imgs }))}
            />

            {/* Actions */}
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

      {/* Delete Confirm  */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the album and all its image references. This cannot be undone.
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
    </div>
  );
}