/**
 * Retourne vrai si la chaine ne contient aucun caractère spécial
 * @param {string} string
 * @return {boolean}
 */
export function onlyAlphabetAndAccents(string) {
  const format = /^[a-zA-Z\u00C0-\u00FF]*$/;
  return format.test(string)
}