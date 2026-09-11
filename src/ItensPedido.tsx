import type { ItemPedidoType } from "./utils/ItemPedidoType"
import { useEffect, useState, type CSSProperties } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"
import { CapaLivro } from "./components/CapaLivro"

const apiUrl = import.meta.env.VITE_API_URL

const FUNDO_PEDIDOS: CSSProperties = {
    backgroundImage: "url('/gato-car.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
}

const STATUS_ESTILO: Record<string, string> = {
    PENDENTE: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    PROCESSANDO: "text-blue-400 border-blue-500/40 bg-blue-500/10",
    ENVIADO: "text-purple-400 border-purple-500/40 bg-purple-500/10",
    ENTREGUE: "text-green-400 border-green-500/40 bg-green-500/10",
    CANCELADO: "text-red-400 border-red-500/40 bg-red-500/10",
}

function formataMoeda(valor: number | string) {
    return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
}

function formataData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export default function ItensPedido() {
    const { cliente } = useClienteStore()
    const navigate = useNavigate()
    const [itens, setItens] = useState<ItemPedidoType[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function buscaItens() {
            if (!cliente.id) {
                toast.error("Faça login para ver seus pedidos")
                navigate("/login")
                return
            }

            try {
                const response = await fetch(`${apiUrl}/itens-pedido`, {
                    headers: { Authorization: `Bearer ${cliente.token}` },
                })

                if (!response.ok) {
                    const dados = await response.json()
                    toast.error(dados.erro || "Erro ao buscar seus pedidos")
                    return
                }

                const dados = await response.json()
                setItens(dados)
            } catch {
                toast.error("Erro ao conectar com o servidor")
            } finally {
                setCarregando(false)
            }
        }

        buscaItens()
    }, [cliente.id, cliente.token, navigate])

    const pedidos = itens.reduce<
        Record<number, { pedido: ItemPedidoType["pedido"]; itens: ItemPedidoType[] }>
    >((agrupado, item) => {
        const idPedido = item.pedido?.id ?? item.pedidoId
        if (!agrupado[idPedido]) {
            agrupado[idPedido] = { pedido: item.pedido, itens: [] }
        }
        agrupado[idPedido].itens.push(item)
        return agrupado
    }, {})

    const listaPedidos = Object.values(pedidos)

    return (
        <section
            className="relative min-h-screen bg-[#0a0014] py-10 px-4 md:px-8"
            style={FUNDO_PEDIDOS}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0014]/95 via-[#0a0014]/70 to-[#0a0014]/40 pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F5EBDD] mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    Meus Pedidos
                </h1>
                <p className="text-purple-200/50 mb-8">
                    Acompanhe os itens dos seus pedidos, {cliente.nome || "cliente"}.
                </p>

                {carregando ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
                    </div>
                ) : listaPedidos.length === 0 ? (
                    <div className="rounded-2xl border border-purple-400/20 bg-[#160D24]/90 backdrop-blur-md p-10 text-center">
                        <h2 className="text-xl font-serif font-bold text-[#F5EBDD] mb-3">
                            Você ainda não tem pedidos
                        </h2>
                        <p className="text-purple-200/50 mb-8">
                            Explore nossa biblioteca e faça seu primeiro pedido mágico.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-gradient-to-r from-yellow-700/80 via-yellow-600/90 to-yellow-500/80 px-6 py-3 text-sm font-semibold text-[#180D22] shadow-lg shadow-yellow-900/20 transition-all duration-300 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-400 hover:shadow-yellow-500/20"
                        >
                            Explorar Biblioteca
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {listaPedidos.map(({ pedido, itens }) => (
                            <div
                                key={pedido.id}
                                className="rounded-2xl border border-purple-400/20 bg-[#160D24]/90 backdrop-blur-md overflow-hidden"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-purple-400/20">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#F5EBDD] font-semibold">
                                            Pedido #{pedido.id}
                                        </span>
                                        <span className="text-sm text-purple-200/50">
                                            {formataData(pedido.dataPedido)}
                                        </span>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                                            STATUS_ESTILO[pedido.status] ?? "text-purple-200/60 border-purple-400/30 bg-purple-400/10"
                                        }`}
                                    >
                                        {pedido.status}
                                    </span>
                                </div>

                                <ul className="divide-y divide-purple-400/10">
                                    {itens.map(item => (
                                        <li key={item.id} className="flex gap-4 p-4">
                                            <CapaLivro
                                                src={item.livro.capa}
                                                alt={`Capa de ${item.livro.titulo}`}
                                                className="w-16 h-22 object-cover rounded-lg shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <h3 className="text-[#F5EBDD] font-semibold truncate">
                                                    {item.livro.titulo}
                                                </h3>
                                                <p className="text-purple-200/50 text-sm truncate">
                                                    {item.livro.autor}
                                                </p>
                                                <p className="text-purple-200/60 text-sm mt-auto">
                                                    {item.quantidade} × R$ {formataMoeda(item.precoUnitario)}
                                                </p>
                                            </div>
                                            <p className="text-yellow-400 font-bold shrink-0 self-center">
                                                R$ {formataMoeda(Number(item.precoUnitario) * item.quantidade)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-end px-6 py-4 border-t border-purple-400/20 bg-black/30">
                                    <span className="text-[#F5EBDD] font-semibold mr-2">Total:</span>
                                    <span className="text-yellow-400 font-bold">
                                        R$ {formataMoeda(pedido.valorTotal ?? itens.reduce(
                                            (soma, i) => soma + Number(i.precoUnitario) * i.quantidade,
                                            0
                                        ))}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}