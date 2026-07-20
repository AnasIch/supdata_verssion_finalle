import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, X } from "lucide-react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/UI/Button";
import UserPersonalInformation from "./UserPersonalInformation";
import UserProfessionalInformation from "./UserProfessionalInformation";
import { getDashboardBaseFromUrl } from "@/lib/utils";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agency: "",
    role: "",
    status: "active",
};

export default function CreateUserForm({ onFormChange, initialValues, mode = "create", roles = [], agencies = [] }) {
    const defaults = { ...emptyForm, ...initialValues };
    const [form, setForm] = useState(defaults);
    const [errors, setErrors] = useState({});
    const initialRef = useRef(defaults);

    const isEdit = mode === "edit";

    const base = getDashboardBaseFromUrl(window.location.pathname);

    useEffect(() => {
        if (onFormChange) {
            onFormChange(form);
        }
    });

    const handleChange = useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    const validate = () => {
        const e = {};
        if (!form.lastName.trim()) e.lastName = "Le nom est obligatoire.";
        if (!form.firstName.trim()) e.firstName = "Le prénom est obligatoire.";
        if (!form.email.trim()) e.email = "L'email est obligatoire.";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "L'email n'est pas valide.";
        if (!form.agency) e.agency = "Sélectionnez une agence.";
        if (!form.role) e.role = "Sélectionnez un rôle.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const selectedRole = roles.find((r) => r.name === form.role);
        const selectedAgency = agencies.find((a) => a.city === form.agency);

        const payload = {
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phone: form.phone || null,
            role_id: selectedRole?.id,
            agency_id: selectedAgency?.id,
            status: form.status,
        };

        if (isEdit) {
            const userId = initialValues?.id;
            router.put(`${base}/utilisateurs/${userId}`, payload, {
                onError: (err) => setErrors(err),
            });
        } else {
            router.post(`${base}/utilisateurs`, payload, {
                onError: (err) => setErrors(err),
            });
        }
    };

    const handleReset = () => {
        setForm(defaults);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
                <UserPersonalInformation form={form} onChange={handleChange} errors={errors} />
                <UserProfessionalInformation form={form} onChange={handleChange} errors={errors} roles={roles} agencies={agencies} />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
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