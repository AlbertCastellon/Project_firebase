/**
 * main.js - Lógica principal de la aplicación SomNeteja
 */

/**
 * Inicializar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupGlobalEventListeners();
});

/**
 * Inicializar la aplicación
 */
function initializeApp() {
    console.log('Inicializando SomNeteja...');

    // Cargar datos del usuario
    loadUserData();

    // Inicializar componentes
    initializeHeader();
    initializeFooter();

    // Cargar productos si estamos en la página principal
    if (document.getElementById('shopProducts')) {
        loadProducts();
    }

    console.log('SomNeteja inicializado correctamente');
}

/**
 * Configurar event listeners globales
 */
function setupGlobalEventListeners() {
    // Manejar clic en logo para volver a inicio
    const logo = document.getElementById('logo_header');
    if (logo) {
        logo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Manejar clic en enlace de tienda
    const shopLink = document.getElementById('shop-link');
    if (shopLink) {
        shopLink.addEventListener('click', (e) => {
            e.preventDefault();
            const shopSection = document.querySelector('[id="shopProducts"]')?.closest('.section');
            if (shopSection) {
                shopSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Inicializar header
 */
function initializeHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    // Agregar estilos de scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 8px 16px rgba(8, 71, 52, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(8, 71, 52, 0.1)';
        }
    });
}

/**
 * Inicializar footer
 */
function initializeFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // El footer ya está en el HTML, solo asegurar que está visible
    footer.style.display = 'block';
}

/**
 * Cargar datos del usuario
 */
function loadUserData() {
    try {
        // Cargar puntos del usuario
        const userPoints = localStorage.getItem('userPoints') || '0';
        const userPointsElements = document.querySelectorAll('#userPoints');

        userPointsElements.forEach(element => {
            element.textContent = userPoints;
        });

        // Cargar estado de premium
        const isPremium = localStorage.getItem('isPremium') === 'true';
        if (isPremium) {
            addPremiumBadge();
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

/**
 * Agregar badge de premium
 */
function addPremiumBadge() {
    const header = document.querySelector('header');
    if (!header) return;

    // Verificar si ya existe el badge
    if (header.querySelector('.premium-badge')) return;

    const badge = document.createElement('div');
    badge.className = 'premium-badge';
    badge.innerHTML = '👑 Premium';
    badge.style.cssText = `
    background-color: var(--color-vibrante);
    color: var(--color-bosque);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    margin-left: 1rem;
  `;

    const points = header.querySelector('.points');
    if (points) {
        points.appendChild(badge);
    }
}

/**
 * Actualizar puntos del usuario
 */
function updateUserPoints(newPoints) {
    localStorage.setItem('userPoints', newPoints);

    const userPointsElements = document.querySelectorAll('#userPoints');
    userPointsElements.forEach(element => {
        element.textContent = newPoints;
    });

    // Disparar evento personalizado
    const event = new CustomEvent('pointsUpdated', { detail: { points: newPoints } });
    document.dispatchEvent(event);
}

/**
 * Agregar puntos al usuario
 */
function addUserPoints(points) {
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
    const newPoints = currentPoints + points;
    updateUserPoints(newPoints);

    showNotification(`+${points} punts! Total: ${newPoints}`, 'success');
}

/**
 * Restar puntos al usuario
 */
function subtractUserPoints(points) {
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');

    if (currentPoints < points) {
        showNotification('No tens prou punts', 'danger');
        return false;
    }

    const newPoints = currentPoints - points;
    updateUserPoints(newPoints);

    return true;
}

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    max-width: 400px;
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Validar si el usuario está autenticado
 */
function isUserAuthenticated() {
    return auth && auth.currentUser !== null;
}

/**
 * Obtener el usuario actual
 */
function getCurrentUser() {
    return auth ? auth.currentUser : null;
}

/**
 * Obtener UID del usuario actual
 */
function getCurrentUserUID() {
    const user = getCurrentUser();
    return user ? user.uid : null;
}

/**
 * Obtener email del usuario actual
 */
function getCurrentUserEmail() {
    const user = getCurrentUser();
    return user ? user.email : null;
}

/**
 * Verificar si el usuario es premium
 */
function isPremiumUser() {
    return localStorage.getItem('isPremium') === 'true';
}

/**
 * Establecer usuario como premium
 */
function setPremiumUser(isPremium = true) {
    localStorage.setItem('isPremium', isPremium ? 'true' : 'false');

    if (isPremium) {
        addPremiumBadge();
        showNotification('Benvingut a SomNeteja Premium! 👑', 'success');
    }
}

/**
 * Guardar datos del usuario en localStorage
 */
function saveUserData(userData) {
    try {
        const uid = getCurrentUserUID();
        if (uid) {
            localStorage.setItem(`user_${uid}`, JSON.stringify(userData));
        }
    } catch (error) {
        console.error('Error al guardar datos del usuario:', error);
    }
}

/**
 * Cargar datos del usuario desde localStorage
 */
function getUserData() {
    try {
        const uid = getCurrentUserUID();
        if (uid) {
            const data = localStorage.getItem(`user_${uid}`);
            return data ? JSON.parse(data) : null;
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
    return null;
}

/**
 * Formatear fecha
 */
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('ca-ES', options);
}

/**
 * Formatear moneda
 */
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Obtener parámetro de URL
 */
function getUrlParameter(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}

/**
 * Redirigir a URL
 */
function redirectTo(url) {
    window.location.href = url;
}

/**
 * Recargar página
 */
function reloadPage() {
    window.location.reload();
}

/**
 * Volver a página anterior
 */
function goBack() {
    window.history.back();
}

/**
 * Desplazarse a elemento
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Mostrar modal
 */
function showModal(title, message, buttons = []) {
    const modal = document.createElement('div');
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  `;

    modalContent.innerHTML = `
    <h2 style="color: var(--color-bosque); margin-bottom: 1rem;">${title}</h2>
    <p style="color: #666; margin-bottom: 2rem;">${message}</p>
    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
      ${buttons.map(btn => `
        <button class="btn btn-${btn.type || 'secondary'}" onclick="${btn.action}">
          ${btn.label}
        </button>
      `).join('')}
    </div>
  `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    return modal;
}

/**
 * Cerrar modal
 */
function closeModal(modal) {
    if (modal) {
        modal.remove();
    }
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        updateUserPoints,
        addUserPoints,
        subtractUserPoints,
        showNotification,
        isUserAuthenticated,
        getCurrentUser,
        getCurrentUserUID,
        getCurrentUserEmail,
        isPremiumUser,
        setPremiumUser,
        saveUserData,
        getUserData,
        formatDate,
        formatCurrency,
        getUrlParameter,
        redirectTo,
        reloadPage,
        goBack,
        scrollToElement,
        showModal,
        closeModal
    };
}
