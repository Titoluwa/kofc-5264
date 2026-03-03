// components/pages/content-form-dialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/image-upload';

interface ButtonField { text: string; link: string; }

interface ContentFormData {
    name: string;
    image: string;
    mainText: string;
    subtext1: string;
    subtext2: string;
    subtext3: string;
    lists: string[];
    primaryButton: ButtonField;
    secondaryButton: ButtonField;
}

interface ContentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingContentId: number | null;
    formData: ContentFormData;
    listInput: string;
    onListInputChange: (value: string) => void;
    onFormChange: (data: ContentFormData) => void;
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
    error: string;
}

export function ContentFormDialog({
    open,
    onOpenChange,
    editingContentId,
    formData,
    listInput,
    onListInputChange,
    onFormChange,
    onSubmit,
    error,
}: Readonly<ContentFormDialogProps>) {
    const [submitting, setSubmitting] = useState(false);

    let buttonLabel: string;
    if (submitting) {
        buttonLabel = 'Saving...';
    } else if (editingContentId) {
        buttonLabel = 'Update Section';
    } else {
        buttonLabel = 'Add Section';
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        setSubmitting(true);
        await onSubmit(e);
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingContentId ? 'Edit Section' : 'Add New Section'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Section name */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Section Name <span className="text-destructive">*</span></Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                            placeholder="Hero Section"
                            required
                        />
                    </div>

                    {/* Image upload */}
                    <ImageUpload
                        label="Image"
                        value={formData.image}
                        onChange={(url) => onFormChange({ ...formData, image: url })}
                    />

                    {/* Main text */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Main Text</Label>
                        <Textarea
                            value={formData.mainText}
                            onChange={(e) => onFormChange({ ...formData, mainText: e.target.value })}
                            placeholder="Primary heading or body text..."
                            rows={3}
                        />
                    </div>

                    {/* Subtexts */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['subtext1', 'subtext2', 'subtext3'] as const).map((field, i) => (
                            <div key={field} className="flex flex-col gap-1.5">
                                <Label>Subtext {i + 1}</Label>
                                <Textarea
                                    value={formData[field]}
                                    onChange={(e) => onFormChange({ ...formData, [field]: e.target.value })}
                                    placeholder={`Subtext ${i + 1}...`}
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>

                    {/* List items */}
                    <div className="flex flex-col gap-1.5">
                        <Label>List Items</Label>
                        <Textarea
                            value={listInput}
                            onChange={(e) => onListInputChange(e.target.value)}
                            placeholder={'Item one\nItem two\nItem three'}
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground">One item per line</p>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(['primaryButton', 'secondaryButton'] as const).map((btn) => (
                            <div key={btn} className="flex flex-col gap-2 rounded-md border p-3">
                                <p className="text-sm font-medium">
                                    {btn === 'primaryButton' ? 'Primary' : 'Secondary'} Button
                                </p>
                                <Input
                                    value={formData[btn].text}
                                    onChange={(e) =>
                                        onFormChange({ ...formData, [btn]: { ...formData[btn], text: e.target.value } })
                                    }
                                    placeholder="Button label"
                                />
                                <Input
                                    value={formData[btn].link}
                                    onChange={(e) =>
                                        onFormChange({ ...formData, [btn]: { ...formData[btn], link: e.target.value } })
                                    }
                                    placeholder="https://..."
                                />
                            </div>
                        ))}
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                        {buttonLabel}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}