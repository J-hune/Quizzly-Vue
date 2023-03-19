/*
 * Cette directive permet de détecter un clic en dehors de l'élément
 * Et d'appeler une méthode lorsqu'un tel clic est détecté.
 *
 * Cette directive a été trouvée sur le stackoverflow suivant :
 * https://stackoverflow.com/questions/36170425/detect-click-outside-element
 */
export default {
   /**
    * La directive est appelée avant que l'élément soit inséré dans le DOM.
    * @param {HTMLElement} el - L'élément sur lequel la directive est appliquée.
    * @param {Object} binding - L'objet de liaison contenant la méthode à appeler.
    */
   beforeMount: (el, binding) => {
      el.clickOutsideEvent = event => {
         // Ici, on vérifie si le clic a été effectué en dehors de l'élément et de ses enfants.
         if (!(el === event.target || el.contains(event.target))) {
            // Si c'est le cas, on appelle la méthode fournie dans la valeur de l'attribut.
            binding.value();
         }
      };

      // On ajoute un écouteur d'événement au document pour détecter les clics en dehors de l'élément.
      document.addEventListener("click", el.clickOutsideEvent);
   },

   /**
    * La directive est appelée lorsque l'élément est supprimé du DOM.
    * @param {HTMLElement} el - L'élément sur lequel la directive est appliquée.
    */
   unmounted: el => {
      // On supprime l'écouteur d'événement du document.
      document.removeEventListener("click", el.clickOutsideEvent);
   }
};