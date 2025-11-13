// A CHAVE para salvar e carregar os dados no navegador
const STORAGE_KEY = 'ecodelivery_carrinho';
let carrinho = [];

// --- FUNÇÕES DE CARREGAMENTO/SALVAMENTO ---

// Carrega o carrinho do LocalStorage
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem(STORAGE_KEY);
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
}

// Salva o carrinho no LocalStorage
function salvarCarrinho() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
}

// --- FUNÇÕES PRINCIPAIS DO CARRINHO ---

// Adiciona um item ao carrinho (chamada na página de produtos)
function adicionarProduto(nome, preco, id) {
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco: parseFloat(preco), quantidade: 1 });
    }

    salvarCarrinho();
    mostrarToast(`"${nome}" adicionado ao pedido!`);
    atualizarBadgeCarrinho();

    if (document.getElementById('tabelaCarrinho')) {
        atualizarCarrinhoVisual();
    }
}

function mostrarToast(mensagem) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = mensagem;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function atualizarBadgeCarrinho() {
    const badge = document.querySelector('.cart-badge');
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

    if (badge) {
        badge.textContent = totalItens;
        badge.style.display = totalItens > 0 ? 'flex' : 'none';
    }
}

// Remove uma unidade do item do carrinho (botão '-')
function diminuirQuantidade(id) {
    const index = carrinho.findIndex(item => item.id === id);
    if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
        salvarCarrinho();
        atualizarCarrinhoVisual();
        atualizarBadgeCarrinho();
    }
}

// Remove o item inteiro do carrinho (botão lixeira)
function excluirItem(id) {
    const index = carrinho.findIndex(item => item.id === id);
    if (index !== -1) {
        const nome = carrinho[index].nome;
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarCarrinhoVisual();
        atualizarBadgeCarrinho();
        mostrarToast(`"${nome}" removido do carrinho`);
    }
}


// --- FUNÇÃO DE RENDERIZAÇÃO (USADA APENAS EM pedido.html) ---

function atualizarCarrinhoVisual() {
    // Esta função só deve rodar se estivermos na página de pedido
    const tabelaBody = document.querySelector("#tabelaCarrinho tbody");
    const totalEl = document.getElementById("total");
    
    if (!tabelaBody || !totalEl) return; // Sai se os elementos não existirem
    
    tabelaBody.innerHTML = "";
    let subtotalItens = 0;
    const taxaEntrega = 5.00; // Exemplo de taxa fixa
    let totalGeral = 0;


    carrinho.forEach(item => {
        const subtotalItem = item.preco * item.quantidade;
        subtotalItens += subtotalItem;
        
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>
                <button onclick="diminuirQuantidade('${item.id}')" title="Diminuir">-</button>
                <span style="margin: 0 5px;">${item.quantidade}</span>
                <button onclick="adicionarProduto('${item.nome}', ${item.preco}, '${item.id}')" title="Aumentar">+</button>
            </td>
            <td>R$ ${subtotalItem.toFixed(2)}</td>
            <td><button class="btn-excluir" onclick="excluirItem('${item.id}')" title="Excluir Item">🗑️</button></td>
        `;
        tabelaBody.appendChild(linha);
    });

    // Adiciona a linha do frete
    if (subtotalItens > 0) {
        const linhaFrete = document.createElement("tr");
        linhaFrete.innerHTML = `
            <td colspan="3" style="text-align: right; font-style: italic;">Taxa de Entrega</td>
            <td style="font-weight: bold;">R$ ${taxaEntrega.toFixed(2)}</td>
            <td></td>
        `;
        tabelaBody.appendChild(linhaFrete);
        totalGeral = subtotalItens + taxaEntrega;
    } else {
        totalGeral = 0;
    }

    if (carrinho.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #777;">Seu carrinho está vazio. Adicione itens em Produtos!</td></tr>';
        totalEl.textContent = "Total Geral: R$ 0,00";
    } else {
        totalEl.textContent = "Total Geral: R$ " + totalGeral.toFixed(2);
    }
}

// --- FUNÇÃO DE FINALIZAÇÃO (CHAMADA NO pedido.html) ---

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = `Olá, gostaria de fazer um pedido:\n\n*ITENS:*\n`;
    let subtotalItens = 0;
    const taxaEntrega = 5.00; 
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        subtotalItens += subtotal;
        mensagem += `* ${item.quantidade}x ${item.nome} (R$ ${subtotal.toFixed(2)})\n`;
    });
    
    const totalGeral = subtotalItens + taxaEntrega;

    mensagem += `\n*RESUMO:*\n`;
    mensagem += `Subtotal: R$ ${subtotalItens.toFixed(2)}\n`;
    mensagem += `Taxa de Entrega: R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `*TOTAL GERAL:* R$ ${totalGeral.toFixed(2)}\n\n`;
    mensagem += `Por favor, complete meu pedido!`;

    // Codifica a mensagem para URL e abre o WhatsApp
    const telefone = '55270000000'; // (27) é o DDD de Vitória/ES
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');
    
    // Limpa o carrinho após a finalização
    carrinho.length = 0;
    salvarCarrinho();
    atualizarCarrinhoVisual();
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    atualizarBadgeCarrinho();

    if (document.getElementById('tabelaCarrinho')) {
        atualizarCarrinhoVisual();
    }
});