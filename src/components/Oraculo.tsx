import { useState } from "react";
import { Link } from "react-router-dom";
import { useClienteStore } from "../context/ClienteContext";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type Recomendacao = {
    id: number;
    titulo: string;
    autor: string;
    categoria: string;
    preco: number;
    capa: string | null;
    avaliacao: string | null;
};

export function Oraculo() {
    const { cliente } = useClienteStore();
    const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
    const [girando, setGirando] = useState(false);
    const [consultou, setConsultou] = useState(false);

    async function consultaOraculo() {
        if (!cliente.id) {
            toast.error("Faça login para consultar o Oráculo");
            return;
        }

        setGirando(true);
        setRecomendacoes([]);
        setConsultou(false);

        try {
            const response = await fetch(
                `${apiUrl}/oraculo/${cliente.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${cliente.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao consultar oráculo");
            }

            const dados = await response.json();

            setRecomendacoes(dados.recomendacoes);
            setConsultou(true);
        } catch (error) {
            console.error(error);
            toast.error("O Oráculo não pôde ser consultado agora");
        } finally {
            setGirando(false);
        }
    }

    return (
        <section
            id="oraculo"
            className="
                relative
                bg-[#1a0f2e]
                py-20
                overflow-hidden
            "
        >
            <div
                className="
                    absolute
                    top-0
                    left-0
                    right-0
                    h-32
                    bg-gradient-to-b
                    from-[#0a0014]
                    to-transparent
                    pointer-events-none
                "
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,90,0.08),transparent_60%)]" />

            <div className="relative z-10 max-w-5xl mx-auto px-6">

                <div className="flex flex-col md:flex-row items-center gap-10">

                    <div className="relative shrink-0">
                        <div
                            className="
                                absolute
                                inset-0
                                -inset-x-10
                                -inset-y-6
                                bg-[radial-gradient(circle,rgba(168,85,247,0.4)_0%,rgba(139,92,246,0.2)_30%,transparent_70%)]
                                blur-xl
                                pointer-events-none
                            "
                        />
                        <img
                            src="/bola2.png"
                            alt="Bola do Oráculo"
                            className="
                                relative
                                w-48
                                h-48
                                md:w-64
                                md:h-64
                                object-contain
                                drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]
                            "
                        />
                    </div>

                    <div className="text-center md:text-left">

                        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-yellow-500">
                            ✦ Consulte o oráculo ✦
                        </p>

                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F5EBDD] mb-4">
                            O Oráculo da Biblioteca
                        </h2>

                        <p className="text-purple-200/60 mb-10 max-w-xl">
                            {cliente.id
                                ? `Olá, ${cliente.nome}! Deixe a IA escolher livros perfeitos para o seu gosto.`
                                : "Faça login para que a IA encontre livros sob medida para você."
                            }
                        </p>

                        <button
                            type="button"
                            onClick={consultaOraculo}
                            disabled={girando}
                            className="
                                group
                                min-w-[240px]
                                px-8
                                py-4
                                rounded-full
                                border
                                border-yellow-500/40
                                bg-gradient-to-r
                                from-yellow-700/80
                                via-yellow-600/90
                                to-yellow-500/80
                                text-[#180D22]
                                font-semibold
                                text-lg
                                shadow-[0_0_30px_rgba(212,175,90,0.2)]
                                transition-all
                                duration-300
                                hover:from-yellow-600
                                hover:via-yellow-500
                                hover:to-yellow-400
                                hover:shadow-[0_0_40px_rgba(212,175,90,0.35)]
                                hover:scale-105
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                disabled:hover:scale-100
                            "
                        >
                            {girando ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="animate-spin text-xl">✦</span>
                                    Consultando...
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-xl">🔮</span>
                                    Consultar o Oráculo
                                </span>
                            )}
                        </button>

                    </div>

                </div>

                {recomendacoes.length > 0 && (
                    <div
                        className="
                            mt-12
                            mx-auto
                            animate-[fadeIn_0.5s_ease-out]
                        "
                    >
                        <p className="text-center text-xs uppercase tracking-[0.2em] text-yellow-500/70 mb-6">
                            ✦ O Oráculo recomenda para você ✦
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {recomendacoes.map(livro => (
                                <div
                                    key={livro.id}
                                    className="
                                        rounded-2xl
                                        border
                                        border-yellow-500/30
                                        bg-[#160D24]/90
                                        backdrop-blur-md
                                        shadow-xl
                                        shadow-black/40
                                        overflow-hidden
                                        transition-all
                                        duration-300
                                        hover:border-yellow-400/50
                                        hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]
                                        hover:scale-[1.02]
                                        flex
                                        flex-col
                                    "
                                >
                                    <img
                                        src={livro.capa ?? ""}
                                        alt={`Capa de ${livro.titulo}`}
                                        className="w-full h-44 object-contain bg-gradient-to-b from-[#241238] to-[#12091B] p-3"
                                    />
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-serif text-base font-semibold text-[#F5EBDD] mb-1 line-clamp-2">
                                            {livro.titulo}
                                        </h3>
                                        <p className="text-sm text-purple-200/70 mb-1">
                                            {livro.autor}
                                        </p>
                                        <p className="text-xs text-purple-300/50 mb-3">
                                            {livro.categoria}
                                        </p>

                                        {livro.avaliacao && (
                                            <div className="
                                                mt-auto
                                                mb-3
                                                p-3
                                                rounded-lg
                                                bg-purple-900/30
                                                border
                                                border-purple-400/20
                                            ">
                                                <p className="text-[10px] uppercase tracking-wider text-yellow-500/70 mb-1">
                                                    Avaliação da web
                                                </p>
                                                <p className="text-xs text-purple-200/70 leading-relaxed">
                                                    {livro.avaliacao}
                                                </p>
                                            </div>
                                        )}

                                        <Link
                                            to={`/detalhes/${livro.id}`}
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                text-sm
                                                font-medium
                                                text-yellow-400
                                                hover:text-yellow-300
                                                transition-colors
                                                mt-auto
                                            "
                                        >
                                            Ver detalhes
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {consultou && recomendacoes.length === 0 && !girando && (
                    <p className="text-center text-purple-200/50 mt-10">
                        O Oráculo não encontrou recomendações no momento. Tente novamente mais tarde.
                    </p>
                )}

            </div>

        </section>
    );
}
