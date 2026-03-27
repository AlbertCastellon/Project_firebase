// 1. Definimos el objeto de configuración PRIMERO
const firebaseConfig = {
    apiKey: "AIzaSyAj5lwXkG44xdTTzaUrSkjErftTVHlFc0g",
    authDomain: "somneteja.firebaseapp.com",
    projectId: "somneteja",
    storageBucket: "somneteja.firebasestorage.app",
    messagingSenderId: "154596735768",
    appId: "1:154596735768:web:bb757c48e3f92356047c6d"
};

// 2. Inicializamos Firebase una sola vez con seguridad
let auth, db;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase inicialitzat correctament');
    }
    // 3. Obtenemos las referencias a los servicios
    auth = firebase.auth();
    db = firebase.firestore();
} catch (error) {
    console.error('Error al inicialitzar Firebase:', error);
}

// Configuración de la aplicación (Resto de tu código intacto)
const APP_CONFIG = {
    appName: 'SomNeteja',
    company: 'Impuls Net',
    version: '1.0.0',
    supportEmail: 'info@impulnet.cat',
    points: {
        perJourney: 100,
        premiumBonus: 1.5,
        maxPointsPerDay: 500
    },
    premium: {
        price: 11,
        currency: 'EUR',
        benefits: [
            'Productos premium',
            'Descuentos 20%',
            'Puntos bonus 50%',
            'Prioridad en jornadas',
            'Regalos exclusivos'
        ]
    },
    products: {
        maxQuantityPerOrder: 10,
        shippingDays: '5-7'
    }
};

function getConfig() { return APP_CONFIG; }

// Exportar si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, auth, db, APP_CONFIG };
}