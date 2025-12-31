let cart = [];

function addToCart() {
    const l = document.getElementById('selectLargo').value;
    const g = document.getElementById('selectGrosor').value;
    const key = `${currentProduct}-${l}-${g}`;
    const item = cart.find(i => i.key === key);
    if (item) { item.qty++; }
    else {
        cart.push({
            key, name: currentProduct, largo: l, grosor: g,
            peso: document.getElementById('pesoEstimado').innerText,
            qty: 1
        });
    }
    renderCart();
    showToast(currentProduct);
}

function renderCart() {
    const items = document.getElementById('cartItems');
    items.innerHTML = '';
    document.getElementById('emptyCartText').style.display = cart.length ? 'none' : 'block';
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
    document.getElementById('cartDot').style.display = cart.length ? 'block' : 'none';

    cart.forEach((p, i) => {
        items.innerHTML += `
      <div class="mb-3 border-bottom pb-2">
        <strong>${p.name}</strong><br>
        <small class="text-muted">${p.largo}cm · ${p.grosor}mm · ${p.peso}</small>
        <div class="d-flex align-items-center gap-2 mt-2">
          <button class="btn btn-outline-dark btn-sm" onclick="changeQty(${i},-1)">−</button>
          <div class="qty-box">${p.qty}</div>
          <button class="btn btn-outline-dark btn-sm" onclick="changeQty(${i},1)">+</button>
          <button class="btn btn-link text-danger ms-auto btn-sm text-decoration-none" onclick="removeItem(${i})">Eliminar</button>
        </div>
      </div>`;
    });
}

function changeQty(i, d) { cart[i].qty += d; if (cart[i].qty <= 0) cart.splice(i, 1); renderCart(); }
function removeItem(i) { cart.splice(i, 1); renderCart(); }

function checkout() {
    let msg = 'Hola Illúmina, deseo realizar un pedido:%0A%0A';
    cart.forEach(p => msg += `• ${p.name} (${p.largo}cm, ${p.grosor}mm) x${p.qty}%0A`);
    window.open(`https://wa.me/525657785749?text=${msg}`, '_blank');
}