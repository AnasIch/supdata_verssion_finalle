export default function SupdataLogo({ size = "default", variant = "dark", className = "" }) {
    const sizes = {
        xs: { icon: 20, text: "text-sm", sub: "text-[0.5rem]", gap: "gap-2" },
        sm: { icon: 28, text: "text-base", sub: "text-[0.55rem]", gap: "gap-2.5" },
        default: { icon: 34, text: "text-xl", sub: "text-[0.6rem]", gap: "gap-3" },
        lg: { icon: 40, text: "text-2xl", sub: "text-[0.7rem]", gap: "gap-3.5" },
    };

    const variants = {
        dark: { iconBg: "bg-slate-900", iconShadow: "shadow-slate-900/25", text: "text-slate-900", sub: "text-slate-400" },
        light: { iconBg: "bg-white/15", iconShadow: "shadow-black/10", text: "text-white", sub: "text-slate-300" },
        blue: { iconBg: "bg-blue-600", iconShadow: "shadow-blue-600/25", text: "text-slate-900", sub: "text-slate-400" },
    };

    const s = sizes[size] || sizes.default;
    const v = variants[variant] || variants.dark;

    return (
        <span className={`inline-flex items-center ${s.gap} ${className}`}>
            <span
                className={`relative flex items-center justify-center rounded-[0.6rem] ${s.iconBg} ${s.iconShadow} shadow-lg`}
                style={{ width: s.icon, height: s.icon }}
            >
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: s.icon * 0.55, height: s.icon * 0.55 }}
                >
                    <path
                        d="M8 10.5C8 8.01 10.01 6 12.5 6H14V10H12.5C11.12 10 10 11.12 10 12.5V14H8V10.5Z"
                        fill="white"
                        opacity="0.9"
                    />
                    <path
                        d="M18 10.5V14H16V12.5C16 11.12 14.88 10 13.5 10H14V6H16.5C18.99 6 21 8.01 21 10.5V14H18V10.5Z"
                        fill="white"
                        opacity="0.7"
                    />
                    <path
                        d="M8 18H10V19.5C10 20.88 11.12 22 12.5 22H14V26H12.5C10.01 26 8 23.99 8 21.5V18Z"
                        fill="white"
                        opacity="0.7"
                    />
                    <path
                        d="M18 18H16V21.5C16 22.88 14.88 24 13.5 24H14V26H16.5C18.99 26 21 23.99 21 21.5V18H18Z"
                        fill="white"
                        opacity="0.9"
                    />
                    <rect x="11" y="11" width="2" height="10" rx="1" fill="white" opacity="0.5" />
                    <rect x="19" y="11" width="2" height="10" rx="1" fill="white" opacity="0.5" />
                </svg>
            </span>
            <span className="flex flex-col leading-none">
                <span className={`font-bold tracking-tight ${s.text} ${v.text}`}>
                    SUPDATA
                </span>
                <span className={`font-semibold uppercase tracking-[0.22em] ${s.sub} ${v.sub}`}>
                    ERP
                </span>
            </span>
        </span>
    );
}
