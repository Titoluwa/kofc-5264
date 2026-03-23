// components/image-upload.tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

type Mode = 'upload' | 'url';

export function ImageUpload({ value, onChange, label = 'Image' }: Readonly<ImageUploadProps>) {
    const [mode, setMode] = useState<Mode>('upload');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setUploadError('');
        setUploading(true);
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Upload failed');
            onChange(data.url);
        } catch (err: any) {
            setUploadError(err.message ?? 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <div className="flex items-center gap-1 text-xs">
                    <button type="button" onClick={() => setMode('upload')}
                        className={cn('px-2 py-0.5 rounded transition-colors', mode === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                    >
                        <Upload className="w-3 h-3 inline mr-1" />Upload
                    </button>
                    <button type="button" onClick={() => setMode('url')}
                        className={cn('px-2 py-0.5 rounded transition-colors', mode === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                    >
                        <LinkIcon className="w-3 h-3 inline mr-1" />URL
                    </button>
                </div>
            </div>

            {mode === 'url' ? (
                <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
            ) : (
                <div className={cn(
                    'relative border-2 border-dashed rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-muted-foreground/60',
                    uploading && 'pointer-events-none opacity-60'
                )}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

                    {value ? (
                        <div className="relative h-40 w-full">
                            <Image src={value} alt="Preview" fill className="object-contain rounded-md p-1" />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6"
                                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                            {uploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <p className="text-xs">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6" />
                                    <p className="text-xs text-center">
                                        <span className="font-medium text-foreground">Click to upload</span> or drag & drop
                                    </p>
                                    <p className="text-xs">PNG, JPG, WebP, GIF up to 5MB</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
        </div>
    );
}