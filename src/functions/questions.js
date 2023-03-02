import Swal from "sweetalert2";

/**
 * Fetch l'api pour ajouter une question puis appelle le callback
 * @param {Object} question
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function addQuestion(question, callback) {
   const response = await fetch(process.env.VUE_APP_API_URL + "/questions/addQuestion", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(question)
   });

   const data = await response.json();
   callback(data);
}

/**
 * Fetch l'api pour modifier une question puis appelle le callback
 * @param {Object} question
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function editQuestion(question, callback) {
   const response = await fetch(process.env.VUE_APP_API_URL + "/questions/editQuestion/" + question.id, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(question)
   });

   const data = await response.json();
   callback(data);
}

/**
 * Fetch l'api pour supprimer la question puis appelle le callback
 * @param {Object} question
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function removeQuestion(question, callback) {
   Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez vous supprimer la question #${question.id} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Supprimer cette question",
      cancelButtonText: "Annuler"
   }).then(async (result) => {
      // Si l'utilisateur a confirmé
      if (result.isConfirmed) {

         // On fetch l'API pour supprimer la question
         const response = await fetch(process.env.VUE_APP_API_URL + "/questions/deleteQuestion/" + question.id, {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
         });

         const data = await response.json();
         callback(data);
      }
   })
}