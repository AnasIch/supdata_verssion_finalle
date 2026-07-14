import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, X } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import UserPersonalInformation from "./UserPersonalInformation";
import UserProfessionalInformation from "./UserProfessionalInformation";
import UserSecurityCard from "./UserSecurityCard";
import UserPermissionsSelector from "./UserPermissionsSelector";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: null,
    avatarPreview: null,
    agency: "",
    role: "",
    status: "active",
    password: "",
    passwordConfirm: "",
    permissions: [],
};

export default function CreateUserForm({ onFormChange, initialValues, mode = "create" }) {
    const defaults = { ...emptyForm, ...initialValues };
    const [form, setForm] = useState(defaults);
    const [errors, setErrors] = useState({});
    const initialRef = useRef(defaults);

    const isEdit = mode === "edit";

    useEffect(() => {
        if (onFormChange) {
            onFormChange(form);
        }
    });

    const handleChange = useCallback((key, value) => {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            if (key === "avatar" && value) {
                const url = URL.createObjectURL(value);
                next.avatarPreview = url;
            }
            return next;
        });
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    const handleTogglePerm = useCallback((perm) => {
        setForm((prev) => {
            const has = prev.permissions.includes(perm);
            return {
                ...prev,
                permissions: has
                    ? prev.permissions.filter((p) => p !== perm)
                    : [...prev.permissions, perm],
            };
        });
    }, []);

    const handleToggleAll = useCallback((perms) => {
        setForm((prev) => ({ ...prev, permissions: perms }));
    }, []);

    const validate = () => {
        const e = {};
        if (!form.lastName.trim()) e.lastName = "Le nom est obligatoire.";
        if (!form.firstName.trim()) e.firstName = "Le prénom est obligatoire.";
        if (!form.email.trim()) e.email = "L'email est obligatoire.";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "L'email n'est pas valide.";
        if (!form.agency) e.agency = "Sélectionnez une agence.";
        if (!form.role) e.role = "Sélectionnez un rôle.";
        if (!isEdit) {
            if (!form.password) e.password = "Le mot de passe est obligatoire.";
            else if (form.password.length < 8) e.password = "Minimum 8 caractères.";
            if (form.password !== form.passwordConfirm) e.passwordConfirm = "Les mots de passe ne correspondent pas.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        alert(isEdit ? "Modifications enregistrées (mock) !" : "Utilisateur créé avec succès (mock) !");
    };

    const handleReset = () => {
        setForm(defaults);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
                <UserPersonalInformation form={form} onChange={handleChange} errors={errors} />
                <UserProfessionalInformation form={form} onChange={handleChange} errors={errors} />
                <UserSecurityCard form={form} onChange={handleChange} errors={errors} isEdit={isEdit} />
                <UserPermissionsSelector
                    selected={form.permissions}
                    onToggle={handleTogglePerm}
                    onToggleAll={handleToggleAll}
                />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    className="flex flex-col gap-3 sm:flex-row sm:justify-end"
                >
                    <Button type="button" variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
                        <RotateCcw className="size-4" />
                        Réinitialiser
                    </Button>
                    <Button type="button" variant="outline" onClick={() => history.back()} className="w-full sm:w-auto">
                        <X className="size-4" />
                        Annuler
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                        <Save className="size-4" />
                        {isEdit ? "Enregistrer les modifications" : "Créer l'utilisateur"}
                    </Button>
                </motion.div>
            </div>
        </form>
    );
}
