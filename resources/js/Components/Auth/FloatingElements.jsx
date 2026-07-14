import { motion } from "framer-motion";

const shapes = [
    { size: 120, x: "10%", y: "20%", delay: 0 },
    { size: 80, x: "75%", y: "15%", delay: 0.5 },
    { size: 60, x: "85%", y: "65%", delay: 1 },
    { size: 100, x: "20%", y: "75%", delay: 1.5 },
    { size: 50, x: "60%", y: "80%", delay: 0.8 },
];

export default function FloatingElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-primary/[0.06]"
                    style={{
                        width: shape.size,
                        height: shape.size,
                        left: shape.x,
                        top: shape.y,
                    }}
                    animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 6,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
            <motion.div
                className="absolute -right-20 -bottom-20 size-80 rounded-full bg-primary/[0.03]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -left-16 -top-16 size-64 rounded-full bg-primary/[0.04]"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
        </div>
    );
}
