export const STORAGE_KEY = 'itensCarrinho';

export function lerCarrinho() {
    try {
        const itens = localStorage.getItem(STORAGE_KEY);
        return itens ? JSON.parse(itens) : [];
    } catch (e) {
        console.error("Erro ao ler o carrinho do localStorage:", e);
        return [];
    }
}

export function salvarCarrinho(itens) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch (e) {
        console.error("Erro ao salvar o carrinho no localStorage:", e);
    }
}

export function adicionarOuAtualizarItem(novoItem) {
    const carrinhoAtual = lerCarrinho();
    const idProduto = novoItem.produto.id;

    const indexExistente = carrinhoAtual.findIndex(item => item.produto.id === idProduto);

    if (indexExistente > -1) {
        carrinhoAtual[indexExistente].quantidade = novoItem.quantidade;
    } else {
        carrinhoAtual.push(novoItem);
    }

    salvarCarrinho(carrinhoAtual);
    return carrinhoAtual;
}

export function removerItem(idProduto) {
    const carrinhoAtual = lerCarrinho();
    const carrinhoFiltrado = carrinhoAtual.filter(item => item.produto.id !== idProduto);
    salvarCarrinho(carrinhoFiltrado);
    return carrinhoFiltrado;
}

export function limparCarrinho() {
    salvarCarrinho([]);
    return [];
}