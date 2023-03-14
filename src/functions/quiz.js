import Swal from "sweetalert2";

/**
 * Fetch l'api pour supprimer les données du quiz puis appelle le callback
 * @param {Object} quiz
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function removeQuizStatistics(quiz, callback) {
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer les statistiques du quiz #${quiz.id} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer ces statistiques",
      cancelButtonText: "Annuler"
   }).then(async (result) => {
      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {

         //TODO fetch l'api
         callback();
      }
   });
}