import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/Components/UI/Input";

const SearchInput = React.forwardRef(
    ({ className, value, onClear, ...props }, ref) => {
        return (
            <div className={cn("relative", className)}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={ref}
                    type="search"
                    className="pl-9 pr-9"
                    value={value}
                    {...props}
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                    </button>
                )}
            </div>
        );
    }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
