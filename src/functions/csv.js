/**
 * Appelle l'api pour ajouter les étudiants en paramètre (csv) :
 * - Transforme le csv en JSON avec la fonction csvParser
 * - Vérifie la validité des données
 * - Appelle la route appropriée avec les données en POST
 * @param {String} csv
 * @param {Object} toast
 */
export async function addStudentsFromCSV(csv, toast) {
   const data = await csvParser(csv);

   // On vérifie que les données sont valides
   if (data.find(e => !e.id || !e.nom || !e.prenom)) {
      return toast.error("Le Fichier CSV est Invalide");
   }

   console.log("Route pour ajouter les étudiants avec le json")
   //TODO appel route avec post
}


/**
 * Parse un contenu csv
 * @param {String} csv
 * @return {Promise<*[]>}
 */
async function csvParser(csv) {
   let lines = csv.split("\n");
   let result = [];

   // On sépare les en-têtes
   let headers = lines[0].replace(/\r/g, "").split(",");

   // Pour chaque ligne sauf la première
   for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].replace(/\r/g, "").split(",");

      // Pour chaque colonne en utilisant la virgule comme séparateur
      for (let j = 0; j < headers.length; j++) {
         obj[headers[j]] = currentline[j];
      }

      result.push(obj);
   }

   return result;
}