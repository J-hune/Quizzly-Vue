import Swal from "sweetalert2";

/**
 * Fetch l'api pour ajouter une séquence puis appelle le callback
 * @async
 * @param {Object} sequence
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function addSequence(sequence, callback) {
   // Envoi de la requête au serveur avec la méthode POST
   const response = await fetch(process.env.VUE_APP_API_URL + "/sequences/addSequence", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({titre: sequence.title, questions: sequence.questions})
   });

   const data = await response.json();
   callback(data);
}

/**
 * Fetch l'api pour modifier une séquence puis appelle le callback
 * @async
 * @param {Object} sequence
 * @param {String} id
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function editSequence(sequence, id, callback) {
   // Envoi de la requête au serveur avec la méthode POST
   const response = await fetch(process.env.VUE_APP_API_URL + "/sequences/editSequence/" + id, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({titre: sequence.title, questions: sequence.questions})
   });

   const data = await response.json();
   callback(data);
}

/**
 * Fetch l'api pour supprimer une séquence puis appelle le callback
 * @async
 * @param {String} id
 * @param {*} toast
 * @param {function} deleteCallback
 * @return {Promise<void>}
 */
export async function deleteSequence(id, toast, deleteCallback) {
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer la séquence ${id} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer cette séquence",
      cancelButtonText: "Annuler"
   }).then(async (result) => {
      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {

         // On fetch l'API pour supprimer la séquence
         const response = await fetch(process.env.VUE_APP_API_URL + "/sequences/removeSequence/" + id, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
         });

         const data = await response.json();

         // On avertit l'utilisateur du status de la requête
         if (data.success) {
            deleteCallback()
            toast.success("La séquence a été supprimée")
         } else toast.error("La séquence n'a pas pu être supprimée")
      }
   })
}

/**
 * Gère l'interaction avec une séquence pédagogique identifiée par son ID.
 * @async
 * @param {number} id - L'identifiant de la séquence pédagogique.
 * @param {object} router - L'objet routeur de Vue.js pour la navigation.
 * @param {object} toast - L'objet toast pour l'affichage de messages.
 * @param {Function} deleteCallback - La fonction de rappel à appeler après la suppression de la séquence.
 * @returns {Promise<void>} Une promesse résolue lorsque l'interaction est terminée.
 */
export async function sequenceInteraction(id, router, toast, deleteCallback) {
   Swal.fire({
      icon: "question",
      title: "Séquence #" + id,
      text: "Vous pouvez lancer cette séquence pédagogique, la modifier ou la supprimer. Que souhaitez vous faire ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Démarrer",
      denyButtonText: "Modifier",
      cancelButtonText: "Supprimer",
      confirmButtonColor: "#A56CC1",
      denyButtonColor: "#3f51b5",
      cancelButtonColor: "#d9534f"
   }).then(async (result) => {
      // Si l'utilisateur veut démarrer la séquence
      if (result.isConfirmed) {
         console.log("Start sequence #" + id)
      }

      // Si l'utilisateur veut modifier la séquence
      else if (result.isDenied) {
         router.push("/sequence/" + id + "/edit");
      }

      /*
       * On détourne l'utilisation du bouton "Cancel"
       * Si l'utilisateur veut supprimer la séquence
       */
      else if (result.isDismissed && result.dismiss === "cancel") {
         await deleteSequence(id, toast, deleteCallback)
      }
   })
}