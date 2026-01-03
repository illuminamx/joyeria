const productos = {
    cadenas: [
        { id: 1, slug: 'barbada', name: 'Barbada', price: 1200, prefix: 'Cadena' },
        { id: 2, slug: 'figaro3x1', name: 'Figaro 3x1', price: 1350, prefix: 'Cadena' },
        { id: 3, slug: 'torzal', name: 'Torzal', price: 1500, prefix: 'Cadena' },
        { id: 4, slug: 'granitoCafe', name: 'Granito de Café', price: 1800, prefix: 'Cadena' },
        { id: 5, slug: 'torzalFigaro', name: 'Torzal Fígaro', price: 1600, prefix: 'Cadena' }
    ],
    pulseras: [
        { id: 6, slug: 'barbada', name: 'Barbada', price: 800, prefix: 'Pulsera' },
        { id: 7, slug: 'figaro3x1', name: 'Figaro 3x1', price: 850, prefix: 'Pulsera' },
        { id: 8, slug: 'torzal', name: 'Torzal', price: 950, prefix: 'Pulsera' },
        { id: 9, slug: 'granitoCafe', name: 'Granito de Café', price: 1100, prefix: 'Pulsera' },
        { id: 10, slug: 'torzalFigaro', name: 'Pulsera Torzal Fígaro', price: 1000, prefix: 'Pulsera' }
    ]
};

let cart = [];
const mainModal = new bootstrap.Modal(document.getElementById('mainModal'));
const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));

document.getElementById('themeToggle').addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.querySelector('#themeToggle i').className = isDark ? 'bi bi-moon-stars' : 'bi bi-sun';
});

function openCategory(cat) {
    if (window.event) window.event.preventDefault();
    const target = document.getElementById('modalTarget');
    const modalElement = document.getElementById('mainModal');
    modalElement.classList.remove('caracteristicas-mode');
    target.scrollTop = 0;

    let html = `
        <div class="p-4 p-md-5 animate-fade-down">
            <h2 class="text-center ls-5 mb-5 text-uppercase fw-light">${cat}</h2>
            <div class="product-grid">`;
    
    productos[cat].forEach(p => {
        html += `
            <div class="product-item text-center animate-fade-down" onclick="showProduct('${cat}', ${p.id})" style="cursor:pointer">
                <img src="imgs/${cat}/${p.prefix}-${p.slug}-illumina.png" class="img-fluid mb-3" style="max-height: 220px">
                <p class="mb-1 small ls-2 fw-light">${p.prefix} ${p.name}</p>
                <p class="gold-text fw-bold">$${p.price}</p>
            </div>`;
    });
    
    html += `</div></div>`;
    target.innerHTML = html;
    mainModal.show();
}

function showProduct(cat, id) {
    const p = productos[cat].find(x => x.id === id);
    const target = document.getElementById('modalTarget');
    const modalElement = document.getElementById('mainModal');
    const baseImg = `imgs/${cat}/${p.prefix}-${p.slug}-illumina`;
    
    modalElement.classList.add('caracteristicas-mode');
    target.scrollTop = 0;
    target.innerHTML = `
        <div class="row g-0 animate-fade-down">
            <div class="col-md-7 p-4 p-lg-5 d-flex align-items-center position-relative">
                <div id="pCarousel" class="carousel slide w-100" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active"><img src="${baseImg}.png" class="d-block w-100"></div>
                        <div class="carousel-item"><img src="${baseImg}-Cerca.png" class="d-block w-100"></div>
                    </div>
                    <button class="carousel-control-prev" data-bs-target="#pCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
                    <button class="carousel-control-next" data-bs-target="#pCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
                </div>
            </div>
            <div class="col-md-5 p-4 p-lg-5 d-flex flex-column justify-content-center">
                <button class="btn btn-sm btn-back mb-4 text-start" onclick="openCategory('${cat}')">← Volver al catálogo</button>
                <h2 class="fw-light ls-3 mb-3">${p.prefix} ${p.name}</h2>
                <h3 class="gold-text mb-4">$${p.price}</h3>
                <p class="small opacity-50 mb-5 lh-lg">Diseño ergonómico con acabados de alta joyería. Cada pieza es revisada individualmente para garantizar el brillo característico de ILLÚMINA.</p>
                <button onclick="addToCart(${p.id}, '${cat}')" class="btn-gold">Añadir a la bolsa</button>
            </div>
        </div>`;
}

function addToCart(id, cat) {
    const p = productos[cat].find(x => x.id === id);
    cart.push({...p, catOrigin: cat}); 
    updateCartUI();
    const cartBtn = document.querySelector('.bi-bag').parentElement;
    cartBtn.classList.add('cart-bounce');
    setTimeout(() => cartBtn.classList.remove('cart-bounce'), 500);
    const alert = document.getElementById('cartAlert');
    document.getElementById('alertMsg').innerText = `Agregado: ${p.name}`;
    alert.classList.remove('d-none');
    setTimeout(() => alert.classList.add('d-none'), 3000);
}

function forceOpenCart() {
    mainModal.hide();
    cartOffcanvas.show();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    let total = 0;
    container.innerHTML = cart.map((p, i) => {
        total += p.price;
        return `
            <div class="d-flex align-items-center mb-4 border-bottom pb-3 animate-fade-down">
                <img src="imgs/${p.catOrigin}/${p.prefix}-${p.slug}-illumina.png" width="60" class="me-3 bg-light rounded shadow-sm" style="cursor:pointer">
                <div class="flex-grow-1">
                    <h6 class="small ls-2 mb-0">${p.prefix} ${p.name}</h6>
                    <span class="gold-text small">$${p.price}</span>
                </div>
                <button class="btn btn-sm text-danger" onclick="removeItem(${i})">✕</button>
            </div>`;
    }).join('');
    document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
    document.getElementById('cartCount').classList.toggle('d-none', cart.length === 0);
}

function removeItem(i) {
    cart.splice(i, 1);
    updateCartUI();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        const errorAlert = document.getElementById('emptyCartAlert');
        errorAlert.classList.remove('d-none');
        setTimeout(() => errorAlert.classList.add('d-none'), 3000);
        return;
    }
    const total = document.getElementById('cartTotal').innerText;
    let mensajeWA = "Hola ILLÚMINA, me gustaría realizar el siguiente pedido:\n\n";
    cart.forEach(p => mensajeWA += `• ${p.prefix} ${p.name} - $${p.price}\n`);
    mensajeWA += `\n*TOTAL: ${total}*`;
    const numeroWA = "525657785749";
    window.open(`https://wa.me/${numeroWA}?text=${encodeURIComponent(mensajeWA)}`, '_blank');
}

function openLegal(tipo) {
    const target = document.getElementById('modalTarget');
    const modalElement = document.getElementById('mainModal');
    
    // Cambiamos a modo texto para que el modal se vea centrado y elegante
    modalElement.classList.add('caracteristicas-mode');
    
    let titulo = tipo === 'terminos' ? 'Términos y Condiciones' : 'Políticas de Envío';
    let contenido = "";

    if (tipo === 'terminos') {
        contenido = `
            En ILLÚMINA, con sede en CDMX, la excelencia es nuestro estándar. Nuestros precios incluyen impuestos y el pago se realiza mediante transferencia bancaria. Cada pieza de <strong>plata ley 925 mexicana</strong> es sometida a un riguroso control de calidad antes de ser enviada para asegurar su integridad. Una vez cerrado el pedido, <strong>no se aceptan reembolsos ni cancelaciones</strong>, salvo por defectos de fábrica comprobables, ya que nuestras piezas son verificadas para garantizar que no presenten daños estructurales al momento del despacho.
        `;
    } else {
        contenido = `
            En ILLÚMINA nos aseguramos de que tu joyería llegue segura. Realizamos envíos a todo México desde la CDMX. Cada orden es <strong>empacada cuidadosamente y verificada</strong> tras confirmar tu depósito o transferencia. Una vez que el paquete es entregado a la mensajería, te proporcionaremos un número de guía para su rastreo. No nos hacemos responsables por retrasos imputables a la empresa de logística o datos de entrega incorrectos proporcionados por el cliente.
        `;
    }

    target.innerHTML = `
        <div class="p-4 p-md-5 text-center animate-fade-down">
            <h2 class="ls-3 gold-text mb-4 text-uppercase fw-light" style="font-family: 'Cinzel', serif;">${titulo}</h2>
            <div class="opacity-75 lh-lg mb-5 small text-start mx-auto" style="max-width: 700px;">
                ${contenido}
            </div>
            <button class="btn-gold px-5" data-bs-dismiss="modal">Entendido</button>
        </div>
    `;
    
    mainModal.show();
}