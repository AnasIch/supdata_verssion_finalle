import { useRef } from "react";
import { Camera, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/Components/UI/Avatar";
import { cn } from "@/lib/utils";

export default function ProfileAvatar({ initials, name, size = "lg", editable = false, onUpload }) {
    const inputRef = useRef(null);

    const sizeClasses = {
        sm: "size-16",
        md: "size-24",
        lg: "size-32",
        xl: "size-40",
    };

    const textSizes = {
        sm: "text-xl",
        md: "text-3xl",
        lg: "text-4xl",
        xl: "text-5xl",
    };

    return (
        <div className="relative inline-block">
            <Avatar className={cn(sizeClasses[size], "ring-4 ring-white shadow-lg")}>
                <AvatarFallback className={cn("bg-slate-900 font-bold text-white", textSizes[size])}>
                    {initials || <User className="size-1/2" />}
                </AvatarFallback>
            </Avatar>
            {editable && (
                <>
                    <button
                        onClick={() => inputRef.current?.click()}
                        aria-label="Changer la photo de profil"
                        className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all hover:bg-slate-800 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    >
                        <Camera size={16} />
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUpload}
                    />
                </>
            )}
        </div>
    );
}
