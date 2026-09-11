import { VictoryLabel, VictoryPie, VictoryTheme } from "victory"
import type { CSSProperties, ReactNode } from "react"

export type DadoGrafico = {
    id: string
    label: string
    valor: number
}

type Props = {
    titulo: string
    dados: DadoGrafico[]
    centro: string
    valorCentro: string
    formataValor?: (valor: number) => string
    children?: ReactNode
}

const CORES = [
    "rgba(250, 204, 21, 0.95)",
    "rgba(192, 132, 252, 0.95)",
    "rgba(34, 211, 238, 0.95)",
    "rgba(52, 211, 153, 0.95)",
    "rgba(251, 113, 133, 0.95)",
    "rgba(249, 115, 22, 0.95)",
    "rgba(129, 140, 248, 0.95)",
    "rgba(240, 171, 252, 0.95)",
]

export default function GraficoPizza({ titulo, dados, centro, valorCentro, formataValor, children }: Props) {
    const dadosValidos = dados.filter(d => d.valor > 0)
    const total = dadosValidos.reduce((soma, d) => soma + d.valor, 0)

    const estiloLabel: CSSProperties = {
        fill: "#f5e6ff",
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "Poppins, sans-serif",
        stroke: "#0a0014",
        strokeWidth: 2.5,
        paintOrder: "stroke",
    }

    return (
        <div className="rounded-2xl border border-purple-400/20 bg-[#1a0f2e]/80 backdrop-blur-sm p-5 h-full">
            <h3 className="text-[#F5EBDD] font-semibold mb-4">{titulo}</h3>

            {dadosValidos.length === 0 ? (
                <p className="text-purple-200/40 text-sm text-center py-16">
                    Sem dados para exibir ainda.
                </p>
            ) : (
                <>
                    <div className="flex justify-center">
                        <svg viewBox="0 0 400 400" className="w-full max-w-[460px]">
                            <VictoryPie
                                standalone={false}
                                width={400}
                                height={400}
                                data={dadosValidos.map(d => ({ x: d.label, y: d.valor }))}
                                colorScale={CORES}
                                innerRadius={80}
                                labelRadius={120}
                                padAngle={2}
                                cornerRadius={4}
                                theme={VictoryTheme.clean}
                                labels={({ datum }) => `${Math.round((datum.y / total) * 100)}%`}
                                style={{
                                    data: { stroke: "#160D24", strokeWidth: 2 },
                                    labels: estiloLabel,
                                }}
                            />
                            <VictoryLabel
                                textAnchor="middle"
                                style={{ fill: "#a78bfa", fontSize: 15, fontFamily: "Poppins, sans-serif" }}
                                x={200}
                                y={188}
                                text={centro}
                            />
                            <VictoryLabel
                                textAnchor="middle"
                                style={{ fill: "#fde68a", fontSize: 28, fontWeight: 700, fontFamily: "Poppins, sans-serif" }}
                                x={200}
                                y={214}
                                text={valorCentro}
                            />
                        </svg>
                    </div>

                    <ul className="mt-5 space-y-2">
                        {dadosValidos.map((d, indice) => (
                            <li key={d.id} className="flex items-center gap-2.5 text-base">
                                <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0"
                                    style={{ backgroundColor: CORES[indice % CORES.length] }}
                                />
                                <span className="flex-1 min-w-0 text-purple-100 truncate">{d.label}</span>
                                <span className="text-yellow-200 font-semibold">
                                    {formataValor ? formataValor(d.valor) : d.valor}
                                </span>
                                <span className="text-purple-200/60 text-sm w-9 text-right">
                                    {Math.round((d.valor / total) * 100)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                    {children}
                </>
            )}
        </div>
    )
}