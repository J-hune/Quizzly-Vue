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

   const response = await fetch(process.env.VUE_APP_API_URL + "/students/insertStudents", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
   });

   const responseData = await response.json();
   if (responseData.success) {
      toast.success(responseData.result + " étudiants ont été ajoutés");
   } else {
      toast.error("Une erreur a eu lieu lors de l'ajout des étudiants");
   }
}


/**
 * Parse un contenu csv
 * @param {String} csv
 * @return {Promise<*[]>}
 */
async function csvParser(csv) {
   let lines = csv.split("\n");
   let result = [];

   // On détermine le séparateur en comptant le nombre de virgules et de points-virgules dans la première ligne
   let firstLine = lines[0].replace(/\r/g, "");
   let numCommas = (firstLine.match(/,/g) || []).length;
   let numSemicolons = (firstLine.match(/;/g) || []).length;
   let separator = numSemicolons > numCommas ? ";" : ",";

   // On sépare les en-têtes
   let headers = firstLine.split(separator);

   // Pour chaque ligne sauf la première
   for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentLine = lines[i].replace(/\r/g, "").split(separator);

      // Si la ligne est vide, on l'ignore
      if (currentLine.length === 1 && currentLine[0] === "") {
         continue;
      }

      // Pour chaque colonne en utilisant la virgule comme séparateur
      for (let j = 0; j < headers.length; j++) {
         obj[headers[j]] = currentLine[j];

      }

      result.push(obj);
   }

   return result;
}