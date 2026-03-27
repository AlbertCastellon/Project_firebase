// Referència a la col·lecció de Firestore (Nom exacto de tu base de datos)
const comarques = db.collection("Grups_geografics");

/**
 * Actualitza un document existent (Tu función original)
 */
async function updateComarca(id, doc) {
    try {
        await comarques.doc(id).update(doc);
        await loadComarques();
        document.getElementById("elementId").value = "";
        document.getElementById("comarca").value = "";
        // Si usas una función showAlert, asegúrate de que esté definida en el index
        if (typeof showAlert === "function") showAlert("Element actualitzat correctament", "alert-success");
    } catch (error) {
        if (typeof showAlert === "function") showAlert("Error al intentar actualitzar l'element", "alert-danger");
    }
}

/**
 * Carrega les comarques a la taula
 */
function loadComarques() {
    const table = document.getElementById("listComarques");
    table.style.display = "table"; // <--- Tu petición de mostrar la tabla

    comarques.onSnapshot(snapshot => {
        let html = `
      <thead>
        <tr>
          <th>Comarca</th>
          <th>Acció</th>
        </tr>
      </thead>
      <tbody>
    `;

        snapshot.forEach(doc => {
            const data = doc.data();
            // Usamos userId que viene global del index.html
            const usersInGroup = data.grupo_whatsapp || [];
            const isUserInGroup = usersInGroup.includes(userId);

            html += `
        <tr>
          <td>${data.comarca}</td>
          <td>
            ${isUserInGroup
                    ? `<button class="btn btn-danger btn-sm" onclick="leaveGroup('${doc.id}')">Sortir</button>`
                    : `<button class="btn btn-success btn-sm" onclick="joinGroup('${doc.id}')">Unir-se</button>`
                }
          </td>
        </tr>
      `;
        });

        html += "</tbody>";
        table.innerHTML = html;
    });
}

/**
 * Funció per unirse al grup (Tu lógica original)
 */
async function joinGroup(groupId) {
    if (!userId) return alert("Inicia sessió primer");
    try {
        const docRef = comarques.doc(groupId);
        const docSnap = await docRef.get();

        let users = docSnap.data().grupo_whatsapp || [];

        if (!users.includes(userId)) {
            users.push(userId);
        }

        await docRef.update({
            grupo_whatsapp: users
        });

    } catch (error) {
        console.error("Error join:", error);
    }
}

/**
 * Funció per sortir del grup (Tu lógica original)
 */
async function leaveGroup(groupId) {
    if (!userId) return;
    try {
        const docRef = comarques.doc(groupId);
        const docSnap = await docRef.get();

        let users = docSnap.data().grupo_whatsapp || [];

        // Filtramos para quitar al usuario actual
        users = users.filter(id => id !== userId);

        await docRef.update({
            grupo_whatsapp: users
        });

    } catch (error) {
        console.error("Error leave:", error);
    }
}