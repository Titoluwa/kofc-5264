import { Resource } from '@/lib/constants';
import { Edit2, Trash2, LinkIcon, FileText, Calendar } from 'lucide-react';

interface ResourceCardProps {
    resource: Resource;
    onEdit: (resource: Resource) => void;
    onDelete: (id: number) => void;
}
export default function ResourceCard({ resource, onEdit, onDelete }: Readonly<ResourceCardProps>) {
    const fileName = resource.file?.split('/').pop() ?? 'File attachment';
    const updatedAt = new Date(resource.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });

    return (
        <div className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 hover:shadow-md hover:border-border/80 transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-sm leading-snug">{resource.title}</p>
                {/* Actions — hover reveal */}
                <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(resource)}
                        className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        title="Edit resource"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(resource.id)}
                        className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                        title="Delete resource"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {resource.description}
            </p>

            {/* Footer meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1 mt-auto border-t border-border/60">
                {resource.url && (
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-foreground transition-colors hover:underline underline-offset-2"
                    >
                        <LinkIcon className="w-3 h-3 shrink-0" />
                        External link
                    </a>
                )}
                {resource.file && (
                    <a
                        href={resource.file}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-foreground transition-colors hover:underline underline-offset-2"
                    >
                        <FileText className="w-3 h-3 shrink-0" />
                        {fileName}
                    </a>
                )}
                {resource.content && !resource.file && !resource.url && (
                    <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 shrink-0" />
                        Has content
                    </span>
                )}
                <span className="flex items-center gap-1 ml-auto">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {updatedAt}
                </span>
            </div>
        </div>
    );
}