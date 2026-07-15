import { useState, useCallback, useMemo } from "react";
import { permissionGroups as defaultGroups } from "@/Mocks/permissionGroups";

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function countPermissions(groups, state) {
    let total = 0;
    let active = 0;
    for (const group of groups) {
        for (const perm of group.permissions) {
            total++;
            if (state[group.key]?.[perm.key]) active++;
        }
    }
    return { total, active, inactive: total - active };
}

export function usePermissions(initialState, groups = defaultGroups) {
    const [permissions, setPermissions] = useState(() => deepClone(initialState));
    const [savedSnapshot, setSavedSnapshot] = useState(() => deepClone(initialState));

    const isDirty = useMemo(
        () => JSON.stringify(permissions) !== JSON.stringify(savedSnapshot),
        [permissions, savedSnapshot]
    );

    const toggle = useCallback((moduleKey, permKey) => {
        setPermissions((prev) => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                [permKey]: !prev[moduleKey]?.[permKey],
            },
        }));
    }, []);

    const toggleModule = useCallback((moduleKey, checked) => {
        setPermissions((prev) => {
            const group = groups.find((g) => g.key === moduleKey);
            if (!group) return prev;
            const modulePerms = {};
            for (const p of group.permissions) {
                modulePerms[p.key] = checked;
            }
            return { ...prev, [moduleKey]: modulePerms };
        });
    }, [groups]);

    const selectAll = useCallback(() => {
        setPermissions((prev) => {
            const next = { ...prev };
            for (const group of groups) {
                next[group.key] = {};
                for (const p of group.permissions) {
                    next[group.key][p.key] = true;
                }
            }
            return next;
        });
    }, [groups]);

    const deselectAll = useCallback(() => {
        setPermissions((prev) => {
            const next = { ...prev };
            for (const group of groups) {
                next[group.key] = {};
                for (const p of group.permissions) {
                    next[group.key][p.key] = false;
                }
            }
            return next;
        });
    }, [groups]);

    const reset = useCallback(() => {
        setPermissions(deepClone(savedSnapshot));
    }, [savedSnapshot]);

    const save = useCallback(() => {
        setSavedSnapshot(deepClone(permissions));
    }, [permissions]);

    const stats = useMemo(() => countPermissions(groups, permissions), [groups, permissions]);

    return {
        permissions,
        isDirty,
        toggle,
        toggleModule,
        selectAll,
        deselectAll,
        reset,
        save,
        stats,
    };
}
