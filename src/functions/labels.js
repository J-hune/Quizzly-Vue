import Swal from "sweetalert2";

export async function editLabel(label, callback) {
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

   const data = await response.json();
   callback(data);
}

export async function deleteLabel(label, toast, deleteCallback) {
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

         // On fetch l'API pour supprimer l'étiquette
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

         if (data.success) {
            deleteCallback();
            toast.success("L'étiquette a été supprimée");
         } else toast.error("L'étiquette n'a pas pu être supprimée, vérifiez qu'elle n'est pas utilisée");
      }
   });
}