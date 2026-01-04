document.addEventListener('contextmenu', event => event.preventDefault());

const productos = {
    cadenas: [
        { id: 1, slug: 'barbada', name: 'Barbada', prefix: 'Cadena' },
        { id: 2, slug: 'figaro3x1', name: 'Figaro 3x1', prefix: 'Cadena' },
        { id: 3, slug: 'torzal', name: 'Torzal', prefix: 'Cadena' },
        { id: 4, slug: 'granitoCafe', name: 'Granito de Café', prefix: 'Cadena' },
        { id: 5, slug: 'torzalFigaro', name: 'Torzal Fígaro', prefix: 'Cadena' }
    ],
    pulseras: [
        { id: 6, slug: 'barbada', name: 'Barbada', prefix: 'Pulsera' },
        { id: 7, slug: 'figaro3x1', name: 'Figaro 3x1', prefix: 'Pulsera' },
        { id: 8, slug: 'torzal', name: 'Torzal', prefix: 'Pulsera' },
        { id: 9, slug: 'granitoCafe', name: 'Granito de Café', prefix: 'Pulsera' },
        { id: 10, slug: 'torzalFigaro', name: 'Pulsera Torzal Fígaro', prefix: 'Pulsera' }
    ]
};

// --- SISTEMA DE PERSISTENCIA (COOKIES/LOCALSTORAGE) ---
let cart = JSON.parse(localStorage.getItem('illuminaCart')) || [];

const mainModal = new bootstrap.Modal(document.getElementById('mainModal'));
const ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));

// Al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    // Restaurar Tema
    const savedTheme = localStorage.getItem('illuminaTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('#themeToggle i');
    icon.className = savedTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';

    // Restaurar Carrito
    updateCartUI();

    // Banner Privacidad
    if (!localStorage.getItem('illuminaCookies')) {
        setTimeout(() => {
            document.getElementById('cookieBanner').classList.add('show');
        }, 2000);
    }
});

// SCROLL SUAVE Y ANIMACIONES
function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    const offset = 80; // Compensar navbar
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    document.querySelector('#themeToggle i').className = isDark ? 'bi bi-moon-stars' : 'bi bi-sun';
    
    // Guardar preferencia
    localStorage.setItem('illuminaTheme', newTheme);
});

function acceptCookies() {
    localStorage.setItem('illuminaCookies', 'true');
    document.getElementById('cookieBanner').classList.remove('show');
}

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
                <img src="imgs/${cat}/${p.prefix}-${p.slug}-illumina.png" class="img-fluid mb-3" style="max-height: 220px; border-radius:15px;">
                <p class="mb-1 small ls-2 fw-light text-uppercase">${p.prefix} ${p.name}</p>
                <p class="gold-text small">Cotizar al finalizar el pedido</p>
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
                        <div class="carousel-item active"><img src="${baseImg}.png" class="d-block w-100 rounded-3"></div>
                        <div class="carousel-item"><img src="${baseImg}-Cerca.png" class="d-block w-100 rounded-3"></div>
                    </div>
                    <button class="carousel-control-prev" data-bs-target="#pCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
                    <button class="carousel-control-next" data-bs-target="#pCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
                </div>
            </div>
            <div class="col-md-5 p-4 p-lg-5 d-flex flex-column justify-content-center">
                <button class="btn btn-sm btn-back mb-4 text-start" style="width: fit-content;" onclick="openCategory('${cat}')">← Volver al catálogo</button>
                <h2 class="fw-light ls-3 mb-3">${p.prefix} ${p.name}</h2>
                <h3 class="gold-text mb-4 fs-6 ls-2 text-uppercase">Cotizar al finalizar el pedido</h3>
                <p class="small opacity-50 mb-4 lh-lg">Diseño ergonómico con acabados de alta joyería. Cada pieza es revisada individualmente para garantizar el brillo característico de ILLÚMINA.</p>
                <ul class="list-unstyled small opacity-75 mb-5">
                    <li><i class="bi bi-gem me-2"></i> Plata Ley .925 Mexicana</li>
                    <li><i class="bi bi-stars me-2"></i> Acabado Pulido Espejo</li>
                    <li><i class="bi bi-shield-check me-2"></i> Garantía de autenticidad</li>
                </ul>
                <button onclick="addToCart(${p.id}, '${cat}')" class="btn-gold">Añadir a la bolsa</button>
            </div>
        </div>`;
}

function addToCart(id, cat) {
    const p = productos[cat].find(x => x.id === id);
    cart.push({...p, catOrigin: cat}); 
    saveCart();
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

function saveCart() {
    localStorage.setItem('illuminaCart', JSON.stringify(cart));
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = cart.map((p, i) => {
        return `
            <div class="d-flex align-items-center mb-4 border-bottom pb-3 animate-fade-down">
                <img src="imgs/${p.catOrigin}/${p.prefix}-${p.slug}-illumina.png" width="80" class="me-3 bg-light rounded shadow-sm" style="cursor:pointer; object-fit: cover; height: 80px;">
                <div class="flex-grow-1">
                    <h6 class="small ls-2 mb-1">${p.prefix} ${p.name}</h6>
                    <p class="small opacity-50 mb-1" style="font-size: 0.75rem;">Plata Ley .925 • Hecho en México</p>
                    <span class="gold-text fw-bold small">Precio por cotizar</span>
                </div>
                <button class="btn btn-sm text-danger" onclick="removeItem(${i})"><i class="bi bi-trash"></i></button>
            </div>`;
    }).join('');
    document.getElementById('cartTotal').innerText = `Por cotizar`;
    document.getElementById('cartCount').classList.toggle('d-none', cart.length === 0);
}

function removeItem(i) {
    cart.splice(i, 1);
    saveCart();
    updateCartUI();
}

// LOGICA DEL TICKET, ENVÍO Y WHATSAPP
function toggleDeliveryForm() {
    const isChecked = document.getElementById('deliveryToggle').checked;
    const formContainer = document.getElementById('deliveryFormContainer');
    
    if (isChecked) {
        formContainer.classList.add('open');
    } else {
        formContainer.classList.remove('open');
    }
}

function generateTicket() {
    if (cart.length === 0) {
        const errorAlert = document.getElementById('emptyCartAlert');
        errorAlert.classList.remove('d-none');
        setTimeout(() => errorAlert.classList.add('d-none'), 3000);
        return;
    }

    cartOffcanvas.hide();
    const ticketContent = document.getElementById('ticketContent');
    const fecha = new Date().toLocaleDateString('es-MX');
    const hora = new Date().toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'});

    let itemsHtml = '';
    cart.forEach(p => {
        itemsHtml += `
            <div class="ticket-item">
                <div class="d-flex flex-column">
                    <span class="fw-bold small text-uppercase">${p.prefix} ${p.name}</span>
                    <span class="small opacity-50" style="font-size: 0.7rem;">Plata .925</span>
                </div>
                <span class="fw-bold small">COTIZAR</span>
            </div>
        `;
    });

    ticketContent.innerHTML = `
        <div class="text-center mb-4">
            <h4 class="ls-5 mb-0" style="font-family:'Cinzel', serif;">ILLÚMINA</h4>
            <p class="small opacity-50 ls-2">ALTA JOYERÍA</p>
        </div>
        <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
            <span class="small opacity-50">FECHA: ${fecha}</span>
            <span class="small opacity-50">HORA: ${hora}</span>
        </div>
        <div class="mb-4">
            ${itemsHtml}
        </div>
        <div class="d-flex justify-content-between pt-3 border-top border-dark">
            <span class="fw-bold ls-2">TOTAL</span>
            <span class="fw-bold fs-6 gold-text">PENDIENTE DE COTIZACIÓN</span>
        </div>
        <div class="text-center mt-4">
            <p class="small opacity-50 fst-italic">"Piezas que cuentan tu historia"</p>
        </div>
    `;

    ticketModal.show();
}

function sendWhatsAppOrder() {
    const isDelivery = document.getElementById('deliveryToggle').checked;
    let mensajeWA = "";

    // Construcción de la lista de productos
    let listaProductos = "";
    cart.forEach(p => {
        listaProductos += `▫️ ${p.prefix} ${p.name}\n`;
    });

    if (isDelivery) {
        // Validación básica
        const nombre = document.getElementById('inputName').value;
        const direccion = document.getElementById('inputAddress').value;
        const ciudad = document.getElementById('inputCity').value;
        
        if(!nombre || !direccion || !ciudad) {
            alert("Por favor completa los datos de envío.");
            return;
        }

        // PLANTILLA B: CON ENVÍO
        mensajeWA = `*ILLÚMINA | Solicitud de Cotización*\n` +
            `────────────────────\n\n` +
            `Hola, deseo cotizar las siguientes piezas:\n\n` +
            `${listaProductos}\n` +
            `*Detalles de Entrega*\n` +
            `• ${nombre}\n` +
            `• ${direccion}, ${document.getElementById('inputColonia').value}\n` +
            `• CP ${document.getElementById('inputCP').value}\n` +
            `• ${ciudad}\n` +
            `• Tel: ${document.getElementById('inputPhone').value}\n\n` +
            `Quedo a la espera de la cotización y existencias.`;

    } else {
        // PLANTILLA A: ENTREGA PERSONAL
        mensajeWA = `*ILLÚMINA | Solicitud de Cotización*\n` +
            `────────────────────\n\n` +
            `Hola, me interesa cotizar y agendar una entrega personal para:\n\n` +
            `${listaProductos}\n` +
            `*Método:* Entrega personal a convenir.\n` +
            `Quedo atento a su respuesta.`;
    }
    
    // Enviar a WhatsApp
    const numeroWA = "525657785749";
    window.open(`https://wa.me/${numeroWA}?text=${encodeURIComponent(mensajeWA)}`, '_blank');

    // --- LÓGICA DE LIMPIEZA TOTAL ---
    cart = [];
    saveCart();
    updateCartUI();
    ticketModal.hide();
    
    // Resetear formulario por si acaso
    document.getElementById('deliveryToggle').checked = false;
    toggleDeliveryForm();
    document.getElementById('inputName').value = '';
    document.getElementById('inputAddress').value = '';
    document.getElementById('inputColonia').value = '';
    document.getElementById('inputCP').value = '';
    document.getElementById('inputCity').value = '';
    document.getElementById('inputPhone').value = '';
}

function openLegal(tipo) {
    const target = document.getElementById('modalTarget');
    const modalElement = document.getElementById('mainModal');
    
    // Cambiamos a modo texto 
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