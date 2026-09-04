import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useClienteStore } from "../context/ClienteContext"
import { useCarrinhoStore } from "../context/CarrinhoContext"

const ITENS = [
  { label: "Home", to: "/" },
  { label: "Lançamentos", to: "/" },
  { label: "Gêneros", to: "/" },
  { label: "Contato", to: "/contato" },
]

const ICONE_PESQUISA = (
  <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
)

const ICONE_CARRINHO = (
  <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
)

const ICONE_PERFIL = (
  <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

export default function Titulo() {
  const [aberto, setAberto] = useState(false)
  const { cliente, deslogaCliente } = useClienteStore()
  const { qtdItens } = useCarrinhoStore()
  const navigate = useNavigate()

  function handleLogout() {
    deslogaCliente()
    localStorage.removeItem("clienteKey")
    navigate("/")
  }

  function irParaPesquisa() {
    navigate("/")
    setTimeout(() => {
      document
        .getElementById("termo")
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
      document.getElementById("termo")?.focus()
    }, 350)
  }

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-cosmic border-b border-yellow-500/40 shadow-[0_1px_0_rgba(255,215,140,0.25),0_8px_24px_rgba(30,10,60,0.6)]">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-32 lg:h-36 gap-4">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo1.png"
                alt="Logo Libris Arcana"
                className="h-32 object-cover "
              />
            </Link>

            {/* MENU CENTRAL */}
            <ul className="hidden lg:flex items-center gap-8 xl:gap-10 font-poppins">
              {ITENS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="relative block text-sm font-medium tracking-wider uppercase text-yellow-400 transition-colors duration-300 hover:text-yellow-50 hover:[text-shadow:0_0_10px_rgba(255,215,0,0.95),0_0_22px_rgba(255,180,0,0.75)] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                  >
                    {item.label}
                    <span className="absolute left-1/2 -bottom-1 h-px w-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transition-all duration-300 group-hover:w-full hover:w-4/5 hover:-translate-x-1/2" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* ÍCONES À DIREITA */}
            <div className="flex items-center gap-5 lg:gap-6">
              <button
                type="button"
                aria-label="Pesquisa"
                onClick={irParaPesquisa}
                className="text-yellow-300/90 hover:text-yellow-100 transition-colors hover:[filter:drop-shadow(0_0_8px_rgba(255,215,0,0.9))]"
              >
                {ICONE_PESQUISA}
              </button>
              <Link
                to="/carrinho"
                aria-label="Carrinho de compras"
                className="relative text-yellow-300/90 hover:text-yellow-100 transition-colors hover:[filter:drop-shadow(0_0_8px_rgba(255,215,0,0.9))]"
              >
                {ICONE_CARRINHO}
                {qtdItens > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-[#180D22] bg-yellow-400 rounded-full shadow-lg shadow-yellow-500/30">
                    {qtdItens}
                  </span>
                )}
              </Link>

              {cliente.id ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm font-medium text-yellow-200 truncate max-w-[120px]">
                    {cliente.nome}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-yellow-300/90 hover:text-red-400 transition-colors hover:[filter:drop-shadow(0_0_8px_rgba(255,100,100,0.8))]"
                    title="Sair"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  aria-label="Perfil de usuário"
                  className="text-yellow-300/90 hover:text-yellow-100 transition-colors hover:[filter:drop-shadow(0_0_8px_rgba(255,215,0,0.9))]"
                >
                  {ICONE_PERFIL}
                </Link>
              )}

              {/* BOTÃO MOBILE */}
              <button
                type="button"
                aria-label="Abrir menu principal"
                aria-expanded={aberto}
                onClick={() => setAberto(!aberto)}
                className="inline-flex items-center justify-center p-2 w-10 h-10 text-yellow-200 rounded-lg lg:hidden hover:bg-yellow-900/60 transition-colors"
              >
                <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  {aberto ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* MENU MOBILE */}
        {aberto && (
          <div className="lg:hidden border-t border-yellow-700/30 bg-black/90 backdrop-blur">
            <ul className="flex flex-col px-6 py-4 gap-1 font-poppins">
              {ITENS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setAberto(false)}
                    className="block py-2.5 text-sm font-medium tracking-wider uppercase text-yellow-100 hover:text-yellow-50 hover:pl-2 transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {cliente.id ? (
                <>
                  <li className="border-t border-yellow-700/20 mt-2 pt-2">
                    <span className="block py-2.5 text-sm font-medium text-yellow-300">
                      Olá, {cliente.nome}
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { handleLogout(); setAberto(false) }}
                      className="block py-2.5 text-sm font-medium tracking-wider uppercase text-red-400 hover:text-red-300 hover:pl-2 transition-all"
                    >
                      Sair
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    onClick={() => setAberto(false)}
                    className="block py-2.5 text-sm font-medium tracking-wider uppercase text-yellow-100 hover:text-yellow-50 hover:pl-2 transition-all"
                  >
                    Entrar
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
