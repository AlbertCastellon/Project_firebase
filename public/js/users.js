// Referència a la col·lecció "items" de Firestore
const users = db.collection("usuaris");

/**
 * Afegeix un nou document a la col·lecció.
 * @param {Object} doc - Objecte amb les propietats del nou ítem.
 */
async function addUser(doc, extraData) {
    try {
        // Esperem que Firebase afegeixi el document
        await users.doc(doc.uid).set({
            id: doc.uid,
            email: doc.email,
            telefon: extraData.telefon,
            nom: extraData.nom,
            cognom: extraData.cognom,
            punts: 0,
            rol: false
        });
        // Recàrrega la llista d'ítems per a mostrar el nou element
        await loadUsers();

        // Neteja el formulari
        document.getElementById("email").value = "";
        document.getElementById("telefon").value = "";

        // Mostra un missatge d'èxit
        console.log("Usuario creado correctamente");
        showAlert("Element guardat correctament", "alert-success");
    } catch (error) {
        // En cas d'error, mostra un missatge d'error
        console.error("Error guardando usuario:", error);
        showAlert("Error al intentar guardar l'element", "alert-danger");
    }
}

/**
 * Elimina un document per ID.
 * @param {string} id - ID del document a eliminar.
 */
async function deleteUser(id) {
    try {
        // Esperem que Firebase elimini el document
        await deleteById(users, id);

        // Recàrrega la llista per reflectir l'eliminació
        await loadUsers();

        // Missatge d'èxit
        showAlert("Element eliminat correctament", "alert-success");
    } catch (error) {
        // Missatge d'error en cas de problema
        showAlert("Error al intentar eliminar l'element", "alert-danger");
    }
}

/**
 * Carrega les dades d'un document per editar.
 * @param {string} id - ID del document que volem editar.
 */
async function editUser(id) {
    try {
        // Emmagatzema temporalment l'ID en un camp ocult del formulari
        document.getElementById("elementId").value = id;

        // Esperem la lectura del document de Firestore
        const doc = await selectById(users, id);
        const data = doc.data();

        const { email, telefon, punts, rol } = doc.data();
        document.getElementById("email").value = email;
        document.getElementById("telefon").value = telefon || "";
    } catch (error) {
        // Si falla la lectura, mostra un error
        showAlert("Error al intentar editar l'element", "alert-danger");
    }
}

/**
 * Recupera tots els documents i els mostra en una taula.
 */
async function loadUsers() {
    try {
        // Obtenim l'array de documents des de Firestore
        const arrayItems = await selectAll(users);

        // Capçalera de la taula
        const table = document.getElementById("listItems");
        table.innerHTML = `
        <tr>
            <th>Email</th>
            <th>Telèfon</th>
            <th>Punts</th>
            <th>Rol</th>
            <th>Accions</th>
        </tr>
        `;

        // Iterem cada document i construïm una fila per a la taula
        arrayItems.forEach((doc) => {
            const { email, telefon, punts, rol } = doc.data();
            table.innerHTML += `
            <tr>
                <td>${email}</td>
                <td>${telefon || ""}</td>
                <td>${punts}</td>
                <td>
                <button type="button" class="btn btn-danger float-right" onclick="deleteUser('${doc.id}')">
                    Eliminar
                </button>
                <button type="button" class="btn btn-primary mr-2 float-right" onclick="editUser('${doc.id}')">
                    Editar
                </button>
                </td>
            </tr>
            `;
        });
    } catch (error) {
        // Error mostrant la taula
        showAlert("Error al mostrar els elements", "alert-danger");
    }
}

/**
 * Actualitza un document existent.
 * @param {string} id - ID del document a actualitzar.
 * @param {Object} doc - Objecte amb les noves dades.
 */
async function updateUser(id, doc) {
    try {
        // Esperem que Firebase actualitzi el document
        await updateById(users, id, doc);

        // Recàrrega la llista per mostrar l'actualització
        await loadUsers();

        // Neteja el formulari i l'ID ocult
        document.getElementById("elementId").value = "";
        document.getElementById("email").value = "";
        document.getElementById("telefon").value = "";
        // Missatge d'èxit
        showAlert("Element actualitzat correctament", "alert-success");
    } catch (error) {
        // Missatge d'error si no es pot actualitzar
        showAlert("Error al intentar actualitzar l'element", "alert-danger");
    }
}