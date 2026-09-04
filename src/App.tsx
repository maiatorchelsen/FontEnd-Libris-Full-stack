import { CardLivro } from "./components/CardLivro";
import { InputPesquisa } from "./components/InputPesquisa";
import { Oraculo } from "./components/Oraculo";
import type { LivroType } from "./utils/LivroType";
import { useEffect, useRef, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {

  const [livros, setLivros] = useState<LivroType[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    async function buscaDados() {

      const response = await fetch(`${apiUrl}/livros`);
      const dados = await response.json();

      setLivros(dados);
    }

    buscaDados();

  }, []);


  const listaLivros = livros.map(livro => (
    <div key={livro.id} className="shrink-0 w-[280px] sm:w-[300px]">
      <CardLivro data={livro} />
    </div>
  ));


  function rolaEsquerda() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  }

  function rolaDireita() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }


  return (
    <>

      {/* HERO + PESQUISA */}
      <InputPesquisa setLivros={setLivros} />


      {/* DIFERENCIAIS */}
      <section className="bg-[#1a0f2e]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-6 backdrop-blur-sm">
              <div className="w-40"><img src="/frete.png" alt="" /></div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">Frete Mágico</h3>
              <p className="text-purple-200/70 text-sm leading-relaxed">Frete grátis nas compras acima de R$ 199</p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-6 backdrop-blur-sm">
              <div className="w-30"><img src="/sapo3.png" alt="Compra Segura" /></div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">Compra Segura</h3>
              <p className="text-purple-200/70 text-sm leading-relaxed">Seus dados protegidos com encantamento</p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-6 backdrop-blur-sm">
              <div className="w-28"><img src="/dog.png" alt="Compra Segura" /></div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">Qualidade Garantida</h3>
              <p className="text-purple-200/70 text-sm leading-relaxed">Livros originais e selecionados a dedo</p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-6 backdrop-blur-sm">
              <div className="w-28"><img src="/gato1.png" alt="Atendimento Encantado" /></div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">Atendimento Encantado</h3>
              <p className="text-purple-200/70 text-sm leading-relaxed">Estamos aqui para tornar sua experiência única</p>
            </div>

          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      </section>


      {/* BIBLIOTECA */}
      <section
        id="biblioteca"
        className="
          relative
          bg-[#0a0014]
          min-h-screen
          py-16
        "
      >

        {/* Degradê suave no topo */}
        <div
          className="
            absolute
            top-0
            left-0
            right-0
            h-32
            bg-gradient-to-b
            from-[#1a0f2e]
            to-transparent
            pointer-events-none
          "
        />

        {/* Título da seção */}
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">

          <p
            className="
              mb-3
              text-sm
              uppercase
              tracking-[0.35em]
              text-yellow-500
            "
          >
            ✦ Nossa coleção ✦
          </p>

          <h2
            className="
              font-serif
              text-4xl
              md:text-5xl
              font-bold
              text-[#F5EBDD]
            "
          >
            Explore nossa biblioteca
          </h2>

          <p
            className="
              mt-4
              text-purple-200/60
            "
          >
            Encontre a próxima história que irá acompanhar você.
          </p>

        </div>


        {/* CARROSSEL */}
        <div className="relative max-w-7xl mx-auto px-6">

          {/* Botão Esquerda */}
          <button
            type="button"
            onClick={rolaEsquerda}
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              z-10
              -ml-4
              w-11
              h-11
              rounded-full
              border
              border-yellow-500/40
              bg-[#160D24]/90
              backdrop-blur-sm
              text-yellow-400
              flex
              items-center
              justify-center
              shadow-lg
              transition-all
              duration-300
              hover:bg-yellow-500/20
              hover:border-yellow-400
              hover:text-yellow-300
              hover:shadow-[0_0_15px_rgba(212,175,90,0.2)]
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Lista de cards */}
          <div
            ref={carouselRef}
            className="
              flex
              gap-6
              overflow-x-auto
              scroll-smooth
              py-4
              px-2
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {listaLivros}
          </div>

          {/* Botão Direita */}
          <button
            type="button"
            onClick={rolaDireita}
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2
              z-10
              -mr-4
              w-11
              h-11
              rounded-full
              border
              border-yellow-500/40
              bg-[#160D24]/90
              backdrop-blur-sm
              text-yellow-400
              flex
              items-center
              justify-center
              shadow-lg
              transition-all
              duration-300
              hover:bg-yellow-500/20
              hover:border-yellow-400
              hover:text-yellow-300
              hover:shadow-[0_0_15px_rgba(212,175,90,0.2)]
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

      </section>


      {/* ORÁCULO */}
      <Oraculo />

      {/* Frase final */}
        <div className="text-center border-t border-purple-400/10 pt-8 p-5">
          <p className="text-purple-200/40 text-xs tracking-widest uppercase">
            ✦ Libris Arcana —  Histórias que encantam ✦
          </p>
          <a href="/admin/login" className="text-purple-200/20 text-[10px] hover:text-purple-200/40 transition-colors mt-2 inline-block">
            Acesso Admin
          </a>
        </div>

    </>
  );
}