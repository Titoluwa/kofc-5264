// components/pages/page-card.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Plus, ExternalLink, ChevronDown, ChevronRight, Layers } from 'lucide-react';
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

function Tag({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
            {children}
        </span>
    );
}

interface PageCardProps {
    page: Page;
    expanded: boolean;
    onToggleExpand: () => void;
    onEditPage: () => void;
    onDeletePage: () => void;
    onAddSection: () => void;
    onEditSection: (content: PageContent) => void;
    onDeleteSection: (contentId: number) => void;
}

export function PageCard({
  page,
  expanded,
  onToggleExpand,
  onEditPage,
  onDeletePage,
  onAddSection,
  onEditSection,
  onDeleteSection,
}: Readonly<PageCardProps>) {
  const renderSections = () => {
    if (!page.contents || page.contents.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
          No sections yet. Add one to build out this page.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {page.contents.map((content) => (
          <div
            key={content.id}
            className="flex items-start justify-between gap-2 rounded-md border p-3 bg-muted/30"
          >
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
              <Button
                variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => onEditSection(content)}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDeleteSection(content.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center gap-2">
          <button
            className="flex items-center gap-2 flex-1 text-left"
            onClick={onToggleExpand}
          >
            {expanded
              ? <ChevronDown className="w-4 h-4 shrink-0" />
              : <ChevronRight className="w-4 h-4 shrink-0" />
            }
            <div>
              <CardTitle className="text-base">{page.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                /{page.slug}
                <span className={cn('ml-1.5', page.navbar ? 'text-primary' : 'text-muted-foreground')}>
                  • {page.navbar ? 'Navbar' : 'Hidden'}
                </span>
                <span className="ml-1.5 text-muted-foreground">
                  • {page.contents?.length ?? 0} section{page.contents?.length === 1 ? '' : 's'}
                </span>
              </p>
            </div>
          </button>

          <div className="flex gap-2 shrink-0">
            <Link href={`/${page.slug}`} target="_blank">
              <Button variant="outline" size="icon" title="View page">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="icon" title="Edit page" onClick={onEditPage}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" title="Delete page" onClick={onDeletePage}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Content Sections
            </p>
            <Button size="sm" variant="outline" onClick={onAddSection}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
            </Button>
          </div>
          {renderSections()}
        </CardContent>
      )}
    </Card>
  );
}