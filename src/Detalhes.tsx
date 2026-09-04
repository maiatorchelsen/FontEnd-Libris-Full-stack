import type { LivroType } from "./utils/LivroType"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useCarrinhoStore } from "./context/CarrinhoContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function Detalhes() {
  const params = useParams()
  const navigate = useNavigate()
  const { adicionarItem } = useCarrinhoStore()

  const [livro, setLivro] = useState<LivroType>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/livros/${params.livroId}`)
      const dados = await response.json()
      setLivro(dados)
    }
    buscaDados()
  }, [])

  return (
    <section className="relative min-h-screen py-10">
      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-purple-200/70 hover:text-yellow-400 transition-colors duration-300 group"
      >
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Voltar</span>
      </button>

      {/* Card do livro */}
      <div className="relative max-w-5xl mx-auto">
        {/* Brilho de fundo */}
        <div className="absolute inset-0 -inset-x-10 -inset-y-10 bg-[radial-gradient(ellipse,rgba(212,175,90,0.35)_0%,rgba(180,140,50,0.15)_45%,transparent_70%)] blur-xl pointer-events-none" />
        <section className="relative flex mt-12 mx-auto flex-col items-center bg-black/70 border border-yellow-700/30 rounded-lg shadow-lg shadow-yellow-900/20 backdrop-blur md:flex-row md:max-w-5xl">
        <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
          src={livro?.capa ?? ""} alt={`Capa de ${livro?.titulo}`} />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-yellow-100">
            {livro?.titulo}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-yellow-200">
            {livro?.autor} - {livro?.editora} - {livro?.anoPublicacao ?? "—"}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-yellow-500">
            Preço R$: {Number(livro?.preco)
              .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </h5>
          <h5 className="mb-3 text-xl tracking-tight text-yellow-200">
            Estoque: {livro?.estoque} unidades
          </h5>

          {/* Botão Carrinho */}
          <button
            onClick={() => {
              if (livro) {
                adicionarItem(livro)
                toast.success(`"${livro.titulo}" adicionado ao carrinho!`)
              }
            }}
            className="
              group
              w-80
              px-6
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
              text-base
              shadow-[0_0_20px_rgba(212,175,90,0.2)]
              transition-all
              duration-300
              hover:from-yellow-600
              hover:via-yellow-500
              hover:to-yellow-400
              hover:shadow-[0_0_30px_rgba(212,175,90,0.35)]
              hover:scale-105
              active:scale-95
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Adicionar ao Carrinho
          </button>

          <p className="mt-4 font-normal text-yellow-200/80">
            {livro?.descricao}
          </p>
        </div>
      </section>
      </div>

      {/* Seção extra abaixo do card */}
      <div className="max-w-5xl mx-auto mt-10 px-6">

        {/* Frase divertida */}
        <div className="text-center mb-10">
          <p className="text-purple-200/50 text-sm italic">
            ✦ "Um livro não é apenas papel e tinta, é um portal para outra dimensão." ✦
          </p>
        </div>

        {/* Dados extras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-purple-400/20 bg-purple-900/20 p-6 backdrop-blur-sm">
            <span className="w-22"><img src="/kind.png" alt="Entrega mágica" /></span>
            <h4 className="text-yellow-400 font-semibold">Formatos disponíveis</h4>
            <p className="text-purple-200/60 text-sm">Físico & Digital</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-purple-400/20 bg-purple-900/20 p-6 backdrop-blur-sm">
            <span className="w-30"><img src="/frete.png" alt="Entrega mágica" /></span>
            <h4 className="text-yellow-400 font-semibold">Entrega mágica</h4>
            <p className="text-purple-200/60 text-sm">Frete grátis acima de R$ 199</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-purple-400/20 bg-purple-900/20 p-6 backdrop-blur-sm">
            <span className="w-22"><img src="/mao1.png" alt="Entrega mágica" /></span>
            <h4 className="text-yellow-400 font-semibold">Troca mítica </h4>
            <p className="text-purple-200/60 text-sm">Até 7 dias</p>
          </div>
        </div>

        {/* Frase final */}
        <div className="text-center border-t border-purple-400/10 pt-8">
          <p className="text-purple-200/40 text-xs tracking-widest uppercase">
            ✦ Libris Arcana —  Histórias que encantam ✦
          </p>
        </div>

      </div>
    </section>
  )
}
