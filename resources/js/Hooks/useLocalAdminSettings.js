import { useState, useCallback, useRef } from "react";
import { getLocalAdminSettingsData } from "@/Mocks/localAdminSettings";

export function useLocalAdminSettings() {
    const defaultsRef = useRef(getLocalAdminSettingsData());
    const [data, setData] = useState(() => JSON.parse(JSON.stringify(defaultsRef.current)));
    const [isDirty, setIsDirty] = useState(false);

    const updateField = useCallback((section, key, value) => {
        setData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [key]: value },
        }));
        setIsDirty(true);
    }, []);

    const toggleField = useCallback((section, key) => {
        setData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [key]: !prev[section][key] },
        }));
        setIsDirty(true);
    }, []);

    const resetChanges = useCallback(() => {
        setData(JSON.parse(JSON.stringify(defaultsRef.current)));
        setIsDirty(false);
    }, []);

    const saveChanges = useCallback(() => {
        defaultsRef.current = JSON.parse(JSON.stringify(data));
        setIsDirty(false);
    }, [data]);

    return { data, isDirty, updateField, toggleField, resetChanges, saveChanges };
}
