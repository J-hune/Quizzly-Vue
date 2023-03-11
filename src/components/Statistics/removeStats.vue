<template>
   <div class="custom-card">

      <!-- Nom de la carte -->
      <h3 class="text-lg mb-3 font-semibold">Supprimer les résultats d'un quiz :</h3>

      <!-- Champ pour l'identifiant du quiz -->
      <input type="text" v-model="quizInput"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Identifiant du quiz (8 caractères alphanumériques)..." maxlength="8" />

      <!-- Bouton pour supprimer les résultats du quiz -->
      <button @click="removeStats"
              class="mt-3 w-full sm:w-fit bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
         Supprimer les résultats du quiz
      </button>
   </div>
</template>

<script>
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

export default {
   name: "removeStats",
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         quizInput: ""
      };
   },
   methods: {
      /**
       * Supprime toutes les réponses fournies par les étudiants pour le quiz spécifié par l'utilisateur.
       * Si l'identifiant du quiz n'est pas au format attendu, affiche un message d'erreur.
       */
      removeStats: function() {

         // On teste si l'id du quiz est bien formaté (8 chiffres)
         if (/^[a-zA-Z0-9]{8}$/.test(this.quizInput.trim())) {
            Swal.fire({
               title: "Confirmer la suppression ?",
               text: `Voulez vous supprimer toutes les réponses fournies par les étudiants à ce quiz ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               confirmButtonText: "Supprimer toutes les réponses",
               cancelButtonText: "Annuler"
            }).then(async (result) => {
               // Si l'utilisateur a confirmé
               if (result.isConfirmed) {

                  //TODO Supprimer les archives du quiz (fetch) et fire
                  console.log(this.quizInput.trim())
               }
            });
         }

         else {
            this.toast.error("L'identifiant du quiz n'est pas valide");
         }
      }
   }
};
</script>

<style scoped>
.custom-card {
   width: 100%;
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 26px 30px;
}

@media (max-width: 640px) {
   .custom-card:not(:first-child) {
      margin-top: 20px;
   }
}
</style>