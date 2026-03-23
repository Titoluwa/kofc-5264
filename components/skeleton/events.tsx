import { Card, CardContent, CardHeader } from "../ui/card";

export default function EventCardSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden animate-pulse">
            <div className="w-full h-44 bg-muted" />
            <CardHeader className="pb-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded mt-2" />
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
                <div className="pt-3 mt-3 border-t border-border space-y-1.5">
                <div className="h-3 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
                </div>
            </CardContent>
        </Card>
    )
}