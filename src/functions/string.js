/**
 * Retourne vrai si la chaine ne contient aucun caractère spécial
 * @param {string} string
 * @return {boolean}
 */
export function onlyAlphabetAndAccents(string) {
  const regex = new RegExp("^[a-zA-ZÀ-ÿ-]*$");
  return regex.test(string)
}