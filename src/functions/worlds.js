import pluralize from "rosaenlg-pluralize-fr";

/**
 * Vérifie si un mot est présent dans un tableau en comparant
 * chaque élément en ignorant les accents et la casse.
 * Gère les erreurs de frappe et les formes plurielles/singulières.
 *
 * @param {string} word - Le mot à chercher.
 * @param {Array<string>} array - Le tableau à vérifier.
 * @returns {string | null} le mot trouvé si le mot est dans le tableau, sinon null.
 */
export function findInArray(word, array) {
   // Nettoie le mot de recherche en le mettant en minuscules
   const cleanedWord = word.toLowerCase();

   // Initialise un objet pour stocker les mots du tableau regroupés par proximité
   const groupedWords = {};

   // Parcourt tous les éléments du tableau
   for (const item of array) {

      // Nettoie l'élément du tableau en le mettant en minuscules
      const cleanedItem = item.toLowerCase();

      // Calcule la distance de Levenshtein entre les formes plurielles/singulières du mot cherché et de l'élément courant du tableau
      const distance = levenshteinDistance(pluralize(cleanedWord), pluralize(cleanedItem));

      // Si la distance de Levenshtein est inférieure ou égale à 1, cela signifie que le mot cherché et l'élément courant sont similaires
      if (distance <= 1) {
         groupedWords[cleanedWord] ??= [];
         groupedWords[cleanedWord].push(pluralize(item));
      }
   }

   // Récupère le groupe associé au mot cherché
   const groupedWord = groupedWords[cleanedWord];

   if (groupedWord) {

      // Si un groupe a été trouvé, cela signifie qu'un mot similaire a été trouvé, renvoie le premier mot du groupe présent dans le tableau
      const foundItem = array.find(item => groupedWord.includes(pluralize(item)));
      return foundItem || null;
   }

   // Aucun groupe trouvé, recherche le mot de base tel quel dans le tableau
   const foundItem = array.find(item => item.toLowerCase() === cleanedWord);
   return foundItem || null;
}


/**
 * Trouve le mot le plus présent dans un tableau en utilisant la distance de Levenshtein pour gérer les erreurs de frappe.
 * La fonction détermine si le mot le plus présent est au singulier ou au pluriel en fonction de ce qui est le plus fréquent dans le tableau.
 *
 * @param {Array<string>} array - Le tableau dans lequel chercher le mot le plus présent.
 * @returns {string | null} Le mot le plus présent au singulier ou au pluriel, ou null si le tableau est vide.
 */
export function findMostFrequentWord(array) {
   const wordCount = {};
   let maxCount = 0;
   let mostFrequentWord = "";

   // On parcourt chaque mot du tableau
   array.forEach((word) => {

      // On incrémente le nombre de fois que le mot a été rencontré
      let count = (wordCount[word] || 0) + 1;
      wordCount[word] = count;

      // Si le mot courant a été rencontré plus de fois que le mot le plus fréquent précédent,
      if (count > maxCount) {
         maxCount = count;
         mostFrequentWord = word;
      }

      // Si le mot courant a été rencontré le même nombre de fois que le mot le plus fréquent précédent,
      else if (count === maxCount && levenshteinDistance(word, mostFrequentWord) < 2) {
         mostFrequentWord = word;
      }
   });

   // On détermine si le mot le plus fréquent est au singulier ou au pluriel
   const isPlural = mostFrequentWord.endsWith("s");

   // On utilise la fonction de pluralisation appropriée en fonction de si le mot le plus fréquent est au singulier ou au pluriel
   if (isPlural) {
      return pluralize(mostFrequentWord);
   } else {
      return mostFrequentWord.toLowerCase();
   }
}


/**
 * Calcule la distance de Levenshtein entre deux chaînes de caractères.
 * @param {string} a - La première chaîne de caractères.
 * @param {string} b - La seconde chaîne de caractères.
 * @return {number} La distance de Levenshtein entre les deux chaînes de caractères.
 */
function levenshteinDistance(a, b) {
   // Conversion des chaînes de caractères en tableaux de caractères.
   const aChars = a.split("");
   const bChars = b.split("");

   // Initialisation de la matrice de distances.
   const distances = [];
   for (let i = 0; i <= aChars.length; i++) {
      distances[i] = [i];
      for (let j = 1; j <= bChars.length; j++) {
         distances[i][j] = i === 0 ? j : 0;
      }
   }
   for (let j = 1; j <= bChars.length; j++) {
      distances[0][j] = j;
   }

   // Calcul des distances entre les caractères.
   for (let j = 1; j <= bChars.length; j++) {
      for (let i = 1; i <= aChars.length; i++) {
         if (aChars[i - 1] === bChars[j - 1]) {
            distances[i][j] = distances[i - 1][j - 1];
         } else {
            distances[i][j] = Math.min(
               distances[i - 1][j] + 1, // Suppression
               distances[i][j - 1] + 1, // Insertion
               distances[i - 1][j - 1] + 1 // Substitution
            );
         }
      }
   }

   // On retourne la distance de Levenshtein.
   return distances[aChars.length][bChars.length];
}