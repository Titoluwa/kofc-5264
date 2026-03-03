// components/pages/page-form-dialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PageFormData {
    slug: string;
    name: string;
    navbar: boolean;
}

interface PageFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingPageId: number | null;
    formData: PageFormData;
    onFormChange: (data: PageFormData) => void;
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
    error: string;
}

export function PageFormDialog({
    open,
    onOpenChange,
    editingPageId,
    formData,
    onFormChange,
    onSubmit,
    error,
}: Readonly<PageFormDialogProps>) {

    const [submitting, setSubmitting] = useState(false);

    let buttonLabel: string;
    if (submitting) {
        buttonLabel = 'Saving...';
    } else if (editingPageId) {
        buttonLabel = 'Update Page';
    } else {
        buttonLabel = 'Create Page';
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        setSubmitting(true);
        await onSubmit(e);
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingPageId ? 'Edit Page' : 'Create New Page'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit as unknown as (e: React.SyntheticEvent<HTMLFormElement>) => void} className="flex flex-col gap-4 mt-2">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Label>Title <span className="text-destructive">*</span></Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                            placeholder="About Us"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Slug <span className="text-destructive">*</span></Label>
                        <Input
                            value={formData.slug}
                            onChange={(e) =>
                                onFormChange({ ...formData, slug: e.target.value.toLowerCase().replaceAll(/\s+/g, '-') })
                            }
                            placeholder="about-us"
                            required
                        />
                        <p className="text-xs text-muted-foreground">/{formData.slug || 'your-slug'}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                            <Label className="cursor-pointer">Show in Navbar</Label>
                            <p className="text-xs text-muted-foreground">Display in the navigation bar</p>
                        </div>
                        <Switch
                            checked={formData.navbar}
                            onCheckedChange={(v) => onFormChange({ ...formData, navbar: v })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                        {buttonLabel}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}