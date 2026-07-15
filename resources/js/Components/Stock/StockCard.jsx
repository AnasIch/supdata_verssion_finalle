import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import StockStatusBadge from "./StockStatusBadge";

export default function StockCard({ product, onView, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">{product.reference}</span>
                        <StockStatusBadge status={product.status} />
                    </div>
                    <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{product.category} · {product.agency}</p>
                    <div className="mt-2 flex items-center gap-3">
                        <span className={`text-sm font-bold ${product.quantity <= product.minThreshold ? "text-red-500" : "text-slate-900"}`}>
                            {product.quantity} unités
                        </span>
                        <span className="text-xs text-slate-400">Seuil: {product.minThreshold}</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    onClick={() => onView(product)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                    <Eye className="size-3.5" />
                    Voir les détails
                </button>
            </div>
        </motion.div>
    );
}
