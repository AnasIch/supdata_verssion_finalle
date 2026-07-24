import BackButton from "@/Components/Auth/BackButton";

export default function AuthLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 py-16">
            <BackButton />
            <div className="w-full max-w-[440px]">
                {children}
            </div>
        </div>
    );
}
