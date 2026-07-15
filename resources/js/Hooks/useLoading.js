import { useState, useEffect } from "react";

export function useLoading(duration = 700) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    return loading;
}
