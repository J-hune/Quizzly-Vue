import Swal from "sweetalert2";
import { fetchData } from "@/functions/fetch";

/**
 * Fetch l'api pour supprimer les données du quiz puis appelle le callback
 * @param {Object} quiz
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function removeQuizStatistics(quiz, callback) {
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer les statistiques du quiz #${quiz.code} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer ces statistiques",
      cancelButtonText: "Annuler"
   }).then(async (result) => {
      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {

         // On fetch l'API pour supprimer la diffusion
         const { data } = await fetchData("/statistics/teachers/removeDiffusion/" + quiz.id);
         callback(data);
      }
   });
}