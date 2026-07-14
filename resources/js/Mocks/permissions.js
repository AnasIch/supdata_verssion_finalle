function allChecked(permissions) {
    const result = {};
    for (const p of permissions) {
        result[p.key] = true;
    }
    return result;
}

function noneChecked(permissions) {
    const result = {};
    for (const p of permissions) {
        result[p.key] = false;
    }
    return result;
}

function partial(keys, permissions) {
    const result = {};
    for (const p of permissions) {
        result[p.key] = keys.includes(p.key);
    }
    return result;
}

const dashPerms = [{ key: "voir" }, { key: "consulter" }];
const fullCrud = [{ key: "voir" }, { key: "creer" }, { key: "modifier" }, { key: "supprimer" }];
const crudGerer = [...fullCrud, { key: "gerer" }];
const permModule = [{ key: "voir" }, { key: "modifier" }, { key: "gerer" }];
const produitsPerms = [...fullCrud, { key: "exporter" }];
const stockPerms = [{ key: "voir" }, { key: "modifier" }, { key: "inventaire" }, { key: "imprimer" }];
const dapPerms = [...fullCrud, { key: "valider" }];
const rapportsPerms = [{ key: "voir" }, { key: "exporter" }, { key: "imprimer" }];
const auditPerms = [{ key: "voir" }, { key: "exporter" }];

export const initialPermissions = {
    1: {
        tableau_de_bord: allChecked(dashPerms),
        utilisateurs: allChecked(fullCrud),
        roles: allChecked(crudGerer),
        permissions: allChecked(permModule),
        agences: allChecked(fullCrud),
        produits: allChecked(produitsPerms),
        categories: allChecked(fullCrud),
        clients: allChecked(fullCrud),
        stock: allChecked(stockPerms),
        demandes_achat: allChecked(dapPerms),
        rapports: allChecked(rapportsPerms),
        audit_logs: allChecked(auditPerms),
        parametres: allChecked(permModule),
    },
    2: {
        tableau_de_bord: allChecked(dashPerms),
        utilisateurs: allChecked(fullCrud),
        roles: partial(["voir", "creer", "modifier"], crudGerer),
        permissions: partial(["voir", "modifier"], permModule),
        agences: allChecked(fullCrud),
        produits: allChecked(produitsPerms),
        categories: allChecked(fullCrud),
        clients: allChecked(fullCrud),
        stock: allChecked(stockPerms),
        demandes_achat: allChecked(dapPerms),
        rapports: allChecked(rapportsPerms),
        audit_logs: allChecked(auditPerms),
        parametres: partial(["voir"], permModule),
    },
    3: {
        tableau_de_bord: allChecked(dashPerms),
        utilisateurs: partial(["voir", "creer", "modifier"], fullCrud),
        roles: partial(["voir"], crudGerer),
        permissions: partial(["voir"], permModule),
        agences: partial(["voir"], fullCrud),
        produits: partial(["voir", "creer", "modifier"], produitsPerms),
        categories: partial(["voir", "creer", "modifier"], fullCrud),
        clients: partial(["voir", "creer", "modifier"], fullCrud),
        stock: partial(["voir"], stockPerms),
        demandes_achat: partial(["voir", "creer", "modifier"], dapPerms),
        rapports: partial(["voir", "exporter"], rapportsPerms),
        audit_logs: partial(["voir"], auditPerms),
        parametres: partial(["voir"], permModule),
    },
    4: {
        tableau_de_bord: allChecked(dashPerms),
        utilisateurs: partial(["voir"], fullCrud),
        roles: noneChecked(crudGerer),
        permissions: noneChecked(permModule),
        agences: partial(["voir"], fullCrud),
        produits: partial(["voir", "creer", "modifier"], produitsPerms),
        categories: partial(["voir"], fullCrud),
        clients: allChecked(fullCrud),
        stock: partial(["voir"], stockPerms),
        demandes_achat: partial(["voir", "creer", "modifier", "valider"], dapPerms),
        rapports: allChecked(rapportsPerms),
        audit_logs: partial(["voir"], auditPerms),
        parametres: noneChecked(permModule),
    },
    5: {
        tableau_de_bord: partial(["voir"], dashPerms),
        utilisateurs: partial(["voir"], fullCrud),
        roles: noneChecked(crudGerer),
        permissions: noneChecked(permModule),
        agences: partial(["voir"], fullCrud),
        produits: partial(["voir"], produitsPerms),
        categories: partial(["voir"], fullCrud),
        clients: partial(["voir"], fullCrud),
        stock: allChecked(stockPerms),
        demandes_achat: partial(["voir"], dapPerms),
        rapports: partial(["voir"], rapportsPerms),
        audit_logs: partial(["voir"], auditPerms),
        parametres: noneChecked(permModule),
    },
};
