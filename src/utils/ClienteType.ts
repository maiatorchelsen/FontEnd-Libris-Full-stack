export type ClienteType = {
    id: number
    nome: string
    email: string
    token: string
    tel?: string | null
    rua?: string | null
    numero?: string | null
    bairro?: string | null
    cidade?: string | null
    cep?: string | null
    favoritos?: string | null
}