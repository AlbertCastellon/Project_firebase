// Referència a la col·lecció "productes" de Firestore
const products = db.collection("productes");

/**
 * Afegeix un nou document a la col·lecció.
 * @param {Object} doc - Objecte amb les propietats del nou ítem.
 */
async function addProduct(doc) {
  try {
    // Esperem que Firebase afegeixi el document
    await add(products, doc);

    // Recàrrega la llista d'ítems per a mostrar el nou element
    await loadProducts();

    // Neteja el formulari
    document.getElementById("sponsor").value = "";
    document.getElementById("tipus").value = "";
    document.getElementById("descripcio").value = "";

    // Mostra un missatge d'èxit
    showAlert("Element guardat correctament", "alert-success");
  } catch (error) {
    // En cas d'error, mostra un missatge d'error
    showAlert("Error al intentar guardar l'element", "alert-danger");
  }
}

/**
 * Elimina un document per ID.
 * @param {string} id - ID del document a eliminar.
 */
async function deleteProduct(id) {
  try {
    // Esperem que Firebase elimini el document
    await deleteById(products, id);

    // Recàrrega la llista per reflectir l'eliminació
    await loadProducts();

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
async function editProduct(id) {
  try {
    // Emmagatzema temporalment l'ID en un camp ocult del formulari
    document.getElementById("elementId").value = id;

    // Esperem la lectura del document de Firestore
    const doc = await selectById(items, id);
    const data = doc.data();

    // Omple el formulari amb les dades actuals
    document.getElementById("sponsor").value = data.sponsor;
    document.getElementById("tipus").value = data.tipus;
    document.getElementById("descripcio").value = data.descricio
  } catch (error) {
    // Si falla la lectura, mostra un error
    showAlert("Error al intentar editar l'element", "alert-danger");
  }
}

/**
 * Recupera tots els documents i els mostra en una taula.
 */
async function loadProducts() {
  try {
    // Obtenim l'array de documents des de Firestore
    const arrayItems = await selectAll(products);
    console.log(arrayItems)

    // Capçalera de la taula
    const table = document.getElementById("listProducts");
    table.innerHTML = `
      <tr>
        <th>Sponsor</th>
        <th>Tipus de producte</th>
        <th>Descripció</th>
        <th></th>
      </tr>
    `;

    // Iterem cada document i construïm una fila per a la taula
    arrayItems.forEach((doc) => {
      const { sponsor, tipus_producte, description } = doc.data();
      console.log(doc.id)
      table.innerHTML += `
        <tr>
          <td>${sponsor}</td>
          <td>${tipus_producte}</td>
          <td>${description}</td>
          <td>
            <button type="button" class="btn btn-danger float-right" onclick="deleteItem('${doc.id}')">
              Eliminar
            </button>
            <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${doc.id}')">
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
async function updateProduct(id, doc) {
  try {
    // Esperem que Firebase actualitzi el document
    await updateById(products, id, doc);

    // Recàrrega la llista per mostrar l'actualització
    await loadProducts();

    // Neteja el formulari i l'ID ocult
    document.getElementById("elementId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    // Missatge d'èxit
    showAlert("Element actualitzat correctament", "alert-success");
  } catch (error) {
    // Missatge d'error si no es pot actualitzar
    showAlert("Error al intentar actualitzar l'element", "alert-danger");
  }
}