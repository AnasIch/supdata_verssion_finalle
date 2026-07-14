import AuthIllustration from "@/Components/Auth/AuthIllustration";
import BackButton from "@/Components/Auth/BackButton";

export default function AuthLayout({ children }) {
    return (
        <div className="relative flex min-h-screen bg-[#f8fafc]">
            <BackButton />

            <div className="hidden lg:flex lg:w-[54%] relative items-center justify-center overflow-hidden p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-slate-50/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(59,130,246,0.07),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.05),transparent_45%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.03),transparent_60%)]" />
                <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-100/40 blur-[100px]" />
                <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-indigo-100/40 blur-[80px]" />
                <div className="relative z-10 w-full max-w-xl px-4">
                    <AuthIllustration />
                </div>
            </div>

            <div className="flex w-full items-center justify-center px-6 py-16 sm:px-8 lg:w-[46%] lg:px-12 xl:px-16">
                <div className="w-full max-w-[420px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
