export type ItemPedidoType = {
    id: number
    quantidade: number
    precoUnitario: number | string
    pedidoId: number
    livroId: number
    pedido: {
        id: number
        dataPedido: string
        status: string
        valorTotal?: number | string
    }
    livro: {
        id: number
        titulo: string
        capa: string | null
        autor: string
        preco?: number | string
    }
}