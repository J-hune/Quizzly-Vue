import Swal from "sweetalert2";

/**
 * Modifie une étiquette existante dans la base de données.
 * @param {Object} label - L'étiquette à modifier.
 * @param {Function} callback - La fonction de rappel à exécuter une fois l'opération terminée.
 */
export async function editLabel(label, callback) {
   // On envoie une requête POST à l'API pour modifier l'étiquette
   const response = await fetch(process.env.VUE_APP_API_URL + "/labels/editLabel", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(label)
   });

   // On récupère les données de la réponse
   const data = await response.json();

   // On appelle la fonction de rappel avec les données retournées par l'API
   callback(data);
}

/**
 * Supprime une étiquette de la base de données.
 * @param {Object} label - L'étiquette à supprimer.
 * @param {Object} toast - L'objet toast pour afficher des messages à l'utilisateur.
 * @param {Function} deleteCallback - La fonction de rappel à exécuter une fois l'étiquette supprimée.
 */
export async function deleteLabel(label, toast, deleteCallback) {
   // On affiche une boîte de dialogue pour demander confirmation à l'utilisateur
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer l'étiquette "${label.nom}" ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer cette étiquette",
      cancelButtonText: "Annuler"
   }).then(async (result) => {
      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {

         // On envoie une requête GET à l'API pour supprimer l'étiquette
         const response = await fetch(process.env.VUE_APP_API_URL + "/labels/deleteLabel/" + label.id, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            }
         });

         const data = await response.json();

         // Si l'étiquette a été supprimée avec succès
         if (data.success) {
            // On appelle la fonction de rappel pour mettre à jour l'affichage
            deleteCallback();

            // On affiche un message de succès à l'utilisateur
            toast.success("L'étiquette a été supprimée");
         } else {
            // Sinon, on affiche un message d'erreur à l'utilisateur
            toast.error("L'étiquette n'a pas pu être supprimée, vérifiez qu'elle n'est pas utilisée");
         }
      }
   });
}