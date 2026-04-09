'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X, FileText, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFile, ACCEPT_STRINGS } from '@/lib/uploadHelper';

interface ContentUploadProps {
    textValue: string;
    fileValue: string;
    onTextChange: (text: string) => void;
    onFileChange: (url: string) => void;
    label?: string;
    textRequired?: boolean;
    textPlaceholder?: string;
    textRows?: number;
}

type Mode = 'text' | 'file';

export function ContentUpload({
    textValue,
    fileValue,
    onTextChange,
    onFileChange,
    label = 'Content',
    textRequired = false,
    textPlaceholder = 'Write the full content here…',
    textRows = 10,
}: Readonly<ContentUploadProps>) {
    const [mode, setMode] = useState<Mode>(fileValue ? 'file' : 'text');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setUploadError('');
        setUploading(true);
        setPendingFile(file);
        try {
            const url = await uploadFile(file, { category: 'document' });
            onFileChange(url);
        } catch (err: any) {
            setUploadError(err.message ?? 'Upload failed');
            setPendingFile(null);
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

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileChange('');
        setPendingFile(null);
        setUploadError('');
        if (inputRef.current) inputRef.current.value = '';
    };

    const switchMode = (newMode: Mode) => {
        setMode(newMode);
        setUploadError('');
    };

    const fileName = fileValue
        ? fileValue.split('/').pop() ?? fileValue
        : pendingFile?.name ?? '';

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <Label>
                {label}{' '}
                {!textRequired && (
                    <span className="text-muted-foreground text-xs font-normal">
                    {mode === 'file' ? '(file upload)' : '(text)'}
                    </span>
                )}
                </Label>

                {/* Mode toggle — mirrors ImageUpload style */}
                <div className="flex items-center gap-1 text-xs">
                <button
                    type="button"
                    onClick={() => switchMode('text')}
                    className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded transition-colors',
                    mode === 'text'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <AlignLeft className="w-3 h-3" />
                    Text
                </button>
                <button
                    type="button"
                    onClick={() => switchMode('file')}
                    className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded transition-colors',
                    mode === 'file'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <Upload className="w-3 h-3" />
                    File
                </button>
                </div>
            </div>

            {/* ── Text mode ── */}
            {mode === 'text' && (
                <Textarea
                value={textValue}
                onChange={(e) => onTextChange(e.target.value)}
                rows={textRows}
                placeholder={textPlaceholder}
                required={textRequired && !fileValue}
                />
            )}

            {/* ── File mode ── */}
            {mode === 'file' && (
                <>
                {/* Drop zone — only shown when no file is attached yet */}
                {!fileValue && (
                    <button
                    type="button"
                    className={cn(
                        'relative w-full border-2 border-dashed rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-left',
                        dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/30 hover:border-muted-foreground/60',
                        uploading && 'pointer-events-none opacity-60',
                    )}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPT_STRINGS.document}
                        className="hidden"
                        onChange={handleInputChange}
                    />

                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                        {uploading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <p className="text-xs">Uploading {pendingFile?.name}…</p>
                        </>
                        ) : (
                        <>
                            <Upload className="w-6 h-6" />
                            <p className="text-xs text-center">
                            <span className="font-medium text-foreground">Click to upload</span>{' '}
                            or drag &amp; drop
                            </p>
                            <p className="text-xs">PDF, Word, Excel, PowerPoint, TXT, ZIP</p>
                        </>
                        )}
                    </div>
                    </button>
                )}

                {/* Attached file pill — shown once a file URL exists */}
                {fileValue && (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
                    <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <a
                        href={fileValue}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 truncate text-sm underline underline-offset-2 text-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {fileName}
                    </a>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={clearFile}
                        aria-label="Remove file"
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                    </div>
                )}

                {/* Re-upload button after clearing */}
                {!fileValue && !uploading && (
                    <p className="text-xs text-muted-foreground">
                    Accepted: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .zip
                    </p>
                )}
                </>
            )}

            {uploadError && (
                <p className="text-xs text-destructive">{uploadError}</p>
            )}
        </div>
    );
}