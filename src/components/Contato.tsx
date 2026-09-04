export default function Contato() {
    return (
        <section className="relative bg-[#0a0014] min-h-screen py-16">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1a0f2e] to-transparent pointer-events-none" />

            <div className="relative z-10 px-6">

                {/* Título */}
                <div className="text-center mb-14">
                    <p className="mb-3 text-sm uppercase tracking-[0.35em] text-yellow-500">
                        ✦ Fale conosco ✦
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#F5EBDD] mb-4">
                        Contato
                    </h1>
                    <p className="text-purple-200/60 max-w-xl mx-auto">
                        Estamos aqui para ajudar. Entre em contato conosco por qualquer um dos canais abaixo.
                    </p>
                </div>

                {/* Conteúdo principal: Foto + Cards */}
                <div className="max-w-7xl mx-left flex flex-col lg:flex-row gap-2 items-center">

                    {/* Foto do gato com brilho roxo */}
                    <div className="relative w-full lg:w-[45%] flex-shrink-0 flex justify-center items-center">
                        <div className="absolute inset-0 -inset-x-10 -inset-y-6 bg-[radial-gradient(circle,rgba(168,85,247,0.35)_0%,rgba(139,92,246,0.15)_35%,transparent_70%)] blur-2xl pointer-events-none" />
                        <img
                            src="/gato2.png"
                            alt="Gato da Livraria Libris Arcana"
                            className="relative w-full h-100 object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.45)] animate-[float_4s_ease-in-out_infinite,glow-pulse_3s_ease-in-out_infinite]"
                        />
                    </div>

                    {/* Cards de contato */}
                    <div className="grid grid-cols-3 gap-6 flex-1">

                        {/* Email */}
                        <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]">
                            <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-[#160D24] flex items-center justify-center text-2xl">
                                📧
                            </div>
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                E-mail
                            </h3>
                            <p className="text-purple-200/70 text-sm leading-relaxed">
                                contato@librisarcana.com.br
                            </p>
                            <p className="text-purple-200/50 text-xs">
                                Respondemos em até 24 horas
                            </p>
                        </div>

                        {/* Telefone */}
                        <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]">
                            <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-[#160D24] flex items-center justify-center text-2xl">
                                📱
                            </div>
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                Telefone
                            </h3>
                            <p className="text-purple-200/70 text-sm leading-relaxed">
                                (11) 99999-0000
                            </p>
                            <p className="text-purple-200/50 text-xs">
                                Seg a Sex, 9h às 18h
                            </p>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]">
                            <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-[#160D24] flex items-center justify-center text-2xl">
                                💬
                            </div>
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                WhatsApp
                            </h3>
                            <p className="text-purple-200/70 text-sm leading-relaxed">
                                (11) 99999-0000
                            </p>
                            <p className="text-purple-200/50 text-xs">
                                Atendimento rápido e direto
                            </p>
                        </div>

                        {/* Endereço */}
                        <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]">
                            <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-[#160D24] flex items-center justify-center text-2xl">
                                📍
                            </div>
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                Endereço
                            </h3>
                            <p className="text-purple-200/70 text-sm leading-relaxed">
                                Rua das Histórias, 42<br />
                                Pelotas - RS
                            </p>
                        </div>

                        {/* Redes Sociais */}
                        <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]">
                            <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-[#160D24] flex items-center justify-center text-2xl">
                                🌐
                            </div>
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                Redes Sociais
                            </h3>
                            <p className="text-purple-200/70 text-sm leading-relaxed">
                                @librisarcana
                            </p>
                            <p className="text-purple-200/50 text-xs">
                                Instagram, Facebook e Twitter
                            </p>
                        </div>

                        {/* Horário */}
                        <div className="flex flex-col items-center text-center gap-4 rounded-2xl border border-purple-400/30 bg-purple-900/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(212,175,90,0.1)]">
                            <div className="w-14 h-14 rounded-full border border-yellow-500/30 bg-[#160D24] flex items-center justify-center text-2xl">
                                🕐
                            </div>
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                Horário
                            </h3>
                            <p className="text-purple-200/70 text-sm leading-relaxed">
                                Seg a Sex: 9h às 18h<br />
                                Sáb: 10h às 14h
                            </p>
                        </div>

                    </div>

                </div>

            </div>
            {/* Frase final */}
        <div className="text-center border-t border-purple-400/10 pt-8">
          <p className="text-purple-200/40 text-xs tracking-widest uppercase">
            ✦ Libris Arcana —  Histórias que encantam ✦
          </p>
        </div>
        </section>
    );
}
