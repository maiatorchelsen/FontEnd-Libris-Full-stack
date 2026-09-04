import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"

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

const STATUS_CORES: Record<string, string> = {
    PENDENTE: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    PROCESSANDO: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    ENVIADO: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    ENTREGUE: "bg-green-500/20 text-green-300 border-green-500/40",
    CANCELADO: "bg-red-500/20 text-red-300 border-red-500/40",
}

const STATUS_OPCOES = ["PENDENTE", "PROCESSANDO", "ENVIADO", "ENTREGUE", "CANCELADO"]

export default function Admin() {
    const { admin, deslogaAdmin } = useAdminStore()
    const navigate = useNavigate()
    const [aba, setAba] = useState<"pedidos" | "livros">("pedidos")
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [livros, setLivros] = useState<Livro[]>([])
    const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null)

    // form novo livro
    const [formLivro, setFormLivro] = useState({
        titulo: "", isbn: "", preco: 0, autor: "", editora: "",
        categoria: "", capa: "", descricao: "", anoPublicacao: 0, estoque: 0
    })
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
        const res = await fetch(`${apiUrl}/pedidos/${id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${admin.token}` },
            method: "PUT",
            body: JSON.stringify({ status })
        })
        if (res.ok) {
            toast.success(`Status alterado para ${status}`)
            carregaDados()
        } else {
            const d = await res.json()
            toast.error(d.erro || "Erro ao alterar status")
        }
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
            setFormLivro({ titulo: "", isbn: "", preco: 0, autor: "", editora: "", categoria: "", capa: "", descricao: "", anoPublicacao: 0, estoque: 0 })
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

    if (!admin.id) return null

    return (
        <section className="bg-[#0a0014] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#F5EBDD]">Painel Admin</h1>
                        <p className="text-sm text-purple-200/50">Olá, {admin.nome}</p>
                    </div>
                    <button onClick={handleLogout}
                            className="text-sm text-purple-300/60 hover:text-red-400 transition-colors border border-purple-400/20 rounded-xl px-4 py-2 hover:border-red-400/40">
                        Sair
                    </button>
                </div>

                {/* ABAS */}
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setAba("pedidos")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                aba === "pedidos"
                                    ? "bg-purple-500/30 border border-purple-400/50 text-purple-100"
                                    : "bg-[#1a0f2e]/60 border border-purple-400/10 text-purple-300/50 hover:text-purple-200"
                            }`}>
                        Pedidos ({pedidos.length})
                    </button>
                    <button onClick={() => setAba("livros")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                aba === "livros"
                                    ? "bg-purple-500/30 border border-purple-400/50 text-purple-100"
                                    : "bg-[#1a0f2e]/60 border border-purple-400/10 text-purple-300/50 hover:text-purple-200"
                            }`}>
                        Livros ({livros.length})
                    </button>
                </div>

                {/* ============ ABA PEDIDOS ============ */}
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
                                        {/* Endereço */}
                                        <div>
                                            <h4 className="text-xs uppercase tracking-wider text-purple-300/50 mb-1">Endereço de entrega</h4>
                                            <p className="text-purple-200/70 text-sm">
                                                {pedido.cliente.rua}, {pedido.cliente.numero} — {pedido.cliente.bairro}, {pedido.cliente.cidade} — CEP: {pedido.cliente.cep}
                                            </p>
                                            {pedido.cliente.tel && (
                                                <p className="text-purple-200/50 text-xs">Tel: {pedido.cliente.tel}</p>
                                            )}
                                        </div>
                                        {/* Itens */}
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

                {/* ============ ABA LIVROS ============ */}
                {aba === "livros" && (
                    <div className="space-y-6">
                        {/* FORMULÁRIO */}
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
                                        <button type="button" onClick={() => { setEditandoLivro(null); setFormLivro({ titulo: "", isbn: "", preco: 0, autor: "", editora: "", categoria: "", capa: "", descricao: "", anoPublicacao: 0, estoque: 0 }) }}
                                                className="text-purple-300/60 border border-purple-400/20 rounded-xl text-sm px-4 py-2.5 hover:text-purple-200 hover:border-purple-400/40 transition-all">
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* LISTA */}
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
        </section>
    )
}
