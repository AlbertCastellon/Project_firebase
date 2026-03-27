/**
 * auth.js - Gestión de autenticación con Firebase para SomNeteja
 */

// Elementos del DOM
let loginForm, signupForm, authSection, authenticatedSection;
let loginEmail, loginPassword, signupEmail, signupPassword, signupPasswordConfirm;
let loginBtn, signupBtn, newUserBtn, backToLoginBtn, logoutBtn;

/**
 * Inicializar elementos del DOM cuando el documento esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    checkAuthState();
});

/**
 * Inicializar referencias a elementos del DOM
 */
function initializeElements() {
    // Formularios
    loginForm = document.getElementById('loginForm');
    signupForm = document.getElementById('signupForm');
    authSection = document.getElementById('authSection');
    authenticatedSection = document.getElementById('authenticatedSection');

    // Inputs
    loginEmail = document.getElementById('loginEmail');
    loginPassword = document.getElementById('loginPassword');
    signupEmail = document.getElementById('signupEmail');
    signupPassword = document.getElementById('signupPassword');
    signupPasswordConfirm = document.getElementById('signupPasswordConfirm');

    // Botones
    loginBtn = document.getElementById('login');
    signupBtn = document.getElementById('signup');
    newUserBtn = document.getElementById('newUser');
    backToLoginBtn = document.getElementById('backToLogin');
    logoutBtn = document.getElementById('logoutBtn');
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', handleSignup);
    }
    if (newUserBtn) {
        newUserBtn.addEventListener('click', showSignupForm);
    }
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', showLoginForm);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Enter key en inputs
    if (loginEmail && loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
    if (signupPasswordConfirm) {
        signupPasswordConfirm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSignup();
        });
    }
}

/**
 * Verificar estado de autenticación
 */
function checkAuthState() {
    if (!auth) {
        console.error('Firebase Auth no está inicializado');
        return;
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuario autenticado
            showAuthenticatedUI(user);
            loadUserData(user.uid);
        } else {
            // Usuario no autenticado
            showLoginUI();
        }
    });
}

/**
 * Manejar login
 */
async function handleLogin() {
    const email = loginEmail?.value?.trim();
    const password = loginPassword?.value;

    // Validaciones
    if (!email || !password) {
        showAlert('loginAlert', 'Si us plau, completa tots els camps', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('loginAlert', 'Correu electrònic no vàlid', 'danger');
        return;
    }

    try {
        // Mostrar estado de carga
        loginBtn.disabled = true;
        loginBtn.textContent = 'Carregant...';

        // Autenticar con Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);

        showAlert('loginAlert', 'Sessió iniciada correctament!', 'success');

        // Limpiar formulario
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';

    } catch (error) {
        console.error('Error de login:', error);
        handleAuthError(error, 'loginAlert');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar';
    }
}

/**
 * Manejar signup
 */
async function handleSignup() {
    const email = signupEmail?.value?.trim();
    const password = signupPassword?.value;
    const passwordConfirm = signupPasswordConfirm?.value;

    // Validaciones
    if (!email || !password || !passwordConfirm) {
        showAlert('signupAlert', 'Si us plau, completa tots els camps', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('signupAlert', 'Correu electrònic no vàlid', 'danger');
        return;
    }

    if (password.length < 8) {
        showAlert('signupAlert', 'La contrasenya ha de tenir almenys 8 caràcters', 'danger');
        return;
    }

    if (password !== passwordConfirm) {
        showAlert('signupAlert', 'Les contrasenyes no coincideixen', 'danger');
        return;
    }

    try {
        // Mostrar estado de carga
        signupBtn.disabled = true;
        signupBtn.textContent = 'Carregant...';

        // Crear usuario con Firebase
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Crear documento de usuario en Firestore
        await createUserDocument(userCredential.user);

        showAlert('signupAlert', 'Compte creat correctament! Inicia sessió ara.', 'success');

        // Limpiar formulario
        if (signupEmail) signupEmail.value = '';
        if (signupPassword) signupPassword.value = '';
        if (signupPasswordConfirm) signupPasswordConfirm.value = '';

        // Mostrar formulario de login después de 2 segundos
        setTimeout(() => {
            showLoginForm();
        }, 2000);

    } catch (error) {
        console.error('Error de signup:', error);
        handleAuthError(error, 'signupAlert');
    } finally {
        signupBtn.disabled = false;
        signupBtn.textContent = 'Registrar';
    }
}

/**
 * Manejar logout
 */
async function handleLogout() {
    try {
        await auth.signOut();
        // El cambio de UI se manejará automáticamente en checkAuthState
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showAlert('loginAlert', 'Error al tancar la sessió', 'danger');
    }
}

/**
 * Mostrar formulario de login
 */
function showLoginForm() {
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
}

/**
 * Mostrar formulario de signup
 */
function showSignupForm() {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
}

/**
 * Mostrar UI autenticada
 */
function showAuthenticatedUI(user) {
    if (authSection) authSection.style.display = 'none';
    if (authenticatedSection) authenticatedSection.style.display = 'block';

    // Actualizar display de usuario
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(el => {
        el.textContent = user.email;
    });
}

/**
 * Mostrar UI de login
 */
function showLoginUI() {
    if (authSection) authSection.style.display = 'block';
    if (authenticatedSection) authenticatedSection.style.display = 'none';
    showLoginForm();
}

/**
 * Crear documento de usuario en Firestore
 */
async function createUserDocument(user) {
    try {
        // Inicializar puntos para nuevo usuario
        localStorage.setItem('userPoints', '0');

        // Aquí iría la lógica para guardar en Firestore
        // Por ahora, solo guardamos en localStorage
        const userData = {
            uid: user.uid,
            email: user.email,
            createdAt: new Date().toISOString(),
            points: 0,
            isPremium: false
        };

        localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));
        console.log('Documento de usuario creado:', userData);
    } catch (error) {
        console.error('Error al crear documento de usuario:', error);
    }
}

/**
 * Cargar datos del usuario
 */
async function loadUserData(uid) {
    try {
        // Aquí iría la lógica para cargar desde Firestore
        // Por ahora, cargamos desde localStorage
        const userData = localStorage.getItem(`user_${uid}`);

        if (userData) {
            const user = JSON.parse(userData);
            localStorage.setItem('userPoints', user.points || '0');
            updateUserPointsDisplay(user.points || 0);
        } else {
            // Inicializar con 0 puntos si no existe
            localStorage.setItem('userPoints', '0');
            updateUserPointsDisplay(0);
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

/**
 * Actualizar display de puntos del usuario
 */
function updateUserPointsDisplay(points) {
    const userPointsElement = document.getElementById('userPoints');
    if (userPointsElement) {
        userPointsElement.textContent = points;
    }
}

/**
 * Manejar errores de autenticación
 */
function handleAuthError(error, alertElementId) {
    let message = 'Ha ocurrido un error';

    switch (error.code) {
        case 'auth/invalid-email':
            message = 'Correu electrònic no vàlid';
            break;
        case 'auth/user-disabled':
            message = 'Compte desactivat';
            break;
        case 'auth/user-not-found':
            message = 'Usuari no trobat';
            break;
        case 'auth/wrong-password':
            message = 'Contrasenya incorrecta';
            break;
        case 'auth/email-already-in-use':
            message = 'Correu electrònic ja registrat';
            break;
        case 'auth/operation-not-allowed':
            message = 'Operació no permesa';
            break;
        case 'auth/weak-password':
            message = 'Contrasenya massa feble';
            break;
        default:
            message = error.message || 'Error desconegut';
    }

    showAlert(alertElementId, message, 'danger');
}

/**
 * Validar email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Mostrar alerta
 */
function showAlert(elementId, message, type = 'info') {
    const alertElement = document.getElementById(elementId);

    if (!alertElement) {
        console.error(`Elemento de alerta no encontrado: ${elementId}`);
        return;
    }

    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.display = 'block';

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        handleSignup,
        handleLogout,
        checkAuthState,
        showAuthenticatedUI,
        showLoginUI
    };
}
