import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { History } from "lucide-react";

function TimelineItem({ item, isLast }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="size-2 shrink-0 rounded-full bg-slate-300 mt-2" />
                {!isLast && <div className="w-px flex-1 bg-slate-200" />}
            </div>
            <div className="flex-1 pb-5">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-sm font-medium text-slate-900">{item.action}</p>
                        <p className="text-xs text-slate-500">{item.user}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
                </div>
            </div>
        </div>
    );
}

export default function AuditTimelineSection({ data }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <History className="size-4" />
                    </div>
                    Journal des modifications
                </CardTitle>
                <CardDescription>Dernières modifications des paramètres.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    {data.map((item, i) => (
                        <TimelineItem key={item.id} item={item} isLast={i === data.length - 1} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
