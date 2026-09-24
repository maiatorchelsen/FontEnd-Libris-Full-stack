import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import GraficoPizza, { type DadoGrafico } from "./components/GraficoPizza"

const apiUrl = import.meta.env.VITE_API_URL

type Livro = {
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
}

type ItemPedido = {
    id: number
    quantidade: number
    precoUnitario: number
    livro: { id: number; titulo: string; capa: string | null; preco: number; autor: string }
}

type Pedido = {
    id: number
    dataPedido: string
    status: string
    valorTotal: number
    cliente: { id: number; nome: string; email: string; tel?: string; rua?: string; numero?: string; bairro?: string; cidade?: string; cep?: string }
    admin: { id: number; nome: string }
    itens: ItemPedido[]
}

type Aba = "dashboard" | "pedidos" | "livros"

const STATUS_CORES: Record<string, string> = {
    PENDENTE: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    PROCESSANDO: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    ENVIADO: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    ENTREGUE: "bg-green-500/20 text-green-300 border-green-500/40",
    CANCELADO: "bg-red-500/20 text-red-300 border-red-500/40",
}

const STATUS_OPCOES = ["PENDENTE", "PROCESSANDO", "ENVIADO", "ENTREGUE", "CANCELADO"]

const formVazio = {
    titulo: "", isbn: "", preco: 0, autor: "", editora: "",
    categoria: "", capa: "", descricao: "", anoPublicacao: 0, estoque: 0
}

const ICONE_DASHBOARD = (
    <svg className="w-5 h-5 transition duration-75" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
)

const ICONE_PEDIDOS = (
    <svg className="w-5 h-5 transition duration-75" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18zm3.75-2.25h.008v.008H10.5v-.008zm0 3h.008v.008H10.5v-.008zm3.75-3h.008v.008H14.25v-.008z" />
    </svg>
)

const ICONE_LIVROS = (
    <svg className="w-5 h-5 transition duration-75" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
)

const ICONE_SAIR = (
    <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
)

export default function Admin() {
    const { admin, deslogaAdmin } = useAdminStore()
    const navigate = useNavigate()
    const [aba, setAba] = useState<Aba>("dashboard")
    const [menuAberto, setMenuAberto] = useState(false)
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [livros, setLivros] = useState<Livro[]>([])
    const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null)

    // form novo livro
    const [formLivro, setFormLivro] = useState(formVazio)
    const [editandoLivro, setEditandoLivro] = useState<number | null>(null)

    useEffect(() => {
        if (!admin.id) {
            navigate("/admin/login")
            return
        }
        carregaDados()
    }, [admin, navigate])

    async function carregaDados() {
        if (!admin) return
        try {
            const [resPedidos, resLivros] = await Promise.all([
                fetch(`${apiUrl}/administrador/pedidos`, {
                    headers: { Authorization: `Bearer ${admin.token}` }
                }),
                fetch(`${apiUrl}/livros`)
            ])
            if (resPedidos.ok) setPedidos(await resPedidos.json())
            if (resLivros.ok) setLivros(await resLivros.json())
        } catch (error) {
            console.error("Erro ao carregar dados:", error)
        }
    }

    async function enviarPedido(id: number) {
        if (!admin) return
        const res = await fetch(`${apiUrl}/administrador/pedidos/${id}/enviar`, {
            headers: { Authorization: `Bearer ${admin.token}` },
            method: "PUT"
        })
        if (res.ok) {
            toast.success("Pedido enviado!")
            carregaDados()
        } else {
            const d = await res.json()
            toast.error(d.erro || "Erro ao enviar pedido")
        }
    }

    async function alterarStatus(id: number, status: string) {
        if (!admin) return
        const res = await fetch(`${apiUrl}/administrador/pedidos/${id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${admin.token}` },
            method: "PUT",
            body: JSON.stringify({ status })
        })
        if (!res.ok) {
            const d = await res.json().catch(() => null)
            toast.error(d?.erro || `Erro ao alterar status (${res.status})`)
            return
        }
        toast.success(`Status alterado para ${status}`)
        carregaDados()
    }

    async function excluirPedido(id: number) {
        if (!admin) return
        if (!confirm("Tem certeza que deseja excluir este pedido?")) return
        const res = await fetch(`${apiUrl}/administrador/pedidos/${id}`, {
            headers: { Authorization: `Bearer ${admin.token}` },
            method: "DELETE"
        })
        if (res.ok) {
            toast.success("Pedido excluído!")
            carregaDados()
        } else {
            toast.error("Erro ao excluir pedido")
        }
    }

    async function salvarLivro(e: React.FormEvent) {
        e.preventDefault()
        if (!admin) return
        const body = {
            ...formLivro,
            preco: Number(formLivro.preco),
            anoPublicacao: formLivro.anoPublicacao || null,
            estoque: Number(formLivro.estoque),
            capa: formLivro.capa || null,
            descricao: formLivro.descricao || null,
            isbn: formLivro.isbn || null,
            adminId: admin.id
        }

        const url = editandoLivro ? `${apiUrl}/administrador/livros/${editandoLivro}` : `${apiUrl}/administrador/livros`
        const method = editandoLivro ? "PUT" : "POST"

        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${admin.token}` },
            method,
            body: JSON.stringify(body)
        })

        if (res.ok) {
            toast.success(editandoLivro ? "Livro atualizado!" : "Livro cadastrado!")
            setEditandoLivro(null)
            setFormLivro(formVazio)
            carregaDados()
        } else {
            const d = await res.json()
            const msg = d.erro?.errors?.[0]?.message || d.erro || "Erro ao salvar livro"
            toast.error(String(msg))
        }
    }

    function preencherEdicao(livro: Livro) {
        setEditandoLivro(livro.id)
        setFormLivro({
            titulo: livro.titulo,
            isbn: livro.isbn || "",
            preco: livro.preco,
            autor: livro.autor,
            editora: livro.editora,
            categoria: livro.categoria,
            capa: livro.capa || "",
            descricao: livro.descricao || "",
            anoPublicacao: livro.anoPublicacao || 0,
            estoque: livro.estoque
        })
        setAba("livros")
        setMenuAberto(false)
    }

    async function excluirLivro(id: number) {
        if (!admin) return
        if (!confirm("Tem certeza que deseja excluir este livro?")) return
        const res = await fetch(`${apiUrl}/administrador/livros/${id}`, {
            headers: { Authorization: `Bearer ${admin.token}` },
            method: "DELETE"
        })
        if (res.ok) {
            toast.success("Livro excluído!")
            carregaDados()
        } else {
            toast.error("Erro ao excluir livro")
        }
    }

    function handleLogout() {
        deslogaAdmin()
        navigate("/admin/login")
    }

    const inputClass = "bg-[#0a0014]/60 border border-purple-400/30 text-[#F5EBDD] rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 block w-full p-2.5 placeholder-purple-300/40 transition-all"
    const labelClass = "block mb-1.5 text-xs font-medium text-purple-200/60 uppercase tracking-wider"

    const pedidosPendentes = pedidos.filter(p => p.status === "PENDENTE").length
    const totalVendas = pedidos
        .filter(p => p.status !== "CANCELADO")
        .reduce((soma, p) => soma + Number(p.valorTotal), 0)

    const statusValidos = ["PENDENTE", "PROCESSANDO", "ENVIADO", "ENTREGUE", "CANCELADO"]

    const pedidosPorStatus: DadoGrafico[] = statusValidos
        .map(status => ({
            id: status,
            label: status,
            valor: pedidos.filter(p => p.status === status).length,
        }))
        .filter(d => d.valor > 0)

    const faturamentoPorStatus: DadoGrafico[] = statusValidos
        .map(status => ({
            id: status,
            label: status,
            valor: pedidos
                .filter(p => p.status === status)
                .reduce((soma, p) => soma + Number(p.valorTotal), 0),
        }))
        .filter(d => d.valor > 0)

    const porLivro = pedidos
        .flatMap(p => p.itens)
        .reduce<Record<string, number>>((acc, item) => {
            acc[item.livro.titulo] = (acc[item.livro.titulo] ?? 0) + item.quantidade
            return acc
        }, {})

    const livrosMaisVendidos: DadoGrafico[] = Object.entries(porLivro)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([titulo, valor]) => ({ id: titulo, label: titulo, valor }))

    const porPeriodo = pedidos.reduce<Record<string, { label: string; valor: number }>>((acc, p) => {
        const data = new Date(p.dataPedido)
        const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`
        if (!acc[chave]) {
            acc[chave] = {
                label: data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
                valor: 0,
            }
        }
        acc[chave].valor++
        return acc
    }, {})

    const pedidosPorPeriodo: DadoGrafico[] = Object.entries(porPeriodo)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, dado]) => ({ id: dado.label, label: dado.label, valor: dado.valor }))

    const unidadesVendidas = livrosMaisVendidos.reduce((soma, d) => soma + d.valor, 0)

    const formataMoedaCurta = (valor: number) =>
        `R$ ${valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`

    function alteraAba(novaAba: Aba) {
        setAba(novaAba)
        setMenuAberto(false)
    }

    if (!admin.id) return null

    const itemNavClass = (ativo: boolean) =>
        `w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all border ${
            ativo
                ? "bg-purple-500/25 border-purple-400/50 text-yellow-100 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                : "border-transparent text-purple-200/60 hover:bg-purple-500/10 hover:text-purple-100 hover:border-purple-400/20"
        }`

    const iconeNavClass = (ativo: boolean) =>
        `shrink-0 transition duration-75 ${ativo ? "text-yellow-400" : "text-purple-300/60 group-hover:text-yellow-300/80"}`

    return (
        <section className="bg-[#0a0014] min-h-screen">
            {/* BOTÃO ABRIR (MOBILE) */}
            <button
                type="button"
                aria-label="Abrir menu lateral"
                aria-controls="sidebar-admin"
                onClick={() => setMenuAberto(true)}
                className="sm:hidden text-yellow-400 bg-[#160D24] border border-purple-400/20 rounded-xl p-2 ms-3 mt-3 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:bg-purple-500/10 transition-all"
            >
                <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                </svg>
            </button>

            {/* OVERLAY MOBILE */}
            {menuAberto && (
                <div
                    className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm sm:hidden"
                    onClick={() => setMenuAberto(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                id="sidebar-admin"
                className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 bg-[#160D24] border-r border-purple-400/20 ${
                    menuAberto ? "translate-x-0" : "-translate-x-full"
                } sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full flex flex-col overflow-y-auto px-3 py-4">
                    {/* LOGO + FECHAR */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-2">
                            <img src="/logo1.png" alt="Libris Arcana" className="h-14 w-14 object-contain" />
                            <span className="font-serif font-bold text-yellow-200 text-sm leading-tight">
                                Libris
                                <br />
                                Arcana
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMenuAberto(false)}
                            aria-label="Fechar menu"
                            className="sm:hidden text-yellow-300/70 hover:text-yellow-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* NOME DO ADMIN */}
                    <div className="mb-4 px-2 py-3 rounded-xl border border-purple-400/20 bg-[#1a0f2e]/80">
                        <p className="text-[10px] uppercase tracking-widest text-purple-300/50">Administrador</p>
                        <p className="text-yellow-200 font-semibold text-sm truncate">{admin.nome}</p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mb-4" />

                    {/* NAVEGAÇÃO */}
                    <ul className="space-y-1.5 font-medium flex-1">
                        <li>
                            <button onClick={() => alteraAba("dashboard")} className={`${itemNavClass(aba === "dashboard")} group`}>
                                <span className={iconeNavClass(aba === "dashboard")}>{ICONE_DASHBOARD}</span>
                                <span className="flex-1 ms-3 whitespace-nowrap text-left">Visão Geral</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => alteraAba("pedidos")} className={`${itemNavClass(aba === "pedidos")} group`}>
                                <span className={iconeNavClass(aba === "pedidos")}>{ICONE_PEDIDOS}</span>
                                <span className="flex-1 ms-3 whitespace-nowrap text-left">Pedidos</span>
                                <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {pedidos.length}
                                </span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => alteraAba("livros")} className={`${itemNavClass(aba === "livros")} group`}>
                                <span className={iconeNavClass(aba === "livros")}>{ICONE_LIVROS}</span>
                                <span className="flex-1 ms-3 whitespace-nowrap text-left">Livros</span>
                                <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {livros.length}
                                </span>
                            </button>
                        </li>
                    </ul>

                    {/* RODAPÉ DO SIDEBAR */}
                    <div className="mt-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-3" />
                        <ul className="space-y-1.5 font-medium">
                            <li>
                                <a
                                    href="/"
                                    className="flex items-center px-3 py-2.5 rounded-xl text-sm border border-transparent text-purple-200/50 hover:bg-purple-500/10 hover:text-purple-100 hover:border-purple-400/20 transition-all group"
                                >
                                    <svg className="w-5 h-5 transition duration-75 text-purple-300/60 group-hover:text-yellow-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                                    </svg>
                                    <span className="ms-3">Ver loja</span>
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm border border-red-400/20 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/40 transition-all group"
                                >
                                    <span className="shrink-0 transition duration-75">{ICONE_SAIR}</span>
                                    <span className="flex-1 ms-3 whitespace-nowrap text-left">Sair</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            {/* CONTEÚDO */}
            <div className="p-4 sm:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#F5EBDD]">
                                {aba === "dashboard" ? "Visão Geral" : aba === "pedidos" ? "Pedidos" : "Livros"}
                            </h1>
                            <p className="text-sm text-purple-200/50">Olá, {admin.nome}</p>
                        </div>
                        <span className="hidden sm:flex items-center gap-2 text-xs text-purple-200/40 border border-purple-400/20 rounded-full px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Painel Administrativo
                        </span>
                    </div>

                    {/* ============ VISÃO GERAL ============ */}
                    {aba === "dashboard" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/80 backdrop-blur-sm p-5">
                                    <p className="text-xs uppercase tracking-widest text-purple-300/50 mb-2">Total de Pedidos</p>
                                    <p className="text-3xl font-serif font-bold text-yellow-400">{pedidos.length}</p>
                                </div>
                                <div className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/80 backdrop-blur-sm p-5">
                                    <p className="text-xs uppercase tracking-widest text-purple-300/50 mb-2">Total em Vendas</p>
                                    <p className="text-3xl font-serif font-bold text-yellow-400">
                                        R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/80 backdrop-blur-sm p-5">
                                    <p className="text-xs uppercase tracking-widest text-purple-300/50 mb-2">Livros no Catálogo</p>
                                    <p className="text-3xl font-serif font-bold text-yellow-400">{livros.length}</p>
                                </div>
                                <div className="rounded-2xl border border-yellow-500/30 bg-[#1a0f2e]/80 backdrop-blur-sm p-5">
                                    <p className="text-xs uppercase tracking-widest text-purple-300/50 mb-2">Pedidos Pendentes</p>
                                    <p className="text-3xl font-serif font-bold text-yellow-400">{pedidosPendentes}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/60 backdrop-blur-sm overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-purple-400/20">
                                    <h3 className="text-[#F5EBDD] font-semibold">Pedidos Recentes</h3>
                                    <button
                                        onClick={() => alteraAba("pedidos")}
                                        className="text-xs text-yellow-400/80 hover:text-yellow-300 transition-colors"
                                    >
                                        Ver todos →
                                    </button>
                                </div>
                                {pedidos.length === 0 ? (
                                    <p className="text-purple-200/40 text-center py-10">Nenhum pedido encontrado.</p>
                                ) : (
                                    <ul className="divide-y divide-purple-400/10">
                                        {pedidos.slice(0, 5).map(pedido => (
                                            <li key={pedido.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                                                <div className="min-w-0">
                                                    <p className="text-[#F5EBDD] text-sm font-medium truncate">
                                                        Pedido #{pedido.id} — {pedido.cliente.nome}
                                                    </p>
                                                    <p className="text-purple-200/40 text-xs">
                                                        {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-yellow-400 font-semibold text-sm">
                                                        R$ {Number(pedido.valorTotal).toFixed(2)}
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CORES[pedido.status] || "bg-gray-500/20 text-gray-300 border-gray-500/40"}`}>
                                                        {pedido.status}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* GRÁFICOS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GraficoPizza
                                    titulo="Quantidade de Pedidos por Status"
                                    dados={pedidosPorStatus}
                                    centro="Total de pedidos"
                                    valorCentro={String(pedidos.length)}
                                />
                                <GraficoPizza
                                    titulo="Faturamento por Status"
                                    dados={faturamentoPorStatus}
                                    centro="Faturamento"
                                    valorCentro={formataMoedaCurta(totalVendas)}
                                    formataValor={formataMoedaCurta}
                                />
                                <GraficoPizza
                                    titulo="Livros Mais Vendidos"
                                    dados={livrosMaisVendidos}
                                    centro="Unidades vendidas"
                                    valorCentro={String(unidadesVendidas)}
                                />
                                <GraficoPizza
                                    titulo="Pedidos por Período"
                                    dados={pedidosPorPeriodo}
                                    centro="Total de pedidos"
                                    valorCentro={String(pedidos.length)}
                                />
                            </div>
                        </div>
                    )}

                    {/* ============ PEDIDOS ============ */}
                    {aba === "pedidos" && (
                        <div className="space-y-3">
                            {pedidos.length === 0 && (
                                <p className="text-purple-200/40 text-center py-10">Nenhum pedido encontrado.</p>
                            )}
                            {pedidos.map(pedido => (
                                <div key={pedido.id}
                                     className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/60 backdrop-blur-sm overflow-hidden">
                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[#F5EBDD] font-semibold">Pedido #{pedido.id}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CORES[pedido.status] || "bg-gray-500/20 text-gray-300 border-gray-500/40"}`}>
                                                    {pedido.status}
                                                </span>
                                            </div>
                                            <p className="text-purple-200/50 text-xs">
                                                {pedido.cliente.nome} — {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
                                            </p>
                                            <p className="text-yellow-400 font-semibold text-sm mt-1">
                                                R$ {Number(pedido.valorTotal).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button onClick={() => setPedidoExpandido(pedidoExpandido === pedido.id ? null : pedido.id)}
                                                    className="text-xs px-3 py-1.5 rounded-lg border border-purple-400/20 text-purple-300/70 hover:text-purple-200 hover:border-purple-400/40 transition-all">
                                                {pedidoExpandido === pedido.id ? "Ocultar" : "Detalhes"}
                                            </button>
                                            <select value={pedido.status}
                                                    onChange={(e) => alterarStatus(pedido.id, e.target.value)}
                                                    className="text-xs bg-[#0a0014]/60 border border-purple-400/20 text-purple-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-purple-400">
                                                {STATUS_OPCOES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            {pedido.status !== "ENVIADO" && pedido.status !== "ENTREGUE" && pedido.status !== "CANCELADO" && (
                                                <button onClick={() => enviarPedido(pedido.id)}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition-all">
                                                    Enviar
                                                </button>
                                            )}
                                            <button onClick={() => excluirPedido(pedido.id)}
                                                    className="text-xs px-3 py-1.5 rounded-lg border border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-all">
                                                Excluir
                                            </button>
                                        </div>
                                    </div>

                                    {/* DETALHES EXPANDIDOS */}
                                    {pedidoExpandido === pedido.id && (
                                        <div className="border-t border-purple-400/10 p-4 space-y-4">
                                            <div>
                                                <h4 className="text-xs uppercase tracking-wider text-purple-300/50 mb-1">Endereço de entrega</h4>
                                                <p className="text-purple-200/70 text-sm">
                                                    {pedido.cliente.rua}, {pedido.cliente.numero} — {pedido.cliente.bairro}, {pedido.cliente.cidade} — CEP: {pedido.cliente.cep}
                                                </p>
                                                {pedido.cliente.tel && (
                                                    <p className="text-purple-200/50 text-xs">Tel: {pedido.cliente.tel}</p>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs uppercase tracking-wider text-purple-300/50 mb-2">Itens do pedido</h4>
                                                <div className="space-y-2">
                                                    {pedido.itens.map(item => (
                                                        <div key={item.id} className="flex items-center gap-3 bg-[#0a0014]/40 rounded-xl p-3">
                                                            {item.livro.capa && (
                                                                <img src={item.livro.capa} alt={item.livro.titulo}
                                                                     className="w-10 h-14 object-cover rounded-lg" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[#F5EBDD] text-sm font-medium truncate">{item.livro.titulo}</p>
                                                                <p className="text-purple-200/40 text-xs">Qtd: {item.quantidade} — R$ {Number(item.precoUnitario).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ============ LIVROS ============ */}
                    {aba === "livros" && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/60 backdrop-blur-sm p-5">
                                <h3 className="text-[#F5EBDD] font-semibold mb-4">
                                    {editandoLivro ? "Editar Livro" : "Novo Livro"}
                                </h3>
                                <form onSubmit={salvarLivro} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Título</label>
                                        <input type="text" required value={formLivro.titulo}
                                               onChange={e => setFormLivro({ ...formLivro, titulo: e.target.value })}
                                               className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Autor</label>
                                        <input type="text" required value={formLivro.autor}
                                               onChange={e => setFormLivro({ ...formLivro, autor: e.target.value })}
                                               className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Editora</label>
                                        <input type="text" required value={formLivro.editora}
                                               onChange={e => setFormLivro({ ...formLivro, editora: e.target.value })}
                                               className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Categoria</label>
                                        <input type="text" required value={formLivro.categoria}
                                               onChange={e => setFormLivro({ ...formLivro, categoria: e.target.value })}
                                               className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>ISBN</label>
                                        <input type="text" value={formLivro.isbn}
                                               onChange={e => setFormLivro({ ...formLivro, isbn: e.target.value })}
                                               className={inputClass} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Preço (R$)</label>
                                            <input type="number" step="0.01" required value={formLivro.preco || ""}
                                                   onChange={e => setFormLivro({ ...formLivro, preco: parseFloat(e.target.value) || 0 })}
                                                   className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Estoque</label>
                                            <input type="number" required value={formLivro.estoque || ""}
                                                   onChange={e => setFormLivro({ ...formLivro, estoque: parseInt(e.target.value) || 0 })}
                                                   className={inputClass} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Ano Publicação</label>
                                        <input type="number" value={formLivro.anoPublicacao || ""}
                                               onChange={e => setFormLivro({ ...formLivro, anoPublicacao: parseInt(e.target.value) || 0 })}
                                               className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>URL da Capa</label>
                                        <input type="text" value={formLivro.capa}
                                               onChange={e => setFormLivro({ ...formLivro, capa: e.target.value })}
                                               className={inputClass} />
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className={labelClass}>Descrição</label>
                                        <textarea rows={2} value={formLivro.descricao}
                                                  onChange={e => setFormLivro({ ...formLivro, descricao: e.target.value })}
                                                  className={inputClass + " resize-none"} />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit"
                                                className="text-[#0a0014] bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 hover:from-yellow-300 hover:via-yellow-500 hover:to-yellow-700 font-semibold rounded-xl text-sm px-6 py-2.5 shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40">
                                            {editandoLivro ? "Atualizar" : "Cadastrar"}
                                        </button>
                                        {editandoLivro && (
                                            <button type="button" onClick={() => { setEditandoLivro(null); setFormLivro(formVazio) }}
                                                    className="text-purple-300/60 border border-purple-400/20 rounded-xl text-sm px-4 py-2.5 hover:text-purple-200 hover:border-purple-400/40 transition-all">
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {livros.map(livro => (
                                    <div key={livro.id}
                                         className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/60 backdrop-blur-sm p-4 flex gap-4">
                                        {livro.capa && (
                                            <img src={livro.capa} alt={livro.titulo}
                                                 className="w-20 h-28 object-cover rounded-xl shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <h4 className="text-[#F5EBDD] font-semibold text-sm truncate">{livro.titulo}</h4>
                                            <p className="text-purple-200/40 text-xs truncate">{livro.autor}</p>
                                            <p className="text-yellow-400 text-sm font-semibold mt-auto">R$ {Number(livro.preco).toFixed(2)}</p>
                                            <p className="text-purple-200/30 text-xs">Estoque: {livro.estoque}</p>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => preencherEdicao(livro)}
                                                        className="text-xs px-3 py-1 rounded-lg border border-purple-400/20 text-purple-300/70 hover:text-purple-200 hover:border-purple-400/40 transition-all">
                                                    Editar
                                                </button>
                                                <button onClick={() => excluirLivro(livro.id)}
                                                        className="text-xs px-3 py-1 rounded-lg border border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-all">
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}