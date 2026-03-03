// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// import { Trash2, Edit2, Plus, ExternalLink } from 'lucide-react';
// import Link from 'next/link';
// import { Switch } from '@/components/ui/switch';
// import { cn } from '@/lib/utils';

// interface Page {
//   id: number;
//   slug: string;
//   name: string;
//   contents: string[];
//   navbar: boolean;
// }

// export default function PagesPage() {
//   const [pages, setPages] = useState<Page[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [formData, setFormData] = useState({
//     slug: '',
//     name: '',
//     navbar: false,
//   });

//   useEffect(() => {
//     fetchPages();
//   }, []);

//   const fetchPages = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/pages');
//       if (!response.ok) throw new Error('Failed to fetch pages');
//       const data = await response.json();
//       setPages(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError('Failed to load pages');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.SubmitEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const method = editingId ? 'PATCH' : 'POST';
//       const url = editingId ? `/api/pages/${editingId}` : '/api/pages';

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error('Failed to save page');

//       await fetchPages();
//       setIsOpen(false);
//       setEditingId(null);
//       setFormData({ slug: '', name: '', navbar: false });
//     } catch (err) {
//       setError('Failed to save page');
//       console.error(err);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;
//     try {
//       const response = await fetch(`/api/pages/${deleteId}`, { method: 'DELETE' });
//       if (!response.ok) throw new Error('Failed to delete');
//       await fetchPages();
//       setDeleteId(null);
//     } catch (err) {
//       setError('Failed to delete page');
//       console.error(err);
//     }
//   };

//   let pageListContent: React.ReactNode;
//   if (loading) {
//     pageListContent = <p className="text-center text-muted-foreground py-12">Loading...</p>;
//   } else if (pages.length === 0) {
//     pageListContent = <Card><CardContent className="pt-6 text-center text-muted-foreground">No pages yet. Create one to get started.</CardContent></Card>;
//   } else {
//     pageListContent = (
//       <div className="space-y-4">
//         {pages.map((page) => (
//           <Card key={page.id}>
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-base">{page.name}</CardTitle>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {page.navbar ? '/' : '#'}{page.slug} {"  "}
//                     <span className={cn("mt-1", page.navbar ? "text-primary" : "text-red-500")}>
//                       ({page.navbar ? 'Navbar Page' : 'Not a Navbar Page'})
//                     </span>
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Link href={`/${page.slug}`} target="_blank">
//                     <Button variant="outline" size="icon">
//                       <ExternalLink className="w-4 h-4" />
//                     </Button>
//                   </Link>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => {
//                       setEditingId(page.id);
//                       setFormData({
//                         slug: page.slug,
//                         name: page.name,
//                         navbar: page.navbar
//                       });
//                       setIsOpen(true);
//                     }}
//                   >
//                     <Edit2 className="w-4 h-4" />
//                   </Button>
//                   <Button variant="outline" size="icon" onClick={() => setDeleteId(page.id)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground line-clamp-2">{page.contents}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 space-y-8">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold">Pages Management</h1>
//           <p className="text-muted-foreground mt-2">Manage static pages and content</p>
//         </div>
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => { setEditingId(null); setFormData({ slug: '', name: '', navbar: false }); }}>
//               <Plus className="w-4 h-4 mr-2" />
//               New Page
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>{editingId ? 'Edit Page' : 'Create New Page'}</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
//               <div className="flex flex-col gap-2">
//                 <Label>Slug (URL path) </Label>
//                 <Input 
//                   value={formData.slug} 
//                   onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replaceAll(/\s+/g, '-') })} 
//                   placeholder="about" 
//                   required 
//                   className='border border-primary'
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>Title *</Label>
//                 <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required  className='border border-primary'/>
//               </div>

//               <div className='flex flex-col gap-2'>
//                 <Label>Navbar </Label>
//                 <Switch checked={formData.navbar} onCheckedChange={(value: any) => setFormData({ ...formData, navbar: value })} required className='primary'>
//                 </Switch>
//               </div>
//               <Button type="submit" className="w-full">{editingId ? 'Update Page' : 'Create Page'}</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {pageListContent}

//       <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Page</AlertDialogTitle>
//             <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2">
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete</AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit2, Plus, ExternalLink, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

const emptyPageForm = { slug: '', name: '', navbar: false };

const emptyContentForm: Omit<PageContent, 'id' | 'pageId'> = {
  name: '', image: '', mainText: '',
  subtext1: '', subtext2: '', subtext3: '',
  lists: [],
  primaryButton: { text: '', link: '' },
  secondaryButton: { text: '', link: '' },
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
      {children}
    </span>
  );
}

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

  // Delete dialogs
  const [deletePageId, setDeletePageId] = useState<number | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<number | null>(null);

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  // Page CRUD
  const openNewPage = () => {
    setEditingPageId(null); setPageForm(emptyPageForm); setError(''); setPageDialogOpen(true);
  };
  const openEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setPageForm({ slug: page.slug, name: page.name, navbar: page.navbar });
    setError(''); setPageDialogOpen(true);
  };
  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const method = editingPageId ? 'PATCH' : 'POST';
      const url = editingPageId ? `/api/pages/${editingPageId}` : '/api/pages';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageForm) });
      if (!res.ok) throw new Error();
      await fetchPages(); setPageDialogOpen(false);
    } catch { setError('Failed to save page'); }
  };
  const handlePageDelete = async () => {
    if (!deletePageId) return;
    try {
      const res = await fetch(`/api/pages/${deletePageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await fetchPages(); setDeletePageId(null);
    } catch { setError('Failed to delete page'); }
  };

  // Content CRUD
  const openNewContent = (pageId: number) => {
    setContentParentPageId(pageId); setEditingContentId(null);
    setContentForm(emptyContentForm); setListInput(''); setError(''); setContentDialogOpen(true);
  };
  const openEditContent = (pageId: number, content: PageContent) => {
    setContentParentPageId(pageId); setEditingContentId(content.id);
    setContentForm({
      name: content.name, image: content.image ?? '', mainText: content.mainText ?? '',
      subtext1: content.subtext1 ?? '', subtext2: content.subtext2 ?? '', subtext3: content.subtext3 ?? '',
      lists: content.lists ?? [],
      primaryButton: content.primaryButton ?? { text: '', link: '' },
      secondaryButton: content.secondaryButton ?? { text: '', link: '' },
    });
    setListInput((content.lists ?? []).join('\n'));
    setError(''); setContentDialogOpen(true);
  };
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const payload = {
        ...contentForm,
        pageId: contentParentPageId,
        lists: listInput.split('\n').map((s) => s.trim()).filter(Boolean),
        primaryButton: contentForm.primaryButton?.text ? contentForm.primaryButton : null,
        secondaryButton: contentForm.secondaryButton?.text ? contentForm.secondaryButton : null,
      };
      const method = editingContentId ? 'PATCH' : 'POST';
      const url = editingContentId
        ? `/api/pages/${contentParentPageId}/content/${editingContentId}`
        : `/api/pages/${contentParentPageId}/content`;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      await fetchPages(); setContentDialogOpen(false);
    } catch { setError('Failed to save section'); }
  };
  const handleContentDelete = async () => {
    if (!deleteContentId || !contentParentPageId) return;
    try {
      const res = await fetch(`/api/pages/${contentParentPageId}/content/${deleteContentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await fetchPages(); setDeleteContentId(null); setContentParentPageId(null);
    } catch { setError('Failed to delete section'); }
  };

  const toggleExpand = (id: number) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <p className="text-muted-foreground mt-1">Manage static pages and their content sections</p>
        </div>
        <Button onClick={openNewPage}>
          <Plus className="w-4 h-4 mr-2" /> New Page
        </Button>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {loading ? (
        <p className="text-center text-muted-foreground py-12">Loading...</p>
      ) : pages.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">No pages yet. Create one to get started.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => {
            const expanded = expandedPages.has(page.id);
            return (
              <Card key={page.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center gap-2">
                    <button className="flex items-center gap-2 flex-1 text-left" onClick={() => toggleExpand(page.id)}>
                      {expanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                      <div>
                        <CardTitle className="text-base">{page.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          /{page.slug}
                          <span className={cn('ml-1.5', page.navbar ? 'text-primary' : 'text-muted-foreground')}>
                            • {page.navbar ? 'Navbar' : 'Hidden'}
                          </span>
                          <span className="ml-1.5 text-muted-foreground">
                            • {page.contents?.length ?? 0} section{page.contents?.length !== 1 ? 's' : ''}
                          </span>
                        </p>
                      </div>
                    </button>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/${page.slug}`} target="_blank">
                        <Button variant="outline" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="outline" size="icon" onClick={() => openEditPage(page)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => setDeletePageId(page.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>

                {expanded && (
                  <CardContent className="pt-0 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> Content Sections
                      </p>
                      <Button size="sm" variant="outline" onClick={() => openNewContent(page.id)}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
                      </Button>
                    </div>

                    {!page.contents || page.contents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                        No sections yet. Add one to build out this page.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {page.contents.map((content) => (
                          <div key={content.id} className="flex items-start justify-between gap-2 rounded-md border p-3 bg-muted/30">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{content.name}</p>
                              {content.mainText && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{content.mainText}</p>
                              )}
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {content.image && <Tag>Image</Tag>}
                                {content.lists && content.lists.length > 0 && <Tag>{content.lists.length} list items</Tag>}
                                {content.primaryButton?.text && <Tag>Primary CTA</Tag>}
                                {content.secondaryButton?.text && <Tag>Secondary CTA</Tag>}
                              </div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditContent(page.id, content)}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => { setDeleteContentId(content.id); setContentParentPageId(page.id); }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Page Dialog */}
      <Dialog open={pageDialogOpen} onOpenChange={setPageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingPageId ? 'Edit Page' : 'Create New Page'}</DialogTitle></DialogHeader>
          <form onSubmit={handlePageSubmit} className="flex flex-col gap-4 mt-2">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="flex flex-col gap-1.5">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input value={pageForm.name} onChange={(e) => setPageForm({ ...pageForm, name: e.target.value })} placeholder="About Us" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Slug <span className="text-destructive">*</span></Label>
              <Input
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="about-us" required
              />
              <p className="text-xs text-muted-foreground">/{pageForm.slug || 'your-slug'}</p>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="cursor-pointer">Show in Navbar</Label>
                <p className="text-xs text-muted-foreground">Display in the navigation bar</p>
              </div>
              <Switch checked={pageForm.navbar} onCheckedChange={(v) => setPageForm({ ...pageForm, navbar: v })} />
            </div>
            <Button type="submit" className="w-full">{editingPageId ? 'Update Page' : 'Create Page'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Content Section Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingContentId ? 'Edit Section' : 'Add New Section'}</DialogTitle></DialogHeader>
          <form onSubmit={handleContentSubmit} className="flex flex-col gap-4 mt-2">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="flex flex-col gap-1.5">
              <Label>Section Name <span className="text-destructive">*</span></Label>
              <Input value={contentForm.name} onChange={(e) => setContentForm({ ...contentForm, name: e.target.value })} placeholder="Hero Section" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Image URL</Label>
              <Input value={contentForm.image ?? ''} onChange={(e) => setContentForm({ ...contentForm, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Main Text</Label>
              <Textarea value={contentForm.mainText ?? ''} onChange={(e) => setContentForm({ ...contentForm, mainText: e.target.value })} placeholder="Primary heading or body text..." rows={3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['subtext1', 'subtext2', 'subtext3'] as const).map((field, i) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <Label>Subtext {i + 1}</Label>
                  <Textarea value={contentForm[field] ?? ''} onChange={(e) => setContentForm({ ...contentForm, [field]: e.target.value })} placeholder={`Subtext ${i + 1}...`} rows={2} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>List Items</Label>
              <Textarea value={listInput} onChange={(e) => setListInput(e.target.value)} placeholder={"Item one\nItem two\nItem three"} rows={4} />
              <p className="text-xs text-muted-foreground">One item per line</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['primaryButton', 'secondaryButton'] as const).map((btn) => (
                <div key={btn} className="flex flex-col gap-2 rounded-md border p-3">
                  <p className="text-sm font-medium">{btn === 'primaryButton' ? 'Primary' : 'Secondary'} Button</p>
                  <Input value={contentForm[btn]?.text ?? ''} onChange={(e) => setContentForm({ ...contentForm, [btn]: { ...contentForm[btn]!, text: e.target.value } })} placeholder="Button label" />
                  <Input value={contentForm[btn]?.link ?? ''} onChange={(e) => setContentForm({ ...contentForm, [btn]: { ...contentForm[btn]!, link: e.target.value } })} placeholder="https://..." />
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full">{editingContentId ? 'Update Section' : 'Add Section'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Page */}
      <AlertDialog open={deletePageId !== null} onOpenChange={(open) => !open && setDeletePageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the page and all its sections. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePageDelete} className="bg-destructive hover:bg-destructive/90">Delete Page</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Section */}
      <AlertDialog open={deleteContentId !== null} onOpenChange={(open) => !open && setDeleteContentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this content section. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleContentDelete} className="bg-destructive hover:bg-destructive/90">Delete Section</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}