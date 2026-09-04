import type { AdminType } from '../utils/AdminType'
import { create } from 'zustand'

export type AdminLogado = AdminType & {
    token: string
}

type AdminStore = {
    admin: AdminLogado
    logaAdmin: (adminLogado: AdminLogado) => void
    deslogaAdmin: () => void
}

export const useAdminStore = create<AdminStore>((set) => ({
    admin: {} as AdminLogado,
    logaAdmin: (adminLogado) => set({ admin: adminLogado }),
    deslogaAdmin: () => set({ admin: {} as AdminLogado })
}))