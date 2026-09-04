import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState } from "react"

type Inputs = {
    nome: string
    email: string
    tel: string
    senha: string
    confirmaSenha: string
    rua: string
    numero: string
    bairro: string
    cidade: string
    cep: string
}

const generos = [
    "Fantasia",
    "Romance",
    "Terror",
    "Ficção Científica",
    "Aventura",
    "Mistério",
    "Suspense",
    "Drama",
    "Comédia",
    "Histórico",
    "Biografia",
    "Autoajuda",
    "Programação",
    "Desenvolvimento Pessoal",
    "Negócios",
    "Finanças",
    "Saúde e Bem-estar",
    "Culinária",
    "Viagem",
    "Arte e Design",
    
]

const inputClass = "bg-[#0a0014]/60 border border-purple-400/30 text-[#F5EBDD] rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 block w-full p-2.5 placeholder-purple-300/40 transition-all"
const labelClass = "block mb-2 text-sm font-medium text-[#F5EBDD]"
const rowClass = "grid grid-cols-2 gap-4"

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
    const { register, handleSubmit, watch } = useForm<Inputs>()
    const navigate = useNavigate()
    const [favoritos, setFavoritos] = useState<string[]>([])
    const [mostraSenha, setMostraSenha] = useState(false)
    const [mostraConfirma, setMostraConfirma] = useState(false)

    const senha = watch("senha")

    function toggleGenero(genero: string) {
        setFavoritos(prev =>
            prev.includes(genero) ? prev.filter(g => g !== genero) : [...prev, genero]
        )
    }

    async function cadastraCliente(data: Inputs) {
        if (data.senha !== data.confirmaSenha) {
            toast.error("As senhas não conferem!")
            return
        }

        const body = {
            nome: data.nome,
            email: data.email,
            senha: data.senha,
            tel: data.tel || null,
            rua: data.rua || null,
            numero: data.numero || null,
            bairro: data.bairro || null,
            cidade: data.cidade || null,
            cep: data.cep || null,
            favoritos: favoritos.length > 0 ? favoritos.join(", ") : null,
        }

        const response = await fetch(`${apiUrl}/clientes`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(body)
        })

        const dados = await response.json()

        if (response.status === 201 || response.status === 200) {
            toast.success("Cadastro realizado com sucesso!")
            navigate("/login")
        } else {
            const mensagem = dados.erro?.errors?.[0]?.message || dados.erro || dados.error || "Erro ao cadastrar"
            toast.error(String(mensagem))
        }
    }

    return (
        <section className="bg-cosmic min-h-screen">
            <p style={{ height: 48 }}></p>
            <div className="flex flex-col items-center px-6 py-8 mx-auto lg:py-0 pb-12">
                <div className="w-full max-w-lg rounded-2xl border border-purple-400/30 bg-[#1a0f2e]/80 backdrop-blur-md shadow-xl xl:p-0">
                    <div className="p-8 space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-[#F5EBDD] md:text-2xl text-center">
                            Criar Conta
                        </h1>
                        <form className="space-y-5" onSubmit={handleSubmit(cadastraCliente)}>

                            {/* DADOS PESSOAIS */}
                            <div>
                                <h2 className="text-xs uppercase tracking-[0.25em] text-purple-300/60 mb-3">Dados Pessoais</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="nome" className={labelClass}>Nome completo</label>
                                        <input type="text" id="nome" placeholder="Seu nome" className={inputClass} required
                                               {...register("nome")} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={labelClass}>E-mail</label>
                                        <input type="email" id="email" placeholder="seu@email.com" className={inputClass} required
                                               {...register("email")} />
                                    </div>
                                    <div>
                                        <label htmlFor="tel" className={labelClass}>Telefone</label>
                                        <input type="tel" id="tel" placeholder="(11) 99999-9999" className={inputClass}
                                               {...register("tel")} />
                                    </div>
                                    <div className={rowClass}>
                                        <div>
                                            <label htmlFor="senha" className={labelClass}>Senha</label>
                                            <div className="relative">
                                                <input type={mostraSenha ? "text" : "password"} id="senha" placeholder="••••••••"
                                                       className={inputClass + " pr-10"} required
                                                       {...register("senha")} />
                                                <button type="button" onClick={() => setMostraSenha(!mostraSenha)}
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-purple-200 transition-colors"
                                                        tabIndex={-1}>
                                                    {mostraSenha ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="confirmaSenha" className={labelClass}>Confirmar senha</label>
                                            <div className="relative">
                                                <input type={mostraConfirma ? "text" : "password"} id="confirmaSenha" placeholder="••••••••"
                                                       className={inputClass + " pr-10"} required
                                                       {...register("confirmaSenha", {
                                                           validate: value => value === senha || "As senhas não conferem"
                                                       })} />
                                                <button type="button" onClick={() => setMostraConfirma(!mostraConfirma)}
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-purple-200 transition-colors"
                                                        tabIndex={-1}>
                                                    {mostraConfirma ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

                            {/* ENDEREÇO */}
                            <div>
                                <h2 className="text-xs uppercase tracking-[0.25em] text-purple-300/60 mb-3">Endereço de Entrega</h2>
                                <div className="space-y-4">
                                    <div className={rowClass}>
                                        <div className="col-span-2">
                                            <label htmlFor="rua" className={labelClass}>Rua / Logradouro</label>
                                            <input type="text" id="rua" placeholder="Rua das Flores" className={inputClass}
                                                   {...register("rua")} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="numero" className={labelClass}>Número</label>
                                            <input type="text" id="numero" placeholder="123" className={inputClass}
                                                   {...register("numero")} />
                                        </div>
                                        <div className="col-span-2">
                                            <label htmlFor="bairro" className={labelClass}>Bairro</label>
                                            <input type="text" id="bairro" placeholder="Centro" className={inputClass}
                                                   {...register("bairro")} />
                                        </div>
                                    </div>
                                    <div className={rowClass}>
                                        <div>
                                            <label htmlFor="cidade" className={labelClass}>Cidade</label>
                                            <input type="text" id="cidade" placeholder="São Paulo" className={inputClass}
                                                   {...register("cidade")} />
                                        </div>
                                        <div>
                                            <label htmlFor="cep" className={labelClass}>CEP</label>
                                            <input type="text" id="cep" placeholder="00000-000" className={inputClass}
                                                   {...register("cep")} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

                            {/* GÊNEROS FAVORITOS */}
                            <div>
                                <h2 className="text-xs uppercase tracking-[0.25em] text-purple-300/60 mb-3">Gêneros Favoritos</h2>
                                <p className="text-purple-200/40 text-xs mb-3">Selecione seus gêneros de leitura preferidos</p>
                                <div className="flex flex-wrap gap-2">
                                    {generos.map(genero => (
                                        <button type="button" key={genero} onClick={() => toggleGenero(genero)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                                    favoritos.includes(genero)
                                                        ? "bg-purple-500/30 border-purple-400 text-purple-100 shadow-sm shadow-purple-500/20"
                                                        : "bg-[#0a0014]/40 border-purple-400/20 text-purple-300/60 hover:border-purple-400/50 hover:text-purple-200"
                                                }`}>
                                            {genero}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit"
                                        className="w-full text-[#0a0014] bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 hover:from-yellow-300 hover:via-yellow-500 hover:to-yellow-700 font-semibold rounded-xl text-sm px-5 py-3 text-center shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40">
                                    Cadastrar
                                </button>
                            </div>
                            <p className="text-sm font-light text-center text-purple-200/50">
                                Já possui conta?{' '}
                                <Link to="/login" className="font-medium text-purple-300 hover:text-purple-200 hover:underline transition-colors">
                                    Entrar
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
