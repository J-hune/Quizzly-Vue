/**
 * Retourne un mot en PascalCase
 * @param {string} string Phrase ou mot
 * @return {string}
 */
export function pascalCase(string) {
  // On split à chaque espace
  // Pour chaque mot on transforme le 1 char en upperCase et le reste en lowerCase
  return string.replace(/\w+/g,
    word => word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
}

/**
 * Retourne vrai si la chaine ne contient aucun caractère spécial
 * @param {string} string
 * @return {boolean}
 */
export function onlyAlphabetAndAccents(string) {
  const format = /^[a-zA-Z\u00C0-\u00FF]*$/;
  return format.test(string)
}