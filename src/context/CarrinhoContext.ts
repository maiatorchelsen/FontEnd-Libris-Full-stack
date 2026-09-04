import type { LivroType } from '../utils/LivroType'
import { create } from 'zustand'

type ItemCarrinho = {
    livro: LivroType
    quantidade: number
}

type CarrinhoStore = {
    itens: ItemCarrinho[]
    adicionarItem: (livro: LivroType) => void
    removerItem: (livroId: number) => void
    atualizarQuantidade: (livroId: number, quantidade: number) => void
    limparCarrinho: () => void
    totalCarrinho: number
    qtdItens: number
}

const CHAVE_CARRINHO = "carrinho"

function carregarCarrinho(): ItemCarrinho[] {
    try {
        const dados = localStorage.getItem(CHAVE_CARRINHO)
        return dados ? JSON.parse(dados) : []
    } catch {
        return []
    }
}

function salvarCarrinho(itens: ItemCarrinho[]) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens))
}

function calcularTotais(itens: ItemCarrinho[]) {
    return {
        totalCarrinho: itens.reduce(
            (total, item) => total + Number(item.livro.preco) * item.quantidade,
            0
        ),
        qtdItens: itens.reduce((total, item) => total + item.quantidade, 0),
    }
}

const itensIniciais = carregarCarrinho()

export const useCarrinhoStore = create<CarrinhoStore>((set) => ({
    itens: itensIniciais,
    ...calcularTotais(itensIniciais),
    adicionarItem: (livro) =>
        set((state) => {
            const existente = state.itens.find(item => item.livro.id === livro.id)
            const itens = existente
                ? state.itens.map(item =>
                    item.livro.id === livro.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                )
                : [...state.itens, { livro, quantidade: 1 }]
            salvarCarrinho(itens)
            return { itens, ...calcularTotais(itens) }
        }),
    removerItem: (livroId) =>
        set((state) => {
            const itens = state.itens.filter(item => item.livro.id !== livroId)
            salvarCarrinho(itens)
            return { itens, ...calcularTotais(itens) }
        }),
    atualizarQuantidade: (livroId, quantidade) =>
        set((state) => {
            const itens = quantidade <= 0
                ? state.itens.filter(item => item.livro.id !== livroId)
                : state.itens.map(item =>
                    item.livro.id === livroId
                        ? { ...item, quantidade }
                        : item
                )
            salvarCarrinho(itens)
            return { itens, ...calcularTotais(itens) }
        }),
    limparCarrinho: () => {
        salvarCarrinho([])
        set({ itens: [], totalCarrinho: 0, qtdItens: 0 })
    },
}))