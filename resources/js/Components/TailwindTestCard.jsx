export default function TailwindTestCard() {
    return (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">
                        Tailwind CSS Test
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                        Styling is working perfectly
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-cyan-50">
                        This card uses Tailwind utility classes for colors, spacing, shadows, layout, and rounded corners.
                    </p>
                </div>
                <div className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
                    ✅ Tailwind is active
                </div>
            </div>
        </div>
    );
}
