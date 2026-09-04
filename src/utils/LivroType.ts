import type { AdminType } from "./AdminType"

export type LivroType = {
    id: number
    titulo: string
    isbn: string | null
    descricao: string | null
    preco: number
    estoque: number
    capa: string | null
    anoPublicacao: number | null
    autor: string
    editora: string
    categoria: string
    adminId: number
    admin: AdminType
}
