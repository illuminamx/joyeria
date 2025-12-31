let currentCategory = '', currentProduct = '', toastTimer;

function openCategory(cat) {
    currentCategory = cat;
    document.getElementById('categoryTitle').innerText = cat;
    const container = document.getElementById('categoryProducts');
    container.innerHTML = '';
    catalog[cat].forEach(p => {
        container.innerHTML += `
      <div class="col-md-6 mb-4 text-center" onclick="openProduct('${p}')">
        <img src="https://picsum.photos/600/400?random=${Math.random()}" class="img-fluid rounded mb-2 shadow-sm">
        <h5 class="fw-bold">${p}</h5>
      </div>`;
    });
    bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal')).show();
}

function openProduct(name) {
    currentProduct = name;
    document.getElementById('productName').innerText = name;
    const sLargo = document.getElementById('selectLargo');
    const sGrosor = document.getElementById('selectGrosor');
    sLargo.innerHTML = ''; sGrosor.innerHTML = '';
    (currentCategory === 'Cadenas' ? [45, 50, 55, 60] : [16, 17, 18, 19, 20]).forEach(v => sLargo.innerHTML += `<option value="${v}">${v} cm</option>`);
    for (let i = 1; i <= 15; i++) sGrosor.innerHTML += `<option value="${i}">${i} mm</option>`;
    sLargo.onchange = sGrosor.onchange = updateWeight;
    updateWeight();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal')).show();
}

function updateWeight() {
    const l = document.getElementById('selectLargo').value;
    const g = document.getElementById('selectGrosor').value;
    const r = (g / 2) / 10;
    const peso = Math.PI * r * r * l * 10.36;
    document.getElementById('pesoEstimado').innerText = `~${peso.toFixed(1)} g`;
}

function showToast(p) {
    document.getElementById('toastText').innerHTML = `Añadiste <strong>${p}</strong> al <a href="javascript:void(0)" onclick="openCart()">carrito</a>`;
    document.getElementById('toastAdd').style.display = 'flex';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 3500);
}

function hideToast() { document.getElementById('toastAdd').style.display = 'none' }

function openCart() {
    hideToast();
    ['categoryModal', 'productModal', 'legalModal'].forEach(id => {
        const modalInst = bootstrap.Modal.getInstance(document.getElementById(id));
        if (modalInst) modalInst.hide();
    });
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('cartCanvas')).show();
}

function openLegal(type) {
    document.getElementById('legalTitle').innerText = legalTexts[type].title;
    document.getElementById('legalBody').innerHTML = legalTexts[type].content;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('legalModal')).show();
}