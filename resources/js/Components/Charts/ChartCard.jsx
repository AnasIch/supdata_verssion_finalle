import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";

export default function ChartCard({ title, description, children, className, delay = 0, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className={className}
        >
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base">{title}</CardTitle>
                            {description && <CardDescription>{description}</CardDescription>}
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </motion.div>
    );
}
