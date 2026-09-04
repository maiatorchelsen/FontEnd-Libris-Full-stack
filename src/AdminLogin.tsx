import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useState } from "react"
import { useAdminStore } from "./context/AdminContext"

type Inputs = {
    email: string
    senha: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminLogin() {
    const { register, handleSubmit } = useForm<Inputs>()
    const { logaAdmin } = useAdminStore()
    const [mostraSenha, setMostraSenha] = useState(false)
    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        try {
            const response = await fetch(`${apiUrl}/admin/login`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ email: data.email, senha: data.senha })
            })

            const dados = await response.json()

            if (response.status === 200) {
                logaAdmin(dados)
                navigate("/admin/painel")
            } else {
                toast.error(dados.erro || "Erro... Login ou senha incorretos")
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error)
            toast.error("Erro ao conectar com o servidor.")
        }
    }

    return (
        <section className="bg-cosmic min-h-screen">
            <p style={{ height: 48 }}></p>
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full max-w-md rounded-2xl border border-purple-400/30 bg-[#1a0f2e]/80 backdrop-blur-md shadow-xl md:mt-0 xl:p-0">
                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-[#F5EBDD] md:text-2xl">
                                Painel Administrativo
                            </h1>
                            <p className="mt-2 text-sm text-purple-200/50">Acesso restrito a administradores</p>
                        </div>
                        <form className="space-y-5" onSubmit={handleSubmit(verificaLogin)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#F5EBDD]">
                                    E-mail
                                </label>
                                <input type="email" id="email" placeholder="admin@email.com"
                                       className="bg-[#0a0014]/60 border border-purple-400/30 text-[#F5EBDD] rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 block w-full p-2.5 placeholder-purple-300/40 transition-all"
                                       required
                                       {...register("email")} />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-[#F5EBDD]">
                                    Senha
                                </label>
                                <div className="relative">
                                    <input type={mostraSenha ? "text" : "password"} id="senha" placeholder="••••••••"
                                           className="bg-[#0a0014]/60 border border-purple-400/30 text-[#F5EBDD] rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 block w-full p-2.5 pr-10 placeholder-purple-300/40 transition-all"
                                           required
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
                            <button type="submit"
                                    className="w-full text-[#0a0014] bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 hover:from-yellow-300 hover:via-yellow-500 hover:to-yellow-700 font-semibold rounded-xl text-sm px-5 py-3 text-center shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40">
                                Entrar no Painel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
