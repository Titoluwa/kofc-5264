import { Card, CardContent, CardHeader } from "@/components/ui/card";

function MemberCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardHeader className="pb-3">
                <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
            </CardContent>
        </Card>
    );
}

export default MemberCardSkeleton;
