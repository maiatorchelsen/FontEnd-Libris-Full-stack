import { useState, type CSSProperties } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCarrinhoStore } from "./context/CarrinhoContext"
import { useClienteStore } from "./context/ClienteContext"
import { CapaLivro } from "./components/CapaLivro"

const apiUrl = import.meta.env.VITE_API_URL

const FRETE_GRATIS_LIMITE = 199

const FUNDO_CARRINHO: CSSProperties = {
    backgroundImage: "url('/gato-car.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
}

export default function Carrinho() {
    const navigate = useNavigate()
    const { cliente } = useClienteStore()
    const {
        itens,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        totalCarrinho,
        qtdItens,
    } = useCarrinhoStore()
    const [finalizando, setFinalizando] = useState(false)

    const frete = totalCarrinho >= FRETE_GRATIS_LIMITE ? 0 : 19.90
    const total = totalCarrinho + frete

    async function finalizarPedido() {
        if (!cliente.id) {
            toast.error("Faça login para finalizar o pedido")
            navigate("/login")
            return
        }

        if (itens.length === 0) return

        setFinalizando(true)

        try {
            const adminId = itens[0].livro.adminId

            const res = await fetch(`${apiUrl}/pedidos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cliente.token}`,
                },
                body: JSON.stringify({
                    clienteId: cliente.id,
                    adminId,
                    itens: itens.map(item => ({
                        livroId: item.livro.id,
                        quantidade: item.quantidade,
                    })),
                }),
            })

            if (res.ok) {
                limparCarrinho()
                toast.success("Pedido realizado com sucesso!")
                navigate("/")
            } else {
                const dados = await res.json()
                toast.error(dados.erro || "Erro ao realizar pedido")
            }
        } catch {
            toast.error("Erro ao conectar com o servidor")
        } finally {
            setFinalizando(false)
        }
    }

    if (itens.length === 0) {
        return (
            <section
                className="relative min-h-screen bg-[#0a0014] flex items-center px-4 md:px-8 py-10"
                style={FUNDO_CARRINHO}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0014]/95 via-[#0a0014]/60 to-[#0a0014]/20 pointer-events-none" />
                <div className="relative z-10 max-w-xl text-left">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F5EBDD] mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        Seu carrinho está vazio
                    </h2>
                    <p className="text-purple-200/50 mb-8">
                        Explore nossa biblioteca e encontre seu próximo livro.
                    </p>
                    <Link
                        to="/"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-yellow-500/40
                            bg-gradient-to-r
                            from-yellow-700/80
                            via-yellow-600/90
                            to-yellow-500/80
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-[#180D22]
                            shadow-lg
                            shadow-yellow-900/20
                            transition-all
                            duration-300
                            hover:from-yellow-600
                            hover:via-yellow-500
                            hover:to-yellow-400
                            hover:shadow-yellow-500/20
                        "
                    >
                        Explorar Biblioteca
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section
            className="relative min-h-screen bg-[#0a0014] py-10 px-4"
            style={FUNDO_CARRINHO}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0014]/95 via-[#0a0014]/70 to-[#0a0014]/40 pointer-events-none" />
            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F5EBDD] mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    Carrinho de Compras
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de itens */}
                    <div className="lg:col-span-2 space-y-4">
                        {itens.map(item => (
                            <div
                                key={item.livro.id}
                                className="
                                    flex
                                    gap-4
                                    p-4
                                    rounded-2xl
                                    border
                                    border-purple-400/20
                                    bg-[#160D24]/90
                                    backdrop-blur-md
                                "
                            >
                                {/* Capa */}
                                <CapaLivro
                                    src={item.livro.capa}
                                    alt={`Capa de ${item.livro.titulo}`}
                                    className="w-20 h-28 object-cover rounded-xl shrink-0"
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <h3 className="text-[#F5EBDD] font-semibold truncate">
                                        {item.livro.titulo}
                                    </h3>
                                    <p className="text-purple-200/50 text-sm truncate">
                                        {item.livro.autor}
                                    </p>
                                    <p className="text-yellow-400 font-bold mt-auto">
                                        R$ {Number(item.livro.preco).toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>

                                {/* Controles */}
                                <div className="flex flex-col items-end justify-between shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => removerItem(item.livro.id)}
                                        className="text-purple-300/40 hover:text-red-400 transition-colors"
                                        title="Remover item"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => atualizarQuantidade(item.livro.id, item.quantidade - 1)}
                                            className="
                                                w-8
                                                h-8
                                                flex
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-purple-400/30
                                                text-purple-200/70
                                                hover:border-purple-400/60
                                                hover:text-purple-100
                                                transition-all
                                            "
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-[#F5EBDD] font-semibold">
                                            {item.quantidade}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => atualizarQuantidade(item.livro.id, item.quantidade + 1)}
                                            className="
                                                w-8
                                                h-8
                                                flex
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-purple-400/30
                                                text-purple-200/70
                                                hover:border-purple-400/60
                                                hover:text-purple-100
                                                transition-all
                                            "
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumo */}
                    <div className="lg:col-span-1">
                        <div
                            className="
                                p-6
                                rounded-2xl
                                border
                                border-yellow-500/20
                                bg-[#160D24]/90
                                backdrop-blur-md
                                sticky
                                top-44
                            "
                        >
                            <h2 className="text-lg font-serif font-bold text-[#F5EBDD] mb-6">
                                Resumo do Pedido
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-200/60">
                                        Subtotal ({qtdItens} {qtdItens === 1 ? "item" : "itens"})
                                    </span>
                                    <span className="text-[#F5EBDD]">
                                        R$ {totalCarrinho.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-200/60">Frete</span>
                                    <span className={frete === 0 ? "text-green-400 font-semibold" : "text-[#F5EBDD]"}>
                                        {frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2)}`}
                                    </span>
                                </div>
                                {frete > 0 && (
                                    <p className="text-xs text-purple-200/40">
                                        Frete grátis acima de R$ {FRETE_GRATIS_LIMITE.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mb-6" />

                            <div className="flex justify-between mb-8">
                                <span className="text-[#F5EBDD] font-semibold">Total</span>
                                <span className="text-xl font-serif font-bold text-yellow-400">
                                    R$ {total.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={finalizarPedido}
                                disabled={finalizando}
                                className="
                                    w-full
                                    py-3
                                    rounded-full
                                    border
                                    border-yellow-500/40
                                    bg-gradient-to-r
                                    from-yellow-700/80
                                    via-yellow-600/90
                                    to-yellow-500/80
                                    text-[#180D22]
                                    font-semibold
                                    text-sm
                                    shadow-lg
                                    shadow-yellow-900/20
                                    transition-all
                                    duration-300
                                    hover:from-yellow-600
                                    hover:via-yellow-500
                                    hover:to-yellow-400
                                    hover:shadow-yellow-500/20
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                {finalizando ? "Finalizando..." : "Finalizar Pedido"}
                            </button>

                            {!cliente.id && (
                                <p className="text-xs text-purple-200/40 text-center mt-3">
                                    Faça login para finalizar a compra
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
