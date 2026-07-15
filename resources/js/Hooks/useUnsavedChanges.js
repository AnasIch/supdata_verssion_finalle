import { useState, useEffect, useCallback } from "react";

export function useUnsavedChanges(isDirty) {
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const confirmLeave = useCallback((callback) => {
        setPendingNavigation(() => callback);
        setLeaveDialogOpen(true);
    }, []);

    const cancelLeave = useCallback(() => {
        setLeaveDialogOpen(false);
        setPendingNavigation(null);
    }, []);

    const executeLeave = useCallback(() => {
        setLeaveDialogOpen(false);
        if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
        }
    }, [pendingNavigation]);

    return {
        leaveDialogOpen,
        confirmLeave,
        cancelLeave,
        executeLeave,
    };
}
