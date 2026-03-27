/**
 * products.js - Gestión de productos y tienda para SomNeteja
 * Este archivo contiene toda la lógica de la tienda de productos
 */
// Referència a la col·lecció "productes" de Firestore
const products = db.collection("productes");

/**
 * Afegeix un nou document a la col·lecció.
 * @param {Object} doc - Objecte amb les propietats del nou ítem.
 */
// Array de productos disponibles en la tienda
const PRODUCTS = [
  {
    id: 1,
    name: "Samarreta SomNeteja V1",
    description: "Samarreta de cotó de qualitat amb logo de SomNeteja",
    price: 500, // Punts
    image: "./media/Samarreta1SomNeteja.png",
    category: "ropa",
    stock: 50
  },
  {
    id: 2,
    name: "Samarreta SomNeteja V2",
    description: "Samarreta premium amb disseny exclusiu",
    price: 600, // Punts
    image: "./media/Samarreta2SomNeteja.png",
    category: "ropa",
    stock: 40
  },
  {
    id: 3,
    name: "Cantimplora SomNeteja",
    description: "Cantimplora reutilitzable de 750ml amb aïllament tèrmic",
    price: 300, // Punts
    image: "./media/CantimploraSomNeteja.png",
    category: "accesorios",
    stock: 100
  },
  {
    id: 4,
    name: "Gorra SomNeteja",
    description: "Gorra de cotó amb visera ajustable",
    price: 250, // Punts
    image: "./media/GorraSomNeteja.png",
    category: "accesorios",
    stock: 75
  },
  {
    id: 5,
    name: "Xaleco de Treball",
    description: "Xaleco reflectant de seguretat per a jornades de neteja",
    price: 400, // Punts
    image: "./media/ChalecoSomNeteja.png",
    category: "proteccio",
    stock: 60
  },
  {
    id: 6,
    name: "Guants de Treball",
    description: "Guants de protecció resistents per a tasques de neteja",
    price: 200, // Punts
    image: "./media/GuantsSomNeteja.png",
    category: "proteccio",
    stock: 120
  }
];

// Carrito de compras
let cart = [];

/**
 * Cargar y mostrar productos en la tienda
 */
async function loadProducts() {
  const shopContainer = document.getElementById('shopProducts');

  let arrayItems = [];
  if (typeof selectAll === 'function') {
    try {
      arrayItems = await selectAll(products);
    } catch (error) {
      console.warn('No s’ha pogut llegir Firestore amb selectAll:', error);
      arrayItems = [];
    }
  } else {
    console.warn('selectAll no està definit; es mostrarà el llistat local de PRODUCTS');
  }

  if (!shopContainer) {
    console.error('Contenedor de productos no encontrado');
    return;
  }

  // Limpiar contenedor
  shopContainer.innerHTML = '';

  // Crear tarjetas de productos
  const source = arrayItems.length ? arrayItems.map(doc => ({ id: doc.id, ...doc.data() })) : PRODUCTS;
  source.forEach(product => {
    const productCard = createProductCard(product);
    shopContainer.appendChild(productCard);
  });
}

/**
 * Crear una tarjeta de producto
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card animate-fade';
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='./media/GorraSomNeteja.png'">
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-price">
        <span style="color: var(--color-vibrante); font-weight: bold;">${product.price}</span>
        <span style="color: #999; font-size: 0.9rem;"> punts</span>
      </div>
      <div style="background-color: rgba(206, 241, 123, 0.1); padding: 0.5rem; border-radius: 4px; margin-bottom: 1rem; text-align: center;">
        <span style="color: var(--color-bosque); font-size: 0.9rem;">Stock: <strong>${product.stock}</strong></span>
      </div>
      <div class="product-actions">
        <button class="btn-add-cart" onclick="addToCart(${product.id})">
          Afegir al Carrito
        </button>
      </div>
    </div>
  `;
  return card;
}

/**
 * Agregar producto al carrito
 */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  
  if (!product) {
    showNotification('Producte no trobat', 'danger');
    return;
  }

  // Verificar si el usuario tiene suficientes puntos
  const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
  
  if (userPoints < product.price) {
    showNotification(`No tens prou punts. Necessites ${product.price} punts i en tens ${userPoints}`, 'danger');
    return;
  }

  // Verificar stock
  if (product.stock <= 0) {
    showNotification('Producte esgotat', 'danger');
    return;
  }

  // Buscar si el producto ya está en el carrito
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  // Actualizar UI
  updateCartUI();
  showNotification(`${product.name} afegit al carrito!`, 'success');
  
  // Guardar carrito en localStorage
  saveCart();
}

/**
 * Remover producto del carrito
 */
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  saveCart();
  showNotification('Producte eliminat del carrito', 'info');
}

/**
 * Actualizar cantidad de producto en el carrito
 */
function updateCartQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      updateCartUI();
      saveCart();
    }
  }
}

/**
 * Actualizar la interfaz del carrito
 */
function updateCartUI() {
  const cartSection = document.getElementById('cartSection');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartSection || !cartItemsContainer) {
    return;
  }

  if (cart.length === 0) {
    cartSection.style.display = 'none';
    return;
  }

  cartSection.style.display = 'block';
  
  // Limpiar contenedor
  cartItemsContainer.innerHTML = '';

  let totalPoints = 0;

  // Crear filas para cada producto en el carrito
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPoints += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.style.cssText = `
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--color-vibrante);
      border-radius: 6px;
      margin-bottom: 1rem;
      align-items: center;
    `;

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
      <div style="flex: 1;">
        <h4 style="margin: 0; color: var(--color-bosque);">${item.name}</h4>
        <p style="margin: 0.5rem 0 0 0; color: #666;">${item.price} punts x ${item.quantity}</p>
      </div>
      <div style="text-align: right;">
        <div style="margin-bottom: 0.5rem;">
          <input type="number" value="${item.quantity}" min="1" max="10" 
            style="width: 60px; padding: 0.5rem; border: 1px solid var(--color-vibrante); border-radius: 4px;"
            onchange="updateCartQuantity(${item.id}, this.value)">
        </div>
        <button onclick="removeFromCart(${item.id})" class="btn-add-cart" style="background-color: #dc3545; padding: 0.5rem 1rem; font-size: 0.9rem;">
          Eliminar
        </button>
      </div>
      <div style="text-align: right; min-width: 100px;">
        <div style="font-size: 1.2rem; font-weight: bold; color: var(--color-vibrante);">${itemTotal}</div>
        <div style="font-size: 0.9rem; color: #666;">punts</div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Actualizar total
  cartTotal.textContent = totalPoints;

  // Verificar si tiene suficientes puntos
  const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
  const checkoutBtn = cartSection.querySelector('button.btn-primary');
  
  if (checkoutBtn) {
    if (userPoints < totalPoints) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = `No tens prou punts (Necessites ${totalPoints}, tens ${userPoints})`;
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Canjear Punts';
      checkoutBtn.onclick = () => checkout();
    }
  }
}

/**
 * Procesar el checkout
 */
function checkout() {
  if (cart.length === 0) {
    showNotification('El carrito està buit', 'danger');
    return;
  }

  const totalPoints = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const userPoints = parseInt(localStorage.getItem('userPoints') || '0');

  if (userPoints < totalPoints) {
    showNotification('No tens prou punts', 'danger');
    return;
  }

  // Restar puntos
  const newPoints = userPoints - totalPoints;
  localStorage.setItem('userPoints', newPoints);
  
  // Actualizar display de puntos
  const userPointsElement = document.getElementById('userPoints');
  if (userPointsElement) {
    userPointsElement.textContent = newPoints;
  }

  // Guardar orden en Firebase (cuando esté configurado)
  saveOrder(cart, totalPoints);

  // Limpiar carrito
  cart = [];
  saveCart();
  updateCartUI();

  showNotification('Compra realitzada amb èxit! Rebras els productes en 5-7 dies laborals.', 'success');
}

/**
 * Guardar carrito en localStorage
 */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Cargar carrito desde localStorage
 */
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartUI();
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      cart = [];
    }
  }
}

/**
 * Guardar orden en Firebase
 */
async function saveOrder(orderItems, totalPoints) {
  try {
    // Aquí iría la lógica para guardar en Firebase
    // Por ahora, solo guardamos en localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: orderItems,
      totalPoints: totalPoints,
      status: 'confirmada'
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Orden guardada:', order);
  } catch (error) {
    console.error('Error al guardar la orden:', error);
  }
}

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 400px;
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Inicializar la tienda cuando el documento esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
  // Cargar carrito guardado
  loadCart();
  
  // Cargar productos si estamos en la página principal
  if (document.getElementById('shopProducts')) {
    loadProducts();
  }

  // Manejar clic en enlace de tienda
  const shopLink = document.getElementById('shop-link');
  if (shopLink) {
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll a la sección de tienda
      const shopSection = document.querySelector('.section:has(#shopProducts)');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Exportar funciones para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTS,
    loadProducts,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    checkout,
    loadCart,
    saveCart
  };
}
