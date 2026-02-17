'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDescription, Alert } from '@/components/ui/alert';

interface ImageUploadProps {
    onImageSelect: (base64: string) => void;
    currentImage?: string;
}

export function ImageUpload({ onImageSelect, currentImage }: Readonly<ImageUploadProps>) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState('');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
        }

        try {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setPreview(base64);
            onImageSelect(base64);
            setError('');
        };
        reader.readAsDataURL(file);
        } catch (err) {
        setError('Failed to read file');
        }
    };

    return (
        <div className="space-y-4">
        <div>
            <Label htmlFor="image">Image</Label>
            <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
            Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
            </p>
        </div>

        {error && (
            <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {preview && (
            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
            />
            </div>
        )}
        </div>
    );
}
