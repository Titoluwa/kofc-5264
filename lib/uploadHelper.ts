export type UploadCategory = 'image' | 'document' | 'any';

const ALLOWED_TYPES: Record<UploadCategory, string[]> = {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/zip',
    ],
    any: [], // empty = no type restriction enforced client-side
};

export const ACCEPT_STRINGS: Record<UploadCategory, string> = {
    image: '.jpg,.jpeg,.png,.webp,.gif,.svg',
    document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip',
    any: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.webp,.gif,.svg',
};

export interface UploadResult {
    url: string;
}

export interface UploadOptions {
    /** Controls which MIME types are accepted. Defaults to 'any'. */
    category?: UploadCategory;
    /** Custom endpoint. Defaults to '/api/upload'. */
    endpoint?: string;
}

export async function uploadFile(file: File, options: UploadOptions = {}): Promise<string> {
    const { category = 'any', endpoint = '/api/upload' } = options;

    // Client-side type guard (server also validates)
    const allowed = ALLOWED_TYPES[category];
    if (allowed.length > 0 && !allowed.includes(file.type)) {
        throw new Error(`Invalid file type "${file.type}" for category "${category}".`);
    }

    const body = new FormData();
    body.append('file', file);
    // Pass the category so the server can apply the correct allow-list
    body.append('category', category);

    const res = await fetch(endpoint, { method: 'POST', body });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? 'Upload failed');
    }

    const { url } = (await res.json()) as UploadResult;
    return url;
}