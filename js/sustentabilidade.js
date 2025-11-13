document.addEventListener('DOMContentLoaded', function() {
    // Dados baseados nas informações de impacto ambiental fornecidas
    const dadosImpacto = {
        labels: ['Água Economizada (L)', 'Árvores Preservadas', 'Redução de Resíduos (%)'],
        valores: [90800, 15, 26] // Valores reais: 90800L, 15 árvores por tonelada, 26% de resíduos
    };

    // Cores (Verde e Amarelo, mantendo a temática sustentável/lanchonete)
    const coresFundo = [
        'rgba(46, 125, 50, 0.8)',   // Verde Escuro para Água
        'rgba(173, 206, 102, 0.8)', // Verde Claro para Árvores
        'rgba(255, 193, 7, 0.8)'    // Amarelo para Resíduos
    ];
    
    const coresBorda = [
        'rgba(27, 94, 32, 1)',
        'rgba(142, 185, 87, 1)',
        'rgba(255, 160, 0, 1)'
    ];

    // Criação do Gráfico
    const ctx = document.getElementById('impactoChart').getContext('2d');
    
    const impactoChart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: dadosImpacto.labels,
            datasets: [{
                label: 'Impacto Positivo por Digitalização (Equivalente a 1 Tonelada de Papel Evitada)',
                data: dadosImpacto.valores,
                backgroundColor: coresFundo,
                borderColor: coresBorda,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Unidade de Medida'
                    },
                    // Personaliza os ticks do eixo Y
                    ticks: {
                        callback: function(value, index, values) {
                            if (index === 0) return '0';
                            if (index === 1) return 'Árvores';
                            if (index === 2) return 'Resíduos (%)';
                            return value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // O título da barra já é descritivo o suficiente
                },
                title: {
                    display: true,
                    text: 'Benefícios Ambientais da Digitalização de Pedidos',
                    font: {
                        size: 18
                    },
                    color: '#1b5e20'
                },
                tooltip: {
                    callbacks: {
                        // Adiciona a unidade correta ao passar o mouse
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed.y;
                            const index = context.dataIndex;
                            let unit = '';

                            if (index === 0) unit = ' Litros';
                            else if (index === 1) unit = ' Árvores';
                            else if (index === 2) unit = ' %';
                            
                            return label + value.toLocaleString('pt-BR') + unit;
                        }
                    }
                }
            }
        }
    });
});