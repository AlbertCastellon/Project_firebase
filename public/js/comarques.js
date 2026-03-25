// Referència a la col·lecció "items" de Firestore
const comarques = db.collection("Grups_geografics");

/**
 * Actualitza un document existent.
 * @param {string} id - ID del document a actualitzar.
 * @param {Object} doc - Objecte amb les noves dades.
 */
async function updateComarca(id, doc) {
  try {
    // Esperem que Firebase actualitzi el document
    await updateById(comarques, id, doc);

    // Recàrrega la llista per mostrar l'actualització
    await loadComarques();

    // Neteja el formulari i l'ID ocult
    document.getElementById("elementId").value = "";
    document.getElementById("comarca").value = "";

    // Missatge d'èxit
    showAlert("Element actualitzat correctament", "alert-success");
  } catch (error) {
    // Missatge d'error si no es pot actualitzar
    showAlert("Error al intentar actualitzar l'element", "alert-danger");
  }
}

function loadComarques() {
    const table = document.getElementById("listComarques");
    table.style.display = "table"; // <--- mostrar tabla
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
      const isUserInGroup = data.grupo_whatsapp?.includes(userId);

      html += `
        <tr>
          <td>${data.comarca}</td>
          <td>
            ${
              isUserInGroup
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

async function joinGroup(groupId) {
  try {
    await comarques.doc(groupId).update({
      grupo_whatsapp: firebase.firestore.FieldValue.arrayUnion(userId)
    });

  } catch (error) {
    console.error(error);
  }
}

async function leaveGroup(groupId) {
  try {
    await comarques.doc(groupId).update({
      grupo_whatsapp: firebase.firestore.FieldValue.arrayRemove(userId)
    });

  } catch (error) {
    console.error(error);
  }
}