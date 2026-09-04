import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { LivroType } from "../utils/LivroType";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
    termo: string;
};

type InputPesquisaProps = {
    setLivros: React.Dispatch<React.SetStateAction<LivroType[]>>;
};

export function InputPesquisa({ setLivros }: InputPesquisaProps) {

    const { register, handleSubmit, reset } = useForm<Inputs>();

    async function enviaPesquisa(data: Inputs) {

        if (data.termo.trim().length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres");
            return;
        }

        try {

            const response = await fetch(
                `${apiUrl}/livros/pesquisa/${data.termo}`
            );

            if (!response.ok) {
                throw new Error("Erro ao realizar pesquisa");
            }

            const dados = await response.json();

            setLivros(dados);

        } catch (error) {

            toast.error("Não foi possível realizar a pesquisa");

            console.error(error);
        }
    }

    async function mostraDestaques() {

        try {

            const response = await fetch(`${apiUrl}/livros`);

            if (!response.ok) {
                throw new Error("Erro ao buscar livros");
            }

            const dados = await response.json();

            reset({ termo: "" });

            setLivros(dados);

            // volta para a biblioteca
            document
                .getElementById("biblioteca")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        } catch (error) {

            toast.error("Não foi possível carregar os livros");

            console.error(error);
        }
    }

    function abreOraculo() {

        document
            .getElementById("oraculo")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }

    return (

        <section
            className="
                relative
                min-h-[720px]
                flex
                items-center
                justify-center
                overflow-hidden
                bg-[#0a0014]
            "
            style={{
                backgroundImage: "url('/fundores.png')",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
            }}
        >

            {/* Overlay escuro - escuro à esquerda, transparente à direita para destacar a imagem */}
            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#0a0014]/90
                    via-[#0a0014]/50
                    to-transparent
                "
            />

            {/* Conteúdo */}
            <div
                className="
                    relative
                    z-10
                    w-full
                    max-w-4xl
                    mx-auto
                    px-6
                    py-20
                    text-left
                    md:ml-[5%]
                    lg:ml-[8%]
                "
            >

                {/* Pequeno título */}
                <p
                    className="
                        mb-4
                        text-sm
                        md:text-base
                        uppercase
                        tracking-[0.4em]
                        text-yellow-400
                        font-medium
                    "
                >
                    ✦ Bem-vindo à ✦
                </p>


                {/* Título */}
                <h1
                    className="
                        text-5xl
                        md:text-7xl
                        lg:text-8xl
                        font-serif
                        font-bold
                        tracking-wide
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-b
                        from-yellow-200
                        via-yellow-400
                        to-yellow-700
                        drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]
                    "
                >
                    Libris Arcana
                </h1>


                {/* Frase */}
                <p
                    className="
                        mt-6
                        text-lg
                        md:text-2xl
                        text-[#F5EBDD]
                        font-light
                        tracking-wide
                    "
                >
                    Entre nas páginas de um novo mundo.
                </p>


                {/* Descrição */}
                <p
                    className="
                        max-w-xl
                        mt-4
                        text-sm
                        md:text-base
                        text-purple-100/70
                        leading-relaxed
                    "
                >
                    Descubra histórias, universos fantásticos e personagens
                    que esperam para ganhar vida através das páginas.
                </p>


                {/* Botões */}
                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        justify-start
                        items-start
                        gap-4
                        mt-10
                    "
                >

                    {/* Explorar biblioteca */}
                    <button
                        type="button"
                        onClick={mostraDestaques}
                        className="
                            group
                            min-w-[220px]
                            px-7
                            py-3.5
                            rounded-full
                            bg-gradient-to-r
                            from-yellow-700
                            via-yellow-500
                            to-yellow-300
                            text-[#1A1025]
                            font-semibold
                            tracking-wide
                            shadow-[0_0_25px_rgba(212,175,90,0.25)]
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:shadow-[0_0_35px_rgba(212,175,90,0.45)]
                        "
                    >
                        <span className="mr-2">✦</span>
                        Explorar Biblioteca
                    </button>


                    {/* Oráculo */}
                    <button
                        type="button"
                        onClick={abreOraculo}
                        className="
                            min-w-[220px]
                            px-7
                            py-3.5
                            rounded-full
                            border
                            border-yellow-500/50
                            bg-black/30
                            backdrop-blur-md
                            text-yellow-300
                            font-medium
                            tracking-wide
                            transition-all
                            duration-300
                            hover:bg-yellow-500/10
                            hover:border-yellow-400
                            hover:text-yellow-200
                            hover:scale-105
                        "
                    >
                        <span className="mr-2">🔮</span>
                        O Oráculo
                    </button>

                </div>


                {/* Pesquisa */}
                <form
                    onSubmit={handleSubmit(enviaPesquisa)}
                    className="
                        max-w-2xl
                        mt-14
                    "
                >

                    <div
                        className="
                            relative
                            flex
                            items-center
                            rounded-full
                            border
                            border-yellow-500/30
                            bg-black/50
                            backdrop-blur-xl
                            shadow-[0_0_30px_rgba(0,0,0,0.4)]
                            overflow-hidden
                            transition-all
                            duration-300
                            focus-within:border-yellow-400/70
                            focus-within:shadow-[0_0_25px_rgba(212,175,90,0.15)]
                        "
                    >

                        {/* Ícone */}
                        <div
                            className="
                                pl-5
                                text-yellow-400
                            "
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>


                        <input
                            type="search"
                            id="termo"
                            {...register("termo")}
                            placeholder="Pesquise por título, autor ou categoria..."
                            className="
                                flex-1
                                bg-transparent
                                border-none
                                outline-none
                                px-4
                                py-4
                                text-[#F5EBDD]
                                placeholder:text-purple-200/40
                            "
                        />


                        <button
                            type="submit"
                            className="
                                mr-2
                                px-6
                                py-2.5
                                rounded-full
                                bg-gradient-to-r
                                from-purple-800
                                to-purple-600
                                text-white
                                font-medium
                                transition-all
                                duration-300
                                hover:from-purple-700
                                hover:to-purple-500
                            "
                        >
                            Pesquisar
                        </button>

                    </div>

                </form>

            </div>


            {/* Indicador para continuar */}
            <div
                className="
                    absolute
                    bottom-6
                    left-1/2
                    -translate-x-1/2
                    text-yellow-400/60
                    animate-bounce
                "
            >
                ↓
            </div>

            {/* Degradê suave na parte inferior */}
            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-40
                    bg-gradient-to-b
                    from-transparent
                    to-[#1a0f2e]
                "
            />

        </section>
    );
}