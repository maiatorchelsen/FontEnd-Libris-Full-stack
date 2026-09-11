import { Link } from "react-router-dom"
import { toast } from "sonner"
import type { LivroType } from "../utils/LivroType"
import { useCarrinhoStore } from "../context/CarrinhoContext"
import { CapaLivro } from "./CapaLivro"

export function CardLivro({ data }: { data: LivroType }) {
    const { adicionarItem } = useCarrinhoStore()
    return (
        <div
            className="
                group
                relative
                w-full
                max-w-sm
                overflow-hidden
                rounded-2xl
                border
                border-yellow-500/20
                bg-[#160D24]/90
                backdrop-blur-md
                shadow-xl
                shadow-black/40
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-yellow-400/50
                hover:shadow-[0_15px_45px_rgba(212,175,90,0.18)]
            "
        >

            {/* Brilho no hover */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-yellow-400/0
                    via-yellow-400/0
                    to-purple-500/10
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />

            {/* CAPA */}
            <div
                className="
                    relative
                    flex
                    h-72
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gradient-to-b
                    from-[#241238]
                    to-[#12091B]
                "
            >

                <CapaLivro
                    src={data.capa}
                    alt={`Capa de ${data.titulo}`}
                    className="
                        h-full
                        w-full
                        object-contain
                        p-6
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                {/* Pequeno efeito sobre a capa */}
                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-20
                        bg-gradient-to-t
                        from-[#160D24]
                        to-transparent
                    "
                />

            </div>


            {/* INFORMAÇÕES */}
            <div className="relative p-6">

                {/* Categoria / detalhe decorativo */}
                <div className="mb-3 flex items-center gap-2">
                    <span className="text-yellow-500 text-xs">
                        ✦
                    </span>

                    <span
                        className="
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-yellow-500/70
                        "
                    >
                        Livro
                    </span>
                </div>


                {/* TÍTULO */}
                <h5
                    className="
                        mb-2
                        line-clamp-2
                        min-h-[56px]
                        font-serif
                        text-xl
                        font-semibold
                        leading-tight
                        text-[#F5EBDD]
                        transition-colors
                        duration-300
                        group-hover:text-yellow-300
                    "
                >
                    {data.titulo}
                </h5>


                {/* AUTOR */}
                <p
                    className="
                        mb-4
                        text-sm
                        font-medium
                        text-purple-200/80
                    "
                >
                    {data.autor}
                </p>


                {/* AVALIAÇÃO */}
                <div className="mb-4 flex items-center gap-2">

                    <div className="flex gap-0.5 text-yellow-400">
                        ★★★★★
                    </div>

                    <span className="text-xs text-purple-200/50">
                        Avaliações
                    </span>

                </div>


                {/* DIVISOR */}
                <div className="mb-4 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />


                {/* PREÇO */}
                <div className="mb-5">

                    <p
                        className="
                            mb-1
                            text-xs
                            uppercase
                            tracking-wider
                            text-purple-200/50
                        "
                    >
                        Por apenas
                    </p>

                    <p
                        className="
                            font-serif
                            text-2xl
                            font-bold
                            text-yellow-400
                        "
                    >
                        R$ {Number(data.preco).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                        })}
                    </p>

                </div>


                {/* EDITORA / ANO */}
                <p
                    className="
                        mb-5
                        text-xs
                        text-purple-200/50
                    "
                >
                    {data.editora}{" "}
                    {data.anoPublicacao && (
                        <>• {data.anoPublicacao}</>
                    )}
                </p>


                {/* BOTÕES */}
                <div className="flex flex-col gap-3">
                    <Link
                        to={`/detalhes/${data.id}`}
                        className="
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            border
                            border-yellow-500/40
                            bg-gradient-to-r
                            from-yellow-700/80
                            via-yellow-600/90
                            to-yellow-500/80
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-[#180D22]
                            shadow-lg
                            shadow-yellow-900/20
                            transition-all
                            duration-300
                            hover:border-yellow-300
                            hover:from-yellow-600
                            hover:via-yellow-500
                            hover:to-yellow-400
                            hover:shadow-yellow-500/20
                        "
                    >
                        Ver detalhes

                        <svg
                            className="
                                h-4
                                w-4
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>

                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            adicionarItem(data)
                            toast.success(`"${data.titulo}" adicionado ao carrinho!`)
                        }}
                        className="
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            border
                            border-purple-500/40
                            bg-purple-900/60
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-purple-100
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            hover:border-purple-400
                            hover:bg-purple-800/80
                            hover:text-white
                            hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]
                        "
                    >
                        <svg
                            className="h-4 w-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                        </svg>
                        Adicionar ao carrinho
                    </button>
                </div>

            </div>

        </div>
    )
}