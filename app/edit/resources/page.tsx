'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Plus, FileText, Link as LinkIcon, Calendar } from 'lucide-react';
import { uploadFile, ACCEPT_STRINGS } from '@/lib/uploadHelper';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  url?: string;
  content?: string;
  file?: string;
  createdAt: string;
  updatedAt: string;
}

type ResourceFormData = Pick<Resource, 'title' | 'description' | 'category'> &
  Partial<Pick<Resource, 'url' | 'content' | 'file'>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: ResourceFormData = {
  title: '',
  description: '',
  category: '',
  url: '',
  content: '',
  file: '',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: number) => void;
}

function ResourceCard({ resource, onEdit, onDelete }: Readonly<ResourceCardProps>) {
  const fileName = resource.file?.split('/').pop() ?? 'File attachment';
  const updatedAt = new Date(resource.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base leading-tight">{resource.title}</CardTitle>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="icon" title="Edit" onClick={() => onEdit(resource)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" title="Delete" onClick={() => onDelete(resource.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
          {resource.url && (
            <a href={resource.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors underline">
              <LinkIcon className="w-3 h-3" /> External link
            </a>
          )}
          {resource.file && (
            <a href={resource.file} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors underline">
              <FileText className="w-3 h-3" /> {fileName}
            </a>
          )}
          {resource.content && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" /> Has content
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" /> {updatedAt}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>(EMPTY_FORM);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchResources(); }, []);

  // ── API helpers ──

  async function fetchResources() {
    try {
      setLoading(true);
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data: unknown = await res.json();
      setResources(Array.isArray(data) ? (data as Resource[]) : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const fileUrl = fileInput
        ? await uploadFile(fileInput, { category: 'document' })
        : formData.file;

      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/resources/${editingId}` : '/api/resources';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, file: fileUrl }),
      });

      if (!res.ok) throw new Error('Failed to save resource');

      await fetchResources();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to save resource');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/resources/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchResources();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete resource');
    }
  }

  // ── Dialog helpers ──

  function handleEdit(resource: Resource) {
    setEditingId(resource.id);
    setFormData({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      url: resource.url ?? '',
      content: resource.content ?? '',
      file: resource.file ?? '',
    });
    setFileInput(null);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFileInput(null);
    setError('');
  }

  function handleOpenNew() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsOpen(true);
  }

  function patch(field: keyof ResourceFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }

  // ── Derived state ──

  const grouped = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const categoryCount = Object.keys(grouped).length;

  function getSubmitLabel() {
    if (saving) return 'Saving…';
    if (editingId) return 'Update Resource';
    return 'Create Resource';
  }

  function renderContent() {
    if (loading) {
      return <p className="text-center text-muted-foreground py-12">Loading resources…</p>;
    }
    if (resources.length === 0) {
      return (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">No resources yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Resource" to get started.</p>
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="space-y-8">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                {category}
                <Badge variant="secondary">{items.length}</Badge>
              </h2>
              <div className="space-y-3">
                {items.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={handleEdit}
                    onDelete={setDeleteId}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Resources Management</h1>
          <p className="text-muted-foreground mt-2">
            {resources.length} resource{resources.length === 1 ? '' : 's'} across{' '}
            {categoryCount} categor{categoryCount === 1 ? 'y' : 'ies'}
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpenNew() : handleClose())}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}>
              <Plus className="w-4 h-4 mr-2" /> Add Resource
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Resource' : 'Create Resource'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={patch('title')}
                  placeholder="Resource title" required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={patch('description')}
                  placeholder="Brief description of this resource" rows={3} required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" value={formData.category} onChange={patch('category')}
                  placeholder="e.g. Forms, Guides, Announcements" required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="url">External URL (optional)</Label>
                <Input id="url" type="url" value={formData.url} onChange={patch('url')}
                  placeholder="https://example.com" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="content">Content / Notes (optional)</Label>
                <Textarea id="content" value={formData.content} onChange={patch('content')}
                  placeholder="Additional notes for this resource" rows={4} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="file">File Attachment (optional)</Label>
                <Input id="file" type="file" accept={ACCEPT_STRINGS.document}
                  onChange={(e) => setFileInput(e.target.files?.[0] ?? null)}
                  className="cursor-pointer" />
                {formData.file && !fileInput && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <FileText className="w-3 h-3" />
                    Current:{' '}
                    <a href={formData.file} target="_blank" rel="noreferrer"
                      className="underline truncate max-w-xs">
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

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {getSubmitLabel()}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
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