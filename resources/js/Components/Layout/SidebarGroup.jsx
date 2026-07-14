import SidebarItem from "./SidebarItem";
import { cn } from "@/lib/utils";

export default function SidebarGroup({ title, items, collapsed, startIndex = 0 }) {
    return (
        <div className="py-1">
            {!collapsed && title && (
                <p className="mb-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    {title}
                </p>
            )}
            <div className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
                {items.map((item, i) => (
                    <SidebarItem
                        key={item.href}
                        item={item}
                        collapsed={collapsed}
                        index={startIndex + i}
                    />
                ))}
            </div>
        </div>
    );
}
