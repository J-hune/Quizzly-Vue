<template>
   <div class="quiz-container">
      <button
        class="w-full sm:mr-4 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2.5 px-7 rounded-lg right-0" @click="exportArchives">
         Exporter toutes les archives
      </button>

      <button
        class="w-full sm:ml-4 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2.5 px-7 rounded-lg right-0" @click="removeAllArchives">
         Supprimer toutes les archives
      </button>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import { fetchData } from "@/functions/fetch";
import { useToast } from "vue-toastification";
import XLSX from "xlsx"

export default {
   name: "manageStats",
   emits: ["reFetch"],
   setup() {
      const toast = useToast();
      return { toast };
   },
   methods: {
      exportArchives: async function() {
         const { data } = await fetchData("/statistics/teachers/exportStats");
         if (data.reason) return this.toast.error("Une erreur a eu lieu lors de la récupération des données");

         // On crée un nouveau document
         const workbook = XLSX.utils.book_new();

         // On transforme tous les dictionnaires de tableaux en listes de tableaux

         const diffusions = [...Array(Object.values(data.diffusions)[0].length)].map((_, i) =>
           Object.fromEntries(Object.entries(data.diffusions).map(([k, v]) => [k, v[i]]))
         );

         const questions = [...Array(Object.values(data.questions)[0].length)].map((_, i) =>
           Object.fromEntries(Object.entries(data.questions).map(([k, v]) => [k, v[i]]))
         );

         const answers = [...Array(Object.values(data.reponses)[0].length)].map((_, i) =>
           Object.fromEntries(Object.entries(data.reponses).map(([k, v]) => [k, v[i]]))
         );

         // On ajoute une nouvelle page pour les diffusions
         const diffusionsSheet = XLSX.utils.json_to_sheet(diffusions);
         XLSX.utils.book_append_sheet(workbook, diffusionsSheet, 'Diffusions');

         // On ajoute une nouvelle page pour les questions
         const questionsSheet = XLSX.utils.json_to_sheet(questions);
         XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Questions');

         // On ajoute une nouvelle page pour les réponses
         const reponsesSheet = XLSX.utils.json_to_sheet(answers);
         XLSX.utils.book_append_sheet(workbook, reponsesSheet, 'Réponses');

         // On propose de télécharger le fichier
         XLSX.writeFile(workbook, 'quizzly.xlsx');
      },
      removeAllArchives: function() {
         Swal.fire({
            title: "Confirmer la suppression ?",
            text: `Voulez vous supprimer toutes les archives ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Supprimer ces statistiques",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {

               // On fetch l'API pour supprimer la diffusion
               const { data } = await fetchData("/statistics/teachers/removeAllDiffusions");
               if (data.success) {
                  this.toast.success("Toutes les archives ont été supprimées");
                  this.$emit("reFetch")
               } else {
                  this.toast.error("Une erreur a eu lieu lors de la suppression des archives");
               }
            }
         });
      }
   }
};
</script>

<style scoped>
.quiz-container {
   display: flex;
   padding: 20px !important;
}
</style>