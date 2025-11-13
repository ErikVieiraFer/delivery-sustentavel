document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();

    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
            circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
            circle.classList.add('ripple');

            this.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 600);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const animateElements = document.querySelectorAll('.produto, main ul li, form, #carrinho');
    animateElements.forEach(el => observer.observe(el));

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });

    setupProductModals();
});

function setupProductModals() {
    const produtos = document.querySelectorAll('.produto');

    produtos.forEach(produto => {
        const img = produto.querySelector('img');
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const nome = produto.querySelector('h3').textContent;
                const preco = produto.querySelector('.preco').textContent;
                const descricao = produto.querySelector('.descricao')?.textContent || '';
                const imgSrc = img.src;
                const id = produto.getAttribute('data-id');

                abrirModal(nome, preco, descricao, imgSrc, id);
            });
        }
    });
}

function abrirModal(nome, preco, descricao, imgSrc, id) {
    let modal = document.querySelector('.modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">×</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-body">
                    <h3></h3>
                    <span class="preco"></span>
                    <p></p>
                    <button onclick="adicionarDoModal()">Adicionar ao Pedido</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal();
        });

        modal.querySelector('.modal-close').addEventListener('click', fecharModal);
    }

    modal.querySelector('.modal-image').src = imgSrc;
    modal.querySelector('.modal-body h3').textContent = nome;
    modal.querySelector('.modal-body .preco').textContent = preco;
    modal.querySelector('.modal-body p').textContent = descricao;
    modal.dataset.id = id;
    modal.dataset.nome = nome;
    modal.dataset.preco = preco.replace('R$ ', '').replace(',', '.');

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function adicionarDoModal() {
    const modal = document.querySelector('.modal');
    const nome = modal.dataset.nome;
    const preco = parseFloat(modal.dataset.preco);
    const id = modal.dataset.id;

    adicionarProduto(nome, preco, id);
    fecharModal();
}

function setupMobileMenu() {
    const nav = document.querySelector('nav');

    if (!nav) return;

    let menuToggle = nav.querySelector('.menu-toggle');

    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', 'Menu');
        nav.parentElement.insertBefore(menuToggle, nav);
    }

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
    });

    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    });
}
