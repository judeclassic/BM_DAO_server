import AdminInterface from "../../../response/admin.response";


interface AdminModelInterface{

    saveAdminToDB: (details: AdminInterface) => Promise<{status: boolean, error?: string | unknown, data?: AdminInterface }>;

    updateAdminDetailToDB: (id : string, details : Partial<AdminInterface>) => Promise<{status: boolean, error?: string | unknown, data?: AdminInterface }>;

    checkIfExist: (details : Partial<AdminInterface>) => Promise<{status: boolean, error?: string | unknown, data?: AdminInterface }>;

    deleteAdminFromDb: (details : Partial<AdminInterface>) => Promise<{status: boolean, error?: string | unknown, data?: AdminInterface }>;
}

export default AdminModelInterface;