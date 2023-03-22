<template>
   <!-- Router push back -->
   <redirect-back back="Liste des séquences" />


   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">
      <div class="mb-6">

         <!-- Titre de la page -->
         <div class="flex flex-col w-full mb-10 py-1">
            <h1 class="sm:text-3xl text-2xl font-semibold title-font mb-4 text-gray-900">Créer une Séquence
               Pédagogique</h1>
            <p class="leading-relaxed text-base">Les questions que vous avez déjà créées sont affichées sur la
               gauche.<br>
               Faites les glisser sur la droite pour les ajouter à la séquence.</p>
         </div>


         <!-- Titre du QCM -->
         <h2 class="mb-2 text-xl font-medium text-gray-900">Titre de la Séquence :</h2>
         <input type="text" v-model="title"
                class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Écrivez le titre de la Séquence..."/>
      </div>

      <hr class="mt-7 mb-8"/>

      <draggable-questions :selected-questions="selectedQuestions" :all-questions="allQuestions"/>
   </div>

   <!-- Bouton Impression -->
   <div class="save">
      <button
          class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg right-0 disabled:opacity-40" @click="save"
          :disabled="!title || selectedQuestions.length <= 0">
         Ajouter la Séquence Pédagogique
      </button>
   </div>
</template>

<script>
import DraggableQuestions from "@/components/Questions/draggableQuestions.vue";
import {fetchData} from "@/functions/fetch";
import {addSequence} from "@/functions/sequences";
import {useToast} from "vue-toastification";
import RedirectBack from "@/components/redirectBack.vue";
import router from "@/router";

export default {
   name: "AddSequence",
   components: {RedirectBack, DraggableQuestions},
   setup() {
      const toast = useToast();
      return {toast};
   },
   data() {
      return {
         title: "",
         selectedQuestions: [],
         allQuestions: [],
      };
   },
   methods: {
      /**
       * Ajoute la séquence à l'aide de l'API et affiche un message de succès ou d'erreur en fonction du résultat.
       * @async
       * @returns {Promise<void>}
       */
      save: async function () {
         // On récupère un tableau contenant uniquement les identifiants des questions sélectionnées
         const sequence = this.selectedQuestions.map(e => e.id);

         // On appelle l'api pour ajouter la séquence
         await addSequence({title: this.title, questions: sequence}, (data) => {
            if (data.success) {
               this.toast.success("La séquence a été ajoutée")
               router.push("/sequences");
            } else {
               this.toast.error("La séquence n'a pas pu être ajoutée")
            }
         })
      }
   },
   async created() {
      const {data} = await fetchData("/questions/getQuestions/");
      this.allQuestions = data;
   }
};
</script>

<style scoped>
.save {
   width: 100%;
   display: inline-flex;
   border-top: solid 1px #eaeaea;
}
</style>