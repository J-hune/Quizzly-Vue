import { fetchData } from "@/functions/fetch";
import Swal from "sweetalert2";

/**
 * Supprime tous les étudiants
 * @param toast
 * @param {function} callback
 * @return {void}
 */
export async function removeAllStudents(toast, callback) {
   // On affiche un popup pour que l'utilisateur confirme la suppression
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer tous les étudiants ? Attention, cette action est irréversible`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer tous les étudiants",
      cancelButtonText: "Annuler"
   }).then(async (result) => {
      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {
         // On appelle l'api pour supprimer tous les étudiants
         const { data } = await fetchData("/students/removeAllStudent/");
         if (data.success) {
            toast.success("Tous les étudiants ont été supprimés");
            callback();
         } else {
            toast.error("Les étudiants n'ont pas pu être supprimés");
         }
      }
   });
}

/**
 * Supprime un étudiant spécifique
 * @param student
 * @param toast
 * @param {function} callback
 * @return {void}
 */
export async function removeStudent(student, toast, callback) {
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer tous les étudiants ? Attention, cette action est irréversible`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer tous les étudiants",
      cancelButtonText: "Annuler"
   }).then(async (result) => {

      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {
         // On appelle l'api pour supprimer l'étudiant spécifié
         const { data } = await fetchData("/students/removeStudent/" + student.id);
         if (data.success) {
            toast.success(`L'étudiant ${student.id}: ${student.prenom} ${student.nom} a été supprimé`);
            callback();
         } else {
            toast.error("L'étudiant n'a pas pu être supprimé");
         }
      }
   });
}
