// Referència a la col·lecció "jornades" de Firestore
const colJornades = db.collection("jornades");

/**
 * Recupera tots els documents i els mostra com a targetes (cards).
 */
function loadJornades() {
    const container = document.getElementById("jornades-container");
    console.log(container)

    // Escolta canvis en temps real
    colJornades.onSnapshot(snapshot => {
        let html = ""; // Buidem el contingut previ

        snapshot.forEach(doc => {
            const data = doc.data();

            // Convertir timestamp a data llegible
            const fecha = data.data
                ? new Date(data.data.seconds * 1000).toLocaleDateString('ca-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
                : "Properament";

            // Hora i Punts (amb valors per defecte si no existeixen)
            const hora = data.hora || "10:00h";
            const punts = data.punts || 50;
            const desc = data.descripcio || "Jornada de neteja col·lectiva per millorar el nostre entorn.";
                console.log(data)
            // Generem el contingut del recuandre (Card)
            html += `
                <div class="product-card">
                    <div class="product-info">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                            <span class="badge-points" style="background: var(--color-vibrante); color: var(--color-bosque); padding: 5px 10px; border-radius: 8px; font-weight: 800;">
                                +${punts} pts
                            </span>
                            <span style="font-size: 0.85rem; font-weight: bold; color: var(--color-bosque-claro);">${data.completada ? "✅ Finalitzada" : "📅 Programada"}</span>
                        </div>
                        
                        <h3 class="product-name" style="margin-bottom: 5px;">${data.zona}</h3>
                        <p style="font-size: 0.9rem; color: #555; margin-bottom: 10px;">
                            <strong>Data:</strong> ${fecha}<br>
                            <strong>Hora:</strong> ${hora}
                        </p>
                        
                        <p class="product-description" style="min-height: 60px;">${desc}</p>
                        
                        <button class="btn-add-cart" style="width: 100%; margin-top: 15px;" onclick="alert('T\'has apuntat a la jornada de ${data.zona}!')">
                            Apuntar-m'hi
                        </button>
                    </div>
                </div>
            `;
        });

        // Injectem tot el HTML generat al contenidor del teu HTML
        container.innerHTML = html;
    });
}

// Executem la funció en carregar la pàgina
window.addEventListener("load", (event) => {
  loadJornades();
  console.log(true)
});