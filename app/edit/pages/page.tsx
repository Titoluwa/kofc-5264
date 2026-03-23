'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Layers } from 'lucide-react';
import { PageCard } from '@/components/pages/card';
import { PageFormDialog } from '@/components/pages/form-dialog';
import { ContentFormDialog } from '@/components/pages/content-dialog';
import { PageContent, Page } from '@/lib/constants';
import { PagesSkeleton } from '@/components/skeleton';

const emptyPageForm = { slug: '', name: '', navbar: false };

const emptyContentForm = {
  name: '', image: '', mainText: '',
  subtext1: '', subtext2: '', subtext3: '',
  lists: [] as string[],
  primaryButton: { text: '', link: '' },
  secondaryButton: { text: '', link: '' },
};


export default function PagesPage() {

  const [pages, setPages]           = useState<Page[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());

  // Page dialog
  const [pageDialogOpen, setPageDialogOpen]   = useState(false);
  const [editingPageId, setEditingPageId]     = useState<number | null>(null);
  const [pageForm, setPageForm]               = useState(emptyPageForm);
  const [pageFormError, setPageFormError]     = useState('');

  // Content dialog
  const [contentDialogOpen, setContentDialogOpen]       = useState(false);
  const [contentParentPageId, setContentParentPageId]   = useState<number | null>(null);
  const [editingContentId, setEditingContentId]         = useState<number | null>(null);
  const [contentForm, setContentForm]                   = useState(emptyContentForm);
  const [listInput, setListInput]                       = useState('');
  const [contentFormError, setContentFormError]         = useState('');

  // Delete confirmations
  const [deletePageId, setDeletePageId]       = useState<number | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<number | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error('Failed to load pages');
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load pages', {
        description: 'There was a problem fetching pages. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const openNewPage = () => {
    setEditingPageId(null);
    setPageForm(emptyPageForm);
    setPageFormError('');
    setPageDialogOpen(true);
  };

  const openEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setPageForm({ slug: page.slug, name: page.name, navbar: page.navbar });
    setPageFormError('');
    setPageDialogOpen(true);
  };

  const handlePageSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageFormError('');
    try {
      const method = editingPageId ? 'PATCH' : 'POST';
      const url    = editingPageId ? `/api/pages/${editingPageId}` : '/api/pages';
      const res    = await fetch(url, {
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
      toast.success(editingPageId ? 'Page updated' : 'Page created', {
        description: editingPageId
          ? `"${pageForm.name}" has been updated.`
          : `"${pageForm.name}" has been created.`,
      });
    } catch (err: any) {
      const msg = err.message ?? 'Failed to save page';
      setPageFormError(msg);
      toast.error('Failed to save page', { description: msg });
      throw err;
    }
  };

  const handlePageDelete = async () => {
    if (!deletePageId) return;
    const target = pages.find((p) => p.id === deletePageId);
    try {
      const res = await fetch(`/api/pages/${deletePageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      await fetchPages();
      setDeletePageId(null);
      toast.success('Page deleted', {
        description: target ? `"${target.name}" has been removed.` : 'The page has been removed.',
      });
    } catch {
      toast.error('Failed to delete page', {
        description: 'Something went wrong while removing this page.',
      });
    }
  };

  const openNewContent = (pageId: number) => {
    setContentParentPageId(pageId);
    setEditingContentId(null);
    setContentForm(emptyContentForm);
    setListInput('');
    setContentFormError('');
    setContentDialogOpen(true);
  };

  const openEditContent = (pageId: number, content: PageContent) => {
    setContentParentPageId(pageId);
    setEditingContentId(content.id);
    setContentForm({
      name:            content.name,
      image:           content.image           ?? '',
      mainText:        content.mainText        ?? '',
      subtext1:        content.subtext1        ?? '',
      subtext2:        content.subtext2        ?? '',
      subtext3:        content.subtext3        ?? '',
      lists:           content.lists           ?? [],
      primaryButton:   content.primaryButton   ?? { text: '', link: '' },
      secondaryButton: content.secondaryButton ?? { text: '', link: '' },
    });
    setListInput((content.lists ?? []).join('\n'));
    setContentFormError('');
    setContentDialogOpen(true);
  };

  const handleContentSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContentFormError('');
    try {
      const payload = {
        ...contentForm,
        pageId:          contentParentPageId,
        lists:           listInput.split('\n').map((s) => s.trim()).filter(Boolean),
        primaryButton:   contentForm.primaryButton.text   ? contentForm.primaryButton   : null,
        secondaryButton: contentForm.secondaryButton.text ? contentForm.secondaryButton : null,
      };
      const method = editingContentId ? 'PATCH' : 'POST';
      const url    = editingContentId
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
      toast.success(editingContentId ? 'Section updated' : 'Section added', {
        description: editingContentId
          ? `"${contentForm.name}" has been updated.`
          : `"${contentForm.name}" has been added to the page.`,
      });
    } catch (err: any) {
      const msg = err.message ?? 'Failed to save section';
      setContentFormError(msg);
      toast.error('Failed to save section', { description: msg });
      throw err;
    }
  };

  const handleContentDelete = async () => {
    if (!deleteContentId || !contentParentPageId) return;
    try {
      const res = await fetch(
        `/api/pages/${contentParentPageId}/content/${deleteContentId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete section');
      await fetchPages();
      setDeleteContentId(null);
      setContentParentPageId(null);
      toast.success('Section deleted', { description: 'The content section has been removed.' });
    } catch {
      toast.error('Failed to delete section', {
        description: 'Something went wrong while removing this section.',
      });
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const pageToDelete = pages.find((p) => p.id === deletePageId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
              {!loading && (
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-sm">
                  {pages.length}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Manage static pages and their content sections
            </p>
          </div>

          <Button onClick={openNewPage} className="w-full sm:w-auto gap-2 rounded-xl shrink-0">
            <Plus className="w-4 h-4" />
            New Page
          </Button>
        </div>

        {/* Loading */}
        {loading && <PagesSkeleton />}

        {/* Empty state */}
        {!loading && pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-2xl bg-muted/20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layers className="w-7 h-7 text-muted-foreground opacity-60" />
            </div>
            <p className="font-semibold text-lg">No pages yet</p>
            <p className="text-muted-foreground text-sm mt-1 mb-5">
              Create your first page to start managing content.
            </p>
            <Button onClick={openNewPage} className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              New Page
            </Button>
          </div>
        )}

        {/* Page list */}
        {!loading && pages.length > 0 && (
          <div className="space-y-3">
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
                onDeleteSection={(contentId) => {
                  setDeleteContentId(contentId);
                  setContentParentPageId(page.id);
                }}
              />
            ))}
          </div>
        )}

        {/* Page form dialog */}
        <PageFormDialog
          open={pageDialogOpen}
          onOpenChange={setPageDialogOpen}
          editingPageId={editingPageId}
          formData={pageForm}
          onFormChange={setPageForm}
          onSubmit={handlePageSubmit}
          error={pageFormError}
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
          error={contentFormError}
        />

        {/* Delete page confirmation */}
        <AlertDialog open={deletePageId !== null} onOpenChange={(open) => !open && setDeletePageId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Page</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {pageToDelete ? `"${pageToDelete.name}"` : 'this page'}
                </span>
                {'? '}All its content sections will be permanently removed. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handlePageDelete}
                className="bg-destructive hover:bg-destructive/90 rounded-lg"
              >
                Delete Page
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete section confirmation */}
        <AlertDialog open={deleteContentId !== null} onOpenChange={(open) => !open && setDeleteContentId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this content section? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleContentDelete}
                className="bg-destructive hover:bg-destructive/90 rounded-lg"
              >
                Delete Section
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}