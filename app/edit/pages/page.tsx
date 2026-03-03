'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { PageCard } from '@/components/pages/card';
import { PageFormDialog } from '@/components/pages/form-dialog';
import { ContentFormDialog } from '@/components/pages/content-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ButtonField { text: string; link: string; }

interface PageContent {
  id: number; pageId: number; name: string;
  image?: string; mainText?: string;
  subtext1?: string; subtext2?: string; subtext3?: string;
  lists?: string[];
  primaryButton?: ButtonField; secondaryButton?: ButtonField;
}

interface Page {
  id: number; slug: string; name: string;
  navbar: boolean; contents: PageContent[];
}

// ─── Empty form defaults ──────────────────────────────────────────────────────

const emptyPageForm = { slug: '', name: '', navbar: false };

const emptyContentForm = {
  name: '', image: '', mainText: '',
  subtext1: '', subtext2: '', subtext3: '',
  lists: [] as string[],
  primaryButton: { text: '', link: '' },
  secondaryButton: { text: '', link: '' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());

  // Page dialog
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [pageForm, setPageForm] = useState(emptyPageForm);

  // Content dialog
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [contentParentPageId, setContentParentPageId] = useState<number | null>(null);
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [contentForm, setContentForm] = useState(emptyContentForm);
  const [listInput, setListInput] = useState('');

  // Delete confirmations
  const [deletePageId, setDeletePageId] = useState<number | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<number | null>(null);

  // ─── Data ─────────────────────────────────────────────────────────────────

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error('Failed to load pages');
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  // ─── Page handlers ────────────────────────────────────────────────────────

  const openNewPage = () => {
    setEditingPageId(null);
    setPageForm(emptyPageForm);
    setError('');
    setPageDialogOpen(true);
  };

  const openEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setPageForm({ slug: page.slug, name: page.name, navbar: page.navbar });
    setError('');
    setPageDialogOpen(true);
  };

  const handlePageSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const method = editingPageId ? 'PATCH' : 'POST';
      const url = editingPageId ? `/api/pages/${editingPageId}` : '/api/pages';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to save page');
      }
      await fetchPages();
      setPageDialogOpen(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save page');
      throw err; // re-throw so dialog can clear submitting state
    }
  };

  const handlePageDelete = async () => {
    if (!deletePageId) return;
    try {
      const res = await fetch(`/api/pages/${deletePageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      await fetchPages();
      setDeletePageId(null);
    } catch {
      setError('Failed to delete page');
    }
  };

  // ─── Content handlers ─────────────────────────────────────────────────────

  const openNewContent = (pageId: number) => {
    setContentParentPageId(pageId);
    setEditingContentId(null);
    setContentForm(emptyContentForm);
    setListInput('');
    setError('');
    setContentDialogOpen(true);
  };

  const openEditContent = (pageId: number, content: PageContent) => {
    setContentParentPageId(pageId);
    setEditingContentId(content.id);
    setContentForm({
      name: content.name,
      image: content.image ?? '',
      mainText: content.mainText ?? '',
      subtext1: content.subtext1 ?? '',
      subtext2: content.subtext2 ?? '',
      subtext3: content.subtext3 ?? '',
      lists: content.lists ?? [],
      primaryButton: content.primaryButton ?? { text: '', link: '' },
      secondaryButton: content.secondaryButton ?? { text: '', link: '' },
    });
    setListInput((content.lists ?? []).join('\n'));
    setError('');
    setContentDialogOpen(true);
  };

  const handleContentSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...contentForm,
        pageId: contentParentPageId,
        lists: listInput.split('\n').map((s) => s.trim()).filter(Boolean),
        primaryButton: contentForm.primaryButton.text ? contentForm.primaryButton : null,
        secondaryButton: contentForm.secondaryButton.text ? contentForm.secondaryButton : null,
      };
      const method = editingContentId ? 'PATCH' : 'POST';
      const url = editingContentId
        ? `/api/pages/${contentParentPageId}/content/${editingContentId}`
        : `/api/pages/${contentParentPageId}/content`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to save section');
      }
      await fetchPages();
      setContentDialogOpen(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save section');
      throw err;
    }
  };

  const handleContentDelete = async () => {
    if (!deleteContentId || !contentParentPageId) return;
    try {
      const res = await fetch(`/api/pages/${contentParentPageId}/content/${deleteContentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete section');
      await fetchPages();
      setDeleteContentId(null);
      setContentParentPageId(null);
    } catch {
      setError('Failed to delete section');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const renderPageList = () => {
    if (loading) {
      return <p className="text-center text-muted-foreground py-12">Loading...</p>;
    }
    if (pages.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No pages yet. Create one to get started.
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="space-y-4">
        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            expanded={expandedPages.has(page.id)}
            onToggleExpand={() => toggleExpand(page.id)}
            onEditPage={() => openEditPage(page)}
            onDeletePage={() => setDeletePageId(page.id)}
            onAddSection={() => openNewContent(page.id)}
            onEditSection={(content) => openEditContent(page.id, content)}
            onDeleteSection={(contentId) => { setDeleteContentId(contentId); setContentParentPageId(page.id); }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <p className="text-muted-foreground mt-1">Manage static pages and their content sections</p>
        </div>
        <Button onClick={openNewPage}>
          <Plus className="w-4 h-4 mr-2" /> New Page
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderPageList()}

      {/* Page form dialog */}
      <PageFormDialog
        open={pageDialogOpen}
        onOpenChange={setPageDialogOpen}
        editingPageId={editingPageId}
        formData={pageForm}
        onFormChange={setPageForm}
        onSubmit={handlePageSubmit}
        error={error}
      />

      {/* Content section form dialog */}
      <ContentFormDialog
        open={contentDialogOpen}
        onOpenChange={setContentDialogOpen}
        editingContentId={editingContentId}
        formData={contentForm}
        listInput={listInput}
        onListInputChange={setListInput}
        onFormChange={setContentForm}
        onSubmit={handleContentSubmit}
        error={error}
      />

      {/* Delete page confirmation */}
      <AlertDialog open={deletePageId !== null} onOpenChange={(open) => !open && setDeletePageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the page and all its sections. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePageDelete} className="bg-destructive hover:bg-destructive/90">
              Delete Page
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete section confirmation */}
      <AlertDialog open={deleteContentId !== null} onOpenChange={(open) => !open && setDeleteContentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this content section. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleContentDelete} className="bg-destructive hover:bg-destructive/90">
              Delete Section
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}