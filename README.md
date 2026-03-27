# Project_firebase# 🌱 Projecte SomNeteja

## 📌 Descripció general

SomNeteja és una aplicació web orientada a la gestió d’usuaris i a l’organització de jornades de neteja en diferents comarques. L’objectiu principal és fomentar la col·laboració ciutadana permetent que els usuaris participin en activitats mediambientals.

L’aplicació utilitza **Firebase** com a backend, concretament:

**Firebase Authentication** → gestió d’usuaris
**Cloud Firestore** → emmagatzematge de dades en temps real

---

## 👤 Sistema d’usuaris

### Funcionalitats implementades

Registre de nous usuaris
Inici de sessió (login)
Emmagatzematge de dades addicionals:

  * Nom
  * Cognoms
  * Telèfon
  * Punts (inicialment 0)
  * Rol (usuari/admin)

### Detalls tècnics

Els usuaris es guarden a la col·lecció usuaris
L’ID del document coincideix amb el uid de Firebase Auth
S’utilitza autenticació amb correu electrònic i contrasenya

---

## 🛍️ Gestió de productes

### Funcionalitats

Crear nous productes (per usuarisadmin)
Editar productes existents (per usuarisadmin)
Eliminar productes (per usuarisadmin)
Mostrar la llista en temps real

### Característiques tècniques

Ús de funcions reutilitzables (addItem, updateItem, etc.)
Renderització dinàmica en taules HTML
Actualització automàtica amb Firestore

---

## 🗺️ Sistema de comarques (Grups geogràfics)

### Objectiu

Permetre que els usuaris s’uneixin o surtin de grups segons la comarca on volen col·laborar.

### Funcionalitats implementades

Mostrar el llistat de comarques
Unir-se a un grup
Sortir d’un grup
Actualització en temps real

### Estructura de dades

Col·lecció: Grups_geografics

Camps principals:

comarca (string)
grupo_whatsapp (array de userId)

### Funcionament

S’utilitza onSnapshot() per escoltar canvis en temps real
Es comprova si l’usuari està dins del grup:

 
js
  data.grupo_whatsapp?.includes(userId)
 
Botons dinàmics:

  * **Unir-se** → afegeix l’usuari a l’array
  * **Sortir** → elimina l’usuari de l’array

---

## 📅 Gestió de jornades

### Objectiu

Registrar activitats de neteja realitzades pels usuaris.

### Estructura de dades

Cada jornada conté:

completada (boolean)
data (timestamp)
kg_recollits (number)
zona (string)

### Funcionalitat clau implementada

Obtenir totes les jornades des de Firestore
Lectura de dades en temps real o sota demanda

Exemple de funció:
js
async function loadJornades() {
  try {
    const snapshot = await db.collection("jornades").get();

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(data);
    });

  } catch (error) {
    console.error("Error carregant jornades:", error);
  }
}

---

## 🚀 Estat actual del projecte

✅ Autenticació funcional
✅ Gestió d’usuaris
✅ CRUD de productes
✅ Sistema de comarques operatiu
✅ Unió/sortida de grups en temps real
✅ Base per a la gestió de jornades

---

## 🔮 Possibles millores futures

Interfície més intuïtiva
Panell d’administració
Sistema de punts per participació
Visualització d’estadístiques (kg recollits, participació, etc.)
Filtres per zona o data en jornades
Productes nomes puguin ser modificats per admin

---

## 💡 Conclusió

El projecte SomNeteja ja disposa d’una base sòlida i funcional:

Gestió completa d’usuaris
Interacció social mitjançant comarques
Preparat per escalar cap a un sistema d’impacte ambiental real

És una aplicació amb molt potencial tant a nivell tècnic com social 🌍