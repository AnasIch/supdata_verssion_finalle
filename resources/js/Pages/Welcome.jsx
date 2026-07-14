export default function TestTailwind() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                    Tailwind CSS Works! 🎉
                </h1>

                <p className="text-gray-600 mb-6">
                    If you can see colors, spacing, rounded corners, and shadows,
                    then Tailwind is configured correctly.
                </p>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        Primary
                    </button>

                    <button className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition">
                        Secondary
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="h-16 rounded bg-red-500"></div>
                    <div className="h-16 rounded bg-green-500"></div>
                    <div className="h-16 rounded bg-yellow-500"></div>
                </div>
            </div>
        </div>
    );
}